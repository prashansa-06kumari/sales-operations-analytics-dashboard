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

const KPICard = ({ title, value, change, isPositive, icon: Icon }) => (
  <div className="p-6 rounded-2xl glass shadow-sm">
    <div className="flex items-center justify-between mb-4">
      <div className="p-2 bg-brand-50 dark:bg-brand-900/20 rounded-lg text-brand-600 dark:text-brand-400">
        <Icon className="w-6 h-6" />
      </div>
      {change !== null && (
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
          {isPositive ? '+' : ''}{change}%
        </span>
      )}
    </div>
    <p className="text-sm text-slate-500 mb-1">{title}</p>
    <h3 className="text-2xl font-bold">{value}</h3>
  </div>
);

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
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Executive Overview</h2>
          <p className="text-slate-500">Welcome back, here's what's happening with your sales today.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleDateRange}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border rounded-lg text-sm font-medium hover:bg-slate-50"
          >
            <Calendar className="w-4 h-4" />
            Last 30 Days
          </button>
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700"
          >
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard 
          title="Total Revenue" 
          value={formatCurrency(kpis?.totalRevenue)} 
          change={0} 
          isPositive={true} 
          icon={DollarSign} 
        />
        <KPICard 
          title="Total Orders" 
          value={kpis?.totalSales || 0} 
          change={0} 
          isPositive={true} 
          icon={ShoppingCart} 
        />
        <KPICard 
          title="Profit Margin" 
          value={`${kpis?.profitMargin || 0}%`} 
          change={0} 
          isPositive={true} 
          icon={TrendingUp} 
        />
        <KPICard 
          title="New Customers" 
          value={kpis?.newCustomers || 0} 
          change={0} 
          isPositive={true} 
          icon={Users} 
        />
      </div>

      {/* Second KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <KPICard 
          title="Quota Attainment" 
          value={`${kpis?.quotaAttainment || 0}%`} 
          change={0} 
          isPositive={true} 
          icon={CheckCircle2} 
        />
        <KPICard 
          title="Top Region" 
          value={kpis?.topRegion || 'N/A'} 
          change={null} 
          isPositive={true} 
          icon={MapPin} 
        />
        <KPICard 
          title="Top Product" 
          value={kpis?.topProduct || 'N/A'} 
          change={null} 
          isPositive={true} 
          icon={Award} 
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Trend */}
        <div className="p-6 rounded-2xl glass">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold">Revenue Growth Trend</h3>
            <select 
              onChange={handleTimeframeChange}
              className="bg-transparent text-sm font-medium focus:outline-none"
            >
              <option value="Monthly">Monthly</option>
              <option value="Weekly">Weekly</option>
            </select>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueTrend}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#0ea5e9" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Regional Distribution */}
        <div className="p-6 rounded-2xl glass">
          <h3 className="font-bold mb-6">Sales by Category</h3>
          <div className="h-80 flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categorySales}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  nameKey="category"
                >
                  {categorySales.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* AI Insights Panel */}
      {kpis?.totalRevenue > 0 && (
        <div className="p-6 rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-xl">
          <div className="flex items-center gap-3 mb-4">
            <Zap className="w-6 h-6 fill-current" />
            <h3 className="text-xl font-bold">AI Business Insights</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl">
              <p className="text-sm font-medium mb-1 opacity-80">Top Performance</p>
              <p className="text-lg font-bold">{kpis.topRegion} is your leading region with high growth potential.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl">
              <p className="text-sm font-medium mb-1 opacity-80">Product Focus</p>
              <p className="text-lg font-bold">{kpis.topProduct} is the most popular product in your current dataset.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl">
              <p className="text-sm font-medium mb-1 opacity-80">Revenue Status</p>
              <p className="text-lg font-bold">Your total revenue has reached {formatCurrency(kpis.totalRevenue)} with {kpis.profitMargin}% margin.</p>
            </div>
          </div>
        </div>
      )}

      {kpis?.totalRevenue === 0 && (
        <div className="p-12 text-center glass rounded-3xl border-dashed border-2 border-slate-200">
          <TrendingUp className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-400">No Sales Data Available</h3>
          <p className="text-slate-500 max-w-md mx-auto mt-2">
            Upload a dataset in the "Upload Dataset" tab to see your business intelligence dashboard.
          </p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
