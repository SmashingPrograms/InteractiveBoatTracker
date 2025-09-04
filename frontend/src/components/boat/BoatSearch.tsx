// frontend/src/components/boat/BoatSearch.tsx
import React, { useState } from 'react';
import { useDebounce } from '../../hooks/useDebounce';
import { useUIStore } from '../../stores/uiStore';

export const BoatSearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { showBoatFormModal } = useUIStore();
  
  // TODO: Connect to boat search functionality
  const debouncedSearch = useDebounce(searchTerm, 300);

  return (
    <div className="space-y-3">
      <div className="relative">
        <input
          type="text"
          placeholder="Search boats..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>
      
      <button
        onClick={showBoatFormModal}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
      >
        <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Add New Boat
      </button>
    </div>
  );
};

