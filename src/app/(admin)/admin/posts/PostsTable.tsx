'use client';

import { useState } from 'react';
import { CheckCircle, XCircle, Trash2, Eye, ShieldCheck, ShieldAlert, Edit, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function PostsTable({ initialPosts }: { initialPosts: any[] }) {
  const [posts, setPosts] = useState(initialPosts);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const router = useRouter();

  const handleUpdateStatus = async (id: string, approval_status?: string, rental_status?: string, is_verified?: boolean) => {
    let confirmMsg = approval_status ? `Bạn có chắc muốn chuyển sang trạng thái ${approval_status}?` : `Bạn có chắc muốn thay đổi trạng thái xác thực?`;
    if (!confirm(confirmMsg)) return;

    setLoadingId(id);
    try {
      const bodyData: any = {};
      if (approval_status) bodyData.approval_status = approval_status;
      if (rental_status) bodyData.rental_status = rental_status;
      if (is_verified !== undefined) bodyData.is_verified = is_verified;

      const res = await fetch(`/api/ctv/posts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData),
      });
      if (res.ok) {
        setPosts(posts.map(p => p._id === id ? { ...p, ...bodyData } : p));
        router.refresh();
      } else {
        alert('Có lỗi xảy ra');
      }
    } catch (error) {
      alert('Lỗi hệ thống');
    } finally {
      setLoadingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn XÓA bài đăng này? Mọi dữ liệu Khách hàng liên quan cũng sẽ bị xóa sạch!')) return;

    setLoadingId(id);
    try {
      const res = await fetch(`/api/ctv/posts/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setPosts(posts.filter(p => p._id !== id));
        router.refresh();
      } else {
        alert('Có lỗi xảy ra');
      }
    } catch (error) {
      alert('Lỗi hệ thống');
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-100/80 text-slate-700 border-b border-slate-200">
          <tr>
            <th className="px-6 py-4 font-medium">Người đăng (CTV)</th>
            <th className="px-6 py-4 font-medium">Tiêu đề bài đăng</th>
            <th className="px-6 py-4 font-medium">Giá & Khu vực</th>
            <th className="px-6 py-4 font-medium">Trạng thái</th>
            <th className="px-6 py-4 font-medium text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/10">
          {posts.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                Chưa có bài đăng nào cần quản lý.
              </td>
            </tr>
          ) : (
            posts.map((post) => (
              <tr key={post._id} className="hover:bg-slate-200/50 transition">
                <td className="px-6 py-4">
                  <div className="font-bold text-slate-900">{post.ctv_id?.name || 'Ẩn danh'}</div>
                  <div className="text-xs text-slate-600">{post.ctv_id?.phone}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-900 line-clamp-2 max-w-xs" title={post.title}>
                    {post.title}
                  </div>
                  <div className="text-xs text-slate-600 mt-1">{post.property_type}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-bold text-emerald-400">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(post.price || 0)}
                  </div>
                  <div className="text-xs text-slate-600 mt-1 truncate max-w-[150px]" title={post.address}>
                    {post.address}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                    post.approval_status === 'Approved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                    post.approval_status === 'Rejected' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 
                    'bg-orange-500/10 text-orange-400 border-orange-500/20'
                  }`}>
                    {post.approval_status === 'Approved' ? 'Đã duyệt' : post.approval_status === 'Rejected' ? 'Từ chối' : 'Chờ duyệt'}
                  </span>
                  {post.is_verified && (
                    <span className="ml-2 inline-flex items-center gap-1 px-2 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-bold">
                      <ShieldCheck className="w-3 h-3" /> Uy tín
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  {post.approval_status === 'Approved' && (
                    <>
                      <Link href={`/p/${post._id}`} target="_blank" rel="noreferrer" className="inline-flex text-cyan-400 hover:bg-cyan-500/20 p-2 rounded-lg transition" title="Xem chi tiết bài đăng">
                        <Eye className="w-5 h-5" />
                      </Link>
                      <Link href={`/ctv/post/${post._id}/edit`} className="inline-flex text-cyan-400 hover:bg-cyan-500/20 p-2 rounded-lg transition" title="Sửa bài đăng">
                        <Edit className="w-5 h-5" />
                      </Link>
                      <button 
                        onClick={() => handleUpdateStatus(post._id, undefined, undefined, !post.is_verified)} 
                        disabled={loadingId === post._id}
                        className={`p-2 rounded-lg transition tooltip ${post.is_verified ? 'text-blue-400 hover:bg-blue-500/20' : 'text-slate-600 hover:text-blue-400 hover:bg-slate-200/50'} disabled:opacity-50`} 
                        title={post.is_verified ? "Bỏ xác thực" : "Cấp tích xanh xác thực"}
                      >
                        {loadingId === post._id ? <Loader2 className="w-5 h-5 animate-spin" /> : (post.is_verified ? <ShieldCheck className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />)}
                      </button>
                    </>
                  )}
                  {post.approval_status !== 'Approved' && (
                    <button onClick={() => handleUpdateStatus(post._id, 'Approved', 'Available')} disabled={loadingId === post._id} className="text-emerald-400 hover:bg-emerald-500/20 p-2 rounded-lg transition disabled:opacity-50" title="Duyệt bài">
                      {loadingId === post._id ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />}
                    </button>
                  )}
                  {post.approval_status !== 'Rejected' && (
                    <button onClick={() => handleUpdateStatus(post._id, 'Rejected')} disabled={loadingId === post._id} className="text-orange-400 hover:bg-orange-500/20 p-2 rounded-lg transition disabled:opacity-50" title="Từ chối">
                      {loadingId === post._id ? <Loader2 className="w-5 h-5 animate-spin" /> : <XCircle className="w-5 h-5" />}
                    </button>
                  )}
                  <button onClick={() => handleDelete(post._id)} disabled={loadingId === post._id} className="text-red-400 hover:bg-red-500/20 p-2 rounded-lg transition disabled:opacity-50" title="Xóa bài & Toàn bộ khách hàng">
                    {loadingId === post._id ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
