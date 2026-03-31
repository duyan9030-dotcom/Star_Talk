import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronLeft,
  Users,
  BarChart3,
  BookOpen,
  Settings,
  Shield,
  Trash2,
  Edit,
  Plus,
  Search,
  LogOut,
} from "lucide-react";
import { PageWrapper } from "../components/Common";

export const AdminDashboardPage = ({
  onBack,
  navigate,
}: {
  onBack: () => void;
  navigate: (route: string, params?: any) => void;
}) => {
  return (
    <PageWrapper title="管理员控制面板" onBack={onBack}>
      <div className="p-6 space-y-4">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">
            管理员控制面板
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            系统管理和数据统计
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <AdminCard
            icon={<Users size={28} />}
            title="用户管理"
            subtitle="管理学生和家长账户"
            color="blue"
            onClick={() => navigate("admin-users")}
          />
          <AdminCard
            icon={<BarChart3 size={28} />}
            title="学习统计"
            subtitle="查看学习数据和进度"
            color="emerald"
            onClick={() => navigate("admin-stats")}
          />
          <AdminCard
            icon={<BookOpen size={28} />}
            title="内容管理"
            subtitle="管理词库和题目"
            color="purple"
            onClick={() => navigate("admin-content")}
          />
          <AdminCard
            icon={<Settings size={28} />}
            title="系统设置"
            subtitle="应用配置和参数"
            color="amber"
            onClick={() => navigate("admin-settings")}
          />
        </div>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className="w-full mt-8 bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
        >
          <LogOut size={20} />
          退出管理员模式
        </motion.button>
      </div>
    </PageWrapper>
  );
};

const AdminCard = ({
  icon,
  title,
  subtitle,
  color,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  color: string;
  onClick: () => void;
}) => {
  const colorMap: Record<string, string> = {
    blue: "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800",
    emerald:
      "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
    purple:
      "bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800",
    amber:
      "bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800",
  };

  return (
    <motion.div
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`${colorMap[color]} border-2 rounded-2xl p-4 cursor-pointer transition-all active:shadow-lg`}
    >
      <div className="flex items-center justify-center mb-3">{icon}</div>
      <h3 className="font-bold text-center">{title}</h3>
      <p className="text-xs text-center opacity-75 mt-1">{subtitle}</p>
    </motion.div>
  );
};

