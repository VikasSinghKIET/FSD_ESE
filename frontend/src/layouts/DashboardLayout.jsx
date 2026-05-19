import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="page-wrapper flex flex-col h-screen overflow-hidden relative">
      {/* Background elements */}
      <div className="gradient-bg">
        <div className="orb bg-violet-600/20 w-96 h-96 top-0 left-0" />
        <div className="orb bg-blue-600/20 w-96 h-96 bottom-0 right-0 animation-delay-2000" />
      </div>

      <Navbar onMenuClick={() => setSidebarOpen(true)} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className="flex-1 overflow-y-auto p-4 lg:p-8 scroll-smooth">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
