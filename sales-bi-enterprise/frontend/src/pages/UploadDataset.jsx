import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { 
  Upload, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  X,
  History,
  Database
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';

const UploadDataset = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState(null); // 'success', 'error'
  const [message, setMessage] = useState('');
  const [progress, setProgress] = useState(0);

  const onDrop = useCallback((acceptedFiles) => {
    const selectedFile = acceptedFiles[0];
    if (selectedFile) {
      setFile(selectedFile);
      setStatus(null);
      setMessage('');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    },
    multiple: false
  });

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setStatus(null);
    setProgress(20);

    const formData = new FormData();
    formData.append('file', file);

    try {
      setProgress(50);
      const response = await api.post('/datasets/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percentCompleted > 50 ? percentCompleted : 50);
        }
      });
      
      setProgress(100);
      setStatus('success');
      setMessage(response.data.message);
      setFile(null);
    } catch (error) {
      console.error("Upload error:", error);
      setStatus('error');
      const errorDetail = error.response?.data?.detail || error.response?.data?.message || 'Server is not responding. Please ensure the backend is running.';
      setMessage(errorDetail);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight">Dataset Management</h2>
        <p className="text-slate-500">Upload your CSV or Excel files to refresh the analytics dashboard.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upload Section */}
        <div className="lg:col-span-2 space-y-6">
          <div 
            {...getRootProps()} 
            className={`
              relative p-12 border-2 border-dashed rounded-3xl transition-all cursor-pointer
              ${isDragActive ? 'border-brand-500 bg-brand-50/50' : 'border-slate-200 hover:border-brand-400 hover:bg-slate-50'}
              ${file ? 'border-brand-500 bg-brand-50/20' : ''}
              glass
            `}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-4 bg-brand-100 text-brand-600 rounded-2xl">
                <Upload className="w-8 h-8" />
              </div>
              <div>
                <p className="text-lg font-bold">
                  {file ? file.name : 'Drag & drop your dataset here'}
                </p>
                <p className="text-sm text-slate-500">
                  Supports CSV, XLSX, and XLS (Max 50MB)
                </p>
              </div>
              {!file && (
                <button className="px-6 py-2 bg-white border rounded-xl text-sm font-bold shadow-sm">
                  Select File
                </button>
              )}
            </div>
          </div>

          <AnimatePresence>
            {file && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="p-6 rounded-2xl glass border-brand-200 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-brand-50 text-brand-600 rounded-lg">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold">{file.name}</p>
                    <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(2)} KB</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setFile(null)}
                    disabled={uploading}
                    className="p-2 hover:bg-slate-100 rounded-lg text-slate-400"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={handleUpload}
                    disabled={uploading}
                    className="px-6 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-bold flex items-center gap-2 disabled:opacity-50"
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Database className="w-4 h-4" />
                        Start ETL
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {uploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-medium">
                <span>Uploading and Cleaning Data...</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="bg-brand-500 h-full"
                />
              </div>
            </div>
          )}

          {status && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`p-6 rounded-2xl flex items-start gap-4 ${
                status === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'
              }`}
            >
              {status === 'success' ? <CheckCircle2 className="w-6 h-6 shrink-0" /> : <AlertCircle className="w-6 h-6 shrink-0" />}
              <div>
                <p className="font-bold">{status === 'success' ? 'ETL Process Complete' : 'Upload Failed'}</p>
                <p className="text-sm opacity-90">{message}</p>
                {status === 'success' && (
                  <button 
                    onClick={() => window.location.href = '/'}
                    className="mt-4 text-sm font-bold underline"
                  >
                    View Updated Dashboard
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </div>

        {/* History / Info Sidebar */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl glass space-y-4">
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <History className="w-5 h-5" />
              <h3 className="font-bold">Recent Uploads</h3>
            </div>
            <div className="space-y-3">
              <p className="text-sm text-slate-500 italic text-center py-4">No recent activity</p>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900 text-white space-y-4 shadow-xl">
            <h3 className="font-bold flex items-center gap-2">
              <Database className="w-5 h-5" /> Data Requirements
            </h3>
            <ul className="text-sm space-y-2 opacity-80 list-disc pl-4">
              <li>CSV or XLSX format</li>
              <li>Required: order_date, revenue, product_name</li>
              <li>Optional: profit, quantity, category, region_name</li>
              <li>Automatically removes duplicates</li>
              <li>Cleans null values and normalizes dates</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadDataset;
