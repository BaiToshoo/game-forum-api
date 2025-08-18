const { themeModel, postModel, userModel } = require('../models');
const { newPost } = require('./postController')

function getThemes(req, res, next) {
    themeModel.find()
        .populate('userId')
        .then(themes => res.json(themes))
        .catch(next);
}

function getTheme(req, res, next) {
    const { themeId } = req.params;

    themeModel.findById(themeId)
        .populate({
            path : 'posts',
            populate : {
              path : 'userId'
            }
          })
        .then(theme => res.json(theme))
        .catch(next);
}

function createTheme(req, res, next) {
    const { themeName, postText } = req.body;
    const { _id: userId } = req.user;

    themeModel.create({ themeName, userId, subscribers: [userId] })
        .then(theme => {
            return newPost(postText, userId, theme._id)
                .then(createdPost => {
                    return themeModel.findById(theme._id)
                        .populate({
                            path: 'posts',
                            populate: {
                                path: 'userId'
                            }
                        });
                })
                .then(updatedTheme => res.status(200).json(updatedTheme));
        })
        .catch(next);
}

function subscribe(req, res, next) {
    const themeId = req.params.themeId;
    const { _id: userId } = req.user;
    themeModel.findByIdAndUpdate({ _id: themeId }, { $addToSet: { subscribers: userId } }, { new: true })
        .then(updatedTheme => {
            res.status(200).json(updatedTheme)
        })
        .catch(next);
}

function unsubscribe(req, res, next) {
    const themeId = req.params.themeId;
    const { _id: userId } = req.user;
    themeModel.findByIdAndUpdate({ _id: themeId }, { $pull: { subscribers: userId } }, { new: true })
        .then(updatedTheme => {
            res.status(200).json(updatedTheme)
        })
        .catch(next);
}

function deleteTheme(req, res, next) {
    const { themeId } = req.params;
    const currentUser = req.user;

    const isAdmin = currentUser.email === 'admin@gameforum.com';
    
    if (!isAdmin) {
        return res.status(403).json({ 
            message: 'Only administrators can delete themes' 
        });
    }

    themeModel.findById(themeId)
        .populate('userId', 'username email')
        .then(theme => {
            if (!theme) {
                return res.status(404).json({ 
                    message: 'Theme not found' 
                });
            }

            return postModel.deleteMany({ themeId })
                .then(() => {
                    return userModel.updateMany(
                        { themes: themeId },
                        { $pull: { themes: themeId } }
                    );
                })
                .then(() => {
                    return postModel.find({ themeId }).then(posts => {
                        const postIds = posts.map(post => post._id);
                        if (postIds.length > 0) {
                            return userModel.updateMany(
                                { posts: { $in: postIds } },
                                { $pull: { posts: { $in: postIds } } }
                            );
                        }
                    });
                })
                .then(() => {
                    return themeModel.findByIdAndDelete(themeId);
                })
                .then(() => {
                    res.status(200).json({ 
                        message: `Theme '${theme.themeName}' deleted successfully by admin`
                    });
                });
        })
        .catch(next);
}

module.exports = {
    getThemes,
    createTheme,
    getTheme,
    subscribe,
    unsubscribe,
    deleteTheme
}
