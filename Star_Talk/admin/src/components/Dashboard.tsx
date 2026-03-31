import React from 'react';
import { Users, UserPlus, Cpu, Zap, Activity, AlertTriangle, Clock, BookOpen } from 'lucide-react';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

const statCards = [
  { title: '今日活跃用户 (DAU)', value: '18,240', trend: '+12%', icon: Users, color: 'text-blue-500', bg: 'bg-blue-50' },
  { title: '新增用户数', value: '1,204', trend: '+5%', icon: UserPlus, color: 'text-green-500', bg: 'bg-green-50' },
  { title: 'AI 接口总调用', value: '342.5K', trend: '+18%', icon: Cpu, color: 'text-purple-500', bg: 'bg-purple-50' },
  { title: 'Token 消耗预估', value: '45.2M', trend: '+22%', icon: Zap, color: 'text-orange-500', bg: 'bg-orange-50' },
];

const learningTimeData = [
  { name: '周一', 时长: 25 }, { name: '周二', 时长: 28 }, { name: '周三', 时长: 24 },
  { name: '周四', 时长: 30 }, { name: '周五', 时长: 35 }, { name: '周六', 时长: 45 }, { name: '周日', 时长: 42 },
];

const topWordsData = [
  { name: 'hello', 次数: 1240 }, { name: 'world', 次数: 1100 }, { name: 'happy', 次数: 980 },
  { name: 'friend', 次数: 850 }, { name: 'family', 次数: 720 }, { name: 'school', 次数: 650 },
  { name: 'book', 次数: 540 }, { name: 'cat', 次数: 490 }, { name: 'dog', 次数: 410 }, { name: 'apple', 次数: 380 },
];

const ageData = [
  { name: '3-5岁 (启蒙)', value: 40 },
  { name: '6-8岁 (少儿)', value: 45 },
  { name: '9-12岁 (进阶)', value: 15 },
];
const COLORS = ['#fac858', '#91cc75', '#5470c6'];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* 核心指标监控 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
            <div>
              <p className="text-sm text-gray-500 mb-1">{card.title}</p>
              <div className="flex items-baseline">
                <h3 className="text-2xl font-bold text-gray-800">{card.value}</h3>
                <span className="ml-2 text-xs font-medium text-green-500 bg-green-50 px-1.5 py-0.5 rounded">{card.trend}</span>
              </div>
            </div>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${card.bg}`}>
              <card.icon className={`w-6 h-6 ${card.color}`} />
            </div>
          </div>
        ))}
      </div>

      {/* AI 状态监控 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-sm p-5 text-white flex items-center justify-between">
          <div className="flex items-center">
            <Activity className="w-8 h-8 mr-4 opacity-80" />
            <div>
              <p className="text-blue-100 text-sm">实时接口响应时间</p>
              <h4 className="text-2xl font-bold">245 <span className="text-sm font-normal opacity-80">ms</span></h4>
            </div>
          </div>
          <div className="h-12 w-32 opacity-50">
            {/* 简易波形图示意 */}
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={[{v:240},{v:250},{v:230},{v:245},{v:260},{v:245}]}>
                <Line type="monotone" dataKey="v" stroke="#fff" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-gradient-to-r from-red-500 to-rose-600 rounded-xl shadow-sm p-5 text-white flex items-center justify-between">
          <div className="flex items-center">
            <AlertTriangle className="w-8 h-8 mr-4 opacity-80" />
            <div>
              <p className="text-red-100 text-sm">报错率 (Bad Case) 预警</p>
              <h4 className="text-2xl font-bold">0.8% <span className="text-sm font-normal opacity-80">正常范围</span></h4>
            </div>
          </div>
          <button className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors">
            查看日志
          </button>
        </div>
      </div>

      {/* 学习数据图表 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 折线图：每日平均学习时长 */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Clock className="w-5 h-5 text-blue-500 mr-2" />
              <h3 className="text-gray-800 font-semibold">每日平均学习时长</h3>
            </div>
            <span className="text-xs text-gray-400">单位：分钟</span>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={learningTimeData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#999', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#999', fontSize: 12}} dx={-10} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Line type="monotone" dataKey="时长" stroke="#3b82f6" strokeWidth={3} dot={{r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff'}} activeDot={{r: 6}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 饼图：用户年龄段分布 */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center mb-6">
            <Users className="w-5 h-5 text-green-500 mr-2" />
            <h3 className="text-gray-800 font-semibold">用户年龄段分布</h3>
          </div>
          <div className="h-64 flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={ageData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} fill="#8884d8" dataKey="value" paddingAngle={2}>
                  {ageData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} formatter={(value) => [`${value}%`, '占比']} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 柱状图：热门识别单词 Top 10 */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 lg:col-span-3">
          <div className="flex items-center mb-6">
            <BookOpen className="w-5 h-5 text-purple-500 mr-2" />
            <h3 className="text-gray-800 font-semibold">热门识别单词 Top 10</h3>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topWordsData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#666', fontSize: 12, fontWeight: 500}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#999', fontSize: 12}} dx={-10} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="次数" fill="#a855f7" radius={[4, 4, 0, 0]} barSize={32}>
                  {topWordsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index < 3 ? '#8b5cf6' : '#c084fc'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
