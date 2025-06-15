const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: {
      type: String,
      required: [true, 'A blog post must have content'],
    },
    coverImage: {
      type: String,
      required:true
    },
    author: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'A blog post must belong to an author']
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Blog", blogSchema);
