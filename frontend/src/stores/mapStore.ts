// frontend/src/stores/mapStore.ts
import { create } from 'zustand';
import { Map, MapWithBoats } from '../types/map';
import { BoatPosition, BoatWithPosition } from '../types/boat';
import { MapService, PositionService } from '../services';

interface MapState {
  // Data
  maps: Map[];
  currentMap: MapWithBoats | null;
  selectedMapId: number | null;
  
  // UI State
  isLoading: boolean;
  error: string | null;
  
  // Actions
  loadMaps: () => Promise<void>;
  loadMap: (mapId: number) => Promise<void>;
  setCurrentMap: (mapId: number) => void;
  createPosition: (positionData: Omit<BoatPosition, 'id' | 'created_at' | 'updated_at'>) => Promise<BoatPosition>;
  updatePosition: (positionId: number, updates: Partial<BoatPosition>) => Promise<void>;
  deletePosition: (positionId: number) => Promise<void>;
  clearError: () => void;
}

export const useMapStore = create<MapState>((set, get) => ({
  // Initial state
  maps: [],
  currentMap: null,
  selectedMapId: null,
  isLoading: false,
  error: null,

  loadMaps: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const maps = await MapService.getMaps({ active_only: true });
      set({ maps, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to load maps',
        isLoading: false 
      });
    }
  },

  loadMap: async (mapId: number) => {
    set({ isLoading: true, error: null });
    
    try {
      const mapWithBoats = await MapService.getMapWithBoats(mapId);
      set({ 
        currentMap: mapWithBoats,
        selectedMapId: mapId,
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to load map',
        isLoading: false 
      });
    }
  },

  setCurrentMap: (mapId: number) => {
    const { loadMap } = get();
    loadMap(mapId);
  },

  createPosition: async (positionData) => {
    const { currentMap } = get();
    
    try {
      const newPosition = await PositionService.createPosition({
        ...positionData,
        map_id: currentMap!.map.id
      });
      
      // Update local state
      if (currentMap) {
        const newBoatWithPosition: BoatWithPosition = {
          boat: undefined,
          position: newPosition
        };
        
        const updatedMap = {
          ...currentMap,
          boats: [...currentMap.boats, newBoatWithPosition]
        };
        
        set({ currentMap: updatedMap });
      }
      
      return newPosition;
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to create position' });
      throw error;
    }
  },

  updatePosition: async (positionId: number, updates: Partial<BoatPosition>) => {
    const { currentMap } = get();
    
    try {
      await PositionService.updatePosition(positionId, updates);
      
      // Update local state
      if (currentMap) {
        const updatedBoats = currentMap.boats.map(boatWithPos => {
          if (boatWithPos.position.id === positionId) {
            return {
              ...boatWithPos,
              position: { ...boatWithPos.position, ...updates }
            };
          }
          return boatWithPos;
        });
        
        set({ 
          currentMap: { 
            ...currentMap, 
            boats: updatedBoats 
          }
        });
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to update position' });
      throw error;
    }
  },

  deletePosition: async (positionId: number) => {
    const { currentMap } = get();
    
    try {
      await PositionService.deletePosition(positionId);
      
      // Update local state
      if (currentMap) {
        const updatedBoats = currentMap.boats.filter(
          boatWithPos => boatWithPos.position.id !== positionId
        );
        
        set({ 
          currentMap: { 
            ...currentMap, 
            boats: updatedBoats 
          }
        });
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to delete position' });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));

