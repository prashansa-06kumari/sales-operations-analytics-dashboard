import api from './api';

export const getKPIs = async () => {
  const response = await api.get('/analytics/kpis');
  return response.data;
};

export const getRevenueTrend = async () => {
  const response = await api.get('/analytics/revenue-trend');
  return response.data;
};

export const getRegionalSales = async () => {
  const response = await api.get('/analytics/regional-sales');
  return response.data;
};

export const getCategorySales = async () => {
  const response = await api.get('/analytics/category-sales');
  return response.data;
};

export const getOperationalMetrics = async () => {
  const response = await api.get('/analytics/operational-metrics');
  return response.data;
};

export const getScatterData = async () => {
  const response = await api.get('/analytics/scatter-data');
  return response.data;
};

export const getOperationalTrend = async () => {
  const response = await api.get('/analytics/operational-trend');
  return response.data;
};

export const getReportsData = async () => {
  const response = await api.get('/reports/sales-data');
  return response.data;
};
