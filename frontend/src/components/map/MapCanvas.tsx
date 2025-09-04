// frontend/src/components/map/MapCanvas.tsx
import React, { useRef, useEffect, useState } from 'react';
import { Stage, Layer, Image as KonvaImage } from 'react-konva';
import { useMapStore } from '../../stores/mapStore';
import { useUIStore } from '../../stores/uiStore';
import { BoatObject } from './BoatObject';
import { MapToolbar } from './MapToolbar';
import { LoadingSpinner } from '../common/LoadingSpinner';
import useImage from 'use-image';
import Konva from 'konva';

export const MapCanvas: React.FC = () => {
  const { currentMap, isLoading } = useMapStore();
  const { sidebarOpen, sidebarWidth, selectedPositionId, setSelectedPosition } = useUIStore();
  const stageRef = useRef<Konva.Stage>(null);
  const [stageDimensions, setStageDimensions] = useState({ width: 800, height: 600 });
  
  // Load map image
  const [mapImage] = useImage(
    currentMap ? `/assets/maps/${currentMap.map.image_path}` : '',
    'anonymous'
  );

  // Calculate stage dimensions based on sidebar state
  useEffect(() => {
    const updateDimensions = () => {
      const sidebar = sidebarOpen ? sidebarWidth : 0;
      const width = window.innerWidth - sidebar;
      const height = window.innerHeight - 64; // Subtract navbar height
      
      setStageDimensions({ width, height });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [sidebarOpen, sidebarWidth]);

  // Handle keyboard controls for selected boat
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!selectedPositionId || !currentMap) return;
      
      // Ignore if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      const selectedBoat = currentMap.boats.find(
        boat => boat.position.id === selectedPositionId
      );
      
      if (!selectedBoat) return;

      const position = selectedBoat.position;
      const speed = 5;
      
      let updates: Partial<typeof position> = {};
      
      switch (e.key.toLowerCase()) {
        case 'w':
        case 'arrowup':
          updates.y = Math.max(0, position.y - speed);
          break;
        case 's':
        case 'arrowdown':
          updates.y = Math.min(currentMap.map.image_height, position.y + speed);
          break;
        case 'a':
        case 'arrowleft':
          updates.x = Math.max(0, position.x - speed);
          break;
        case 'd':
        case 'arrowright':
          updates.x = Math.min(currentMap.map.image_width, position.x + speed);
          break;
        case '[':
          updates.rotation = position.rotation - 5;
          break;
        case ']':
          updates.rotation = position.rotation + 5;
          break;
        case '=':
        case '+':
          updates.width = position.width + 5;
          updates.height = position.height + 3.5;
          break;
        case '-':
          updates.width = Math.max(10, position.width - 5);
          updates.height = Math.max(7, position.height - 3.5);
          break;
        default:
          return;
      }

      if (Object.keys(updates).length > 0) {
        e.preventDefault();
        // TODO: Call update position mutation
        console.log('Updating position:', updates);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedPositionId, currentMap]);

  const handleStageClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    // Deselect if clicking on empty area
    if (e.target === e.target.getStage()) {
      setSelectedPosition(null);
    }
  };

  const handleDoubleClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (e.target === e.target.getStage() && currentMap) {
      // Create new boat position at click location
      const pos = e.target.getStage()?.getPointerPosition();
      if (pos) {
        // TODO: Call create position mutation
        console.log('Creating new position at:', pos);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!currentMap) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">No map selected</p>
          <p className="text-sm text-gray-400">
            Select a map from the dropdown above
          </p>
        </div>
      </div>
    );
  }

  // Calculate scale to fit map in viewport
  const scaleX = stageDimensions.width / currentMap.map.image_width;
  const scaleY = stageDimensions.height / currentMap.map.image_height;
  const scale = Math.min(scaleX, scaleY, 1); // Don't scale up

  return (
    <div className="flex-1 relative overflow-hidden bg-gray-100">
      <MapToolbar />
      
      <Stage
        ref={stageRef}
        width={stageDimensions.width}
        height={stageDimensions.height}
        scaleX={scale}
        scaleY={scale}
        onClick={handleStageClick}
        onDblClick={handleDoubleClick}
        className="cursor-crosshair"
      >
        <Layer>
          {/* Map background */}
          {mapImage && (
            <KonvaImage
              image={mapImage}
              width={currentMap.map.image_width}
              height={currentMap.map.image_height}
            />
          )}
          
          {/* Boat objects */}
          {currentMap.boats.map((boatWithPosition) => (
            <BoatObject
              key={boatWithPosition.position.id}
              boatWithPosition={boatWithPosition}
              isSelected={selectedPositionId === boatWithPosition.position.id}
              onSelect={() => setSelectedPosition(boatWithPosition.position.id)}
            />
          ))}
        </Layer>
      </Stage>
      
      {/* Map info overlay */}
      <div className="absolute top-4 left-4 bg-white bg-opacity-90 rounded-lg p-3 shadow-md">
        <h3 className="font-semibold text-gray-900">{currentMap.map.name}</h3>
        <p className="text-sm text-gray-600">
          {currentMap.boats.length} positions
        </p>
        {selectedPositionId && (
          <p className="text-xs text-blue-600 mt-1">
            Use WASD or arrow keys to move selected boat
          </p>
        )}
      </div>
    </div>
  );
};

