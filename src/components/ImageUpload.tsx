'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ImagePlus, Trash, Loader2 } from 'lucide-react';
import Image from 'next/image';

interface ImageUploadProps {
  value: string[];
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
}

export default function ImageUpload({
  value,
  onChange,
  onRemove,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    
    try {
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      if (!cloudName) throw new Error('Missing Cloudinary Cloud Name');

      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'rent_management_preset');
        
        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();
        
        if (data.secure_url) {
          onChange(data.secure_url);
        }
      });
      
      await Promise.all(uploadPromises);

    } catch (error) {
      console.error('Upload error:', error);
      alert('Đã có lỗi xảy ra khi tải ảnh lên. Vui lòng thử lại.');
    } finally {
      setIsUploading(false);
      if (inputRef.current) {
        inputRef.current.value = ''; // Reset input
      }
    }
  };

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-4">
        {value.map((url) => (
          <div
            key={url}
            className="relative h-[200px] w-[200px] overflow-hidden rounded-md border border-border"
          >
            <div className="absolute top-2 right-2 z-10">
              <Button
                type="button"
                onClick={() => onRemove(url)}
                variant="destructive"
                size="icon"
                className="h-8 w-8"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
            <Image
              fill
              className="object-cover"
              alt="Image"
              src={url}
            />
          </div>
        ))}
      </div>
      
      <div className="relative">
        <input
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          ref={inputRef}
          onChange={handleFileChange}
          disabled={isUploading}
        />
        <Button
          type="button"
          disabled={isUploading}
          variant="secondary"
          onClick={() => inputRef.current?.click()}
          className="border border-border flex items-center gap-2"
        >
          {isUploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ImagePlus className="h-4 w-4" />
          )}
          {isUploading ? 'Đang tải lên...' : 'Tải ảnh lên'}
        </Button>
      </div>
    </div>
  );
}
