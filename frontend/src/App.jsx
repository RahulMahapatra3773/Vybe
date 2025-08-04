
import { useRef } from 'react';
import { useEffect } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';
import { io } from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import { setSocket } from './redux/socketSlice';
import { setOnlineUsers } from './redux/chatSlice';
import { setLikeNotification } from './redux/rtnSlice';
import ChatPage from './components/ChatPage';
import EditProfile from './components/EditProfile';
import Home from './components/Home';
import Login from './components/Login';
import Profile from './components/Profile';
import Signup from './components/Signup';
import ConditionalLandingPage from './components/ConditionalLandingPage';
import SearchPage from './components/SearchPage';
import Explore from './components/Explore';
const browserRouter = createBrowserRouter([
  {
    path: '/',
    element: <ConditionalLandingPage />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/explore', element: <Explore /> },
      { path: '/profile/:id', element: <Profile /> },
      { path: '/account/edit', element: <EditProfile /> },
      { path: '/chat', element: <ChatPage /> },
      { path: '/search', element: <SearchPage /> },
    ],
  },
  { path: '/login', element: <Login /> },
  { path: '/signup', element: <Signup /> },
]);



function App() {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const socketRef = useRef(null);

  useEffect(() => {
    if (user && user._id && !socketRef.current) {
      const socketio = io('https://vybe-q98w.onrender.com/', {
        query: { userId: user._id },
        transports: ['websocket'],
        withCredentials: true,
      });

      socketRef.current = socketio;

      socketio.on('getOnlineUsers', (onlineUsers) => {
        dispatch(setOnlineUsers(onlineUsers));
      });

      socketio.on('getNotification', (notification) => {
        dispatch(setLikeNotification(notification));
      });

      dispatch(setSocket(socketio));
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        dispatch(setSocket(null));
      }
    };
  }, [user?._id]); 

  return <RouterProvider router={browserRouter} />;
}
export default App;