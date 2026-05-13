import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const KPICard = ({ title, value, change, isPositive, icon: Icon, prefix = "" }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 rounded-2xl glass hover:shadow-lg transition-shadow"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-brand-50 dark:bg-brand-900/20 rounded-lg text-brand-600 dark:text-brand-400">
          <Icon className="w-6 h-6" />
        </div>
        <div className={`flex items-center gap-1 text-sm font-medium ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
          {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
          {change}%
        </div>
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
        <h3 className="text-2xl font-bold">
          {prefix}{typeof value === 'number' ? value.toLocaleString() : value}
        </h3>
      </div>
    </motion.div>
  );
};

export default KPICard;
