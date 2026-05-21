import React, { useState, useEffect } from 'react';
import { Download, FileText, Filter, Search, Loader2 } from 'lucide-react';
import { getReportsData } from '../services/analyticsService';
import { motion } from 'framer-motion';
import { exportToCSV } from '../utils/exportUtils';

const Reports = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const reportsData = await getReportsData();
        setData(reportsData);
      } catch (error) {
        console.error("Error fetching reports:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDownload = () => {
    if (data.length === 0) return;
    exportToCSV(data, 'full_sales_report.csv');
  };

  const filteredData = data.filter(item => 
    item.product_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.region_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <Loader2 className="w-10 h-10 text-brand-500 animate-spin" />
        <p className="text-slate-500 font-medium">Generating Business Reports...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Sales & Operational Reports</h2>
          <p className="text-slate-500">Review and export detailed transaction data.</p>
        </div>
        <button 
          onClick={handleDownload}
          className="flex items-center gap-2 px-6 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-brand-500/20 hover:bg-brand-700 transition-all"
        >
          <Download className="w-4 h-4" /> Export Full Report
        </button>
      </div>

      <div className="p-6 rounded-3xl glass space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search by product, customer, or region..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-2xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-brand-500 transition-all outline-none"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-3 glass rounded-2xl text-sm font-medium">
            <Filter className="w-4 h-4" /> Filters
          </button>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4 font-bold">Order ID</th>
                <th className="px-6 py-4 font-bold">Date</th>
                <th className="px-6 py-4 font-bold">Customer</th>
                <th className="px-6 py-4 font-bold">Product</th>
                <th className="px-6 py-4 font-bold">Region</th>
                <th className="px-6 py-4 font-bold text-right">Revenue</th>
                <th className="px-6 py-4 font-bold text-right">Profit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {filteredData.map((row, index) => (
                <motion.tr 
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.02 }}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <td className="px-6 py-4 font-medium">{row.order_id}</td>
                  <td className="px-6 py-4 text-slate-500">{row.order_date}</td>
                  <td className="px-6 py-4 font-medium">{row.customer_name}</td>
                  <td className="px-6 py-4 text-slate-500">{row.product_name}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-400">
                      {row.region_name}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-bold">${row.revenue?.toLocaleString()}</td>
                  <td className="px-6 py-4 text-right font-bold text-emerald-600">${row.profit?.toLocaleString()}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {filteredData.length === 0 && (
            <div className="p-12 text-center space-y-4">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto text-slate-400">
                <FileText className="w-8 h-8" />
              </div>
              <p className="text-slate-500 font-medium">No report data found. Try uploading a dataset first.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;
