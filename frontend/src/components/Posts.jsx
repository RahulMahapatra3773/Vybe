import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import Post from './Post';

const Posts = ({ searchTerm = "", sortBy = "most-recent" }) => {
  const posts = useSelector((store) => store.post?.posts || []);
  const processedPosts = useMemo(() => {
    let filteredPosts = posts.filter((post) => {
      if (!searchTerm) return true;

      const lowerSearch = searchTerm.toLowerCase();
      const captionMatch = post.caption?.toLowerCase().includes(lowerSearch);
      const userMatch = post.author?.username?.toLowerCase().includes(lowerSearch);
      return captionMatch || userMatch;
    });
    const sortedPosts = [...filteredPosts].sort((a, b) => {
      switch (sortBy) {
        case 'most-recent':
          return new Date(b.createdAt || b._id) - new Date(a.createdAt || a._id);

        case 'oldest':
          return new Date(a.createdAt || a._id) - new Date(b.createdAt || b._id);

        case 'trending':
          const scoreA = (a.likes?.length || 0) + (a.comments?.length || 0);
          const scoreB = (b.likes?.length || 0) + (b.comments?.length || 0);
          return scoreB - scoreA;

        case 'most-liked':
          return (b.likes?.length || 0) - (a.likes?.length || 0);

        case 'most-commented':
          return (b.comments?.length || 0) - (a.comments?.length || 0);

        default:
          return 0;
      }
    });

    return sortedPosts;
  }, [posts, searchTerm, sortBy]);



  return (
    <div className="w-full flex flex-col items-center gap-6 px-4 md:px-6 lg:px-0">
      {processedPosts.length > 0 ? (
        processedPosts.map((post, index) => (
          <div
            key={post._id}
            className="w-full opacity-0 animate-fade-in-stagger"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <Post post={post} />
          </div>
        ))
      ) : (
        <div className="text-center text-gray-400 text-sm mt-8 bg-black/40 border border-blue-800 p-6 rounded-xl shadow-md w-full max-w-md animate-fade-in">
          {searchTerm
            ? (
              <div>
                <div className="mb-2">No posts found matching</div>
                <div className="text-blue-400 font-medium">"{searchTerm}"</div>
                <div className="mt-3 text-xs text-gray-500">
                  Try searching for different keywords or check your spelling
                </div>
              </div>
            )
            : (
              <div>
                <div className="mb-2">No posts available</div>
                <div className="text-xs text-gray-500">
                  Follow someone or create a new post to see content here
                </div>
              </div>
            )}
        </div>
      )}

      <style>{`
        @keyframes fade-in-stagger {
          from { 
            opacity: 0; 
            transform: translateY(20px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        @keyframes fade-in {
          from { 
            opacity: 0; 
            transform: translateY(10px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        .animate-fade-in-stagger {
          animation: fade-in-stagger 0.4s ease-out forwards;
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Posts;