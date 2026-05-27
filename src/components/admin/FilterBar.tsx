'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { Search } from 'lucide-react';

export default function FilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams]
  );

  const handleFilterChange = (key: string, value: string) => {
    router.push(`?${createQueryString(key, value)}`);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 p-4 border border-border rounded-lg bg-card">
      {/* Tìm kiếm */}
      <div className="relative flex-1">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="w-4 h-4 text-muted-foreground" />
        </div>
        <input
          type="text"
          placeholder="Tìm kiếm mã phòng, địa chỉ..."
          defaultValue={searchParams.get('q') || ''}
          onChange={(e) => {
            // Debounce trong thực tế, ở đây làm mẫu onChange
            // hoặc dùng onBlur / onKeyDown (Enter)
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleFilterChange('q', e.currentTarget.value);
            }
          }}
          className="block w-full p-2 pl-10 text-sm bg-background border border-border rounded-md focus:ring-primary focus:border-primary text-foreground placeholder:text-muted-foreground"
        />
      </div>

      {/* Lọc loại phòng */}
      <select
        defaultValue={searchParams.get('room_type') || ''}
        onChange={(e) => handleFilterChange('room_type', e.target.value)}
        className="block w-full sm:w-auto p-2 text-sm bg-background border border-border rounded-md focus:ring-primary focus:border-primary text-foreground appearance-none"
      >
        <option value="">Tất cả loại phòng</option>
        <option value="Phòng trọ">Phòng trọ</option>
        <option value="Chung cư mini">Chung cư mini</option>
        <option value="Ký túc xá">Ký túc xá</option>
        <option value="Nhà nguyên căn">Nhà nguyên căn</option>
      </select>

      {/* Lọc khu vực */}
      <select
        defaultValue={searchParams.get('district') || ''}
        onChange={(e) => handleFilterChange('district', e.target.value)}
        className="block w-full sm:w-auto p-2 text-sm bg-background border border-border rounded-md focus:ring-primary focus:border-primary text-foreground appearance-none"
      >
        <option value="">Tất cả quận/huyện</option>
        <option value="Quận 1">Quận 1</option>
        <option value="Quận 2">Quận 2</option>
        <option value="Quận 3">Quận 3</option>
        <option value="Quận 7">Quận 7</option>
        <option value="Quận 9">Quận 9</option>
        <option value="Bình Thạnh">Bình Thạnh</option>
      </select>

      {/* Lọc mức giá */}
      <select
        defaultValue={searchParams.get('priceRange') || ''}
        onChange={(e) => handleFilterChange('priceRange', e.target.value)}
        className="block w-full sm:w-auto p-2 text-sm bg-background border border-border rounded-md focus:ring-primary focus:border-primary text-foreground appearance-none"
      >
        <option value="">Mọi mức giá</option>
        <option value="under_2m">Dưới 2 triệu</option>
        <option value="2m_to_4m">Từ 2 - 4 triệu</option>
        <option value="over_4m">Trên 4 triệu</option>
      </select>
    </div>
  );
}
