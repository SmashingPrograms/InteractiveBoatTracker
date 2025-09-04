// frontend/src/tests/hooks/useMaps.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useMaps, useCreateMap, useDeleteMap } from '../../hooks/useMaps';
import * as MapService from '../../services/maps';

vi.mock('../../services/maps');

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useMaps', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches maps successfully', async () => {
    const mockMaps = [
      {
        id: 1,
        name: 'Test Marina',
        description: 'Test description',
        image_path: 'test.jpg',
        image_width: 800,
        image_height: 600,
        is_active: true,
        created_at: '2024-01-01T00:00:00Z',
        boat_count: 5,
      },
    ];

    vi.mocked(MapService.MapService.getMaps).mockResolvedValue(mockMaps);

    const { result } = renderHook(() => useMaps(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockMaps);
    expect(MapService.MapService.getMaps).toHaveBeenCalledWith({ active_only: true });
  });

  it('handles error when fetching maps', async () => {
    const error = new Error('Failed to fetch maps');
    vi.mocked(MapService.MapService.getMaps).mockRejectedValue(error);

    const { result } = renderHook(() => useMaps(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toEqual(error);
  });
});

describe('useCreateMap', () => {
  it('creates map successfully', async () => {
    const newMap = {
      name: 'New Marina',
      description: 'New description',
      image_path: 'new.jpg',
      image_width: 800,
      image_height: 600,
      is_active: true,
    };

    const createdMap = { id: 2, ...newMap, created_at: '2024-01-01T00:00:00Z' };
    vi.mocked(MapService.MapService.createMap).mockResolvedValue(createdMap);

    const { result } = renderHook(() => useCreateMap(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      result.current.mutate(newMap);
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(MapService.MapService.createMap).toHaveBeenCalledWith(newMap);
  });
});

describe('useDeleteMap', () => {
  it('deletes map successfully', async () => {
    vi.mocked(MapService.MapService.deleteMap).mockResolvedValue({ message: 'Map deleted' });

    const { result } = renderHook(() => useDeleteMap(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      result.current.mutate(1);
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(MapService.MapService.deleteMap).toHaveBeenCalledWith(1);
  });
});


