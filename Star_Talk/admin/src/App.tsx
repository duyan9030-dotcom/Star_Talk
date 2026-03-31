import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import ContentManagement from './components/ContentManagement';
import AIEngine from './components/AIEngine';
import UserControl from './components/UserControl';
import Gamification from './components/Gamification';
import SystemConfig from './components/SystemConfig';
import Login from './components/Login';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeMenu, setActiveMenu] = useState('home');

  const renderContent = () => {
    if (activeMenu === 'home') return <Dashboard />;
    if (activeMenu === 'vocabulary') return <ContentManagement />;
    if (['prompts', 'dialog-logs', 'api-keys'].includes(activeMenu)) return <AIEngine activeMenu={activeMenu} />;
    if (['students', 'parents', 'anti-addiction', 'reports'].includes(activeMenu)) return <UserControl activeMenu={activeMenu} />;
    if (['badges', 'points'].includes(activeMenu)) return <Gamification activeMenu={activeMenu} />;
    if (['menus', 'roles', 'audit'].includes(activeMenu)) return <SystemConfig activeMenu={activeMenu} />;
    
    return (
      <div className="bg-white p-6 rounded shadow-sm">
        <h2 className="text-xl font-semibold mb-4">{activeMenu}</h2>
        <p className="text-gray-500">此功能正在开发中...</p>
      </div>
    );
  };

  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="flex h-screen bg-[#f4f6f8] font-sans text-gray-800">
      <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header activeMenu={activeMenu} onLogout={() => setIsLoggedIn(false)} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
