import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  ArrowLeft, Brain, Trash2, MapPin, Tag,
  User, CheckCircle, AlertTriangle, Zap
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { complaintService } from "../services/complaintService";
import { aiService } from "../services/aiService";
import { formatDateTime, getStatusClass, getPriorityClass, STATUSES } from "../utils/helpers";
import Button from "../components/Button";
import Loader from "../components/Loader";
import Modal from "../components/Modal";

const ComplaintDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin, user } = useAuth();

  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);

  const fetchComplaint = async () => {
    try {
      const res = await complaintService.getById(id);
      setComplaint(res.complaint);
    } catch {
      toast.error("Failed to load complaint details");
      navigate("/complaints");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchComplaint();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleAnalyzeAI = async () => {
    setAiLoading(true);
    try {
      const res = await aiService.analyze(id);
      toast.success("AI Analysis complete!");
      setComplaint(res.complaint);
    } catch (error) {
      toast.error(error.response?.data?.message || "AI Analysis failed");
    } finally {
      setAiLoading(false);
    }
  };

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setStatusLoading(true);
    try {
      const res = await complaintService.update(id, { status: newStatus });
      setComplaint(res.complaint);
      toast.success("Status updated");
    } catch {
      toast.error("Failed to update status");
    } finally {
      setStatusLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await complaintService.delete(id);
      toast.success("Complaint deleted");
      navigate("/complaints");
    } catch {
      toast.error("Failed to delete complaint");
      setDeleteModal(false);
    }
  };

  if (loading) return <Loader />;
  if (!complaint) return null;

  const isOwner = complaint.submittedBy?._id === user?._id;
  const canDelete = isAdmin || (isOwner && complaint.status === "Pending");

  return (
    <div className="fade-in max-w-4xl mx-auto space-y-6">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft size={16} /> Back to List
      </button>

      {/* Header Info */}
      <div className="glass p-6 md:p-8 relative overflow-hidden">
        {/* Status band */}
        <div className={`absolute top-0 left-0 w-1 h-full ${complaint.status === "Pending" ? "bg-yellow-500" :
            complaint.status === "In Progress" ? "bg-blue-500" :
              complaint.status === "Resolved" ? "bg-emerald-500" : "bg-red-500"
          }`} />

        <div className="flex flex-col md:flex-row justify-between gap-6">
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-3">
              <span className={getStatusClass(complaint.status)}>{complaint.status}</span>
              <span className="text-xs text-slate-500">{formatDateTime(complaint.createdAt)}</span>
            </div>

            <h1 className="text-2xl font-bold text-white">{complaint.title}</h1>

            <div className="flex flex-wrap gap-4 text-sm text-slate-400">
              <span className="flex items-center gap-1.5"><Tag size={16} />{complaint.category}</span>
              <span className="flex items-center gap-1.5"><MapPin size={16} />{complaint.location}</span>
              <span className="flex items-center gap-1.5"><User size={16} />{complaint.name} ({complaint.email})</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 min-w-[200px]">
            {isAdmin && (
              <div className="flex flex-col gap-1">
                <label className="text-xs text-slate-500 font-medium">Update Status</label>
                <select
                  value={complaint.status}
                  onChange={handleStatusChange}
                  disabled={statusLoading}
                  className="input bg-slate-900 border-white/20 py-2 cursor-pointer focus:ring-violet-500/50"
                >
                  {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            )}

            {canDelete && (
              <Button
                variant="danger"
                icon={Trash2}
                onClick={() => setDeleteModal(true)}
                className="mt-auto"
              >
                Delete Complaint
              </Button>
            )}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/10">
          <h3 className="text-sm font-medium text-slate-400 mb-3">Description</h3>
          <p className="text-slate-200 whitespace-pre-wrap leading-relaxed">
            {complaint.description}
          </p>
        </div>
      </div>

      {/* AI Analysis Section */}
      <div className="glass overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-violet-900/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-500/20 text-violet-400 flex items-center justify-center">
              <Brain size={20} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">AI Analysis</h2>
              <p className="text-xs text-slate-400">Powered by OpenRouter</p>
            </div>
          </div>

          {(isAdmin || (isOwner && !complaint.isAiAnalyzed)) && (
            <Button onClick={handleAnalyzeAI} loading={aiLoading} icon={Zap}>
              {complaint.isAiAnalyzed ? "Re-Analyze AI" : "Run Analysis"}
            </Button>
          )}
        </div>

        <div className="p-6">
          {!complaint.isAiAnalyzed ? (
            <div className="text-center py-8">
              <Brain className="mx-auto text-slate-600 mb-3" size={32} />
              <p className="text-slate-400">This complaint hasn't been analyzed by AI yet.</p>
              {(isAdmin || isOwner) && (
                <button
                  onClick={handleAnalyzeAI}
                  className="mt-2 text-violet-400 text-sm hover:underline"
                >
                  Run analysis now
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Priority Level</p>
                  <span className={getPriorityClass(complaint.aiAnalysis.priority)}>
                    {complaint.aiAnalysis.priority} Priority
                  </span>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Assigned Department</p>
                  <p className="text-white font-medium flex items-center gap-2">
                    <CheckCircle size={14} className="text-emerald-400" />
                    {complaint.aiAnalysis.department}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">AI Confidence</p>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-violet-500 to-indigo-500"
                        style={{ width: `${complaint.aiAnalysis.confidenceScore}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-slate-300">
                      {complaint.aiAnalysis.confidenceScore}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-slate-900/50 rounded-xl p-4 border border-white/5">
                  <p className="text-xs text-slate-500 mb-2 font-medium">Auto-generated Summary</p>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {complaint.aiAnalysis.summary}
                  </p>
                </div>
                <div className="bg-slate-900/50 rounded-xl p-4 border border-white/5">
                  <p className="text-xs text-slate-500 mb-2 font-medium">Suggested Auto-Response</p>
                  <p className="text-sm text-slate-300 leading-relaxed italic">
                    "{complaint.aiAnalysis.autoResponse}"
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Modal */}
      <Modal
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        title="Delete Complaint"
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeleteModal(false)}>Cancel</Button>
            <Button variant="danger" onClick={handleDelete}>Delete</Button>
          </>
        }
      >
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-full bg-red-500/10 text-red-500 mt-1">
            <AlertTriangle size={24} />
          </div>
          <div>
            <p className="text-white font-medium mb-1">Are you absolutely sure?</p>
            <p className="text-sm text-slate-400">
              This action cannot be undone. This will permanently delete the complaint
              and remove all associated data and AI analysis from our servers.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ComplaintDetailPage;
