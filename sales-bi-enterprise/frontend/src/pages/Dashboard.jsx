import React, { useEffect, useState } from 'react';
import { 
  DollarSign, 
  ShoppingCart, 
  TrendingUp, 
  Users, 
  Download,
  Filter,
  Calendar,
  Zap,
  CheckCircle2,
  MapPin,
  Award
} from 'lucide-react';
import KPICard from '../components/KPICard';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { motion } from 'framer-motion';
import { getKPIs, getRevenueTrend, getRegionalSales, getCategorySales } from '../services/analyticsService';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState(null);
  const [revenueTrend, setRevenueTrend] = useState([]);
  const [regionalSales, setRegionalSales] = useState([]);
  const [categorySales, setCategorySales] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [kpiData, trendData, regionalData, catData] = await Promise.all([
          getKPIs(),
          getRevenueTrend(),
          getRegionalSales(),
          getCategorySales()
        ]);
        setKpis(kpiData);
        setRevenueTrend(trendData);
        setRegionalSales(regionalData.map(item => ({ name: item.region, value: item.revenue })));
        setCategorySales(catData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        // Ensure kpis is not null even on error to avoid crash, but keep it empty
        setKpis({
          totalRevenue: 0,
          totalSales: 0,
          profitMargin: 0,
          newCustomers: 0,
          quotaAttainment: 0,
          topRegion: 'Error',
          topProduct: 'Error'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const COLORS = ['#0ea5e9', '#6366f1', '#8b5cf6', '#ec4899'];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-6">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 border-4 border-brand-100 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Zap className="w-8 h-8 text-brand-500 animate-pulse" />
          </div>
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-xl font-bold">Initializing Analytics Engine</h3>
          <p className="text-slate-500 font-medium animate-pulse">Fetching real-time business intelligence data...</p>
        </div>
      </div>
    );
  }

  const formatCurrency = (val) => {
    if (!val && val !== 0) return '$0';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Executive Overview</h2>
          <p className="text-slate-500">Welcome back, here's what's happening with your sales today.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border rounded-lg text-sm font-medium hover:bg-slate-50">
            <Calendar className="w-4 h-4" />
            Last 30 Days
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700">
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
          change={kpis?.totalRevenue > 0 ? 12.5 : 0} 
          isPositive={true} 
          icon={DollarSign} 
        />
        <KPICard 
          title="Total Orders" 
          value={kpis?.totalSales || 0} 
          change={kpis?.totalSales > 0 ? 8.2 : 0} 
          isPositive={true} 
          icon={ShoppingCart} 
        />
        <KPICard 
          title="Profit Margin" 
          value={`${kpis?.profitMargin || 0}%`} 
          change={kpis?.profitMargin > 0 ? 2.4 : 0} 
          isPositive={true} 
          icon={TrendingUp} 
        />
        <KPICard 
          title="New Customers" 
          value={kpis?.newCustomers || 0} 
          change={kpis?.newCustomers > 0 ? 18.7 : 0} 
          isPositive={true} 
          icon={Users} 
        />
      </div>

      {/* Second KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <KPICard 
          title="Quota Attainment" 
          value={`${kpis?.quotaAttainment || 0}%`} 
          change={kpis?.quotaAttainment > 0 ? 2.1 : 0} 
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
            <select className="bg-transparent text-sm font-medium focus:outline-none">
              <option>Monthly</option>
              <option>Weekly</option>
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
      <div className="p-6 rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <Zap className="w-6 h-6 fill-current" />
          <h3 className="text-xl font-bold">AI Business Insights</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl">
            <p className="text-sm font-medium mb-1 opacity-80">Revenue Forecast</p>
            <p className="text-lg font-bold">Expect 15% growth next month based on current trends in Asia Pacific.</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl">
            <p className="text-sm font-medium mb-1 opacity-80">Anomaly Alert</p>
            <p className="text-lg font-bold">Unusual spike in Furniture sales detected in Europe region (+40%).</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl">
            <p className="text-sm font-medium mb-1 opacity-80">Optimization Tip</p>
            <p className="text-lg font-bold">Increasing social media spend by 10% could improve conversion rate by 3.2%.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
