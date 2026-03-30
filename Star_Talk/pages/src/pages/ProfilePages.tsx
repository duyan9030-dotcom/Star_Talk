import React, { useState } from "react";
import {
  Moon,
  BookOpen,
  Lock,
  Bell,
  Trash2,
  LogOut,
  Camera,
  ChevronRight,
  MessageCircle,
  ShieldCheck,
  Check,
  Loader2,
} from "lucide-react";
import { PageWrapper, Toggle } from "../components/Common";

export const SettingsPage = ({
  onBack,
  onLogout,
  navigate,
  darkMode,
  setDarkMode,
  eyeCareMode,
  setEyeCareMode,
  key,
}: {
  onBack: () => void;
  onLogout: () => void;
  navigate: (id: string) => void;
  darkMode: boolean;
  setDarkMode: (v: boolean) => void;
  eyeCareMode: boolean;
  setEyeCareMode: (v: boolean) => void;
  key?: string;
}) => {
  const NavItem = ({ icon, label, onClick }: any) => (
    <div
      onClick={onClick}
      className="flex items-center justify-between p-4 border-b border-slate-50 dark:border-slate-700/50 cursor-pointer rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-700/50"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-slate-50 dark:bg-slate-700 rounded-full flex items-center justify-center">
          {icon}
        </div>
        <span className="font-bold text-slate-700 dark:text-slate-200">
          {label}
        </span>
      </div>
      <ChevronRight size={18} className="text-slate-400" />
    </div>
  );

  const ToggleItem = ({ icon, label, checked, onChange }: any) => (
    <div className="flex items-center justify-between p-4 border-b border-slate-50 dark:border-slate-700/50 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-700/50">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-slate-50 dark:bg-slate-700 rounded-full flex items-center justify-center">
          {icon}
        </div>
        <span className="font-bold text-slate-700 dark:text-slate-200">
          {label}
        </span>
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  );

  const [darkModeSchedule, setDarkModeSchedule] = useState<'manual' | 'auto' | 'schedule'>('manual');
  const [scheduleStart, setScheduleStart] = useState('21:00');
  const [scheduleEnd, setScheduleEnd] = useState('08:00');
  const [cacheSize, setCacheSize] = useState(128);

  const ToggleItem2 = ({ icon, label, checked, onChange, subtitle }: any) => (
    <div className="flex items-center justify-between p-4 border-b border-slate-50 dark:border-slate-700/50 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
      <div className="flex items-center gap-3 flex-1">
        <div className="w-10 h-10 bg-slate-50 dark:bg-slate-700 rounded-full flex items-center justify-center">
          {icon}
        </div>
        <div>
          <span className="font-bold text-slate-700 dark:text-slate-200 block">
            {label}
          </span>
          {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
        </div>
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  );

  return (
    <PageWrapper title="设置" onBack={onBack}>
      <div className="p-6 space-y-6 pb-10">
        {/* 显示设置 */}
        <div className="bg-white dark:bg-slate-800 rounded-[2rem] p-2 shadow-sm border border-slate-100 dark:border-slate-700">
          <h3 className="text-sm font-bold text-slate-500 px-4 pt-4 mb-2">🌙 显示设置</h3>
          <ToggleItem2
            icon={<Moon size={20} className="text-indigo-500" />}
            label="深色模式"
            subtitle={darkMode ? '已启用深色主题' : '亮色主题中'}
            checked={darkMode}
            onChange={setDarkMode}
          />
          {darkMode && (
            <div className="px-4 py-4 border-b border-slate-50 dark:border-slate-700/50">
              <label className="text-xs font-bold text-slate-500 mb-3 block">深色模式方案</label>
              <div className="space-y-3">
                <button
                  onClick={() => setDarkModeSchedule('manual')}
                  className={`w-full p-3 rounded-lg text-left font-bold text-sm transition-all ${
                    darkModeSchedule === 'manual'
                      ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 border-2 border-indigo-400'
                      : 'bg-slate-50 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-2 border-slate-100 dark:border-slate-600'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {darkModeSchedule === 'manual' && <Check size={16} />}
                    手动切换
                  </span>
                </button>
                <button
                  onClick={() => setDarkModeSchedule('auto')}
                  className={`w-full p-3 rounded-lg text-left font-bold text-sm transition-all ${
                    darkModeSchedule === 'auto'
                      ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 border-2 border-indigo-400'
                      : 'bg-slate-50 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-2 border-slate-100 dark:border-slate-600'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {darkModeSchedule === 'auto' && <Check size={16} />}
                    自动（跟随系统）
                  </span>
                </button>
                <button
                  onClick={() => setDarkModeSchedule('schedule')}
                  className={`w-full p-3 rounded-lg text-left font-bold text-sm transition-all ${
                    darkModeSchedule === 'schedule'
                      ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 border-2 border-indigo-400'
                      : 'bg-slate-50 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-2 border-slate-100 dark:border-slate-600'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {darkModeSchedule === 'schedule' && <Check size={16} />}
                    定时切换
                  </span>
                </button>
              </div>
              {darkModeSchedule === 'schedule' && (
                <div className="mt-4 space-y-3">
                  <div>
                    <label className="text-xs font-bold text-slate-500 mb-2 block">启用时间</label>
                    <input
                      type="time"
                      value={scheduleStart}
                      onChange={(e) => setScheduleStart(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-700 border-2 border-slate-100 dark:border-slate-600 rounded-lg py-2 px-3 font-bold text-slate-800 dark:text-slate-200 outline-none focus:border-indigo-400"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 mb-2 block">关闭时间</label>
                    <input
                      type="time"
                      value={scheduleEnd}
                      onChange={(e) => setScheduleEnd(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-700 border-2 border-slate-100 dark:border-slate-600 rounded-lg py-2 px-3 font-bold text-slate-800 dark:text-slate-200 outline-none focus:border-indigo-400"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
          <ToggleItem2
            icon={<Moon size={20} className="text-emerald-500" />}
            label="护眼模式"
            subtitle={eyeCareMode ? '降低蓝光伤害' : '显示器蓝光未过滤'}
            checked={eyeCareMode}
            onChange={setEyeCareMode}
          />
        </div>

        {/* 功能设置 */}
        <div className="bg-white dark:bg-slate-800 rounded-[2rem] p-2 shadow-sm border border-slate-100 dark:border-slate-700">
          <h3 className="text-sm font-bold text-slate-500 px-4 pt-4 mb-2">⚙️ 功能设置</h3>
          <NavItem
            icon={<BookOpen size={20} className="text-blue-500" />}
            label="学习设置"
            onClick={() => navigate("learning-settings")}
          />
          <NavItem
            icon={<Lock size={20} className="text-rose-500" />}
            label="家长控制"
            onClick={() => navigate("parent-settings")}
          />
          <NavItem
            icon={<Bell size={20} className="text-amber-500" />}
            label="消息通知"
            onClick={() => navigate("notifications")}
          />
        </div>

        {/* 数据管理 */}
        <div className="bg-white dark:bg-slate-800 rounded-[2rem] p-2 shadow-sm border border-slate-100 dark:border-slate-700">
          <h3 className="text-sm font-bold text-slate-500 px-4 pt-4 mb-2">💾 数据管理</h3>
          <div className="flex items-center justify-between p-4 border-b border-slate-50 dark:border-slate-700/50 cursor-pointer rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-50 dark:bg-slate-700 rounded-full flex items-center justify-center">
                <Trash2 size={20} className="text-slate-500" />
              </div>
              <div>
                <span className="font-bold text-slate-700 dark:text-slate-200 block">
                  清除缓存
                </span>
                <p className="text-xs text-slate-400 mt-1">{cacheSize} MB</p>
              </div>
            </div>
            <button
              onClick={() => setCacheSize(0)}
              className="bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 px-3 py-1 rounded-lg text-xs font-bold active:scale-95 transition-transform"
            >
              清除
            </button>
          </div>
          <div className="flex items-center justify-between p-4 cursor-pointer rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-50 dark:bg-slate-700 rounded-full flex items-center justify-center">
                <MessageCircle size={20} className="text-slate-500" />
              </div>
              <div>
                <span className="font-bold text-slate-700 dark:text-slate-200 block">
                  关于我们
                </span>
                <p className="text-xs text-slate-400 mt-1">v1.0.0</p>
              </div>
            </div>
            <ChevronRight size={18} className="text-slate-400" />
          </div>
        </div>

        {/* 退出登录 */}
        <button
          onClick={onLogout}
          className="w-full bg-white dark:bg-slate-800 text-rose-500 font-extrabold py-4 rounded-[1.5rem] border-2 border-rose-100 dark:border-rose-900/30 border-b-[6px] border-b-rose-200 dark:border-b-rose-800 flex items-center justify-center gap-2 active:translate-y-1 transition-all hover:bg-rose-50 dark:hover:bg-slate-700"
        >
          <LogOut size={20} />
          退出登录
        </button>
      </div>
    </PageWrapper>
  );
};

export const EditProfilePage = ({
  onBack,
  userProfile,
  setUserProfile,
  key,
}: {
  onBack: () => void;
  userProfile: any;
  setUserProfile: (profile: any) => void;
  key?: string;
}) => {
  const [formData, setFormData] = useState(userProfile);

  return (
    <PageWrapper
      title="编辑资料"
      onBack={onBack}
      bg="bg-white dark:bg-slate-900"
    >
      <div className="p-6 h-full flex flex-col">
        <div className="flex flex-col items-center mb-8">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-tr from-blue-100 to-indigo-100 rounded-full flex items-center justify-center text-4xl shadow-inner border-4 border-white dark:border-slate-800 shadow-lg">
              👦
            </div>
            <div className="absolute bottom-0 right-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center shadow-md border-2 border-white dark:border-slate-800">
              <Camera size={14} />
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <div>
            <label className="text-sm font-bold text-slate-500 ml-2 mb-2 block">
              昵称
            </label>
            <input
              type="text"
              value={formData.nickname}
              onChange={(e) =>
                setFormData({ ...formData, nickname: e.target.value })
              }
              className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl py-4 px-4 font-bold text-slate-800 dark:text-slate-100 outline-none focus:border-blue-400"
            />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-sm font-bold text-slate-500 ml-2 mb-2 block">
                年龄
              </label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) =>
                  setFormData({ ...formData, age: Number(e.target.value) })
                }
                className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl py-4 px-4 font-bold text-slate-800 dark:text-slate-100 outline-none focus:border-blue-400"
              />
            </div>
            <div className="flex-1">
              <label className="text-sm font-bold text-slate-500 ml-2 mb-2 block">
                年级
              </label>
              <input
                type="text"
                value={formData.grade}
                onChange={(e) =>
                  setFormData({ ...formData, grade: e.target.value })
                }
                className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl py-4 px-4 font-bold text-slate-800 dark:text-slate-100 outline-none focus:border-blue-400"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-bold text-slate-500 ml-2 mb-2 block">
              学校
            </label>
            <input
              type="text"
              value={formData.school}
              onChange={(e) =>
                setFormData({ ...formData, school: e.target.value })
              }
              placeholder="请输入学校名称"
              className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl py-4 px-4 font-bold text-slate-800 dark:text-slate-100 outline-none focus:border-blue-400"
            />
          </div>
          <div>
            <label className="text-sm font-bold text-slate-500 ml-2 mb-2 block">
              性别
            </label>
            <div className="flex gap-3">
              {["male", "female", "secret"].map((gender) => {
                const labels: Record<string, string> = {
                  male: "男生",
                  female: "女生",
                  secret: "保密",
                };
                return (
                  <button
                    key={gender}
                    onClick={() => setFormData({ ...formData, gender })}
                    className={`flex-1 py-4 rounded-2xl font-bold border-2 transition-all ${formData.gender === gender ? "border-blue-500 text-blue-500 bg-blue-50 dark:bg-blue-900/30" : "border-slate-100 dark:border-slate-700 text-slate-500 bg-slate-50 dark:bg-slate-800"}`}
                  >
                    {labels[gender]}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        <div className="mt-auto pt-8">
          <button
            onClick={() => {
              setUserProfile(formData);
              onBack();
            }}
            className="w-full bg-blue-500 text-white font-extrabold py-4 rounded-[1.5rem] border-b-[6px] border-blue-600 active:border-b-2 active:translate-y-1"
          >
            保存修改
          </button>
        </div>
      </div>
    </PageWrapper>
  );
};

export const LearningSettingsPage = ({
  onBack,
  key,
}: {
  onBack: () => void;
  key?: string;
}) => {
  const [autoPronounce, setAutoPronounce] = useState(true);
  const [showChinese, setShowChinese] = useState(true);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [learningSpeed, setLearningSpeed] = useState(3);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [dailyReminder, setDailyReminder] = useState(true);
  const [reminderTime, setReminderTime] = useState('09:00');
  const [preferences, setPreferences] = useState({
    enToZh: true,
    zhToEn: true,
    listen: true,
    spell: false,
    speak: true,
  });

  const difficultyLabels = {
    easy: '简单',
    medium: '中等',
    hard: '困难',
  };

  const speedLabels = ['慢', '较慢', '正常', '较快', '快'];

  return (
    <PageWrapper title="学习设置" onBack={onBack}>
      <div className="p-6 space-y-6 pb-10">
        {/* 基础设置 */}
        <div className="bg-white dark:bg-slate-800 rounded-[2rem] p-5 shadow-sm border border-slate-100 dark:border-slate-700">
          <h3 className="text-sm font-bold text-slate-500 mb-4">📚 基础设置</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-700 dark:text-slate-200">
                自动播放发音
              </span>
              <Toggle checked={autoPronounce} onChange={setAutoPronounce} />
            </div>
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-700 dark:text-slate-200">
                默认显示中文释义
              </span>
              <Toggle checked={showChinese} onChange={setShowChinese} />
            </div>
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-700 dark:text-slate-200">
                界面声音
              </span>
              <Toggle checked={soundEnabled} onChange={setSoundEnabled} />
            </div>
          </div>
        </div>

        {/* 学习难度 */}
        <div className="bg-white dark:bg-slate-800 rounded-[2rem] p-5 shadow-sm border border-slate-100 dark:border-slate-700">
          <h3 className="text-sm font-bold text-slate-500 mb-4">🎯 难度设置</h3>
          <div className="space-y-3">
            {Object.entries(difficultyLabels).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setDifficulty(key as 'easy' | 'medium' | 'hard')}
                className={`w-full p-4 rounded-xl font-bold text-left transition-all ${
                  difficulty === key
                    ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 border-2 border-blue-500'
                    : 'bg-slate-50 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-2 border-slate-100 dark:border-slate-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{label}</span>
                  {difficulty === key && <Check size={18} />}
                </div>
                <p className="text-xs opacity-70 mt-1">
                  {key === 'easy' && '基础词汇，语速较慢'}
                  {key === 'medium' && '标准词汇，正常语速'}
                  {key === 'hard' && '进阶词汇，较快语速'}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* 学习速度 */}
        <div className="bg-white dark:bg-slate-800 rounded-[2rem] p-5 shadow-sm border border-slate-100 dark:border-slate-700">
          <h3 className="text-sm font-bold text-slate-500 mb-4">⚡ 学习速度</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center mb-3">
              <span className="font-bold text-slate-700 dark:text-slate-200">
                {speedLabels[learningSpeed - 1]}
              </span>
              <span className="text-sm text-slate-500">{learningSpeed}/5</span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              value={learningSpeed}
              onChange={(e) => setLearningSpeed(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full appearance-none cursor-pointer accent-blue-500"
            />
            <div className="flex justify-between text-xs text-slate-400 font-bold">
              <span>慢</span>
              <span>快</span>
            </div>
          </div>
        </div>

        {/* 学习提醒 */}
        <div className="bg-white dark:bg-slate-800 rounded-[2rem] p-5 shadow-sm border border-slate-100 dark:border-slate-700">
          <h3 className="text-sm font-bold text-slate-500 mb-4">🔔 学习提醒</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-700 dark:text-slate-200">
                每日提醒
              </span>
              <Toggle checked={dailyReminder} onChange={setDailyReminder} />
            </div>
            {dailyReminder && (
              <div>
                <label className="text-sm font-bold text-slate-500 mb-2 block">
                  提醒时间
                </label>
                <input
                  type="time"
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-700 border-2 border-slate-100 dark:border-slate-600 rounded-xl py-3 px-4 font-bold text-slate-800 dark:text-slate-200 outline-none focus:border-blue-400"
                />
              </div>
            )}
          </div>
        </div>

        {/* 学习题型偏好 */}
        <div className="bg-white dark:bg-slate-800 rounded-[2rem] p-5 shadow-sm border border-slate-100 dark:border-slate-700">
          <h3 className="text-sm font-bold text-slate-500 mb-4">
            📋 学习题型偏好
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-700 dark:text-slate-200 block">
                  看英选汉
                </span>
                <p className="text-xs text-slate-400 mt-1">选择英文单词的汉语含义</p>
              </div>
              <Toggle
                checked={preferences.enToZh}
                onChange={(v) => setPreferences({ ...preferences, enToZh: v })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-700 dark:text-slate-200 block">
                  看汉选英
                </span>
                <p className="text-xs text-slate-400 mt-1">选择汉语对应的英文单词</p>
              </div>
              <Toggle
                checked={preferences.zhToEn}
                onChange={(v) => setPreferences({ ...preferences, zhToEn: v })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-700 dark:text-slate-200 block">
                  听音辨意
                </span>
                <p className="text-xs text-slate-400 mt-1">根据发音选择正确含义</p>
              </div>
              <Toggle
                checked={preferences.listen}
                onChange={(v) => setPreferences({ ...preferences, listen: v })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-700 dark:text-slate-200 block">
                  拼写填空
                </span>
                <p className="text-xs text-slate-400 mt-1">根据提示完成单词拼写</p>
              </div>
              <Toggle
                checked={preferences.spell}
                onChange={(v) => setPreferences({ ...preferences, spell: v })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-700 dark:text-slate-200 block">
                  语音跟读
                </span>
                <p className="text-xs text-slate-400 mt-1">跟读发音，练习口语</p>
              </div>
              <Toggle
                checked={preferences.speak}
                onChange={(v) => setPreferences({ ...preferences, speak: v })}
              />
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export const ParentSettingsPage = ({
  onBack,
  key,
}: {
  onBack: () => void;
  key?: string;
}) => {
  const [isVerified, setIsVerified] = useState(false);
  const [verificationAttempts, setVerificationAttempts] = useState(0);
  const [dailyGoal, setDailyGoal] = useState(20);
  const [screenTimeLimit, setScreenTimeLimit] = useState(120);
  const [studyStartTime, setStudyStartTime] = useState('08:00');
  const [studyEndTime, setStudyEndTime] = useState('21:00');
  const [appLockEnabled, setAppLockEnabled] = useState(false);
  const [preferences, setPreferences] = useState({
    basic: true,
    daily: true,
    phonics: true,
    advanced: false,
  });

  const handleWrongAnswer = () => {
    setVerificationAttempts(prev => prev + 1);
  };

  if (!isVerified) {
    return (
      <PageWrapper title="家长验证" onBack={onBack}>
        <div className="p-6 h-full flex flex-col items-center justify-center text-center">
          <div className="w-24 h-24 bg-rose-100 dark:bg-rose-900/30 rounded-full flex items-center justify-center mb-6">
            <Lock size={48} className="text-rose-500" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 mb-2">
            家长身份验证
          </h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium mb-2">
            为了防止宝宝误操作，请回答以下问题
          </p>
          {verificationAttempts > 0 && (
            <p className="text-amber-600 dark:text-amber-400 font-bold text-sm mb-6">
              答错 {verificationAttempts}次，再来一次
            </p>
          )}

          <div className="text-4xl font-black text-slate-800 dark:text-slate-100 mb-10 tracking-widest">
            12 × 3 = ?
          </div>

          <div className="grid grid-cols-2 gap-4 w-full">
            {[32, 36, 42, 24].map((ans) => (
              <button
                key={ans}
                onClick={() => {
                  if (ans === 36) {
                    setIsVerified(true);
                  } else {
                    handleWrongAnswer();
                  }
                }}
                className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-extrabold py-5 rounded-2xl text-xl active:scale-95 transition-transform hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                {ans}
              </button>
            ))}
          </div>

          <p className="text-xs text-slate-400 mt-8">
            💡 家长验证确保只有家长可以修改学习内容和时长限制
          </p>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper title="家长控制" onBack={onBack}>
      <div className="p-6 space-y-6 pb-10">
        {/* 守护状态 */}
        <div className="bg-gradient-to-br from-rose-400 via-pink-500 to-orange-500 rounded-[2rem] p-6 text-white shadow-lg border-2 border-rose-200/50">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-black mb-1">🛡️ 家长守护中</h3>
              <p className="text-rose-100 font-medium text-sm">
                您正在管理宝宝的学习内容和时长
              </p>
            </div>
            <ShieldCheck size={32} className="text-white" />
          </div>
        </div>

        {/* 每日学习目标 */}
        <div className="bg-white dark:bg-slate-800 rounded-[2rem] p-5 shadow-sm border border-slate-100 dark:border-slate-700">
          <h3 className="text-sm font-bold text-slate-500 mb-4">📚 每日学习目标</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-slate-700 dark:text-slate-200">
                  每日测验数量
                </span>
                <span className="text-blue-500 font-black text-xl">
                  {dailyGoal} 个
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="50"
                step="5"
                value={dailyGoal}
                onChange={(e) => setDailyGoal(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-xs text-slate-400 font-bold mt-2">
                <span>较少</span>
                <span>较多</span>
              </div>
            </div>
          </div>
        </div>

        {/* 屏幕时间控制 */}
        <div className="bg-white dark:bg-slate-800 rounded-[2rem] p-5 shadow-sm border border-slate-100 dark:border-slate-700">
          <h3 className="text-sm font-bold text-slate-500 mb-4">⏱️ 屏幕时间控制</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-slate-700 dark:text-slate-200">
                  每日屏幕时间限制
                </span>
                <span className="text-purple-500 font-black text-xl text-right">
                  <span className="text-lg">{screenTimeLimit}</span>
                  <span className="text-sm font-bold ml-1">分钟</span>
                </span>
              </div>
              <input
                type="range"
                min="30"
                max="300"
                step="15"
                value={screenTimeLimit}
                onChange={(e) => setScreenTimeLimit(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
              <div className="flex justify-between text-xs text-slate-400 font-bold mt-2">
                <span>30 分钟</span>
                <span>5 小时</span>
              </div>
            </div>
          </div>
        </div>

        {/* 学习时间段 */}
        <div className="bg-white dark:bg-slate-800 rounded-[2rem] p-5 shadow-sm border border-slate-100 dark:border-slate-700">
          <h3 className="text-sm font-bold text-slate-500 mb-4">🕐 学习时间段</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-bold text-slate-500 block mb-2">
                允许学习开始时间
              </label>
              <input
                type="time"
                value={studyStartTime}
                onChange={(e) => setStudyStartTime(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-700 border-2 border-slate-100 dark:border-slate-600 rounded-xl py-3 px-4 font-bold text-slate-800 dark:text-slate-200 outline-none focus:border-emerald-400"
              />
            </div>
            <div>
              <label className="text-sm font-bold text-slate-500 block mb-2">
                允许学习结束时间
              </label>
              <input
                type="time"
                value={studyEndTime}
                onChange={(e) => setStudyEndTime(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-700 border-2 border-slate-100 dark:border-slate-600 rounded-xl py-3 px-4 font-bold text-slate-800 dark:text-slate-200 outline-none focus:border-emerald-400"
              />
            </div>
            <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-3">
              <p className="text-xs text-emerald-700 dark:text-emerald-300 font-medium">
                ✓ 允许学习时间: {studyStartTime} - {studyEndTime}
              </p>
            </div>
          </div>
        </div>

        {/* 学习内容限制 */}
        <div className="bg-white dark:bg-slate-800 rounded-[2rem] p-5 shadow-sm border border-slate-100 dark:border-slate-700">
          <h3 className="text-sm font-bold text-slate-500 mb-4">
            📖 学习内容范围
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-700 dark:text-slate-200 block">
                  基础词汇
                </span>
                <p className="text-xs text-slate-400 mt-1">颜色、数字、动物</p>
              </div>
              <Toggle
                checked={preferences.basic}
                onChange={(v) => setPreferences({ ...preferences, basic: v })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-700 dark:text-slate-200 block">
                  日常短语
                </span>
                <p className="text-xs text-slate-400 mt-1">打招呼、点餐、问路</p>
              </div>
              <Toggle
                checked={preferences.daily}
                onChange={(v) => setPreferences({ ...preferences, daily: v })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-700 dark:text-slate-200 block">
                  自然拼读
                </span>
                <p className="text-xs text-slate-400 mt-1">Phonics 字母发音</p>
              </div>
              <Toggle
                checked={preferences.phonics}
                onChange={(v) => setPreferences({ ...preferences, phonics: v })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-700 dark:text-slate-200 block">
                  进阶词汇
                </span>
                <p className="text-xs text-slate-400 mt-1">科学、艺术、文学</p>
              </div>
              <Toggle
                checked={preferences.advanced}
                onChange={(v) =>
                  setPreferences({ ...preferences, advanced: v })
                }
              />
            </div>
          </div>
        </div>

        {/* 应用锁 */}
        <div className="bg-white dark:bg-slate-800 rounded-[2rem] p-5 shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-500 mb-2">🔒 应用锁定</h3>
              <p className="text-xs text-slate-400">
                防止宝宝修改家长控制设置
              </p>
            </div>
            <Toggle checked={appLockEnabled} onChange={setAppLockEnabled} />
          </div>
        </div>

        {/* 提示信息 */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-[1.5rem] p-4">
          <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
            💡 提示：所有设置更改需要通过家长验证。屏幕时间超限时，应用将自动锁定。
          </p>
        </div>
      </div>
    </PageWrapper>
  );
};

export const FeedbackPage = ({
  onBack,
  key,
}: {
  onBack: () => void;
  key?: string;
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => {
        onBack();
      }, 1500);
    }, 1000);
  };

  return (
    <PageWrapper title="意见反馈" onBack={onBack}>
      <div className="p-6 flex flex-col h-full">
        {isSuccess ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-500 rounded-full flex items-center justify-center mb-4">
              <Check size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">反馈提交成功！</h3>
            <p className="text-slate-500 mt-2">感谢您的宝贵意见</p>
          </div>
        ) : (
          <>
            <textarea
              placeholder="在这里写下你的建议或遇到的问题..."
              className="w-full h-48 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-[2rem] p-6 font-medium text-slate-700 dark:text-slate-200 outline-none focus:border-blue-400 resize-none mb-6"
            ></textarea>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full bg-blue-500 text-white font-extrabold py-4 rounded-[1.5rem] shadow-lg border-b-[6px] border-blue-600 mt-auto active:translate-y-1 flex justify-center items-center gap-2 disabled:opacity-70 disabled:active:translate-y-0 disabled:border-b-[6px]"
            >
              {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : null}
              {isSubmitting ? "提交中..." : "提交反馈"}
            </button>
          </>
        )}
      </div>
    </PageWrapper>
  );
};

export const NotificationsPage = ({
  onBack,
  key,
}: {
  onBack: () => void;
  key?: string;
}) => {
  const notifications = [
    { id: 1, title: "系统通知", content: "欢迎来到 Star Talk！", time: "刚刚", read: false },
    { id: 2, title: "学习提醒", content: "今天的单词还没背哦，快去学习吧！", time: "2小时前", read: false },
    { id: 3, title: "获得勋章", content: "恭喜你获得了「7天连胜」勋章！", time: "昨天", read: true },
  ];

  return (
    <PageWrapper title="消息通知" onBack={onBack}>
      <div className="p-6 space-y-4">
        {notifications.map(n => (
          <div key={n.id} className={`bg-white dark:bg-slate-800 rounded-[1.5rem] p-5 shadow-sm border ${n.read ? 'border-slate-100 dark:border-slate-700 opacity-70' : 'border-blue-100 dark:border-blue-900/30'}`}>
             <div className="flex justify-between items-start mb-2">
               <h3 className="font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                 {!n.read && <span className="w-2 h-2 rounded-full bg-blue-500"></span>}
                 {n.title}
               </h3>
               <span className="text-xs font-bold text-slate-400">{n.time}</span>
             </div>
             <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{n.content}</p>
          </div>
        ))}
      </div>
    </PageWrapper>
  );
};

export const BadgesPage = ({
  onBack,
  key,
}: {
  onBack: () => void;
  key?: string;
}) => {
  const badges = [
    { id: 1, icon: "🔥", name: "7天连胜", desc: "连续学习7天", unlocked: true },
    {
      id: 2,
      icon: "🌟",
      name: "词汇新星",
      desc: "掌握100个单词",
      unlocked: true,
    },
    {
      id: 3,
      icon: "👑",
      name: "对话王者",
      desc: "完成50次AI对话",
      unlocked: true,
    },
    {
      id: 4,
      icon: "🎯",
      name: "百发百中",
      desc: "测验满分10次",
      unlocked: false,
    },
  ];

  return (
    <PageWrapper title="我的勋章" onBack={onBack}>
      <div className="p-6 grid grid-cols-2 gap-4">
        {badges.map((badge) => (
          <div
            key={badge.id}
            className={`bg-white dark:bg-slate-800 rounded-[2rem] p-6 flex flex-col items-center text-center border-2 border-slate-100 dark:border-slate-700 ${badge.unlocked ? "" : "opacity-50 grayscale"}`}
          >
            <div
              className={`w-20 h-20 rounded-full flex items-center justify-center text-4xl mb-4 shadow-inner ${badge.unlocked ? "bg-amber-100 border-4 border-amber-200" : "bg-slate-100 border-4 border-slate-200"}`}
            >
              {badge.icon}
            </div>
            <h4 className="font-extrabold text-slate-800 dark:text-slate-100">
              {badge.name}
            </h4>
            <p className="text-[10px] font-bold text-slate-400 mt-1">
              {badge.desc}
            </p>
          </div>
        ))}
      </div>
    </PageWrapper>
  );
};
