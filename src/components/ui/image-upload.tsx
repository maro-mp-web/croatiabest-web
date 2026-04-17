"use client"

import React, { useState } from 'react';
import { useStorage } from '@/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ImageIcon, X, Loader2, UploadCloud } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import Image from 'next/image';

interface ImageUploadProps {
  onUploadComplete: (url: string) => void;
  folder?: string;
}

export function ImageUpload({ onUploadComplete, folder = 'listings' }: ImageUploadProps) {
  const storage = useStorage();
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !storage) return;

    // Limit size to 2MB for faster uploads and storage management
    if (file.size > 2 * 1024 * 1024) {
      toast({ title: "Slika je prevelika", description: "Maksimalna veličina je 2MB.", variant: "destructive" });
      return;
    }

    setIsUploading(true);
    setProgress(0);

    const fileName = `${Date.now()}-${file.name}`;
    const storageRef = ref(storage, `${folder}/${fileName}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const p = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(p);
      },
      (error) => {
        console.error("Upload error:", error);
        setIsUploading(false);
        toast({ title: "Greška", description: "Učitavanje slike nije uspjelo.", variant: "destructive" });
      },
      async () => {
        const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
        setPreviewUrl(downloadUrl);
        setIsUploading(false);
        onUploadComplete(downloadUrl);
        toast({ title: "Uspjeh", description: "Slika je uspješno učitana." });
      }
    );
  };

  return (
    <div className="space-y-4 w-full">
      {previewUrl ? (
        <div className="relative group aspect-video rounded-2xl overflow-hidden border-2 border-primary/20 shadow-xl">
          <Image src={previewUrl} alt="Preview" fill className="object-cover" />
          <button 
            onClick={() => setPreviewUrl(null)}
            className="absolute top-2 right-2 size-8 bg-black/60 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="size-4" />
          </button>
        </div>
      ) : (
        <div className="relative">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={isUploading}
            className="absolute inset-0 opacity-0 cursor-pointer z-10"
          />
          <div className={`
            h-40 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-2 transition-colors
            ${isUploading ? 'bg-secondary/10 border-muted' : 'bg-secondary/5 border-primary/20 hover:bg-secondary/10 hover:border-primary/40'}
          `}>
            {isUploading ? (
              <>
                <Loader2 className="size-8 animate-spin text-primary" />
                <p className="text-xs font-black uppercase text-primary">Učitavanje... {Math.round(progress)}%</p>
                <Progress value={progress} className="w-1/2 h-2" />
              </>
            ) : (
              <>
                <UploadCloud className="size-8 text-primary/40" />
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Kliknite ili povucite sliku</p>
                <p className="text-[10px] text-muted-foreground opacity-60">JPG, PNG (max 2MB)</p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
