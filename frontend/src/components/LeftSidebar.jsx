import {
  Heart, Home, LogOut, MessageCircle, PlusSquare,
  Search, TrendingUp, Menu, X, Camera, Sparkles,
  User
} from 'lucide-react';
import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { toast } from 'sonner';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthUser } from '@/redux/authSlice';
import CreatePost from './CreatePost';
import { setPosts, setSelectedPost } from '@/redux/postSlice';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Button } from './ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { clearNotifications, markNotificationsAsRead } from '@/redux/rtnSlice';

const LeftSidebar = React.memo(() => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { user } = useSelector(store => store.auth);
  const { likeNotification, hasUnread } = useSelector(store => store.realTimeNotification);

  const logoutHandler = async () => {
    try {
      const res = await axios.get('https://vybe-q98w.onrender.com/api/v1/user/logout', {
        withCredentials: true,
      });

      if (res.data.success) {
        dispatch(setAuthUser(null));
        dispatch(setSelectedPost(null));
        dispatch(setPosts([]));
        dispatch(clearNotifications());
        navigate("/login");
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };

  const sidebarHandler = (text) => {
    setShowMobileMenu(false);
    switch (text) {
      case 'Logout': logoutHandler(); break;
      case 'Create': setOpen(true); break;
      case 'Profile': navigate(`/profile/${user?._id}`); break;
      case 'Home': navigate('/'); break;
      case 'Messages': navigate('/chat'); break;
      case 'Search': navigate('/search'); break;
      case 'Explore': navigate('/explore'); break;
      default: break;
    }
  };

const sidebarItems = [
  { icon: <Home />, text: "Home", gradient: "from-blue-500 to-cyan-500" },
  { icon: <Search />, text: "Search", gradient: "from-purple-500 to-violet-500" },
  { icon: <TrendingUp />, text: "Explore", gradient: "from-orange-500 to-yellow-500" },
  { icon: <MessageCircle />, text: "Messages", gradient: "from-green-500 to-emerald-500" },
  { icon: <Heart />, text: "Notification", gradient: "from-red-500 to-pink-500" },
  { icon: <PlusSquare />, text: "Create", gradient: "from-indigo-500 to-blue-500" },
  {
  icon: <User className="w-5 h-5 text-white" />,
  text: "Profile",
  gradient: "from-pink-500 to-purple-500"
},
  { icon: <LogOut />, text: "Logout", gradient: "from-gray-500 to-gray-600" },
];

  const SidebarContent = ({ isMobile = false }) => (
    <div className="flex flex-col justify-between h-full relative">
      {/* Static Background Orbs */}
      <div className="absolute w-32 h-32 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-3xl top-10 right-0 opacity-15" />
      <div className="absolute w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-2xl bottom-20 left-0 opacity-10" />

      <div className="relative z-10">
        {isMobile && (
          <div className="flex items-center justify-between mb-8">
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-black/60 to-gray-900/60 backdrop-blur-xl rounded-xl border border-blue-500/30">
                <img src="/vybe-icon.svg" alt="Vybe" className="w-8 h-8 sm:w-6 sm:h-6" />
              <span className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Vybe
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-gradient-to-r hover:from-gray-800/60 hover:to-gray-700/60 backdrop-blur-sm rounded-xl border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300"
              onClick={() => setShowMobileMenu(false)}
            >
              <X className="w-6 h-6" />
            </Button>
          </div>
        )}

        {!isMobile && (
          <div className="mb-8">
            <div className="inline-flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-black/60 to-gray-900/60 backdrop-blur-xl rounded-xl border border-blue-500/30 shadow-2xl mx-auto">
                <img src="/vybe-icon.svg" alt="Vybe" className="w-8 h-8 sm:w-6 sm:h-6" />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Vybe
              </span>
            </div>
          </div>
        )}

        <div className="flex flex-col space-y-2">
          {sidebarItems.map((item, index) => {
            const isNotification = item.text === "Notification";

            return (
              <div key={index}>
                {isNotification ? (
                  <Popover>
                    <PopoverTrigger asChild>
                      <div
                        className="group flex items-center text-white hover:bg-gradient-to-r hover:from-red-500/10 hover:to-pink-500/10 transition-all duration-300 rounded-xl px-4 py-3 gap-4 cursor-pointer relative backdrop-blur-sm border border-transparent hover:border-red-500/20 hover:translate-x-1"
                        onClick={() => dispatch(markNotificationsAsRead())}
                      >
                        <div className={`p-2 rounded-lg bg-gradient-to-r ${item.gradient} group-hover:scale-105 transition-transform duration-200`}>
                          <Heart className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-sm font-medium group-hover:text-red-300 transition-colors">
                          Notification
                        </span>

                        {likeNotification.length > 0 && hasUnread && (
                          <span className="absolute -top-1 -right-1 h-6 w-6 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full flex items-center justify-center shadow-lg border-2 border-black/20">
                            {likeNotification.length}
                          </span>
                        )}

                        <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-pink-500/0 to-red-500/0 group-hover:from-red-500/5 group-hover:via-pink-500/5 group-hover:to-red-500/5 rounded-xl transition-all duration-300" />
                      </div>
                    </PopoverTrigger>

                    <PopoverContent className="bg-gradient-to-br from-black/90 via-gray-900/90 to-black/90 backdrop-blur-xl text-white border border-blue-500/30 shadow-2xl w-80 rounded-2xl">
                      <div className="p-2">
                        <div className="flex items-center gap-2 mb-4">
                          <Sparkles className="w-4 h-4 text-blue-400" />
                          <h3 className="font-semibold text-blue-400">Notifications</h3>
                        </div>
                        <div className="text-sm max-h-60 overflow-y-auto space-y-3">
                          {likeNotification.length === 0 ? (
                            <div className="text-center py-8">
                              <Heart className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                              <p className="text-gray-400">No new notifications</p>
                            </div>
                          ) : (
                            likeNotification.map((notification, idx) => (
                              <div
                                key={notification.userId + idx}
                                className="flex items-center gap-3 p-3 bg-gradient-to-r from-gray-800/40 to-gray-900/40 backdrop-blur-sm rounded-xl border border-blue-500/10 hover:border-blue-500/20 transition-all duration-300"
                              >
                                <Avatar className="border-2 border-blue-500/30">
                                  <AvatarImage src={notification.userDetails?.profilePicture} />
                                  <AvatarFallback >
                                    CN
                                  </AvatarFallback>
                                </Avatar>
                                <p className="text-sm">
                                  <span className="font-bold text-blue-300">
                                    {notification.userDetails?.username}
                                  </span>{" "}
                                  <span className="text-gray-300">
                                    {notification.type === 'like'
                                      ? 'liked your post'
                                      : notification.type === 'dislike'
                                      ? 'disliked your post'
                                      : 'sent you a notification'}
                                  </span>
                                </p>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                ) : (
                  <div
                    onClick={() => sidebarHandler(item.text)}
                    className="group flex items-center text-white hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-purple-500/10 transition-all duration-300 rounded-xl px-4 py-3 gap-4 cursor-pointer relative backdrop-blur-sm border border-transparent hover:border-blue-500/20 hover:translate-x-1"
                  >
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${item.gradient} group-hover:scale-105 transition-transform duration-200`}>
                      {React.cloneElement(item.icon, { className: "w-5 h-5 text-white" })}
                    </div>
                    <span className="text-sm font-medium group-hover:text-blue-300 transition-colors">
                      {item.text}
                    </span>
                    
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-blue-500/5 group-hover:via-purple-500/5 group-hover:to-pink-500/5 rounded-xl transition-all duration-300" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 flex items-center justify-center gap-2 text-gray-400 text-xs mt-8">
        <Sparkles className="w-3 h-3" />
        <span>Stay connected</span>
        <Sparkles className="w-3 h-3" />
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex fixed top-0 left-0 h-screen w-[250px] z-20 bg-gradient-to-br from-gray-900/60 via-black/60 to-blue-900/30 backdrop-blur-xl border-r border-blue-500/30 p-5 shadow-2xl">
        <SidebarContent />
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-4 left-4 z-30">
       <button
  onClick={() => setShowMobileMenu(!showMobileMenu)}
  className="text-white p-1"
>
  <Menu className="w-6 h-6" />
</button>

      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {showMobileMenu && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-30"
              onClick={() => setShowMobileMenu(false)}
            />
            <motion.div
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="fixed top-0 left-0 h-full w-[85%] sm:w-[65%] max-w-[320px] bg-gradient-to-br from-gray-900/95 via-black/95 to-blue-900/80 backdrop-blur-xl border-r border-blue-500/30 z-40 p-6 shadow-2xl"
            >
              <SidebarContent isMobile={true} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <CreatePost open={open} setOpen={setOpen} />
    </>
  );
});

export default LeftSidebar;