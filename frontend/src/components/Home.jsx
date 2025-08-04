import React from 'react';
import Feed from './Feed';
import RightSidebar from './RightSidebar';
import useGetAllSuggestedUsers from '@/hooks/useGetAllSuggestedUsers';
import useGetFeedPosts from '@/hooks/useGetAllPost';
import useGetStories from '@/hooks/useGetStories';
import Story from './Story';

const Home = () => {
  useGetFeedPosts();
  useGetAllSuggestedUsers();
  useGetStories();

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute w-80 h-80 bg-gradient-to-r from-blue-500/10 to-purple-600/10 rounded-full blur-3xl top-10 right-10 animate-float hidden sm:block" />
      <div className="absolute w-96 h-96 bg-gradient-to-r from-purple-500/8 to-pink-500/8 rounded-full blur-3xl bottom-10 left-1/4 animate-float-delayed hidden sm:block" />
      <div className="absolute w-64 h-64 bg-gradient-to-r from-cyan-500/6 to-blue-600/6 rounded-full blur-3xl top-1/2 right-1/3 animate-float-slow hidden md:block" />
      <div className="relative z-10 md:ml-[250px] flex flex-col md:flex-row gap-4 sm:gap-6 p-2 sm:p-4 md:p-6 animate-fade-in">
        <div className="flex-1 w-full min-w-0 animate-slide-left">
          <Story />
          <Feed />
        </div>

        <div className="w-full md:w-1/3 md:max-w-[350px] animate-slide-right">
          <RightSidebar />
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-left {
          from { opacity: 0; transform: translateX(-10px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slide-right {
          from { opacity: 0; transform: translateX(10px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-20px) translateX(10px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(15px) translateX(-8px); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-10px) translateX(5px); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        .animate-slide-left {
          animation: slide-left 0.6s ease-out 0.1s both;
        }
        .animate-slide-right {
          animation: slide-right 0.6s ease-out 0.2s both;
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 6s ease-in-out infinite;
        }
        .animate-float-slow {
          animation: float-slow 10s ease-in-out infinite;
        }
        
        /* Reduce motion for users who prefer it */
        @media (prefers-reduced-motion: reduce) {
          .animate-fade-in,
          .animate-slide-left,
          .animate-slide-right,
          .animate-float,
          .animate-float-delayed,
          .animate-float-slow {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;