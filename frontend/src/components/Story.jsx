import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Plus, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { setStories } from '@/redux/storySlice';

const Story = () => {
  const { stories } = useSelector((store) => store.story);
  const { user } = useSelector((store) => store.auth);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const [viewingStory, setViewingStory] = useState(null);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const fileRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (image) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(image);
    } else {
      setPreview('');
    }
  }, [image]);
  
  useEffect(() => {
    if (viewingStory) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [viewingStory]);

  const groupedStories = stories.reduce((acc, story) => {
    const userId = story.author._id;
    if (!acc[userId]) {
      acc[userId] = {
        user: story.author,
        stories: []
      };
    }
    acc[userId].stories.push(story);
    return acc;
  }, {});

  const storyGroups = Object.values(groupedStories);

  const handleUpload = async () => {
    if (!image || uploading) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("image", image);

    try {
      const res = await axios.post(
        "https://vybe-1.onrender.com/api/v1/story/add",
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.success) {
        toast.success("Story added successfully");
        setImage(null);
        setPreview('');
        const storiesRes = await axios.get("https://vybe-1.onrender.com/api/v1/story", {
          withCredentials: true,
        });
        if (storiesRes.data.success) {
          dispatch(setStories(storiesRes.data.stories));
        }
      }
    } catch (err) {
      console.error("Error uploading story:", err.response?.data || err.message);
      toast.error("Something went wrong while uploading story");
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const openStoryViewer = (storyGroup) => {
    setViewingStory(storyGroup);
    setCurrentStoryIndex(0);
  };

  const closeStoryViewer = () => {
    setViewingStory(null);
    setCurrentStoryIndex(0);
  };

  const nextStory = () => {
    if (currentStoryIndex < viewingStory.stories.length - 1) {
      setCurrentStoryIndex(currentStoryIndex + 1);
    } else {
      closeStoryViewer();
    }
  };

  const prevStory = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(currentStoryIndex - 1);
    }
  };

  return (
    <>
      <style jsx>{`
        .hide-scrollbar {
          -ms-overflow-style: none;  /* Internet Explorer 10+ */
          scrollbar-width: none;  /* Firefox */
        }
        .hide-scrollbar::-webkit-scrollbar { 
          display: none;  /* Safari and Chrome */
        }
      `}</style>
      <div className="w-full mb-8">
        <div className="flex items-center justify-between mb-4 px-4">
          <h2 className="text-lg font-bold text-white">Stories</h2>
        </div>
        <div className="w-full overflow-x-auto pb-4 hide-scrollbar">
          <div className="flex gap-3 px-4 min-w-max">
            <div className="flex-shrink-0">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 p-0.5">
                  <div className="w-full h-full rounded-full bg-black/80 flex items-center justify-center">
                    <Avatar className="w-14 h-14">
                      <AvatarImage src={user?.profilePicture} />
                      <AvatarFallback className="bg-gray-700 text-white text-sm">
                        {user?.username?.charAt(0)?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </div>
                <button
                  onClick={() => fileRef.current?.click()}
                  className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center border-2 border-black transition-colors cursor-pointer"
                >
                  <Plus size={12} className="text-white" />
                </button>
              </div>
              <p className="text-xs text-center text-gray-300 mt-1 max-w-[64px] truncate">
                Your story
              </p>
            </div>
            {storyGroups.map((storyGroup) => (
              <div key={storyGroup.user._id} className="flex-shrink-0">
                <div
                  className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 p-0.5 cursor-pointer hover:scale-105 transition-transform"
                  onClick={() => openStoryViewer(storyGroup)}
                >
                  <div className="w-full h-full rounded-full bg-black/20 overflow-hidden">
                    <img
                      src={storyGroup.stories[0].image}
                      alt={`${storyGroup.user.username}'s story`}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                </div>
                <p className="text-xs text-center text-gray-300 mt-1 max-w-[64px] truncate">
                  {storyGroup.user.username}
                </p>
                {storyGroup.stories.length > 1 && (
                  <div className="flex justify-center mt-1">
                    <span className="text-xs bg-blue-500 text-white px-1 rounded-full">
                      {storyGroup.stories.length}
                    </span>
                  </div>
                )}
              </div>
            ))}

            {storyGroups.length === 0 && (
              <div className="flex-shrink-0 flex items-center justify-center w-full min-w-[300px]">
                <p className="text-gray-400 text-sm">No stories yet</p>
              </div>
            )}
          </div>
        </div>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileRef}
          onChange={handleFileChange}
        />
        {preview && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[9999] flex items-start justify-center pt-12 sm:pt-20 p-4">
            <div className="bg-gradient-to-br from-gray-900 to-black border border-blue-500/30 rounded-2xl p-4 sm:p-6 w-full max-w-sm sm:max-w-md">
              <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4 text-center">
                Preview Your Story
              </h3>
              <div className="relative mb-3 sm:mb-4">
                <img
                  src={preview}
                  alt="Story preview"
                  className="w-full aspect-square object-cover rounded-xl"
                />
              </div>
              <div className="flex gap-2 sm:gap-3">
                <Button
                  onClick={() => {
                    setImage(null);
                    setPreview('');
                  }}
                  variant="outline"
                  className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800 cursor-pointer text-sm sm:text-base"
                  disabled={uploading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUpload}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white cursor-pointer text-sm sm:text-base"
                  disabled={uploading}
                >
                  {uploading ? "Uploading..." : "Share Story"}
                </Button>
              </div>
            </div>
          </div>
        )}
        {viewingStory && (
          <div className="fixed inset-0 bg-black z-[9999] flex flex-col">
            <button
              onClick={closeStoryViewer}
              className="absolute top-4 right-4 z-20 text-white hover:text-gray-300 bg-black/50 rounded-full p-2 cursor-pointer"
            >
              <X size={20} />
            </button>

            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 flex gap-1 z-20 px-4">
              {viewingStory.stories.map((_, index) => (
                <div
                  key={index}
                  className={`h-1 w-12 rounded-full ${index === currentStoryIndex ? 'bg-white' :
                      index < currentStoryIndex ? 'bg-white/60' : 'bg-white/20'
                    }`}
                />
              ))}
            </div>

            <div className="absolute top-12 left-4 flex items-center gap-3 z-20 mt-2">
              <Avatar className="w-8 h-8">
                <AvatarImage src={viewingStory.user.profilePicture} />
                <AvatarFallback className="bg-gray-700 text-white text-sm">
                  {viewingStory.user.username?.charAt(0)?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-white font-medium text-sm">
                {viewingStory.user.username}
              </span>
            </div>
            <div
              className="absolute left-0 top-0 w-1/3 h-full z-10 cursor-pointer"
              onClick={prevStory}
            />
            <div
              className="absolute right-0 top-0 w-1/3 h-full z-10 cursor-pointer"
              onClick={nextStory}
            />
            <div className="flex-1 w-full pt-24 sm:pt-32 px-4 sm:px-8 overflow-hidden">
              <img
                src={viewingStory.stories[currentStoryIndex].image}
                alt="Story"
                className="w-full sm:w-4/5 mx-auto h-auto max-h-[70vh] sm:max-h-none object-contain rounded-lg"
              />
            </div>
            {currentStoryIndex > 0 && (
              <button
                onClick={prevStory}
                className="absolute left-2 sm:left-4 top-1/2 sm:top-3/5 transform -translate-y-1/2 text-white hover:text-gray-700 bg-white/90 hover:bg-white rounded-lg px-2 py-1 sm:px-3 sm:py-2 z-20 transition-all cursor-pointer shadow-lg font-semibold text-xs sm:text-sm"
              >
                PREV
              </button>
            )}
            {currentStoryIndex < viewingStory.stories.length - 1 && (
              <button
                onClick={nextStory}
                className="absolute right-2 sm:right-4 top-1/2 sm:top-3/5 transform -translate-y-1/2 text-white hover:text-gray-700 bg-white/90 hover:bg-white rounded-lg px-2 py-1 sm:px-3 sm:py-2 z-20 transition-all cursor-pointer shadow-lg font-semibold text-xs sm:text-sm"
              >
                NEXT
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Story;