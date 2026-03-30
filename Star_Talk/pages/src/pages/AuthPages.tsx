import React, { useState } from "react";
import {
  MessageCircle,
  CheckCircle2,
  Smartphone,
  ShieldCheck,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { PageWrapper } from "../components/Common";
import { api } from "../services/api";

export const WeChatLoginPage = ({
  onBack,
  key,
}: {
  onBack: () => void;
  key?: string;
}) => (
  <PageWrapper
    title="微信授权登录"
    onBack={onBack}
    bg="bg-white dark:bg-slate-900"
  >
    <div className="flex flex-col items-center pt-20 px-8 h-full">
      <div className="w-20 h-20 bg-[#05C160] rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/20 mb-6">
        <MessageCircle size={48} className="text-white" fill="currentColor" />
      </div>
      <h2 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 mb-2">
        Star Talk
      </h2>
      <p className="text-slate-500 dark:text-slate-400 font-medium mb-12">
        申请获取以下权限
      </p>

      <div className="w-full bg-slate-50 dark:bg-slate-800 rounded-2xl p-6 mb-12 border border-slate-100 dark:border-slate-700 transition-colors">
        <div className="flex items-center gap-3 text-slate-700 dark:text-slate-200 font-bold">
          <CheckCircle2 size={20} className="text-[#05C160]" />
          获得你的公开信息（昵称、头像等）
        </div>
      </div>

      <button className="w-full bg-[#05C160] text-white font-extrabold py-4 rounded-[1.5rem] shadow-lg shadow-green-500/20 border-b-[6px] border-[#049A4D] active:border-b-2 active:translate-y-1 transition-all">
        同意授权
      </button>
      <button
        onClick={onBack}
        className="w-full mt-4 text-slate-400 dark:text-slate-500 font-bold py-4 active:scale-95 transition-transform"
      >
        拒绝
      </button>
    </div>
  </PageWrapper>
);

export const PhoneLoginPage = ({
  onBack,
  onLogin,
  key,
}: {
  onBack: () => void;
  onLogin: () => void;
  key?: string;
}) => {
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const handleSendCode = async () => {
    if (!phone || phone.length !== 11) {
      setError("请输入有效的11位手机号");
      return;
    }
    
    try {
      setLoading(true);
      setError("");
      // 由于后端接口还没准备好，生成一个测试验证码
      const mockCode = Math.floor(100000 + Math.random() * 900000).toString();
      
      // 存储到 localStorage 便于测试
      localStorage.setItem(`sms_code_${phone}`, mockCode);
      
      // 模拟发送延迟
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setCodeSent(true);
      setCountdown(60);
      
      // 显示验证码（仅限开发环境）
      alert(`测试验证码: ${mockCode}\n(生产环境将通过短信发送)`);
      
      // 倒计时逻辑
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err: any) {
      setError(err.message || "发送验证码失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!phone || !code) {
      setError("请输入手机号和验证码");
      return;
    }

    try {
      setLoading(true);
      setError("");
      
      // 调用真实的后端登录接口
      const response = await api.phoneLogin({ phone, smsCode: code });
      
      // 从响应中提取 token 和用户信息
      if (response && response.token) {
        // 保存 token 到 localStorage
        localStorage.setItem('token', response.token);
        localStorage.setItem('user_phone', phone);
        
        // 如果返回了用户信息，也可以保存
        if (response.user) {
          localStorage.setItem('user_info', JSON.stringify(response.user));
        }
        
        onLogin();
      } else {
        setError("登录响应异常，未获取到 token");
      }
    } catch (err: any) {
      setError(err.message || "登录失败，请检查手机号和验证码");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper
      title="手机号登录"
      onBack={onBack}
      bg="bg-white dark:bg-slate-900"
    >
      <div className="px-8 pt-12 h-full flex flex-col">
        <h2 className="text-3xl font-black text-slate-800 dark:text-slate-100 mb-2">
          欢迎回来
        </h2>
        <p className="text-slate-500 dark:text-slate-400 font-medium mb-10">
          未注册的手机号验证后自动创建账号
        </p>

        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl p-3 flex items-start gap-3">
            <AlertCircle size={18} className="text-red-500 mt-0.5 flex-shrink-0" />
            <p className="text-sm font-bold text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        <div className="space-y-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Smartphone size={20} className="text-slate-400" />
            </div>
            <input
              type="tel"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                setError("");
              }}
              placeholder="请输入手机号"
              className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl py-4 pl-12 pr-4 font-bold text-slate-700 dark:text-slate-200 outline-none focus:border-blue-400 dark:focus:border-blue-500 transition-colors"
            />
          </div>

          <div className="relative flex gap-3">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <ShieldCheck size={20} className="text-slate-400" />
              </div>
              <input
                type="text"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                  setError("");
                }}
                placeholder="验证码"
                disabled={!codeSent}
                className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl py-4 pl-12 pr-4 font-bold text-slate-700 dark:text-slate-200 outline-none focus:border-blue-400 dark:focus:border-blue-500 transition-colors disabled:opacity-50"
              />
            </div>
            <button
              onClick={handleSendCode}
              disabled={loading || countdown > 0}
              className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold px-6 rounded-2xl active:scale-95 transition-transform whitespace-nowrap disabled:opacity-50"
            >
              {loading && <Loader2 size={16} className="inline animate-spin mr-1" />}
              {countdown > 0 ? `${countdown}s` : "获取验证码"}
            </button>
          </div>
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full mt-10 bg-blue-500 text-white font-extrabold py-4 rounded-[1.5rem] shadow-lg shadow-blue-500/20 border-b-[6px] border-blue-600 active:border-b-2 active:translate-y-1 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading && <Loader2 size={18} className="animate-spin" />}
          {loading ? "登录中..." : "登录 / 注册"}
        </button>
      </div>
    </PageWrapper>
  );
};
