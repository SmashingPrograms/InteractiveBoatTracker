// frontend/src/components/map/MapToolbar.tsx
import React from 'react';
import { useMapStore } from '../../stores/mapStore';
import { useUIStore } from '../../stores/uiStore';
import { Button } from '../common/Button';

export const MapToolbar: React.FC = () => {
  const { currentMap } = useMapStore();
  const { 
    selectedPositionId, 
    setSelectedPosition, 
    showBoatFormModal,
    showConfirm 
  } = useUIStore();

  const handleAddBoat = () => {
    if (!currentMap) return;
    
    // TODO: Create new position at center of map
    console.log('Adding new boat');
  };

  const handleDeletePosition = () => {
    if (!selectedPositionId) return;
    
    showConfirm({
      title: 'Delete Position',
      message: 'Are you sure you want to delete this boat position? This action cannot be undone.',
      onConfirm: () => {
        // TODO: Call delete position mutation
        console.log('Deleting position:', selectedPositionId);
        setSelectedPosition(null);
      },
      onCancel: () => {},
    });
  };

  if (!currentMap) return null;

  const selectedBoat = selectedPositionId 
    ? currentMap.boats.find(b => b.position.id === selectedPositionId)
    : null;

  return (
    <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-3 space-y-2 z-10">
      <div className="flex space-x-2">
        <Button
          size="sm"
          onClick={handleAddBoat}
          title="Add new boat position (or double-click on map)"
        >
          <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Boat
        </Button>
        
        <Button
          size="sm"
          variant="secondary"
          onClick={showBoatFormModal}
        >
          <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Listing
        </Button>
      </div>

      {selectedBoat && (
        <div className="border-t pt-2 space-y-2">
          <div className="text-xs text-gray-600">
            Selected: {selectedBoat.boat?.name || `Position #${selectedBoat.position.id}`}
          </div>
          
          <div className="flex space-x-1">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {/* TODO: Show boat details */}}
            >
              Details
            </Button>
            
            <Button
              size="sm"
              variant="danger"
              onClick={handleDeletePosition}
            >
              Delete
            </Button>
          </div>
          
          <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
            <div>WASD: Move</div>
            <div>[] : Rotate</div>
            <div>+/-: Resize</div>
          </div>
        </div>
      )}
    </div>
  );
};

