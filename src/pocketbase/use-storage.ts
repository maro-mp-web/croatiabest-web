'use client';

import { useState } from 'react';
import { usePB } from './provider';

interface UseStorageResult {
  uploadFile: (collectionName: string, recordId: string | undefined, file: File) => Promise<string>;
  isUploading: boolean;
  progress: number;
  error: Error | null;
}

/**
 * Hook za upload datoteka na PocketBase.
 * PocketBase automatski servira uploadane fileove na:
 * /api/files/{collectionName}/{recordId}/{fileName}
 */
export function useStorage(): UseStorageResult {
  const pb = usePB();
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<Error | null>(null);

  const uploadFile = async (
    collectionName: string,
    recordId: string | undefined,
    file: File
  ): Promise<string> => {
    if (!pb) {
      throw new Error('PocketBase not initialized');
    }
    setIsUploading(true);
    setProgress(0);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      if (recordId) {
        // Ažuriraj postojeći record
        const record = await pb.collection(collectionName).update(recordId, formData);
        setIsUploading(false);
        setProgress(100);
        // Vrati URL slike
        const fileUrl = pb.files.getUrl(record, record.file);
        return fileUrl;
      } else {
        // Kreiraj novi record s fileom
        const record = await pb.collection(collectionName).create(formData);
        setIsUploading(false);
        setProgress(100);
        const fileUrl = pb.files.getUrl(record, record.file);
        return fileUrl;
      }
    } catch (e) {
      const err = e instanceof Error ? e : new Error('Upload failed');
      setError(err);
      setIsUploading(false);
      throw err;
    }
  };

  return { uploadFile, isUploading, progress, error };
}
