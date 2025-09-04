// frontend/src/tests/components/common/FileUpload.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FileUpload } from '../../../components/common/FileUpload';

describe('FileUpload', () => {
  const mockOnFileSelect = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders upload area', () => {
    render(<FileUpload onFileSelect={mockOnFileSelect} />);
    
    expect(screen.getByText(/click to upload/i)).toBeInTheDocument();
    expect(screen.getByText(/drag and drop/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /choose file/i })).toBeInTheDocument();
  });

  it('accepts valid file types', async () => {
    const user = userEvent.setup();
    render(
      <FileUpload 
        onFileSelect={mockOnFileSelect}
        acceptedTypes={['image/jpeg', 'image/png']}
      />
    );
    
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const input = screen.getByRole('button').closest('div')?.querySelector('input[type="file"]');
    
    if (input) {
      await user.upload(input, file);
      expect(mockOnFileSelect).toHaveBeenCalledWith(file);
    }
  });

  it('rejects invalid file types', async () => {
    const user = userEvent.setup();
    render(
      <FileUpload 
        onFileSelect={mockOnFileSelect}
        acceptedTypes={['image/jpeg']}
      />
    );
    
    const file = new File(['test'], 'test.txt', { type: 'text/plain' });
    const input = screen.getByRole('button').closest('div')?.querySelector('input[type="file"]');
    
    if (input) {
      await user.upload(input, file);
      expect(mockOnFileSelect).not.toHaveBeenCalled();
      expect(screen.getByText(/file type text\/plain is not supported/i)).toBeInTheDocument();
    }
  });

  it('rejects files exceeding size limit', async () => {
    const user = userEvent.setup();
    const maxSize = 1024; // 1KB
    
    render(
      <FileUpload 
        onFileSelect={mockOnFileSelect}
        maxSize={maxSize}
      />
    );
    
    // Create file larger than limit
    const largeContent = 'x'.repeat(maxSize + 1);
    const file = new File([largeContent], 'large.jpg', { type: 'image/jpeg' });
    
    const input = screen.getByRole('button').closest('div')?.querySelector('input[type="file"]');
    
    if (input) {
      await user.upload(input, file);
      expect(mockOnFileSelect).not.toHaveBeenCalled();
      expect(screen.getByText(/file size must be less than/i)).toBeInTheDocument();
    }
  });

  it('handles drag and drop', async () => {
    render(<FileUpload onFileSelect={mockOnFileSelect} />);
    
    const dropZone = screen.getByText(/click to upload/i).closest('div');
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    
    if (dropZone) {
      // Simulate drag over
      fireEvent.dragOver(dropZone);
      // Should add drag over styling classes
      
      // Simulate drop
      fireEvent.drop(dropZone, {
        dataTransfer: {
          files: [file],
        },
      });
      
      expect(mockOnFileSelect).toHaveBeenCalledWith(file);
    }
  });

  it('disables interaction when disabled', () => {
    render(<FileUpload onFileSelect={mockOnFileSelect} disabled />);
    
    const button = screen.getByRole('button', { name: /choose file/i });
    expect(button).toBeDisabled();
  });
});