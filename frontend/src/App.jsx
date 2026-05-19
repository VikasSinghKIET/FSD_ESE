import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./layouts/DashboardLayout";

// Pages
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashboardPage from "./pages/DashboardPage";
import ComplaintFormPage from "./pages/ComplaintFormPage";
import ComplaintListPage from "./pages/ComplaintListPage";
import ComplaintDetailPage from "./pages/ComplaintDetailPage";
import AdminPanelPage from "./pages/AdminPanelPage";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster 
          position="top-right"
          toastOptions={{
            className: "glass !bg-slate-900/90 !text-slate-200 !border-white/10",
            style: { backdropFilter: "blur(12px)" }
          }} 
        />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Protected Routes inside DashboardLayout */}
          <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/complaints/new" element={<ComplaintFormPage />} />
            <Route path="/complaints" element={<ComplaintListPage />} />
            <Route path="/complaints/:id" element={<ComplaintDetailPage />} />
            
            {/* Admin Only Route */}
            <Route 
              path="/admin" 
              element={<ProtectedRoute adminOnly><AdminPanelPage /></ProtectedRoute>} 
            />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
