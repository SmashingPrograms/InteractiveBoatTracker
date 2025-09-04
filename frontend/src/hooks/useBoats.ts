// frontend/src/hooks/useBoats.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BoatService } from '../services/boats';
import { BoatListing, BoatListingCreate, BoatListingUpdate, BoatSearchParams } from '../types/boat';

export const useBoats = (params?: BoatSearchParams) => {
  return useQuery({
    queryKey: ['boats', params],
    queryFn: () => BoatService.getBoats(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useBoat = (id: number) => {
  return useQuery({
    queryKey: ['boat', id],
    queryFn: () => BoatService.getBoat(id),
    enabled: !!id,
  });
};

export const useCreateBoat = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (boatData: BoatListingCreate) => BoatService.createBoat(boatData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boats'] });
    },
  });
};

export const useUpdateBoat = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: BoatListingUpdate }) => 
      BoatService.updateBoat(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['boat', id] });
      queryClient.invalidateQueries({ queryKey: ['boats'] });
    },
  });
};

export const useDeleteBoat = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => BoatService.deleteBoat(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boats'] });
    },
  });
};

export const useAssignBoat = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ boatId, positionId }: { boatId: number; positionId: number }) =>
      BoatService.assignBoatToPosition(boatId, positionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boats'] });
      queryClient.invalidateQueries({ queryKey: ['maps'] });
    },
  });
};

