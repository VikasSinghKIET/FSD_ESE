import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Send, MapPin, Tag } from "lucide-react";
import { complaintService } from "../services/complaintService";
import { CATEGORIES } from "../utils/helpers";
import { useAuth } from "../context/AuthContext";
import FormInput from "../components/FormInput";
import Button from "../components/Button";

const ComplaintFormPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    location: "",
    description: "",
    name: "", // Will be auto-filled backend side or user can provide
    email: "",
  });

  // Since we have auth, we can auto-fill name/email on backend, but schema requires it.
  // We'll let user type it or pre-fill from context.
  const { user } = useAuth();

  // Initialize with user data
  useState(() => {
    if (user) {
      setFormData(prev => ({ ...prev, name: user.name, email: user.email }));
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await complaintService.create(formData);
      toast.success("Complaint submitted successfully!");
      // Navigate to the detail page of the new complaint
      navigate(`/complaints/${res.complaint._id}`);
    } catch (error) {
      const errRes = error.response?.data;
      if (errRes?.errors) {
        toast.error(errRes.errors[0].message);
      } else {
        toast.error(errRes?.message || "Failed to submit complaint");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-in max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">New Complaint</h1>
        <p className="text-slate-400 mt-1">Please provide detailed information about the issue.</p>
      </div>

      <div className="glass p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              id="name"
              label="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <FormInput
              id="email"
              type="email"
              label="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <FormInput
            id="title"
            label="Complaint Title"
            placeholder="E.g., Water leakage in Main Street"
            value={formData.title}
            onChange={handleChange}
            required
            minLength={5}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="category" className="text-sm font-medium text-slate-300">
                Category <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
                  <Tag size={16} />
                </span>
                <select
                  id="category"
                  className="input pl-10 appearance-none"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>Select a category</option>
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat} className="bg-slate-900">{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <FormInput
              id="location"
              label="Location"
              placeholder="Area, Sector, or Landmark"
              icon={MapPin}
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>

          <FormInput
            id="description"
            label="Detailed Description"
            placeholder="Please describe the issue in detail (minimum 20 characters)..."
            textarea
            value={formData.description}
            onChange={handleChange}
            required
            minLength={20}
          />

          <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
            <Button type="button" variant="secondary" onClick={() => navigate("/dashboard")}>
              Cancel
            </Button>
            <Button type="submit" loading={loading} icon={Send}>
              {loading ? "Analyzing with AI..." : "Submit Complaint"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ComplaintFormPage;
