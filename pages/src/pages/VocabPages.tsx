import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Volume2,
  ChevronRight,
  Check,
  X,
  ArrowRight,
  RotateCcw,
  Play,
  Loader2,
} from "lucide-react";
import { PageWrapper } from "../components/Common";
import { speakWord } from "../utils";
import { api } from "../services/api";

export const VocabLearnPage = ({
  onBack,
  key,
}: {
  onBack: () => void;
  key?: string;
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showMeaning, setShowMeaning] = useState(false);
  const [words, setWords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getVocabWords().then((data) => {
      setWords(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <PageWrapper title="单词学习" onBack={onBack}>
        <div className="flex flex-col h-full items-center justify-center bg-white dark:bg-slate-900">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mb-4" />
          <p className="text-slate-500 font-medium">正在加载单词数据...</p>
        </div>
      </PageWrapper>
    );
  }

  const currentWord = words[currentIndex];

  const handleNext = () => {
    if (currentIndex < words.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setShowMeaning(false);
    } else {
      onBack();
    }
  };

  return (
    <PageWrapper title="单词学习" onBack={onBack}>
      <div className="flex flex-col h-full p-6 bg-white dark:bg-slate-900 transition-colors">
        <div className="flex justify-between items-center mb-8">
          <span className="text-sm font-bold text-slate-400">进度</span>
          <span className="text-sm font-extrabold text-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1 rounded-full">
            {currentIndex + 1} / {words.length}
          </span>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 shadow-lg border-2 border-slate-100 dark:border-slate-700 flex flex-col items-center text-center relative overflow-hidden"
          >
            <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-indigo-400 to-purple-500"></div>

            <button
              onClick={() => speakWord(currentWord.word)}
              className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-500 rounded-full flex items-center justify-center mb-8 active:scale-95 transition-transform"
            >
              <Volume2 size={32} />
            </button>

            <h2 className="text-5xl font-black text-slate-800 dark:text-slate-100 mb-6 tracking-tight">
              {currentWord.word}
            </h2>

            <AnimatePresence mode="wait">
              {!showMeaning ? (
                <motion.button
                  key="btn"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowMeaning(true)}
                  className="bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 font-extrabold py-3 px-8 rounded-full active:scale-95 transition-transform"
                >
                  点击查看释义
                </motion.button>
              ) : (
                <motion.div
                  key="meaning"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center w-full"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-sm font-bold text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-md">
                      {currentWord.type}
                    </span>
                    <span className="text-2xl font-extrabold text-slate-700 dark:text-slate-200">
                      {currentWord.meaning}
                    </span>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-2xl w-full text-left border border-slate-100 dark:border-slate-600">
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-300 italic">
                      "{currentWord.example}"
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        <div className="mt-8 flex gap-4">
          <button
            onClick={() => {
              setShowMeaning(true);
              setTimeout(handleNext, 1000);
            }}
            className="flex-1 bg-rose-50 dark:bg-rose-900/30 text-rose-500 font-extrabold py-4 rounded-2xl border-2 border-rose-100 dark:border-rose-800 active:scale-95 transition-transform"
          >
            不认识
          </button>
          <button
            onClick={handleNext}
            className="flex-1 bg-emerald-500 text-white font-extrabold py-4 rounded-2xl shadow-lg shadow-emerald-500/20 border-b-[6px] border-emerald-600 active:border-b-2 active:translate-y-1 transition-all"
          >
            认识
          </button>
        </div>
      </div>
    </PageWrapper>
  );
};

export const VocabQuizPage = ({
  onBack,
  key,
}: {
  onBack: () => void;
  key?: string;
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getQuizQuestions().then((data) => {
      setQuestions(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <PageWrapper title="单词测验" onBack={onBack}>
        <div className="flex flex-col h-full items-center justify-center bg-white dark:bg-slate-900">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mb-4" />
          <p className="text-slate-500 font-medium">正在加载测验题目...</p>
        </div>
      </PageWrapper>
    );
  }

  const currentQ = questions[currentIndex];

  const handleSelect = (idx: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(idx);
    setIsCorrect(idx === currentQ.answer);

    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex((prev) => prev + 1);
        setSelectedOption(null);
        setIsCorrect(null);
      } else {
        // Show results
        onBack();
      }
    }, 1500);
  };

  return (
    <PageWrapper title="单词测验" onBack={onBack}>
      <div className="flex flex-col h-full p-6 bg-white dark:bg-slate-900 transition-colors">
        <div className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full mb-8 overflow-hidden">
          <motion.div
            className="h-full bg-indigo-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(currentIndex / questions.length) * 100}%` }}
          />
        </div>

        <div className="flex-1 flex flex-col items-center">
          <h3 className="text-xl font-extrabold text-slate-500 dark:text-slate-400 mb-4">
            请选择正确的中文释义
          </h3>
          <h2 className="text-6xl font-black text-slate-800 dark:text-slate-100 mb-12 tracking-tight">
            {currentQ.word}
          </h2>

          <div className="w-full space-y-4">
            {currentQ.options.map((opt, idx) => {
              let btnClass =
                "bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 text-slate-700 dark:text-slate-200";
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
                  className={`w-full p-5 rounded-[1.5rem] font-extrabold text-xl flex items-center justify-between transition-all active:scale-95 ${btnClass}`}
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

export const VocabBookPage = ({
  onBack,
  key,
}: {
  onBack: () => void;
  key?: string;
}) => {
  const words = [
    { word: "elephant", meaning: "大象", date: "今天" },
    { word: "giraffe", meaning: "长颈鹿", date: "昨天" },
    { word: "hippopotamus", meaning: "河马", date: "3月20日" },
  ];

  return (
    <PageWrapper title="生词本" onBack={onBack}>
      <div className="p-6 space-y-4 bg-white dark:bg-slate-900 min-h-full transition-colors">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-extrabold text-slate-800 dark:text-slate-100">
            共 {words.length} 个生词
          </h2>
          <button className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-bold px-4 py-2 rounded-full text-sm flex items-center gap-1 active:scale-95 transition-transform">
            <Play size={14} fill="currentColor" /> 复习全部
          </button>
        </div>

        {words.map((item, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-slate-800 rounded-[1.5rem] p-5 shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-between"
          >
            <div>
              <h3 className="text-xl font-black text-slate-800 dark:text-slate-100">
                {item.word}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">
                {item.meaning}
              </p>
            </div>
            <div className="flex flex-col items-end gap-3">
              <span className="text-xs font-bold text-slate-400">
                {item.date}
              </span>
              <button
                onClick={() => speakWord(item.word)}
                className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-500 rounded-full flex items-center justify-center active:scale-95 transition-transform"
              >
                <Volume2 size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </PageWrapper>
  );
};
