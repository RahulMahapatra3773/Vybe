import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import upload from "../middlewares/multer.js";
import { 
    addComments, 
    addNewPost, 
    bookmarkPost, 
    deletePost, 
    disLikePost, 
    getCommentOfPost, 
    getExplorePosts, 
    getFeedPosts, 
    likePost 
} from "../controllers/post.controller.js";

const router = express.Router();


router.route('/addPost').post(isAuthenticated, upload.single('image'), addNewPost);
router.route('/feed').get(isAuthenticated, getFeedPosts);      
router.route('/explore').get(isAuthenticated, getExplorePosts);  
router.route('/:id/like').get(isAuthenticated, likePost);
router.route('/:id/dislike').get(isAuthenticated, disLikePost);
router.route('/:id/comment/all').get(isAuthenticated, getCommentOfPost);
router.route('/:id/comment').post(isAuthenticated, addComments);
router.route('/delete/:id').delete(isAuthenticated, deletePost);
router.route('/:id/bookmark').get(isAuthenticated, bookmarkPost);

export default router;