import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  onSnapshot,
  serverTimestamp,
  GeoPoint
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';

export interface FirebaseGig {
  id?: string;
  title: string;
  description: string;
  category: string;
  budget: number;
  currency: string;
  location: {
    address: string;
    coordinates: GeoPoint;
  };
  user_id: string;
  status: 'active' | 'completed' | 'cancelled';
  created_at: unknown;
  updated_at: unknown;
}

export class FirebaseService {
  // Gigs
  static async createGig(gigData: Omit<FirebaseGig, 'id' | 'created_at' | 'updated_at'>) {
    const docRef = await addDoc(collection(db, 'gigs'), {
      ...gigData,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp()
    });
    return docRef.id;
  }

  static async getGigs(userId?: string) {
    let q = query(collection(db, 'gigs'), orderBy('created_at', 'desc'));
    
    if (userId) {
      q = query(collection(db, 'gigs'), where('user_id', '==', userId), orderBy('created_at', 'desc'));
    }
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  static subscribeToGigs(callback: (gigs: Array<Record<string, unknown>>) => void, userId?: string) {
    let q = query(collection(db, 'gigs'), orderBy('created_at', 'desc'), limit(50));
    
    if (userId) {
      q = query(collection(db, 'gigs'), where('user_id', '==', userId), orderBy('created_at', 'desc'));
    }

    return onSnapshot(q, (snapshot) => {
      const gigs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Array<Record<string, unknown>>;
      callback(gigs);
    });
  }

  static async updateGig(gigId: string, updates: Partial<FirebaseGig>) {
    const docRef = doc(db, 'gigs', gigId);
    await updateDoc(docRef, {
      ...updates,
      updated_at: serverTimestamp()
    });
  }

  static async deleteGig(gigId: string) {
    await deleteDoc(doc(db, 'gigs', gigId));
  }

  // File uploads
  static async uploadFile(file: File, path: string) {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    return await getDownloadURL(snapshot.ref);
  }

  static async deleteFile(path: string) {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
  }

  // Messages
  static subscribeToMessages(conversationId: string, callback: (messages: Array<Record<string, unknown>>) => void) {
    const q = query(
      collection(db, 'messages'),
      where('conversation_id', '==', conversationId),
      orderBy('created_at', 'asc')
    );

    return onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Array<Record<string, unknown>>;
      callback(messages);
    });
  }

  static async sendMessage(messageData: Record<string, unknown>) {
    return await addDoc(collection(db, 'messages'), {
      ...messageData,
      created_at: serverTimestamp()
    });
  }
}
