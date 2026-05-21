import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { Bell, Search, User, Moon, Sun, LogOut } from 'lucide-react';

const DashboardLayout = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      alert(`Searching for: ${e.target.value}`);
    }
  };

  const handleNotifications = () => {
    alert("You have 3 new notifications: \n1. Revenue spike in East Region \n2. New dataset uploaded \n3. Monthly report ready");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-grid">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-20 border-b flex items-center justify-between px-8 glass z-10 mx-4 mt-4 rounded-3xl shadow-sm">
          <div className="relative w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-brand-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Search reports, insights..." 
              onKeyDown={handleSearch}
              className="w-full bg-slate-50 dark:bg-slate-900/50 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all"
            />
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-slate-100/50 dark:bg-slate-800/50 p-1.5 rounded-2xl">
              <button onClick={toggleDarkMode} className="p-2.5 hover:bg-white dark:hover:bg-slate-700 rounded-xl transition-all shadow-sm">
                {isDarkMode ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5 text-indigo-600" />}
              </button>
              <button 
                onClick={handleNotifications}
                className="p-2.5 hover:bg-white dark:hover:bg-slate-700 rounded-xl transition-all relative shadow-sm"
              >
                <Bell className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white dark:border-slate-900"></span>
              </button>
            </div>

            <div className="flex items-center gap-4 pl-4 border-l border-slate-200 dark:border-slate-800">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold tracking-tight">{user?.full_name || 'User'}</p>
                <p className="text-[10px] uppercase font-black text-brand-600 dark:text-brand-400 tracking-widest">{user?.role || 'Member'}</p>
              </div>
              <div className="group relative">
                <div className="w-11 h-11 bg-gradient-to-br from-brand-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-black shadow-lg shadow-brand-500/20 cursor-pointer ring-2 ring-white dark:ring-slate-800">
                  {getInitials(user?.full_name)}
                </div>
                <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 py-2 hidden group-hover:block z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-3 border-b dark:border-slate-800 sm:hidden">
                    <p className="text-sm font-bold">{user?.full_name}</p>
                    <p className="text-xs text-slate-500">{user?.role}</p>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/10 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
