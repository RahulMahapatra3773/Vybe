import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { MessageCircleCode, Send, Users, X } from 'lucide-react';
import Messages from './Messages';
import axios from 'axios';
import { setMessages, setTypingUser } from '@/redux/chatSlice';
import { setSelectedUser } from '@/redux/authSlice';

const ChatPage = () => {
  const dispatch = useDispatch();
  const { user, suggestedUsers, selectedUser } = useSelector((store) => store.auth);
  const { onlineUsers, messages } = useSelector((store) => store.chat);
  const { socket } = useSelector((store) => store.socketio);
  const [textMessage, setTextMessage] = useState('');
  const { typingUserId } = useSelector((store) => store.chat);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isSendingRef = useRef(false);
  const lastMessageRef = useRef('');
  const typingDisplayTimeoutRef = useRef(null);

  const sendMessageHandler = async (receiverId) => {
    const messageText = textMessage.trim();
    if (!messageText) return;
    if (isSendingRef.current) return;
    if (messageText === lastMessageRef.current) return;
    
    isSendingRef.current = true;
    lastMessageRef.current = messageText;

    try {
      setTextMessage('');
      
      const res = await axios.post(
        `https://vybe-q98w.onrender.com/api/v1/message/send/${receiverId}`,
        { message: messageText },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        const newMessage = res.data.newMessage;
        dispatch(setMessages([...messages, newMessage]));
        socket?.emit('sendMessage', {
          receiverId,
          message: newMessage,
        });
      }
    } catch (error) {
      console.error('Message send failed:', error);
      setTextMessage(messageText);
    } finally {
      isSendingRef.current = false;
      setTimeout(() => {
        lastMessageRef.current = '';
      }, 1000);
    }
  };

  const typingTimeoutRef = useRef(null);
  const isTypingRef = useRef(false);
  
  const handleTyping = () => {
    if (!isTypingRef.current) {
      isTypingRef.current = true;
      socket?.emit("typing", { receiverId: selectedUser?._id });
    }
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      isTypingRef.current = false;
      socket?.emit("stopTyping", { receiverId: selectedUser?._id });
    }, 1500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (textMessage.trim() && !isSendingRef.current) {
        sendMessageHandler(selectedUser?._id);
      }
    }
  };

  useEffect(() => {
    if (!socket || !selectedUser) return;

    const handleTyping = ({ senderId }) => {
      if (senderId !== selectedUser._id) return;
      
      dispatch(setTypingUser(senderId));
      if (typingDisplayTimeoutRef.current) {
        clearTimeout(typingDisplayTimeoutRef.current);
      }
      typingDisplayTimeoutRef.current = setTimeout(() => {
        dispatch(setTypingUser(null));
      }, 3000);
    };

    const handleStopTyping = ({ senderId }) => {
      if (senderId === selectedUser._id) {
        if (typingDisplayTimeoutRef.current) {
          clearTimeout(typingDisplayTimeoutRef.current);
        }
        dispatch(setTypingUser(null));
      }
    };

    const handleNewMessage = (newMessage) => {
      if (newMessage.senderId !== user?._id) {
        dispatch(setMessages([...messages, newMessage]));
      }
    };

    socket.on("typing", handleTyping);
    socket.on("stopTyping", handleStopTyping);
    socket.on("newMessage", handleNewMessage);
    
    return () => {
      socket.off("typing", handleTyping);
      socket.off("stopTyping", handleStopTyping);
      socket.off("newMessage", handleNewMessage);
      dispatch(setSelectedUser(null));
      
      // Clear all timeouts on cleanup
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (typingDisplayTimeoutRef.current) {
        clearTimeout(typingDisplayTimeoutRef.current);
      }
    };
  }, [socket, selectedUser, dispatch, messages]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarOpen && window.innerWidth < 768) {
        const sidebar = document.getElementById('chat-sidebar');
        if (sidebar && !sidebar.contains(event.target)) {
          setSidebarOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [sidebarOpen]);

  return (
    <div className="flex h-screen max-h-screen overflow-hidden md:ml-[30px]">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      <aside
        id="chat-sidebar"
        className={`
          fixed md:relative top-0 left-0 h-full z-50
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          w-80 md:w-80 lg:w-96 xl:w-80
          bg-gradient-to-br from-gray-900/95 via-black/95 to-gray-800/95
          backdrop-blur-xl border-r border-blue-500/20
          flex flex-col shadow-2xl overflow-hidden
        `}
      >
        <div className="flex-shrink-0 p-4 border-b border-blue-500/20 bg-gradient-to-r from-blue-600/10 to-purple-600/10">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10 ring-2 ring-blue-500/30">
                <AvatarImage src={user?.profilePicture} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold text-sm">
                  {user?.username?.charAt(0)?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <h2 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent truncate">
                  {user?.username}
                </h2>
                <p className="text-xs text-gray-400">Messages</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-3">
          {suggestedUsers.length > 0 ? (
            <div className="space-y-2">
              {suggestedUsers.map((suggestedUser) => {
                const isOnline = onlineUsers.includes(suggestedUser?._id);
                const isSelected = selectedUser?._id === suggestedUser._id;

                return (
                  <div
                    key={suggestedUser?._id}
                    onClick={() => {
                      dispatch(setSelectedUser(suggestedUser));
                      setSidebarOpen(false);
                    }}
                    className={`
                      group relative flex gap-3 items-center p-3 rounded-xl cursor-pointer
                      transition-all duration-200 ease-in-out
                      ${isSelected
                        ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 shadow-lg'
                        : 'hover:bg-white/5 hover:shadow-md'
                      }
                    `}
                  >
                    {isSelected && (
                      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-r-full" />
                    )}
                    <div className="relative flex-shrink-0">
                      <Avatar className="w-12 h-12 ring-2 ring-transparent group-hover:ring-blue-500/30 transition-all">
                        <AvatarImage
                          src={suggestedUser?.profilePicture}
                        />
                        <AvatarFallback className="bg-gradient-to-br from-gray-600 to-gray-800 text-white">
                          {suggestedUser?.username?.charAt(0)?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`
                        absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-gray-900
                        ${isOnline ? 'bg-green-500' : 'bg-gray-500'}
                      `} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <span className="font-semibold text-white group-hover:text-blue-300 transition-colors truncate block">
                        {suggestedUser?.username}
                      </span>
                      <span className={`
                        text-xs font-medium transition-colors
                        ${isOnline ? 'text-green-400' : 'text-gray-500'}
                      `}>
                        {isOnline ? 'Online' : 'Offline'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Users className="w-16 h-16 text-gray-600 mb-4" />
              <p className="text-gray-400 font-medium">No users found</p>
              <p className="text-sm text-gray-500 mt-1">Start following people to chat</p>
            </div>
          )}
        </div>
      </aside>
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {selectedUser ? (
          <>
            <header className="flex-shrink-0 flex items-center gap-3 px-4 py-3 border-b border-blue-500/20 bg-gradient-to-r from-black/80 to-gray-900/80 backdrop-blur-lg">
              <button
                onClick={() => setSidebarOpen(true)}
                className="md:hidden p-2 hover:bg-white/10 rounded-lg transition-colors flex-shrink-0"
                aria-label="Open sidebar"
              >
                <Users className="w-5 h-5 text-gray-300" />
              </button>
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="relative flex-shrink-0">
                  <Avatar className="w-10 h-10 ring-2 ring-blue-500/30">
                    <AvatarImage src={selectedUser?.profilePicture} className="object-cover" />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold text-sm">
                      {selectedUser?.username?.charAt(0)?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className={`
                    absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-gray-900
                    ${onlineUsers.includes(selectedUser?._id) ? 'bg-green-500' : 'bg-gray-500'}
                  `} />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-white text-base truncate">
                    {selectedUser?.username}
                  </h3>
                  <p className={`
                    text-xs font-medium
                    ${onlineUsers.includes(selectedUser?._id) ? 'text-green-400' : 'text-gray-500'}
                  `}>
                    {onlineUsers.includes(selectedUser?._id) ? 'Online' : 'Offline'}
                  </p>
                </div>
              </div>
            </header>
            <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
              <div className="flex-1 overflow-hidden">
                <Messages selectedUser={selectedUser} />
              </div>
              {selectedUser?._id === typingUserId && (
                <div className="flex-shrink-0 px-4 py-2 animate-fadeIn">
                  <div className="flex items-center gap-2 max-w-fit">
                    <Avatar className="w-8 h-8 flex-shrink-0">
                      <AvatarImage src={selectedUser?.profilePicture} />
                      <AvatarFallback className="bg-gray-600 text-white text-xs">
                        {selectedUser?.username?.charAt(0)?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-gradient-to-r from-gray-800 to-gray-700 px-3 py-2 rounded-2xl shadow-lg">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-300">
                          {selectedUser?.username} is typing
                        </span>
                        <div className="flex gap-1">
                          <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" />
                          <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                          <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <footer className="flex-shrink-0 p-4 border-t border-blue-500/20 bg-gradient-to-r from-black/80 to-gray-900/80 backdrop-blur-lg">
              <div className="flex gap-3 items-end max-w-4xl mx-auto">
                <div className="flex-1 relative min-w-0">
                  <Input
                    value={textMessage}
                    onChange={(e) => {
                      setTextMessage(e.target.value);
                      handleTyping();
                    }}
                    placeholder="Type a message..."
                    className="
                      bg-gradient-to-r from-gray-800/80 to-gray-900/80 backdrop-blur-sm
                      border border-blue-500/20 rounded-2xl px-4 py-3
                      text-white placeholder-gray-400
                      focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20
                      transition-all duration-200 w-full
                    "
                    onKeyPress={handleKeyPress}
                  />
                </div>
                <Button
                  onClick={() => sendMessageHandler(selectedUser?._id)}
                  disabled={!textMessage.trim() || isSendingRef.current}
                  className="
                    bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700
                    disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed
                    text-white rounded-2xl px-4 py-3 h-12 w-12 flex-shrink-0
                    transition-all duration-200 hover:scale-105
                    shadow-lg hover:shadow-blue-500/25
                  "
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </footer>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-4 relative overflow-hidden">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden absolute top-4 left-4 p-3 hover:bg-white/10 rounded-xl transition-colors bg-black/20 backdrop-blur-sm flex-shrink-0"
              aria-label="Open sidebar"
            >
              <Users className="w-6 h-6 text-gray-300" />
            </button>

            <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-3xl p-8 md:p-12 backdrop-blur-sm border border-blue-500/20 max-w-md mx-auto">
              <MessageCircleCode className="w-20 h-20 md:w-24 md:h-24 text-blue-400 mb-6 mx-auto" />
              <h2 className="text-xl md:text-2xl font-bold mb-3 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Your Messages
              </h2>
              <p className="text-gray-400 leading-relaxed text-sm md:text-base">
                Select a conversation from the sidebar to start chatting with your friends.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ChatPage;