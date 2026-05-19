import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { Users, FileText, CheckCircle, Clock, ShieldAlert } from "lucide-react";
import { complaintService } from "../services/complaintService";
import { authService } from "../services/authService";
import { formatDate } from "../utils/helpers";
import StatsCard from "../components/StatsCard";
import Loader from "../components/Loader";
import Button from "../components/Button";

const AdminPanelPage = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("overview"); // overview, users

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes] = await Promise.all([
        complaintService.getStats(),
        authService.getAllUsers(),
      ]);
      setStats(statsRes.stats);
      setUsers(usersRes.users);
    } catch (error) {
      toast.error("Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleUser = async (id, currentStatus) => {
    try {
      await authService.toggleUserStatus(id);
      setUsers(users.map(u => u._id === id ? { ...u, isActive: !currentStatus } : u));
      toast.success(`User ${!currentStatus ? 'activated' : 'deactivated'}`);
    } catch (error) {
      toast.error("Failed to update user status");
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="fade-in space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <ShieldAlert className="text-violet-500" /> Admin Control Panel
          </h1>
          <p className="text-slate-400 mt-1">System overview and user management</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/10 pb-px mb-6">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "overview" 
              ? "border-violet-500 text-violet-400" 
              : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab("users")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "users" 
              ? "border-violet-500 text-violet-400" 
              : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          User Management
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && stats && (
        <div className="space-y-6 fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard icon={FileText} label="Total Complaints" value={stats.total} color="violet" />
            <StatsCard icon={CheckCircle} label="Resolved" value={stats.byStatus?.Resolved || 0} color="emerald" />
            <StatsCard icon={Clock} label="Pending" value={stats.byStatus?.Pending || 0} color="yellow" />
            <StatsCard icon={Users} label="Total Users" value={users.length} color="blue" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Category distribution */}
            <div className="glass p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Complaints by Category</h3>
              <div className="space-y-4">
                {Object.entries(stats.byCategory || {}).map(([cat, count]) => (
                  <div key={cat}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-300">{cat}</span>
                      <span className="text-slate-400">{count}</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2">
                      <div 
                        className="bg-violet-500 h-2 rounded-full" 
                        style={{ width: `${(count / stats.total) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent activity */}
            <div className="glass p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {stats.recent?.map(c => (
                  <div key={c._id} className="flex items-center gap-4 p-3 rounded-lg bg-white/5 border border-white/5">
                    <div className={`w-2 h-2 rounded-full ${c.status === 'Resolved' ? 'bg-emerald-500' : 'bg-yellow-500'}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{c.title}</p>
                      <p className="text-xs text-slate-400 truncate">by {c.name} • {formatDate(c.createdAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === "users" && (
        <div className="glass overflow-hidden fade-in">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-900/50 border-b border-white/10 text-slate-400">
                <tr>
                  <th className="px-6 py-4 font-medium">Name</th>
                  <th className="px-6 py-4 font-medium">Email</th>
                  <th className="px-6 py-4 font-medium">Role</th>
                  <th className="px-6 py-4 font-medium">Joined</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-white font-medium">{u.name}</td>
                    <td className="px-6 py-4 text-slate-300">{u.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        u.role === 'admin' ? 'bg-violet-500/20 text-violet-400' : 'bg-slate-500/20 text-slate-300'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400">{formatDate(u.createdAt)}</td>
                    <td className="px-6 py-4">
                      <span className={`flex items-center gap-1.5 ${u.isActive ? 'text-emerald-400' : 'text-red-400'}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${u.isActive ? 'bg-emerald-400' : 'bg-red-400'}`} />
                        {u.isActive ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {u.role !== 'admin' && (
                        <Button 
                          variant={u.isActive ? "danger" : "success"} 
                          size="sm"
                          onClick={() => handleToggleUser(u._id, u.isActive)}
                        >
                          {u.isActive ? "Disable" : "Enable"}
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanelPage;
