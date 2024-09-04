const mongoose = require("mongoose");

const savedPostSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
  },
  {
    timestamps: true,
  }
);

savedPostSchema.index({ user: 1, post: 1 }, { unique: true });

const savedPostModel = new mongoose.model("SavedPost", savedPostSchema);

module.exports = savedPostModel;
