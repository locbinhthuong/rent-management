'use client';

import { useState } from 'react';
import { CheckCircle, XCircle, Trash2, Eye, ShieldCheck, ShieldAlert, Edit } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function PostsTable({ initialPosts }: { initialPosts: any[] }) {
  const [posts, setPosts] = useState(initialPosts);
  const router = useRouter();

  const handleUpdateStatus = async (id: string, status?: string, is_verified?: boolean) => {
    let confirmMsg = status ? `Bạn có chắc muốn chuyển sang trạng thái ${status}?` : `Bạn có chắc muốn thay đổi trạng thái xác thực?`;
    if (!confirm(confirmMsg)) return;

    try {
      const bodyData: any = {};
      if (status) bodyData.status = status;
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
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn XÓA bài đăng này? Mọi dữ liệu Khách hàng liên quan cũng sẽ bị xóa sạch!')) return;

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
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-800/50 text-slate-300 border-b border-white/10">
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
              <tr key={post._id} className="hover:bg-white/5 transition">
                <td className="px-6 py-4">
                  <div className="font-bold text-slate-100">{post.ctv_id?.name || 'Ẩn danh'}</div>
                  <div className="text-xs text-slate-400">{post.ctv_id?.phone}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-100 line-clamp-2 max-w-xs" title={post.title}>
                    {post.title}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">{post.property_type}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-bold text-emerald-400">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(post.price || 0)}
                  </div>
                  <div className="text-xs text-slate-400 mt-1 truncate max-w-[150px]" title={post.address}>
                    {post.address}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                    post.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                    post.status === 'Rejected' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 
                    'bg-orange-500/10 text-orange-400 border-orange-500/20'
                  }`}>
                    {post.status}
                  </span>
                  {post.is_verified && (
                    <span className="ml-2 inline-flex items-center gap-1 px-2 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-bold">
                      <ShieldCheck className="w-3 h-3" /> Uy tín
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  {post.status === 'Active' && (
                    <>
                      <a href={`/p/${post._id}`} target="_blank" rel="noreferrer" className="inline-flex text-cyan-400 hover:bg-cyan-500/20 p-2 rounded-lg transition" title="Xem chi tiết bài đăng">
                        <Eye className="w-5 h-5" />
                      </a>
                      <a href={`/ctv/post/${post._id}/edit`} className="inline-flex text-cyan-400 hover:bg-cyan-500/20 p-2 rounded-lg transition" title="Sửa bài đăng">
                        <Edit className="w-5 h-5" />
                      </a>
                      <button 
                        onClick={() => handleUpdateStatus(post._id, undefined, !post.is_verified)} 
                        className={`p-2 rounded-lg transition tooltip ${post.is_verified ? 'text-blue-400 hover:bg-blue-500/20' : 'text-slate-400 hover:text-blue-400 hover:bg-white/5'}`} 
                        title={post.is_verified ? "Bỏ xác thực" : "Cấp tích xanh xác thực"}
                      >
                        {post.is_verified ? <ShieldCheck className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
                      </button>
                    </>
                  )}
                  {post.status !== 'Active' && (
                    <button onClick={() => handleUpdateStatus(post._id, 'Active')} className="text-emerald-400 hover:bg-emerald-500/20 p-2 rounded-lg transition" title="Duyệt bài">
                      <CheckCircle className="w-5 h-5" />
                    </button>
                  )}
                  {post.status !== 'Rejected' && (
                    <button onClick={() => handleUpdateStatus(post._id, 'Rejected')} className="text-orange-400 hover:bg-orange-500/20 p-2 rounded-lg transition" title="Từ chối">
                      <XCircle className="w-5 h-5" />
                    </button>
                  )}
                  <button onClick={() => handleDelete(post._id)} className="text-red-400 hover:bg-red-500/20 p-2 rounded-lg transition" title="Xóa bài & Toàn bộ khách hàng">
                    <Trash2 className="w-5 h-5" />
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
