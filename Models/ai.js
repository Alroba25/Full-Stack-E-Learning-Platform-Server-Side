const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    messages: [
      {
        role: {
          type: String,
          enum: ["user", "assistant"],
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },

        content: String,
      },
    ],
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Chat", chatSchema);
