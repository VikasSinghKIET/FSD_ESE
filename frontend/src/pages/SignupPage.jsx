import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Mail, Lock, User, Zap } from "lucide-react";
import { authService } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import FormInput from "../components/FormInput";
import Button from "../components/Button";

const SignupPage = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.id]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await authService.signup(formData);
      login(data);
      toast.success("Account created successfully!");
      navigate("/dashboard");
    } catch (error) {
      // Handle express-validator errors array or standard message
      const errRes = error.response?.data;
      if (errRes?.errors) {
        toast.error(errRes.errors[0].message);
      } else {
        toast.error(errRes?.message || "Signup failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper flex items-center justify-center p-4 relative overflow-hidden">
      <div className="gradient-bg">
        <div className="orb bg-indigo-600/20 w-96 h-96 bottom-[-10%] left-[-10%]" />
      </div>

      <div className="w-full max-w-md z-10 fade-in">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-lg shadow-violet-500/20 mb-4">
            <Zap className="text-white" size={24} />
          </Link>
          <h2 className="text-3xl font-bold text-white tracking-tight">Create Account</h2>
          <p className="text-slate-400 mt-2">Join us to report and track issues</p>
        </div>

        <div className="glass p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <FormInput
              id="name"
              type="text"
              label="Full Name"
              placeholder="John Doe"
              icon={User}
              value={formData.name}
              onChange={handleChange}
              required
            />
            <FormInput
              id="email"
              type="email"
              label="Email Address"
              placeholder="you@example.com"
              icon={Mail}
              value={formData.email}
              onChange={handleChange}
              required
            />
            <FormInput
              id="password"
              type="password"
              label="Password"
              placeholder="Minimum 6 characters"
              icon={Lock}
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
            />
            
            <Button type="submit" className="w-full mt-2" loading={loading} size="lg">
              Sign Up
            </Button>
          </form>

          <p className="text-center text-sm text-slate-400 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-violet-400 hover:text-violet-300 font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
