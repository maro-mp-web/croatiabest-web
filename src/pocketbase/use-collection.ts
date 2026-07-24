'use client';

import { useState, useEffect } from 'react';
import { usePB } from './provider';
import { RecordModel } from 'pocketbase';

export interface UseCollectionResult<T = RecordModel> {
  data: T[] | null;
  isLoading: boolean;
  error: Error | null;
}

/**
 * React hook za dohvat kolekcije iz PocketBase-a.
 * Podržava real-time subscribe (opcionalno).
 * 
 * @param collectionName - Ime kolekcije u PocketBase
 * @param options - Opcionalni filter, sort, expand, itd.
 * @param subscribe - Ako je true, prati promjene u real-time (default: false)
 */
export function useCollection<T = RecordModel>(
  collectionName: string | null | undefined,
  options?: {
    filter?: string;
    sort?: string;
    expand?: string;
    page?: number;
    perPage?: number;
    requestKey?: string | null;
  },
  subscribe: boolean = false
): UseCollectionResult<T> {
  const pb = usePB();
  const [data, setData] = useState<T[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!collectionName || !pb) {
      setData(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    let unsubscribe: (() => void) | undefined;

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Use getFullList to ensure all records (e.g. 400+) are fetched for maps and lists
        const items = await pb.collection(collectionName).getFullList<T>({
          filter: options?.filter,
          sort: options?.sort !== undefined ? options.sort : '-created',
          expand: options?.expand,
          requestKey: options?.requestKey,
        });
        setData(items);
      } catch (e) {
        setError(e instanceof Error ? e : new Error('Failed to fetch collection'));
        setData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    // Real-time subscribe
    if (subscribe) {
      pb.collection(collectionName).subscribe('*', (e) => {
        // Osvježi podatke na promjenu
        fetchData();
      }).then((unsub) => {
        unsubscribe = unsub;
      });
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [pb, collectionName, options?.filter, options?.sort, options?.expand, options?.page, options?.perPage, options?.requestKey, subscribe]);

  return { data, isLoading, error };
}
