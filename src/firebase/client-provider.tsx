'use client';

import React, { useMemo, type ReactNode, useEffect } from 'react';
import { FirebaseProvider, useAuth } from '@/firebase/provider';
import { initializeFirebase } from '@/firebase';
import { initiateAnonymousSignIn } from './non-blocking-login';

interface FirebaseClientProviderProps {
  children: ReactNode;
}

const AuthInitializer = () => {
  const auth = useAuth();
  useEffect(() => {
    initiateAnonymousSignIn(auth);
  }, [auth]);
  return null;
}

export function FirebaseClientProvider({ children }: FirebaseClientProviderProps) {
  const firebaseServices = useMemo(() => {
    // Initialize Firebase on the client side, once per component mount.
    return initializeFirebase();
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <FirebaseProvider
      firebaseApp={firebaseServices.firebaseApp}
      auth={firebaseServices.auth}
      firestore={firebaseServices.firestore}
    >
      <AuthInitializer />
      {children}
    </FirebaseProvider>
  );
}
