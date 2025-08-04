import { User } from "../models/user.model.js";
import sharp from "sharp";
import cloudinary from "../utils/cloudinary.js";
import { Post } from "../models/post.model.js";
import { Comment } from "../models/comment.model.js"
import { getReceiverSocketId, io } from "../socket/socket.js";

export const addNewPost = async (req, res) => {
    try {
        const { caption } = req.body;
        const image = req.file;
        const authorId = req.id;
        if (!image) {
            return res.status(400).json({
                message: "Image required"
            })
        }
        //image upload
        const optimizedImageBuffer = await sharp(image.buffer)
            .resize({ width: 800, height: 800, fit: 'inside' })
            .toFormat('jpeg', { quality: 80 })
            .toBuffer();
        //buffer to datauri
        const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString('base64')}`;
        const cloudResponse = await cloudinary.uploader.upload(fileUri);
        const post = await Post.create({
            caption,
            image: cloudResponse.secure_url,
            author: authorId
        });
        const user = await User.findById(authorId);
        if (user) {
            user.posts.push(post._id);
            await user.save();
        }
        await post.populate({ path: 'author', select: '-password' });
        return res.status(201).json({
            message: "New post Added",
            post,
            success: true,
        })

    } catch (error) {
        console.log(error);

    }
}
export const getFeedPosts = async (req, res) => {
    try {
        const userId = req.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }

        // Get posts from users that the current user is following + own posts
        const followingUsers = [...user.following, userId]; // Include own posts in feed

        const posts = await Post.find({
            author: { $in: followingUsers }
        })
            .sort({ createdAt: -1 })
            .populate({ path: 'author', select: 'username profilePicture' })
            .populate({
                path: 'comments',
                sort: { createdAt: -1 },
                populate: {
                    path: 'author',
                    select: 'username profilePicture'
                }
            });

        return res.status(200).json({
            posts,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Server error",
            success: false
        });
    }
};
export const getExplorePosts = async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 }).populate({ path: 'author', select: 'username profilePicture' })
            .populate({
                path: 'comments',
                sort: { createdAt: -1 },
                populate: {
                    path: 'author',
                    select: 'username profilePicture'
                }
            });
        return res.status(200).json({
            posts,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
};
export const likePost = async (req, res) => {
    try {
        const likeKrneWalaUserKiId = req.id;
        const postId = req.params.id;
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                message: "Post not found",
                success: false
            })
        }
        //Like logic start
        await post.updateOne({ $addToSet: { likes: likeKrneWalaUserKiId } });
        await post.save();
        //implement socket io for real time notification
        const user = await User.findById(likeKrneWalaUserKiId).select('username profilePicture');
        const postOwnerId = post.author.toString();
        if (postOwnerId !== likeKrneWalaUserKiId) {
            //emit a notifcation event
            const notification = {
                type: 'like',
                userId: likeKrneWalaUserKiId,
                userDetails: user,
                postId,
                message: 'Your post was liked'
            }
            const postOwnerSocketId = getReceiverSocketId(postOwnerId);
            io.to(postOwnerSocketId).emit('notification', notification);
        }
        return res.status(200).json({ message: "Post Liked", success: true })

    } catch (error) {

    }
}

export const disLikePost = async (req, res) => {
    try {
        const likeKrneWalaUserKiId = req.id;
        const postId = req.params.id;
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                message: "Post not found",
                success: false
            })
        }
        //Like logic start
        await post.updateOne({ $pull: { likes: likeKrneWalaUserKiId } });
        await post.save();
        //implement socket io for real time notification
        const user = await User.findById(likeKrneWalaUserKiId).select('username profilePicture');
        const postOwnerId = post.author.toString();
        if (postOwnerId !== likeKrneWalaUserKiId) {
            //emit a notifcation event
            const notification = {
                type: 'dislike',
                userId: likeKrneWalaUserKiId,
                userDetails: user,
                postId,
                message: 'Your post was disliked'
            }
            const postOwnerSocketId = getReceiverSocketId(postOwnerId);
            io.to(postOwnerSocketId).emit('notification', notification);
        }
        return res.status(200).json({ message: "Post Disliked", success: true })

    } catch (error) {

    }
}

export const addComments = async (req, res) => {
    try {
        const postId = req.params.id;
        const commentKrneWalaUserKiId = req.id;
        const { text } = req.body;
        const post = await Post.findById(postId);
        if (!text) {
            return res.status(400).json({ message: 'text is required', success: false });
        }
        const comment = await Comment.create({
            text,
            author: commentKrneWalaUserKiId,
            post: postId
        })
        await comment.populate({
            path: 'author',
            select: "username profilePicture"
        });
        post.comments.push(comment._id);
        await post.save();
        return res.status(201).json({
            message: "Comment Added",
            success: true,
            comment,
        })
    } catch (error) {
        console.log(error);

    }
}

export const getCommentOfPost = async (req, res) => {
    try {
        const postId = req.params.id;
        const comments = await Comment.find({ post: postId }).populate('author', 'username', "profilePicture");
        if (!comments) return res.status(404).json({ message: "No ccomments found for this post", success: false });
        return res.status(200).json({ success: true, comments })
    } catch (error) {
        console.log(error);

    }
}

export const deletePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const authorId = req.id;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                message: "Post not found",
                success: false
            });
        }

        if (post.author.toString() !== authorId) {
            return res.status(403).json({
                message: "Unauthorized",
                success: false
            });
        }

        await Post.findByIdAndDelete(postId);

        let user = await User.findById(authorId);
        user.posts = user.posts.filter(id => id.toString() !== postId);
        await user.save();

        await Comment.deleteMany({ post: postId });

        return res.status(200).json({
            success: true,
            message: 'Post deleted'
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong while deleting the post"
        });
    }
}

export const bookmarkPost = async (req, res) => {
    try {
        const postId = req.params.id;
        const authorId = req.id;
        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: "Post not found", success: false })
        const user = await User.findById(authorId);
        if (user.bookmarks.includes(post._id)) {
            //already bookmarked-> remove from bookmark
            await user.updateOne({ $pull: { bookmarks: post._id } });
            await user.save();
            return res.status(200).json({
                type: 'unsaved',
                message: "Post removed from bookmark",
                success: true
            })
        }
        else {
            //bookmark krna pdega
            await user.updateOne({ $addToSet: { bookmarks: post._id } });
            await user.save();
            return res.status(200).json({
                type: 'saved',
                message: "Post bookmarked",
                success: true
            })
        }
    } catch (error) {
        console.log(error);
    }
}