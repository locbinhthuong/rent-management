'use client';

import { useState, useEffect } from 'react';
import { PhoneCall, CheckCircle, XCircle, DollarSign } from 'lucide-react';
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

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-800/50 text-slate-300 border-b border-white/10">
          <tr>
            <th className="px-6 py-4 font-medium">Khách hàng</th>
            <th className="px-6 py-4 font-medium">Liên hệ</th>
            {isAdmin && <th className="px-6 py-4 font-medium">Người quản lý (CTV)</th>}
            <th className="px-6 py-4 font-medium">Phòng quan tâm</th>
            <th className="px-6 py-4 font-medium">Trạng thái</th>
            <th className="px-6 py-4 font-medium">Ghi chú</th>
            <th className="px-6 py-4 font-medium text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/10">
          {leads.length === 0 ? (
            <tr>
              <td colSpan={isAdmin ? 6 : 5} className="px-6 py-8 text-center text-slate-400">
                Chưa có khách hàng nào để lại thông tin.
              </td>
            </tr>
          ) : (
            leads.map((lead) => (
              <tr key={lead._id} className="hover:bg-white/5 transition">
                <td className="px-6 py-4 font-bold text-slate-100">{lead.name}</td>
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-100">{lead.phone}</div>
                  <div className="text-xs text-slate-400">{new Date(lead.createdAt).toLocaleDateString('vi-VN')}</div>
                </td>
                {isAdmin && (
                  <td className="px-6 py-4">
                    <div className="font-bold text-cyan-400">{lead.ctv_id?.name || 'N/A'}</div>
                    <div className="text-xs text-slate-400">{lead.ctv_id?.phone}</div>
                  </td>
                )}
                <td className="px-6 py-4 text-slate-300">
                  {lead.post_id?.title || 'Bài viết đã bị xóa'}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                    lead.status === 'New' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                    lead.status === 'Contacted' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                    lead.status === 'Success' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                    'bg-red-500/10 text-red-400 border-red-500/20'
                  }`}>
                    {lead.status === 'New' ? 'Mới' :
                     lead.status === 'Contacted' ? 'Đã gọi tư vấn' :
                     lead.status === 'Success' ? 'Chốt thành công' : 'Thất bại'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <input 
                    type="text" 
                    defaultValue={lead.note || ''}
                    onBlur={(e) => {
                      if (e.target.value !== lead.note) {
                        handleUpdateStatus(lead._id, undefined, e.target.value);
                      }
                    }}
                    placeholder="Nhập ghi chú..."
                    className="w-full px-3 py-1.5 bg-slate-900 border border-white/20 rounded-lg text-sm text-slate-100 focus:ring-2 focus:ring-cyan-500/50 outline-none placeholder:text-slate-500"
                  />
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <a href={`tel:${lead.phone}`} className="inline-flex text-cyan-400 hover:bg-cyan-500/20 p-2 rounded-lg transition tooltip" title="Gọi ngay">
                    <PhoneCall className="w-5 h-5" />
                  </a>
                  {lead.status === 'New' && (
                    <button onClick={() => handleUpdateStatus(lead._id, 'Contacted')} className="text-blue-400 hover:bg-blue-500/20 p-2 rounded-lg transition tooltip" title="Đánh dấu đã gọi">
                      <CheckCircle className="w-5 h-5" />
                    </button>
                  )}
                  {lead.status === 'Contacted' && (
                    <>
                      <button onClick={() => handleUpdateStatus(lead._id, 'Success')} className="text-emerald-400 hover:bg-emerald-500/20 p-2 rounded-lg transition tooltip" title="Chốt thành công">
                        <DollarSign className="w-5 h-5" />
                      </button>
                      <button onClick={() => handleUpdateStatus(lead._id, 'Failed')} className="text-red-400 hover:bg-red-500/20 p-2 rounded-lg transition tooltip" title="Khách hủy">
                        <XCircle className="w-5 h-5" />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
