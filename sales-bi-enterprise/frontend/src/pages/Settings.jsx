import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Bell, 
  Shield, 
  Moon, 
  Sun, 
  Monitor,
  Mail,
  Lock,
  Save,
  CheckCircle2
} from 'lucide-react';

const Settings = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [saved, setSaved] = useState(false);
  
  const [settings, setSettings] = useState({
    notifications: {
      emailAlerts: true,
      pushNotifications: false,
      weeklyReports: true
    },
    appearance: 'light',
    security: {
      twoFactor: false
    }
  });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleAction = (action) => {
    alert(`${action} functionality will be enabled in the next system update.`);
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Moon },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black tracking-tight">Settings</h2>
          <p className="text-slate-500 font-medium">Manage your account preferences and system configuration.</p>
        </div>
        <button 
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-3 bg-brand-600 text-white rounded-2xl font-bold shadow-lg shadow-brand-500/30 hover:bg-brand-700 transition-all"
        >
          {saved ? <CheckCircle2 className="w-5 h-5" /> : <Save className="w-5 h-5" />}
          {saved ? 'Changes Saved' : 'Save Changes'}
        </button>
      </div>

      <div className="flex gap-8">
        {/* Sidebar Tabs */}
        <div className="w-64 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                activeTab === tab.id 
                  ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/20' 
                  : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 glass rounded-3xl p-8 shadow-xl">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="flex items-center gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
                  <div className="w-20 h-20 bg-brand-500 rounded-3xl flex items-center justify-center text-white text-2xl font-black">
                    {user?.full_name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{user?.full_name || 'User Name'}</h3>
                    <p className="text-slate-500 font-medium">{user?.role || 'Member'} • {user?.email || 'email@example.com'}</p>
                    <button 
                      onClick={() => handleAction('Change Avatar')}
                      className="mt-2 text-sm font-bold text-brand-600 hover:underline"
                    >
                      Change Avatar
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Full Name</label>
                    <input 
                      type="text" 
                      defaultValue={user?.full_name}
                      className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl py-4 px-4 focus:ring-2 focus:ring-brand-500 transition-all outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Email Address</label>
                    <input 
                      type="email" 
                      defaultValue={user?.email}
                      className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl py-4 px-4 focus:ring-2 focus:ring-brand-500 transition-all outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold mb-6">Email Preferences</h3>
                <div className="space-y-4">
                  {[
                    { id: 'emailAlerts', label: 'Security Alerts', desc: 'Get notified about new logins and password changes.' },
                    { id: 'pushNotifications', label: 'Direct Messages', desc: 'Receive push notifications for team mentions.' },
                    { id: 'weeklyReports', label: 'Weekly Performance Reports', desc: 'Summary of your sales and growth metrics.' }
                  ].map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                      <div>
                        <p className="font-bold">{item.label}</p>
                        <p className="text-xs text-slate-500">{item.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={settings.notifications[item.id]}
                          onChange={() => setSettings({
                            ...settings, 
                            notifications: { ...settings.notifications, [item.id]: !settings.notifications[item.id] }
                          })}
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-brand-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold mb-6">Theme Settings</h3>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { id: 'light', label: 'Light', icon: Sun },
                    { id: 'dark', label: 'Dark', icon: Moon },
                    { id: 'system', label: 'System', icon: Monitor },
                  ].map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => setSettings({ ...settings, appearance: theme.id })}
                      className={`flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all ${
                        settings.appearance === theme.id 
                          ? 'border-brand-600 bg-brand-50 dark:bg-brand-900/10' 
                          : 'border-transparent bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100'
                      }`}
                    >
                      <theme.icon className={`w-8 h-8 ${settings.appearance === theme.id ? 'text-brand-600' : 'text-slate-400'}`} />
                      <span className="font-bold text-sm">{theme.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold mb-6">Security & Privacy</h3>
                <div className="p-6 bg-rose-50 dark:bg-rose-900/10 rounded-2xl border border-rose-100 dark:border-rose-900/20 mb-6">
                  <div className="flex items-center gap-3 text-rose-600 mb-2">
                    <Shield className="w-5 h-5" />
                    <p className="font-bold">Two-Factor Authentication</p>
                  </div>
                  <p className="text-sm text-rose-600/80 mb-4">Enhance your account security by requiring a code from your mobile device during login.</p>
                  <button 
                    onClick={() => handleAction('2FA')}
                    className="px-4 py-2 bg-rose-600 text-white rounded-xl text-sm font-bold hover:bg-rose-700 transition-all"
                  >
                    Enable 2FA
                  </button>
                </div>
                
                <div className="space-y-4">
                  <button 
                    onClick={() => handleAction('Change Password')}
                    className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl font-bold hover:bg-slate-100 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <Lock className="w-5 h-5 text-slate-400" />
                      Change Password
                    </div>
                    <span className="text-brand-600 text-xs">Update</span>
                  </button>
                  <button 
                    onClick={() => handleAction('Email Visibility')}
                    className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl font-bold hover:bg-slate-100 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-slate-400" />
                      Email Visibility
                    </div>
                    <span className="text-slate-400 text-xs">Public</span>
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
