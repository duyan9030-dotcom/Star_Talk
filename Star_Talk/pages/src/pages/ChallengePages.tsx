import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Trophy, Star, Target, CheckCircle2, ChevronRight, Flame, Gift } from "lucide-react";
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
  const [dailyProgress, setDailyProgress] = useState(20);
  const [completedTasks, setCompletedTasks] = useState<number[]>([]);

  const tasks = [
    {
      id: 1,
      title: "完成 1 次单词测验",
      reward: 20,
      progress: 1,
      total: 1,
      completed: completedTasks.includes(1),
      route: "vocab-quiz",
      icon: "🎯"
    },
    {
      id: 2,
      title: "学习 10 个新单词",
      reward: 30,
      progress: 5,
      total: 10,
      completed: completedTasks.includes(2),
      route: "vocab-learn",
      icon: "📚"
    },
    {
      id: 3,
      title: "进行 1 次 AI 对话",
      reward: 50,
      progress: 0,
      total: 1,
      completed: completedTasks.includes(3),
      route: "chat",
      icon: "🤖",
      params: { title: "自由对话", color: "blue" }
    },
    {
      id: 4,
      title: "复习错题",
      reward: 25,
      progress: 0,
      total: 1,
      completed: completedTasks.includes(4),
      route: "wrong-review",
      icon: "✅"
    },
  ];

  const completedCount = tasks.filter(t => t.completed).length;
  const totalReward = tasks.reduce((sum, t) => sum + (t.completed ? t.reward : 0), 0);
  const bonusReward = completedCount === tasks.length ? 50 : 0;

  const handleTaskComplete = (taskId: number) => {
    if (!completedTasks.includes(taskId)) {
      setCompletedTasks([...completedTasks, taskId]);
      setDailyProgress(Math.min(dailyProgress + 20, 100));
    }
  };

  return (
    <PageWrapper title="每日挑战" onBack={onBack}>
      <div className="p-6 bg-white dark:bg-slate-900 min-h-full transition-colors">
        {/* 主要奖励卡 */}
        <div className="bg-gradient-to-br from-amber-400 via-orange-400 to-orange-500 rounded-[2rem] p-8 text-white shadow-xl mb-8 relative overflow-hidden">
          <div className="absolute -right-8 -bottom-8 opacity-30">
            <Trophy size={180} />
          </div>
          <div className="absolute -left-4 top-4 text-5xl">🎊</div>
          
          <div className="relative z-10">
            <h2 className="text-2xl font-black mb-2">今日目标</h2>
            <p className="text-orange-100 font-semibold text-sm mb-8">
              完成每日任务赚取金币并解锁奖励
            </p>

            <div className="space-y-4">
              {/* 金币显示 */}
              <div className="bg-white/20 backdrop-blur rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm font-medium">今日金币</p>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-4xl font-black">{totalReward}</span>
                      <span className="text-orange-100 text-sm">/ {tasks.reduce((sum, t) => sum + t.reward, 0)} 金币</span>
                    </div>
                  </div>
                  {bonusReward > 0 && (
                    <div className="text-center bg-amber-300/40 rounded-lg px-3 py-2">
                      <Flame size={24} className="mb-1" />
                      <p className="text-xs font-bold">+{bonusReward}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* 进度条 */}
              <div>
                <div className="flex justify-between text-xs font-bold text-orange-100 mb-2">
                  <span>完成进度</span>
                  <span>{completedCount}/{tasks.length}</span>
                </div>
                <div className="w-full h-3 bg-black/20 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-white rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${(completedCount / tasks.length) * 100}%` }}
                    transition={{ duration: 0.6 }}
                  ></motion.div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 任务列表 */}
        <h3 className="text-lg font-extrabold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
          <Target size={20} className="text-indigo-500" /> 任务列表
        </h3>

        <div className="space-y-4 mb-8">
          {tasks.map((task) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-[1.5rem] p-5 border-2 transition-all ${task.completed ? "border-emerald-100 dark:border-emerald-900/30 bg-emerald-50 dark:bg-emerald-900/20" : "border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800"}`}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{task.icon}</span>
                  <h4
                    className={`font-extrabold text-base ${task.completed ? "text-slate-400 dark:text-slate-500 line-through" : "text-slate-800 dark:text-slate-100"}`}
                  >
                    {task.title}
                  </h4>
                </div>
                <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-900/30 text-amber-500 px-3 py-1 rounded-lg text-xs font-bold">
                  <Star size={12} fill="currentColor" /> +{task.reward}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex-1 mr-4">
                  <div className="flex justify-between text-xs font-bold text-slate-400 mb-2">
                    <span>进度</span>
                    <span>
                      {task.progress} / {task.total}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${task.completed ? "bg-emerald-500" : "bg-blue-500"}`}
                      initial={{ width: 0 }}
                      animate={{
                        width: `${(task.progress / task.total) * 100}%`,
                      }}
                      transition={{ duration: 0.6 }}
                    ></motion.div>
                  </div>
                </div>

                {task.completed ? (
                  <button className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1 hover:bg-emerald-200 dark:hover:bg-emerald-900/40">
                    <CheckCircle2 size={14} /> 已完成
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      navigate(task.route, task.params);
                      setTimeout(() => handleTaskComplete(task.id), 3000);
                    }}
                    className="bg-blue-500 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-md active:scale-95 transition-transform hover:bg-blue-600 flex items-center gap-1"
                  >
                    去完成 <ChevronRight size={14} />
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* 成就卡 */}
        {completedCount === tasks.length && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-purple-400 to-pink-500 rounded-[1.5rem] p-6 text-white shadow-xl"
          >
            <div className="flex items-center gap-4">
              <Gift size={40} />
              <div>
                <h3 className="font-black text-lg">今日完成！</h3>
                <p className="text-sm text-white/90">所有任务已完成，额外奖励 +50 金币 🎉</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* 建议 */}
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-[1.5rem] p-4">
          <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
            💡 提示：坚持每天完成任务，将获得连胜奖励！
          </p>
        </div>
      </div>
    </PageWrapper>
  );
};
