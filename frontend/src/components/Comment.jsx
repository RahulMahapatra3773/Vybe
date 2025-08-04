import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Link } from 'react-router-dom';

const Comment = ({ comment }) => {
  return (
    <div className="group flex items-start gap-2 sm:gap-3 py-2 sm:py-3 px-2 sm:px-3 rounded-lg transition-all duration-300 ease-in-out hover:bg-white/5 hover:backdrop-blur-sm animate-fade-in relative">
      <Link
        to={`/profile/${comment.author?._id}`}
        className="flex-shrink-0 transition-transform duration-200 hover:scale-105"
      >
        <div className="relative">
          <Avatar className="w-8 h-8 sm:w-9 sm:h-9 ring-2 ring-transparent group-hover:ring-blue-500/30 transition-all duration-200">
            <AvatarImage
              src={comment.author?.profilePicture}
              className="object-cover w-full h-full rounded-full"
            />
            <AvatarFallback className="bg-gradient-to-br from-gray-600 to-gray-800 text-white font-semibold text-xs sm:text-sm">
              {comment.author?.username?.[0]?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-sm hidden sm:block" />
        </div>
      </Link>
      <div className="flex-1 min-w-0 overflow-hidden">
        <div className="text-sm leading-relaxed">
          <Link
            to={`/profile/${comment.author?._id}`}
            className="font-semibold text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text hover:from-blue-300 hover:to-purple-300 transition-all duration-200 hover:scale-[1.02] inline-block transform-gpu break-words"
          >
            {comment.author?.username}
          </Link>
          <span className="ml-2 font-normal text-gray-300 group-hover:text-gray-200 transition-colors duration-200 break-words">
            {comment.text}
          </span>
        </div>
        <div className="mt-1 sm:mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex items-center gap-3 sm:gap-4 text-xs text-gray-500">
            <button className="hover:text-blue-400 cursor-pointer transition-colors duration-200 py-1 px-1 -ml-1 rounded">
              Reply
            </button>
            <button className="hover:text-red-400 cursor-pointer transition-colors duration-200 py-1 px-1 rounded">
              Like
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Comment;