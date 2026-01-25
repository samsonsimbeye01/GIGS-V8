import React from 'react';
import { LiveDataProvider } from './LiveDataProvider';
import PolicyCompliantMainApp from './PolicyCompliantMainApp';
import ErrorBoundary from './ErrorBoundary';

const AppLayout: React.FC = () => {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background">
        <LiveDataProvider>
          <PolicyCompliantMainApp />
        </LiveDataProvider>
      </div>
    </ErrorBoundary>
  );
};

export default AppLayout;