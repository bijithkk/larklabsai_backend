const express = require('express');
const router = express.Router();
const upload = require("../middleware/multer");
const verifyToken = require('../middleware/jwt');
const blogController = require('../controllers/blogController');

//create new product
router.post("/add",verifyToken,upload.single("coverImage"), blogController.createBlog);

router.patch("/update/:id",verifyToken,upload.single("coverImage"), blogController.updateBlog);

router.delete("/delete/:id",verifyToken, blogController.deleteBlog);

router.get("/get",blogController.getAllBlog);

router.get("/get/:id",blogController.getBlogById);

module.exports = router;
