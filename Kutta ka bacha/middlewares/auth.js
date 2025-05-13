import User from "../Models/User.js";

// Middleware to protect routes
export const protect = async (req, res, next) => {
  try {
    // Get user from session
    const userId = req.session.userId;
    
    if (!userId) {
      return res.status(401).json({ 
        success: false,
        message: "Not authorized to access this route" 
      });
    }

    // Get user from database
    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: "User not found" 
      });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ 
      success: false,
      message: "Not authorized to access this route" 
    });
  }
};

// Middleware to check if user is admin
export const admin = (req, res, next) => {
  if (req.user && req.user.role === "service_provider") {
    next();
  } else {
    res.status(403).json({ 
      success: false,
      message: "Not authorized as service provider" 
    });
  }
};