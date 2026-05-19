import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { FileText, CheckCircle, Clock, AlertTriangle, Plus } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { complaintService } from "../services/complaintService";
import StatsCard from "../components/StatsCard";
import ComplaintCard from "../components/ComplaintCard";
import Button from "../components/Button";
import Loader from "../components/Loader";

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ total: 0, recent: [] });
  const [stats, setStats] = useState({ pending: 0, progress: 0, resolved: 0 });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await complaintService.getAll({ limit: 5 });
        const allRes = await complaintService.getAll({ limit: 100 });

        let pending = 0, progress = 0, resolved = 0;
        allRes.complaints.forEach(c => {
          if (c.status === "Pending") pending++;
          else if (c.status === "In Progress") progress++;
          else if (c.status === "Resolved") resolved++;
        });

        setData({ total: allRes.total, recent: res.complaints });
        setStats({ pending, progress, resolved });
      } catch {
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="fade-in space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-slate-400 mt-1">Welcome back, {user?.name}</p>
        </div>
        <Button onClick={() => navigate("/complaints/new")} icon={Plus}>
          New Complaint
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard icon={FileText} label="Total Complaints" value={data.total} color="violet" />
        <StatsCard icon={Clock} label="Pending" value={stats.pending} color="yellow" />
        <StatsCard icon={AlertTriangle} label="In Progress" value={stats.progress} color="blue" />
        <StatsCard icon={CheckCircle} label="Resolved" value={stats.resolved} color="emerald" />
      </div>

      {/* Recent Complaints */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Recent Complaints</h2>
          {data.recent.length > 0 && (
            <Button variant="secondary" size="sm" onClick={() => navigate("/complaints")}>
              View All
            </Button>
          )}
        </div>

        {data.recent.length === 0 ? (
          <div className="glass p-12 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center text-slate-500 mb-4">
              <FileText size={32} />
            </div>
            <h3 className="text-lg font-medium text-white mb-1">No complaints yet</h3>
            <p className="text-slate-400 mb-6">You haven't submitted any complaints.</p>
            <Button onClick={() => navigate("/complaints/new")} icon={Plus}>
              Submit your first complaint
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {data.recent.map((complaint) => (
              <ComplaintCard
                key={complaint._id}
                complaint={complaint}
                onClick={(id) => navigate(`/complaints/${id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
