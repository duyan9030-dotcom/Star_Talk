import React from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  GraduationCap,
  Sparkles,
  Gamepad2,
  User,
} from "lucide-react";

export const PageWrapper = ({
  title,
  onBack,
  children,
  bg = "bg-white dark:bg-slate-900",
}: {
  title: string;
  onBack: () => void;
  children: React.ReactNode;
  bg?: string;
}) => (
  <motion.div
    initial={{ x: "100%", opacity: 0.8 }}
    animate={{ x: 0, opacity: 1 }}
    exit={{ x: "100%", opacity: 0.8 }}
    transition={{ type: "spring", stiffness: 300, damping: 30 }}
    className={`absolute inset-0 z-50 flex flex-col shadow-[-20px_0_40px_rgba(0,0,0,0.1)] transition-colors duration-300 ${bg}`}
  >
    <div className="pt-12 pb-4 px-4 flex items-center bg-white/90 dark:bg-slate-800/90 backdrop-blur-md sticky top-0 z-20 border-b border-slate-100 dark:border-slate-700 transition-colors">
      <button
        onClick={onBack}
        className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 active:scale-95 transition-transform"
      >
        <ArrowLeft size={24} className="text-slate-700 dark:text-slate-300" />
      </button>
      <h2 className="text-lg font-extrabold text-slate-800 dark:text-slate-100 ml-2">
        {title}
      </h2>
    </div>
    <div className="flex-1 overflow-y-auto hide-scrollbar relative">
      {children}
    </div>
  </motion.div>
);

export const Toggle = ({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) => (
  <div
    onClick={() => onChange(!checked)}
    className={`w-12 h-7 rounded-full p-1 cursor-pointer transition-colors ${checked ? "bg-blue-500" : "bg-slate-200"}`}
  >
    <div
      className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${checked ? "translate-x-5" : "translate-x-0"}`}
    />
  </div>
);

export const BottomNav = ({
  activeTab,
  setActiveTab,
}: {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}) => {
  const tabs = [
    { id: "learn", label: "学习", icon: <GraduationCap size={24} /> },
    { id: "ai", label: "AI对话", icon: <Sparkles size={24} /> },
    { id: "test", label: "测验", icon: <Gamepad2 size={24} /> },
    { id: "mine", label: "我的", icon: <User size={24} /> },
  ];

  return (
    <div className="fixed bottom-0 w-full max-w-md bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-t border-slate-100 dark:border-slate-800 pb-safe pt-3 px-6 flex justify-between items-center z-50 rounded-t-[2rem] shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.08)] transition-colors duration-300">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="flex flex-col items-center justify-center w-16 h-14 relative group"
          >
            <div className="relative flex items-center justify-center w-12 h-12">
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    layoutId="nav-bubble"
                    className="absolute inset-0 bg-blue-100 dark:bg-blue-900/40 rounded-2xl"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  />
                )}
              </AnimatePresence>
              <motion.div
                animate={{
                  scale: isActive ? 1.1 : 1,
                  color: isActive ? "#3b82f6" : "#94a3b8",
                  y: isActive ? -2 : 0,
                }}
                className="relative z-10"
              >
                {tab.icon}
              </motion.div>
            </div>
            <span
              className={`text-[10px] font-bold mt-1 transition-colors ${isActive ? "text-blue-600 dark:text-blue-400" : "text-slate-400 dark:text-slate-500"}`}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};
