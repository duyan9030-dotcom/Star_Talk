import React, { useState } from "react";
import {
  MessageCircle,
  CheckCircle2,
  Smartphone,
  ShieldCheck,
} from "lucide-react";
import { PageWrapper } from "../components/Common";

export const WeChatLoginPage = ({
  onBack,
  key,
}: {
  onBack: () => void;
  key?: string;
}) => (
  <PageWrapper
    title="微信授权登录"
    onBack={onBack}
    bg="bg-white dark:bg-slate-900"
  >
    <div className="flex flex-col items-center pt-20 px-8 h-full">
      <div className="w-20 h-20 bg-[#05C160] rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/20 mb-6">
        <MessageCircle size={48} className="text-white" fill="currentColor" />
      </div>
      <h2 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 mb-2">
        Star Talk
      </h2>
      <p className="text-slate-500 dark:text-slate-400 font-medium mb-12">
        申请获取以下权限
      </p>

      <div className="w-full bg-slate-50 dark:bg-slate-800 rounded-2xl p-6 mb-12 border border-slate-100 dark:border-slate-700 transition-colors">
        <div className="flex items-center gap-3 text-slate-700 dark:text-slate-200 font-bold">
          <CheckCircle2 size={20} className="text-[#05C160]" />
          获得你的公开信息（昵称、头像等）
        </div>
      </div>

      <button className="w-full bg-[#05C160] text-white font-extrabold py-4 rounded-[1.5rem] shadow-lg shadow-green-500/20 border-b-[6px] border-[#049A4D] active:border-b-2 active:translate-y-1 transition-all">
        同意授权
      </button>
      <button
        onClick={onBack}
        className="w-full mt-4 text-slate-400 dark:text-slate-500 font-bold py-4 active:scale-95 transition-transform"
      >
        拒绝
      </button>
    </div>
  </PageWrapper>
);

export const PhoneLoginPage = ({
  onBack,
  onLogin,
  key,
}: {
  onBack: () => void;
  onLogin: () => void;
  key?: string;
}) => {
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");

  return (
    <PageWrapper
      title="手机号登录"
      onBack={onBack}
      bg="bg-white dark:bg-slate-900"
    >
      <div className="px-8 pt-12 h-full flex flex-col">
        <h2 className="text-3xl font-black text-slate-800 dark:text-slate-100 mb-2">
          欢迎回来
        </h2>
        <p className="text-slate-500 dark:text-slate-400 font-medium mb-10">
          未注册的手机号验证后自动创建账号
        </p>

        <div className="space-y-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Smartphone size={20} className="text-slate-400" />
            </div>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="请输入手机号"
              className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl py-4 pl-12 pr-4 font-bold text-slate-700 dark:text-slate-200 outline-none focus:border-blue-400 dark:focus:border-blue-500 transition-colors"
            />
          </div>

          <div className="relative flex gap-3">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <ShieldCheck size={20} className="text-slate-400" />
              </div>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="验证码"
                className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl py-4 pl-12 pr-4 font-bold text-slate-700 dark:text-slate-200 outline-none focus:border-blue-400 dark:focus:border-blue-500 transition-colors"
              />
            </div>
            <button className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold px-6 rounded-2xl active:scale-95 transition-transform whitespace-nowrap">
              获取验证码
            </button>
          </div>
        </div>

        <button
          onClick={onLogin}
          className="w-full mt-10 bg-blue-500 text-white font-extrabold py-4 rounded-[1.5rem] shadow-lg shadow-blue-500/20 border-b-[6px] border-blue-600 active:border-b-2 active:translate-y-1 transition-all"
        >
          登录 / 注册
        </button>
      </div>
    </PageWrapper>
  );
};
