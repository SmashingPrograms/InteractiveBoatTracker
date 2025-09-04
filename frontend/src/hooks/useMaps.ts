// frontend/src/hooks/useMaps.ts (Updated with additional mutations)
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MapService } from '../services/maps';
import { MapCreate, MapUpdate } from '../types/map';

export const useMaps = () => {
  return useQuery({
    queryKey: ['maps'],
    queryFn: () => MapService.getMaps({ active_only: true }),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

export const useMap = (id: number) => {
  return useQuery({
    queryKey: ['map', id],
    queryFn: () => MapService.getMap(id),
    enabled: !!id,
  });
};

export const useMapWithBoats = (id: number) => {
  return useQuery({
    queryKey: ['mapWithBoats', id],
    queryFn: () => MapService.getMapWithBoats(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 2, // 2 minutes (shorter for real-time data)
  });
};

export const useCreateMap = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (mapData: MapCreate) => MapService.createMap(mapData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maps'] });
    },
  });
};

export const useUpdateMap = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: MapUpdate }) => 
      MapService.updateMap(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['map', id] });
      queryClient.invalidateQueries({ queryKey: ['maps'] });
      queryClient.invalidateQueries({ queryKey: ['mapWithBoats', id] });
    },
  });
};

export const useDeleteMap = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => MapService.deleteMap(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maps'] });
    },
  });
};