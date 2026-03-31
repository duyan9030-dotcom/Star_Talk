import React from 'react';
import { Menu, User, ChevronDown, Bell, LogOut } from 'lucide-react';

const breadcrumbMap: Record<string, string> = {
  'home': '数据大屏',
  'vocabulary': '词库资源管理',
  'prompts': 'AI与对话引擎 / Prompt工程',
  'dialog-logs': 'AI与对话引擎 / 对话与BadCase',
  'api-keys': 'AI与对话引擎 / API与额度',
  'students': '用户与家长 / 学生账号',
  'parents': '用户与家长 / 家长账号',
  'anti-addiction': '用户与家长 / 防沉迷设置',
  'reports': '用户与家长 / 学习报告',
  'badges': '游戏化激励 / 成就与徽章',
  'points': '游戏化激励 / 积分流水',
  'menus': '系统与权限 / 菜单路由',
  'roles': '系统与权限 / 角色权限',
  'audit': '系统与权限 / 操作审计',
};

export default function Header({ activeMenu, onLogout }: { activeMenu: string, onLogout: () => void }) {
  const breadcrumb = breadcrumbMap[activeMenu] || '主页';

  return (
    <header className="h-16 bg-white shadow-sm flex items-center justify-between px-6 z-10 shrink-0 border-b border-gray-100">
      <div className="flex items-center text-gray-600">
        <Menu className="w-5 h-5 mr-4 cursor-pointer hover:text-gray-900 transition-colors" />
        <div className="flex items-center text-sm">
          <span className="text-gray-400">StarTalk</span>
          <span className="mx-2 text-gray-300">/</span>
          <span className="text-gray-700 font-medium">{breadcrumb}</span>
        </div>
      </div>
      <div className="flex items-center space-x-6">
        <div className="relative cursor-pointer text-gray-500 hover:text-gray-700 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </div>
        <div className="flex items-center text-sm text-gray-600 cursor-pointer hover:text-gray-900 group relative">
          <div className="w-8 h-8 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-2 shadow-sm text-white">
            <User className="w-4 h-4" />
          </div>
          <span className="font-medium">超级管理员</span>
          <ChevronDown className="w-4 h-4 ml-1 text-gray-400" />
          
          <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all transform translate-y-2 group-hover:translate-y-0 z-50">
            <button 
              onClick={onLogout}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
            >
              <LogOut className="w-4 h-4 mr-2" />
              退出登录
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
