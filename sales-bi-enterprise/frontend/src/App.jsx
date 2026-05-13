import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import SalesAnalytics from './pages/SalesAnalytics';
import OperationsAnalytics from './pages/OperationsAnalytics';
import AIInsights from './pages/AIInsights';
import UploadDataset from './pages/UploadDataset';
import Reports from './pages/Reports';
import Login from './pages/Login';
import Signup from './pages/Signup';

// Placeholder components for remaining pages
const Forecasting = () => <div className="p-8"><h2 className="text-2xl font-bold">Forecasting & Predictions</h2><p className="mt-4 text-slate-500">Coming soon: Machine learning models for sales prediction.</p></div>;
const Settings = () => <div className="p-8"><h2 className="text-2xl font-bold">Platform Settings</h2><p className="mt-4 text-slate-500">Configure your dashboard preferences and data sources.</p></div>;

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/sales" element={<SalesAnalytics />} />
          <Route path="/operations" element={<OperationsAnalytics />} />
          <Route path="/forecasting" element={<Forecasting />} />
          <Route path="/ai-insights" element={<AIInsights />} />
          <Route path="/upload" element={<UploadDataset />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
