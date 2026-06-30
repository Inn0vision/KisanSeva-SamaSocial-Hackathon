import { create } from 'zustand';
import { type User, onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

export interface UserProfile {
  name: string;
  city: string;
  state: string;
  mainCrop?: string;
  landSize?: string;
  setupComplete: boolean;
}

interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  initialized: boolean;
  setAuthData: (user: User | null, profile: UserProfile | null) => void;
  logout: () => Promise<void>;
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>;
  init: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  loading: true,
  initialized: false,

  setAuthData: (user, profile) => set({ user, profile, loading: false }),

  logout: async () => {
    await signOut(auth);
    set({ user: null, profile: null });
  },

  updateProfile: async (updates) => {
    const { user, profile } = get();
    if (!user) return;
    
    const newProfile = { ...profile, ...updates } as UserProfile;
    
    // Ensure setupComplete is true if name, city, state, mainCrop, and landSize are provided
    if (newProfile.name && newProfile.city && newProfile.state && newProfile.mainCrop && newProfile.landSize) {
      newProfile.setupComplete = true;
    }

    await setDoc(doc(db, 'users', user.uid), newProfile, { merge: true });
    set({ profile: newProfile });
  },

  init: () => {
    if (get().initialized) return;
    set({ initialized: true });

    onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Fetch profile
        try {
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            set({ user, profile: docSnap.data() as UserProfile, loading: false });
          } else {
            // New user, no profile yet
            set({ user, profile: null, loading: false });
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
          set({ user, profile: null, loading: false });
        }
      } else {
        set({ user: null, profile: null, loading: false });
      }
    });
  }
}));
