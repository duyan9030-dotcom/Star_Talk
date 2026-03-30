import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronRight, Mic, Send, Loader2, Trash2 } from "lucide-react";
import { PageWrapper } from "../components/Common";
import { api } from "../services/api";

const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        const base64 = reader.result.split(",")[1] || "";
        resolve(base64);
      } else {
        reject(new Error("无法读取音频数据"));
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(blob);
  });
};

export const AIHistoryPage = ({
  onBack,
  navigate,
  pageKey,
}: {
  onBack: () => void;
  navigate: (route: string, params?: any) => void;
  pageKey?: string;
}) => {
  const [sessionHistory, setSessionHistory] = useState<any[]>([]);

  useEffect(() => {
    // 从 localStorage 读取保存的对话历史
    const saved = localStorage.getItem("ai_chat_history");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSessionHistory(parsed);
      } catch (err) {
        console.error("Failed to parse chat history:", err);
      }
    }
  }, []);

  const scenarioThemes: Record<string, string> = {
    blue: "bg-blue-50 dark:bg-blue-900/30 text-blue-500",
    emerald: "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-500",
    purple: "bg-purple-50 dark:bg-purple-900/30 text-purple-500",
  };

  const handleDeleteSession = (sessionId: string) => {
    setSessionHistory((prev) => prev.filter((item) => item.sessionId !== sessionId));
  };

  return (
    <PageWrapper title="对话历史" onBack={onBack}>
      <div className="p-6 space-y-4">
        {sessionHistory.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-400 dark:text-slate-500 font-medium">暂无对话历史</p>
          </div>
        ) : (
          sessionHistory.map((item) => (
            <div
              key={item.sessionId}
              className="bg-white dark:bg-slate-800 rounded-[1.5rem] p-4 flex items-center gap-4 shadow-sm border border-slate-100 dark:border-slate-700 cursor-pointer active:scale-95 transition-all group"
            >
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 ${scenarioThemes[item.color] || scenarioThemes.blue}`}
              >
                {item.icon}
              </div>
              <div
                className="flex-1"
                onClick={() =>
                  navigate("chat", {
                    title: item.title,
                    sceneId: item.sceneId,
                    color: item.color,
                    sessionId: item.sessionId,
                  })
                }
              >
                <h4 className="font-extrabold text-slate-800 dark:text-slate-100 text-lg">
                  {item.title}
                </h4>
                <div className="flex items-center gap-3 mt-1 text-xs font-bold text-slate-400 dark:text-slate-500">
                  <span>{item.date}</span>
                  <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                  <span>{item.messageCount} 条消息</span>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteSession(item.sessionId);
                }}
                className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-all"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))
        )}
      </div>
    </PageWrapper>
  );
};

export const ChatPage = ({
  params,
  onBack,
  pageKey,
}: {
  params: any;
  onBack: () => void;
  pageKey?: string;
}) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "ai",
      text: `Hello! Welcome to the ${params?.title || "Chat"}. How can I help you today?`,
    },
  ]);
  const [input, setInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [localSessionId, setLocalSessionId] = useState<string>("");
  const [startTime, setStartTime] = useState<Date>(new Date());
  const [recognizedAudioText, setRecognizedAudioText] = useState("");
  const [aiAudioUrl, setAiAudioUrl] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isCleaningUp = useRef(false); // 防止重复清理

  // 初始化会话
  useEffect(() => {
    const initSession = async () => {
      try {
        // 重置清理标志
        isCleaningUp.current = false;
        
        const sceneId = params?.sceneId || 1;
        const token = localStorage.getItem('token');
        
        console.log("[InitSession] Starting initialization with sceneId:", sceneId);
        
        // 如果没有 token，使用模拟会话 ID
        if (!token) {
          console.warn("No token found, using mock session ID");
          const mockSessionId = Math.floor(Math.random() * 100000) + 1;
          setSessionId(mockSessionId);
          setLocalSessionId(`session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
          setStartTime(new Date());
          return;
        }
        
        try {
          // 步骤1：获取用户所有会话，结束任何进行中的会话
          console.log("[InitSession] Fetching user sessions...");
          try {
            const userSessionsResponse: any = await api.getUserSessions();
            // 处理不同的响应格式
            let userSessions = userSessionsResponse?.data || userSessionsResponse || [];
            if (!Array.isArray(userSessions)) {
              userSessions = [];
            }
            console.log("[InitSession] User sessions:", userSessions);
            
            // 结束所有进行中的会话
            if (Array.isArray(userSessions) && userSessions.length > 0) {
              for (const session of userSessions) {
                // 检查会话状态，结束进行中的会话
                if (session.status === 1 || session.status === 'active' || session.active === true) {
                  console.log("[InitSession] Ending active session:", session.id);
                  try {
                    await api.endSession(session.id);
                    console.log("[InitSession] Session ended:", session.id);
                    // 添加延迟，确保后端处理完毕
                    await new Promise(resolve => setTimeout(resolve, 100));
                  } catch (e) {
                    console.log("[InitSession] Failed to end session:", session.id, e);
                  }
                }
              }
            }
          } catch (e) {
            console.log("[InitSession] No existing sessions found or unable to fetch:", e);
          }
          
          // 步骤2：创建新会话
          console.log("[InitSession] Creating new session with sceneId:", sceneId);
          const newSessionResponse: any = await api.createSession(sceneId);
          const newSession = newSessionResponse?.data || newSessionResponse;
          console.log("[InitSession] Raw response:", newSession);
          console.log("[InitSession] Response type:", typeof newSession);
          console.log("[InitSession] Response keys:", newSession ? Object.keys(newSession) : 'undefined');
          
          // 尝试多种方式获取 sessionId
          let sessionIdValue = newSession?.id || 
                               newSession?.sessionId || 
                               newSession?.data?.id ||
                               newSession?.data?.sessionId ||
                               (typeof newSession === 'number' ? newSession : null);
          
          console.log("[InitSession] Extracted sessionId (raw):", sessionIdValue, "type:", typeof sessionIdValue);
          
          if (!sessionIdValue) {
            throw new Error("Failed to extract sessionId from response");
          }
          
          // 确保 sessionId 是数字类型
          const numSessionId = Number(sessionIdValue);
          if (isNaN(numSessionId)) {
            throw new Error(`Invalid sessionId: ${sessionIdValue}`);
          }
          
          console.log("[InitSession] Final sessionId:", numSessionId);
          setSessionId(numSessionId);
        } catch (apiError: any) {
          // 如果 API 调用失败，显示错误
          console.error("[InitSession] Failed to create session:", apiError?.message);
          // 显示用户可以理解的错误消息
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now(),
              role: "ai",
              text: `抱歉，无法创建对话会话：${apiError?.message || "服务器错误"}。请稍后重试。`,
            },
          ]);
          setSessionId(null);
        }
        
        // 生成本地唯一ID用于保存历史
        const localId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        setLocalSessionId(localId);
        setStartTime(new Date());
      } catch (error) {
        console.error("Failed to initialize session:", error);
      }
    };
    
    initSession();
    // 只依赖 params 中的 sceneId，不依赖状态
  }, [params?.sceneId]);

  // 保存对话历史到 localStorage
  const saveChat = (chatMessages: any[]) => {
    try {
      const endTime = new Date();
      const durationMs = endTime.getTime() - startTime.getTime();
      const durationMins = Math.ceil(durationMs / 60000);

      const chatSession = {
        sessionId: localSessionId,
        title: params?.title || "AI 对话",
        sceneId: params?.sceneId || 1,
        color: params?.color || "blue",
        icon: params?.icon || "💬",
        date: endTime.toLocaleString("zh-CN"),
        messageCount: chatMessages.length,
        messages: chatMessages,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
      };

      const existingHistory = localStorage.getItem("ai_chat_history");
      const history = existingHistory ? JSON.parse(existingHistory) : [];
      
      // 移除相同sessionId的旧记录
      const filtered = history.filter((item: any) => item.sessionId !== localSessionId);
      filtered.unshift(chatSession);
      
      localStorage.setItem("ai_chat_history", JSON.stringify(filtered.slice(0, 50))); // 最多保留50条
    } catch (err) {
      console.error("Failed to save chat history:", err);
    }
  };

  const stopRecording = () => {
    // 停止 Web Speech API 的识别
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition && (window as any).recognitionInstance) {
      (window as any).recognitionInstance.abort();
    }
    setIsRecording(false);
    console.log('🛑 语音识别已停止');
  };

  const handleVoiceInput = async () => {
    // 使用 Web Speech API 进行实时语音识别
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      alert('浏览器不支持语音识别，请使用 Chrome、Edge 或 Safari');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      
      // 保存实例，以便 stopRecording 可以访问
      (window as any).recognitionInstance = recognition;
      
      // 配置语音识别参数
      recognition.lang = 'en-US'; // 识别英文
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      // 开始录音时的回调
      recognition.onstart = () => {
        setIsRecording(true);
        console.log('🎤 开始语音识别...');
      };

      // 识别结果回调
      recognition.onresult = (event: any) => {
        let transcript = '';
        
        // 获取最终的识别结果
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            transcript += event.results[i][0].transcript;
          }
        }
        
        if (transcript) {
          console.log('✅ 识别文本:', transcript);
          setRecognizedAudioText(transcript);
          setInput(transcript);
        }
        setIsRecording(false);
      };

      // 错误处理
      recognition.onerror = (event: any) => {
        console.error('❌ 语音识别错误:', event.error);
        const errorMessages: Record<string, string> = {
          'network': '网络错误，请检查网络连接',
          'no-speech': '没有检测到语音，请重试',
          'audio-capture': '无法访问麦克风',
          'not-allowed': '您拒绝了麦克风访问权限',
        };
        alert(`语音识别失败: ${errorMessages[event.error] || event.error}`);
        setIsRecording(false);
      };

      // 识别结束
      recognition.onend = () => {
        setIsRecording(false);
        console.log('🏁 语音识别结束');
      };

      // 启动识别
      recognition.start();
      setIsTyping(false);

    } catch (err) {
      console.error('启动语音识别失败:', err);
      setIsRecording(false);
    }
  };

  const playTextWithEdgeTts = async (text: string) => {
    if (!text || !text.trim()) {
      return;
    }

    try {
      // 1) 先尝试动态加载 @edgeai/edgetts（如果安装了）
      const moduleLoader = async () => {
        try {
          const fn = new Function("p", "return import(p);");
          return await fn("@edgeai/edgetts");
        } catch (e) {
          console.warn("Dynamic import @edgeai/edgetts failed:", e);
          return null;
        }
      };

      const module = await moduleLoader();
      if (module) {
        const EdgeTts = module.default || module;
        if (EdgeTts && typeof EdgeTts === "function") {
          const edgeTts = new EdgeTts();
          if (typeof edgeTts.speak === "function") {
            const generatedUrl = await edgeTts.speak(text, { voice: "alloy", format: "mp3" });
            if (generatedUrl) {
              const audio = new Audio(generatedUrl);
              audioRef.current = audio;
              audio.onended = () => setIsPlaying(false);
              setIsPlaying(true);
              await audio.play();
              return;
            }
          }
        }
      }
    } catch (e) {
      console.warn("EdgeTTS to play text failed:", e);
    }

    // 2) 继续尝试后端返回 audioUrl 或直接合成语音
    if ("speechSynthesis" in window) {
      const getReadyVoices = async () => {
        let voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
          return voices;
        }

        return new Promise<SpeechSynthesisVoice[]>((resolve) => {
          const onVoicesChanged = () => {
            const vs = window.speechSynthesis.getVoices();
            if (vs.length > 0) {
              window.speechSynthesis.removeEventListener("voiceschanged", onVoicesChanged);
              resolve(vs);
            }
          };

          window.speechSynthesis.addEventListener("voiceschanged", onVoicesChanged);

          setTimeout(() => {
            const vs = window.speechSynthesis.getVoices();
            window.speechSynthesis.removeEventListener("voiceschanged", onVoicesChanged);
            resolve(vs);
          }, 3000);
        });
      };

      const voices = await getReadyVoices();
      console.debug("speechSynthesis voices:", voices);
      const utterance = new SpeechSynthesisUtterance(text);
      const isChinese = /[\u4e00-\u9fff]/.test(text);
      utterance.lang = isChinese ? "zh-CN" : "en-US";

      if (!voices || voices.length === 0) {
        console.warn("当前浏览器SpeechSynthesis没有可用voices，可能导致无声音。请检查浏览器设置或切换浏览器/系统声卡。");
      }

      if (voices && voices.length > 0) {
        const selectedVoice = voices.find((v) =>
          isChinese
            ? /chinese|zh-CN|yue|mandarin/i.test(v.name) || /zh/.test(v.lang)
            : /english|en-US|en-GB/i.test(v.name) || /en/.test(v.lang)
        );
        if (selectedVoice) {
          utterance.voice = selectedVoice;
        }
      }

      utterance.volume = 1;
      utterance.rate = 0.7;
      utterance.pitch = 1;

      utterance.onstart = () => {
        console.debug("speechSynthesis started", { text, lang: utterance.lang, voice: utterance.voice?.name });
      };
      utterance.onend = () => {
        console.debug("speechSynthesis ended", text);
        setIsPlaying(false);
      };
      utterance.onerror = (event) => {
        console.error("speechSynthesis error", event, { text, lang: utterance.lang });
        setIsPlaying(false);
      };

      if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
        window.speechSynthesis.cancel();
      }

      setIsPlaying(true);
      window.speechSynthesis.speak(utterance);
      return;
    }

    console.warn("无法播放语音：浏览器不支持 speechSynthesis");
  };

  const playAiAudio = async (aiText: string, audioUrl?: string) => {
    if (audioUrl && audioUrl.indexOf('tts.example.com/mock') !== -1) {
      // 伪 URL 不要直接播放，降级为 edgetts/speechSynthesis
      audioUrl = undefined;
    }

    try {
      if (audioRef.current) {
        if (!audioRef.current.paused) {
          audioRef.current.pause();
        }
        audioRef.current = null;
      }

      if (audioUrl) {
        setAiAudioUrl(audioUrl);
        const newAudio = new Audio(audioUrl);
        audioRef.current = newAudio;
        newAudio.onended = () => setIsPlaying(false);
        setIsPlaying(true);
        await newAudio.play();
      } else {
        await playTextWithEdgeTts(aiText);
      }
    } catch (e) {
      console.warn("playAiAudio: audioUrl 播放失败，采用本地TTS/edgetts", e);
      setIsPlaying(false);
      await playTextWithEdgeTts(aiText);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) {
      console.warn("Input is empty");
      return;
    }
    
    if (!sessionId || sessionId <= 0) {
      console.error("Invalid sessionId:", sessionId);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          role: "ai",
          text: "抱歉，对话会话初始化失败。请重新进入对话。",
        },
      ]);
      return;
    }

    const userMsg = input;
    const newMessages = [...messages, { id: Date.now(), role: "user", text: userMsg }];
    setMessages(newMessages);
    setInput("");
    setIsTyping(true);

    try {
      let aiResponse = "";
      let aiResponseAudioUrl: string | undefined;
      const token = localStorage.getItem('token');
      
      // 如果有 token 并且后端可用，尝试调用 API
      if (token) {
        try {
          const response: any = await api.sendChatMessage({
            sessionId: sessionId,
            content: userMsg,
            audioText: recognizedAudioText || undefined,
          });
          console.log("Full API response:", response);
          console.log("Response type:", typeof response);
          console.log("Response keys:", Object.keys(response || {}));
          
          // 处理响应：后端通常返回 Result 包装的数据
          let responseData = response?.data || response;
          aiResponseAudioUrl = responseData?.audioUrl || responseData?.data?.audioUrl;

          // 避免默认 mock 播放地址导致客户端加载失败
          if (aiResponseAudioUrl && aiResponseAudioUrl.indexOf('tts.example.com/mock') !== -1) {
            console.warn('忽略 mock tts URL，使用本地 TTS/edgetts 复合方案');
            aiResponseAudioUrl = undefined;
          }

          if (typeof responseData === 'string') {
            aiResponse = responseData;
          } else if (responseData && typeof responseData === 'object') {
            // 尝试常见的字段名
            aiResponse = 
              responseData.content || 
              responseData.message || 
              responseData.text || 
              responseData.reply ||
              responseData.answer ||
              responseData.audioText ||
              JSON.stringify(responseData);
          }
          
          console.log("Extracted aiResponse:", aiResponse);
          console.log("AI audio URL:", aiResponseAudioUrl);
        } catch (apiError: any) {
          console.error("[SendChatMessage] API Error:", apiError);
          console.error("[SendChatMessage] Error message:", apiError?.message);
          console.error("[SendChatMessage] Error response:", apiError?.response?.data);
          
          // 不回退到模拟回复，直接显示真实错误给用户
          const errorMsg = apiError?.message || apiError?.response?.data?.message || "API调用失败";
          aiResponse = `抱歉，服务器处理出错：${errorMsg}`;
        }
      } else {
        console.warn("No token found, using mock response");
      }
      
      // 即使没有从 API 获取到回复，也不再使用模拟回复，而是显示错误
      if (!aiResponse) {
        aiResponse = "抱歉，无法获取回复。请检查服务器状态。";
      }
      
      const aiMessage = {
        id: Date.now() + 1,
        role: "ai",
        text: String(aiResponse || "Sorry, I couldn't generate a response."),
      };
      
      const updatedMessages = [...newMessages, aiMessage];
      setMessages(updatedMessages);
      
      // 播放AI语音
      await playAiAudio(aiMessage.text, aiResponseAudioUrl);
      
      // 保存每次对话
      saveChat(updatedMessages);
    } catch (error) {
      console.error("Unexpected error in handleSend:", error);
      const errorMessage = {
        id: Date.now() + 1,
        role: "ai",
        text: "抱歉，出现了意外错误。请稍后重试。",
      };
      const updatedMessages = [...newMessages, errorMessage];
      setMessages(updatedMessages);
      saveChat(updatedMessages);
    } finally {
      setIsTyping(false);
    }
  };

  // 结束会话的通用方法
  const endSession = useCallback(async (sessionIdToEnd: number | null) => {
    const token = localStorage.getItem('token');
    const idToEnd = sessionIdToEnd || sessionId;
    
    if (token && idToEnd && idToEnd > 0) {
      console.log("[EndSession] Ending session:", idToEnd);
      try {
        await api.endSession(idToEnd);
        console.log("[EndSession] Session ended successfully");
      } catch (error) {
        console.error("[EndSession] Failed to end session:", error);
      }
    }
  }, [sessionId]);

  // 退出对话时主动结束会话
  const handleBackClick = useCallback(async () => {
    try {
      // 保存最后的消息
      if (messages.length > 1) {
        saveChat(messages);
      }
      
      // 确保结束会话
      if (sessionId && sessionId > 0) {
        try {
          const token = localStorage.getItem('token');
          if (token) {
            console.log("[HandleBack] Ending session:", sessionId);
            await api.endSession(sessionId);
            console.log("[HandleBack] Session ended successfully");
            // 添加延迟确保后端处理完毕
            await new Promise(resolve => setTimeout(resolve, 200));
          }
        } catch (error) {
          console.error("[HandleBack] Failed to end session:", error);
        }
      }
    } catch (error) {
      console.error("[HandleBack] Error during cleanup:", error);
    } finally {
      // 清除缓存和状态
      sessionStorage.removeItem('currentSessionId');
      isCleaningUp.current = false;
      setSessionId(null);
      // 返回上一页
      onBack();
    }
  }, [messages, sessionId, onBack]);

  // 组件卸载时结束会话
  useEffect(() => {
    return () => {
      if (sessionId && sessionId > 0 && !isCleaningUp.current) {
        console.log("[Unmount] Component unmounting, ending session:", sessionId);
        isCleaningUp.current = true;
        // 使用 axios api 而不是 navigator.sendBeacon，确保使用正确的 baseURL
        const token = localStorage.getItem('token');
        if (token) {
          try {
            api.endSession(sessionId).catch((error) => {
              console.error("[Unmount] Failed to end session:", error);
            });
          } catch (error) {
            console.error("[Unmount] Failed to call endSession:", error);
          }
        }
      }
      // 重置状态
      isCleaningUp.current = false;
    };
  }, []);

  // 页面隐藏时也要结束会话（防止用户切换tab不结束）
  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (document.hidden && sessionId && sessionId > 0 && !isCleaningUp.current) {
        console.log("[PageHidden] Page hidden, ending session:", sessionId);
        isCleaningUp.current = true;
        try {
          const token = localStorage.getItem('token');
          if (token) {
            await api.endSession(sessionId);
            console.log("[PageHidden] Session ended successfully");
          }
        } catch (error) {
          console.error("[PageHidden] Failed to end session:", error);
        } finally {
          isCleaningUp.current = false;
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [sessionId]);

  // 保存 sessionId 到 sessionStorage
  useEffect(() => {
    if (sessionId && sessionId > 0) {
      sessionStorage.setItem('currentSessionId', String(sessionId));
      console.log("[SessionId] Saved to sessionStorage:", sessionId);
    }
  }, [sessionId]);

  // 监听浏览器关闭或页面刷新
  useEffect(() => {
    const handleBeforeUnload = async (e: BeforeUnloadEvent) => {
      if (sessionId && sessionId > 0) {
        console.log("[BeforeUnload] User leaving page, ending session:", sessionId);
        // 使用 axios api 而不是 navigator.sendBeacon
        const token = localStorage.getItem('token');
        if (token) {
          try {
            api.endSession(sessionId).catch((error) => {
              console.error("[BeforeUnload] Failed to end session:", error);
            });
          } catch (error) {
            console.error("[BeforeUnload] Failed to call endSession:", error);
          }
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [sessionId]);

  // 处理消息滚动

  return (
    <PageWrapper title={params.title || "AI 对话"} onBack={handleBackClick}>
      <div className="flex flex-col h-full bg-white dark:bg-slate-900 transition-colors">
        <div className="flex-1 p-4 space-y-4 overflow-y-auto hide-scrollbar">
          {messages.map((msg) => (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              key={msg.id}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] p-4 rounded-[1.5rem] shadow-sm ${msg.role === "user" ? "bg-blue-500 text-white rounded-br-sm" : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-bl-sm border border-slate-100 dark:border-slate-700"}`}
              >
                <p className="font-medium leading-relaxed">{msg.text}</p>
              </div>
            </motion.div>
          ))}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="flex justify-start"
            >
              <div className="max-w-[80%] p-4 rounded-[1.5rem] shadow-sm bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-bl-sm border border-slate-100 dark:border-slate-700 flex items-center gap-2">
                <Loader2 size={16} className="animate-spin text-blue-500" />
                <span className="text-sm font-medium text-slate-400">AI 正在思考...</span>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700 pb-safe transition-colors">
          {recognizedAudioText ? (
            <div className="mb-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-sm text-emerald-700 dark:text-emerald-300">
              语音识别结果：<span className="font-bold">{recognizedAudioText}</span>
            </div>
          ) : null}
          {aiAudioUrl ? (
            <div className="mb-3 flex items-center gap-2">
              <button
                onClick={() => {
                  if (audioRef.current) {
                    if (audioRef.current.paused) {
                      audioRef.current.play();
                      setIsPlaying(true);
                    } else {
                      audioRef.current.pause();
                      setIsPlaying(false);
                    }
                  }
                }}
                className="px-3 py-1 rounded-full bg-blue-500 text-white text-xs"
              >
                {isPlaying ? "暂停语音" : "播放语音"}
              </button>
              <span className="text-xs text-slate-500 dark:text-slate-400">AI 语音来源: {aiAudioUrl.slice(0, 44)}...</span>
            </div>
          ) : null}

          <div className="flex items-center gap-2">
            <button
              onClick={isRecording ? stopRecording : handleVoiceInput}
              className={`w-12 h-12 rounded-full ${isRecording ? "bg-red-100 dark:bg-red-900/30 text-red-500" : "bg-slate-100 dark:bg-slate-700 text-slate-500"} flex items-center justify-center active:scale-95 transition-transform`}
            >
              <Mic size={24} />
            </button>
            <div className="flex-1 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center px-4 h-12 border border-slate-200 dark:border-slate-600 focus-within:border-blue-400 transition-colors">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Type a message..."
                className="flex-1 bg-transparent outline-none font-medium text-slate-700 dark:text-slate-200"
              />
            </div>
            <button
              onClick={handleSend}
              className={`w-12 h-12 rounded-full flex items-center justify-center active:scale-95 transition-all ${input.trim() ? "bg-blue-500 text-white shadow-md" : "bg-slate-100 dark:bg-slate-700 text-slate-400"}`}
            >
              <Send size={20} className={input.trim() ? "ml-1" : ""} />
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isRecording && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="absolute inset-x-0 bottom-0 h-64 bg-white dark:bg-slate-800 rounded-t-[2.5rem] shadow-[0_-20px_40px_rgba(0,0,0,0.1)] z-50 flex flex-col items-center justify-center border-t border-slate-100 dark:border-slate-700 transition-colors"
            >
              <div className="w-24 h-24 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-6 relative">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                  <Mic size={32} className="text-white" />
                </div>
              </div>
              <p className="text-blue-600 dark:text-blue-400 font-extrabold text-lg animate-pulse">
                正在聆听宝宝说话...
              </p>
              <button
                onClick={() => setIsRecording(false)}
                className="mt-6 text-slate-400 font-bold active:scale-95"
              >
                取消
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageWrapper>
  );
};
