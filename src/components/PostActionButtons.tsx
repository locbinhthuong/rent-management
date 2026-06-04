'use client';

import { useState, useTransition } from 'react';
import { Edit, Trash2, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { deletePostAction } from '@/actions/post';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

export default function PostActionButtons({ postId }: { postId: string }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = async () => {
    if (!confirm('Bạn có chắc chắn muốn xóa bài đăng này không? Hành động này không thể hoàn tác.')) {
      return;
    }

    // Optimistic UI: Hide the post element instantly
    const postElement = document.getElementById(`post-${postId}`);
    if (postElement) {
      postElement.style.opacity = '0.3';
      postElement.style.pointerEvents = 'none';
    }

    startTransition(async () => {
      const res = await deletePostAction(postId);
      if (res.success) {
        toast.success(res.message);
        if (postElement) postElement.style.display = 'none';
      } else {
        toast.error(res.message);
        if (postElement) {
          postElement.style.opacity = '1';
          postElement.style.pointerEvents = 'auto';
        }
      }
    });
  };

  return (
    <div className="flex items-center gap-1">
      <Link 
        href={`/ctv/post/${postId}/edit`}
        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
        title="Chỉnh sửa bài đăng"
      >
        <Edit className="w-4 h-4" />
      </Link>
      <Button 
        onClick={handleDelete}
        disabled={isPending}
        variant="ghost"
        size="icon"
        className="text-slate-400 hover:text-red-600 hover:bg-red-50"
        title="Xóa bài đăng"
      >
        {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
      </Button>
    </div>
  );
}
