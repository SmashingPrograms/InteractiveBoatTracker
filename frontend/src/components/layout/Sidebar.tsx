// frontend/src/components/layout/Sidebar.tsx
import React from 'react';
import { useUIStore } from '../../stores/uiStore';
import { BoatList } from '../boat/BoatList';
import { BoatSearch } from '../boat/BoatSearch';
import { cn } from '../../utils/cn';

export const Sidebar: React.FC = () => {
  const { sidebarOpen, sidebarWidth, toggleSidebar } = useUIStore();

  return (
    <>
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleSidebar}
        />
      )}
      
      {/* Sidebar */}
      <div className={cn(
        'fixed lg:relative inset-y-0 left-0 z-50 flex flex-col bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
      )} style={{ width: sidebarWidth }}>
        
        {/* Sidebar header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Boat Listings
          </h2>
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-1 rounded-md hover:bg-gray-100"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Search */}
        <div className="p-4 border-b border-gray-200">
          <BoatSearch />
        </div>
        
        {/* Boat list */}
        <div className="flex-1 overflow-y-auto">
          <BoatList />
        </div>
      </div>
    </>
  );
};

