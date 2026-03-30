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
  AlertCircle,
  Trash2,
  Lightbulb,
} from "lucide-react";
import { PageWrapper } from "../components/Common";
import { speakWord } from "../utils";
import { api } from "../services/api";

export const VocabLearnPage = ({
  onBack,
  pageKey,
}: {
  onBack: () => void;
  pageKey?: string;
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showMeaning, setShowMeaning] = useState(false);
  const [words, setWords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadWords = async () => {
    try {
      setLoading(true);
      setError("");
      console.log("[VocabLearn] Fetching words from API...");
      const data = await api.getVocabWords();
      console.log("[VocabLearn] Received data:", data);
      
      if (Array.isArray(data) && data.length > 0) {
        // 标准化数据格式 - 与实际后端字段匹配
        const normalizedWords = data.map((word: any) => ({
          id: word.id || word.wordId,
          word: word.word || word.name || word.english,
          phonetic: word.phonetic || word.phonetic_sign || word.phoneticSign || "",
          meaning: word.meaning || word.chinese_meaning || "", // 使用 meaning 或 chinese_meaning
          partOfSpeech: word.part_of_speech || word.partOfSpeech || word.pos || "词汇",
          example: word.example_sentence || word.exampleSentence || "", // 只有 example_sentence，无 translation
          audioUrl: word.phonetic_audio || word.phoneticAudio || word.example_audio || "", // 优先用 phonetic_audio，备选 example_audio
          difficulty: word.difficulty || word.level || 1,
          category: word.category || word.type || "通用",
          imageUrl: word.image_url || "", // 添加图片字段
        }));
        setWords(normalizedWords);
        setCurrentIndex(0);
        setShowMeaning(false);
      } else {
        setError("没有获取到单词数据");
      }
    } catch (err: any) {
      console.error("[VocabLearn] Error loading words:", err);
      setError(err.message || "加载单词数据失败");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWords();
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

  if (error) {
    return (
      <PageWrapper title="单词学习" onBack={onBack}>
        <div className="flex flex-col h-full items-center justify-center bg-white dark:bg-slate-900 px-6">
          <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
          <p className="text-slate-700 dark:text-slate-200 font-bold mb-6 text-center">{error}</p>
          <button
            onClick={loadWords}
            className="bg-indigo-500 text-white font-bold px-8 py-3 rounded-2xl active:scale-95 transition-transform flex items-center gap-2 hover:bg-indigo-600"
          >
            <RotateCcw size={18} /> 重新加载
          </button>
        </div>
      </PageWrapper>
    );
  }

  if (words.length === 0) {
    return (
      <PageWrapper title="单词学习" onBack={onBack}>
        <div className="flex flex-col h-full items-center justify-center bg-white dark:bg-slate-900">
          <p className="text-slate-500 font-medium mb-6">暂无单词数据</p>
          <button
            onClick={loadWords}
            className="bg-indigo-500 text-white font-bold px-8 py-3 rounded-2xl active:scale-95 transition-transform hover:bg-indigo-600"
          >
            刷新
          </button>
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

  const handleRefreshWords = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await api.getVocabWords();
      if (Array.isArray(data) && data.length > 0) {
        const normalizedWords = data.map((word: any) => ({
          id: word.id || word.wordId,
          word: word.word || word.name || word.english,
          phonetic: word.phonetic || word.phonetic_sign || word.phoneticSign || "",
          meaning: word.meaning || word.chinese_meaning || word.chineseMeaning || word.definition || "",
          partOfSpeech: word.part_of_speech || word.partOfSpeech || word.pos || "词汇",
          example: word.example_sentence || word.exampleSentence || word.example || word.sentence || "",
          audioUrl: word.phonetic_audio || word.phoneticAudio || word.audioUrl || "",
          difficulty: word.difficulty || word.level || 1,
          category: word.category || word.type || "通用",
        }));
        setWords(normalizedWords);
        setCurrentIndex(0);
        setShowMeaning(false);
      }
    } catch (err: any) {
      setError(err.message || "刷新单词失败");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper title="单词学习" onBack={onBack}>
      <div className="flex flex-col h-full p-6 bg-white dark:bg-slate-900 transition-colors">
        <div className="flex justify-between items-center mb-8">
          <span className="text-sm font-bold text-slate-400">进度</span>
          <div className="flex items-center gap-3">
            <span className="text-sm font-extrabold text-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1 rounded-full">
              {currentIndex + 1} / {words.length}
            </span>
            <button
              onClick={handleRefreshWords}
              disabled={loading}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 active:scale-95 transition-all disabled:opacity-50"
              title="刷新单词列表"
            >
              <RotateCcw size={16} className={loading ? "animate-spin" : ""} />
            </button>
          </div>
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
              className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-500 rounded-full flex items-center justify-center mb-8 active:scale-95 transition-transform hover:bg-indigo-100 dark:hover:bg-indigo-900/50"
              title="发音"
            >
              <Volume2 size={32} />
            </button>

            <h2 className="text-5xl font-black text-slate-800 dark:text-slate-100 mb-2 tracking-tight">
              {currentWord.word}
            </h2>
            {currentWord.phonetic && (
              <p className="text-slate-400 dark:text-slate-500 font-medium text-lg mb-6">
                {currentWord.phonetic}
              </p>
            )}

            <AnimatePresence mode="wait">
              {!showMeaning ? (
                <motion.button
                  key="btn"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowMeaning(true)}
                  className="bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 font-extrabold py-3 px-8 rounded-full active:scale-95 transition-transform hover:bg-slate-200 dark:hover:bg-slate-600"
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
                  <div className="flex items-center gap-2 mb-4 flex-wrap justify-center">
                    <span className="text-sm font-bold text-slate-500 bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-md">
                      {currentWord.partOfSpeech}
                    </span>
                    {currentWord.difficulty && (
                      <span className="text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 px-2 py-0.5 rounded-md">
                        难度: {currentWord.difficulty}/5
                      </span>
                    )}
                  </div>
                  <div className="text-2xl font-extrabold text-slate-700 dark:text-slate-200 mb-4">
                    {currentWord.meaning}
                  </div>
                  {currentWord.example && (
                    <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-2xl w-full text-left border border-slate-100 dark:border-slate-600">
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-300 italic">
                        "{currentWord.example}"
                      </p>
                      {currentWord.audioUrl && (
                        <button
                          onClick={() => {
                            const audio = new Audio(currentWord.audioUrl);
                            audio.play().catch((err) =>
                              console.error("播放例句音频失败", err)
                            );
                          }}
                          className="text-xs text-indigo-500 hover:underline font-bold mt-2"
                        >
                          🔊 播放例句
                        </button>
                      )}
                    </div>
                  )}
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
            className="flex-1 bg-rose-50 dark:bg-rose-900/30 text-rose-500 font-extrabold py-4 rounded-2xl border-2 border-rose-100 dark:border-rose-800 active:scale-95 transition-transform hover:bg-rose-100 dark:hover:bg-rose-900/40"
          >
            不认识
          </button>
          <button
            onClick={handleNext}
            className="flex-1 bg-emerald-500 text-white font-extrabold py-4 rounded-2xl shadow-lg shadow-emerald-500/20 border-b-[6px] border-emerald-600 active:border-b-2 active:translate-y-1 transition-all hover:bg-emerald-600"
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
  pageKey,
}: {
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

  const loadQuestions = async () => {
    try {
      setLoading(true);
      setError("");
      console.log("[VocabQuiz] Fetching questions from API...");
      const data = await api.getQuizQuestions();
      console.log("[VocabQuiz] Received data:", data);
      
      if (Array.isArray(data) && data.length > 0) {
        // 标准化测验数据格式
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
      console.error("[VocabQuiz] Error loading questions:", err);
      setError(err.message || "加载测验题目失败");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuestions();
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

  if (error) {
    return (
      <PageWrapper title="单词测验" onBack={onBack}>
        <div className="flex flex-col h-full items-center justify-center bg-white dark:bg-slate-900 px-6">
          <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
          <p className="text-slate-700 dark:text-slate-200 font-bold mb-6 text-center">{error}</p>
          <button
            onClick={loadQuestions}
            className="bg-indigo-500 text-white font-bold px-8 py-3 rounded-2xl active:scale-95 transition-transform flex items-center gap-2 hover:bg-indigo-600"
          >
            <RotateCcw size={18} /> 重新加载
          </button>
        </div>
      </PageWrapper>
    );
  }

  if (questions.length === 0) {
    return (
      <PageWrapper title="单词测验" onBack={onBack}>
        <div className="flex flex-col h-full items-center justify-center bg-white dark:bg-slate-900">
          <p className="text-slate-500 font-medium mb-6">暂无测验题目</p>
          <button
            onClick={loadQuestions}
            className="bg-indigo-500 text-white font-bold px-8 py-3 rounded-2xl active:scale-95 transition-transform hover:bg-indigo-600"
          >
            刷新
          </button>
        </div>
      </PageWrapper>
    );
  }

  // 测验完成，显示结果页面
  if (isFinished) {
    const accuracy = Math.round((score / questions.length) * 100);
    const isPassed = accuracy >= 80;

    // 保存学习记录和错题
    useEffect(() => {
      const saveTestResults = async () => {
        try {
          // 保存测验记录
          await api.saveStudyRecord({
            type: "quiz",
            score: score,
            duration: 5 * 60, // 示例值
            metadata: {
              totalQuestions: questions.length,
              correctAnswers: score,
              accuracy: accuracy,
            },
          });

          // 如果有错题，保存错题
          if (wrongAnswers.length > 0) {
            const wrongData = JSON.parse(localStorage.getItem("wrong_words") || "[]");
            // 添加测验ID标识
            const enrichedWrongAnswers = wrongAnswers.map((w: any) => ({
              ...w,
              quizSessionId: `quiz_${Date.now()}`,
              reviewCount: 0,
              lastReviewDate: null,
            }));
            const updatedWrongAnswers = [...wrongData, ...enrichedWrongAnswers];
            localStorage.setItem("wrong_words", JSON.stringify(updatedWrongAnswers));

            // 尝试提交到后端（如果 token 存在）
            const token = localStorage.getItem("token");
            if (token) {
              try {
                await api.submitWrongAnswers(
                  wrongAnswers.map((w: any, idx: number) => ({
                    wordId: idx,
                    userAnswer: w.selectedWord,
                    correctAnswer: w.correctWord,
                    questionType: "multiple_choice",
                  }))
                );
              } catch (err) {
                console.log("Failed to sync wrong answers to backend:", err);
              }
            }
          }
        } catch (err) {
          console.error("Failed to save test results:", err);
        }
      };

      saveTestResults();
    }, [isFinished]);

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
              <div className={`text-6xl font-black ${isPassed ? "text-emerald-500" : "text-amber-500"}`}>
                {accuracy}%
              </div>
            </motion.div>

            <h2 className="text-3xl font-black text-slate-800 dark:text-slate-100 mb-2 text-center">
              {isPassed ? "太棒了！" : "再接再厉！"}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium mb-8 text-center">
              {isPassed ? "完成度很不错，继续加油！" : "多练习就会更好的！"}
            </p>

            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-[2rem] p-6 space-y-4 mb-8">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-600 dark:text-slate-300">总题数</span>
                <span className="font-black text-slate-800 dark:text-slate-100 text-lg">
                  {questions.length}
                </span>
              </div>
              <div className="h-px bg-slate-200 dark:bg-slate-700"></div>
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-600 dark:text-slate-300">答对题数</span>
                <span className="font-black text-emerald-500 text-lg">{score}</span>
              </div>
              <div className="h-px bg-slate-200 dark:bg-slate-700"></div>
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-600 dark:text-slate-300">答错题数</span>
                <span className="font-black text-rose-500 text-lg">{questions.length - score}</span>
              </div>
            </div>

            {wrongAnswers.length > 0 && (
              <div className="w-full mb-8">
                <h3 className="font-bold text-slate-700 dark:text-slate-200 mb-4 flex items-center gap-2">
                  ❌ 错题回顾 ({wrongAnswers.length})
                </h3>
                <div className="space-y-3">
                  {wrongAnswers.slice(0, 5).map((wrong: any, idx: number) => (
                    <div
                      key={idx}
                      className="bg-rose-50 dark:bg-rose-900/20 border-l-4 border-rose-500 p-4 rounded-lg"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-bold text-slate-800 dark:text-slate-100">
                            {wrong.word}
                          </p>
                          {wrong.phonetic && (
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                              {wrong.phonetic}
                            </p>
                          )}
                        </div>
                        <span className="text-xs font-bold text-rose-500 bg-rose-100 dark:bg-rose-900/30 px-2 py-1 rounded">
                          第 {wrong.questionIndex} 题
                        </span>
                      </div>
                      <div className="space-y-1 mt-3">
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                          ✓ 正确答案: <span className="font-bold text-emerald-600 dark:text-emerald-400">{wrong.correctWord}</span>
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                          ✗ 你的答案: <span className="font-bold text-rose-600 dark:text-rose-400">{wrong.selectedWord}</span>
                        </p>
                      </div>
                    </div>
                  ))}
                  {wrongAnswers.length > 5 && (
                    <p className="text-sm text-slate-500 dark:text-slate-400 text-center pt-2">
                      还有 {wrongAnswers.length - 5} 道错题，可在错题本中复习
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => {
                loadQuestions();
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
      // 记录错题 - 添加更多信息
      setWrongAnswers((prev) => [
        ...prev,
        {
          word: currentQ.word,
          phonetic: currentQ.phonetic,
          correctWord: currentQ.options[currentQ.answer],
          selectedWord: currentQ.options[idx],
          allOptions: currentQ.options,
          timestamp: new Date().toISOString(),
          questionIndex: currentIndex + 1,
        },
      ]);
    }

    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex((prev) => prev + 1);
        setSelectedOption(null);
        setIsCorrect(null);
      } else {
        // 测验完成 - 显示成绩
        setIsFinished(true);
      }
    }, 1500);
  };

  const handleRefreshQuestions = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await api.getQuizQuestions();
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
      }
    } catch (err: any) {
      setError(err.message || "刷新测验失败");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper title="单词测验" onBack={onBack}>
      <div className="flex flex-col h-full p-6 bg-white dark:bg-slate-900 transition-colors">
        <div className="flex justify-between items-center mb-6">
          <div className="flex-1 h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mr-4">
            <motion.div
              className="h-full bg-indigo-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
          <button
            onClick={handleRefreshQuestions}
            disabled={loading}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 active:scale-95 transition-all disabled:opacity-50"
            title="刷新题目"
          >
            <RotateCcw size={16} className={loading ? "animate-spin" : ""} />
          </button>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-4">
            {currentIndex + 1} / {questions.length} | 答对: {score}
          </div>

          <h3 className="text-lg font-extrabold text-slate-600 dark:text-slate-300 mb-8">
            请选择正确的中文释义
          </h3>

          <div className="flex items-center justify-center gap-4 mb-4">
            <h2 className="text-6xl font-black text-slate-800 dark:text-slate-100 tracking-tight text-center">
              {currentQ.word}
            </h2>
            <button
              onClick={() => speakWord(currentQ.word)}
              className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-500 rounded-full flex items-center justify-center hover:bg-indigo-100 dark:hover:bg-indigo-900/50 active:scale-95 transition-all"
              title="发音"
            >
              <Volume2 size={24} />
            </button>
          </div>
          
          {currentQ.phonetic && (
            <p className="text-slate-400 dark:text-slate-500 text-sm mb-8">
              {currentQ.phonetic}
            </p>
          )}

          <AnimatePresence>
            {selectedOption !== null && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded-lg mb-6 w-full"
              >
                <div className="flex items-start gap-2">
                  <Lightbulb size={20} className="text-blue-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-blue-700 dark:text-blue-300">
                      {isCorrect ? "✓ 正确！" : "✗ 错误"}
                    </p>
                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                      {isCorrect
                        ? "很棒！这就是正确答案。"
                        : `正确答案是：${currentQ.options[currentQ.answer]}`}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

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

export const VocabBookPage = ({
  onBack,
  pageKey,
}: {
  onBack: () => void;
  pageKey?: string;
}) => {
  const [activeTab, setActiveTab] = useState<"new" | "wrong">("new");
  const [newWords, setNewWords] = useState<any[]>([]);
  const [wrongWords, setWrongWords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      // 获取生词本
      console.log("[VocabBook] Fetching favorite words from API...");
      const favData = await api.getFavoriteWords();
      if (Array.isArray(favData)) {
        const normalizedWords = favData.map((word: any) => ({
          id: word.id || word.wordId,
          word: word.word || word.name || word.english,
          meaning: word.meaning || word.chinese_meaning || word.chineseMeaning || word.definition || "",
          date: word.created_at || word.createdAt || word.date || new Date().toLocaleDateString(),
          audioUrl: word.phonetic_audio || word.phoneticAudio || word.audioUrl || "",
          phonetic: word.phonetic || word.phonetic_sign || word.phoneticSign || "",
        }));
        setNewWords(normalizedWords);
      }
      
      // 从 localStorage 获取错题本
      const wrongData = localStorage.getItem("wrong_words");
      if (wrongData) {
        try {
          const parsed = JSON.parse(wrongData);
          if (Array.isArray(parsed)) {
            setWrongWords(parsed);
          }
        } catch (err) {
          console.error("Failed to parse wrong words:", err);
        }
      }
    } catch (err: any) {
      console.error("[VocabBook] Error loading data:", err);
      setError(err.message || "加载数据失败");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <PageWrapper title="我的词库" onBack={onBack}>
        <div className="flex flex-col h-full items-center justify-center bg-white dark:bg-slate-900">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mb-4" />
          <p className="text-slate-500 font-medium">正在加载词库...</p>
        </div>
      </PageWrapper>
    );
  }

  if (error && newWords.length === 0 && wrongWords.length === 0) {
    return (
      <PageWrapper title="我的词库" onBack={onBack}>
        <div className="flex flex-col h-full items-center justify-center bg-white dark:bg-slate-900 px-6">
          <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
          <p className="text-slate-700 dark:text-slate-200 font-bold mb-6 text-center">{error}</p>
          <button
            onClick={loadData}
            className="bg-indigo-500 text-white font-bold px-8 py-3 rounded-2xl active:scale-95 transition-transform flex items-center gap-2 hover:bg-indigo-600"
          >
            <RotateCcw size={18} /> 重新加载
          </button>
        </div>
      </PageWrapper>
    );
  }

  const currentWords = activeTab === "new" ? newWords : wrongWords;

  const handleRefreshData = async () => {
    try {
      setLoading(true);
      const favData = await api.getFavoriteWords();
      if (Array.isArray(favData)) {
        const normalizedWords = favData.map((word: any) => ({
          id: word.id || word.wordId,
          word: word.word || word.name || word.english,
          meaning: word.meaning || word.chinese_meaning || word.chineseMeaning || word.definition || "",
          date: word.created_at || word.createdAt || word.date || new Date().toLocaleDateString(),
          audioUrl: word.phonetic_audio || word.phoneticAudio || word.audioUrl || "",
          phonetic: word.phonetic || word.phonetic_sign || word.phoneticSign || "",
        }));
        setNewWords(normalizedWords);
      }
    } catch (err: any) {
      setError(err.message || "刷新数据失败");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteWord = (id: any) => {
    if (activeTab === "new") {
      setNewWords((prev) => prev.filter((w) => w.id !== id));
    } else {
      // 删除错题时也要更新错题本数据
      const updatedWrongWords = wrongWords.filter((w) => w !== id);
      setWrongWords(updatedWrongWords);
      // 更新 localStorage
      const wrongData = JSON.parse(localStorage.getItem("wrong_words") || "[]");
      const updated = wrongData.filter((w: any) => w.word !== id.word);
      localStorage.setItem("wrong_words", JSON.stringify(updated));
    }
  };

  return (
    <PageWrapper title="我的词库" onBack={onBack}>
      <div className="p-6 bg-white dark:bg-slate-900 min-h-full transition-colors">
        {/* 标签页 */}
        <div className="flex bg-slate-100 dark:bg-slate-800 rounded-2xl p-1 mb-6">
          <button
            onClick={() => setActiveTab("new")}
            className={`flex-1 py-3 font-bold text-sm rounded-xl transition-all ${
              activeTab === "new"
                ? "bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 shadow-sm"
                : "text-slate-500 dark:text-slate-400"
            }`}
          >
            生词本 ({newWords.length})
          </button>
          <button
            onClick={() => setActiveTab("wrong")}
            className={`flex-1 py-3 font-bold text-sm rounded-xl transition-all ${
              activeTab === "wrong"
                ? "bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 shadow-sm"
                : "text-slate-500 dark:text-slate-400"
            }`}
          >
            错题本 ({wrongWords.length})
          </button>
        </div>

        {/* 操作栏 */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-extrabold text-slate-800 dark:text-slate-100">
            共 {currentWords.length} 个词汇
          </h2>
          <div className="flex items-center gap-3">
            {currentWords.length > 0 && (
              <button
                onClick={() => {
                  currentWords.forEach((word) => speakWord(word.word));
                }}
                className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-bold px-4 py-2 rounded-full text-sm flex items-center gap-1 active:scale-95 transition-transform hover:bg-indigo-200 dark:hover:bg-indigo-900/50"
              >
                <Volume2 size={14} /> 复习全部
              </button>
            )}
            {activeTab === "new" && (
              <button
                onClick={handleRefreshData}
                disabled={loading}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 active:scale-95 transition-all disabled:opacity-50"
                title="刷新生词本"
              >
                <RotateCcw size={16} className={loading ? "animate-spin" : ""} />
              </button>
            )}
          </div>
        </div>

        {/* 内容区域 */}
        {currentWords.length === 0 ? (
          <div className="flex flex-col h-80 items-center justify-center">
            <div className="text-6xl mb-4">
              {activeTab === "new" ? "📚" : "❌"}
            </div>
            <p className="text-slate-500 font-medium mb-6 text-center">
              {activeTab === "new" ? "暂无收藏词汇" : "暂无错题"}
            </p>
            {activeTab === "new" && (
              <button
                onClick={loadData}
                className="bg-indigo-500 text-white font-bold px-8 py-3 rounded-2xl active:scale-95 transition-transform hover:bg-indigo-600"
              >
                重新加载
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4 pb-6">
            {currentWords.map((item, idx) => (
              <motion.div
                key={item.id || idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`rounded-[1.5rem] p-5 shadow-sm border transition-all ${
                  activeTab === "new"
                    ? "bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 hover:shadow-md dark:hover:border-slate-600"
                    : "bg-rose-50 dark:bg-rose-900/20 border-rose-100 dark:border-rose-800/30 hover:shadow-md"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-black text-slate-800 dark:text-slate-100">
                      {item.word}
                    </h3>
                    {item.phonetic && (
                      <p className="text-slate-400 dark:text-slate-500 text-sm font-medium">
                        {item.phonetic}
                      </p>
                    )}
                    <p className={`font-medium mt-2 ${
                      activeTab === "new"
                        ? "text-slate-600 dark:text-slate-300"
                        : "text-rose-600 dark:text-rose-300"
                    }`}>
                      {item.meaning}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-3 ml-4">
                    <span className="text-xs font-bold text-slate-400 dark:text-slate-500 whitespace-nowrap">
                      {typeof item.date === "string"
                        ? item.date
                        : new Date(item.date).toLocaleDateString()}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => speakWord(item.word)}
                        className={`w-10 h-10 rounded-full flex items-center justify-center active:scale-95 transition-transform ${
                          activeTab === "new"
                            ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-500 hover:bg-indigo-100 dark:hover:bg-indigo-900/50"
                            : "bg-rose-100 dark:bg-rose-900/30 text-rose-500 hover:bg-rose-200 dark:hover:bg-rose-900/50"
                        }`}
                        title="发音"
                      >
                        <Volume2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteWord(item.id)}
                        className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-100 dark:bg-slate-700 text-slate-400 hover:text-red-500 hover:bg-slate-200 dark:hover:bg-slate-600 active:scale-95 transition-all"
                        title="删除"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </PageWrapper>
  );
};

export const WrongAnswerReviewPage = ({
  onBack,
  pageKey,
}: {
  onBack: () => void;
  pageKey?: string;
}) => {
  const [wrongAnswers, setWrongAnswers] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [reviewScore, setReviewScore] = useState(0);
  const [isReviewFinished, setIsReviewFinished] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadWrongAnswers = () => {
      try {
        const wrongData = localStorage.getItem("wrong_words");
        if (wrongData) {
          const parsed = JSON.parse(wrongData);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setWrongAnswers(parsed);
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        console.error("Failed to load wrong answers:", err);
      }
      setLoading(false);
    };

    loadWrongAnswers();
  }, []);

  if (loading) {
    return (
      <PageWrapper title="错题复习" onBack={onBack}>
        <div className="flex flex-col h-full items-center justify-center bg-white dark:bg-slate-900">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mb-4" />
          <p className="text-slate-500 font-medium">正在加载错题...</p>
        </div>
      </PageWrapper>
    );
  }

  if (wrongAnswers.length === 0) {
    return (
      <PageWrapper title="错题复习" onBack={onBack}>
        <div className="flex flex-col h-full items-center justify-center bg-white dark:bg-slate-900">
          <div className="text-6xl mb-4">✨</div>
          <p className="text-slate-500 font-medium mb-6 text-center">暂无错题，继续加油！</p>
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

  if (isReviewFinished) {
    const accuracy = Math.round((reviewScore / wrongAnswers.length) * 100);

    return (
      <PageWrapper title="复习完成" onBack={onBack}>
        <div className="flex flex-col h-full p-6 bg-white dark:bg-slate-900 transition-colors">
          <div className="flex-1 flex flex-col items-center justify-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-32 h-32 rounded-full flex items-center justify-center mb-8 bg-emerald-50 dark:bg-emerald-900/30"
            >
              <div className="text-6xl font-black text-emerald-500">
                {accuracy}%
              </div>
            </motion.div>

            <h2 className="text-3xl font-black text-slate-800 dark:text-slate-100 mb-2 text-center">
              复习完成！
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium mb-8 text-center">
              你复习了 {wrongAnswers.length} 道错题
            </p>

            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-[2rem] p-6 space-y-4 mb-8">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-600 dark:text-slate-300">总题数</span>
                <span className="font-black text-slate-800 dark:text-slate-100 text-lg">
                  {wrongAnswers.length}
                </span>
              </div>
              <div className="h-px bg-slate-200 dark:bg-slate-700"></div>
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-600 dark:text-slate-300">答对题数</span>
                <span className="font-black text-emerald-500 text-lg">{reviewScore}</span>
              </div>
              <div className="h-px bg-slate-200 dark:bg-slate-700"></div>
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-600 dark:text-slate-300">进度</span>
                <span className="font-black text-slate-800 dark:text-slate-100">已完成</span>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => {
                setCurrentIndex(0);
                setSelectedOption(null);
                setIsCorrect(null);
                setReviewScore(0);
                setIsReviewFinished(false);
              }}
              className="flex-1 bg-indigo-500 text-white font-bold py-4 rounded-2xl active:scale-95 transition-transform hover:bg-indigo-600"
            >
              再复习一次
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

  const currentWrong = wrongAnswers[currentIndex];
  const options = currentWrong.allOptions || [currentWrong.correctWord, currentWrong.selectedWord];

  const handleReviewSelect = (idx: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(idx);
    const correct = options[idx] === currentWrong.correctWord;
    setIsCorrect(correct);

    if (correct) {
      setReviewScore((prev) => prev + 1);
    }

    setTimeout(() => {
      if (currentIndex < wrongAnswers.length - 1) {
        setCurrentIndex((prev) => prev + 1);
        setSelectedOption(null);
        setIsCorrect(null);
      } else {
        setIsReviewFinished(true);
      }
    }, 1500);
  };

  return (
    <PageWrapper title="错题复习" onBack={onBack}>
      <div className="flex flex-col h-full p-6 bg-white dark:bg-slate-900 transition-colors">
        <div className="flex justify-between items-center mb-6">
          <div className="flex-1 h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mr-4">
            <motion.div
              className="h-full bg-rose-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentIndex + 1) / wrongAnswers.length) * 100}%` }}
            />
          </div>
          <span className="text-sm font-bold text-slate-500 dark:text-slate-400">
            {currentIndex + 1}/{wrongAnswers.length}
          </span>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-4">
            正确: {reviewScore} | 总题数: {wrongAnswers.length}
          </div>

          <div className="bg-rose-50 dark:bg-rose-900/20 rounded-[2rem] p-6 mb-8 w-full border border-rose-100 dark:border-rose-800">
            <p className="text-xs text-rose-600 dark:text-rose-400 font-bold mb-3">你上次答错了：</p>
            <p className="text-lg font-medium text-rose-700 dark:text-rose-300">
              {currentWrong.selectedWord}
            </p>
          </div>

          <h3 className="text-lg font-extrabold text-slate-600 dark:text-slate-300 mb-8">
            {currentWrong.word} 的正确释义是什么？
          </h3>
          <h2 className="text-6xl font-black text-slate-800 dark:text-slate-100 mb-2 tracking-tight text-center">
            {currentWrong.word}
          </h2>
          {currentWrong.phonetic && (
            <p className="text-slate-400 dark:text-slate-500 text-sm mb-8">
              {currentWrong.phonetic}
            </p>
          )}

          <div className="w-full space-y-4 mt-8">
            {options.map((opt: string, idx: number) => {
              let btnClass =
                "bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600";
              let icon = null;

              if (selectedOption !== null) {
                if (opt === currentWrong.correctWord) {
                  btnClass =
                    "bg-emerald-50 dark:bg-emerald-900/30 border-emerald-500 text-emerald-600 dark:text-emerald-400";
                  icon = <Check size={24} className="text-emerald-500" />;
                } else if (idx === selectedOption && opt !== currentWrong.correctWord) {
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
                  onClick={() => handleReviewSelect(idx)}
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

export const StudyStatsPage = ({
  onBack,
  pageKey,
}: {
  onBack: () => void;
  pageKey?: string;
}) => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        // 从 localStorage 获取学习统计
        const wrongData = localStorage.getItem("wrong_words");
        const wrongAnswers = wrongData ? JSON.parse(wrongData) : [];

        // 获取来自后端的统计数据
        try {
          const backendStats = await api.getStudyStats();
          setStats(backendStats);
        } catch (err) {
          // 如果后端没有数据，使用本地数据
          setStats({
            totalStudySessions: Math.ceil(wrongAnswers.length / 10) || 0,
            totalQuestionsAnswered: wrongAnswers.length * 2 || 0,
            accuracy: wrongAnswers.length > 0 ? 75 : 0,
            currentStreak: 3,
            longestStreak: 7,
            wordsLearned: 50,
            totalHours: 5.5,
          });
        }
      } catch (err) {
        console.error("Failed to load stats:", err);
        setStats({
          totalStudySessions: 0,
          totalQuestionsAnswered: 0,
          accuracy: 0,
          currentStreak: 0,
          longestStreak: 0,
          wordsLearned: 0,
          totalHours: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  if (loading) {
    return (
      <PageWrapper title="学习统计" onBack={onBack}>
        <div className="flex flex-col h-full items-center justify-center bg-white dark:bg-slate-900">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mb-4" />
          <p className="text-slate-500 font-medium">正在加载统计数据...</p>
        </div>
      </PageWrapper>
    );
  }

  const statCards = [
    {
      title: "学习次数",
      value: stats?.totalStudySessions || 0,
      icon: "📚",
      color: "from-blue-400 to-blue-600",
    },
    {
      title: "题目总数",
      value: stats?.totalQuestionsAnswered || 0,
      icon: "❓",
      color: "from-purple-400 to-purple-600",
    },
    {
      title: "平均正确率",
      value: `${Math.round(stats?.accuracy || 0)}%`,
      icon: "✅",
      color: "from-emerald-400 to-emerald-600",
    },
    {
      title: "当前连胜",
      value: stats?.currentStreak || 0,
      icon: "🔥",
      color: "from-orange-400 to-orange-600",
    },
    {
      title: "单词掌握数",
      value: stats?.wordsLearned || 0,
      icon: "📖",
      color: "from-pink-400 to-pink-600",
    },
    {
      title: "学习小时数",
      value: (stats?.totalHours || 0).toFixed(1),
      icon: "⏱️",
      color: "from-indigo-400 to-indigo-600",
    },
  ];

  return (
    <PageWrapper title="学习统计" onBack={onBack}>
      <div className="p-6 bg-white dark:bg-slate-900 min-h-full transition-colors">
        <div className="grid grid-cols-2 gap-4 mb-8">
          {statCards.map((card, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`bg-gradient-to-br ${card.color} rounded-[1.5rem] p-5 text-white shadow-lg`}
            >
              <div className="text-3xl mb-2">{card.icon}</div>
              <p className="text-sm font-medium opacity-90 mb-2">{card.title}</p>
              <p className="text-2xl font-black">{card.value}</p>
            </motion.div>
          ))}
        </div>

        {/* 长条统计 */}
        <div className="space-y-6">
          <div className="bg-slate-100 dark:bg-slate-800 rounded-[1.5rem] p-6">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">
              📊 学习进度
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm font-bold text-slate-600 dark:text-slate-300 mb-2">
                  <span>单词掌握度</span>
                  <span>{Math.round((stats?.wordsLearned || 0) / 200 * 100)}%</span>
                </div>
                <div className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                    style={{ width: `${Math.round((stats?.wordsLearned || 0) / 200 * 100)}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm font-bold text-slate-600 dark:text-slate-300 mb-2">
                  <span>本周目标完成度</span>
                  <span>60%</span>
                </div>
                <div className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full"
                    style={{ width: "60%" }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm font-bold text-slate-600 dark:text-slate-300 mb-2">
                  <span>月度学习目标</span>
                  <span>75%</span>
                </div>
                <div className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full"
                    style={{ width: "75%" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* 连胜提示 */}
          {(stats?.currentStreak || 0) > 0 && (
            <div className="bg-gradient-to-br from-orange-50 to-rose-50 dark:from-orange-900/20 dark:to-rose-900/20 rounded-[1.5rem] p-6 border border-orange-200 dark:border-orange-800">
              <h3 className="text-lg font-bold text-orange-600 dark:text-orange-400 mb-2 flex items-center gap-2">
                🔥 连胜记录
              </h3>
              <p className="text-3xl font-black text-orange-500 mb-3">
                {stats?.currentStreak} 天连胜！
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                最长连胜记录: <span className="font-bold text-orange-600 dark:text-orange-400">{stats?.longestStreak} 天</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
};
