import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import { protect, admin } from './middlewares/auth.js';
import { MONGODB_URI, PORT, SESSION_SECRET, CORS_ORIGIN, SESSION_COOKIE_MAX_AGE } from './config/config.js';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: CORS_ORIGIN,
  credentials: true
}));

app.use(bodyParser.json());

// Session middleware
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: MONGODB_URI,
    ttl: 24 * 60 * 60 // 1 day
  }),
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: SESSION_COOKIE_MAX_AGE
  }
}));

// MongoDB Connection
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);

// Add a protected test route
app.get('/api/protected', protect, (req, res) => {
    res.json({ message: 'Protected route accessed', user: req.user });
});

// Add an admin test route
app.get('/api/admin', protect, admin, (req, res) => {
    res.json({ message: 'Admin route accessed', user: req.user });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        success: false,
        message: 'Something went wrong!',
        error: err.message 
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});