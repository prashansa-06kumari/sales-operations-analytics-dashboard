import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Calendar, 
  Zap, 
  AlertCircle, 
  ArrowUpRight, 
  ArrowDownRight,
  Info,
  Loader2
} from 'lucide-react';
import { 
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Legend, ReferenceLine 
} from 'recharts';
import { motion } from 'framer-motion';
import api from '../services/api';

const Forecasting = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchForecast = async () => {
      try {
        const response = await api.get('/analytics/forecast');
        setData(response.data);
      } catch (error) {
        console.error('Error fetching forecast:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchForecast();
  }, []);

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-20">
        <Loader2 className="w-12 h-12 text-brand-600 animate-spin mb-4" />
        <p className="text-slate-500 font-medium">Training predictive models...</p>
      </div>
    );
  }

  if (!data || data.historical.length === 0) {
    return (
      <div className="p-12 text-center glass rounded-3xl border-dashed border-2 border-slate-200">
        <TrendingUp className="w-12 h-12 text-slate-300 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-slate-400">Insufficient Data for Forecasting</h3>
        <p className="text-slate-500 max-w-md mx-auto mt-2">
          Please upload a dataset with at least two months of historical sales data to generate predictive insights.
        </p>
      </div>
    );
  }

  const combinedData = [
    ...data.historical.map(d => ({ ...d, type: 'Historical' })),
    ...data.forecast.map(d => ({ ...d, type: 'Forecast' }))
  ];

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black tracking-tight">Sales Forecasting</h2>
          <p className="text-slate-500 font-medium">Predictive revenue trends powered by linear regression models.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-brand-50 text-brand-700 rounded-xl text-sm font-bold flex items-center gap-2">
            <Zap className="w-4 h-4" />
            AI Confidence: {data.metrics.confidence}%
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass p-6 rounded-3xl shadow-xl">
          <p className="text-sm font-bold text-slate-500 mb-1">Projected Growth</p>
          <div className="flex items-end gap-3">
            <h3 className="text-3xl font-black text-slate-900">{data.metrics.growthRate}%</h3>
            <div className={`flex items-center gap-1 text-sm font-bold mb-1 ${data.metrics.growthRate >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
              {data.metrics.growthRate >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              Next 6 Months
            </div>
          </div>
        </div>
        <div className="glass p-6 rounded-3xl shadow-xl">
          <p className="text-sm font-bold text-slate-500 mb-1">Next Month Forecast</p>
          <h3 className="text-3xl font-black text-slate-900">{formatCurrency(data.forecast[0]?.revenue)}</h3>
          <p className="text-xs font-bold text-slate-400 mt-1">Based on historical seasonality</p>
        </div>
        <div className="glass p-6 rounded-3xl shadow-xl bg-gradient-to-br from-brand-600 to-indigo-600 text-white border-none">
          <p className="text-sm font-bold opacity-80 mb-1">6-Month Target</p>
          <h3 className="text-3xl font-black">{formatCurrency(data.forecast.reduce((sum, d) => sum + d.revenue, 0))}</h3>
          <p className="text-xs font-bold opacity-60 mt-1">Total projected cumulative revenue</p>
        </div>
      </div>

      {/* Main Chart */}
      <div className="glass p-8 rounded-3xl shadow-xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-xl font-bold">Revenue Projection Trend</h3>
            <p className="text-sm text-slate-500">Comparing historical actuals with future predictions</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-brand-500 rounded-full"></div>
              <span className="text-xs font-bold text-slate-500">Historical</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-brand-200 border-2 border-brand-500 border-dashed rounded-full"></div>
              <span className="text-xs font-bold text-slate-500">Forecasted</span>
            </div>
          </div>
        </div>

        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={combinedData}>
              <defs>
                <linearGradient id="colorHist" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorFore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#94a3b8" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis 
                dataKey="month" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
                dy={10}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
                tickFormatter={(val) => `$${val/1000}k`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  borderRadius: '16px', 
                  border: 'none', 
                  boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' 
                }}
                formatter={(value) => [formatCurrency(value), 'Revenue']}
              />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="#4f46e5" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorHist)" 
                data={data.historical}
                animationDuration={1500}
              />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="#4f46e5" 
                strokeWidth={3}
                strokeDasharray="5 5"
                fillOpacity={1} 
                fill="url(#colorFore)" 
                data={data.forecast}
                animationDuration={1500}
              />
              <ReferenceLine x={data.historical[data.historical.length-1].month} stroke="#64748b" strokeDasharray="3 3" label={{ position: 'top', value: 'Today', fill: '#64748b', fontSize: 10, fontWeight: 800 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Insights Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass p-8 rounded-3xl shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold">Growth Analysis</h3>
          </div>
          <ul className="space-y-4">
            <li className="flex gap-4">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0"></div>
              <p className="text-sm text-slate-600 font-medium">Based on current trends, your projected growth rate is {data.metrics.growthRate}%.</p>
            </li>
            <li className="flex gap-4">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0"></div>
              <p className="text-sm text-slate-600 font-medium">Historical data shows steady performance with {data.metrics.confidence}% statistical confidence.</p>
            </li>
          </ul>
        </div>

        <div className="glass p-8 rounded-3xl shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold">Forecast Variance</h3>
          </div>
          <ul className="space-y-4">
            <li className="flex gap-4">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0"></div>
              <p className="text-sm text-slate-600 font-medium">Predictions include a +/- 5% variance to account for market fluctuations.</p>
            </li>
            <li className="flex gap-4">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0"></div>
              <p className="text-sm text-slate-600 font-medium">Next month's revenue is estimated at approximately {formatCurrency(data.forecast[0]?.revenue)}.</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Forecasting;
