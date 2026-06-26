const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    // type: {
    //   type: String,
    //   enum: ["video", "text"],
    //   required: true,
    // },
    videoUrl: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },

    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    order: {
      type: Number,
      required: true,
    },
    duration: {
      type: String,
      default: "00:00",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Lesson", lessonSchema);
