import React, { useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Volume2, RefreshCw, Trophy, Target, ArrowRight } from 'lucide-react';
import { PageWrapper } from '../components/Common';
import { speakWord } from '../utils';

export const DailyChallengePage = ({ onBack, navigate }: { onBack: () => void, navigate: (route: string) => void }) => (
  <PageWrapper title="每日挑战" onBack={onBack}>
    <div className="p-6 space-y-4">
      <div className="bg-gradient-to-br from-orange-400 to-red-500 rounded-[2rem] p-6 text-white shadow-lg mb-8">
        <h3 className="text-2xl font-black mb-1">今日目标</h3>
        <p className="text-orange-100 font-medium mb-4">完成所有任务可获得额外 50 金币！</p>
        <div className="w-full bg-black/20 rounded-full h-3 mb-2"><div className="bg-white rounded-full h-3 w-1/3"></div></div>
        <p className="text-xs font-bold text-right">1 / 3 已完成</p>
      </div>
      {[
        { title: '学习 10 个新单词', reward: '+10 金币', done: true, route: 'vocab-learn' },
        { title: '完成 1 次 AI 对话', reward: '+20 金币', done: false, route: 'ai' },
        { title: '通过 1 次单元测验', reward: '+20 金币', done: false, route: 'vocab-quiz' },
      ].map((task, i) => (
        <div key={i} className="bg-white dark:bg-slate-800 rounded-[1.5rem] p-5 flex items-center justify-between shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${task.done ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-500' : 'bg-slate-100 dark:bg-slate-700 text-slate-400'}`}><CheckCircle2 size={24} /></div>
            <div>
              <h4 className={`font-bold ${task.done ? 'text-slate-400 line-through' : 'text-slate-700 dark:text-slate-200'}`}>{task.title}</h4>
              <p className="text-orange-500 text-xs font-extrabold mt-1">{task.reward}</p>
            </div>
          </div>
          <button onClick={() => { if (!task.done && task.route) navigate(task.route); }} className={`px-4 py-2 rounded-full font-bold text-sm ${task.done ? 'bg-slate-100 dark:bg-slate-700 text-slate-400' : 'bg-blue-500 text-white shadow-md active:scale-95'}`}>
            {task.done ? '已领取' : '去完成'}
          </button>
        </div>
      ))}
    </div>
  </PageWrapper>
);

