const User = require('../models/userModel');

const userController = {
    async getAllUsers(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const skip = (page - 1) * limit;

            const users = await User.find({})
                .select('-password') // Exclude password
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit);

            const total = await User.countDocuments();

            res.json({
                success: true,
                users: users,
                pagination: {
                    current: page,
                    total: Math.ceil(total / limit),
                    count: users.length,
                    totalUsers: total
                }
            });
        } catch (error) {
            console.error('Get all users error:', error);
            res.status(500).json({
                success: false,
                message: 'Error fetching users'
            });
        }
    },

    async getUserById(req, res) {
        try {
            const userId = req.params.id;

            const user = await User.findById(userId).select('-password');

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            res.json({
                success: true,
                user: user
            });
        } catch (error) {
            console.error('Get user by ID error:', error);
            res.status(500).json({
                success: false,
                message: 'Error fetching user'
            });
        }
    },

    async searchUsers(req, res) {
        try {
            const query = req.query.q;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const skip = (page - 1) * limit;

            if (!query) {
                return res.status(400).json({
                    success: false,
                    message: 'Search query is required'
                });
            }

            // Search by username or email (case insensitive)
            const searchRegex = new RegExp(query, 'i');
            
            const users = await User.find({
                $or: [
                    { username: { $regex: searchRegex } },
                    { email: { $regex: searchRegex } }
                ]
            })
            .select('-password')
            .sort({ username: 1 })
            .skip(skip)
            .limit(limit);

            res.json({
                success: true,
                users: users,
                query: query,
                count: users.length
            });
        } catch (error) {
            console.error('Search users error:', error);
            res.status(500).json({
                success: false,
                message: 'Error searching users'
            });
        }
    }
};

module.exports = userController;
