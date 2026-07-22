'use client';

import { useState, useEffect } from 'react';
import { Mail, Phone, Clock, User, Trash2, CheckCircle, Circle, RefreshCw, MessageCircle } from 'lucide-react';

export default function AdminSupportPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/support');
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Lỗi khi tải dữ liệu');
      setRequests(data.requests);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/admin/support/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (!res.ok) throw new Error('Lỗi cập nhật');
      fetchRequests();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const deleteRequest = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa yêu cầu này?')) return;
    try {
      const res = await fetch(`/api/admin/support/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Lỗi xóa');
      fetchRequests();
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-[400px]"><RefreshCw className="w-8 h-8 text-indigo-500 animate-spin" /></div>;
  }

  if (error) {
    return <div className="p-4 bg-red-50 text-red-600 rounded-xl">{error}</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Yêu cầu hỗ trợ</h1>
          <p className="text-slate-500 text-sm mt-1">Quản lý các tin nhắn và yêu cầu từ khách hàng</p>
        </div>
        <button onClick={fetchRequests} className="px-4 py-2 bg-indigo-50 text-indigo-600 font-medium rounded-lg hover:bg-indigo-100 flex items-center gap-2">
          <RefreshCw className="w-4 h-4" /> Làm mới
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-sm font-semibold text-slate-600">
              <th className="p-4">Khách hàng</th>
              <th className="p-4">Liên hệ</th>
              <th className="p-4">Trạng thái</th>
              <th className="p-4">Ngày gửi</th>
              <th className="p-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {requests.length === 0 ? (
              <tr><td colSpan={5} className="p-8 text-center text-slate-500">Chưa có yêu cầu nào</td></tr>
            ) : requests.map((req) => (
              <tr key={req._id} className="hover:bg-slate-50/50 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                      {req.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">{req.name}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Phone className="w-4 h-4" /> {req.phone}
                    </div>
                    {req.email && (
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Mail className="w-4 h-4" /> {req.email}
                      </div>
                    )}
                  </div>
                </td>
                <td className="p-4">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                    req.status === 'New' ? 'bg-blue-100 text-blue-700' :
                    req.status === 'In Progress' ? 'bg-amber-100 text-amber-700' :
                    'bg-emerald-100 text-emerald-700'
                  }`}>
                    {req.status === 'New' && 'Mới'}
                    {req.status === 'In Progress' && 'Đang xử lý'}
                    {req.status === 'Resolved' && 'Đã giải quyết'}
                  </span>
                </td>
                <td className="p-4 text-sm text-slate-500">
                  {new Date(req.createdAt).toLocaleString('vi-VN')}
                </td>
                <td className="p-4 text-right">
                  <button 
                    onClick={() => setSelectedId(selectedId === req._id ? null : req._id)}
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
                  >
                    Xem chi tiết
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail Modal / Panel */}
      {selectedId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {(() => {
              const req = requests.find(r => r._id === selectedId);
              if (!req) return null;
              
              return (
                <>
                  <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                      <User className="w-5 h-5 text-indigo-500" />
                      Chi tiết yêu cầu
                    </h3>
                    <button onClick={() => setSelectedId(null)} className="text-slate-400 hover:text-slate-600">
                      ✕
                    </button>
                  </div>
                  
                  <div className="p-6 overflow-y-auto space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-slate-500">Khách hàng</p>
                        <p className="font-bold text-slate-900">{req.name}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-slate-500">Ngày gửi</p>
                        <p className="font-bold text-slate-900">{new Date(req.createdAt).toLocaleString('vi-VN')}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-slate-500">Số điện thoại</p>
                        <p className="font-bold text-slate-900">{req.phone}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-slate-500">Email</p>
                        <p className="font-bold text-slate-900">{req.email || 'Không có'}</p>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <a 
                        href={`tel:${req.phone}`}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-blue-50 text-blue-600 rounded-xl font-medium hover:bg-blue-100 transition-colors"
                      >
                        <Phone className="w-4 h-4" /> Gọi điện
                      </a>
                      <a 
                        href={`https://zalo.me/${req.phone}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors shadow-sm shadow-blue-500/20"
                      >
                        <MessageCircle className="w-4 h-4" /> Chat Zalo
                      </a>
                      {req.email && (
                        <a 
                          href={`mailto:${req.email}`}
                          className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-colors"
                        >
                          <Mail className="w-4 h-4" /> Gửi Email
                        </a>
                      )}
                    </div>

                    <div>
                      <p className="text-sm font-medium text-slate-500 mb-2">Nội dung yêu cầu:</p>
                      <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl text-slate-700 whitespace-pre-wrap leading-relaxed">
                        {req.content}
                      </div>
                    </div>
                  </div>

                  <div className="p-6 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
                    <button 
                      onClick={() => { deleteRequest(req._id); setSelectedId(null); }}
                      className="px-4 py-2 text-red-600 hover:bg-red-50 font-medium rounded-lg transition-colors flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" /> Xóa
                    </button>
                    
                    <div className="flex items-center gap-3">
                      {req.status !== 'In Progress' && (
                        <button 
                          onClick={() => updateStatus(req._id, 'In Progress')}
                          className="px-4 py-2 bg-amber-100 text-amber-700 hover:bg-amber-200 font-medium rounded-lg transition-colors"
                        >
                          Đánh dấu Đang xử lý
                        </button>
                      )}
                      {req.status !== 'Resolved' && (
                        <button 
                          onClick={() => updateStatus(req._id, 'Resolved')}
                          className="px-4 py-2 bg-emerald-600 text-white hover:bg-emerald-700 font-medium rounded-lg transition-colors flex items-center gap-2"
                        >
                          <CheckCircle className="w-4 h-4" /> Đã giải quyết xong
                        </button>
                      )}
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
