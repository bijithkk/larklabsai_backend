const express = require('express');
const cors = require('cors');

const userAuthRouter = require('./routes/authRoutes');
const blogRouter = require('./routes/blogRoutes');

// APP config
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

//Routes
app.use('/api/auth', userAuthRouter);
app.use('/api/blog', blogRouter);


module.exports = app;