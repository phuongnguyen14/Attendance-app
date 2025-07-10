import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const MainLayout: React.FC = () => {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 cyberpunk:bg-cyber-dark-100 transition-all duration-500">
      {/* Cyberpunk Background Effects */}
      <div className="cyberpunk:block hidden cyber-background"></div>
      <div className="cyberpunk:block hidden cyber-bg-grid fixed inset-0 opacity-30 pointer-events-none"></div>
      <div className="cyberpunk:block hidden cyber-bg-circuit fixed inset-0 opacity-20 pointer-events-none"></div>
      
      <Sidebar />
      <main className="flex-1 lg:ml-0 overflow-auto relative z-10">
        <div className="p-6 lg:p-8">
          {/* Main content with cyberpunk styling */}
          <div className="cyberpunk:cyber-card cyberpunk:p-6 min-h-full">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default MainLayout;