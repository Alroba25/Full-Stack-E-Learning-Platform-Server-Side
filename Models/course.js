const mongoose = require("mongoose");
const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    price: {
      type: Number,
      default: 0,
    },

    isFree: {
      type: Boolean,
      default: true,
    },

    imageUrl: {
      type: String,
      required: true,
    },

    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },

    category: [
      {
        type: String,
        enum: [
          "Programming",
          "Data Science",
          "Design",
          "Business",
          "Marketing",
        ],
      },
    ],

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
  },
  {
    timestamps: true,
  },
);
module.exports = mongoose.model("Course", courseSchema);
