import User from '../Models/User.js';

// Signup a new user
export async function signup(req, res) {
    try {
        const { name, email, password, role } = req.body;
        
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ 
                success: false,
                message: "Email already in use" 
            });
        }

        // Create new user (password auto-hashed via pre-save hook)
        const user = await User.create({ name, email, password, role });

        // Set user session
        req.session.userId = user._id;

        res.status(201).json({ 
            success: true,
            data: {
                name: user.name,
                email: user.email,
                role: user.role,
                _id: user._id,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: "Registration failed",
            error: error.message 
        });
    }
}

// Login user
export async function login(req, res) {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ 
                success: false,
                message: "Invalid credentials" 
            });
        }

        // Set user session
        req.session.userId = user._id;

        res.json({ 
            success: true,
            data: {
                name: user.name,
                email: user.email,
                role: user.role,
                _id: user._id,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: "Login failed",
            error: error.message 
        });
    }
}

// Logout user
export function logout(req, res) {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ 
                success: false,
                message: "Logout failed" 
            });
        }
        res.json({ 
            success: true,
            message: "Logged out successfully" 
        });
    });
}

// Delete user (protected route)
export async function deleteUser(req, res) {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndDelete(id);
        
        if (!user) {
            return res.status(404).json({ 
                success: false,
                message: "User not found" 
            });
        }

        res.json({ 
            success: true,
            message: "User deleted successfully" 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: "Server error",
            error: error.message 
        });
    }
}