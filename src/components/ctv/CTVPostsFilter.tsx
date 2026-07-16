'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';

export default function CTVPostsFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const currentStatus = searchParams.get('status') || 'All';
  const currentQ = searchParams.get('q') || '';
  
  const [searchValue, setSearchValue] = useState(currentQ);

  const updateFilters = useCallback((status: string, q: string) => {
    const params = new URLSearchParams();
    if (status && status !== 'All') params.set('status', status);
    if (q) params.set('q', q);
    router.replace(`/ctv/posts?${params.toString()}`);
  }, [router]);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchValue !== currentQ) {
        updateFilters(currentStatus, searchValue);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchValue, currentQ, currentStatus, updateFilters]);

  const handleTabClick = (status: string) => {
    updateFilters(status, searchValue);
  };

  return (
    <div className="bg-white/80 backdrop-blur border border-slate-200 rounded-2xl p-4 space-y-4">
      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <button 
          onClick={() => handleTabClick('All')}
          className={`px-4 py-1.5 text-sm font-bold rounded-full whitespace-nowrap transition ${currentStatus === 'All' ? 'bg-orange-400 text-slate-900 shadow-lg shadow-orange-500/20' : 'text-slate-600 hover:bg-slate-200/50'}`}
        >
          Tất cả
        </button>
        <button 
          onClick={() => handleTabClick('Active')}
          className={`px-4 py-1.5 text-sm font-bold rounded-full whitespace-nowrap transition ${currentStatus === 'Active' ? 'bg-orange-400 text-slate-900 shadow-lg shadow-orange-500/20' : 'text-slate-600 hover:bg-slate-200/50'}`}
        >
          Đang hoạt động
        </button>
        <button 
          onClick={() => handleTabClick('Pending')}
          className={`px-4 py-1.5 text-sm font-bold rounded-full whitespace-nowrap transition ${currentStatus === 'Pending' ? 'bg-orange-400 text-slate-900 shadow-lg shadow-orange-500/20' : 'text-slate-600 hover:bg-slate-200/50'}`}
        >
          Chờ duyệt
        </button>
        <button 
          onClick={() => handleTabClick('Expired')}
          className={`px-4 py-1.5 text-sm font-bold rounded-full whitespace-nowrap transition ${currentStatus === 'Expired' ? 'bg-orange-400 text-slate-900 shadow-lg shadow-orange-500/20' : 'text-slate-600 hover:bg-slate-200/50'}`}
        >
          Hết hạn
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="w-5 h-5 text-slate-600 absolute left-3 top-1/2 -translate-y-1/2" />
        <input 
          type="text" 
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Tìm theo tên đường, quận, tiêu đề..." 
          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-sm text-slate-800 outline-none focus:border-cyan-500/50 transition-colors"
        />
      </div>
    </div>
  );
}
