import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FirebaseService } from '@/services/firebaseService';

// Mock Firebase
vi.mock('@/lib/firebase', () => ({
  db: {},
  storage: {},
  auth: {}
}));

vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  addDoc: vi.fn(() => Promise.resolve({ id: 'test-id' })),
  getDocs: vi.fn(() => Promise.resolve({ docs: [] })),
  query: vi.fn(),
  where: vi.fn(),
  orderBy: vi.fn(),
  limit: vi.fn(),
  onSnapshot: vi.fn(),
  serverTimestamp: vi.fn(() => new Date()),
  GeoPoint: vi.fn()
}));

describe('FirebaseService', () => {
  it('creates a gig successfully', async () => {
    const gigData = {
      title: 'Test Gig',
      description: 'Test Description',
      category: 'tech',
      budget: 100,
      currency: 'USD',
      location: { address: 'Test', coordinates: {} as any },
      user_id: 'user-1',
      status: 'active' as const
    };
    
    const id = await FirebaseService.createGig(gigData);
    expect(id).toBe('test-id');
  });
});
