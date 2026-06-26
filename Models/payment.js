const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    phoneNumber: {
      type: String,
      required: true,
    },

    paymentMethod: {
      type: String,
      enum: ["vodafone", "orange", "etisalat"],
      required: true,
    },

    paymentProof: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },

  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Payment", paymentSchema);
