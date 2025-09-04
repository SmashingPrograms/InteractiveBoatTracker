// frontend/src/components/map/MapCard.tsx
import React from 'react';
import { Map } from '../../types/map';
import { useMapStore } from '../../stores/mapStore';
import { useUIStore } from '../../stores/uiStore';
import { useAuth } from '../../hooks/useAuth';
import { useDeleteMap } from '../../hooks/useMaps';
import { Button } from '../common/Button';

interface MapCardProps {
  map: Map;
}

export const MapCard: React.FC<MapCardProps> = ({ map }) => {
  const { selectedMapId, setCurrentMap } = useMapStore();
  const { showConfirm } = useUIStore();
  const { isAdmin } = useAuth();
  const deleteMap = useDeleteMap();

  const isSelected = selectedMapId === map.id;

  const handleSelect = () => {
    setCurrentMap(map.id);
    // Navigate back to main map view
    window.history.back();
  };

  const handleEdit = () => {
    // TODO: Set selected map for editing and show form
    console.log('Edit map:', map.id);
  };

  const handleDelete = () => {
    showConfirm({
      title: 'Delete Map',
      message: `Are you sure you want to delete "${map.name}"? This will also delete all boat positions on this map.`,
      onConfirm: () => {
        deleteMap.mutate(map.id);
      },
      onCancel: () => {},
    });
  };

  const handleToggleActive = () => {
    // TODO: Toggle map active status
    console.log('Toggle active:', map.id);
  };

  return (
    <div className={`
      bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow
      ${isSelected ? 'ring-2 ring-blue-500' : ''}
      ${!map.is_active ? 'opacity-75' : ''}
    `}>
      {/* Map Preview */}
      <div className="aspect-video bg-gray-100 relative">
        <img
          src={`/assets/maps/${map.image_path}`}
          alt={map.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = '/assets/placeholder-map.png';
          }}
        />
        
        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <span className={`
            px-2 py-1 text-xs font-medium rounded-full
            ${map.is_active 
              ? 'bg-green-100 text-green-800' 
              : 'bg-gray-100 text-gray-800'
            }
          `}>
            {map.is_active ? 'Active' : 'Inactive'}
          </span>
        </div>

        {/* Selected Badge */}
        {isSelected && (
          <div className="absolute top-3 left-3">
            <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
              Current
            </span>
          </div>
        )}
      </div>

      {/* Map Info */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          {map.name}
        </h3>
        
        {map.description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {map.description}
          </p>
        )}

        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <span>{map.boat_count || 0} boats</span>
          <span>{map.image_width} × {map.image_height}</span>
        </div>

        {/* Actions */}
        <div className="flex space-x-2">
          <Button
            onClick={handleSelect}
            variant={isSelected ? "secondary" : "primary"}
            size="sm"
            className="flex-1"
          >
            {isSelected ? 'Current Map' : 'Select Map'}
          </Button>

          {isAdmin && (
            <div className="flex space-x-1">
              <Button
                onClick={handleEdit}
                variant="ghost"
                size="sm"
                title="Edit map"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </Button>
              
              <Button
                onClick={handleToggleActive}
                variant="ghost"
                size="sm"
                title={map.is_active ? "Deactivate map" : "Activate map"}
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </Button>
              
              <Button
                onClick={handleDelete}
                variant="ghost"
                size="sm"
                title="Delete map"
                className="text-red-600 hover:text-red-700"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};