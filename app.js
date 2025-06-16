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
app.use('/auth', userAuthRouter);
app.use('/blog', blogRouter);


module.exports = app;