import React, { useState } from 'react';
import Posts from './Posts';
import { Search, X, Filter } from 'lucide-react';

const Feed = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("most-recent");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filterOptions = [
    { value: "most-recent", label: "Most Recent" },
    { value: "oldest", label: "Oldest" },
    { value: "trending", label: "Trending" },
    { value: "most-liked", label: "Most Liked" },
    { value: "most-commented", label: "Most Commented" }
  ];

  const clearSearch = () => {
    setSearchTerm("");
  };

  const handleFilterSelect = (filterValue) => {
    setSelectedFilter(filterValue);
    setIsFilterOpen(false);
  };

  return (
    <div className="w-full flex justify-center overflow-hidden px-2 sm:px-4 mt-16 md:mt-4">
      <div className="w-full max-w-2xl flex flex-col gap-4 sm:gap-6 text-white animate-fade-in">
        <div className="pb-1 sm:pb-2">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="relative flex-1">
              <div className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 z-10">
                <Search className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              </div>

              <input
                type="text"
                placeholder="Search posts or users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-2.5 sm:py-3 text-sm sm:text-base bg-gradient-to-r from-gray-800/80 to-gray-900/80 backdrop-blur-sm border border-blue-500/20 rounded-xl sm:rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
              />

              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 p-1 hover:bg-white/10 rounded-full transition-colors duration-200"
                >
                  <X className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 hover:text-white" />
                </button>
              )}
            </div>
            <div className="relative">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center justify-center sm:w-12 sm:h-12 hover:bg-white/10 rounded-lg transition-all duration-200 focus:outline-none"
              >
                <Filter className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </button>
              {isFilterOpen && (
                <div className="absolute top-full right-0 mt-2 bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-md border border-blue-500/20 rounded-xl shadow-xl z-20 animate-dropdown-fade-in min-w-[160px]">
                  <div className="py-2">
                    {filterOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleFilterSelect(option.value)}
                        className={`w-full text-left px-4 py-2.5 text-sm hover:bg-blue-500/10 transition-all duration-200 ${selectedFilter === option.value
                            ? 'text-blue-400 bg-blue-500/5'
                            : 'text-gray-300'
                          }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          {searchTerm && (
            <div className="mt-3 text-xs sm:text-sm text-gray-400 opacity-0 animate-fade-in-delayed">
              Searching for "{searchTerm}"
            </div>
          )}
        </div>
        <div>
          <Posts searchTerm={searchTerm} sortBy={selectedFilter} />
        </div>
      </div>
      {isFilterOpen && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setIsFilterOpen(false)}
        />
      )}

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in-delayed {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes dropdown-fade-in {
          from { opacity: 0; transform: translateY(-8px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 0.4s ease-out;
        }
        .animate-fade-in-delayed {
          animation: fade-in-delayed 0.3s ease-out 0.1s forwards;
        }
        .animate-dropdown-fade-in {
          animation: dropdown-fade-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Feed;