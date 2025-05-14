import dotenv from 'dotenv';
dotenv.config();

// MongoDB connection string
export const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/kaamkrao";

// Server port
export const PORT = process.env.PORT || 5000;

// Session secret
export const SESSION_SECRET = process.env.SESSION_SECRET || "your-secret-key";

// CORS origin
export const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:3000";

// Session cookie settings
export const SESSION_COOKIE_MAX_AGE = 24 * 60 * 60 * 1000; // 1 day