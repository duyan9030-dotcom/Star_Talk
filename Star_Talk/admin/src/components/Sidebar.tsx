import React, { useState } from 'react';
import { 
  Home, BookOpen, Bot, Users, Trophy, Settings,
  FileText, Image as ImageIcon, Layers, MessageSquare, AlertOctagon, Key,
  User, Shield, FileBarChart, Medal, Coins, List, UserCheck, History,
  ChevronDown, ChevronRight, Star
} from 'lucide-react';

const menuItems = [
  { id: 'home', label: '数据大屏', icon: Home },
  { id: 'vocabulary', label: '词库资源管理', icon: BookOpen },
  { 
    id: 'ai', 
    label: 'AI与对话引擎', 
    icon: Bot,
    subItems: [
      { id: 'prompts', label: 'Prompt工程', icon: MessageSquare },
      { id: 'dialog-logs', label: '对话与BadCase', icon: AlertOctagon },
      { id: 'api-keys', label: 'API与额度', icon: Key },
    ]
  },
  { 
    id: 'users', 
    label: '用户与家长', 
    icon: Users,
    subItems: [
      { id: 'students', label: '学生账号', icon: User },
      { id: 'parents', label: '家长账号', icon: Users },
      { id: 'anti-addiction', label: '防沉迷设置', icon: Shield },
      { id: 'reports', label: '学习报告', icon: FileBarChart },
    ]
  },
  { 
    id: 'gamification', 
    label: '游戏化激励', 
    icon: Trophy,
    subItems: [
      { id: 'badges', label: '成就与徽章', icon: Medal },
      { id: 'points', label: '积分流水', icon: Coins },
    ]
  },
  { 
    id: 'system', 
    label: '系统与权限', 
    icon: Settings,
    subItems: [
      { id: 'menus', label: '菜单路由', icon: List },
      { id: 'roles', label: '角色权限', icon: UserCheck },
      { id: 'audit', label: '操作审计', icon: History },
    ]
  }
];

export default function Sidebar({ activeMenu, setActiveMenu }: { activeMenu: string, setActiveMenu: (id: string) => void }) {
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({
    'content': true,
    'ai': true,
    'users': false,
    'gamification': false,
    'system': false
  });

  const toggleMenu = (id: string) => {
    setOpenMenus(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="w-64 bg-[#1e222d] text-gray-300 flex flex-col h-full transition-all duration-300 shadow-xl z-20">
      <div className="h-16 flex items-center px-6 text-white font-bold text-xl tracking-wider border-b border-gray-800 shrink-0 bg-[#181b24]">
        <Star className="w-6 h-6 text-yellow-400 fill-current mr-2" />
        <span>StarTalk <span className="text-xs font-normal text-gray-400 ml-1">Admin</span></span>
      </div>
      <div className="flex-1 overflow-y-auto py-4 custom-scrollbar">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            if (item.subItems) {
              const isOpen = openMenus[item.id];
              return (
                <li key={item.id} className="flex flex-col">
                  <button 
                    onClick={() => toggleMenu(item.id)}
                    className={`flex items-center justify-between px-6 py-3.5 hover:bg-[#252a36] hover:text-white transition-colors w-full text-left`}
                  >
                    <div className="flex items-center">
                      <item.icon className="w-5 h-5 mr-3 text-gray-400" />
                      <span className="text-sm font-medium">{item.label}</span>
                    </div>
                    {isOpen ? <ChevronDown className="w-4 h-4 text-gray-500" /> : <ChevronRight className="w-4 h-4 text-gray-500" />}
                  </button>
                  {isOpen && (
                    <ul className="bg-[#181b24] py-2 space-y-1">
                      {item.subItems.map((subItem) => (
                        <li key={subItem.id}>
                          <button
                            onClick={() => setActiveMenu(subItem.id)}
                            className={`flex items-center px-12 py-2.5 w-full text-left text-sm transition-colors ${
                              activeMenu === subItem.id 
                                ? 'text-blue-400 bg-[#252a36] border-r-2 border-blue-500' 
                                : 'text-gray-400 hover:text-white hover:bg-[#252a36]'
                            }`}
                          >
                            <subItem.icon className="w-4 h-4 mr-3 opacity-70" />
                            <span>{subItem.label}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            }

            return (
              <li key={item.id}>
                <button
                  onClick={() => setActiveMenu(item.id)}
                  className={`flex items-center px-6 py-3.5 w-full text-left transition-colors ${
                    activeMenu === item.id 
                      ? 'bg-[#252a36] text-blue-400 border-r-2 border-blue-500' 
                      : 'hover:bg-[#252a36] hover:text-white'
                  }`}
                >
                  <item.icon className={`w-5 h-5 mr-3 ${activeMenu === item.id ? 'text-blue-400' : 'text-gray-400'}`} />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
