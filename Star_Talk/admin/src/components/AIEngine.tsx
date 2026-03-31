import React from 'react';
import { MessageSquare, Settings, Save, AlertOctagon, Key, ShieldCheck } from 'lucide-react';

export default function AIEngine({ activeMenu }: { activeMenu: string }) {
  if (activeMenu === 'prompts') {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <h3 className="font-semibold text-gray-800 mb-4">AI 对话场景列表</h3>
          <div className="space-y-2">
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg cursor-pointer">
              <div className="font-medium text-blue-800">快餐店点餐 (Ordering Fast Food)</div>
              <div className="text-xs text-blue-600 mt-1">适用于：基础口语练习</div>
            </div>
            <div className="p-3 border border-gray-100 hover:bg-gray-50 rounded-lg cursor-pointer">
              <div className="font-medium text-gray-700">学校交友 (Making Friends)</div>
              <div className="text-xs text-gray-500 mt-1">适用于：社交口语练习</div>
            </div>
            <div className="p-3 border border-gray-100 hover:bg-gray-50 rounded-lg cursor-pointer">
              <div className="font-medium text-gray-700">周末看电影 (Going to the Movies)</div>
              <div className="text-xs text-gray-500 mt-1">适用于：日常兴趣交流</div>
            </div>
            <div className="p-3 border border-gray-100 hover:bg-gray-50 rounded-lg cursor-pointer">
              <div className="font-medium text-gray-700">机场登机 (Airport Check-in)</div>
              <div className="text-xs text-gray-500 mt-1">适用于：旅行实用英语</div>
            </div>
          </div>
        </div>
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-gray-800">Teacher Mary - Prompt 配置</h3>
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">v1.4.2 (当前生效)</span>
          </div>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">系统提示词 (System Prompt)</label>
              <textarea 
                className="w-full h-32 p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
                defaultValue="You are Teacher Mary, a gentle and encouraging English teacher for 3-5 year old kids. Use very simple words. Always praise the child. If they make a mistake, gently correct them without saying 'no' or 'wrong'."
              />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">纠错严格程度 (0-10)</label>
                <input type="range" min="0" max="10" defaultValue="2" className="w-full accent-blue-600" />
                <div className="flex justify-between text-xs text-gray-400 mt-1"><span>宽松</span><span>严格</span></div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">词汇难度上限 (CEFR)</label>
                <select className="w-full p-2 border border-gray-300 rounded-lg text-sm outline-none">
                  <option>Pre-A1 (极简)</option>
                  <option>A1 (基础)</option>
                  <option>A2 (初级)</option>
                </select>
              </div>
            </div>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium flex items-center hover:bg-blue-700">
              <Save className="w-4 h-4 mr-2" /> 保存并发布新版本
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (activeMenu === 'dialog-logs') {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">对话日志与 Bad Case 分析</h2>
          <select className="border border-gray-200 rounded-lg text-sm px-3 py-2 outline-none">
            <option>全部状态</option>
            <option>回复超时</option>
            <option>不当言论拦截</option>
            <option>用户反复听不懂</option>
          </select>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-100">
              <th className="p-4 font-medium">时间</th>
              <th className="p-4 font-medium">用户 ID</th>
              <th className="p-4 font-medium">对话内容切片</th>
              <th className="p-4 font-medium">状态/标签</th>
              <th className="p-4 font-medium">操作</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-gray-100">
            <tr className="hover:bg-gray-50/50">
              <td className="p-4 text-gray-500">10:23:45</td>
              <td className="p-4 font-medium">U_8829</td>
              <td className="p-4 text-gray-600">User: "Apple"<br/>AI: "Great job! It's an apple."</td>
              <td className="p-4"><span className="bg-green-50 text-green-600 px-2 py-1 rounded text-xs">正常</span></td>
              <td className="p-4"><button className="text-blue-600 hover:underline">详情</button></td>
            </tr>
            <tr className="hover:bg-gray-50/50 bg-red-50/30">
              <td className="p-4 text-gray-500">10:15:22</td>
              <td className="p-4 font-medium">U_1024</td>
              <td className="p-4 text-gray-600">User: "..." (Silence 10s)<br/>AI: "Are you there?"</td>
              <td className="p-4"><span className="bg-orange-50 text-orange-600 px-2 py-1 rounded text-xs">反复听不懂</span></td>
              <td className="p-4"><button className="text-blue-600 hover:underline">详情</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  // api-keys
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 max-w-3xl mx-auto">
      <div className="flex items-center mb-8 pb-4 border-b border-gray-100">
        <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center mr-4">
          <Key className="w-5 h-5 text-purple-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-800">API 密钥与额度管理</h2>
          <p className="text-sm text-gray-500 mt-1">统一配置大语言模型及图像识别 API</p>
        </div>
      </div>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">大语言模型 API Key (Gemini / OpenAI)</label>
          <input type="password" value="************************" readOnly className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">单日调用量上限 (Rate Limiting)</label>
          <div className="flex items-center space-x-2">
            <input type="number" defaultValue="500000" className="w-48 px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-purple-500" />
            <span className="text-gray-500 text-sm">次 / 天</span>
          </div>
          <p className="text-xs text-gray-400 mt-2">防止恶意刷量导致账单爆炸</p>
        </div>
        <button className="bg-purple-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-purple-700">保存配置</button>
      </div>
    </div>
  );
}
