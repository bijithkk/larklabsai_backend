const express = require('express');
const cors = require('cors');

const userAuthRouter = require('./routes/authRoutes');

// APP config
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

//Routes
app.use('/api/user/auth', userAuthRouter);

module.exports = app;