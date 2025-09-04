// frontend/src/tests/components/map/MapManagementPage.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MapManagementPage } from '../../../components/map/MapManagementPage';
import * as mapsHooks from '../../../hooks/useMaps';
import { useAuth } from '../../../hooks/useAuth';
import { useUIStore } from '../../../stores/uiStore';

vi.mock('../../../hooks/useMaps');
vi.mock('../../../hooks/useAuth');
vi.mock('../../../stores/uiStore');

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

const renderWithProviders = (component: React.ReactElement) => {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      {component}
    </QueryClientProvider>
  );
};

describe('MapManagementPage', () => {
  const mockShowMapFormModal = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    
    vi.mocked(useAuth).mockReturnValue({
      isAdmin: true,
    } as any);
    
    vi.mocked(useUIStore).mockReturnValue({
      showMapFormModal: mockShowMapFormModal,
    } as any);
  });

  it('renders loading state', () => {
    vi.mocked(mapsHooks.useMaps).mockReturnValue({
      data: [],
      isLoading: true,
      error: null,
    } as any);
    
    renderWithProviders(<MapManagementPage />);
    
    expect(screen.getByRole('status')).toBeInTheDocument(); // Loading spinner
  });

  it('renders error state', () => {
    vi.mocked(mapsHooks.useMaps).mockReturnValue({
      data: [],
      isLoading: false,
      error: new Error('Failed to load'),
    } as any);
    
    renderWithProviders(<MapManagementPage />);
    
    expect(screen.getByText('Failed to load maps')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
  });

  it('renders empty state for admin', () => {
    vi.mocked(mapsHooks.useMaps).mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    } as any);
    
    renderWithProviders(<MapManagementPage />);
    
    expect(screen.getByText('No maps found')).toBeInTheDocument();
    expect(screen.getByText('Get started by creating your first marina map')).toBeInTheDocument();
    expect(screen.getByText('Create Your First Map')).toBeInTheDocument();
  });

  it('renders empty state for non-admin', () => {
    vi.mocked(useAuth).mockReturnValue({
      isAdmin: false,
    } as any);
    
    vi.mocked(mapsHooks.useMaps).mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    } as any);
    
    renderWithProviders(<MapManagementPage />);
    
    expect(screen.getByText('No maps have been created yet')).toBeInTheDocument();
    expect(screen.queryByText('Create Your First Map')).not.toBeInTheDocument();
  });

  it('renders maps grid', () => {
    const mockMaps = [
      {
        id: 1,
        name: 'Marina 1',
        description: 'First marina',
        image_path: 'marina1.jpg',
        image_width: 800,
        image_height: 600,
        is_active: true,
        created_at: '2024-01-01T00:00:00Z',
        boat_count: 3,
      },
      {
        id: 2,
        name: 'Marina 2',
        description: 'Second marina',
        image_path: 'marina2.jpg',
        image_width: 1000,
        image_height: 800,
        is_active: true,
        created_at: '2024-01-02T00:00:00Z',
        boat_count: 7,
      },
    ];
    
    vi.mocked(mapsHooks.useMaps).mockReturnValue({
      data: mockMaps,
      isLoading: false,
      error: null,
    } as any);
    
    renderWithProviders(<MapManagementPage />);
    
    expect(screen.getByText('Marina Maps')).toBeInTheDocument();
    expect(screen.getByText('Marina 1')).toBeInTheDocument();
    expect(screen.getByText('Marina 2')).toBeInTheDocument();
  });

  it('shows add button for admin', () => {
    vi.mocked(mapsHooks.useMaps).mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    } as any);
    
    renderWithProviders(<MapManagementPage />);
    
    expect(screen.getByRole('button', { name: /add new map/i })).toBeInTheDocument();
  });

  it('hides add button for non-admin', () => {
    vi.mocked(useAuth).mockReturnValue({
      isAdmin: false,
    } as any);
    
    vi.mocked(mapsHooks.useMaps).mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    } as any);
    
    renderWithProviders(<MapManagementPage />);
    
    expect(screen.queryByRole('button', { name: /add new map/i })).not.toBeInTheDocument();
  });

  it('opens map form modal', async () => {
    const user = userEvent.setup();
    
    vi.mocked(mapsHooks.useMaps).mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    } as any);
    
    renderWithProviders(<MapManagementPage />);
    
    await user.click(screen.getByRole('button', { name: /add new map/i }));
    
    expect(mockShowMapFormModal).toHaveBeenCalled();
  });
});