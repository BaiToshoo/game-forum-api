const User = require('../models/userModel');
const { themeModel, postModel, tokenBlacklistModel } = require('../models');

const userController = {
    async getAllUsers(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const skip = (page - 1) * limit;

            const users = await User.find({})
                .select('-password')
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
            res.status(500).json({
                success: false,
                message: 'Error searching users'
            });
        }
    },

    async deleteUser(req, res) {
        try {
            const userId = req.params.id;
            const currentUser = req.user;

            const isAdmin = currentUser.email === 'admin@gameforum.com';
            
            if (!isAdmin) {
                return res.status(403).json({
                    success: false,
                    message: 'Only administrators can delete user accounts'
                });
            }

            const userToDelete = await User.findById(userId);
            if (!userToDelete) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            if (userId === currentUser._id.toString()) {
                return res.status(403).json({
                    success: false,
                    message: 'Administrators cannot delete their own account'
                });
            }


            const userThemes = await themeModel.find({ userId });
            for (const theme of userThemes) {
                await postModel.deleteMany({ themeId: theme._id });
                
                await User.updateMany(
                    { themes: theme._id },
                    { $pull: { themes: theme._id } }
                );
            }
            await themeModel.deleteMany({ userId });

            const userPosts = await postModel.find({ userId });
            const userPostIds = userPosts.map(post => post._id);
            
            await themeModel.updateMany(
                { posts: { $in: userPostIds } },
                { $pull: { posts: { $in: userPostIds } } }
            );
            
            await User.updateMany(
                { posts: { $in: userPostIds } },
                { $pull: { posts: { $in: userPostIds } } }
            );
            
            await postModel.deleteMany({ userId });

            await postModel.updateMany(
                { likes: userId },
                { $pull: { likes: userId } }
            );

            await themeModel.updateMany(
                { subscribers: userId },
                { $pull: { subscribers: userId } }
            );

            await User.findByIdAndDelete(userId);

            res.json({
                success: true,
                message: `User '${userToDelete.username}' deleted successfully by admin`
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error deleting user account'
            });
        }
    }
};

module.exports = userController;
