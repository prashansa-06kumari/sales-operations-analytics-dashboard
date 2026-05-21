import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend
} from 'recharts';
import { Truck, Clock, Package, CheckCircle, Loader2 } from 'lucide-react';
import { getOperationalMetrics, getOperationalTrend } from '../services/analyticsService';

const OperationsAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState(null);
  const [trendData, setTrendData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [mdata, tdata] = await Promise.all([
          getOperationalMetrics(),
          getOperationalTrend()
        ]);
        setMetrics(mdata);
        setTrendData(tdata);
      } catch (error) {
        console.error("Error fetching operations metrics:", error);
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
        <p className="text-slate-500 font-medium">Tracking Logistics Performance...</p>
      </div>
    );
  }

  if (!metrics || metrics.totalShipments === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-6 text-center">
        <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400">
          <Package className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold">No Operational Data Found</h3>
          <p className="text-slate-500 max-w-md mx-auto">
            Upload a dataset with 'delivery_days' and 'order_date' to see your supply chain performance metrics.
          </p>
          <button 
            onClick={() => window.location.href = '/upload'}
            className="mt-4 px-6 py-2 bg-brand-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-brand-500/20"
          >
            Upload Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Operations & Supply Chain</h2>

      {/* Operational KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="p-6 rounded-2xl glass">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600">
              <Truck className="w-5 h-5" />
            </div>
            <p className="text-sm font-medium text-slate-500">Total Shipments</p>
          </div>
          <h3 className="text-2xl font-bold">{metrics?.totalShipments}</h3>
        </div>
        <div className="p-6 rounded-2xl glass">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg text-amber-600">
              <Clock className="w-5 h-5" />
            </div>
            <p className="text-sm font-medium text-slate-500">Delayed Orders</p>
          </div>
          <h3 className="text-2xl font-bold text-amber-600">{metrics?.delayedOrders}</h3>
        </div>
        <div className="p-6 rounded-2xl glass">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg text-emerald-600">
              <CheckCircle className="w-5 h-5" />
            </div>
            <p className="text-sm font-medium text-slate-500">Fulfillment Efficiency</p>
          </div>
          <h3 className="text-2xl font-bold text-emerald-600">{metrics?.efficiency}%</h3>
        </div>
        <div className="p-6 rounded-2xl glass">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg text-indigo-600">
              <Package className="w-5 h-5" />
            </div>
            <p className="text-sm font-medium text-slate-500">Delay Rate</p>
          </div>
          <h3 className="text-2xl font-bold">{metrics?.delayRate}%</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Delivery Performance */}
        <div className="p-6 rounded-2xl glass">
          <h3 className="font-bold mb-6">Daily Delivery Performance</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" tick={{fontSize: 10}} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="onTime" name="On-Time" stackId="a" fill="#10b981" />
                <Bar dataKey="delayed" name="Delayed" stackId="a" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Operational Efficiency */}
        <div className="p-6 rounded-2xl glass">
          <h3 className="font-bold mb-6">Warehouse Efficiency Trend</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" tick={{fontSize: 10}} />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="onTime" stroke="#6366f1" strokeWidth={3} dot={{r: 4}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OperationsAnalytics;
