/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { AnimatePresence } from "motion/react";
import { BottomNav } from "./components/Common";
import { LearnTab, AITab, TestTab, MineTab } from "./components/MainTabs";
import { AIHistoryPage, ChatPage } from "./pages/AIPages";
import { WeChatLoginPage, PhoneLoginPage } from "./pages/AuthPages";
import {
  SettingsPage,
  EditProfilePage,
  LearningSettingsPage,
  ParentSettingsPage,
  FeedbackPage,
  BadgesPage,
  NotificationsPage,
} from "./pages/ProfilePages";
import {
  VocabLearnPage,
  VocabQuizPage,
  VocabBookPage,
} from "./pages/VocabPages";
import { DailyChallengePage } from "./pages/ChallengePages";
import { Route, UserProfile } from "./types";

export default function App() {
  const [currentTab, setCurrentTab] = useState("learn");
  const [route, setRoute] = useState<Route>({ id: "main" });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [eyeCareMode, setEyeCareMode] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    nickname: "宝宝",
    age: 8,
    grade: "三年级",
    school: "",
    gender: "secret",
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const navigate = (id: string, params?: any) => setRoute({ id, params });
  const goBack = () => setRoute({ id: "main" });

  const renderMainTab = () => {
    switch (currentTab) {
      case "learn":
        return <LearnTab navigate={navigate} userProfile={userProfile} />;
      case "ai":
        return <AITab navigate={navigate} />;
      case "test":
        return <TestTab navigate={navigate} />;
      case "mine":
        return (
          <MineTab
            navigate={navigate}
            isLoggedIn={isLoggedIn}
            userProfile={userProfile}
          />
        );
      default:
        return <LearnTab navigate={navigate} userProfile={userProfile} />;
    }
  };

  return (
    <div className={`h-[100dvh] w-full max-w-md mx-auto bg-white dark:bg-slate-900 overflow-hidden relative font-sans text-slate-800 dark:text-slate-100 transition-colors duration-300 ${eyeCareMode ? 'sepia-[.3]' : ''}`}>
      <AnimatePresence mode="wait">
        {route.id === "main" && (
          <div key="main" className="h-full flex flex-col">
            {renderMainTab()}
            <BottomNav activeTab={currentTab} setActiveTab={setCurrentTab} />
          </div>
        )}

        {/* Auth Pages */}
        {route.id === "login-wechat" && (
          <WeChatLoginPage key="login-wechat" onBack={goBack} />
        )}
        {route.id === "login-phone" && (
          <PhoneLoginPage
            key="login-phone"
            onBack={goBack}
            onLogin={() => {
              setIsLoggedIn(true);
              goBack();
            }}
          />
        )}

        {/* Profile Pages */}
        {route.id === "settings" && (
          <SettingsPage
            key="settings"
            onBack={goBack}
            onLogout={() => {
              setIsLoggedIn(false);
              goBack();
            }}
            navigate={navigate}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            eyeCareMode={eyeCareMode}
            setEyeCareMode={setEyeCareMode}
          />
        )}
        {route.id === "edit-profile" && (
          <EditProfilePage
            key="edit-profile"
            onBack={goBack}
            userProfile={userProfile}
            setUserProfile={setUserProfile}
          />
        )}
        {route.id === "learning-settings" && (
          <LearningSettingsPage
            key="learning-settings"
            onBack={() => navigate("settings")}
          />
        )}
        {route.id === "parent-settings" && (
          <ParentSettingsPage
            key="parent-settings"
            onBack={() => navigate("settings")}
          />
        )}
        {route.id === "feedback" && (
          <FeedbackPage key="feedback" onBack={goBack} />
        )}
        {route.id === "badges" && <BadgesPage key="badges" onBack={goBack} />}
        {route.id === "notifications" && <NotificationsPage key="notifications" onBack={goBack} />}

        {/* AI Pages */}
        {route.id === "ai-history" && (
          <AIHistoryPage key="ai-history" onBack={goBack} navigate={navigate} />
        )}
        {route.id === "chat" && (
          <ChatPage key="chat" params={route.params} onBack={goBack} />
        )}

        {/* Vocab Pages */}
        {route.id === "vocab-learn" && (
          <VocabLearnPage key="vocab-learn" onBack={goBack} />
        )}
        {route.id === "vocab-quiz" && (
          <VocabQuizPage key="vocab-quiz" onBack={goBack} />
        )}
        {route.id === "vocab-book" && (
          <VocabBookPage key="vocab-book" onBack={goBack} />
        )}

        {/* Challenge Pages */}
        {route.id === "daily-challenge" && (
          <DailyChallengePage key="daily-challenge" onBack={goBack} navigate={navigate} />
        )}
      </AnimatePresence>
    </div>
  );
}
