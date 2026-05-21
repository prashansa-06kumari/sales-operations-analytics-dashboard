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
import Settings from './pages/Settings';
import Forecasting from './pages/Forecasting';

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
