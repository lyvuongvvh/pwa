import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  onSnapshot,
  collection,
  getDocs,
} from 'firebase/firestore';
import { auth, db, googleProvider, handleFirestoreError, OperationType } from '../firebase';
import { UserProfile, UserRole } from '../types';

interface AuthContextValue {
  user: User | null;
  userProfile: UserProfile | null;
  role: UserRole;
  isAdmin: boolean;
  isEditor: boolean;
  isViewer: boolean;
  loading: boolean;
  allUsers: UserProfile[];
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
  setUserRole: (targetUid: string, role: UserRole) => Promise<void>;
  demoRoleOverride: UserRole | null;
  setDemoRoleOverride: (role: UserRole | null) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [demoRoleOverride, setDemoRoleOverride] = useState<UserRole | null>(null);
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        setUserProfile(null);
        setLoading(false);
        return;
      }

      const userDocRef = doc(db, 'users', currentUser.uid);
      try {
        const snap = await getDoc(userDocRef);
        const isBootstrapAdmin = currentUser.email?.toLowerCase() === 'lyvuong@viethoc.com';

        if (!snap.exists()) {
          const initialRole: UserRole = isBootstrapAdmin ? 'admin' : 'viewer';
          const newProfile: UserProfile = {
            uid: currentUser.uid,
            email: currentUser.email || '',
            displayName: currentUser.displayName || currentUser.email?.split('@')[0] || 'User',
            photoURL: currentUser.photoURL || '',
            role: initialRole,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          await setDoc(userDocRef, newProfile);
          setUserProfile(newProfile);

          if (isBootstrapAdmin) {
            try {
              await setDoc(doc(db, 'admins', currentUser.uid), {
                email: currentUser.email,
                role: 'admin',
                addedAt: new Date().toISOString(),
              });
            } catch {
              // Ignore if already set
            }
          }
        } else {
          const data = snap.data() as UserProfile;
          if (isBootstrapAdmin && data.role !== 'admin') {
            await updateDoc(userDocRef, { role: 'admin', updatedAt: new Date().toISOString() });
            setUserProfile({ ...data, role: 'admin' });
          } else {
            setUserProfile(data);
          }
        }
      } catch (err) {
        console.error('Error fetching/syncing user profile:', err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Listen for real-time role updates on user profile
  useEffect(() => {
    if (!user) return;
    const userDocRef = doc(db, 'users', user.uid);
    const unsub = onSnapshot(
      userDocRef,
      (docSnap) => {
        if (docSnap.exists()) {
          setUserProfile(docSnap.data() as UserProfile);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, `users/${user.uid}`);
      }
    );
    return () => unsub();
  }, [user]);

  // Fetch all users if current user is admin
  useEffect(() => {
    const effectiveRole = demoRoleOverride || userProfile?.role || 'viewer';
    if (effectiveRole !== 'admin') return;

    const fetchUsers = async () => {
      try {
        const snap = await getDocs(collection(db, 'users'));
        const users: UserProfile[] = [];
        snap.forEach((d) => users.push(d.data() as UserProfile));
        setAllUsers(users);
      } catch (error) {
        console.warn('Could not list all users directly:', error);
      }
    };
    fetchUsers();
  }, [userProfile, demoRoleOverride]);

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error('Sign in error:', err);
    }
  };

  const signOutUser = async () => {
    try {
      await signOut(auth);
      setDemoRoleOverride(null);
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  const setUserRole = async (targetUid: string, role: UserRole) => {
    try {
      const targetRef = doc(db, 'users', targetUid);
      await updateDoc(targetRef, {
        role,
        updatedAt: new Date().toISOString(),
      });
      if (role === 'admin') {
        await setDoc(doc(db, 'admins', targetUid), {
          role: 'admin',
          addedAt: new Date().toISOString(),
        });
      }
      setAllUsers((prev) =>
        prev.map((u) => (u.uid === targetUid ? { ...u, role } : u))
      );
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `users/${targetUid}`);
    }
  };

  const effectiveRole: UserRole = demoRoleOverride || userProfile?.role || (user ? 'viewer' : 'viewer');
  const isAdmin = effectiveRole === 'admin';
  const isEditor = effectiveRole === 'editor' || isAdmin;
  const isViewer = true; // All authenticated & public users have viewer capabilities

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        role: effectiveRole,
        isAdmin,
        isEditor,
        isViewer,
        loading,
        allUsers,
        signInWithGoogle,
        signOutUser,
        setUserRole,
        demoRoleOverride,
        setDemoRoleOverride,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
