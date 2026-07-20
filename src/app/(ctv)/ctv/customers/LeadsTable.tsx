'use client';

import { useState, useEffect, useMemo } from 'react';
import { PhoneCall, Search, Clock, Home, CornerDownRight, CheckCircle, MessageSquare } from 'lucide-react';
import { useRouter } from 'next/navigation';
import LeadChatModal from '@/components/ctv/LeadChatModal';

export default function LeadsTable({ initialLeads, isAdmin = false }: { initialLeads: any[], isAdmin?: boolean }) {
  const [leads, setLeads] = useState(initialLeads);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [chatLead, setChatLead] = useState<any>(null);
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
    // Optimistic UI update
    const previousLeads = [...leads];
    const body: any = {};
    if (status) body.status = status;
    if (note !== undefined) body.note = note;

    setLeads(leads.map(l => l._id === id ? { ...l, ...body } : l));

    // Background fetch
    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (!res.ok) {
        setLeads(previousLeads);
        alert('Có lỗi xảy ra');
      }
    } catch(err) {
      setLeads(previousLeads);
      alert('Lỗi hệ thống');
    }
  };

  const handleQuickNote = (id: string, currentNote: string, addition: string) => {
    const newNote = currentNote ? `${currentNote}\n- ${addition}` : `- ${addition}`;
    handleUpdateStatus(id, undefined, newNote);
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins || 1} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    if (diffDays === 1) return `Hôm qua`;
    return `${diffDays} ngày trước`;
  };

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      // Lọc theo Tab
      if (activeTab === 'New' && lead.status !== 'New') return false;
      if (activeTab === 'Pending' && (lead.status === 'Success' || lead.status === 'Failed')) return false;

      // Lọc theo từ khóa
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const nameMatch = lead.name?.toLowerCase().includes(query);
        const phoneMatch = lead.phone?.toLowerCase().includes(query);
        const postMatch = lead.post_id?.title?.toLowerCase().includes(query);
        return nameMatch || phoneMatch || postMatch;
      }
      return true;
    });
  }, [leads, activeTab, searchQuery]);

  return (
    <div className="space-y-4">
      {/* Search and Tabs */}
      <div className="bg-white/80 backdrop-blur rounded-3xl p-4 space-y-4 border border-slate-200">
        <div className="relative">
          <Search className="w-5 h-5 text-slate-600 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm khách hàng, SĐT, bài đăng..." 
            className="w-full bg-transparent border-b border-slate-200 py-3 pl-10 pr-4 text-sm text-slate-800 outline-none focus:border-cyan-500 transition-colors"
          />
        </div>
        <div className="flex gap-4 overflow-x-auto pb-1 scrollbar-hide">
          <button 
            onClick={() => setActiveTab('All')}
            className={`px-5 py-2 text-sm font-bold rounded-full whitespace-nowrap transition ${activeTab === 'All' ? 'bg-orange-400 text-slate-900 shadow-lg shadow-orange-500/20' : 'text-slate-600 hover:bg-slate-200/50'}`}
          >
            Tất cả
          </button>
          <button 
            onClick={() => setActiveTab('New')}
            className={`px-5 py-2 text-sm font-bold rounded-full whitespace-nowrap transition ${activeTab === 'New' ? 'bg-orange-400 text-slate-900 shadow-lg shadow-orange-500/20' : 'text-slate-600 hover:bg-slate-200/50'}`}
          >
            Mới nhất
          </button>
          <button 
            onClick={() => setActiveTab('Pending')}
            className={`px-5 py-2 text-sm font-bold rounded-full whitespace-nowrap transition ${activeTab === 'Pending' ? 'bg-orange-400 text-slate-900 shadow-lg shadow-orange-500/20' : 'text-slate-600 hover:bg-slate-200/50'}`}
          >
            Cần xử lý
          </button>
        </div>
      </div>

      {/* Cards List */}
      <div className="space-y-4">
        {filteredLeads.length === 0 ? (
          <div className="p-8 text-center text-slate-600 bg-white/80 rounded-3xl border border-slate-200">
            Không tìm thấy kết quả nào phù hợp.
          </div>
        ) : (
          filteredLeads.map((lead) => {
            const isNew = lead.status === 'New';
            const isContacted = lead.status === 'Contacted';
            const isSuccess = lead.status === 'Success';
            const initial = lead.name ? lead.name.charAt(0).toUpperCase() : 'U';

            return (
              <div key={lead._id} className={`bg-white/80 backdrop-blur rounded-3xl p-5 border border-slate-200 shadow-sm relative overflow-hidden transition-all ${loadingId === lead._id ? 'opacity-50 pointer-events-none' : ''}`}>
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-emerald-600 text-slate-900 rounded-full flex items-center justify-center font-bold text-xl">
                      {initial}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-lg">{lead.name}</h3>
                      <div className="flex items-center gap-2 text-slate-600 text-xs">
                        <Clock className="w-3.5 h-3.5" /> {getTimeAgo(lead.createdAt)}
                      </div>
                      <div className="flex items-center gap-2 text-blue-400 font-medium text-sm mt-0.5">
                        <PhoneCall className="w-3.5 h-3.5" /> {lead.phone} <span className="text-slate-500 text-xs">• Zalo</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {isNew && <span className="bg-red-600 text-slate-900 text-[10px] font-bold px-2 py-1 rounded">! ƯU TIÊN</span>}
                    {isNew && <span className="bg-red-500/20 text-red-400 border border-red-500/20 text-[10px] font-bold px-2 py-1 rounded">MỚI</span>}
                    {isContacted && <span className="bg-slate-100 text-slate-700 border border-slate-300 text-[10px] font-bold px-2 py-1 rounded">ĐÃ PHẢN HỒI</span>}
                    {isSuccess && <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1"><CheckCircle className="w-3 h-3"/> HOÀN THÀNH</span>}
                  </div>
                </div>

                {/* Post Info */}
                <div className="bg-indigo-50/50 rounded-xl p-3 mb-4 border border-indigo-100">
                  <p className="text-[10px] font-bold text-slate-500 mb-1">QUAN TÂM ĐẾN</p>
                  <p className="font-bold text-slate-800 text-sm line-clamp-1">{lead.post_id?.title || 'Bài viết đã bị xóa'}</p>
                  <div className="flex gap-2 mt-2">
                    <div className="flex items-center gap-1 bg-white border border-slate-200 px-2 py-0.5 rounded text-xs text-slate-700">
                      <Home className="w-3 h-3 text-indigo-500" /> {lead.post_id?.property_type === 'Căn hộ chung cư' ? 'Căn hộ' : 'Phòng trọ'}
                    </div>
                  </div>
                  {(lead.last_message || lead.message) && (
                    <div className="mt-3 pt-3 border-t border-indigo-100 flex items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-bold text-slate-500 mb-1">TIN NHẮN GẦN NHẤT</p>
                        <p className="text-sm text-slate-700 italic truncate">"{lead.last_message || lead.message}"</p>
                      </div>
                      <button 
                        onClick={() => setChatLead(lead)}
                        className="bg-cyan-500 text-white shadow-sm hover:bg-cyan-600 px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0"
                      >
                        <MessageSquare className="w-4 h-4" /> Mở Chat
                      </button>
                    </div>
                  )}
                  {!(lead.last_message || lead.message) && (
                    <div className="mt-3 pt-3 border-t border-indigo-100">
                      <button 
                        onClick={() => setChatLead(lead)}
                        className="bg-cyan-50 text-cyan-700 border border-cyan-200 hover:bg-cyan-100 px-3 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 w-full"
                      >
                        <MessageSquare className="w-4 h-4" /> Nhắn tin cho khách
                      </button>
                    </div>
                  )}
                </div>

                {/* Internal Note */}
                <div className="relative mb-4">
                  <div className="absolute top-3 left-3 bg-slate-100 p-1 rounded-full text-slate-600">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <textarea 
                    value={lead.note || ''}
                    onChange={(e) => {
                      setLeads(leads.map(l => l._id === lead._id ? { ...l, note: e.target.value } : l));
                    }}
                    onBlur={(e) => {
                      const originalLead = initialLeads.find(l => l._id === lead._id);
                      if (e.target.value !== originalLead?.note) {
                        handleUpdateStatus(lead._id, undefined, e.target.value);
                      }
                    }}
                    placeholder="Nhập ghi chú tại đây..."
                    className="w-full bg-slate-50/50 border border-slate-200 border-dashed rounded-xl py-3 pl-10 pr-3 text-sm text-slate-700 outline-none focus:border-cyan-500 focus:bg-white resize-none h-20 placeholder:italic"
                  />
                  <p className="text-[10px] font-bold text-slate-500 absolute top-[-6px] left-4 bg-white px-1">GHI CHÚ NỘI BỘ</p>
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
                    <button 
                      onClick={() => handleQuickNote(lead._id, lead.note || '', 'Khách báo đang cần tìm phòng gấp.')}
                      className="bg-slate-100 text-slate-700 border border-slate-300 text-[10px] sm:text-[11px] font-medium flex-1 aspect-square max-w-[60px] max-h-[60px] rounded-2xl flex flex-col items-center justify-center hover:bg-slate-700 hover:text-white transition-colors p-1"
                    >
                      <span className="text-center leading-tight">Cần<br/>phòng</span>
                    </button>
                    <button 
                      onClick={() => handleQuickNote(lead._id, lead.note || '', 'Khách đã hẹn lịch qua xem thực tế.')}
                      className="bg-slate-100 text-slate-700 border border-slate-300 text-[10px] sm:text-[11px] font-medium flex-1 aspect-square max-w-[60px] max-h-[60px] rounded-2xl flex flex-col items-center justify-center hover:bg-slate-700 hover:text-white transition-colors p-1"
                    >
                      <span className="text-center leading-tight">Hẹn<br/>xem</span>
                    </button>
                  </div>
                  <a 
                    href={`https://zalo.me/${lead.phone}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      if (lead.status === 'New') {
                        handleUpdateStatus(lead._id, 'Contacted');
                      }
                    }}
                    className="bg-blue-600 text-slate-900 text-[10px] sm:text-[11px] font-bold flex-1 aspect-square max-w-[70px] max-h-[70px] rounded-2xl flex flex-col items-center justify-center shadow-lg hover:bg-blue-500 transition-colors p-1 ml-2"
                  >
                    <CornerDownRight className="w-4 h-4 mb-0.5" />
                    <span className="text-center leading-tight">Zalo</span>
                  </a>
                </div>
              </div>
            );
          })
        )}
      </div>
      {chatLead && <LeadChatModal lead={chatLead} onClose={() => setChatLead(null)} />}
    </div>
  );
}
