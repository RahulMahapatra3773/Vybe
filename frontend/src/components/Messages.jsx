import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import useGetMessagesPaginated from '@/hooks/useGetAllMessage';
import useGetRTM from '@/hooks/useGetRTM';
import { Loader2, MessageCircle, Eye } from 'lucide-react';

const Messages = ({ selectedUser }) => {
  useGetRTM();

  const { messages } = useSelector((store) => store.chat);
  const { user } = useSelector((store) => store.auth);

  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const containerRef = useRef(null);
  const messagesEndRef = useRef(null);

  useGetMessagesPaginated(page);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleScroll = (e) => {
    const { scrollTop } = e.target;
    if (scrollTop === 0 && !loadingMore) {
      setLoadingMore(true);
      setPage((prev) => prev + 1);
      setTimeout(() => setLoadingMore(false), 1000);
    }
  };

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="relative flex-1 overflow-y-auto p-6"
    >
      {loadingMore && (
        <div className="flex justify-center items-center text-sm text-blue-300 mb-4">
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Loading more messages...
        </div>
      )}
      <div className="flex justify-center mb-8">
        <div className="flex flex-col items-center text-white text-center">
          {selectedUser?.profilePicture ? (
            <img
              src={selectedUser.profilePicture}
              alt="User"
              className="h-20 w-20 rounded-full ring-2 ring-blue-500/30"
            />
          ) : (
            <div className="h-20 w-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold ring-2 ring-blue-500/30">
              {selectedUser?.username?.charAt(0)?.toUpperCase()}
            </div>
          )}
          <span className="mt-4 text-xl font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            {selectedUser?.username}
          </span>
          <Link to={`/profile/${selectedUser?._id}`}>
            <button className="mt-3 px-4 py-2 text-sm text-blue-300 hover:text-white border border-blue-500/30 hover:border-blue-500/50 rounded-lg transition-colors duration-200 backdrop-blur-sm bg-blue-500/10 hover:bg-blue-500/20">
              <Eye className="w-4 h-4 inline mr-2" />
              View Profile
            </button>
          </Link>
        </div>
      </div>
      
      <div className="flex flex-col gap-4 pb-8">
        {Array.isArray(messages) && messages.length > 0 ? (
          messages.map((msg) => {
            const isSender = msg.senderId === user?._id;
            const createdAt = msg.createdAt ? new Date(msg.createdAt) : null;

            return (
              <div
                key={msg._id}
                className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`px-4 py-3 max-w-[80%] rounded-2xl shadow-lg backdrop-blur-sm border transition-colors duration-200 ${
                    isSender
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-tr-sm border-blue-400/20 hover:from-blue-600 hover:to-blue-700'
                      : 'bg-gradient-to-r from-gray-800 to-gray-700 text-white rounded-tl-sm border-gray-600/20 hover:from-gray-700 hover:to-gray-600'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{msg.message}</p>
                  {createdAt && (
                    <small className="block mt-2 text-xs opacity-70 text-right">
                      {createdAt.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </small>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center mt-20">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg ring-2 ring-blue-500/30">
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-white text-lg font-semibold mb-2">
              No messages yet
            </h3>
            <p className="text-gray-400 text-sm">
              Start a conversation with {selectedUser?.username}
            </p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default Messages;