import React from 'react';
import { Trophy, Coins, Upload, Plus } from 'lucide-react';

export default function Gamification({ activeMenu }: { activeMenu: string }) {
  if (activeMenu === 'badges') {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">成就与徽章配置</h2>
            <p className="text-sm text-gray-500">自定义徽章图标与触发条件</p>
          </div>
          <button className="bg-yellow-500 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center hover:bg-yellow-600">
            <Plus className="w-4 h-4 mr-1" /> 新建徽章
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: '识图小达人', desc: '累计成功识别 50 个实景物体', icon: '🌟', color: 'bg-yellow-100 text-yellow-600' },
            { name: '对话连击王', desc: '与 AI 连续对话 10 轮不断线', icon: '🔥', color: 'bg-orange-100 text-orange-600' },
            { name: '早起鸟', desc: '连续 7 天在早晨 7 点前完成学习', icon: '🐦', color: 'bg-blue-100 text-blue-600' },
          ].map((badge, i) => (
            <div key={i} className="border border-gray-200 rounded-xl p-5 flex flex-col items-center text-center hover:shadow-md transition-shadow">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-3 ${badge.color}`}>
                {badge.icon}
              </div>
              <h3 className="font-bold text-gray-800 mb-1">{badge.name}</h3>
              <p className="text-xs text-gray-500 mb-4">{badge.desc}</p>
              <div className="w-full flex space-x-2">
                <button className="flex-1 py-1.5 border border-gray-200 rounded text-xs font-medium text-gray-600 hover:bg-gray-50">编辑条件</button>
                <button className="flex-1 py-1.5 border border-gray-200 rounded text-xs font-medium text-gray-600 hover:bg-gray-50 flex items-center justify-center">
                  <Upload className="w-3 h-3 mr-1" /> 换图
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // points
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center mb-6">
        <Coins className="w-6 h-6 text-yellow-500 mr-3" />
        <h2 className="text-lg font-semibold text-gray-800">积分流水分页查询</h2>
      </div>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-100">
            <th className="p-4 font-medium">时间</th>
            <th className="p-4 font-medium">用户 ID</th>
            <th className="p-4 font-medium">行为/来源</th>
            <th className="p-4 font-medium">积分变动</th>
            <th className="p-4 font-medium">当前余额</th>
          </tr>
        </thead>
        <tbody className="text-sm divide-y divide-gray-100">
          <tr className="hover:bg-gray-50/50">
            <td className="p-4 text-gray-500">10:45:12</td>
            <td className="p-4 font-medium">U_8829</td>
            <td className="p-4 text-gray-600">完成 L1 关卡学习</td>
            <td className="p-4 font-bold text-green-500">+10</td>
            <td className="p-4 text-gray-500">1,240</td>
          </tr>
          <tr className="hover:bg-gray-50/50">
            <td className="p-4 text-gray-500">09:12:05</td>
            <td className="p-4 font-medium">U_1024</td>
            <td className="p-4 text-gray-600">兑换虚拟头像框 (海盗帽)</td>
            <td className="p-4 font-bold text-red-500">-50</td>
            <td className="p-4 text-gray-500">850</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
