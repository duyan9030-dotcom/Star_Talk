import axios from 'axios';

// 创建 axios 实例
const request = axios.create({
  // 根据你的 application.yml，后端运行在 8080 端口
  baseURL: 'http://localhost:8080', 
  timeout: 30000,
});

// 请求拦截器：自动携带 JWT Token
request.interceptors.request.use(
  (config) => {
    // 从 localStorage 获取登录后保存的 token
    const token = localStorage.getItem('token'); 
    if (token) {
      // 携带 Token 访问后端接口
      config.headers['Authorization'] = `Bearer ${token}`; 
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器：统一处理后端返回的 Result 结构
request.interceptors.response.use(
  (response) => {
    // 假设后端统一返回 { code, message, data } 格式
    const res = response.data;
    
    console.log("[Response Interceptor] Full response:", res);
    console.log("[Response Interceptor] Response code:", res?.code);
    
    // 处理业务错误
    if (res?.code !== 200 && res?.code !== undefined) {
      console.error("[Response Interceptor] API error:", res);
      return Promise.reject(new Error(res?.message || 'Error'));
    }
    
    // 返回 data 字段，如果没有则返回整个 res
    const dataToReturn = res?.data !== undefined ? res?.data : res;
    console.log("[Response Interceptor] Returning data:", dataToReturn);
    return dataToReturn;
  },
  (error) => {
    // 处理网络错误或服务器错误
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;
      
      if (status === 401) {
        // Token 过期或无效，清除本地 token
        localStorage.removeItem('token');
        localStorage.removeItem('user_phone');
        console.error("Unauthorized: Token expired or invalid");
        return Promise.reject(new Error("认证失败，请重新登录"));
      }
      
      if (status === 403) {
        console.error("Forbidden: No permission");
        return Promise.reject(new Error("禁止访问: 没有权限"));
      }
      
      if (status === 500) {
        console.error("Server error:", data);
        return Promise.reject(new Error(data?.message || "服务器错误，请稍后重试"));
      }
      
      // 其他错误
      return Promise.reject(new Error(data?.message || `请求失败 (${status})`));
    }
    
    return Promise.reject(error);
  }
);

export default request;