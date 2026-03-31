import React from 'react';
import { List, UserCheck, History, ShieldAlert } from 'lucide-react';

export default function SystemConfig({ activeMenu }: { activeMenu: string }) {
  if (activeMenu === 'menus') {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">菜单与路由管理</h2>
        <p className="text-sm text-gray-500 mb-6">动态控制后台左侧导航栏的显示，支持拖拽排序。</p>
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <ul className="space-y-2 text-sm font-medium text-gray-700">
            <li className="p-2 bg-white border border-gray-200 rounded">1. 数据大屏</li>
            <li className="p-2 bg-white border border-gray-200 rounded ml-4">2. 内容与词汇 (包含子菜单)</li>
            <li className="p-2 bg-white border border-gray-200 rounded ml-4">3. AI与对话引擎 (包含子菜单)</li>
          </ul>
        </div>
      </div>
    );
  }

  if (activeMenu === 'roles') {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-6">角色与权限 (RBAC)</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border border-red-200 bg-red-50/30 rounded-xl p-5">
            <div className="flex items-center mb-3">
              <ShieldAlert className="w-5 h-5 text-red-500 mr-2" />
              <h3 className="font-bold text-red-700">超级管理员</h3>
            </div>
            <p className="text-xs text-red-600/80 mb-4">统管所有模块，拥有最高权限。</p>
            <ul className="text-xs space-y-1 text-gray-600">
              <li>✓ 所有菜单可见</li>
              <li>✓ 系统设置权限</li>
              <li>✓ 角色分配权限</li>
            </ul>
          </div>
          <div className="border border-blue-200 bg-blue-50/30 rounded-xl p-5">
            <div className="flex items-center mb-3">
              <UserCheck className="w-5 h-5 text-blue-500 mr-2" />
              <h3 className="font-bold text-blue-700">教研人员</h3>
            </div>
            <p className="text-xs text-blue-600/80 mb-4">负责教学内容与 AI Prompt 调优。</p>
            <ul className="text-xs space-y-1 text-gray-600">
              <li>✓ 内容与词汇管理</li>
              <li>✓ AI与对话引擎管理</li>
              <li className="text-gray-400 line-through">✗ 用户与系统设置</li>
            </ul>
          </div>
          <div className="border border-green-200 bg-green-50/30 rounded-xl p-5">
            <div className="flex items-center mb-3">
              <List className="w-5 h-5 text-green-500 mr-2" />
              <h3 className="font-bold text-green-700">运营人员</h3>
            </div>
            <p className="text-xs text-green-600/80 mb-4">负责用户数据分析与活动配置。</p>
            <ul className="text-xs space-y-1 text-gray-600">
              <li>✓ 数据大屏查看</li>
              <li>✓ 用户与家长管理</li>
              <li>✓ 游戏化激励配置</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // audit
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center mb-6">
        <History className="w-6 h-6 text-gray-700 mr-3" />
        <h2 className="text-lg font-semibold text-gray-800">操作审计日志</h2>
      </div>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-100">
            <th className="p-4 font-medium">操作时间</th>
            <th className="p-4 font-medium">操作人 (角色)</th>
            <th className="p-4 font-medium">模块</th>
            <th className="p-4 font-medium">具体操作</th>
            <th className="p-4 font-medium">IP 地址</th>
          </tr>
        </thead>
        <tbody className="text-sm divide-y divide-gray-100">
          <tr className="hover:bg-gray-50/50">
            <td className="p-4 text-gray-500">2026-03-30 10:15:22</td>
            <td className="p-4 font-medium text-gray-800">张老师 (教研)</td>
            <td className="p-4 text-gray-600">Prompt工程</td>
            <td className="p-4 text-blue-600">更新了 Teacher Mary 的 System Prompt (v1.4.2)</td>
            <td className="p-4 text-gray-400">192.168.1.105</td>
          </tr>
          <tr className="hover:bg-gray-50/50">
            <td className="p-4 text-gray-500">2026-03-29 16:40:00</td>
            <td className="p-4 font-medium text-gray-800">Admin (超管)</td>
            <td className="p-4 text-gray-600">防沉迷设置</td>
            <td className="p-4 text-red-500">修改全局每日最大时长为 45 分钟</td>
            <td className="p-4 text-gray-400">10.0.0.1</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
