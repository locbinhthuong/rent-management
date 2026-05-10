'use client';

import { useState, useEffect } from 'react';
import { PhoneCall, CheckCircle, XCircle, DollarSign } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LeadsTable({ initialLeads }: { initialLeads: any[] }) {
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

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        setLeads(leads.map(l => l._id === id ? { ...l, status } : l));
        router.refresh();
      }
    } catch(err) {
      alert('Lỗi hệ thống');
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
          <tr>
            <th className="px-6 py-4 font-medium">Khách hàng</th>
            <th className="px-6 py-4 font-medium">Liên hệ</th>
            <th className="px-6 py-4 font-medium">Phòng quan tâm</th>
            <th className="px-6 py-4 font-medium">Trạng thái</th>
            <th className="px-6 py-4 font-medium text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {leads.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                Chưa có khách hàng nào để lại thông tin.
              </td>
            </tr>
          ) : (
            leads.map((lead) => (
              <tr key={lead._id} className="hover:bg-slate-50 transition">
                <td className="px-6 py-4 font-bold text-slate-800">{lead.name}</td>
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-800">{lead.phone}</div>
                  <div className="text-xs text-slate-500">{new Date(lead.createdAt).toLocaleDateString('vi-VN')}</div>
                </td>
                <td className="px-6 py-4 text-slate-600">
                  {lead.post_id?.title || 'Bài viết đã bị xóa'}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                    lead.status === 'New' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                    lead.status === 'Contacted' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                    lead.status === 'Success' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                    'bg-red-50 text-red-700 border-red-200'
                  }`}>
                    {lead.status === 'New' ? 'Mới' :
                     lead.status === 'Contacted' ? 'Đã gọi tư vấn' :
                     lead.status === 'Success' ? 'Chốt thành công' : 'Thất bại'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <a href={`tel:${lead.phone}`} className="inline-flex text-indigo-600 hover:bg-indigo-50 p-2 rounded-lg transition tooltip" title="Gọi ngay">
                    <PhoneCall className="w-5 h-5" />
                  </a>
                  {lead.status === 'New' && (
                    <button onClick={() => handleUpdateStatus(lead._id, 'Contacted')} className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition tooltip" title="Đánh dấu đã gọi">
                      <CheckCircle className="w-5 h-5" />
                    </button>
                  )}
                  {lead.status === 'Contacted' && (
                    <>
                      <button onClick={() => handleUpdateStatus(lead._id, 'Success')} className="text-emerald-600 hover:bg-emerald-50 p-2 rounded-lg transition tooltip" title="Chốt thành công">
                        <DollarSign className="w-5 h-5" />
                      </button>
                      <button onClick={() => handleUpdateStatus(lead._id, 'Failed')} className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition tooltip" title="Khách hủy">
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
