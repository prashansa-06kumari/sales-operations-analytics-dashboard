import { useNavigate, NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BarChart2, 
  Settings, 
  FileText, 
  Zap, 
  TrendingUp, 
  Activity,
  LogOut,
  Database
} from 'lucide-react';

const Sidebar = () => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: BarChart2, label: 'Sales Analytics', path: '/sales' },
    { icon: Activity, label: 'Operations', path: '/operations' },
    { icon: Database, label: 'Upload Dataset', path: '/upload' },
    { icon: TrendingUp, label: 'Forecasting', path: '/forecasting' },
    { icon: Zap, label: 'AI Insights', path: '/ai-insights' },
    { icon: FileText, label: 'Reports', path: '/reports' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <aside className="w-72 h-full border-r glass flex flex-col m-4 rounded-[2.5rem] shadow-2xl overflow-hidden">
      <div className="p-8">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="w-12 h-12 bg-gradient-to-tr from-brand-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-brand-500/30 group-hover:scale-110 transition-transform duration-300">
            <BarChart2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tighter text-slate-900 dark:text-white leading-none">SalesBI</h1>
            <p className="text-[10px] font-black text-brand-600 dark:text-brand-400 uppercase tracking-widest mt-1">Enterprise</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
        <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Main Menu</p>
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
          >
            {({ isActive }) => (
              <div
                className={`
                  flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300
                  ${isActive
                    ? 'bg-brand-600 text-white shadow-xl shadow-brand-500/20 translate-x-1'
                    : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800/50 hover:translate-x-1'}
                `}
              >
                <item.icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'scale-110' : ''}`} />
                {item.label}
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-6">
        <div className="p-4 bg-slate-900 dark:bg-slate-800 rounded-[2rem] space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-brand-500 rounded-xl flex items-center justify-center text-white text-xs font-black">
              PRO
            </div>
            <p className="text-xs font-bold text-white">Upgrade to Pro</p>
          </div>
          <button className="w-full py-2 bg-white text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-colors">
            Get 20% Off
          </button>
        </div>
        
        <button 
          onClick={handleLogout}
          className="mt-6 flex items-center gap-4 px-4 py-3.5 w-full text-left text-sm font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/10 rounded-2xl transition-all group"
        >
          <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
