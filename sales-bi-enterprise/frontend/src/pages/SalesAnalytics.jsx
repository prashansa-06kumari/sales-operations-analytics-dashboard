import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  ScatterChart, Scatter, ZAxis, ComposedChart
} from 'recharts';
import { Download, Filter, TrendingUp, Target, Award, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { getRegionalSales, getKPIs, getScatterData, getReportsData } from '../services/analyticsService';
import { exportToCSV } from '../utils/exportUtils';

const SalesAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [regionalData, setRegionalData] = useState([]);
  const [kpis, setKpis] = useState(null);
  const [scatterData, setScatterData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [regData, kpiData, sData] = await Promise.all([
          getRegionalSales(),
          getKPIs(),
          getScatterData()
        ]);
        setRegionalData(regData.map(item => ({ 
          region: item.region, 
          sales: item.revenue, 
          target: item.revenue // Setting target to revenue for now as we don't have real targets
        })));
        setKpis(kpiData);
        setScatterData(sData);
      } catch (error) {
        console.error("Error fetching sales analytics:", error);
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
        exportToCSV(data, 'sales_analytics_report.csv');
      } else {
        alert("No data available to export. Please upload a dataset first.");
      }
    } catch (error) {
      console.error("Export failed:", error);
      alert("Failed to export report. Please try again.");
    }
  };

  const handleFilter = () => {
    alert("Filtering options (Region, Product Category, Date) will be available once the dataset grows beyond 100 records.");
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <Loader2 className="w-10 h-10 text-brand-500 animate-spin" />
        <p className="text-slate-500 font-medium">Analyzing Sales Performance...</p>
      </div>
    );
  }

  if (!kpis || kpis.totalRevenue === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-6 text-center">
        <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400">
          <TrendingUp className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold">No Sales Data for Analysis</h3>
          <p className="text-slate-500 max-w-md mx-auto">
            Upload a dataset in the "Upload Dataset" tab to see your sales performance metrics.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">Sales Analytics</h2>
          <p className="text-slate-500 font-medium mt-1 text-lg">Detailed performance breakdown and market trends.</p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={handleFilter}
            className="flex items-center gap-3 px-5 py-3 glass rounded-2xl text-sm font-bold hover:bg-white transition-all shadow-sm"
          >
            <Filter className="w-5 h-5 text-brand-600" />
            Filter View
          </button>
          <button 
            onClick={handleExport}
            className="btn-primary flex items-center gap-3"
          >
            <Download className="w-5 h-5" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Sales Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8 rounded-[2.5rem] glass-card card-hover border-l-8 border-brand-500"
        >
          <p className="text-sm font-black text-slate-400 uppercase tracking-widest mb-1">Quota Attainment</p>
          <h3 className="text-3xl font-black text-slate-900 dark:text-white">{kpis?.quotaAttainment}%</h3>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full mt-6">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${kpis?.quotaAttainment}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="bg-gradient-to-r from-brand-500 to-indigo-600 h-3 rounded-full shadow-lg shadow-brand-500/20"
            ></motion.div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-8 rounded-[2.5rem] glass-card card-hover border-l-8 border-emerald-500"
        >
          <p className="text-sm font-black text-slate-400 uppercase tracking-widest mb-1">Top Region</p>
          <h3 className="text-3xl font-black text-slate-900 dark:text-white truncate">{kpis?.topRegion}</h3>
          <div className="mt-6 flex items-center gap-2 text-emerald-600 bg-emerald-50 dark:bg-emerald-900/10 px-4 py-2 rounded-xl w-fit">
            <Award className="w-4 h-4" />
            <span className="text-xs font-black uppercase tracking-widest">Market Leader</span>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-8 rounded-[2.5rem] glass-card card-hover border-l-8 border-amber-500"
        >
          <p className="text-sm font-black text-slate-400 uppercase tracking-widest mb-1">Top Product</p>
          <h3 className="text-3xl font-black text-slate-900 dark:text-white truncate">{kpis?.topProduct}</h3>
          <div className="mt-6 flex items-center gap-2 text-amber-600 bg-amber-50 dark:bg-amber-900/10 px-4 py-2 rounded-xl w-fit">
            <TrendingUp className="w-4 h-4" />
            <span className="text-xs font-black uppercase tracking-widest">Best Seller</span>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Sales vs Target */}
        <div className="p-10 rounded-[2.5rem] glass-card card-hover">
          <div className="mb-10">
            <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Sales vs Target by Region</h3>
            <p className="text-sm text-slate-500 font-medium">Regional performance metrics</p>
          </div>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regionalData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis 
                  dataKey="region" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 700}} 
                  dy={15}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 700}}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)', padding: '20px' }}
                />
                <Legend verticalAlign="top" height={36} iconType="circle" />
                <Bar dataKey="sales" name="Actual Sales" fill="#4f46e5" radius={[10, 10, 0, 0]} />
                <Bar dataKey="target" name="Target (90%)" fill="#e2e8f0" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sales vs Marketing Spend */}
        <div className="p-10 rounded-[2.5rem] glass-card card-hover">
          <div className="mb-10">
            <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Sales vs Marketing Spend</h3>
            <p className="text-sm text-slate-500 font-medium">Efficiency analysis</p>
          </div>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" vertical={false} horizontal={false} stroke="#e2e8f0" />
                <XAxis 
                  type="number" 
                  dataKey="x" 
                  name="Spend" 
                  unit="$" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 700}} 
                  dy={15}
                />
                <YAxis 
                  type="number" 
                  dataKey="y" 
                  name="Sales" 
                  unit="$" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 700}}
                />
                <ZAxis type="number" dataKey="z" range={[100, 1000]} name="Quantity" />
                <Tooltip 
                  cursor={{ strokeDasharray: '3 3' }} 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)', padding: '20px' }}
                />
                <Scatter name="Transactions" data={scatterData} fill="#8b5cf6" fillOpacity={0.6} />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesAnalytics;
