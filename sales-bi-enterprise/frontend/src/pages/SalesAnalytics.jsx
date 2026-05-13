import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  ScatterChart, Scatter, ZAxis, ComposedChart
} from 'recharts';
import { Download, Filter, TrendingUp, Target, Award, Loader2 } from 'lucide-react';
import { getRegionalSales, getKPIs, getScatterData } from '../services/analyticsService';

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
          target: item.revenue * 0.9 // Mocking target for now
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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <Loader2 className="w-10 h-10 text-brand-500 animate-spin" />
        <p className="text-slate-500 font-medium">Analyzing Sales Performance...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Sales Performance Analytics</h2>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 glass rounded-lg text-sm font-medium">
            <Filter className="w-4 h-4" /> Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium">
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      {/* Sales Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl glass border-l-4 border-brand-500">
          <p className="text-sm text-slate-500 mb-1">Quota Attainment</p>
          <h3 className="text-2xl font-bold">94.2%</h3>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full mt-4">
            <div className="bg-brand-500 h-2 rounded-full" style={{ width: '94.2%' }}></div>
          </div>
        </div>
        <div className="p-6 rounded-2xl glass border-l-4 border-emerald-500">
          <p className="text-sm text-slate-500 mb-1">Top Region</p>
          <h3 className="text-2xl font-bold">{kpis?.topRegion}</h3>
          <p className="text-xs text-emerald-600 font-medium mt-2 flex items-center gap-1">
            <Award className="w-3 h-3" /> Leading by Revenue
          </p>
        </div>
        <div className="p-6 rounded-2xl glass border-l-4 border-amber-500">
          <p className="text-sm text-slate-500 mb-1">Top Product</p>
          <h3 className="text-2xl font-bold truncate">{kpis?.topProduct}</h3>
          <p className="text-xs text-amber-600 font-medium mt-2 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +5.2% vs last month
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sales vs Target */}
        <div className="p-6 rounded-2xl glass">
          <h3 className="font-bold mb-6">Sales vs Target by Region</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regionalData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="region" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="sales" name="Actual Sales" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                <Bar dataKey="target" name="Target (90%)" fill="#e2e8f0" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sales Distribution */}
        <div className="p-6 rounded-2xl glass">
          <h3 className="font-bold mb-6">Sales vs Marketing Spend</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" dataKey="x" name="Spend" unit="$" tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis type="number" dataKey="y" name="Sales" unit="$" tick={{fill: '#94a3b8', fontSize: 12}} />
                <ZAxis type="number" dataKey="z" range={[60, 400]} name="Quantity" />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Scatter name="Transactions" data={scatterData} fill="#8b5cf6" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesAnalytics;
