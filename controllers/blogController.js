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
    const userId = req.user.id;

    // Find existing blog
    const existingBlog = await Blog.findById(blogId);
    if (!existingBlog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    if (existingBlog.author.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this blog",
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

    const blog = await Blog.findById(blogId);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    if (blog.author.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this blog",
      });
    }

    await blog.deleteOne();

    res.status(200).json({
      success: true,
      message: "Blog deleted successfully",
      blog
    });
  } catch (error) {
    console.error("Error deleting blog:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Failed to delete blog.",
    });
  }
};

exports.getAllBlog = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 8;
    const skip = (page - 1) * limit;
    const search = req.query.search || "";
    
    const finalQuery = {};
    if (search) {
      finalQuery.title = { $regex: search, $options: "i" };
    }

    const [blogs, total] = await Promise.all([
      Blog.find(finalQuery).skip(skip).limit(limit).populate("author"),
      Blog.countDocuments(finalQuery),
    ]);

    if (blogs.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No Blog found matching your criteria",
      });
    }

    res.status(200).json({
      success: true,
      data: blogs,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching Blog",
      error: error.message,
    });
  }
};

exports.getBlogById = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findById(id).populate('author');

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    res.status(200).json({ blog });
  } catch (error) {
    console.error("Error fetching blog:", error);
    res.status(500).json({ message: 'Server Error' });
  }
};
