const Complaint = require("../models/Complaint");
const { analyzeComplaint } = require("../utils/aiService");

// @desc    Create new complaint
// @route   POST /api/complaints
// @access  Private
const createComplaint = async (req, res, next) => {
  try {
    const { name, email, title, description, category, location } = req.body;

    let complaint = await Complaint.create({
      name,
      email,
      title,
      description,
      category,
      location,
      submittedBy: req.user._id,
    });

    try {
      const aiResult = await analyzeComplaint({ title, description, category, location });
      complaint.aiAnalysis = aiResult;
      complaint.isAiAnalyzed = true;
      await complaint.save();
    } catch (aiError) {
      console.error("Auto AI Analysis failed:", aiError);
      // We do not fail the request if AI fails
    }

    res.status(201).json({ success: true, message: "Complaint submitted successfully.", complaint });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all complaints with filter, search, pagination, sort
// @route   GET /api/complaints
// @access  Private
const getAllComplaints = async (req, res, next) => {
  try {
    const {
      category,
      status,
      location,
      search,
      page = 1,
      limit = 10,
      sort = "-createdAt",
    } = req.query;

    const query = {};

    // Non-admin users only see their own complaints
    if (req.user.role !== "admin") {
      query.submittedBy = req.user._id;
    }

    if (category) query.category = category;
    if (status) query.status = status;
    if (location) query.location = { $regex: location, $options: "i" };
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
      ];
    }

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [complaints, total] = await Promise.all([
      Complaint.find(query)
        .populate("submittedBy", "name email role")
        .sort(sort)
        .skip(skip)
        .limit(limitNum),
      Complaint.countDocuments(query),
    ]);

    res.json({
      success: true,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      count: complaints.length,
      complaints,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single complaint
// @route   GET /api/complaints/:id
// @access  Private
const getComplaintById = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id).populate(
      "submittedBy",
      "name email role"
    );

    if (!complaint) {
      return res.status(404).json({ success: false, message: "Complaint not found." });
    }

    // Non-admin: only access own complaints
    if (
      req.user.role !== "admin" &&
      complaint.submittedBy?._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ success: false, message: "Not authorized to view this complaint." });
    }

    res.json({ success: true, complaint });
  } catch (error) {
    next(error);
  }
};

// @desc    Update complaint (status, etc.)
// @route   PUT /api/complaints/:id
// @access  Private
const updateComplaint = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ success: false, message: "Complaint not found." });
    }

    // Regular users can only update their own complaints (title/desc/category/location)
    // Admins can update anything including status
    if (req.user.role !== "admin") {
      if (complaint.submittedBy?.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: "Not authorized." });
      }
      // Users cannot change status directly
      delete req.body.status;
    }

    const allowedFields = ["title", "description", "category", "location", "status", "aiAnalysis", "isAiAnalyzed"];
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        complaint[field] = req.body[field];
      }
    });

    await complaint.save();
    res.json({ success: true, message: "Complaint updated.", complaint });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete complaint
// @route   DELETE /api/complaints/:id
// @access  Private/Admin
const deleteComplaint = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ success: false, message: "Complaint not found." });
    }

    // Non-admin can delete own pending complaints only
    if (req.user.role !== "admin") {
      if (complaint.submittedBy?.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: "Not authorized." });
      }
      if (complaint.status !== "Pending") {
        return res.status(400).json({ success: false, message: "Cannot delete a complaint that is already being processed." });
      }
    }

    await complaint.deleteOne();
    res.json({ success: true, message: "Complaint deleted successfully." });
  } catch (error) {
    next(error);
  }
};

// @desc    Search complaints by location
// @route   GET /api/complaints/search
// @access  Private
const searchComplaints = async (req, res, next) => {
  try {
    const { location, category, status } = req.query;
    const query = {};

    if (req.user.role !== "admin") query.submittedBy = req.user._id;
    if (location) query.location = { $regex: location, $options: "i" };
    if (category) query.category = category;
    if (status) query.status = status;

    const complaints = await Complaint.find(query)
      .populate("submittedBy", "name email")
      .sort("-createdAt")
      .limit(20);

    res.json({ success: true, count: complaints.length, complaints });
  } catch (error) {
    next(error);
  }
};

// @desc    Get complaint statistics (admin dashboard)
// @route   GET /api/complaints/stats
// @access  Private/Admin
const getStats = async (req, res, next) => {
  try {
    const [total, byStatus, byCategory, recent] = await Promise.all([
      Complaint.countDocuments(),
      Complaint.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
      Complaint.aggregate([{ $group: { _id: "$category", count: { $sum: 1 } } }]),
      Complaint.find().sort("-createdAt").limit(5).populate("submittedBy", "name"),
    ]);

    res.json({
      success: true,
      stats: {
        total,
        byStatus: byStatus.reduce((acc, s) => ({ ...acc, [s._id]: s.count }), {}),
        byCategory: byCategory.reduce((acc, c) => ({ ...acc, [c._id]: c.count }), {}),
        recent,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createComplaint,
  getAllComplaints,
  getComplaintById,
  updateComplaint,
  deleteComplaint,
  searchComplaints,
  getStats,
};
