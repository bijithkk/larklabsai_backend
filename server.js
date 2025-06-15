require("dotenv").config();
const app = require('./app');
const connectDB = require('./config/db');
const connectCloudinary = require("./config/cloudinary");

connectDB();
connectCloudinary();

// Start server
const PORT = process.env.PORT || 3004;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));