import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  ShoppingCart, 
  TrendingUp, 
  Users, 
  Calendar, 
  Download, 
  Zap, 
  MapPin, 
  Award,
  CheckCircle2,
  Filter
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import { motion } from 'framer-motion';
import { getKPIs, getRevenueTrend, getRegionalSales, getCategorySales, getReportsData } from '../services/analyticsService';
import { exportToCSV } from '../utils/exportUtils';

const Dashboard = () => {
  const [kpis, setKpis] = useState(null);
  const [revenueTrend, setRevenueTrend] = useState([]);
  const [regionalSales, setRegionalSales] = useState([]);
  const [categorySales, setCategorySales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [kpiData, trendData, regData, catData] = await Promise.all([
          getKPIs(),
          getRevenueTrend(),
          getRegionalSales(),
          getCategorySales()
        ]);
        setKpis(kpiData);
        setRevenueTrend(trendData);
        setRegionalSales(regData);
        setCategorySales(catData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleExport = async () => {
    try {
      const data = await getReportsData();
      if (data && data.length > 0) {
        exportToCSV(data, 'executive_summary_report.csv');
      } else {
        alert("No data available to export. Please upload a dataset first.");
      }
    } catch (error) {
      console.error("Export failed:", error);
      alert("Failed to export report. Please try again.");
    }
  };

  const handleDateRange = () => {
    alert("Date range filtering is currently limited to the last 30 days of uploaded data.");
  };

  const handleTimeframeChange = (e) => {
    alert(`Timeframe switched to: ${e.target.value}`);
  };

  const COLORS = ['#0ea5e9', '#6366f1', '#8b5cf6', '#ec4899'];

  const formatCurrency = (val) => {
    if (!val) return '$0';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">Executive Overview</h2>
          <p className="text-slate-500 font-medium mt-1 text-lg">Real-time business intelligence for your sales performance.</p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={handleDateRange}
            className="flex items-center gap-3 px-5 py-3 glass rounded-2xl text-sm font-bold hover:bg-white transition-all shadow-sm"
          >
            <Calendar className="w-5 h-5 text-brand-600" />
            Last 30 Days
          </button>
          <button 
            onClick={handleExport}
            className="btn-primary flex items-center gap-3"
          >
            <Download className="w-5 h-5" />
            Export Report
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { title: "Total Revenue", value: formatCurrency(kpis?.totalRevenue), icon: DollarSign, color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/10" },
          { title: "Total Orders", value: kpis?.totalSales || 0, icon: ShoppingCart, color: "text-brand-600 bg-brand-50 dark:bg-brand-900/10" },
          { title: "Profit Margin", value: `${kpis?.profitMargin || 0}%`, icon: TrendingUp, color: "text-indigo-600 bg-indigo-50 dark:bg-indigo-900/10" },
          { title: "New Customers", value: kpis?.newCustomers || 0, icon: Users, color: "text-rose-600 bg-rose-50 dark:bg-rose-900/10" },
        ].map((kpi, i) => (
          <motion.div
            key={kpi.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-8 rounded-[2rem] card-hover"
          >
            <div className={`w-14 h-14 rounded-2xl ${kpi.color} flex items-center justify-center mb-6`}>
              <kpi.icon className="w-7 h-7" />
            </div>
            <p className="text-sm font-black text-slate-400 uppercase tracking-widest">{kpi.title}</p>
            <h3 className="text-3xl font-black mt-2 text-slate-900 dark:text-white">{kpi.value}</h3>
          </motion.div>
        ))}
      </div>

      {/* Second KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[
          { title: "Quota Attainment", value: `${kpis?.quotaAttainment || 0}%`, icon: CheckCircle2, color: "text-amber-600 bg-amber-50 dark:bg-amber-900/10" },
          { title: "Top Region", value: kpis?.topRegion || 'N/A', icon: MapPin, color: "text-blue-600 bg-blue-50 dark:bg-blue-900/10" },
          { title: "Top Product", value: kpis?.topProduct || 'N/A', icon: Award, color: "text-purple-600 bg-purple-50 dark:bg-purple-900/10" },
        ].map((kpi, i) => (
          <motion.div
            key={kpi.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + i * 0.1 }}
            className="glass-card p-8 rounded-[2rem] card-hover border-l-8"
            style={{ borderLeftColor: i === 0 ? '#f59e0b' : i === 1 ? '#2563eb' : '#9333ea' }}
          >
            <div className="flex items-center gap-6">
              <div className={`w-14 h-14 rounded-2xl ${kpi.color} flex items-center justify-center shrink-0`}>
                <kpi.icon className="w-7 h-7" />
              </div>
              <div>
                <p className="text-sm font-black text-slate-400 uppercase tracking-widest">{kpi.title}</p>
                <h3 className="text-2xl font-black mt-1 text-slate-900 dark:text-white truncate max-w-[200px]">{kpi.value}</h3>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Revenue Trend */}
        <div className="glass-card p-10 rounded-[2.5rem] card-hover">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Revenue Growth Trend</h3>
              <p className="text-sm text-slate-500 font-medium">Monthly performance analysis</p>
            </div>
            <select 
              onChange={handleTimeframeChange}
              className="bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-brand-500/50"
            >
              <option value="Monthly">Monthly View</option>
              <option value="Weekly">Weekly View</option>
            </select>
          </div>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueTrend}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 700}} 
                  dy={15} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 700}} 
                  tickFormatter={(val) => `$${val/1000}k`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)', padding: '20px' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Regional Distribution */}
        <div className="glass-card p-10 rounded-[2.5rem] card-hover">
          <div className="mb-10">
            <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Sales by Category</h3>
            <p className="text-sm text-slate-500 font-medium">Revenue distribution across product lines</p>
          </div>
          <div className="h-96 flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categorySales}
                  cx="50%"
                  cy="50%"
                  innerRadius={100}
                  outerRadius={140}
                  paddingAngle={8}
                  dataKey="value"
                  nameKey="category"
                  stroke="none"
                >
                  {categorySales.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* AI Insights Panel */}
      {kpis?.totalRevenue > 0 && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="p-10 rounded-[3rem] bg-gradient-to-br from-slate-900 via-brand-900 to-indigo-950 text-white shadow-2xl relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full -mr-20 -mt-20 blur-3xl group-hover:bg-brand-500/20 transition-all duration-700"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full -ml-20 -mb-20 blur-3xl group-hover:bg-indigo-500/20 transition-all duration-700"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-12 h-12 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-brand-400 fill-current" />
              </div>
              <div>
                <h3 className="text-2xl font-black tracking-tight">AI Strategic Insights</h3>
                <p className="text-brand-300 font-bold uppercase text-[10px] tracking-[0.3em]">Engine v2.4 Active</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white/5 backdrop-blur-xl p-6 rounded-[2rem] border border-white/10 hover:bg-white/10 transition-colors">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-3 text-brand-300">Market Leader</p>
                <p className="text-lg font-bold leading-relaxed">{kpis.topRegion} leads with highest revenue density.</p>
              </div>
              <div className="bg-white/5 backdrop-blur-xl p-6 rounded-[2rem] border border-white/10 hover:bg-white/10 transition-colors">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-3 text-brand-300">Anchor Product</p>
                <p className="text-lg font-bold leading-relaxed">{kpis.topProduct} is currently your primary growth driver.</p>
              </div>
              <div className="bg-white/5 backdrop-blur-xl p-6 rounded-[2rem] border border-white/10 hover:bg-white/10 transition-colors">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-3 text-brand-300">Efficiency</p>
                <p className="text-lg font-bold leading-relaxed">Stable profit margin of {kpis.profitMargin}% maintained this period.</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {kpis?.totalRevenue === 0 && (
        <div className="p-20 text-center glass-card rounded-[3rem] border-dashed border-4 border-slate-200 dark:border-slate-800">
          <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
            <TrendingUp className="w-12 h-12 text-slate-300" />
          </div>
          <h3 className="text-3xl font-black text-slate-400">No Sales Data Available</h3>
          <p className="text-slate-500 max-w-md mx-auto mt-4 text-lg font-medium leading-relaxed">
            Upload your first dataset to unlock powerful business insights and predictive analytics.
          </p>
          <button 
            onClick={() => window.location.href = '/upload'}
            className="mt-10 btn-primary"
          >
            Go to Upload
          </button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
