'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ImagePlus, X, Loader2 } from 'lucide-react';
import { mediaService } from '../services/media.service';
import { toast } from 'sonner';

interface ImageUploadProps {
    value: string[];
    onChange: (urls: string[]) => void;
    onRemove: (url: string) => void;
}

export function ImageUpload({ value, onChange, onRemove }: ImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        try {
            setIsUploading(true);
            const uploadedUrls = [];
            
            for (let i = 0; i < files.length; i++) {
                const response = await mediaService.upload(files[i]);
                uploadedUrls.push(response.data.url);
            }

            onChange([...value, ...uploadedUrls]);
            toast.success('Đã tải ảnh lên thành công');
        } catch (error) {
            console.error('Upload failed', error);
            toast.error('Lỗi khi tải ảnh lên');
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {value.map((url) => (
                    <div key={url} className="relative aspect-square rounded-lg overflow-hidden border border-zinc-800 bg-zinc-900 group">
                        <img
                            src={mediaService.getFileUrl(url)}
                            alt="Preview"
                            className="w-full h-full object-cover"
                        />
                        <button
                            type="button"
                            onClick={() => onRemove(url)}
                            className="absolute top-1 right-1 p-1 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <X className="w-3 h-3 text-white" />
                        </button>
                    </div>
                ))}
                
                <button
                    type="button"
                    disabled={isUploading}
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-zinc-800 rounded-lg bg-zinc-900 hover:bg-zinc-800 hover:border-zinc-700 transition-all text-zinc-500 hover:text-zinc-300 gap-2"
                >
                    {isUploading ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                        <>
                            <ImagePlus className="w-6 h-6" />
                            <span className="text-xs">Tải ảnh lên</span>
                        </>
                    )}
                </button>
            </div>
            
            <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleUpload}
            />
        </div>
    );
}
