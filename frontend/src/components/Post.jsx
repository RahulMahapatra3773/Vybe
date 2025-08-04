import React, { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Bookmark, MessageCircle, MoreHorizontal, Send } from 'lucide-react';
import { Button } from './ui/button';
import { FaHeart, FaRegHeart } from 'react-icons/fa6';
import CommentDialog from './CommentDialog';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import axios from 'axios';
import { setPosts, setSelectedPost } from '@/redux/postSlice';
import { Badge } from './ui/badge';
import { toggleFollowing } from '@/redux/authSlice';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

const Post = ({ post }) => {
  const [text, setText] = useState('');
  const [open, setOpen] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const { posts } = useSelector((store) => store.post);
  const { socket } = useSelector((store) => store.socketio);
  const [liked, setLiked] = useState(post.likes.includes(user?._id));
  const [postLike, setPostLike] = useState(post.likes.length);
  const [comment, setComment] = useState(post.comments || []);
  const dispatch = useDispatch();

  const changeEventHandler = (e) => {
    setText(e.target.value);
  };

  const deletePostHandler = async () => {
    try {
      const res = await axios.delete(
        `https://vybe-q98w.onrender.com/api/v1/post/delete/${post?._id}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        const updatedPosts = posts.filter((p) => p._id !== post?._id);
        dispatch(setPosts(updatedPosts));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || 'Failed to delete post');
    }
  };

  const handleFollowToggle = async (targetUserId) => {
    try {
      const alreadyFollowing = user?.following?.includes(targetUserId);

      await axios.post(
        `https://vybe-q98w.onrender.com/api/v1/user/followorunfollow/${targetUserId}`,
        {},
        { withCredentials: true }
      );
      dispatch(toggleFollowing(targetUserId));
      toast.success('Follow status updated');
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong');
    }
  };

  const likeOrDislike = async () => {
    try {
      const action = liked ? 'dislike' : 'like';
      const res = await axios.get(
        `https://vybe-q98w.onrender.com/api/v1/post/${post._id}/${action}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        const updatedLikes = liked ? postLike - 1 : postLike + 1;
        setPostLike(updatedLikes);
        setLiked(!liked);

        const updatedPosts = posts.map((p) =>
          p._id === post._id
            ? {
                ...p,
                likes: liked
                  ? p.likes.filter((id) => id !== user._id)
                  : [...p.likes, user._id],
              }
            : p
        );

        dispatch(setPosts(updatedPosts));
        toast.success(res.data.message);

        if (post.author._id !== user._id) {
          socket?.emit('likeOrDislike', {
            type: liked ? 'dislike' : 'like',
            receiverId: post.author._id,
            userId: user._id,
            postId: post._id,
            userDetails: {
              username: user.username,
              profilePicture: user.profilePicture,
            },
          });
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const commentHandler = async () => {
    try {
      const res = await axios.post(
        `https://vybe-q98w.onrender.com/api/v1/post/${post._id}/comment`,
        { text },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        const updatedComments = [...comment, res.data.comment];
        setComment(updatedComments);

        const updatedPosts = posts.map((p) =>
          p._id === post._id ? { ...p, comments: updatedComments } : p
        );

        dispatch(setPosts(updatedPosts));
        toast.success(res.data.message);
        setText('');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const bookmarkHandler = async () => {
    try {
      const res = await axios.get(
        `https://vybe-q98w.onrender.com/api/v1/post/${post?._id}/bookmark`,
        { withCredentials: true }
      );
      if (res.data.success) toast.success(res.data.message);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="relative bg-gradient-to-br from-black/60 via-gray-900/60 to-blue-900/30 border border-blue-500/20 hover:border-blue-500/40 rounded-xl p-5 w-full max-w-md mx-auto my-6 text-white transition-all duration-300">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl blur opacity-30 pointer-events-none" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Avatar className="ring-2 ring-blue-500/30 hover:ring-blue-500/50 transition-all duration-200">
              <AvatarImage src={post.author?.profilePicture} />
              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold">
                {post.author?.username?.[0]?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-semibold text-white">
                {post.author?.username}
              </h1>
              {user?._id === post.author?._id && (
                <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs px-2 py-0.5 border-0">
                  Author
                </Badge>
              )}
            </div>
          </div>
          
          <Popover>
            <PopoverTrigger asChild>
              <div className="p-1 rounded-full hover:bg-white/10 transition-colors duration-200">
                <MoreHorizontal className="cursor-pointer w-5 h-5 text-gray-300 hover:text-white" />
              </div>
            </PopoverTrigger>
            <PopoverContent
              align="end"
              sideOffset={8}
              className="bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-md border border-blue-500/20 rounded-xl shadow-xl p-0 w-44 animate-dropdown-fade-in"
            >
              <div className="py-2">
                {user?._id !== post.author?._id && (
                  <button
                    onClick={() => handleFollowToggle(post.author._id)}
                    className={`w-full text-left px-4 py-2.5 text-sm hover:bg-blue-500/10 transition-all duration-200 ${
                      user?.following?.includes(post.author._id)
                        ? 'text-red-400'
                        : 'text-blue-400'
                    }`}
                  >
                    {user?.following?.includes(post.author._id) ? 'Unfollow' : 'Follow'}
                  </button>
                )}
                {user?._id === post.author?._id && (
                  <button
                    onClick={deletePostHandler}
                    className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-all duration-200"
                  >
                    Delete
                  </button>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <div className="relative overflow-hidden rounded-xl mb-4">
          <img
            src={post.image}
            alt="post"
            className="rounded-xl w-full aspect-square object-cover"
          />
        </div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            {liked ? (
              <FaHeart
                onClick={likeOrDislike}
                className="text-red-500 text-xl cursor-pointer drop-shadow-lg hover:opacity-80 transition-opacity duration-200"
              />
            ) : (
              <FaRegHeart
                onClick={likeOrDislike}
                className="text-white text-xl cursor-pointer hover:text-red-400 transition-colors duration-200"
              />
            )}
            
            <MessageCircle
              onClick={() => {
                dispatch(setSelectedPost(post));
                setOpen(true);
              }}
              className="text-white cursor-pointer hover:text-blue-400 transition-colors duration-200"
            />
            
            <Send className="text-white cursor-pointer hover:text-purple-400 transition-colors duration-200" />
          </div>
          
          <Bookmark
            onClick={bookmarkHandler}
            className="text-white cursor-pointer hover:text-yellow-400 transition-colors duration-200"
          />
        </div>
        <div className="space-y-2">
          <span className="text-sm font-semibold text-white">
            {postLike} {postLike === 1 ? 'like' : 'likes'}
          </span>
          
          <p className="text-sm text-gray-200 leading-relaxed">
            <span className="font-semibold text-white mr-2">
              {post.author?.username}
            </span>
            {post.caption}
          </p>

          {comment.length > 0 && (
            <span
              onClick={() => {
                dispatch(setSelectedPost(post));
                setOpen(true);
              }}
              className="text-xs text-gray-400 block cursor-pointer hover:text-blue-400 transition-colors duration-200"
            >
              View all {comment.length} comments
            </span>
          )}
        </div>
        <CommentDialog open={open} setOpen={setOpen} />
        <div className="flex items-center mt-4 gap-3 pt-3 border-t border-blue-500/20">
          <input
            type="text"
            placeholder="Add a comment..."
            value={text}
            onChange={changeEventHandler}
            className="bg-transparent text-white text-sm outline-none flex-1 placeholder:text-gray-400 focus:placeholder:text-gray-500 transition-colors duration-200"
          />
          {text && (
            <span
              onClick={commentHandler}
              className="text-blue-400 text-sm font-semibold cursor-pointer hover:text-blue-300 transition-colors duration-200 opacity-100"
            >
              Post
            </span>
          )}
        </div>
      </div>

      <style>{`
        @keyframes dropdown-fade-in {
          from { opacity: 0; transform: translateY(-8px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-dropdown-fade-in {
          animation: dropdown-fade-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Post;