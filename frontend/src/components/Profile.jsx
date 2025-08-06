import React, { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import useGetUserProfile from '@/hooks/useGetUserProfile';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Heart, MessageCircle } from 'lucide-react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { toggleFollowing } from '@/redux/authSlice';
import { toast } from 'sonner';
const Profile = () => {
  const { id: userId } = useParams();
  useGetUserProfile(userId);

  const { userProfile, user } = useSelector((store) => store.auth);
  const isLoggedInUserProfile = user?._id === userProfile?._id;
  const isFollowing = user?.following?.includes(userProfile?._id);
  const [activeTab, setActiveTab] = useState('posts');
  const displayedPosts = activeTab === 'posts' ? userProfile?.posts : userProfile?.bookmarks;
  const dispatch = useDispatch();
  const [mutuals, setMutuals] = useState([]);
  const [mutualsLoading, setMutualsLoading] = useState(false);
  const [showAllMutuals, setShowAllMutuals] = useState(false);
  const handleFollowToggle = async () => {
    try {
      await axios.post(
        `https://vybe-q98w.onrender.com/api/v1/user/followorunfollow/${userProfile._id}`,
        {},
        { withCredentials: true }
      );

      dispatch(toggleFollowing(userProfile._id));
      toast.success(isFollowing ? 'Unfollowed' : 'Followed');
    } catch (error) {
      console.error(error);
      toast.error('Failed to update follow status');
    }
  };
  useEffect(() => {
    const fetchMutuals = async () => {
      if (!userId || isLoggedInUserProfile) return;

      setMutualsLoading(true);
      try {
        const res = await axios.get(`https://vybe-q98w.onrender.com/api/v1/user/mutuals/${userId}`, {
          withCredentials: true,
        });

        setMutuals(res.data.mutuals || []);
      } catch (error) {
        setMutuals([]);
      } finally {
        setMutualsLoading(false);
      }
    };

    fetchMutuals();
  }, [userId, isLoggedInUserProfile]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 text-white">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="flex justify-center md:justify-end">
          <Avatar className="w-32 h-32 border-2 border-blue-600 shadow-md shadow-blue-900/40">
            <AvatarImage className="object-fit" src={userProfile?.profilePicture} />
            <AvatarFallback>{userProfile?.name?.charAt(0)}</AvatarFallback>
          </Avatar>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex items-center flex-wrap gap-3">
            <span className="text-lg font-semibold">{userProfile?.username}</span>
            {isLoggedInUserProfile ? (
              <Link to="/account/edit">
                <Button variant="secondary" className="h-8 text-xs">Edit Profile</Button>
              </Link>
            ) : (
              <>
                <Button
                  onClick={handleFollowToggle}
                  className={`h-8 text-xs ${isFollowing
                      ? 'bg-transparent border border-red-500 text-red-400 hover:text-red-500'
                      : 'bg-[#3BADF8] hover:bg-[#3495d6] text-white'
                    }`}
                >
                  {isFollowing ? 'Unfollow' : 'Follow'}
                </Button>
              </>
            )}
          </div>
          {!isLoggedInUserProfile && (
            <div className="mt-3">
              {mutualsLoading ? (
                <div className="text-sm text-gray-400">Loading mutual connections...</div>
              ) : mutuals && mutuals.length > 0 ? (
                <div className="flex flex-col gap-2">
                  <span className="text-sm text-gray-400">
                    Followed by <span className="text-blue-400 font-medium">{mutuals.length}</span> of your connections:
                  </span>

                  <div className="flex flex-wrap gap-3 items-center">
                    {mutuals.slice(0, showAllMutuals ? mutuals.length : 3).map((mutual) => (
                      <div key={mutual._id} className="relative group">
                        <Link
                          to={`/profile/${mutual._id}`}
                          className="flex items-center gap-1 text-sm text-blue-400 hover:underline"
                        >
                          <Avatar className="w-7 h-7 border border-blue-600">
                            <AvatarImage src={mutual.profilePicture} />
                            <AvatarFallback className="text-xs bg-blue-900">
                              {mutual.username?.[0]?.toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        </Link>
                        <div className="absolute z-10 bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-gray-200 text-xs p-2 rounded shadow-lg w-40 text-center pointer-events-none">
                          <div className="font-semibold truncate">{mutual.username}</div>
                        </div>
                      </div>
                    ))}

                    {mutuals.length > 3 && (
                      <button
                        onClick={() => setShowAllMutuals(!showAllMutuals)}
                        className="text-xs text-gray-400 underline hover:text-blue-300 transition"
                      >
                        {showAllMutuals
                          ? 'Show less'
                          : `+${mutuals.length - 3} more`}
                      </button>
                    )}
                  </div>
                </div>
              ) : null}
            </div>
          )}
          <div className="flex gap-6 text-sm">
            <p><span className="font-semibold">{userProfile?.posts?.length || 0}</span> posts</p>
            <p><span className="font-semibold">{userProfile?.followers?.length || 0}</span> followers</p>
            <p><span className="font-semibold">{userProfile?.following?.length || 0}</span> following</p>
          </div>
          <div className="text-sm">
            <p className="font-semibold">{userProfile?.bio || 'Bio here...'}</p>
            <Badge variant="secondary" className="w-fit mt-1">@{userProfile?.username}</Badge>
            <p className="mt-2 text-gray-400">Happy Learning 😊</p>
            <p className="text-gray-400">Turning code into fun 😎</p>
            <p className="text-gray-400">Keep coding 👨‍💻🧑‍🏫</p>
          </div>
        </div>
      </div>
      <div className="mt-10 border-t border-blue-900 pt-4">
        <div className="flex justify-center gap-8 text-sm font-medium">
          {['posts', 'saved'].map((tab) => (
            <span
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`cursor-pointer py-2 px-4 border-b-2 transition ${activeTab === tab ? 'border-blue-500 text-blue-400' : 'border-transparent hover:text-gray-400'
                }`}
            >
              {tab.toUpperCase()}
            </span>
          ))}
        </div>
        <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-2">
          {(displayedPosts || []).map((post) => (
            <div key={post?._id} className="relative group cursor-pointer">
              <img
                src={post.image}
                alt="post"
                className="w-full aspect-square object-cover rounded-md"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-md">
                <div className="flex gap-6 text-white">
                  <div className="flex items-center gap-2 text-sm">
                    <Heart className="w-4 h-4" />
                    <span>{post?.likes.length}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MessageCircle className="w-4 h-4" />
                    <span>{post?.comments.length}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {(!displayedPosts || displayedPosts.length === 0) && (
            <p className="col-span-full text-center text-gray-500 mt-6">No {activeTab} to show.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
