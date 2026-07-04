'use client';

import { useState, useEffect } from 'react';
import { usePB } from './provider';
import { RecordModel } from 'pocketbase';

export interface UseDocResult<T = RecordModel> {
  data: (T & { id: string }) | null;
  isLoading: boolean;
  error: Error | null;
}

/**
 * React hook za dohvat jednog dokumenta iz PocketBase-a po ID-u.
 * 
 * @param collectionName - Ime kolekcije
 * @param recordId - ID dokumenta
 */
export function useDoc<T = RecordModel>(
  collectionName: string | null | undefined,
  recordId: string | null | undefined
): UseDocResult<T> {
  const pb = usePB();
  const [data, setData] = useState<(T & { id: string }) | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!collectionName || !recordId || !pb) {
      setData(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const record = await pb.collection(collectionName).getOne(recordId);
        setData({ ...(record as unknown as T), id: record.id } as T & { id: string });
      } catch (e) {
        setError(e instanceof Error ? e : new Error('Failed to fetch record'));
        setData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [pb, collectionName, recordId]);

  return { data, isLoading, error };
}
