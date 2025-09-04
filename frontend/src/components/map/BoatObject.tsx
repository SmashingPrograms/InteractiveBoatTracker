// frontend/src/components/map/BoatObject.tsx
import React, { useState } from 'react';
import { Ellipse, Text, Group } from 'react-konva';
import { BoatWithPosition } from '../../types/boat';
import Konva from 'konva';

interface BoatObjectProps {
  boatWithPosition: BoatWithPosition;
  isSelected: boolean;
  onSelect: () => void;
}

export const BoatObject: React.FC<BoatObjectProps> = ({
  boatWithPosition,
  isSelected,
  onSelect,
}) => {
  const { boat, position } = boatWithPosition;
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = () => {
    setIsDragging(true);
    onSelect();
  };

  const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    setIsDragging(false);
    
    const newX = e.target.x();
    const newY = e.target.y();
    
    // TODO: Call update position mutation
    console.log('Position updated:', { id: position.id, x: newX, y: newY });
  };

  const getBoatColor = () => {
    if (isSelected) return '#3B82F6'; // Blue when selected
    if (!boat) return '#9CA3AF'; // Gray when unassigned
    return position.color;
  };

  const getStrokeWidth = () => {
    if (isSelected) return 3;
    if (isDragging) return 2;
    return position.stroke_width;
  };

  return (
    <Group
      x={position.x}
      y={position.y}
      rotation={position.rotation}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={onSelect}
      onTap={onSelect}
    >
      {/* Boat shape */}
      <Ellipse
        width={position.width}
        height={position.height}
        fill={getBoatColor()}
        stroke={position.stroke_color}
        strokeWidth={getStrokeWidth()}
        opacity={position.is_visible ? (isDragging ? 0.8 : 1) : 0.3}
        shadowColor="black"
        shadowBlur={isSelected ? 10 : 0}
        shadowOpacity={0.3}
      />
      
      {/* Boat index/name label */}
      {boat && (
        <Text
          text={boat.name || `#${boat.index}`}
          fontSize={Math.min(position.width / 4, 14)}
          fontFamily="Arial"
          fill="white"
          align="center"
          verticalAlign="middle"
          width={position.width}
          height={position.height}
          offsetX={position.width / 2}
          offsetY={position.height / 2}
          listening={false}
        />
      )}
      
      {/* Selection indicator */}
      {isSelected && (
        <Ellipse
          width={position.width + 10}
          height={position.height + 10}
          stroke="#3B82F6"
          strokeWidth={2}
          dash={[5, 5]}
          offsetX={5}
          offsetY={5}
          listening={false}
        />
      )}
    </Group>
  );
};

