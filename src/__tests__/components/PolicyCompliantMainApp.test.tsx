import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import PolicyCompliantMainApp from '@/components/PolicyCompliantMainApp';
import { LiveDataProvider } from '@/components/LiveDataProvider';

// Mock dependencies
vi.mock('@/contexts/LocationContext', () => ({
  useLocation: () => ({ country: 'Kenya', city: 'Nairobi' })
}));

vi.mock('@/components/SwahiliTranslations', () => ({
  useTranslation: () => ({ t: (key: string) => key })
}));

vi.mock('@/hooks/use-mobile', () => ({
  useIsMobile: () => false
}));

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <LiveDataProvider>
        {component}
      </LiveDataProvider>
    </BrowserRouter>
  );
};

describe('PolicyCompliantMainApp', () => {
  it('renders dashboard by default', () => {
    renderWithProviders(<PolicyCompliantMainApp />);
    expect(screen.getByText('dashboard')).toBeInTheDocument();
  });

  it('displays real-time stats', () => {
    renderWithProviders(<PolicyCompliantMainApp />);
    expect(screen.getByText('Online Users')).toBeInTheDocument();
    expect(screen.getByText('AI Protected')).toBeInTheDocument();
  });

  it('shows auth dialog when user tries to post gig without signing in', async () => {
    renderWithProviders(<PolicyCompliantMainApp />);
    const postButton = screen.getByText('Post a Gig');
    fireEvent.click(postButton);
    await waitFor(() => {
      expect(screen.getByText('Sign In to Linka')).toBeInTheDocument();
    });
  });
});
