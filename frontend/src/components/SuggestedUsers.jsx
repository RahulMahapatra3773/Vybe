import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { toggleFollowing } from '@/redux/authSlice';
import { toast } from 'sonner';
import axios from 'axios';

const SuggestedUsers = () => {
  const dispatch = useDispatch();
  const { user, suggestedUsers } = useSelector((store) => store.auth);
  const [showAll, setShowAll] = useState(false);

  const handleFollowToggle = async (targetUserId, username) => {
    try {
      const alreadyFollowing = user?.following?.includes(targetUserId);
      
      await axios.post(
        `https://vybe-1.onrender.com/api/v1/user/followorunfollow/${targetUserId}`,
        {},
        { withCredentials: true }
      );
      
      dispatch(toggleFollowing(targetUserId));
      
      // Show appropriate toast message
      if (alreadyFollowing) {
        toast.success(`You unfollowed ${username}`);
      } else {
        toast.success(`You are now following ${username}`);
      }
      
    } catch (error) {
      console.error('Follow/unfollow failed:', error);
      toast.error(error?.response?.data?.message || 'Something went wrong');
    }
  };

  // Determine which users to display
  const usersToDisplay = showAll 
    ? suggestedUsers 
    : suggestedUsers?.slice(0, 4) || [];

  const handleSeeAll = () => {
    setShowAll(!showAll);
  };

  return (
    <div className="mt-10 space-y-6">
      <div className="flex items-center justify-between text-sm">
        <h2 className="font-semibold text-gray-300">Suggested for you</h2>
        {Array.isArray(suggestedUsers) && suggestedUsers.length > 4 && (
          <button
            onClick={handleSeeAll}
            className="font-medium text-blue-400 cursor-pointer hover:text-blue-500 transition"
          >
            {showAll ? 'See Less' : 'See All'}
          </button>
        )}
      </div>

        {Array.isArray(suggestedUsers) && suggestedUsers.length > 0 ? (
          <div className="space-y-4">
            {usersToDisplay.map((suggestedUser) => {
              const isFollowing = user?.following?.includes(suggestedUser._id);

              return (
                <div
                  key={suggestedUser._id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <Link to={`/profile/${suggestedUser._id}`}>
                      <Avatar className="w-10 h-10 flex-shrink-0">
                        <AvatarImage 
                          src={suggestedUser?.profilePicture} 
                          alt="user_avatar"
                          className="w-full h-full"
                        />
                        <AvatarFallback className="w-full h-full flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold text-sm">
                          {suggestedUser?.username?.[0]?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Link>

                    <div>
                      <h3 className="font-semibold text-sm text-white">
                        <Link 
                          to={`/profile/${suggestedUser._id}`}
                          className="hover:text-gray-300 transition"
                        >
                          {suggestedUser.username}
                        </Link>
                      </h3>
                      <p className="text-gray-500 text-xs">
                        {suggestedUser.bio || 'Bio here...'}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleFollowToggle(suggestedUser._id, suggestedUser.username)}
                    className={`text-xs font-bold px-3 py-1 rounded transition ${
                      isFollowing 
                        ? 'text-red-400 hover:text-red-500 hover:bg-red-500/10' 
                        : 'text-blue-400 hover:text-blue-500 hover:bg-blue-500/10'
                    }`}
                  >
                    {isFollowing ? 'Unfollow' : 'Follow'}
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center text-gray-500 text-sm py-4">
            No suggested users at the moment
          </div>
        )}
      </div>
  );
};

export default SuggestedUsers;