const { userModel, themeModel, postModel } = require('../models');
const mongoose = require('mongoose');

function newPost(text, userId, themeId) {
    return postModel.create({ text, userId, themeId })
        .then(post => {
            return Promise.all([
                userModel.updateOne({ _id: userId }, { $push: { posts: post._id }, $addToSet: { themes: themeId } }),
                themeModel.findOneAndUpdate({ _id: themeId }, { $push: { posts: post._id }, $addToSet: { subscribers: userId } }, { new: true })
            ]).then(() => post); // Return just the post after updates
        });
}

function getLatestsPosts(req, res, next) {
    const limit = Number(req.query.limit) || 0;

    postModel.find()
        .sort({ created_at: -1 })
        .limit(limit)
        .populate('themeId userId')
        .then(posts => {
            res.status(200).json(posts)
        })
        .catch(next);
}

function createPost(req, res, next) {
    const { themeId } = req.params;
    const { _id: userId } = req.user;
    const { postText } = req.body;

    newPost(postText, userId, themeId)
        .then(createdPost => {
            // Return the populated post
            return postModel.findById(createdPost._id)
                .populate('userId themeId likes');
        })
        .then(populatedPost => {
            res.status(201).json(populatedPost);
        })
        .catch(next);
}

function editPost(req, res, next) {
    const { postId } = req.params;
    const { postText } = req.body;
    const { _id: userId } = req.user;

    postModel.findOneAndUpdate({ _id: postId, userId }, { text: postText }, { new: true })
        .then(updatedPost => {
            if (updatedPost) {
                res.status(200).json(updatedPost);
            }
            else {
                res.status(401).json({ message: `Not allowed!` });
            }
        })
        .catch(next);
}

function getPostById(req, res, next) {
    const { postId } = req.params;
    postModel.findById(postId)
        .populate('userId themeId')
        .then(post => {
            if (post) {
                res.status(200).json(post);
            } else {
                res.status(404).json({ message: 'Post not found' });
            }
        })
        .catch(next);
}

function getPostsByTheme(req, res, next) {
    const { themeId } = req.params;
    postModel.find({ themeId })
        .populate('userId likes')
        .then(posts => {
            if (posts.length > 0) {
                res.status(200).json(posts);
            } else {
                res.status(404).json({ message: 'No posts found for this theme' });
            }
        })
        .catch(next);
}

function deletePost(req, res, next) {
    const { postId, themeId } = req.params;
    const { _id: userId } = req.user;

    Promise.all([
        postModel.findOneAndDelete({ _id: postId, userId }),
        userModel.findOneAndUpdate({ _id: userId }, { $pull: { posts: postId } }),
        themeModel.findOneAndUpdate({ _id: themeId }, { $pull: { posts: postId } }),
    ])
        .then(([deletedOne, _, __]) => {
            if (deletedOne) {
                res.status(200).json(deletedOne)
            } else {
                res.status(401).json({ message: `Not allowed!` });
            }
        })
        .catch(next);
}

function like(req, res, next) {
    const { postId } = req.params;
    const { _id: userId } = req.user;

    postModel.findOneAndUpdate(
        { _id: postId },
        { $addToSet: { likes: userId } },
        { new: true }
    )
        .populate('userId themeId likes')
        .then(updatedPost => {
            if (updatedPost) {
                res.status(200).json(updatedPost);
            } else {
                res.status(404).json({ message: 'Post not found' });
            }
        })
        .catch(next)
}

function unlike(req, res, next) {
    const { postId } = req.params;
    const { _id: userId } = req.user;

    postModel.findOneAndUpdate(
        { _id: postId },
        { $pull: { likes: userId } },
        { new: true }
    )
        .populate('userId themeId likes')
        .then(updatedPost => {
            if (updatedPost) {
                res.status(200).json(updatedPost);
            } else {
                res.status(404).json({ message: 'Post not found' });
            }
        })
        .catch(next)
}

module.exports = {
    getLatestsPosts,
    getPostById,
    newPost,
    createPost,
    editPost,
    deletePost,
    getPostsByTheme,
    like,
    unlike
}
