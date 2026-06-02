'use client';

import { useState, useTransition } from 'react';
import { ArrowUpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { bumpPostAction } from '@/actions/post';
import { toast } from 'sonner';

export default function BumpButton({ postId, isVip }: { postId: string, isVip?: boolean }) {
  const [isPending, startTransition] = useTransition();

  const handleBump = async () => {
    if (!confirm('Bạn có chắc chắn muốn đẩy tin này với phí 10,000 VNĐ không?')) return;
    
    startTransition(async () => {
      const res = await bumpPostAction(postId);
      if (res.success) {
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    });
  };

  return (
    <Button 
      onClick={handleBump}
      disabled={isPending}
      variant={isVip ? 'outline' : 'default'}
      className={`ml-3 rounded-lg text-xs font-bold flex items-center gap-1 transition ${isVip ? 'bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-200' : 'bg-indigo-50 text-indigo-600 border-indigo-200 hover:bg-indigo-100'}`}
      title="Đẩy tin lên đầu (Phí 10K)"
    >
      <ArrowUpCircle className={`w-4 h-4 ${isPending ? 'animate-spin' : ''}`} />
      {isPending ? 'Đang xử lý...' : (isVip ? 'Gia hạn VIP' : 'Đẩy tin (10K)')}
    </Button>
  );
}
