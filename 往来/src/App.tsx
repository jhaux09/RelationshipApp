import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Welcome from './pages/Welcome';
import Home from './pages/Home';
import Friends from './pages/Friends';
import AddFriend from './pages/AddFriend';
import EditFriend from './pages/EditFriend';
import FriendDetail from './pages/FriendDetail';
import Gifts from './pages/Gifts';
import Records from './pages/Records';
import AddRecord from './pages/AddRecord';
import Calendar from './pages/Calendar';
import Layout from './components/Layout';
import { DataProvider, useData } from './context/DataContext';
import { auth } from './firebase';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { isAuthReady, userId } = useData();

  if (!isAuthReady) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background-light">
        <p className="text-primary font-bold">加载中...</p>
      </div>
    );
  }

  if (!userId) {
    const handleLogin = async () => {
      const provider = new GoogleAuthProvider();
      try {
        await signInWithPopup(auth, provider);
      } catch (error) {
        console.error("Login failed", error);
      }
    };

    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background-light p-6">
        <div className="size-24 rounded-full bg-primary/20 flex items-center justify-center mb-8">
          <span className="material-symbols-outlined text-primary text-5xl">diversity_1</span>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">往来</h1>
        <p className="text-slate-500 mb-12 text-center">记录每一次心意交汇</p>
        <button 
          onClick={handleLogin}
          className="w-full max-w-xs h-14 bg-primary text-white rounded-xl font-bold text-lg shadow-lg shadow-primary/30 hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined">login</span>
          使用 Google 账号登录
        </button>
      </div>
    );
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <DataProvider>
      <AuthWrapper>
        <BrowserRouter>
          <div className="mx-auto max-w-[430px] w-full min-h-screen bg-background-light shadow-2xl relative overflow-hidden flex flex-col">
            <Routes>
              <Route path="/" element={<Welcome />} />
              <Route element={<Layout />}>
                <Route path="/home" element={<Home />} />
                <Route path="/friends" element={<Friends />} />
                <Route path="/friends/add" element={<AddFriend />} />
                <Route path="/friends/:id/edit" element={<EditFriend />} />
                <Route path="/friends/:id" element={<FriendDetail />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/gifts" element={<Gifts />} />
                <Route path="/records" element={<Records />} />
                <Route path="/records/add" element={<AddRecord />} />
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </BrowserRouter>
      </AuthWrapper>
    </DataProvider>
  );
}
