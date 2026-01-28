const mongoose = require("mongoose");

const researchSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },

    // Student who submitted the research
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Teacher who reviews it
    guide: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    documentUrl: { type: String },

    status: {
      type: String,
      enum: ["pending", "under_review", "approved", "rejected"],
      default: "pending",
    },

    feedback: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Research", researchSchema);
