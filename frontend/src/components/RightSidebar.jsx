import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import SuggestedUsers from './SuggestedUsers';

const RightSidebar = () => {
  const { user } = useSelector((store) => store.auth);

  return (
    <div className="w-full md:w-auto bg-gradient-to-br from-black/60 via-gray-900/60 to-blue-900/30 backdrop-blur-xl border border-blue-500/20 hover:border-blue-500/40 rounded-xl p-4 shadow-2xl text-white transition-all duration-300">
      <div className="flex items-center gap-4 mb-6">
        <Link to={`/profile/${user?._id}`}>
          <Avatar className="w-12 h-12 border-2 border-blue-600 shadow-md shadow-blue-900/40 hover:border-blue-500 transition-colors duration-200">
            <AvatarImage src={user?.profilePicture} alt="user_profile" />
            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold">
              {user?.username?.[0]?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
        </Link>
        <div className="flex flex-col">
          <Link
            to={`/profile/${user?._id}`}
            className="text-sm font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent hover:from-blue-300 hover:to-purple-300 transition-all duration-200"
          >
            {user?.username}
          </Link>
          <span className="text-xs text-gray-300 truncate max-w-[150px]">
            {user?.bio || "No bio provided"}
          </span>
        </div>
      </div>

      <SuggestedUsers />
    </div>
  );
};

export default RightSidebar;