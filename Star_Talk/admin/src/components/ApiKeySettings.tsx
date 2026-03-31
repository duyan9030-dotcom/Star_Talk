import React, { useState } from 'react';
import { Save, Key, Eye, EyeOff, ShieldCheck } from 'lucide-react';

export default function ApiKeySettings() {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (!apiKey.trim()) return;
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="bg-white rounded shadow-sm border border-gray-100 p-8 max-w-3xl mx-auto mt-4">
      <div className="flex items-center mb-8 pb-4 border-b border-gray-100">
        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mr-4">
          <Key className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-800">API Key 设置</h2>
          <p className="text-sm text-gray-500 mt-1">配置系统所需的大模型 API 密钥</p>
        </div>
      </div>
      
      <div className="space-y-8">
        <div className="bg-gray-50 p-4 rounded-lg flex items-start">
          <ShieldCheck className="w-5 h-5 text-green-500 mr-3 mt-0.5 shrink-0" />
          <div className="text-sm text-gray-600 leading-relaxed">
            您的 API Key 将被安全加密存储，仅用于系统内的 AI 功能调用（如智能问诊分析、饮食建议生成等）。我们不会将其用于任何其他用途。
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            OpenAI / Gemini API Key
          </label>
          <div className="relative">
            <input
              type={showKey ? "text" : "password"}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="请输入您的 API Key (例如: sk-... 或 AIza...)"
              className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-gray-800"
            />
            <button 
              onClick={() => setShowKey(!showKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
            >
              {showKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div className="pt-2">
          <button
            onClick={handleSave}
            disabled={!apiKey.trim()}
            className={`flex items-center justify-center px-6 py-2.5 rounded-lg transition-all font-medium ${
              apiKey.trim() 
                ? 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-4 focus:ring-blue-600/20 shadow-sm' 
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Save className="w-4 h-4 mr-2" />
            {saved ? '已保存成功' : '保存设置'}
          </button>
        </div>
      </div>
    </div>
  );
}
