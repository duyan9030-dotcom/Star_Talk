import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  Trophy,
  Target,
  ArrowRight,
  Check,
  X,
  RotateCcw,
  Loader2,
  AlertCircle,
  BookOpen,
  AlertTriangle,
} from "lucide-react";
import { PageWrapper } from "../components/Common";
import { api } from "../services/api";

// 单元综合测验选择页面
export const StudyUnitsPage = ({
  onBack,
  navigate,
  pageKey,
}: {
  onBack: () => void;
  navigate: (route: string, params?: any) => void;
  pageKey?: string;
}) => {
  const units = [
    {
      id: 1,
      title: "单元1综合测验",
      description: "包含 20 个基础词汇",
      difficulty: "简单",
      words: 20,
      icon: "📚",
      color: "from-blue-400 to-blue-600",
    },
    {
      id: 2,
      title: "单元2综合测验",
      description: "包含 25 个进阶词汇",
      difficulty: "中等",
      words: 25,
      icon: "📖",
      color: "from-purple-400 to-purple-600",
    },
    {
      id: 3,
      title: "错题回顾测验",
      description: "攻克你的薄弱环节",
      difficulty: "挑战",
      words: 15,
      icon: "⚠️",
      color: "from-rose-400 to-rose-600",
    },
  ];

  return (
    <PageWrapper title="学习模块" onBack={onBack}>
      <div className="p-6 bg-white dark:bg-slate-900 min-h-full">
        <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 mb-6">
          选择测验类型
        </h2>

        <div className="space-y-4">
          {units.map((unit) => (
            <motion.button
              key={unit.id}
              onClick={() =>
                navigate("unit-test", {
                  unitId: unit.id,
                  unitTitle: unit.title,
                  wordCount: unit.words,
                  isWrongReview: unit.id === 3,
                })
              }
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full bg-gradient-to-br ${unit.color} rounded-[2rem] p-6 text-white shadow-lg border-0 transition-all active:shadow-md`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl">{unit.icon}</span>
                    <h3 className="text-xl font-black">{unit.title}</h3>
                  </div>
                  <p className="text-white/80 font-medium mb-3">{unit.description}</p>
                  <div className="flex gap-3">
                    <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-bold">
                      {unit.difficulty}
                    </span>
                    <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-bold">
                      {unit.words} 题
                    </span>
                  </div>
                </div>
                <div className="text-4xl ml-4">
                  <ArrowRight size={28} />
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        <div className="mt-12 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-6 rounded-lg">
          <h3 className="font-bold text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
            <Target size={20} /> 学习建议
          </h3>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <li>• 每天坚持做一套综合测验可以有效巩固学习</li>
            <li>• 错题回顾功能帮助你专注于薄弱环节</li>
            <li>• 达到 80% 的准确率视为通过</li>
          </ul>
        </div>
      </div>
    </PageWrapper>
  );
};

// 单元测验具体页面
export const UnitTestPage = ({
  params,
  onBack,
  pageKey,
}: {
  params: any;
  onBack: () => void;
  pageKey?: string;
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [wrongAnswers, setWrongAnswers] = useState<any[]>([]);

  const loadTestQuestions = async () => {
    try {
      setLoading(true);
      setError("");

      let data;
      const isWrongReview = params?.isWrongReview;

      if (isWrongReview) {
        // 从 localStorage 获取错题
        const wrongData = localStorage.getItem("wrong_words");
        if (wrongData) {
          try {
            const parsed = JSON.parse(wrongData);
            if (Array.isArray(parsed) && parsed.length > 0) {
              data = parsed.map((w: any, idx: number) => ({
                id: idx,
                word: w.word,
                options: [w.correctWord, "选项2", "选项3", "选项4"],
                answer: 0,
                correctWord: w.correctWord,
              }));
            } else {
              data = [];
            }
          } catch (err) {
            console.error("Failed to parse wrong words:", err);
            data = [];
          }
        } else {
          data = [];
        }
      } else {
        // 从 API 获取测验题目
        data = await api.getQuizQuestions(params?.wordCount || 20);
      }

      if (Array.isArray(data) && data.length > 0) {
        const normalizedQuestions = data.map((q: any, idx: number) => ({
          id: q.id || idx,
          word: q.word || q.name || q.english,
          options: Array.isArray(q.options)
            ? q.options
            : [q.option1, q.option2, q.option3, q.option4].filter(Boolean),
          answer: q.answer !== undefined ? q.answer : q.correctAnswer || 0,
          correctWord: q.correct_word || q.correctWord || q.meaning,
          phonetic: q.phonetic || "",
        }));
        setQuestions(normalizedQuestions);
        setCurrentIndex(0);
        setSelectedOption(null);
        setIsCorrect(null);
        setScore(0);
        setIsFinished(false);
        setWrongAnswers([]);
      } else {
        setError("没有获取到测验题目");
      }
    } catch (err: any) {
      console.error("[UnitTest] Error loading questions:", err);
      setError(err.message || "加载测验题目失败");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTestQuestions();
  }, []);

  if (loading) {
    return (
      <PageWrapper title={params?.unitTitle || "测验"} onBack={onBack}>
        <div className="flex flex-col h-full items-center justify-center bg-white dark:bg-slate-900">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mb-4" />
          <p className="text-slate-500 font-medium">正在加载测验题目...</p>
        </div>
      </PageWrapper>
    );
  }

  if (error && questions.length === 0) {
    return (
      <PageWrapper title={params?.unitTitle || "测验"} onBack={onBack}>
        <div className="flex flex-col h-full items-center justify-center bg-white dark:bg-slate-900 px-6">
          <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
          <p className="text-slate-700 dark:text-slate-200 font-bold mb-6 text-center">
            {error}
          </p>
          <button
            onClick={loadTestQuestions}
            className="bg-indigo-500 text-white font-bold px-8 py-3 rounded-2xl active:scale-95 transition-transform flex items-center gap-2 hover:bg-indigo-600"
          >
            <RotateCcw size={18} /> 重新加载
          </button>
        </div>
      </PageWrapper>
    );
  }

  if (questions.length === 0 && !loading && !error) {
    return (
      <PageWrapper title={params?.unitTitle || "测验"} onBack={onBack}>
        <div className="flex flex-col h-full items-center justify-center bg-white dark:bg-slate-900 px-6">
          <AlertTriangle className="w-12 h-12 text-amber-500 mb-4" />
          <p className="text-slate-700 dark:text-slate-200 font-bold mb-6 text-center">
            {params?.isWrongReview 
              ? "暂无错题，继续加油！"
              : "暂无测验题目"}
          </p>
          <button
            onClick={onBack}
            className="bg-indigo-500 text-white font-bold px-8 py-3 rounded-2xl active:scale-95 transition-transform hover:bg-indigo-600"
          >
            返回
          </button>
        </div>
      </PageWrapper>
    );
  }

  // 测验完成，显示成绩
  if (isFinished) {
    const accuracy = questions.length > 0
      ? Math.round((score / questions.length) * 100)
      : 0;
    const isPassed = accuracy >= 80;

    return (
      <PageWrapper title="测验成绩" onBack={onBack}>
        <div className="flex flex-col h-full p-6 bg-white dark:bg-slate-900 transition-colors">
          <div className="flex-1 flex flex-col items-center justify-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={`w-32 h-32 rounded-full flex items-center justify-center mb-8 ${
                isPassed
                  ? "bg-emerald-50 dark:bg-emerald-900/30"
                  : "bg-amber-50 dark:bg-amber-900/30"
              }`}
            >
              <div
                className={`text-6xl font-black ${
                  isPassed ? "text-emerald-500" : "text-amber-500"
                }`}
              >
                {accuracy}%
              </div>
            </motion.div>

            <h2 className="text-3xl font-black text-slate-800 dark:text-slate-100 mb-2 text-center">
              {isPassed ? "太棒了！恭喜通过！" : "继续努力！"}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium mb-8 text-center">
              {isPassed
                ? `你的成绩达到了 ${accuracy}%，表现优异！`
                : "再复习一下吧，你会做得更好的！"}
            </p>

            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-[2rem] p-6 space-y-4 mb-8">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-600 dark:text-slate-300">
                  总题数
                </span>
                <span className="font-black text-slate-800 dark:text-slate-100 text-lg">
                  {questions.length}
                </span>
              </div>
              <div className="h-px bg-slate-200 dark:bg-slate-700"></div>
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-600 dark:text-slate-300">
                  答对题数
                </span>
                <span className="font-black text-emerald-500 text-lg">{score}</span>
              </div>
              <div className="h-px bg-slate-200 dark:bg-slate-700"></div>
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-600 dark:text-slate-300">
                  答错题数
                </span>
                <span className="font-black text-rose-500 text-lg">
                  {questions.length - score}
                </span>
              </div>
            </div>

            {wrongAnswers.length > 0 && (
              <div className="w-full mb-8">
                <h3 className="font-bold text-slate-700 dark:text-slate-200 mb-4 flex items-center gap-2">
                  <AlertTriangle size={18} /> 错题回顾
                </h3>
                <div className="space-y-3">
                  {wrongAnswers.slice(0, 5).map((wrong: any, idx: number) => (
                    <div
                      key={idx}
                      className="bg-rose-50 dark:bg-rose-900/20 border-l-4 border-rose-500 p-4 rounded-lg"
                    >
                      <p className="font-bold text-slate-800 dark:text-slate-100 mb-1">
                        {wrong.word}
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        ✓ 正确答案：<span className="font-bold">{wrong.correctWord}</span>
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => {
                loadTestQuestions();
              }}
              className="flex-1 bg-indigo-500 text-white font-bold py-4 rounded-2xl active:scale-95 transition-transform hover:bg-indigo-600"
            >
              再来一次
            </button>
            <button
              onClick={onBack}
              className="flex-1 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold py-4 rounded-2xl active:scale-95 transition-transform hover:bg-slate-300 dark:hover:bg-slate-600"
            >
              返回
            </button>
          </div>
        </div>
      </PageWrapper>
    );
  }

  const currentQ = questions[currentIndex];

  const handleSelect = (idx: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(idx);
    const correct = idx === currentQ.answer;
    setIsCorrect(correct);

    if (correct) {
      setScore((prev) => prev + 1);
    } else {
      setWrongAnswers((prev) => [
        ...prev,
        {
          word: currentQ.word,
          correctWord: currentQ.options[currentQ.answer],
          selectedWord: currentQ.options[idx],
        },
      ]);
    }

    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex((prev) => prev + 1);
        setSelectedOption(null);
        setIsCorrect(null);
      } else {
        setIsFinished(true);
      }
    }, 1500);
  };

  return (
    <PageWrapper title={params?.unitTitle || "测验"} onBack={onBack}>
      <div className="flex flex-col h-full p-6 bg-white dark:bg-slate-900 transition-colors">
        <div className="flex justify-between items-center mb-6">
          <div className="flex-1 h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mr-4">
            <motion.div
              className="h-full bg-indigo-500 rounded-full"
              initial={{ width: 0 }}
              animate={{
                width: `${((currentIndex + 1) / questions.length) * 100}%`,
              }}
            />
          </div>
          <span className="text-xs font-bold text-slate-500">
            {currentIndex + 1}/{questions.length}
          </span>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-4">
            答对: {score}
          </div>

          <h3 className="text-lg font-extrabold text-slate-600 dark:text-slate-300 mb-8">
            请选择正确答案
          </h3>
          <h2 className="text-5xl font-black text-slate-800 dark:text-slate-100 mb-2 tracking-tight text-center">
            {currentQ.word}
          </h2>
          {currentQ.phonetic && (
            <p className="text-slate-400 dark:text-slate-500 text-sm mb-8">
              {currentQ.phonetic}
            </p>
          )}

          <div className="w-full space-y-4 mt-8">
            {currentQ.options.map((opt: string, idx: number) => {
              let btnClass =
                "bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600";
              let icon = null;

              if (selectedOption !== null) {
                if (idx === currentQ.answer) {
                  btnClass =
                    "bg-emerald-50 dark:bg-emerald-900/30 border-emerald-500 text-emerald-600 dark:text-emerald-400";
                  icon = <Check size={24} className="text-emerald-500" />;
                } else if (idx === selectedOption) {
                  btnClass =
                    "bg-rose-50 dark:bg-rose-900/30 border-rose-500 text-rose-600 dark:text-rose-400";
                  icon = <X size={24} className="text-rose-500" />;
                } else {
                  btnClass =
                    "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 opacity-50";
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  disabled={selectedOption !== null}
                  className={`w-full p-5 rounded-[1.5rem] font-extrabold text-lg flex items-center justify-between transition-all active:scale-95 ${btnClass}`}
                >
                  <span>{opt}</span>
                  {icon}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};