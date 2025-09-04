// frontend/src/tests/components/map/MapCard.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MapCard } from '../../../components/map/MapCard';
import { useMapStore } from '../../../stores/mapStore';
import { useUIStore } from '../../../stores/uiStore';
import { useAuth } from '../../../hooks/useAuth';
import { Map } from '../../../types/map';

vi.mock('../../../stores/mapStore');
vi.mock('../../../stores/uiStore');
vi.mock('../../../hooks/useAuth');
vi.mock('../../../hooks/useMaps');

const mockMap: Map = {
  id: 1,
  name: 'Test Marina',
  description: 'Test description',
  image_path: 'test-map.jpg',
  image_width: 800,
  image_height: 600,
  is_active: true,
  created_at: '2024-01-01T00:00:00Z',
  boat_count: 5,
};

describe('MapCard', () => {
  const mockSetCurrentMap = vi.fn();
  const mockShowConfirm = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    
    vi.mocked(useMapStore).mockReturnValue({
      selectedMapId: null,
      setCurrentMap: mockSetCurrentMap,
    } as any);
    
    vi.mocked(useUIStore).mockReturnValue({
      showConfirm: mockShowConfirm,
    } as any);
    
    vi.mocked(useAuth).mockReturnValue({
      isAdmin: true,
    } as any);
  });

  it('renders map information correctly', () => {
    render(<MapCard map={mockMap} />);
    
    expect(screen.getByText('Test Marina')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
    expect(screen.getByText('5 boats')).toBeInTheDocument();
    expect(screen.getByText('800 × 600')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('shows selected state correctly', () => {
    vi.mocked(useMapStore).mockReturnValue({
      selectedMapId: 1,
      setCurrentMap: mockSetCurrentMap,
    } as any);
    
    render(<MapCard map={mockMap} />);
    
    expect(screen.getByText('Current')).toBeInTheDocument();
    expect(screen.getByText('Current Map')).toBeInTheDocument();
  });

  it('handles map selection', async () => {
    const user = userEvent.setup();
    
    // Mock window.history.back
    Object.defineProperty(window, 'history', {
      value: { back: vi.fn() },
      writable: true
    });
    
    render(<MapCard map={mockMap} />);
    
    await user.click(screen.getByText('Select Map'));
    
    expect(mockSetCurrentMap).toHaveBeenCalledWith(1);
    expect(window.history.back).toHaveBeenCalled();
  });

  it('shows admin controls for admin users', () => {
    render(<MapCard map={mockMap} />);
    
    expect(screen.getByTitle('Edit map')).toBeInTheDocument();
    expect(screen.getByTitle('Delete map')).toBeInTheDocument();
  });

  it('hides admin controls for non-admin users', () => {
    vi.mocked(useAuth).mockReturnValue({
      isAdmin: false,
    } as any);
    
    render(<MapCard map={mockMap} />);
    
    expect(screen.queryByTitle('Edit map')).not.toBeInTheDocument();
    expect(screen.queryByTitle('Delete map')).not.toBeInTheDocument();
  });

  it('handles delete confirmation', async () => {
    const user = userEvent.setup();
    render(<MapCard map={mockMap} />);
    
    await user.click(screen.getByTitle('Delete map'));
    
    expect(mockShowConfirm).toHaveBeenCalledWith({
      title: 'Delete Map',
      message: 'Are you sure you want to delete "Test Marina"? This will also delete all boat positions on this map.',
      onConfirm: expect.any(Function),
      onCancel: expect.any(Function),
    });
  });

  it('shows inactive status correctly', () => {
    const inactiveMap = { ...mockMap, is_active: false };
    render(<MapCard map={inactiveMap} />);
    
    expect(screen.getByText('Inactive')).toBeInTheDocument();
  });
});