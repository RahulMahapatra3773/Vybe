import React from 'react';
import { Outlet } from 'react-router-dom';
import LeftSidebar from './LeftSidebar';

const MainLayout = () => {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-black to-blue-900 text-white overflow-hidden">
      <LeftSidebar />

      <main className="flex-1 w-full px-4 py-6 md:pl-[220px] backdrop-blur-xl bg-black/30 border-l border-blue-500/10">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
