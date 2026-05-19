const Complaint = require("../models/Complaint");
const { analyzeComplaint } = require("../utils/aiService");

// @desc    Analyze a complaint using OpenRouter AI
// @route   POST /api/ai/analyze
// @access  Private
const analyzeComplaintAI = async (req, res, next) => {
  try {
    const { complaintId } = req.body;

    if (!complaintId) {
      return res.status(400).json({ success: false, message: "complaintId is required." });
    }

    const complaint = await Complaint.findById(complaintId);
    if (!complaint) {
      return res.status(404).json({ success: false, message: "Complaint not found." });
    }

    // Authorization: only owner or admin
    if (
      req.user.role !== "admin" &&
      complaint.submittedBy?.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ success: false, message: "Not authorized." });
    }

    if (!process.env.OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY === "your_openrouter_api_key_here") {
      return res.status(503).json({
        success: false,
        message: "AI service is not configured. Please set OPENROUTER_API_KEY in .env",
      });
    }

    const aiResult = await analyzeComplaint({
      title: complaint.title,
      description: complaint.description,
      category: complaint.category,
      location: complaint.location,
    });

    // Save AI analysis to complaint
    complaint.aiAnalysis = aiResult;
    complaint.isAiAnalyzed = true;
    await complaint.save();

    res.json({
      success: true,
      message: "AI analysis completed.",
      aiAnalysis: aiResult,
      complaint,
    });
  } catch (error) {
    // Handle OpenRouter specific errors
    if (error.response) {
      return res.status(error.response.status || 500).json({
        success: false,
        message: `AI API error: ${error.response.data?.error?.message || "Unknown AI error"}`,
      });
    }
    next(error);
  }
};

// @desc    Analyze complaint data directly (without saving)
// @route   POST /api/ai/analyze-raw
// @access  Private
const analyzeRaw = async (req, res, next) => {
  try {
    const { title, description, category, location } = req.body;

    if (!title || !description) {
      return res.status(400).json({ success: false, message: "title and description are required." });
    }

    if (!process.env.OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY === "your_openrouter_api_key_here") {
      return res.status(503).json({
        success: false,
        message: "AI service is not configured. Please set OPENROUTER_API_KEY in .env",
      });
    }

    const aiResult = await analyzeComplaint({ title, description, category: category || "Other", location: location || "Unknown" });

    res.json({ success: true, aiAnalysis: aiResult });
  } catch (error) {
    next(error);
  }
};

module.exports = { analyzeComplaintAI, analyzeRaw };
