'use client';

import { useState } from 'react';
import { Edit, Trash2, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function PostActionButtons({ postId }: { postId: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm('Bạn có chắc chắn muốn xóa bài đăng này không? Hành động này không thể hoàn tác.')) {
      return;
    }

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Lỗi khi xóa bài đăng');
      }
      
      alert('Xóa bài đăng thành công!');
      router.refresh();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsDeleting(false);
    }
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
      <button 
        onClick={handleDelete}
        disabled={isDeleting}
        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
        title="Xóa bài đăng"
      >
        {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
      </button>
    </div>
  );
}
