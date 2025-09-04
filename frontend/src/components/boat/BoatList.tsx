// frontend/src/components/boat/BoatList.tsx
import React, { useState } from 'react';
import { useBoats } from '../../hooks/useBoats';
import { useDebounce } from '../../hooks/useDebounce';
import { BoatCard } from './BoatCard';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { Button } from '../common/Button';
import { BoatSearchParams } from '../../types/boat';

export const BoatList: React.FC = () => {
  const [searchParams, setSearchParams] = useState<BoatSearchParams>({
    skip: 0,
    limit: 10,
    search: '',
    mapped_only: undefined,
    section: undefined,
  });

  const debouncedSearch = useDebounce(searchParams.search || '', 300);
  const { data: boats = [], isLoading, error } = useBoats({
    ...searchParams,
    search: debouncedSearch,
  });

  const handleLoadMore = () => {
    setSearchParams(prev => ({
      ...prev,
      skip: (prev.skip || 0) + (prev.limit || 10),
    }));
  };

  const handleFilterChange = (key: keyof BoatSearchParams, value: any) => {
    setSearchParams(prev => ({
      ...prev,
      [key]: value,
      skip: 0, // Reset pagination when filtering
    }));
  };

  if (error) {
    return (
      <div className="p-4 text-center">
        <p className="text-red-600 mb-4">Failed to load boats</p>
        <Button onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Filters */}
      <div className="p-4 space-y-3 border-b border-gray-200">
        <div className="flex space-x-2">
          <select
            value={searchParams.mapped_only === undefined ? '' : searchParams.mapped_only.toString()}
            onChange={(e) => handleFilterChange('mapped_only', 
              e.target.value === '' ? undefined : e.target.value === 'true'
            )}
            className="flex-1 px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Boats</option>
            <option value="true">Mapped Only</option>
            <option value="false">Unmapped Only</option>
          </select>
          
          <select
            value={searchParams.section || ''}
            onChange={(e) => handleFilterChange('section', e.target.value || undefined)}
            className="flex-1 px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Sections</option>
            <option value="A">Section A</option>
            <option value="B">Section B</option>
            <option value="C">Section C</option>
            <option value="D">Section D</option>
            <option value="E">Section E</option>
            <option value="F">Section F</option>
          </select>
        </div>
        
        <Button
          onClick={() => setSearchParams({ skip: 0, limit: 10, search: '' })}
          variant="ghost"
          size="sm"
          className="w-full"
        >
          Clear Filters
        </Button>
      </div>

      {/* Boat list */}
      <div className="flex-1 overflow-y-auto">
        {isLoading && boats.length === 0 ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner />
          </div>
        ) : (
          <>
            {boats.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <p>No boats found</p>
                <p className="text-sm mt-1">Try adjusting your search or filters</p>
              </div>
            ) : (
              <div className="space-y-2 p-4">
                {boats.map((boat) => (
                  <BoatCard key={boat.id} boat={boat} />
                ))}
                
                {boats.length >= (searchParams.limit || 10) && (
                  <div className="pt-4">
                    <Button
                      onClick={handleLoadMore}
                      variant="ghost"
                      size="sm"
                      className="w-full"
                      isLoading={isLoading}
                    >
                      Load More
                    </Button>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

