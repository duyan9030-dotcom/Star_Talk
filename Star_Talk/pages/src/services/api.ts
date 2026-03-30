import request from './request';

export const api = {
  // ==========================================
  // 1. 认证与用户接口 (AuthController)
  // ==========================================
  
  // 微信登录
  wechatLogin: (data: { code: string }) => {
    return request.post('/auth/wechat/login', data);
  },
  
  // 手机号验证码登录
  phoneLogin: (data: { phone: string; smsCode: string }) => {
    return request.post('/auth/phone/login', data);
  },
  
  // 密码登录
  passwordLogin: (data: { phone: string; password: string }) => {
    return request.post('/auth/password/login', data);
  },
  
  // 发送短信验证码 (后端用 @RequestParam 接收，所以用 params 传)
  sendSmsCode: (phone: string) => {
    return request.post('/auth/sendSmsCode', null, { params: { phone } });
  },
  
  // 用户注册 (对应 RegisterRequest)
  register: (data: any) => { 
    return request.post('/auth/register', data);
  },


  // ==========================================
  // 2. 单词学习接口 (WordController)
  // ==========================================
  
  // 获取单词列表 (支持分类和难度筛选)
  getWordList: (category?: string, difficulty?: number) => {
    return request.get('/word/list', { params: { category, difficulty } });
  },
  
  // 获取单个单词详情 (路径参数)
  getWordById: (wordId: number) => {
    return request.get(`/word/${wordId}`);
  },
  
  // 记录单词学习情况 (对应 WordStudyRequest)
  recordStudy: (data: any) => { 
    return request.post('/word/study', data);
  },
  
  // 获取收藏单词列表
  getFavoriteWords: () => {
    return request.get('/word/favorites');
  },
  
  // 添加单词收藏 (路径参数)
  addFavorite: (wordId: number) => {
    return request.post(`/word/favorite/${wordId}`);
  },
  
  // 取消单词收藏 (路径参数)
  removeFavorite: (wordId: number) => {
    return request.delete(`/word/favorite/${wordId}`);
  },
  
  // 获取测验题目 (默认获取 10 题)
  getTestQuestions: (count: number = 10) => {
    return request.get('/word/test/questions', { params: { count } });
  },
  
  // 提交测验答案 (对应 List<WordTestQuestion>)
  submitTest: (answers: any[]) => { 
    return request.post('/word/test/submit', answers);
  },


  // ==========================================
  // 3. AI 场景对话接口 (ConversationController)
  // ==========================================
  
  // 获取对话场景列表
  getSceneList: () => {
    return request.get('/conversation/scenes');
  },
  
  // 获取某个特定的对话会话详情
  getSessionById: (sessionId: number) => {
    return request.get(`/conversation/session/${sessionId}`);
  },
  
  // 获取用户的历史对话会话列表
  getUserSessions: () => {
    return request.get('/conversation/sessions');
  },
  
  // 创建新对话会话 (后端用 @RequestParam 接收，所以用 params 传)
  createSession: (sceneId: number) => {
    return request.post('/conversation/session/create', null, { params: { sceneId } });
  },
  
  // 发送对话消息 (对应 SendMessageRequest)
  sendChatMessage: (data: { sessionId: number; content: string; audioUrl?: string; audioText?: string; speechSpeed?: number }) => { 
    return request.post('/conversation/message/send', data);
  },
  
  // 结束某个对话会话
  endSession: (sessionId: number) => {
    return request.post(`/conversation/session/end/${sessionId}`);
  },
  
  // 获取对话反馈评价
  getFeedback: (sessionId: number) => {
    return request.get(`/conversation/feedback/${sessionId}`);
  },

  // 语音转文本（支持 base64 或 URL）
  speechToText: (data: { audioBase64?: string; audioUrl?: string; mimeType?: string }) => {
    return request.post('/conversation/speech-to-text', data);
  },
  
  // 触发生成对话反馈
  generateFeedback: (sessionId: number) => {
    return request.post(`/conversation/feedback/generate/${sessionId}`);
  },

  // ==========================================
  // 4. 其他辅助接口
  // ==========================================
  
  // 获取单词列表的便捷方法（VocabPages 中调用）
  getVocabWords: (category?: string, difficulty?: number) => {
    return request.get('/word/list', { params: { category, difficulty } });
  },
  
  // 获取单词测验题目的便捷方法
  getQuizQuestions: (count: number = 10) => {
    return request.get('/word/test/questions', { params: { count } });
  },

  // ==========================================
  // 5. 学习记录和错题管理接口
  // ==========================================

  // 保存学习记录（支持多种学习类型）
  saveStudyRecord: (data: {
    wordId?: number;
    type: 'learn' | 'quiz' | 'conversation';
    score?: number;
    duration?: number;
    metadata?: any;
  }) => {
    return request.post('/word/study', data);
  },

  // 批量提交错题
  submitWrongAnswers: (data: Array<{
    wordId: number;
    userAnswer: string;
    correctAnswer: string;
    questionType: string;
  }>) => {
    return request.post('/word/wrong-answers/batch', data);
  },

  // 获取用户的错题列表
  getWrongAnswersList: () => {
    return request.get('/word/wrong-answers');
  },

  // 获取学习统计数据
  getStudyStats: () => {
    return request.get('/user/study-stats');
  },

  // 记录学习进度
  updateProgress: (data: {
    moduleType: string;
    completion: number;
    totalItems?: number;
    completedItems?: number;
  }) => {
    return request.post('/user/progress', data);
  },

  // 获取学习统计
  getProgress: (moduleType?: string) => {
    return request.get('/user/progress', { params: { moduleType } });
  }
};