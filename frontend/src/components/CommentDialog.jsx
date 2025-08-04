import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from './ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Link } from 'react-router-dom';
import { MoreHorizontal, Send, Heart, MessageCircle } from 'lucide-react';
import { Button } from './ui/button';
import { useDispatch, useSelector } from 'react-redux';
import { setPosts } from '@/redux/postSlice';
import Comment from './Comment';
import axios from 'axios';
import { toast } from 'sonner';

const CommentDialog = ({ open, setOpen }) => {
  const [text, setText] = useState('');
  const { selectedPost, posts } = useSelector((store) => store.post);
  const [commentList, setCommentList] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    if (selectedPost) {
      setCommentList(selectedPost.comments || []);
    }
  }, [selectedPost]);

  const handleInputChange = (e) => setText(e.target.value);

  const sendComment = async () => {
    if (!text.trim()) return;

    try {
      const res = await axios.post(
        `https://vybe-q98w.onrender.com/api/v1/post/${selectedPost._id}/comment`,
        { text },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        const newComments = [...commentList, res.data.comment];
        setCommentList(newComments);
        const updatedPosts = posts.map((p) =>
          p._id === selectedPost._id ? { ...p, comments: newComments } : p
        );
        dispatch(setPosts(updatedPosts));
        setText('');
        toast.success(res.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to post comment.');
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent
        onInteractOutside={() => setOpen(false)}
        className="!w-[90vw] md:!w-[70vw] lg:!w-[60vw] xl:!w-[50vw] max-w-[1200px] h-[80vh] md:h-[70vh] p-0 flex overflow-hidden bg-gradient-to-br from-black/90 via-gray-900/90 to-blue-900/50 border border-blue-500/30 text-white backdrop-blur-xl rounded-2xl shadow-2xl animate-fade-in"
      >
        <div className="flex flex-col lg:flex-row w-full h-full">
          <div className="w-full lg:w-1/2 h-[40vh] lg:h-full bg-gradient-to-br from-black to-gray-900 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent z-10" />
            <img
              src={selectedPost?.image}
              alt="post_image"
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
            <div className="absolute bottom-4 left-4 z-20 flex items-center gap-3 text-white">
              <div className="flex items-center gap-2 bg-black/40 backdrop-blur-sm rounded-full px-3 py-1">
                <Heart className="w-4 h-4 text-red-400" />
                <span className="text-sm font-medium">{selectedPost?.likes?.length || 0}</span>
              </div>
              <div className="flex items-center gap-2 bg-black/40 backdrop-blur-sm rounded-full px-3 py-1">
                <MessageCircle className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-medium">{commentList.length}</span>
              </div>
            </div>
          </div>
          <div className="w-full lg:w-1/2 h-full flex flex-col bg-gradient-to-b from-black/80 to-gray-900/80 backdrop-blur-lg border-t lg:border-t-0 lg:border-l border-blue-500/20">
            <div className="flex items-center justify-between px-6 py-4 border-b border-blue-500/20 bg-gradient-to-r from-black/60 to-gray-900/60 backdrop-blur-sm">
              <div className="flex gap-3 items-center">
                <Link
                  to={`/profile/${selectedPost?.author?._id}`}
                  className="transition-transform duration-200 hover:scale-105"
                >
                  <div className="relative">
                    <Avatar className="h-10 w-10 ring-2 ring-blue-500/30 hover:ring-blue-500/50 transition-all duration-200">
                      <AvatarImage
                        src={selectedPost?.author?.profilePicture}
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                        {selectedPost?.author?.username?.[0]?.toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </Link>
                <Link
                  to={`/profile/${selectedPost?.author?._id}`}
                  className="font-semibold text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text hover:from-blue-300 hover:to-purple-300 transition-all duration-200"
                >
                  {selectedPost?.author?.username}
                </Link>
              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <button className="p-2 hover:bg-white/10 rounded-xl transition-all duration-200 hover:scale-105">
                    <MoreHorizontal className="w-5 h-5 text-gray-400 hover:text-white transition-colors" />
                  </button>
                </DialogTrigger>
                <DialogContent className="bg-gradient-to-br from-black/90 to-gray-900/90 backdrop-blur-xl text-white border border-blue-500/30 rounded-2xl shadow-2xl">
                  <div className="space-y-2">
                    <div className="cursor-pointer w-full text-red-400 font-semibold hover:bg-red-500/10 hover:text-red-300 px-4 py-3 rounded-xl transition-all duration-200 hover:scale-[1.02]">
                      Unfollow
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 custom-scroll">
              {commentList.length > 0 ? (
                <div className="space-y-2">
                  {commentList.map((c, index) => (
                    <div
                      key={c._id}
                      className="animate-fade-in"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <Comment comment={c} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <MessageCircle className="w-16 h-16 text-gray-600 mb-4" />
                  <p className="text-gray-400 font-medium">No comments yet</p>
                  <p className="text-sm text-gray-500 mt-1">Be the first to comment!</p>
                </div>
              )}
            </div>
            <div className="px-6 py-4 border-t border-blue-500/20 bg-gradient-to-r from-black/60 to-gray-900/60 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="flex-1 relative">
                  <input
                    value={text}
                    onChange={handleInputChange}
                    type="text"
                    placeholder="Add a comment..."
                    className="w-full bg-gradient-to-r from-gray-800/80 to-gray-900/80 backdrop-blur-sm border border-blue-500/20 rounded-2xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && text.trim()) {
                        sendComment();
                      }
                    }}
                  />
                </div>
                <Button
                  disabled={!text.trim()}
                  onClick={sendComment}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white rounded-2xl px-4 py-3 h-12 w-12 transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-blue-500/25"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <style>{`
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in {
            animation: fade-in 0.3s ease-out;
          }
          .custom-scroll::-webkit-scrollbar {
            width: 6px;
          }
          .custom-scroll::-webkit-scrollbar-track {
            background: rgba(0, 0, 0, 0.1);
            border-radius: 10px;
          }
          .custom-scroll::-webkit-scrollbar-thumb {
            background: linear-gradient(to bottom, #3b82f6, #8b5cf6);
            border-radius: 10px;
          }
          .custom-scroll::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(to bottom, #2563eb, #7c3aed);
          }
        `}</style>
      </DialogContent>
    </Dialog>
  );
};

export default CommentDialog;