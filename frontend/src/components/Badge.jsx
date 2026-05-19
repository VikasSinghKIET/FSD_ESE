const Badge = ({ children, variant = "default" }) => {
  const variants = {
    default: "badge bg-slate-700/50 text-slate-300 border border-slate-600/50",
    purple: "badge bg-violet-500/20 text-violet-300 border border-violet-500/30",
    blue: "badge bg-blue-500/20 text-blue-400 border border-blue-500/30",
    green: "badge bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
    red: "badge bg-red-500/20 text-red-400 border border-red-500/30",
    yellow: "badge bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
  };
  return <span className={variants[variant]}>{children}</span>;
};

export default Badge;
