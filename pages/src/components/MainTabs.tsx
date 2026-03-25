import React from "react";
import { motion } from "motion/react";
import {
  Rocket,
  Gamepad2,
  PenTool,
  Library,
  Clock,
  MessageCircle,
  Settings,
  Crown,
  User,
  Target,
  Medal,
  Edit,
  ChevronRight,
  Trophy,
} from "lucide-react";
import { Header, StatsCard, ActionCard } from "./HomeWidgets";

const colorMap: Record<string, string> = {
  blue: "bg-blue-50 dark:bg-blue-900/30 text-blue-500 border-blue-200 dark:border-blue-800",
  emerald:
    "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-500 border-emerald-200 dark:border-emerald-800",
  purple:
    "bg-purple-50 dark:bg-purple-900/30 text-purple-500 border-purple-200 dark:border-purple-800",
  amber:
    "bg-amber-50 dark:bg-amber-900/30 text-amber-500 border-amber-200 dark:border-amber-800",
  indigo:
    "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-500 border-indigo-200 dark:border-indigo-800",
  rose: "bg-rose-50 dark:bg-rose-900/30 text-rose-500 border-rose-200 dark:border-rose-800",
};

export const LearnTab = ({
  navigate,
  userProfile,
}: {
  navigate: (route: string, params?: any) => void;
  userProfile: any;
}) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: 20 }}
    transition={{ duration: 0.3 }}
    className="flex-1 overflow-y-auto pb-32 hide-scrollbar relative z-10 bg-white dark:bg-slate-900 transition-colors duration-300"
  >
    <Header userProfile={userProfile} />
    <StatsCard />
    <div className="px-6 mt-6 space-y-4">
      <motion.div
        onClick={() => navigate("daily-challenge")}
        className="bg-gradient-to-r from-amber-400 to-orange-500 rounded-[1.5rem] p-4 shadow-md flex items-center justify-between cursor-pointer active:scale-95 transition-transform"
      >
        <div className="flex items-center gap-3">
          <div className="bg-white/20 rounded-full p-2">
            <Trophy size={24} className="text-white" />
          </div>
          <div>
            <h4 className="text-white font-extrabold text-lg">每日挑战</h4>
            <p className="text-orange-100 text-xs font-medium">
              完成今日任务领金币
            </p>
          </div>
        </div>
        <button className="bg-white text-orange-500 text-xs font-extrabold px-4 py-2 rounded-full shadow-sm">
          去完成
        </button>
      </motion.div>

      <motion.div
        onClick={() => navigate("vocab-learn")}
        className="bg-white dark:bg-slate-800 rounded-[1.5rem] p-5 border-2 border-emerald-100 dark:border-emerald-900/30 flex items-center justify-between cursor-pointer active:scale-95 transition-transform shadow-sm"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center">
            <Gamepad2 size={24} className="text-emerald-500" />
          </div>
          <div>
            <h4 className="text-slate-800 dark:text-slate-100 font-extrabold text-lg">
              开始背词
            </h4>
            <p className="text-slate-400 text-xs font-medium mt-0.5">
              海量词库任你选
            </p>
          </div>
        </div>
        <ChevronRight size={20} className="text-slate-300" />
      </motion.div>

      <motion.div
        onClick={() => navigate("vocab-quiz")}
        className="bg-white dark:bg-slate-800 rounded-[1.5rem] p-5 border-2 border-indigo-100 dark:border-indigo-900/30 flex items-center justify-between cursor-pointer active:scale-95 transition-transform shadow-sm"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center">
            <PenTool size={24} className="text-indigo-500" />
          </div>
          <div>
            <h4 className="text-slate-800 dark:text-slate-100 font-extrabold text-lg">
              单词测验
            </h4>
            <p className="text-slate-400 text-xs font-medium mt-0.5">
              检验学习成果
            </p>
          </div>
        </div>
        <ChevronRight size={20} className="text-slate-300" />
      </motion.div>

      <motion.div
        onClick={() => navigate("vocab-book")}
        className="bg-pink-50 dark:bg-pink-900/20 rounded-[1.5rem] p-5 border-2 border-pink-100 dark:border-pink-900/30 flex flex-col items-center justify-center cursor-pointer active:scale-95 transition-transform shadow-sm"
      >
        <Library size={28} className="text-pink-500 mb-2" />
        <h4 className="text-pink-600 dark:text-pink-400 font-extrabold text-base">
          我的生词本 / 错题本
        </h4>
      </motion.div>
    </div>
  </motion.div>
);

