import React, { useState } from "react";
import { motion } from "motion/react";
import { Trophy, Star, Target, CheckCircle2, ChevronRight } from "lucide-react";
import { PageWrapper } from "../components/Common";

export const DailyChallengePage = ({
  onBack,
  navigate,
  key,
}: {
  onBack: () => void;
  navigate: (route: string, params?: any) => void;
  key?: string;
}) => {
  const tasks = [
    {
      id: 1,
      title: "完成 1 次单词测验",
      reward: 20,
      progress: 1,
      total: 1,
      completed: true,
      route: "vocab-quiz"
    },
    {
      id: 2,
      title: "学习 10 个新单词",
      reward: 30,
      progress: 5,
      total: 10,
      completed: false,
      route: "vocab-learn"
    },
    {
      id: 3,
      title: "进行 1 次 AI 对话",
      reward: 50,
      progress: 0,
      total: 1,
      completed: false,
      route: "chat",
      params: { title: "自由对话", color: "blue" }
    },
  ];

  return (
    <PageWrapper title="每日挑战" onBack={onBack}>
      <div className="p-6 bg-white dark:bg-slate-900 min-h-full transition-colors">
        <div className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-[2rem] p-6 text-white shadow-lg mb-8 relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 opacity-20">
            <Trophy size={120} />
          </div>
          <div className="relative z-10">
            <h2 className="text-2xl font-black mb-2">今日目标</h2>
            <p className="text-orange-100 font-medium text-sm mb-6">
              完成所有任务可获得额外奖励
            </p>

            <div className="flex items-end gap-2">
              <span className="text-5xl font-black">20</span>
              <span className="text-orange-100 font-bold mb-1">/ 100 金币</span>
            </div>

            <div className="w-full h-2 bg-black/20 rounded-full mt-4 overflow-hidden">
              <div
                className="h-full bg-white rounded-full"
                style={{ width: "20%" }}
              ></div>
            </div>
          </div>
        </div>

        <h3 className="text-lg font-extrabold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
          <Target size={20} className="text-indigo-500" /> 任务列表
        </h3>

        <div className="space-y-4">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`bg-white dark:bg-slate-800 rounded-[1.5rem] p-5 border-2 transition-colors ${task.completed ? "border-emerald-100 dark:border-emerald-900/30" : "border-slate-100 dark:border-slate-700"}`}
            >
              <div className="flex justify-between items-start mb-3">
                <h4
                  className={`font-extrabold text-base ${task.completed ? "text-slate-400 line-through" : "text-slate-800 dark:text-slate-100"}`}
                >
                  {task.title}
                </h4>
                <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-900/30 text-amber-500 px-2 py-1 rounded-lg text-xs font-bold">
                  <Star size={12} fill="currentColor" /> +{task.reward}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex-1 mr-4">
                  <div className="flex justify-between text-xs font-bold text-slate-400 mb-1">
                    <span>进度</span>
                    <span>
                      {task.progress} / {task.total}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${task.completed ? "bg-emerald-500" : "bg-blue-500"}`}
                      style={{
                        width: `${(task.progress / task.total) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>

                {task.completed ? (
                  <button className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1">
                    <CheckCircle2 size={14} /> 已领取
                  </button>
                ) : (
                  <button
                    onClick={() => navigate(task.route, task.params)}
                    className="bg-blue-500 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-md active:scale-95 transition-transform"
                  >
                    去完成
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
};
