import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Search, Filter, RefreshCw, Download } from "lucide-react";
import { complaintService } from "../services/complaintService";
import { CATEGORIES, STATUSES, downloadCSV } from "../utils/helpers";
import { useAuth } from "../context/AuthContext";
import ComplaintCard from "../components/ComplaintCard";
import Button from "../components/Button";
import FormInput from "../components/FormInput";
import Loader from "../components/Loader";

const ComplaintListPage = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ category: "", status: "", search: "" });
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

  const fetchComplaints = async (page = 1) => {
    setLoading(true);
    try {
      const params = { ...filters, page, limit: 12 };
      // Clean empty filters
      Object.keys(params).forEach(k => !params[k] && delete params[k]);
      
      const res = await complaintService.getAll(params);
      setComplaints(res.complaints);
      setPagination({ page: res.page, pages: res.pages, total: res.total });
    } catch (error) {
      toast.error("Failed to load complaints");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.category, filters.status]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchComplaints(1);
  };

  const handleExport = () => {
    downloadCSV(complaints, `complaints_export_${new Date().getTime()}.csv`);
  };

  return (
    <div className="fade-in space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">
            {isAdmin ? "All Complaints" : "My Complaints"}
          </h1>
          <p className="text-slate-400 mt-1">Manage and track issues</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" icon={RefreshCw} onClick={() => fetchComplaints(pagination.page)}>
            Refresh
          </Button>
          <Button variant="secondary" icon={Download} onClick={handleExport}>
            Export
          </Button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="glass p-4">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <FormInput
              id="search"
              placeholder="Search by title, location, or description..."
              icon={Search}
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </div>
          <div className="flex items-center gap-4">
            <select
              className="input w-full md:w-48 appearance-none bg-slate-900"
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            >
              <option value="">All Categories</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select
              className="input w-full md:w-40 appearance-none bg-slate-900"
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            >
              <option value="">All Statuses</option>
              {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <Button type="submit" className="hidden md:flex">Search</Button>
          </div>
        </form>
      </div>

      {/* List */}
      {loading ? (
        <Loader />
      ) : complaints.length === 0 ? (
        <div className="glass p-12 text-center">
          <Filter className="mx-auto text-slate-500 mb-4" size={32} />
          <h3 className="text-lg font-medium text-white mb-2">No complaints found</h3>
          <p className="text-slate-400">Try adjusting your filters or search query.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {complaints.map(c => (
              <ComplaintCard 
                key={c._id} 
                complaint={c} 
                onClick={(id) => navigate(`/complaints/${id}`)}
              />
            ))}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: pagination.pages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => fetchComplaints(i + 1)}
                  className={`w-10 h-10 rounded-xl font-medium transition-all ${
                    pagination.page === i + 1
                      ? "bg-violet-600 text-white shadow-lg shadow-violet-500/25"
                      : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ComplaintListPage;
