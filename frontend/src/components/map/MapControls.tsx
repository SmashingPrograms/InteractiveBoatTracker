// frontend/src/components/map/MapControls.tsx
import React from 'react';
import { useUIStore } from '../../stores/uiStore';
import { Button } from '../common/Button';

export const MapControls: React.FC = () => {
  const { mapZoom, setMapZoom, isMapInteractive, setMapInteractive } = useUIStore();

  const handleZoomIn = () => {
    setMapZoom(mapZoom * 1.2);
  };

  const handleZoomOut = () => {
    setMapZoom(mapZoom / 1.2);
  };

  const handleResetZoom = () => {
    setMapZoom(1);
  };

  return (
    <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg p-2 space-y-1">
      <Button
        size="sm"
        variant="ghost"
        onClick={handleZoomIn}
        title="Zoom In"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </Button>
      
      <Button
        size="sm"
        variant="ghost"
        onClick={handleResetZoom}
        title={`Current zoom: ${Math.round(mapZoom * 100)}%`}
        className="text-xs"
      >
        {Math.round(mapZoom * 100)}%
      </Button>
      
      <Button
        size="sm"
        variant="ghost"
        onClick={handleZoomOut}
        title="Zoom Out"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
        </svg>
      </Button>
      
      <div className="border-t pt-1">
        <Button
          size="sm"
          variant={isMapInteractive ? "primary" : "secondary"}
          onClick={() => setMapInteractive(!isMapInteractive)}
          title={isMapInteractive ? "Disable interaction" : "Enable interaction"}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </Button>
      </div>
    </div>
  );
};