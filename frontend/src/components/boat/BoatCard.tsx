// frontend/src/components/boat/BoatCard.tsx
import React from 'react';
import { BoatListing } from '../../types/boat';
import { useDeleteBoat, useAssignBoat } from '../../hooks/useBoats';
import { useUIStore } from '../../stores/uiStore';
import { useMapStore } from '../../stores/mapStore';
import { Button } from '../common/Button';

interface BoatCardProps {
  boat: BoatListing;
}

export const BoatCard: React.FC<BoatCardProps> = ({ boat }) => {
  const { showConfirm, showBoatFormModal, setSelectedPosition } = useUIStore();
  const { currentMap } = useMapStore();
  const deleteBoat = useDeleteBoat();
  const assignBoat = useAssignBoat();

  const handleEdit = () => {
    // TODO: Set selected boat for editing
    showBoatFormModal();
  };

  const handleDelete = () => {
    showConfirm({
      title: 'Delete Boat',
      message: `Are you sure you want to delete boat #${boat.index} (${boat.name || 'Untitled'})?`,
      onConfirm: () => {
        deleteBoat.mutate(boat.id);
      },
      onCancel: () => {},
    });
  };

  const handleViewOnMap = () => {
    if (boat.position_id && currentMap) {
      const boatWithPosition = currentMap.boats.find(
        b => b.position?.id === boat.position_id
      );
      if (boatWithPosition) {
        setSelectedPosition(boat.position_id);
        // TODO: Center map on boat position
      }
    }
  };

  const handleAssignToSelected = () => {
    // TODO: Get selected position from map and assign boat
    console.log('Assign boat to selected position');
  };

  const formatBoatTitle = () => {
    const parts = [`#${boat.index}`];
    if (boat.name) parts.push(boat.name);
    if (boat.make_model) parts.push(boat.make_model);
    if (boat.size) parts.push(`(${boat.size})`);
    return parts.join(' ');
  };

  return (
    <div className={`
      bg-white border rounded-lg p-3 hover:shadow-md transition-shadow
      ${boat.is_mapped ? 'border-green-200 bg-green-50' : 'border-gray-200'}
    `}>
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <h3 className="font-medium text-gray-900 text-sm">
            {formatBoatTitle()}
          </h3>
          <p className="text-sm text-gray-600">
            {boat.customer_name}
          </p>
        </div>
        
        <div className="flex items-center space-x-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={handleEdit}
            title="Edit boat details"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </Button>
          
          <Button
            size="sm"
            variant="ghost"
            onClick={handleDelete}
            title="Delete boat"
            className="text-red-600 hover:text-red-700"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </Button>
        </div>
      </div>
      
      {/* Additional details */}
      <div className="space-y-1 text-xs text-gray-500">
        {boat.vehicle_type && (
          <div>Type: {boat.vehicle_type}</div>
        )}
        {boat.section && (
          <div>Section: {boat.section}</div>
        )}
        {boat.notes && (
          <div className="truncate" title={boat.notes}>
            Notes: {boat.notes}
          </div>
        )}
      </div>
      
      {/* Action buttons */}
      <div className="mt-3 flex space-x-2">
        {boat.is_mapped ? (
          <Button
            size="sm"
            variant="secondary"
            onClick={handleViewOnMap}
            className="flex-1 text-xs"
          >
            View on Map
          </Button>
        ) : (
          <Button
            size="sm"
            variant="primary"
            onClick={handleAssignToSelected}
            className="flex-1 text-xs"
          >
            Assign to Map
          </Button>
        )}
      </div>
    </div>
  );
};

