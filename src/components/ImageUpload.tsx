'use client';

import { CldUploadWidget } from 'next-cloudinary';
import { Button } from '@/components/ui/button';
import { ImagePlus, Trash, X } from 'lucide-react';
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
  const onUpload = (result: any) => {
    onChange(result.info.secure_url);
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
      <CldUploadWidget
        onSuccess={onUpload}
        uploadPreset="rent_management_preset" // You will need to create this in Cloudinary
        options={{
          multiple: true,
          cropping: true,
          croppingAspectRatio: 4 / 3,
          showSkipCropButton: false,
          clientAllowedFormats: ['images'],
          maxFiles: 10,
        }}
      >
        {({ open }) => {
          return (
            <Button
              type="button"
              disabled={false}
              variant="secondary"
              onClick={() => open?.()}
              className="border border-border flex items-center gap-2"
            >
              <ImagePlus className="h-4 w-4" />
              Tải ảnh lên (Hỗ trợ chọn nhiều & cắt ảnh)
            </Button>
          );
        }}
      </CldUploadWidget>
    </div>
  );
}
