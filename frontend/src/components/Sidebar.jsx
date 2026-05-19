import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard, FilePlus, List, Shield,
  X, Zap, LogOut
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/complaints/new", icon: FilePlus, label: "New Complaint" },
  { to: "/complaints", icon: List, label: "My Complaints" },
];

const adminItems = [
  { to: "/admin", icon: Shield, label: "Admin Panel" },
];

const Sidebar = ({ isOpen, onClose }) => {
  const { isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate("/"); };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
    ${isActive
      ? "bg-gradient-to-r from-violet-600/30 to-indigo-600/30 text-violet-300 border border-violet-500/30"
      : "text-slate-400 hover:text-white hover:bg-white/5"
    }`;

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 z-40 bg-slate-900/95 border-r border-white/10
          backdrop-blur-xl flex flex-col transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static lg:h-auto`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-5 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
              <Zap size={16} className="text-white" />
            </div>
            <span className="font-bold text-white text-sm">AI Complaint</span>
          </div>
          <button onClick={onClose} className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10">
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider px-4 mb-2">
            Main
          </p>
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to} className={linkClass} onClick={onClose}>
              <Icon size={18} />
              {label}
            </NavLink>
          ))}

          {isAdmin && (
            <>
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider px-4 mb-2 mt-6">
                Admin
              </p>
              {adminItems.map(({ to, icon: Icon, label }) => (
                <NavLink key={to} to={to} className={linkClass} onClick={onClose}>
                  <Icon size={18} />
                  {label}
                </NavLink>
              ))}
            </>
          )}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-white/10 shrink-0">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
