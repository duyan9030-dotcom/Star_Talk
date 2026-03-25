import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronRight, Mic, Send, Loader2 } from "lucide-react";
import { PageWrapper } from "../components/Common";
import { api } from "../services/api";

export const AIHistoryPage = ({
  onBack,
  navigate,
  key,
}: {
  onBack: () => void;
  navigate: (route: string, params?: any) => void;
  key?: string;
}) => {
  const history = [
    {
      id: 1,
      title: "快餐店点餐",
      date: "今天 14:30",
      duration: "5 分钟",
      color: "blue",
      icon: "🍔",
    },
    {
      id: 2,
      title: "学校交友",
      date: "昨天 10:15",
      duration: "12 分钟",
      color: "emerald",
      icon: "🏫",
    },
    {
      id: 3,
      title: "周末看电影",
      date: "3月20日",
      duration: "8 分钟",
      color: "purple",
      icon: "🎬",
    },
  ];

  const scenarioThemes: Record<string, string> = {
    blue: "bg-blue-50 dark:bg-blue-900/30 text-blue-500",
    emerald: "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-500",
    purple: "bg-purple-50 dark:bg-purple-900/30 text-purple-500",
  };

  return (
    <PageWrapper title="对话历史" onBack={onBack}>
      <div className="p-6 space-y-4">
        {history.map((item) => (
          <div
            key={item.id}
            onClick={() =>
              navigate("chat", { title: item.title, color: item.color })
            }
            className="bg-white dark:bg-slate-800 rounded-[1.5rem] p-4 flex items-center gap-4 shadow-sm border border-slate-100 dark:border-slate-700 cursor-pointer active:scale-95 transition-all"
          >
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${scenarioThemes[item.color]}`}
            >
              {item.icon}
            </div>
            <div className="flex-1">
              <h4 className="font-extrabold text-slate-800 dark:text-slate-100 text-lg">
                {item.title}
              </h4>
              <div className="flex items-center gap-3 mt-1 text-xs font-bold text-slate-400 dark:text-slate-500">
                <span>{item.date}</span>
                <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                <span>{item.duration}</span>
              </div>
            </div>
            <ChevronRight
              size={20}
              className="text-slate-300 dark:text-slate-600"
            />
          </div>
        ))}
      </div>
    </PageWrapper>
  );
};

export const ChatPage = ({
  params,
  onBack,
  key,
}: {
  params: any;
  onBack: () => void;
  key?: string;
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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleVoiceInput = () => {
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      setInput("I want a hamburger please.");
    }, 2500);
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setMessages((prev) => [...prev, { id: Date.now(), role: "user", text: userMsg }]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await api.sendChatMessage(userMsg, params?.title || "Chat");
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          role: "ai",
          text: response.text,
        },
      ]);
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsTyping(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <PageWrapper title={params.title || "AI 对话"} onBack={onBack}>
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
          <div className="flex items-center gap-2">
            <button
              onClick={handleVoiceInput}
              className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 flex items-center justify-center active:scale-95 transition-transform"
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
