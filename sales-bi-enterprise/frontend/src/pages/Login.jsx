import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart2, Mail, Lock, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      navigate('/');
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/login', formData);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] flex items-center justify-center p-4 bg-grid relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-500/10 rounded-full -mr-40 -mt-40 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full -ml-40 -mb-40 blur-3xl"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full glass p-10 rounded-[3rem] shadow-2xl relative z-10 border border-white/40 dark:border-slate-800/40"
      >
        <div className="flex flex-col items-center mb-10">
          <div className="w-20 h-20 bg-gradient-to-tr from-brand-600 to-indigo-600 rounded-3xl flex items-center justify-center text-white mb-6 shadow-xl shadow-brand-500/30 ring-4 ring-white dark:ring-slate-800">
            <BarChart2 className="w-12 h-12" />
          </div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">SalesBI</h1>
          <p className="text-slate-500 mt-2 font-bold uppercase text-[10px] tracking-[0.3em]">Enterprise Edition</p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-6 p-4 bg-rose-50 dark:bg-rose-900/10 text-rose-600 rounded-2xl text-sm font-bold border border-rose-100 dark:border-rose-900/20"
          >
            {error}
          </motion.div>
        )}

        <form className="space-y-6" onSubmit={handleLogin}>
          <div className="space-y-3">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Work Email</label>
            <div className="relative group">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-brand-500 transition-colors" />
              <input 
                required
                type="email" 
                placeholder="name@company.com" 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-transparent rounded-2xl py-4 pl-14 pr-4 focus:bg-white dark:focus:bg-slate-950 focus:border-brand-500 transition-all outline-none font-medium"
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center ml-1">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400">Password</label>
              <button type="button" className="text-xs font-black text-brand-600 hover:text-brand-700 uppercase tracking-widest">Forgot?</button>
            </div>
            <div className="relative group">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-brand-500 transition-colors" />
              <input 
                required
                type="password" 
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-transparent rounded-2xl py-4 pl-14 pr-4 focus:bg-white dark:focus:bg-slate-950 focus:border-brand-500 transition-all outline-none font-medium"
              />
            </div>
          </div>

          <button 
            disabled={loading}
            className="w-full bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-brand-500/30 transition-all flex items-center justify-center gap-3 group disabled:opacity-50 active:scale-[0.98]"
          >
            {loading ? 'SIGNING IN...' : 'SIGN IN'} 
            {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>

        <div className="mt-10 pt-8 border-t dark:border-slate-800 text-center">
          <p className="text-slate-500 font-bold text-sm">
            Don't have an account? {' '}
            <Link to="/signup" className="text-brand-600 hover:text-brand-700 font-black uppercase tracking-widest text-xs ml-1">Sign Up</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