export const AITab = ({
  navigate,
}: {
  navigate: (route: string, params?: any) => void;
}) => {
  const scenarios = [
    {
      icon: "🍔",
      title: "快餐店点餐",
      sub: "Ordering Fast Food",
      color: "blue",
    },
    { icon: "🏫", title: "学校交友", sub: "Making Friends", color: "emerald" },
    {
      icon: "🎬",
      title: "周末看电影",
      sub: "Going to the Movies",
      color: "purple",
    },
    { icon: "✈️", title: "机场登机", sub: "Airport Check-in", color: "amber" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
      className="flex-1 overflow-y-auto pb-32 hide-scrollbar relative z-10 flex flex-col bg-white dark:bg-slate-900 transition-colors duration-300"
    >
      <div className="pt-12 pb-4 px-6 text-center bg-white dark:bg-slate-800 sticky top-0 z-20 border-b border-slate-100 dark:border-slate-700">
        <h1 className="text-lg font-extrabold text-slate-800 dark:text-slate-100">
          AI 对话场景
        </h1>
      </div>

      <div className="px-6 pt-6 flex-1">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-bold text-slate-500 dark:text-slate-400">
            选择对话场景
          </h2>
          <button
            onClick={() => navigate("ai-history")}
            className="text-emerald-500 dark:text-emerald-400 text-xs font-bold flex items-center gap-1 active:scale-95 transition-transform"
          >
            <Clock size={14} /> 历史记录
          </button>
        </div>

        <div className="space-y-4">
          {scenarios.map((item, idx) => {
            const themeClass = colorMap[item.color] || colorMap.blue;
            return (
              <motion.div
                onClick={() => navigate("chat", { title: item.title })}
                key={idx}
                className={`bg-white dark:bg-slate-800 rounded-[1.5rem] p-4 border-2 ${themeClass.split(" ")[4]} flex items-center gap-4 cursor-pointer active:scale-95 transition-transform shadow-sm`}
              >
                <div
                  className={`w-14 h-14 rounded-2xl ${themeClass.split(" ")[0]} ${themeClass.split(" ")[1]} flex items-center justify-center text-2xl`}
                >
                  {item.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-base">
                    {item.title}
                  </h3>
                  <p className="text-slate-400 dark:text-slate-500 text-xs font-medium mt-0.5">
                    {item.sub}
                  </p>
                </div>
                <div
                  className={`w-8 h-8 rounded-full border-2 ${themeClass.split(" ")[4]} flex items-center justify-center`}
                >
                  <div
                    className={`w-4 h-4 rounded-full ${themeClass.split(" ")[0].replace("50", "500")}`}
                  ></div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export const TestTab = ({
  navigate,
}: {
  navigate: (route: string, params?: any) => void;
}) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: 20 }}
    transition={{ duration: 0.3 }}
    className="flex-1 overflow-y-auto pb-32 hide-scrollbar relative z-10 flex flex-col bg-white dark:bg-slate-900 transition-colors duration-300"
  >
    <div className="pt-12 pb-4 px-6 text-center bg-white dark:bg-slate-800 sticky top-0 z-20 border-b border-slate-100 dark:border-slate-700">
      <h1 className="text-lg font-extrabold text-slate-800 dark:text-slate-100">
        测验中心
      </h1>
    </div>

    <div className="px-6 pt-6 flex-1 flex flex-col space-y-4">
      {[
        {
          title: "单元 1 综合测验",
          desc: "包含 20 个基础词汇",
          color: "indigo",
          icon: <PenTool size={20} />,
        },
        {
          title: "单元 2 综合测验",
          desc: "包含 25 个进阶词汇",
          color: "emerald",
          icon: <PenTool size={20} />,
        },
        {
          title: "错题回顾测验",
          desc: "攻克你的薄弱环节",
          color: "rose",
          icon: <PenTool size={20} />,
        },
      ].map((quiz, idx) => {
        const themeClass = colorMap[quiz.color] || colorMap.blue;
        return (
          <div
            key={idx}
            onClick={() => navigate("vocab-quiz")}
            className="bg-white dark:bg-slate-800 rounded-[1.5rem] p-5 border border-slate-100 dark:border-slate-700 cursor-pointer active:scale-95 transition-transform shadow-sm flex items-center justify-between"
          >
            <div>
              <h3 className="text-base font-extrabold text-slate-800 dark:text-slate-100">
                {quiz.title}
              </h3>
              <p className="text-slate-400 dark:text-slate-500 font-medium text-xs mt-1">
                {quiz.desc}
              </p>
            </div>
            <div
              className={`w-10 h-10 rounded-full ${themeClass.split(" ")[0]} ${themeClass.split(" ")[1]} ${themeClass.split(" ")[2]} flex items-center justify-center`}
            >
              {quiz.icon}
            </div>
          </div>
        );
      })}
    </div>
  </motion.div>
);

export const MineTab = ({
  navigate,
  isLoggedIn,
  userProfile,
}: {
  navigate: (route: string, params?: any) => void;
  isLoggedIn: boolean;
  userProfile: any;
}) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: 20 }}
    transition={{ duration: 0.3 }}
    className="flex-1 overflow-y-auto pb-32 hide-scrollbar relative z-10 bg-white dark:bg-slate-900 transition-colors duration-300"
  >
    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 dark:from-indigo-900 dark:to-purple-900 pt-16 pb-12 px-6 rounded-b-[2.5rem] shadow-lg relative">
      <div
        className="absolute top-12 right-6 cursor-pointer active:scale-95 transition-transform"
        onClick={() => navigate("settings")}
      >
        <Settings size={24} className="text-white" />
      </div>

      {isLoggedIn ? (
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-3xl shadow-inner border-2 border-white/40">
              👦
            </div>
            <div className="absolute bottom-0 right-0 w-5 h-5 bg-amber-400 rounded-full flex items-center justify-center border-2 border-white">
              <Crown size={10} className="text-white" />
            </div>
          </div>
          <div className="text-white">
            <h2 className="text-xl font-extrabold">{userProfile.nickname}</h2>
            <p className="text-indigo-100 font-medium text-xs mt-1 bg-white/20 px-2 py-0.5 rounded-full inline-block">
              Lv.4 英语小达人
            </p>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center shadow-inner border-2 border-white/40">
            <User size={32} className="text-white/70" />
          </div>
          <div className="text-white">
            <h2 className="text-xl font-extrabold">未登录</h2>
            <p className="text-indigo-100 font-medium text-xs mt-1">
              登录后体验更多功能
            </p>
          </div>
        </div>
      )}
    </div>

    <div className="px-6 -mt-6 relative z-20 space-y-4">
      {isLoggedIn ? (
        <>
          {/* Stats */}
          <div className="bg-white dark:bg-slate-800 rounded-[1.5rem] p-4 shadow-md border border-slate-100 dark:border-slate-700 flex justify-between items-center transition-colors">
            <div className="flex flex-col items-center flex-1 border-r border-slate-100 dark:border-slate-700">
              <span className="text-xl font-black text-slate-800 dark:text-slate-100">
                12
              </span>
              <span className="text-[10px] font-bold text-slate-400 mt-1">
                打卡天数
              </span>
            </div>
            <div className="flex flex-col items-center flex-1 border-r border-slate-100 dark:border-slate-700">
              <span className="text-xl font-black text-slate-800 dark:text-slate-100">
                120
              </span>
              <span className="text-[10px] font-bold text-slate-400 mt-1">
                掌握单词
              </span>
            </div>
            <div className="flex flex-col items-center flex-1">
              <span className="text-xl font-black text-slate-800 dark:text-slate-100">
                15
              </span>
              <span className="text-[10px] font-bold text-slate-400 mt-1">
                获得勋章
              </span>
            </div>
          </div>

          {/* 词汇量汇总 */}
          <div className="bg-white dark:bg-slate-800 rounded-[1.5rem] p-5 shadow-sm border border-slate-100 dark:border-slate-700 transition-colors">
            <h3 className="font-extrabold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2 text-sm">
              <Target size={16} className="text-indigo-500" /> 词汇量汇总
            </h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">
                  <span>基础词汇 (A1)</span>
                  <span className="text-indigo-500">80 / 100</span>
                </div>
                <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full"
                    style={{ width: "80%" }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">
                  <span>进阶词汇 (A2)</span>
                  <span className="text-indigo-500">40 / 150</span>
                </div>
                <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full"
                    style={{ width: "26%" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* 我的勋章 */}
          <div className="bg-white dark:bg-slate-800 rounded-[1.5rem] p-5 shadow-sm border border-slate-100 dark:border-slate-700 transition-colors">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2 text-sm">
                <Medal size={16} className="text-amber-500" /> 我的勋章 (15)
              </h3>
              <span
                onClick={() => navigate("badges")}
                className="text-xs font-bold text-indigo-500 cursor-pointer active:scale-95"
              >
                查看全部
              </span>
            </div>
            <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
              <div className="min-w-[60px] flex flex-col items-center gap-1">
                <div className="w-12 h-12 rounded-full bg-amber-100 border-2 border-amber-200 flex items-center justify-center text-xl shadow-inner">
                  🔥
                </div>
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                  7天连胜
                </span>
              </div>
              <div className="min-w-[60px] flex flex-col items-center gap-1">
                <div className="w-12 h-12 rounded-full bg-blue-100 border-2 border-blue-200 flex items-center justify-center text-xl shadow-inner">
                  🌟
                </div>
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                  词汇新星
                </span>
              </div>
              <div className="min-w-[60px] flex flex-col items-center gap-1">
                <div className="w-12 h-12 rounded-full bg-purple-100 border-2 border-purple-200 flex items-center justify-center text-xl shadow-inner">
                  👑
                </div>
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                  对话王者
                </span>
              </div>
              <div className="min-w-[60px] flex flex-col items-center gap-1 opacity-40 grayscale">
                <div className="w-12 h-12 rounded-full bg-slate-100 border-2 border-slate-200 flex items-center justify-center text-xl shadow-inner">
                  🎯
                </div>
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                  百发百中
                </span>
              </div>
            </div>
          </div>

          {/* Links */}
          <div className="bg-white dark:bg-slate-800 rounded-[1.5rem] p-2 shadow-sm border border-slate-100 dark:border-slate-700 transition-colors">
            <div
              onClick={() => navigate("edit-profile")}
              className="flex items-center justify-between p-3 border-b border-slate-50 dark:border-slate-700/50 active:bg-slate-50 dark:active:bg-slate-700 transition-colors cursor-pointer rounded-xl"
            >
              <div className="flex items-center gap-3">
                <Edit size={18} className="text-indigo-500" />
                <span className="font-bold text-sm text-slate-700 dark:text-slate-200">
                  编辑资料
                </span>
              </div>
              <ChevronRight size={16} className="text-slate-400" />
            </div>
            <div
              onClick={() => navigate("feedback")}
              className="flex items-center justify-between p-3 active:bg-slate-50 dark:active:bg-slate-700 transition-colors cursor-pointer rounded-xl"
            >
              <div className="flex items-center gap-3">
                <MessageCircle size={18} className="text-emerald-500" />
                <span className="font-bold text-sm text-slate-700 dark:text-slate-200">
                  意见反馈
                </span>
              </div>
              <ChevronRight size={16} className="text-slate-400" />
            </div>
          </div>
        </>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-[1.5rem] p-6 shadow-md border border-slate-100 dark:border-slate-700 mt-8 transition-colors text-center">
          <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <User size={32} className="text-indigo-500" />
          </div>
          <h3 className="text-base font-extrabold text-slate-800 dark:text-slate-100 mb-6">
            欢迎来到 Star Talk
          </h3>
          <div className="space-y-3">
            <button
              onClick={() => navigate("login-wechat")}
              className="w-full bg-[#05C160] text-white font-extrabold py-3 rounded-xl flex items-center justify-center gap-2 shadow-md active:scale-95 transition-transform"
            >
              <MessageCircle size={20} fill="currentColor" />
              微信一键登录
            </button>
            <button
              onClick={() => navigate("login-phone")}
              className="w-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-200 font-extrabold py-3 rounded-xl active:scale-95 transition-transform"
            >
              手机号 / 注册登录
            </button>
          </div>
        </div>
      )}
    </div>
  </motion.div>
);
