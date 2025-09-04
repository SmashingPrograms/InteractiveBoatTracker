// frontend/src/components/map/MapManagementPage.tsx
import React from 'react';
import { useMaps, useCreateMap } from '../../hooks/useMaps';
import { useAuth } from '../../hooks/useAuth';
import { useUIStore } from '../../stores/uiStore';
import { Button } from '../common/Button';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { MapCard } from './MapCard';
import { MapForm } from './MapForm';

export const MapManagementPage: React.FC = () => {
  const { data: maps = [], isLoading, error } = useMaps();
  const { isAdmin } = useAuth();
  const { showMapForm, showMapFormModal, hideMapFormModal } = useUIStore();

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Failed to load maps</p>
          <Button onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Marina Maps</h1>
            <p className="text-gray-600 mt-1">
              Manage your marina property maps and boat layouts
            </p>
          </div>
          
          {isAdmin && (
            <Button onClick={showMapFormModal}>
              <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add New Map
            </Button>
          )}
        </div>

        {/* Maps Grid */}
        {maps.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No maps found</h3>
            <p className="text-gray-500 mb-4">
              {isAdmin 
                ? "Get started by creating your first marina map" 
                : "No maps have been created yet"
              }
            </p>
            {isAdmin && (
              <Button onClick={showMapFormModal}>
                Create Your First Map
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {maps.map((map) => (
              <MapCard key={map.id} map={map} />
            ))}
          </div>
        )}

        {/* Map Form Modal */}
        <MapForm />
      </div>
    </div>
  );
};


