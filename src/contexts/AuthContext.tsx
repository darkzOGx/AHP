'use client';

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import {
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  OAuthProvider,
  signOut,
  User as FirebaseUser,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import type { AppUser, UserProfile } from '@/lib/types';

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithApple: () => Promise<void>;
  signupWithEmailAndPassword: (displayName: string, email: string, password: string, plan?: string, firstName?: string, lastName?: string) => Promise<void>;
  loginWithEmailAndPassword: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [pendingUserData, setPendingUserData] = useState<{firstName?: string, lastName?: string} | null>(null);

  useEffect(() => {
    // Skip Firebase auth setup if configuration is incomplete
    if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 
        !process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 
        !process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
      console.warn('Firebase auth disabled due to incomplete configuration');
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userRef = doc(db, 'users', firebaseUser.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const userProfile = userSnap.data() as UserProfile;
          setUser({ ...firebaseUser, ...userProfile });
        } else {
          // This case is hit for new Google sign-ins and new email sign-ups.
          // For email sign-up, the displayName is set via updateProfile() before this listener runs.
          // For manual email signup, use provided first/last names; for Google/Apple auth, extract from displayName
          let firstName = null;
          let lastName = null;

          if (pendingUserData) {
            // Manual email signup with provided first/last names
            firstName = pendingUserData.firstName || null;
            lastName = pendingUserData.lastName || null;
            setPendingUserData(null); // Clear pending data
          } else {
            // Google/Apple auth, try to extract first/last names from displayName
            const extractNames = (displayName: string | null) => {
              if (!displayName) return { firstName: null, lastName: null };
              const parts = displayName.trim().split(' ');
              return {
                firstName: parts[0] || null,
                lastName: parts.slice(1).join(' ') || null
              };
            };
            const extracted = extractNames(firebaseUser.displayName);
            firstName = extracted.firstName;
            lastName = extracted.lastName;
          }

          const newUserProfile: UserProfile = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            firstName,
            lastName,
            photoURL: firebaseUser.photoURL,
            alertPreferences: { email: true, sms: false, disableAll: false },
          };
          await setDoc(userRef, newUserProfile);
          setUser({ ...firebaseUser, ...newUserProfile });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error during Google sign-in:", error);
      throw error;
    }
  };

  const loginWithApple = async () => {
    const provider = new OAuthProvider('apple.com');
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error during Apple sign-in:", error);
      throw error;
    }
  };

  const signupWithEmailAndPassword = async (displayName: string, email: string, password: string, plan?: string, firstName?: string, lastName?: string) => {
    try {
      // Store first/last names for the auth state listener to use
      if (firstName && lastName) {
        setPendingUserData({ firstName, lastName });
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // The onAuthStateChanged listener will handle creating the Firestore doc,
      // but we need to update the Firebase Auth profile with the display name first.
      if (userCredential.user) {
        await updateProfile(userCredential.user, { displayName });
        
        // Send welcome email after successful account creation (if plan is provided)
        if (plan) {
          try {
            await fetch('/api/send-welcome-email', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email: userCredential.user.email,
                name: displayName,
                plan: plan
              }),
            });
            console.log('✅ Welcome email sent to:', userCredential.user.email, 'for plan:', plan);
          } catch (emailError) {
            console.error('❌ Failed to send welcome email:', emailError);
            // Don't throw - signup should still succeed even if email fails
          }
        }
        
        // The listener will now have access to the correct display name when it creates the Firestore doc.
      }
    } catch (error) {
      console.error('Error during email/password sign-up:', error);
      throw error; // Re-throw to be caught in the UI form
    }
  };

  const loginWithEmailAndPassword = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Error during email/password sign-in:', error);
      throw error; // Re-throw to be caught in the UI form
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginWithGoogle, loginWithApple, logout, signupWithEmailAndPassword, loginWithEmailAndPassword }}>
      {children}
    </AuthContext.Provider>
  );
};