export const AdminUsersPage = ({
  onBack,
}: {
  onBack: () => void;
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users] = useState([
    { id: 1, name: "张三", role: "学生", grade: "三年级", status: "active" },
    { id: 2, name: "李四", role: "学生", grade: "四年级", status: "active" },
    { id: 3, name: "王五", role: "家长", grade: "-", status: "active" },
    { id: 4, name: "赵六", role: "学生", grade: "二年级", status: "inactive" },
  ]);

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.includes(searchTerm)
  );

  return (
    <PageWrapper title="用户管理" onBack={onBack}>
      <div className="p-6 space-y-4">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="搜索用户..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border-2 border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-400"
            />
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition-colors"
          >
            <Plus size={20} />
          </motion.button>
        </div>

        <div className="space-y-2">
          {filteredUsers.map((user) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-slate-800 rounded-xl p-4 flex items-center justify-between border border-slate-200 dark:border-slate-700"
            >
              <div className="flex-1">
                <p className="font-bold text-slate-800 dark:text-slate-100">
                  {user.name}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {user.role}{user.grade !== "-" && ` · ${user.grade}`}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    user.status === "active"
                      ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300"
                      : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                  }`}
                >
                  {user.status === "active" ? "活跃" : "停用"}
                </span>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <Edit size={18} className="text-slate-500" />
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                >
                  <Trash2 size={18} className="text-red-500" />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
};

export const AdminStatsPage = ({
  onBack,
}: {
  onBack: () => void;
}) => {
  const stats = [
    { label: "总用户数", value: "1,234", color: "blue" },
    { label: "活跃用户", value: "856", color: "emerald" },
    { label: "完成学习", value: "12,456", color: "purple" },
    { label: "总学习时长", value: "45.8h", color: "amber" },
  ];

  return (
    <PageWrapper title="学习统计" onBack={onBack}>
      <div className="p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700"
            >
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                {stat.label}
              </p>
              <p className="text-3xl font-bold text-slate-800 dark:text-slate-100">
                {stat.value}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
          <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-4">
            学习趋势
          </h3>
          <div className="h-40 bg-gradient-to-b from-blue-200 to-blue-50 dark:from-blue-900/30 dark:to-transparent rounded-lg flex items-center justify-center">
            <p className="text-slate-500">图表数据加载中...</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-4">
            <p className="text-sm text-emerald-600 dark:text-emerald-400">
              今日新注册
            </p>
            <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">
              23
            </p>
          </div>
          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4">
            <p className="text-sm text-amber-600 dark:text-amber-400">
              平均完成率
            </p>
            <p className="text-2xl font-bold text-amber-700 dark:text-amber-300">
              78%
            </p>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export const AdminContentPage = ({
  onBack,
}: {
  onBack: () => void;
}) => {
  const [contentList] = useState([
    { id: 1, name: "小学三年级词库", type: "词库", items: 500, status: "上线" },
    { id: 2, name: "每日挑战题库", type: "题库", items: 1200, status: "上线" },
    { id: 3, name: "口语练习模块", type: "课程", items: 48, status: "草稿" },
  ]);

  return (
    <PageWrapper title="内容管理" onBack={onBack}>
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            内容列表
          </h2>
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition-colors"
          >
            <Plus size={20} />
          </motion.button>
        </div>

        <div className="space-y-3">
          {contentList.map((content) => (
            <motion.div
              key={content.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex-1">
                  <p className="font-bold text-slate-800 dark:text-slate-100">
                    {content.name}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    类型：{content.type} · 条目数：{content.items}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    content.status === "上线"
                      ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300"
                      : "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300"
                  }`}
                >
                  {content.status}
                </span>
              </div>
              <div className="flex gap-2 mt-3">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  className="flex-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 py-2 rounded-lg font-medium text-sm hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                >
                  编辑
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  className="flex-1 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 py-2 rounded-lg font-medium text-sm hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                >
                  删除
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
};

export const AdminSettingsPage = ({
  onBack,
}: {
  onBack: () => void;
}) => {
  const [settings, setSettings] = useState({
    maintenanceMode: false,
    allowRegistration: true,
    enableAnalytics: true,
    autoBackup: true,
  });

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <PageWrapper title="系统设置" onBack={onBack}>
      <div className="p-6 space-y-4">
        <div className="space-y-3">
          {Object.entries(settings).map(([key, value]) => (
            <motion.div
              key={key}
              className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 flex items-center justify-between"
            >
              <span className="font-medium text-slate-800 dark:text-slate-100">
                {key.replace(/([A-Z])/g, " $1").trim()}
              </span>
              <button
                onClick={() => toggleSetting(key as keyof typeof settings)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  value ? "bg-blue-500" : "bg-slate-300 dark:bg-slate-600"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    value ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </motion.div>
          ))}
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/30 rounded-xl p-4 border-2 border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            <span className="font-bold">提示：</span>
            维护模式启用时，普通用户将无法访问系统。
          </p>
        </div>

        <motion.button
          whileTap={{ scale: 0.95 }}
          className="w-full bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-100 font-bold py-3 px-4 rounded-xl transition-colors hover:bg-slate-300 dark:hover:bg-slate-600"
        >
          备份系统数据
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          className="w-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 font-bold py-3 px-4 rounded-xl transition-colors hover:bg-red-200 dark:hover:bg-red-900/50"
        >
          恢复系统设置
        </motion.button>
      </div>
    </PageWrapper>
  );
};
