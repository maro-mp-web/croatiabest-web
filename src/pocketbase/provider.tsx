'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { getPocketBase } from './config';
import PocketBase from 'pocketbase';
import { RecordModel } from 'pocketbase';

interface PocketBaseContextState {
  pb: PocketBase | null;
  user: RecordModel | null;
  isUserLoading: boolean;
  userError: Error | null;
}

const PocketBaseContext = createContext<PocketBaseContextState | undefined>(undefined);

export function PocketBaseProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<RecordModel | null>(null);
  const [isUserLoading, setIsUserLoading] = useState(true);
  const [userError, setUserError] = useState<Error | null>(null);
  const [pb, setPb] = useState<PocketBase | null>(null);

  useEffect(() => {
    try {
      const client = getPocketBase();
      setPb(client);

      // Provjeri postojeći auth
      if (client.authStore.isValid) {
        setUser(client.authStore.record);
      }
      setIsUserLoading(false);

      // Prati promjene auth stanja
      const unsubscribe = client.authStore.onChange((token, record) => {
        setUser(record);
        setIsUserLoading(false);
      });

      return () => {
        unsubscribe();
      };
    } catch (e) {
      setUserError(e instanceof Error ? e : new Error('Failed to initialize PocketBase'));
      setIsUserLoading(false);
    }
  }, []);

  const contextValue = useMemo((): PocketBaseContextState => ({
    pb,
    user,
    isUserLoading,
    userError,
  }), [pb, user, isUserLoading, userError]);

  return (
    <PocketBaseContext.Provider value={contextValue}>
      {children}
    </PocketBaseContext.Provider>
  );
}

export function usePocketBase(): PocketBaseContextState {
  const context = useContext(PocketBaseContext);
  if (context === undefined) {
    throw new Error('usePocketBase must be used within a PocketBaseProvider');
  }
  return context;
}

export function usePB(): PocketBase | null {
  const { pb } = usePocketBase();
  return pb;
}

export function useUser() {
  const { user, isUserLoading, userError } = usePocketBase();
  return { user, isUserLoading, userError };
}
