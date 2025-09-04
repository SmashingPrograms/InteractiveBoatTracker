// frontend/src/App.tsx (Updated with routing)
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Layout } from './components/layout/Layout';
import { MapCanvas } from './components/map/MapCanvas';
import { MapManagementPage } from './components/map/MapManagementPage';
import { BoatForm } from './components/boat/BoatForm';
import { ConfirmDialog } from './components/common/ConfirmDialog';
import { useUIStore } from './stores/uiStore';
import './styles/globals.css';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

const AppContent: React.FC = () => {
  const { showConfirmDialog, confirmDialogConfig, hideConfirm, currentPage } = useUIStore();

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'maps':
        return <MapManagementPage />;
      case 'map':
      default:
        return <MapCanvas />;
    }
  };

  return (
    <Layout>
      {renderCurrentPage()}
      
      {/* Global modals */}
      <BoatForm />
      
      {showConfirmDialog && confirmDialogConfig && (
        <ConfirmDialog
          isOpen={showConfirmDialog}
          title={confirmDialogConfig.title}
          message={confirmDialogConfig.message}
          onConfirm={confirmDialogConfig.onConfirm}
          onCancel={confirmDialogConfig.onCancel || hideConfirm}
          variant="danger"
        />
      )}
    </Layout>
  );
};

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ProtectedRoute>
          <AppContent />
        </ProtectedRoute>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;