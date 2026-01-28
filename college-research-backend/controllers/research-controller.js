const Research = require("../models/research-model");
exports.submitResearch = async (req, res) => {
  try {
    const { title, description, documentUrl,guideId } = req.body;

    const research = await Research.create({
      title,
      description,
      documentUrl,
      student: req.user._id,// from token
      guide: guideId, 
    });

    res.status(201).json({
      message: "Research submitted successfully",
      research,
    });
  } catch (error) {
    res.status(500).json({ message: "Submission failed", });
  }
};



exports.getMyResearch = async (req, res) => {
  const research = await Research.find({
    student: req.user._id,
  });
  res.json(research);
};



exports.getMyStudentsResearch = async (req, res) => {
  try {
    const teacherId = req.user._id;

    const research = await Research.find({ guide: teacherId })
      .populate("student", "name email")
      .sort({ createdAt: -1 });

    res.json(research);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch research" });
  }
};


exports.updateResearchStatus = async (req, res) => {
  try {
    const teacherId = req.user._id;
    const researchId = req.params.id;
    const { status, feedback } = req.body;

    // Find research
    const research = await Research.findById(researchId);

    if (!research) {
      return res.status(404).json({ message: "Research not found" });
    }

    // 🔐 SECURITY CHECK
    if (research.guide.toString() !== teacherId.toString()) {
      return res.status(403).json({
        message: "You are not allowed to update this research",
      });
    }

    // Update allowed fields
    if (status) research.status = status;
    if (feedback) research.feedback = feedback;

    await research.save();

    res.json({
      message: "Research updated successfully",
      research,
    });
  } catch (error) {
    res.status(500).json({ message: "Update failed" });
  }
};