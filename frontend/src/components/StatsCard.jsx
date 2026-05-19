const StatsCard = ({ icon: Icon, label, value, color = "violet", trend }) => {
  const colors = {
    violet: "from-violet-600/20 to-violet-600/5 border-violet-500/20 text-violet-400",
    blue: "from-blue-600/20 to-blue-600/5 border-blue-500/20 text-blue-400",
    emerald: "from-emerald-600/20 to-emerald-600/5 border-emerald-500/20 text-emerald-400",
    red: "from-red-600/20 to-red-600/5 border-red-500/20 text-red-400",
    yellow: "from-yellow-600/20 to-yellow-600/5 border-yellow-500/20 text-yellow-400",
    orange: "from-orange-600/20 to-orange-600/5 border-orange-500/20 text-orange-400",
  };

  return (
    <div className={`glass p-5 bg-gradient-to-br ${colors[color]} fade-in`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-slate-400">{label}</span>
        {Icon && <Icon size={20} className={colors[color].split(" ").pop()} />}
      </div>
      <p className="text-3xl font-bold text-white">{value ?? "—"}</p>
      {trend && <p className="text-xs text-slate-500 mt-1">{trend}</p>}
    </div>
  );
};

export default StatsCard;