export const VocabLearnPage = ({ onBack }: { onBack: () => void }) => {
  const [words, setWords] = useState([{ word: 'Astronaut', phonetic: '/ˈæstrənɔːt/', trans: '宇航员', desc: 'A person trained to travel in a spacecraft.', icon: '👨‍🚀' }]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleNext = () => {
    if (currentIndex < words.length - 1) setCurrentIndex(prev => prev + 1);
    else {
      setIsRefreshing(true);
      setTimeout(() => {
        setWords([{ word: 'Galaxy', phonetic: '/ˈɡæləksi/', trans: '星系', desc: 'A system of millions of stars.', icon: '🌌' }]);
        setCurrentIndex(0);
        setIsRefreshing(false);
      }, 800);
    }
  };

  const currentWord = words[currentIndex];

  return (
    <PageWrapper title="开始背词" onBack={onBack} bg="bg-slate-50 dark:bg-slate-900">
      <div className="p-6 h-full flex flex-col">
        <motion.div key={currentWord.word} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex-1 bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-xl border-2 border-slate-100 dark:border-slate-700 flex flex-col items-center justify-center p-8 relative">
          <button onClick={() => speakWord(currentWord.word)} className="absolute top-6 right-6 w-12 h-12 bg-blue-50 dark:bg-blue-900/30 text-blue-500 rounded-full flex items-center justify-center active:scale-95"><Volume2 size={24} /></button>
          <div className="text-center mb-8">
            <h2 className="text-5xl font-black text-slate-800 dark:text-slate-100 mb-4 tracking-tight">{currentWord.word}</h2>
            <p className="text-slate-400 font-medium text-lg">{currentWord.phonetic}</p>
          </div>
          <div className="w-32 h-32 bg-slate-50 dark:bg-slate-700 rounded-3xl flex items-center justify-center text-6xl shadow-inner mb-8">{currentWord.icon}</div>
          <div className="text-center">
            <p className="text-2xl font-bold text-slate-700 dark:text-slate-200">{currentWord.trans}</p>
            <p className="text-slate-400 font-medium mt-2 text-sm">{currentWord.desc}</p>
          </div>
          {isRefreshing && <div className="absolute inset-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-[2.5rem] flex items-center justify-center z-10"><RefreshCw className="animate-spin text-blue-500" size={40} /></div>}
        </motion.div>
        <div className="flex gap-4 mt-8">
          <button onClick={handleNext} disabled={isRefreshing} className="flex-1 bg-rose-50 dark:bg-rose-900/20 text-rose-500 font-extrabold py-4 rounded-[1.5rem] border-2 border-rose-200 dark:border-rose-800 border-b-[6px] active:border-b-2 active:translate-y-1 disabled:opacity-50">不认识</button>
          <button onClick={handleNext} disabled={isRefreshing} className="flex-1 bg-emerald-500 text-white font-extrabold py-4 rounded-[1.5rem] shadow-lg border-b-[6px] border-emerald-600 active:border-b-2 active:translate-y-1 disabled:opacity-50">认识</button>
        </div>
      </div>
    </PageWrapper>
  );
};

export const VocabBookPage = ({ onBack }: { onBack: () => void }) => {
  const [activeTab, setActiveTab] = useState('new');
  const words = [
    { word: 'Telescope', trans: '望远镜', date: '今天', icon: '🔭' },
    { word: 'Satellite', trans: '人造卫星', date: '昨天', icon: '🛰️' },
  ];

  return (
    <PageWrapper title="我的词库" onBack={onBack} bg="bg-slate-50 dark:bg-slate-900">
      <div className="px-6 pt-4 pb-6">
        <div className="flex bg-slate-200 dark:bg-slate-800 rounded-2xl p-1 mb-6">
          <button onClick={() => setActiveTab('new')} className={`flex-1 py-3 font-bold text-sm rounded-xl transition-all ${activeTab === 'new' ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 shadow-sm' : 'text-slate-500'}`}>生词本 (12)</button>
          <button onClick={() => setActiveTab('wrong')} className={`flex-1 py-3 font-bold text-sm rounded-xl transition-all ${activeTab === 'wrong' ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 shadow-sm' : 'text-slate-500'}`}>错题本 (5)</button>
        </div>
        <div className="space-y-4">
          {words.map((item, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-800 rounded-[1.5rem] p-4 flex items-center justify-between shadow-sm border border-slate-100 dark:border-slate-700">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-50 dark:bg-slate-700 rounded-xl flex items-center justify-center text-2xl">{item.icon}</div>
                <div>
                  <h4 className="font-extrabold text-slate-800 dark:text-slate-100 text-lg">{item.word}</h4>
                  <p className="text-slate-500 text-sm font-medium mt-0.5">{item.trans}</p>
                </div>
              </div>
              <button onClick={() => speakWord(item.word)} className="w-10 h-10 bg-blue-50 dark:bg-blue-900/30 text-blue-500 rounded-full flex items-center justify-center active:scale-95"><Volume2 size={20} /></button>
            </div>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
};

export const VocabQuizPage = ({ onBack }: { onBack: () => void }) => {
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const options = ['火箭', '宇航员', '外星人', '流星'];
  const correctOpt = 1;

  const handleSelect = (idx: number) => {
    if (isAnswered) return;
    setSelectedOpt(idx);
    setIsAnswered(true);
  };

  return (
    <PageWrapper title="词汇测验" onBack={onBack} bg="bg-slate-50 dark:bg-slate-900">
      <div className="p-6 h-full flex flex-col">
        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mb-8"><div className="bg-blue-500 rounded-full h-2 w-1/5 transition-all"></div></div>
        <div className="flex-1">
          <h2 className="text-3xl font-black text-slate-800 dark:text-slate-100 text-center mb-10">Astronaut</h2>
          <div className="space-y-4">
            {options.map((opt, idx) => {
              let btnClass = "bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 text-slate-700 dark:text-slate-200";
              if (isAnswered) {
                if (idx === correctOpt) btnClass = "bg-emerald-50 dark:bg-emerald-900/30 border-emerald-400 text-emerald-600 dark:text-emerald-400";
                else if (idx === selectedOpt) btnClass = "bg-rose-50 dark:bg-rose-900/30 border-rose-400 text-rose-600 dark:text-rose-400";
              } else if (selectedOpt === idx) {
                btnClass = "border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400";
              }
              return (
                <button key={idx} onClick={() => handleSelect(idx)} className={`w-full py-5 rounded-[1.5rem] font-bold text-lg transition-all ${btnClass} ${!isAnswered && 'active:scale-[0.98]'}`}>
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
        {isAnswered && (
          <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mt-8">
            <button className="w-full bg-blue-500 text-white font-extrabold py-4 rounded-[1.5rem] shadow-lg border-b-[6px] border-blue-600 active:border-b-2 active:translate-y-1">下一题</button>
          </motion.div>
        )}
      </div>
    </PageWrapper>
  );
};