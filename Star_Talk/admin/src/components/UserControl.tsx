import React, { useState } from 'react';
import { Shield, Clock, FileText, User, Users, Lock, Eye } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

const radarData = [
  { subject: '词汇量', A: 120, fullMark: 150 },
  { subject: '发音准确', A: 98, fullMark: 150 },
  { subject: '听力理解', A: 86, fullMark: 150 },
  { subject: '口语流利', A: 99, fullMark: 150 },
  { subject: '学习时长', A: 85, fullMark: 150 },
  { subject: '互动积极', A: 65, fullMark: 150 },
];

export default function UserControl({ activeMenu }: { activeMenu: string }) {
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);

  if (activeMenu === 'students') {
    return (
      <div className="flex gap-6">
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">学生账号管理</h2>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-100">
                <th className="p-4 font-medium">昵称</th>
                <th className="p-4 font-medium">年龄</th>
                <th className="p-4 font-medium">当前等级</th>
                <th className="p-4 font-medium">累计学习时长</th>
                <th className="p-4 font-medium">操作</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-100">
              {[
                { id: '1', name: '小明 (Ming)', age: 6, level: 'L2 基础', time: '124 小时' },
                { id: '2', name: 'Lily', age: 4, level: 'L1 启蒙', time: '36 小时' },
                { id: '3', name: 'Tom', age: 9, level: 'L3 进阶', time: '210 小时' },
              ].map((student) => (
                <tr key={student.id} className="hover:bg-gray-50/50">
                  <td className="p-4 font-medium text-gray-800">{student.name}</td>
                  <td className="p-4 text-gray-600">{student.age}岁</td>
                  <td className="p-4 text-gray-600"><span className="bg-blue-50 text-blue-600 px-2 py-1 rounded text-xs">{student.level}</span></td>
                  <td className="p-4 text-gray-500">{student.time}</td>
                  <td className="p-4">
                    <button 
                      onClick={() => setSelectedStudent(student.id)}
                      className="text-blue-600 hover:underline flex items-center text-xs font-medium"
                    >
                      <Eye className="w-3 h-3 mr-1" /> 能力雷达图
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* 雷达图侧边栏 */}
        {selectedStudent && (
          <div className="w-80 bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center">
            <h3 className="font-semibold text-gray-800 mb-2">能力雷达图</h3>
            <p className="text-xs text-gray-400 mb-6">基于近30天学习数据生成</p>
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#6b7280', fontSize: 12 }} />
                  <Radar name="Student" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.5} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <button onClick={() => setSelectedStudent(null)} className="mt-4 text-sm text-gray-500 hover:text-gray-800">关闭</button>
          </div>
        )}
      </div>
    );
  }

  if (activeMenu === 'parents') {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">家长账号管理</h2>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-100">
              <th className="p-4 font-medium">家长手机号</th>
              <th className="p-4 font-medium">绑定孩子 (昵称)</th>
              <th className="p-4 font-medium">绑定状态</th>
              <th className="p-4 font-medium">操作</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-gray-100">
            <tr className="hover:bg-gray-50/50">
              <td className="p-4 font-medium text-gray-800">138****1234</td>
              <td className="p-4 text-gray-600">小明 (Ming)</td>
              <td className="p-4"><span className="text-green-600 bg-green-50 px-2 py-1 rounded text-xs">已审核</span></td>
              <td className="p-4">
                <button className="text-red-500 hover:underline flex items-center text-xs font-medium">
                  <Lock className="w-3 h-3 mr-1" /> 重置密码
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  if (activeMenu === 'anti-addiction') {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 max-w-2xl mx-auto">
        <div className="flex items-center mb-6">
          <Shield className="w-6 h-6 text-blue-500 mr-3" />
          <h2 className="text-xl font-semibold text-gray-800">防沉迷与权限设置</h2>
        </div>
        <div className="space-y-6">
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <label className="flex items-center justify-between mb-2">
              <span className="font-medium text-gray-700">每日最大使用时长</span>
              <input type="checkbox" className="toggle-checkbox" defaultChecked />
            </label>
            <div className="flex items-center space-x-2 mt-3">
              <input type="number" defaultValue="45" className="w-24 px-3 py-1.5 border border-gray-300 rounded outline-none" />
              <span className="text-gray-500 text-sm">分钟 / 天</span>
            </div>
            <p className="text-xs text-gray-400 mt-2">超过此时长后，系统将锁定学习模块并提示休息。</p>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <label className="flex items-center justify-between mb-2">
              <span className="font-medium text-gray-700">夜间禁用时段</span>
              <input type="checkbox" className="toggle-checkbox" defaultChecked />
            </label>
            <div className="flex items-center space-x-2 mt-3">
              <input type="time" defaultValue="21:30" className="px-3 py-1.5 border border-gray-300 rounded outline-none text-sm" />
              <span className="text-gray-500 text-sm">至</span>
              <input type="time" defaultValue="06:00" className="px-3 py-1.5 border border-gray-300 rounded outline-none text-sm" />
            </div>
          </div>
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">保存全局配置</button>
        </div>
      </div>
    );
  }

  // reports
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">学习报告生成日志</h2>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-100">
            <th className="p-4 font-medium">生成时间</th>
            <th className="p-4 font-medium">报告类型</th>
            <th className="p-4 font-medium">接收家长</th>
            <th className="p-4 font-medium">发送状态</th>
          </tr>
        </thead>
        <tbody className="text-sm divide-y divide-gray-100">
          <tr className="hover:bg-gray-50/50">
            <td className="p-4 text-gray-500">2026-03-30 08:00</td>
            <td className="p-4 font-medium text-gray-800">每周学习评估 (周报)</td>
            <td className="p-4 text-gray-600">138****1234</td>
            <td className="p-4"><span className="text-green-600 bg-green-50 px-2 py-1 rounded text-xs">发送成功</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
