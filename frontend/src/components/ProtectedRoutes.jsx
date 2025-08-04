import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const ProtectedRoutes = ({ children }) => {
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      setCheckingAuth(false);
    }
  }, [user, navigate]);

  if (checkingAuth) {
    return (
      <div className="flex items-center justify-center h-screen text-white bg-gradient-to-br from-black via-blue-900 to-black">
        <p className="text-lg animate-pulse">Loading...</p>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoutes;
