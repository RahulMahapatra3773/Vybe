import React, { useRef, useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { readFileAsDataURL } from '@/lib/utils';
import { Loader2, ImagePlus, X, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setPosts } from '@/redux/postSlice';

const MAX_FILE_SIZE_MB = 5;

const CreatePost = ({ open, setOpen }) => {
  const { posts } = useSelector((store) => store.post);
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();

  const imageRef = useRef();
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) {
      setCaption('');
      setFile(null);
      setImagePreview('');
      setLoading(false);
    }
  }, [open]);

  const fileChangeHandler = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        toast.error(`File too large. Max ${MAX_FILE_SIZE_MB}MB allowed.`);
        return;
      }

      setFile(file);
      const dataUrl = await readFileAsDataURL(file);
      setImagePreview(dataUrl);
    }
  };

  const removeImage = () => {
    setFile(null);
    setImagePreview('');
    if (imageRef.current) {
      imageRef.current.value = '';
    }
  };

  const createPostHandler = async (e) => {
    e.preventDefault();
    if (!caption.trim() && !file) {
      toast.error('Please add a caption or image to create a post');
      return;
    }

    const formData = new FormData();
    formData.append('caption', caption);
    if (file) formData.append('image', file);

    try {
      setLoading(true);
      const res = await axios.post(
        'https://vybe-1.onrender.com/api/v1/post/addpost',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        dispatch(setPosts([res.data.post, ...posts]));
        toast.success(res.data.message || 'Post created!');
        setOpen(false);
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || error.message || 'Something went wrong'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent
        onInteractOutside={() => setOpen(false)}
        className="w-[95vw] md:w-full max-w-lg h-[80vh] md:h-[75vh] overflow-y-auto p-0 bg-gradient-to-br from-gray-900/95 via-black/95 to-gray-800/95 border border-blue-500/20 text-white backdrop-blur-xl rounded-2xl shadow-2xl animate-fade-in"
      >
        <DialogHeader className="px-6 py-4 border-b border-blue-500/20 bg-gradient-to-r from-blue-600/10 to-purple-600/10 backdrop-blur-sm sticky top-0 z-10">
          <DialogTitle className="text-center text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-400" />
            Create New Post
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 py-4 space-y-6">
          <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 backdrop-blur-sm">
            <div className="relative">
              <Avatar className="w-12 h-12 ring-2 ring-blue-500/30">
                <AvatarImage src={user?.profilePicture} alt="User avatar"/>
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                  {user?.username?.[0]?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-900 animate-pulse" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text">
                {user?.username}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {user?.bio || 'Share something amazing...'}
              </p>
            </div>
          </div>
          
          <div className="space-y-2">
            <Textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full min-h-[120px] bg-gradient-to-r from-gray-800/80 to-gray-900/80 backdrop-blur-sm border border-blue-500/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 resize-none"
              placeholder="What's on your mind? Share your thoughts..."
              maxLength={300}
            />
            <div className="flex justify-between items-center">
              <div className="text-xs text-gray-400">
                Express yourself freely
              </div>
              <div className={`text-xs font-medium transition-colors ${
                caption.length > 280 ? 'text-red-400' :
                caption.length > 240 ? 'text-yellow-400' : 'text-gray-400'
              }`}>
                {caption.length}/300
              </div>
            </div>
          </div>
          
          {imagePreview && (
            <div className="relative group">
              <div className="w-full h-[300px] overflow-hidden rounded-xl border border-blue-500/20 bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full transition-all duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
              </div>
              <button
                onClick={removeImage}
                className="absolute top-3 right-3 p-2 bg-red-500/80 hover:bg-red-500 text-white rounded-full backdrop-blur-sm transition-all duration-200 hover:scale-105 shadow-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
          
          <input
            ref={imageRef}
            onChange={fileChangeHandler}
            type="file"
            accept="image/*"
            className="hidden"
          />
          
          {!imagePreview && (
            <div className="flex justify-center">
              <Button
                onClick={() => imageRef.current?.click()}
                disabled={loading}
                className="w-full h-14 bg-gradient-to-r from-gray-800/80 to-gray-900/80 hover:from-gray-700/80 hover:to-gray-800/80 border border-blue-500/20 hover:border-blue-500/40 text-white rounded-xl backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] shadow-lg hover:shadow-blue-500/25 group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/20 rounded-lg group-hover:bg-blue-500/30 transition-colors">
                    <ImagePlus className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-white">Add Photo</div>
                    <div className="text-xs text-gray-400">JPG, PNG up to {MAX_FILE_SIZE_MB}MB</div>
                  </div>
                </div>
              </Button>
            </div>
          )}
          
          <div className="flex gap-3 pt-2">
            <Button
              onClick={() => setOpen(false)}
              disabled={loading}
              className="flex-1 h-12 bg-gradient-to-r from-gray-600/80 to-gray-700/80 hover:from-gray-500/80 hover:to-gray-600/80 text-white rounded-xl backdrop-blur-sm transition-all duration-200 hover:scale-[1.02] shadow-lg"
            >
              Cancel
            </Button>

            {(caption.trim() || imagePreview) && (
              <Button
                onClick={createPostHandler}
                disabled={loading}
                className="flex-1 h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white rounded-xl transition-all duration-200 hover:scale-[1.02] shadow-lg hover:shadow-blue-500/25"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Posting...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    <span>Share Post</span>
                  </div>
                )}
              </Button>
            )}
          </div>
        </div>

        <style>{`
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(20px) scale(0.95); }
            to { opacity: 1; transform: translateY(0) scale(1); }
          }
          .animate-fade-in {
            animation: fade-in 0.4s ease-out;
          }
        `}</style>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePost;