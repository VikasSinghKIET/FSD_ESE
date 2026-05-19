const mongoose = require("mongoose");

const aiAnalysisSchema = new mongoose.Schema(
  {
    priority: { type: String, enum: ["Low", "Medium", "High", "Critical"], default: "Medium" },
    department: { type: String, default: "" },
    summary: { type: String, default: "" },
    autoResponse: { type: String, default: "" },
    confidenceScore: { type: Number, min: 0, max: 100, default: 0 },
    analyzedAt: { type: Date },
  },
  { _id: false }
);

const complaintSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    title: {
      type: String,
      required: [true, "Complaint title is required"],
      trim: true,
      minlength: [5, "Title must be at least 5 characters"],
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    description: {
      type: String,
      required: [true, "Complaint description is required"],
      minlength: [20, "Description must be at least 20 characters"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: [
        "Water Supply",
        "Electricity",
        "Garbage & Sanitation",
        "Roads & Infrastructure",
        "Public Safety",
        "Healthcare",
        "Education",
        "Other",
      ],
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Resolved", "Rejected"],
      default: "Pending",
    },
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    aiAnalysis: {
      type: aiAnalysisSchema,
      default: null,
    },
    isAiAnalyzed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Index for search and filter
complaintSchema.index({ location: "text", title: "text", description: "text" });
complaintSchema.index({ category: 1, status: 1, createdAt: -1 });

module.exports = mongoose.model("Complaint", complaintSchema);
