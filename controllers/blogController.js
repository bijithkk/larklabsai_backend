const Blog = require("../models/blogModel");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

// Create a new product (blog post)
exports.createBlog = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: "All fields are required (title, content, coverImage, author)",
      });
    }

    if (!req.file) {
      return res.status(400).json({ error: "Image file is required" });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "products",
    });

    fs.unlinkSync(req.file.path);

    const newProduct = await Blog.create({
      title,
      content,
      coverImage: result.secure_url,
      author: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Blog created successfully",
      product: newProduct,
    });
  } catch (error) {
    console.error("Error creating Blog:", error);
    res.status(500).json({
      success: false,
      message: "Server Error. Failed to create Blog.",
    });
  }
};

//update blog by id
exports.updateBlog = async (req, res) => {
  try {
    const blogId = req.params.id;
    const { title, content } = req.body;

    // Find existing blog
    const existingBlog = await Blog.findById(blogId);
    if (!existingBlog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    // Handle new image upload if provided
    let coverImage = existingBlog.coverImage; // default to old image
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "products",
      });
      fs.unlinkSync(req.file.path); // delete local file
      coverImage = result.secure_url;
    }

    // Update blog fields
    existingBlog.title = title || existingBlog.title;
    existingBlog.content = content || existingBlog.content;
    existingBlog.coverImage = coverImage;

    const updatedBlog = await existingBlog.save();

    res.status(200).json({
      success: true,
      message: "Blog updated successfully",
      blog: updatedBlog,
    });
  } catch (error) {
    console.error("Error updating Blog:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Failed to update blog.",
    });
  }
};

// delete blog by id 
exports.deleteBlog = async (req, res) => {
  try {
    const blogId = req.params.id;

    const deletedBlog = await Blog.findByIdAndDelete(blogId);

    if (!deletedBlog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Blog deleted successfully",
      blog: deletedBlog,
    });
  } catch (error) {
    console.error("Error deleting blog:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Failed to delete blog.",
    });
  }
};
