'use client';

import { useState, useTransition } from 'react';
import { Trash2, Rocket, Loader2 } from 'lucide-react';
import { deletePostAction } from '@/actions/post';
import { toast } from 'sonner';

export default function CTVPostActions({ postId, isExpired }: { postId: string, isExpired: boolean }) {
  const [isPending, startTransition] = useTransition();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Bạn có chắc chắn muốn xóa bài đăng này không? Việc này cũng sẽ xóa lịch sử liên hệ.')) {
      return;
    }

    setIsDeleting(true);
    startTransition(async () => {
      const res = await deletePostAction(postId);
      if (res.success) {
        toast.success(res.message);
      } else {
        toast.error(res.message);
        setIsDeleting(false);
      }
    });
  };

  const handleRenew = async () => {
    toast.info('Tính năng gia hạn đang được phát triển.');
    // Sẽ gọi API gia hạn ở đây
  };

  if (isDeleting) return null; // Optimistic hide

  return (
    <>
      <button 
        onClick={handleDelete}
        disabled={isPending}
        className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center text-red-400 hover:bg-red-500/20 transition disabled:opacity-50"
        title="Xóa bài đăng"
      >
        {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
      </button>

      {isExpired && (
        <button 
          onClick={handleRenew}
          className="ml-auto bg-blue-600/20 text-blue-400 px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 border border-blue-500/20 hover:bg-blue-600/30 transition"
        >
          <Rocket className="w-3.5 h-3.5" />
          Gia hạn
        </button>
      )}
    </>
  );
}
