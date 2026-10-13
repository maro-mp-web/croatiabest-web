"use client"

import React, { useState } from 'react';
import { useStorage } from '@/pocketbase';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ImageIcon, X, Loader2, UploadCloud, FolderOpen } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import Image from 'next/image';
import { MediaLibraryModal } from '@/components/media/MediaLibraryModal';

interface ImageUploadProps {
  onUploadComplete: (url: string) => void;
  folder?: string;
  defaultImage?: string;
}

export function ImageUpload({ onUploadComplete, folder = 'media', defaultImage }: ImageUploadProps) {
  const { uploadFile, isUploading, progress } = useStorage();
  const [previewUrl, setPreviewUrl] = useState<string | null>(defaultImage || null);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Limit size to 2MB for faster uploads and storage management
    if (file.size > 2 * 1024 * 1024) {
      toast({ title: "Slika je prevelika", description: "Maksimalna veličina je 2MB.", variant: "destructive" });
      return;
    }

    // Show instant local preview before upload finishes
    const localPreview = URL.createObjectURL(file);
    setPreviewUrl(localPreview);

    try {
      const downloadUrl = await uploadFile(folder, undefined, file);
      URL.revokeObjectURL(localPreview);
      setPreviewUrl(downloadUrl);
      onUploadComplete(downloadUrl);
      toast({ title: "Uspjeh", description: "Slika je uspješno učitana." });
    } catch (error) {
      console.error("Upload error:", error);
      URL.revokeObjectURL(localPreview);
      setPreviewUrl(null);
      toast({ title: "Greška", description: "Učitavanje slike nije uspjelo.", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-3 w-full">
      {previewUrl ? (
        <div className="space-y-2">
          <div className="relative group aspect-video rounded-2xl overflow-hidden border-2 border-primary/20 shadow-xl bg-slate-950">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
            <button 
              type="button"
              onClick={() => {
                setPreviewUrl(null);
                onUploadComplete('');
              }}
              className="absolute top-2 right-2 size-8 bg-black/70 hover:bg-black text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              title="Ukloni sliku"
            >
              <X className="size-4" />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsMediaModalOpen(true)}
              className="h-8 px-3 rounded-xl border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5"
            >
              <FolderOpen className="size-3.5 text-primary" />
              Zamijeni iz medija
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={isUploading}
              className="absolute inset-0 opacity-0 cursor-pointer z-10"
            />
            <div className={`
              h-36 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-2 transition-colors
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
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Kliknite ili povucite sliku s računala</p>
                  <p className="text-[10px] text-muted-foreground opacity-60">JPG, PNG, WEBP (max 2MB)</p>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center justify-center">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsMediaModalOpen(true)}
              className="h-9 w-full rounded-xl border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center justify-center gap-2 shadow-sm"
            >
              <FolderOpen className="size-4 text-primary" />
              Ili odaberi postojeću iz medijske zbirke (Media)
            </Button>
          </div>
        </div>
      )}

      {/* Media Library Selector Modal */}
      <MediaLibraryModal
        isOpen={isMediaModalOpen}
        onClose={() => setIsMediaModalOpen(false)}
        onSelect={(url) => {
          setPreviewUrl(url);
          onUploadComplete(url);
        }}
      />
    </div>
  );
}
