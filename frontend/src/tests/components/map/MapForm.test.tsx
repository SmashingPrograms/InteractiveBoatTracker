// frontend/src/tests/components/map/MapForm.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MapForm } from '../../../components/map/MapForm';
import { useUIStore } from '../../../stores/uiStore';
import * as mapsHooks from '../../../hooks/useMaps';

// Mock the hooks
vi.mock('../../../hooks/useMaps');
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

describe('MapForm', () => {
  const mockCreateMap = vi.fn();
  const mockUpdateMap = vi.fn();
  const mockHideModal = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    
    vi.mocked(useUIStore).mockReturnValue({
      showMapForm: true,
      hideMapFormModal: mockHideModal,
    } as any);

    vi.mocked(mapsHooks.useCreateMap).mockReturnValue({
      mutateAsync: mockCreateMap,
      isPending: false,
    } as any);

    vi.mocked(mapsHooks.useUpdateMap).mockReturnValue({
      mutateAsync: mockUpdateMap,
      isPending: false,
    } as any);
  });

  it('renders create form correctly', () => {
    renderWithProviders(<MapForm />);
    
    expect(screen.getByText('Add New Map')).toBeInTheDocument();
    expect(screen.getByLabelText(/map name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByText(/marina layout image/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create map/i })).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    const user = userEvent.setup();
    renderWithProviders(<MapForm />);
    
    const submitButton = screen.getByRole('button', { name: /create map/i });
    await user.click(submitButton);
    
    expect(screen.getByText('Map name is required')).toBeInTheDocument();
    expect(screen.getByText('Map image is required')).toBeInTheDocument();
    expect(mockCreateMap).not.toHaveBeenCalled();
  });

  it('submits form with valid data', async () => {
    const user = userEvent.setup();
    mockCreateMap.mockResolvedValue({});
    
    renderWithProviders(<MapForm />);
    
    // Fill in form
    await user.type(screen.getByLabelText(/map name/i), 'Test Marina');
    await user.type(screen.getByLabelText(/description/i), 'Test description');
    await user.type(screen.getByLabelText(/width/i), '800');
    await user.type(screen.getByLabelText(/height/i), '600');
    
    // Mock file upload
    const fileInput = screen.getByRole('button', { name: /choose file/i }).closest('div')?.querySelector('input[type="file"]');
    const file = new File(['test'], 'test-map.jpg', { type: 'image/jpeg' });
    
    if (fileInput) {
      await user.upload(fileInput, file);
    }
    
    // Submit form
    await user.click(screen.getByRole('button', { name: /create map/i }));
    
    await waitFor(() => {
      expect(mockCreateMap).toHaveBeenCalledWith({
        name: 'Test Marina',
        description: 'Test description',
        image_path: 'test-map.jpg',
        image_width: 800,
        image_height: 600,
        is_active: true,
      });
    });
    
    expect(mockHideModal).toHaveBeenCalled();
  });

  it('validates image dimensions', async () => {
    const user = userEvent.setup();
    renderWithProviders(<MapForm />);
    
    await user.type(screen.getByLabelText(/map name/i), 'Test');
    await user.clear(screen.getByLabelText(/width/i));
    await user.type(screen.getByLabelText(/width/i), '0');
    
    await user.click(screen.getByRole('button', { name: /create map/i }));
    
    expect(screen.getByText('Width must be greater than 0')).toBeInTheDocument();
  });

  it('shows loading state during submission', async () => {
    const user = userEvent.setup();
    
    vi.mocked(mapsHooks.useCreateMap).mockReturnValue({
      mutateAsync: mockCreateMap,
      isPending: true,
    } as any);
    
    renderWithProviders(<MapForm />);
    
    expect(screen.getByRole('button', { name: /create map/i })).toBeDisabled();
    expect(screen.getByLabelText(/map name/i)).toBeDisabled();
  });
});