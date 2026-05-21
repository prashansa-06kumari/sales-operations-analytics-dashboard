# SalesBI Enterprise

SalesBI Enterprise is a modern business intelligence platform designed for sales and operational analytics. It features a React-based frontend and a Python (FastAPI) / Node.js backend to provide real-time insights, AI-driven forecasting, and automated ETL processes.

## 🚀 Features

- **Executive Dashboard**: Real-time KPI tracking (Revenue, Orders, Profit Margin, etc.).
- **Sales Analytics**: Deep dives into regional and category-wise sales performance.
- **Operations Analytics**: Monitoring supply chain efficiency and delivery metrics.
- **AI Insights**: Automated business recommendations and trend forecasting.
- **Intelligent ETL**: Easy dataset uploads with automatic cleaning and processing.
- **Authentication**: Secure role-based access control.

## 🛠 Tech Stack

### Frontend
- **Framework**: React 19
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Charts**: Recharts
- **Animations**: Framer Motion
- **Build Tool**: Vite

### Backend
- **Core**: Python (FastAPI) & Node.js (Express)
- **Database**: SQLite / SQLAlchemy
- **Data Processing**: Pandas, NumPy
- **Security**: JWT Authentication

## 📂 Project Structure

```text
sales_bi/
├── sales-bi-enterprise/
│   ├── frontend/         # React application
│   └── backend/          # FastAPI & Express services
├── .gitignore            # Global ignore file
└── README.md             # Project documentation
```

## ⚙️ Getting Started

### Prerequisites
- Node.js (v18+)
- Python (v3.9+)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd sales_bi
   ```

2. **Frontend Setup**
   ```bash
   cd sales-bi-enterprise/frontend
   npm install
   npm run dev
   ```

3. **Backend Setup**
   ```bash
   cd sales-bi-enterprise/backend
   # Python setup
   pip install -r requirements.txt
   # Node.js setup (if running server.js)
   npm install
   ```

## 📝 Usage

1. Sign up for an account or log in with existing credentials.
2. Navigate to the **Upload Dataset** page to import your sales data (CSV/Excel).
3. View your business metrics on the **Dashboard** and **Analytics** pages.
4. Explore **AI Insights** for data-driven recommendations.

## 🚀 Deployment Guide

### Docker Deployment (Recommended)
The easiest way to run the entire stack in production is using Docker Compose.

1. **Build and Start**:
   ```bash
   docker-compose up --build -d
   ```
2. **Access**:
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:8000`

### Frontend Deployment (Vercel / Netlify)
1. **Environment variable** (Vercel → Project → Settings → Environment Variables):
   - `VITE_API_URL` = `https://your-backend.onrender.com` (no trailing slash; `/api` is appended automatically)
   - Example: `VITE_API_URL=https://sales-operations-analytics-dashboard.onrender.com`
2. **Prepare Environment**: The frontend resolves `VITE_API_URL` to `{url}/api` so requests hit `/api/auth/*`, `/api/analytics/*`, etc.
2. **Build**: 
   ```bash
   cd frontend
   npm run build
   ```
3. **Deploy**: Upload the `dist` folder to your static hosting provider (Vercel, Netlify, etc.).

### Backend Deployment (Render / Railway / DigitalOcean)
1. **Choose Engine**: The project supports both Node.js (`server.js`) and Python (`app/main.py`).
2. **Node.js Deployment**:
   - Ensure `package.json` has a start script: `"start": "node server.js"`.
   - Set up your environment variables (e.g., `PORT`).
   - Deploy to a platform that supports Node.js.
3. **Database**: 
   - The current setup uses SQLite (`sales_bi.db`). 
   - For persistent storage on platforms like Render, use a **Persistent Disk** or migrate to a managed database like **PostgreSQL**.

## 📄 License

This project is licensed under the ISC License.
