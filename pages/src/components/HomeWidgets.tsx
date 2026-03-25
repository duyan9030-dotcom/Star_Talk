import React from "react";
import { motion } from "motion/react";
import { Flame, Star, Trophy, Crown, ChevronRight, Medal } from "lucide-react";

export const Header = ({ userProfile }: { userProfile: any }) => (
  <div className="relative pt-12 pb-12 px-6 bg-gradient-to-br from-indigo-400 to-purple-500 dark:from-indigo-900 dark:to-purple-900 rounded-b-[2.5rem] shadow-lg overflow-hidden transition-colors duration-300">
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
      <div className="absolute top-[-10%] left-[-10%] w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
    </div>
    <div className="flex justify-between items-center relative z-10">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border-2 border-white/40 shadow-inner">
          <span className="text-2xl">👦</span>
        </div>
        <div>
          <h1 className="text-white font-extrabold text-2xl tracking-wide">
            Hi, {userProfile.nickname}!
          </h1>
          <p className="text-indigo-100 dark:text-indigo-200 text-sm font-medium flex items-center gap-1 mt-1">
            <Flame
              size={16}
              className="text-orange-300 dark:text-orange-400"
              fill="currentColor"
            />{" "}
            连续学习 5 天
          </p>
        </div>
      </div>
    </div>
  </div>
);

export const StatsCard = () => (
  <div className="px-6 -mt-8 relative z-20">
    <div className="bg-white dark:bg-slate-800 rounded-[1.5rem] py-5 px-2 shadow-lg shadow-indigo-900/5 dark:shadow-none border border-slate-100 dark:border-slate-700 flex justify-between items-center transition-colors duration-300">
      <div className="flex flex-col items-center flex-1 border-r border-slate-100 dark:border-slate-700">
        <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mb-1">
          <Star
            size={16}
            className="text-amber-500 dark:text-amber-400"
            fill="currentColor"
          />
        </div>
        <span className="text-xl font-black text-slate-800 dark:text-slate-100">
          120
        </span>
        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mt-1">
          掌握单词
        </span>
      </div>
      <div className="flex flex-col items-center flex-1 border-r border-slate-100 dark:border-slate-700">
        <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-1">
          <Crown
            size={16}
            className="text-purple-500 dark:text-purple-400"
            fill="currentColor"
          />
        </div>
        <span className="text-xl font-black text-slate-800 dark:text-slate-100">
          Lv.4
        </span>
        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mt-1">
          当前等级
        </span>
      </div>
      <div className="flex flex-col items-center flex-1">
        <div className="w-8 h-8 bg-pink-100 dark:bg-pink-900/30 rounded-full flex items-center justify-center mb-1">
          <Medal
            size={16}
            className="text-pink-500 dark:text-pink-400"
            fill="currentColor"
          />
        </div>
        <span className="text-xl font-black text-slate-800 dark:text-slate-100">
          15
        </span>
        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mt-1">
          获得勋章
        </span>
      </div>
    </div>
  </div>
);

export const ActionCard = ({
  title,
  subtitle,
  icon,
  colorTheme,
  delay = 0,
  centered = false,
}: {
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  colorTheme: "emerald" | "indigo" | "rose";
  delay?: number;
  centered?: boolean;
}) => {
  const themes = {
    emerald:
      "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 border-b-emerald-300 dark:border-b-emerald-700",
    indigo:
      "bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 border-b-indigo-300 dark:border-b-indigo-700",
    rose: "bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 border-b-rose-300 dark:border-b-rose-700",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, type: "spring" }}
      className={`rounded-[2rem] p-6 border-2 border-b-[6px] cursor-pointer active:border-b-2 active:translate-y-1 transition-all ${themes[colorTheme]} ${centered ? "flex flex-col items-center text-center" : "flex items-center justify-between"}`}
    >
      <div
        className={
          centered ? "flex flex-col items-center" : "flex items-center gap-4"
        }
      >
        <div
          className={`w-14 h-14 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center shadow-sm ${centered ? "mb-3" : ""}`}
        >
          {icon}
        </div>
        <div>
          <h3 className="text-lg font-extrabold text-slate-800 dark:text-slate-100">
            {title}
          </h3>
          {subtitle && (
            <p className={`text-sm font-bold opacity-80 mt-1`}>{subtitle}</p>
          )}
        </div>
      </div>
      {!centered && (
        <div className="w-10 h-10 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-sm">
          <ChevronRight size={20} className="dark:text-slate-300" />
        </div>
      )}
    </motion.div>
  );
};
