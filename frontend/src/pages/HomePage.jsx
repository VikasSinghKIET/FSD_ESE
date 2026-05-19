import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Brain, ShieldCheck, Zap } from "lucide-react";

const HomePage = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="page-wrapper relative overflow-hidden flex flex-col">
      {/* Background orbs */}
      <div className="gradient-bg">
        <div className="orb bg-violet-600/20 w-[500px] h-[500px] top-[-10%] left-[-10%]" />
        <div className="orb bg-indigo-600/20 w-[600px] h-[600px] bottom-[-20%] right-[-10%] animation-delay-2000" />
      </div>

      {/* Nav */}
      <nav className="flex items-center justify-between p-6 max-w-7xl mx-auto w-full z-10">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
            <Zap className="text-white" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">AI<span className="text-violet-400">Complaint</span></span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Login</Link>
          <Link to="/signup" className="btn-primary">Get Started</Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center z-10 max-w-4xl mx-auto w-full mt-[-8vh]">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-sm font-medium mb-8 fade-in">
          <Brain size={16} />
          <span>Powered by OpenRouter AI</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 tracking-tight mb-6 fade-in" style={{ animationDelay: "100ms" }}>
          Smarter Complaint <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">Management</span>
        </h1>

        <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed fade-in" style={{ animationDelay: "200ms" }}>
          Report issues effortlessly. Our AI analyzes priority, routes it to the right department, and tracks resolution automatically.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 fade-in" style={{ animationDelay: "300ms" }}>
          <Link to="/signup" className="btn-primary text-lg px-8 py-4 w-full sm:w-auto">
            Start Reporting Now
          </Link>
          <Link to="/login" className="btn-secondary text-lg px-8 py-4 w-full sm:w-auto">
            Track Existing Issue
          </Link>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 w-full fade-in" style={{ animationDelay: "400ms" }}>
          <div className="glass p-6 text-left">
            <div className="w-12 h-12 rounded-lg bg-violet-500/20 text-violet-400 flex items-center justify-center mb-4">
              <Brain size={24} />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">AI Analysis</h3>
            <p className="text-slate-400 text-sm">Automatically determines priority and routes complaints to the correct department.</p>
          </div>
          <div className="glass p-6 text-left">
            <div className="w-12 h-12 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center mb-4">
              <Zap size={24} />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Instant Response</h3>
            <p className="text-slate-400 text-sm">Receive AI-generated immediate acknowledgment tailored to your specific issue.</p>
          </div>
          <div className="glass p-6 text-left">
            <div className="w-12 h-12 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
              <ShieldCheck size={24} />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Secure Tracking</h3>
            <p className="text-slate-400 text-sm">Role-based access ensures your data is safe and status updates are accurate.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
