import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { toast } from "sonner";
import { FaHeart, FaRegComment } from "react-icons/fa";

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) {
      toast.warning("Please enter a search term");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get(
        `https://vybe-q98w.onrender.com/api/v1/user/search?query=${query}`,
        { withCredentials: true }
      );
      setUsers(res.data.users || []);
      setPosts(res.data.posts || []);
    } catch (err) {
      console.error("Search error:", err);
      toast.error("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const filteredResults = () => {
    if (activeTab === "people") return users;
    if (activeTab === "posts") return posts;
    return [...users, ...posts];
  };

  return (
    <div className="p-4 max-w-2xl mx-auto text-white">
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <input
          type="text"
          placeholder="Search posts or people"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="flex-1 p-3 bg-gradient-to-r from-gray-800/80 to-gray-900/80 backdrop-blur-sm border border-blue-500/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
        />
        <button
          onClick={handleSearch}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-200 text-white rounded-xl font-medium"
        >
          Search
        </button>
      </div>
      <div className="flex gap-4 mb-4 border-b border-blue-500/20 pb-2">
        {["all", "people", "posts"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`capitalize text-sm sm:text-base px-3 py-1 rounded-lg transition-all duration-200 ${
              activeTab === tab
                ? "font-semibold text-blue-400 bg-blue-500/10"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      {loading ? (
        <p className="text-center">Searching...</p>
      ) : (
        <div>
          {query && (
            <p className="text-gray-400 mb-3">
              {filteredResults().length} result(s) found
            </p>
          )}

          {filteredResults().map((item) =>
            item.username ? (
              <div
                key={item._id}
                className="flex items-center gap-4 p-3 bg-gradient-to-r from-gray-800/60 to-gray-900/60 backdrop-blur-sm border border-blue-500/10 rounded-xl mb-3 hover:border-blue-500/20 transition-all duration-200"
              >
                <Link to={`/profile/${item._id}`}>
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={item.profilePicture} alt="user_avatar" />
                    <AvatarFallback>{item.username?.[0]}</AvatarFallback>
                  </Avatar>
                </Link>
                <div>
                  <Link
                    to={`/profile/${item._id}`}
                    className="font-semibold text-white hover:text-blue-400 transition-colors duration-200"
                  >
                    {item.username}
                  </Link>
                </div>
              </div>
            ) : (
              <div
                key={item._id}
                className="bg-gradient-to-r from-gray-800/60 to-gray-900/60 backdrop-blur-sm border border-blue-500/10 rounded-xl mb-6 overflow-hidden shadow-sm hover:border-blue-500/20 transition-all duration-200"
              >
                <div className="flex items-center gap-3 px-4 py-3">
                  <Avatar className="w-9 h-9">
                    <AvatarImage src={item.author?.profilePicture} />
                    <AvatarFallback>
                      {item.author?.username?.[0] || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <Link
                    to={`/profile/${item.author?._id}`}
                    className="font-semibold text-white hover:text-blue-400 transition-colors duration-200 text-sm"
                  >
                    {item.author?.username}
                  </Link>
                </div>

                {item.image && (
                  <img
                    src={item.image}
                    alt="Post"
                    className="w-full object-cover max-h-[400px]"
                    loading="lazy"
                  />
                )}

                <div className="px-4 py-3">
                  <div className="flex items-center gap-5 mb-2 text-gray-400 text-sm">
                    <div className="flex items-center gap-1">
                      <FaHeart className="text-red-500" />
                      <span>{item.likes?.length || 0}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FaRegComment />
                      <span>{item.comments?.length || 0}</span>
                    </div>
                  </div>

                  <p className="text-gray-200 text-sm whitespace-pre-wrap break-words">
                    {item.caption}
                  </p>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default SearchPage;