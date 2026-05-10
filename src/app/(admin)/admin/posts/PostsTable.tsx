'use client';

import { useState } from 'react';
import { CheckCircle, XCircle, Trash2, Eye, ShieldCheck, ShieldAlert } from 'lucide-react';
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
        <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
          <tr>
            <th className="px-6 py-4 font-medium">Người đăng (CTV)</th>
            <th className="px-6 py-4 font-medium">Tiêu đề bài đăng</th>
            <th className="px-6 py-4 font-medium">Giá & Khu vực</th>
            <th className="px-6 py-4 font-medium">Trạng thái</th>
            <th className="px-6 py-4 font-medium text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {posts.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                Chưa có bài đăng nào cần quản lý.
              </td>
            </tr>
          ) : (
            posts.map((post) => (
              <tr key={post._id} className="hover:bg-slate-50 transition">
                <td className="px-6 py-4">
                  <div className="font-bold text-slate-800">{post.ctv_id?.name || 'Ẩn danh'}</div>
                  <div className="text-xs text-slate-500">{post.ctv_id?.phone}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-800 line-clamp-2 max-w-xs" title={post.title}>
                    {post.title}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">{post.property_type}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-bold text-emerald-600">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(post.price || 0)}
                  </div>
                  <div className="text-xs text-slate-500 mt-1 truncate max-w-[150px]" title={post.address}>
                    {post.address}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                    post.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                    post.status === 'Rejected' ? 'bg-red-50 text-red-700 border-red-200' : 
                    'bg-orange-50 text-orange-700 border-orange-200'
                  }`}>
                    {post.status}
                  </span>
                  {post.is_verified && (
                    <span className="ml-2 inline-flex items-center gap-1 px-2 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold">
                      <ShieldCheck className="w-3 h-3" /> Uy tín
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  {post.status === 'Active' && (
                    <button 
                      onClick={() => handleUpdateStatus(post._id, undefined, !post.is_verified)} 
                      className={`p-2 rounded-lg transition tooltip ${post.is_verified ? 'text-blue-600 hover:bg-blue-50' : 'text-slate-400 hover:text-blue-600 hover:bg-slate-100'}`} 
                      title={post.is_verified ? "Bỏ xác thực" : "Cấp tích xanh xác thực"}
                    >
                      {post.is_verified ? <ShieldCheck className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
                    </button>
                  )}
                  {post.status !== 'Active' && (
                    <button onClick={() => handleUpdateStatus(post._id, 'Active')} className="text-emerald-600 hover:bg-emerald-50 p-2 rounded-lg transition" title="Duyệt bài">
                      <CheckCircle className="w-5 h-5" />
                    </button>
                  )}
                  {post.status !== 'Rejected' && (
                    <button onClick={() => handleUpdateStatus(post._id, 'Rejected')} className="text-orange-600 hover:bg-orange-50 p-2 rounded-lg transition" title="Từ chối">
                      <XCircle className="w-5 h-5" />
                    </button>
                  )}
                  <button onClick={() => handleDelete(post._id)} className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition" title="Xóa bài & Toàn bộ khách hàng">
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
