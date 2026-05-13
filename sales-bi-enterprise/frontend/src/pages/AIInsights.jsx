import React from 'react';
import { motion } from 'framer-motion';
import { Zap, TrendingUp, AlertTriangle, Lightbulb, ArrowRight } from 'lucide-react';

const AIInsights = () => {
  const insights = [
    {
      type: 'trend',
      icon: TrendingUp,
      title: 'Sales Growth Prediction',
      content: 'Based on historical data from the last 3 years, we predict a 12-15% increase in Electronics sales during the upcoming Q3. This is driven by seasonal trends and recent market expansion in Asia.',
      color: 'text-blue-600 bg-blue-50',
      action: 'Adjust inventory levels'
    },
    {
      type: 'anomaly',
      icon: AlertTriangle,
      title: 'Regional Anomaly Detected',
      content: 'We noticed an unusual 40% drop in South American profit margins. Our analysis suggests this is due to a sudden increase in shipping costs and currency fluctuations.',
      color: 'text-amber-600 bg-amber-50',
      action: 'Review shipping contracts'
    },
    {
      type: 'recommendation',
      icon: Lightbulb,
      title: 'Cross-Selling Opportunity',
      content: 'Customers who buy "Product A" have a 65% higher probability of purchasing "Product B" within 30 days. Implementing a bundled discount could increase revenue by $45k.',
      color: 'text-emerald-600 bg-emerald-50',
      action: 'Launch bundle campaign'
    }
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-100 text-brand-600 text-sm font-bold">
          <Zap className="w-4 h-4 fill-current" /> POWERED BY AI
        </div>
        <h2 className="text-4xl font-extrabold tracking-tight">Intelligent Business Insights</h2>
        <p className="text-slate-500 text-lg">Our AI engine analyzes millions of data points to provide actionable recommendations.</p>
      </div>

      <div className="grid gap-6">
        {insights.map((insight, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-8 rounded-3xl glass flex flex-col md:flex-row gap-6 items-start"
          >
            <div className={`p-4 rounded-2xl ${insight.color}`}>
              <insight.icon className="w-8 h-8" />
            </div>
            <div className="flex-1 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">{insight.title}</h3>
                <span className="text-xs font-bold uppercase tracking-widest text-slate-400">{insight.type}</span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">
                {insight.content}
              </p>
              <button className="flex items-center gap-2 text-brand-600 font-bold group">
                {insight.action} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Summary Section */}
      <div className="p-8 rounded-3xl bg-slate-900 text-white space-y-6">
        <h3 className="text-2xl font-bold">AI Executive Summary</h3>
        <p className="text-slate-400 leading-relaxed">
          The overall business health is **Strong**. Revenue is trending upwards with a healthy profit margin of **24.5%**. 
          The primary growth engine remains the **North American** market, but **Asia Pacific** shows the highest growth potential for the next 6 months. 
          Operational efficiency has improved by **5.2%** compared to last year, although rising logistics costs in certain regions require immediate attention.
        </p>
        <div className="flex gap-4">
          <div className="px-4 py-2 bg-white/10 rounded-lg text-sm font-medium">Download Full AI Report</div>
          <div className="px-4 py-2 bg-brand-600 rounded-lg text-sm font-medium">Schedule Strategy Meeting</div>
        </div>
      </div>
    </div>
  );
};

export default AIInsights;
