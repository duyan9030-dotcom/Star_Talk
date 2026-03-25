export const api = {
  // 预留接口：获取学习单词列表
  getVocabWords: async (): Promise<any[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { word: 'apple', meaning: '苹果', type: 'n.', example: 'I eat an apple every day.' },
          { word: 'banana', meaning: '香蕉', type: 'n.', example: 'Monkeys love bananas.' },
          { word: 'cat', meaning: '猫', type: 'n.', example: 'The cat is sleeping.' },
        ]);
      }, 500); // 模拟网络延迟
    });
  },

  // 预留接口：获取测验题目
  getQuizQuestions: async (): Promise<any[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { word: 'apple', options: ['香蕉', '苹果', '橘子', '葡萄'], answer: 1 },
          { word: 'dog', options: ['猫', '鸟', '狗', '鱼'], answer: 2 },
          { word: 'book', options: ['书', '笔', '纸', '本子'], answer: 0 },
        ]);
      }, 500);
    });
  },

  // 预留接口：发送AI对话消息
  sendChatMessage: async (message: string, scenario: string): Promise<{ text: string; audioUrl: string | null }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          text: `[模拟后端回复] 针对场景 "${scenario}" 的回复: That's great! Keep practicing your English. 🌟`,
          audioUrl: null // 预留音频URL字段
        });
      }, 1000);
    });
  },

  // 预留接口：获取单词发音音频
  getWordAudio: async (word: string): Promise<string> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // 预留返回真实的音频URL，目前前端仍使用 Web Speech API 作为 fallback
        resolve(`https://api.example.com/audio/${word}.mp3`);
      }, 200);
    });
  }
};
