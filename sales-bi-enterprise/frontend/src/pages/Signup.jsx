import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart2, Mail, Lock, ArrowRight, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

const Signup = () => {
  const [formData, setFormData] = useState({
    full_name: '',
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

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('/auth/signup', formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full glass p-10 rounded-3xl shadow-2xl"
      >
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-brand-600 rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg shadow-brand-500/30">
            <BarChart2 className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-black tracking-tight">Create Account</h1>
          <p className="text-slate-500 mt-2 font-medium">Join SalesBI Enterprise</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rose-50 text-rose-600 rounded-2xl text-sm font-medium border border-rose-100">
            {error}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSignup}>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input 
                required
                type="text" 
                placeholder="John Doe" 
                value={formData.full_name}
                onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-brand-500 transition-all outline-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Work Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input 
                required
                type="email" 
                placeholder="name@company.com" 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-brand-500 transition-all outline-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input 
                required
                type="password" 
                placeholder="••••••••" 
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-brand-500 transition-all outline-none"
              />
            </div>
          </div>

          <button 
            disabled={loading}
            className="w-full bg-brand-600 hover:bg-brand-700 text-white font-black py-4 rounded-2xl shadow-lg shadow-brand-500/30 transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
          >
            {loading ? 'CREATING...' : 'CREATE ACCOUNT'} <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="mt-10 pt-6 border-t border-slate-200 dark:border-slate-800 text-center">
          <p className="text-sm text-slate-500 font-medium">
            Already have an account? <Link to="/login" className="text-brand-600 font-bold hover:underline">Sign In</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
