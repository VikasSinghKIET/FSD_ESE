import { Link } from "react-router-dom";
import { MapPin, Tag, Clock, Brain } from "lucide-react";
import { formatDate, getStatusClass, getPriorityClass, truncate } from "../utils/helpers";

const ComplaintCard = ({ complaint, onClick }) => {
  const { _id, title, category, location, status, createdAt, aiAnalysis, isAiAnalyzed } = complaint;

  return (
    <div
      className="glass-hover p-5 cursor-pointer fade-in"
      onClick={() => onClick?.(_id)}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="font-semibold text-white text-sm leading-snug line-clamp-2 flex-1">
          {title}
        </h3>
        <span className={getStatusClass(status)}>{status}</span>
      </div>

      {/* Meta */}
      <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-slate-400 mb-3">
        <span className="flex items-center gap-1"><Tag size={12} />{category}</span>
        <span className="flex items-center gap-1"><MapPin size={12} />{location}</span>
        <span className="flex items-center gap-1"><Clock size={12} />{formatDate(createdAt)}</span>
      </div>

      {/* AI badge */}
      {isAiAnalyzed && aiAnalysis && (
        <div className="flex items-center gap-2 mt-2 pt-2 border-t border-white/10">
          <Brain size={12} className="text-violet-400" />
          <span className="text-xs text-slate-400">AI Analyzed:</span>
          <span className={getPriorityClass(aiAnalysis.priority)}>{aiAnalysis.priority}</span>
          <span className="text-xs text-slate-500 truncate">{aiAnalysis.department}</span>
        </div>
      )}
    </div>
  );
};

export default ComplaintCard;
