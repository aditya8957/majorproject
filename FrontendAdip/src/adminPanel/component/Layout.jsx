import React from 'react';
import { Link, useLocation, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
// import { logout } from '../store';
import {
  LayoutDashboard,
  FileText,
  Users,
  BarChart3,
  Settings,
  Search,
  Bell,
  User,
  LogOut,
  Target
} from 'lucide-react';
import { motion } from "framer-motion";  


// ---------------- SIDEBAR ----------------
const Sidebar = () => {
  const location = useLocation();
  const dispatch = useDispatch();

const navItems = [
  { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/admin/applications', icon: FileText, label: 'Applications' },
  { path: '/admin/ngos', icon: Users, label: 'NGOs' },
  { path: '/admin/reports', icon: BarChart3, label: 'Reports' },
  { path: '/admin/settings', icon: Settings, label: 'Settings' },
];

  return (
    <aside className="w-64 bg-slate-800 text-white h-screen fixed left-0 top-0 flex flex-col">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
            <Target className="text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">Divyang Sahayak Admin</h1>
            <p className="text-xs text-slate-400">Scheme Platform</p>
          </div>
        </div>

       <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = item.exact 
              ? location.pathname === item.path
              : location.pathname.startsWith(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <item.icon size={20} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* <div className="mt-auto p-6 border-t border-slate-800">
        <button
          onClick={() => dispatch(logout())}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all w-full text-left"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div> */}
    </aside>
  );
};


// ---------------- TOPBAR ----------------
const TopBar = () => {
  const user = useSelector((state) => state.app.currentUser);

  return (
    <header className="h-16 bg-white border-b border-slate-200 fixed top-0 right-0 left-64 z-10 flex items-center justify-between px-8">
      
      <div className="flex items-center gap-4 bg-slate-100 px-4 py-2 rounded-xl w-96">
        <Search size={18} className="text-slate-400" />
        <input
          type="text"
          placeholder="Search applications by ID or name..."
          className="bg-transparent border-none outline-none text-sm w-full"
        />
      </div>

      <div className="flex items-center gap-6">
        <button className="relative text-slate-400 hover:text-slate-600 transition-colors">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full border-2 border-white">
            3
          </span>
        </button>

        <div className="h-8 w-[1px] bg-slate-200"></div>

        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="text-right">
            <p className="text-sm font-semibold text-slate-900 group-hover:text-emerald-600 transition-colors">
              {user?.name}
            </p>
            <p className="text-xs text-slate-500">{user?.role}</p>
          </div>

          <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center overflow-hidden border-2 border-transparent group-hover:border-emerald-500 transition-all">
            <User className="text-slate-500" />
          </div>
        </div>
      </div>
    </header>
  );
};


// ---------------- LAYOUT ----------------
export const Layout = ({ children }) => {
  // const isAuthenticated = useSelector((state) => state.app.isAuthenticated);

  // if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <TopBar />

      <main className="ml-64 pt-16 p-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
};