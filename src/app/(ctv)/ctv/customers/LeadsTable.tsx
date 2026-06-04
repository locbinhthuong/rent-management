'use client';

import { useState, useEffect } from 'react';
import { PhoneCall, Search, Clock, Home, CornerDownRight, CheckCircle, MessageSquare } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LeadsTable({ initialLeads, isAdmin = false }: { initialLeads: any[], isAdmin?: boolean }) {
  const [leads, setLeads] = useState(initialLeads);
  const router = useRouter();

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const res = await fetch('/api/leads');
        if (res.ok) {
          const data = await res.json();
          setLeads(data.leads);
        }
      } catch (err) {
        console.error('Error fetching leads:', err);
      }
    };

    const interval = setInterval(fetchLeads, 3000); // Poll every 3 seconds
    return () => clearInterval(interval);
  }, []);

  const handleUpdateStatus = async (id: string, status?: string, note?: string) => {
    try {
      const body: any = {};
      if (status) body.status = status;
      if (note !== undefined) body.note = note;

      const res = await fetch(`/api/leads/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (res.ok) {
        setLeads(leads.map(l => l._id === id ? { ...l, ...body } : l));
        if (status) router.refresh();
      }
    } catch(err) {
      alert('Lỗi hệ thống');
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    if (diffDays === 1) return `Hôm qua`;
    return `${diffDays} ngày trước`;
  };

  return (
    <div className="space-y-4">
      {/* Search and Tabs */}
      <div className="bg-slate-900/50 backdrop-blur rounded-3xl p-4 space-y-4 border border-white/5">
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Tìm kiếm khách hàng, bài đăng..." 
            className="w-full bg-transparent border-b border-white/10 py-3 pl-10 pr-4 text-sm text-slate-200 outline-none focus:border-cyan-500 transition-colors"
          />
        </div>
        <div className="flex gap-4 overflow-x-auto pb-1 scrollbar-hide">
          <button className="px-5 py-2 bg-orange-400 text-white text-sm font-bold rounded-full whitespace-nowrap">Tất cả</button>
          <button className="px-5 py-2 text-slate-400 hover:bg-white/5 text-sm font-bold rounded-full whitespace-nowrap">Mới nhất</button>
          <button className="px-5 py-2 text-slate-400 hover:bg-white/5 text-sm font-bold rounded-full whitespace-nowrap">Cần xử lý</button>
        </div>
      </div>

      {/* Cards List */}
      <div className="space-y-4">
        {leads.length === 0 ? (
          <div className="p-8 text-center text-slate-400 bg-slate-900/50 rounded-3xl border border-white/5">
            Chưa có yêu cầu tư vấn nào.
          </div>
        ) : (
          leads.map((lead) => {
            const isNew = lead.status === 'New';
            const isContacted = lead.status === 'Contacted';
            const isSuccess = lead.status === 'Success';
            const initial = lead.name ? lead.name.charAt(0).toUpperCase() : 'U';

            return (
              <div key={lead._id} className="bg-slate-900/50 backdrop-blur rounded-3xl p-5 border border-white/5 shadow-sm relative overflow-hidden">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                      {initial}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-100 text-lg">{lead.name}</h3>
                      <div className="flex items-center gap-2 text-slate-400 text-xs">
                        <Clock className="w-3.5 h-3.5" /> {getTimeAgo(lead.createdAt)}
                      </div>
                      <div className="flex items-center gap-2 text-blue-400 font-medium text-sm mt-0.5">
                        <PhoneCall className="w-3.5 h-3.5" /> {lead.phone} <span className="text-slate-500 text-xs">• Zalo</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {isNew && <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded">! ƯU TIÊN</span>}
                    {isNew && <span className="bg-red-500/20 text-red-400 border border-red-500/20 text-[10px] font-bold px-2 py-1 rounded">MỚI</span>}
                    {isContacted && <span className="bg-slate-800 text-slate-300 border border-slate-700 text-[10px] font-bold px-2 py-1 rounded">ĐÃ PHẢN HỒI</span>}
                    {isSuccess && <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1"><CheckCircle className="w-3 h-3"/> HOÀN THÀNH</span>}
                  </div>
                </div>

                {/* Post Info */}
                <div className="bg-indigo-900/20 rounded-xl p-3 mb-4 border border-indigo-500/20">
                  <p className="text-[10px] font-bold text-slate-500 mb-1">QUAN TÂM ĐẾN</p>
                  <p className="font-bold text-slate-200 text-sm line-clamp-1">{lead.post_id?.title || 'Bài viết đã bị xóa'}</p>
                  <div className="flex gap-2 mt-2">
                    <div className="flex items-center gap-1 bg-slate-800 border border-slate-700 px-2 py-0.5 rounded text-xs text-slate-300">
                      <Home className="w-3 h-3" /> {lead.post_id?.property_type === 'Căn hộ chung cư' ? 'Căn hộ' : 'Phòng trọ'}
                    </div>
                  </div>
                </div>

                {/* Internal Note */}
                <div className="relative mb-4">
                  <div className="absolute top-3 left-3 bg-slate-800 p-1 rounded-full text-slate-400">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <textarea 
                    defaultValue={lead.note || ''}
                    onBlur={(e) => {
                      if (e.target.value !== lead.note) {
                        handleUpdateStatus(lead._id, undefined, e.target.value);
                      }
                    }}
                    placeholder="Nhập ghi chú tại đây..."
                    className="w-full bg-slate-950/50 border border-slate-800 border-dashed rounded-xl py-3 pl-10 pr-3 text-sm text-slate-300 outline-none focus:border-cyan-500 focus:bg-slate-900 resize-none h-20 placeholder:italic"
                  />
                  <p className="text-[10px] font-bold text-slate-500 absolute top-[-6px] left-4 bg-slate-900 px-1">GHI CHÚ NỘI BỘ</p>
                </div>

                {/* Actions Bubbles */}
                <div className="flex gap-2 justify-between mt-2 w-full">
                  <div className="flex gap-2 flex-1">
                    <select 
                      value={lead.status}
                      onChange={(e) => handleUpdateStatus(lead._id, e.target.value)}
                      className="bg-blue-900/40 text-blue-400 border border-blue-500/30 outline-none text-[10px] sm:text-[11px] font-bold flex-1 aspect-square max-w-[60px] max-h-[60px] rounded-2xl text-center appearance-none cursor-pointer flex items-center justify-center hover:bg-blue-900/60 transition-colors p-1"
                    >
                      <option value="New">Mới</option>
                      <option value="Contacted">Đã xử lý</option>
                      <option value="Success">Chốt</option>
                      <option value="Failed">Hủy</option>
                    </select>
                    <button className="bg-slate-800 text-slate-300 border border-slate-700 text-[10px] sm:text-[11px] font-medium flex-1 aspect-square max-w-[60px] max-h-[60px] rounded-2xl flex flex-col items-center justify-center hover:bg-slate-700 transition-colors p-1">
                      <span className="text-center leading-tight">Cần<br/>phòng</span>
                    </button>
                    <button className="bg-slate-800 text-slate-300 border border-slate-700 text-[10px] sm:text-[11px] font-medium flex-1 aspect-square max-w-[60px] max-h-[60px] rounded-2xl flex flex-col items-center justify-center hover:bg-slate-700 transition-colors p-1">
                      <span className="text-center leading-tight">Hẹn<br/>xem</span>
                    </button>
                  </div>
                  <button className="bg-blue-600 text-white text-[10px] sm:text-[11px] font-bold flex-1 aspect-square max-w-[70px] max-h-[70px] rounded-2xl flex flex-col items-center justify-center shadow-lg hover:bg-blue-500 transition-colors p-1 ml-2">
                    <CornerDownRight className="w-4 h-4 mb-0.5" />
                    <span className="text-center leading-tight">Phản hồi</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
