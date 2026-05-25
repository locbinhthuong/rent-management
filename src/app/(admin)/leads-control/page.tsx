import React from 'react';
import { Phone, CheckCircle, AlertTriangle } from 'lucide-react';

export default function AdminLeadsControlPage() {
  // Mock data representing the real-time "Mắt Thần" (Lead Tracking)
  const allLeads = [
    { id: 101, ctvName: 'Nguyễn Văn C', ctvPhone: '0900000001', customerName: 'Khách A', customerPhone: '0911111111', postTitle: 'Phòng Q7', status: 'Success', commission: '3,000,000đ', time: 'Hôm nay' },
    { id: 102, ctvName: 'Trần Thị D', ctvPhone: '0900000002', customerName: 'Khách B', customerPhone: '0922222222', postTitle: 'Mini House Gò Vấp', status: 'Failed', commission: '0đ', time: 'Hôm qua' },
    { id: 103, ctvName: 'Lê Văn E', ctvPhone: '0900000003', customerName: 'Khách C', customerPhone: '0933333333', postTitle: 'Phòng Tân Bình', status: 'Contacted', commission: '0đ', time: 'Vừa xong' },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Kiểm Soát Giao Dịch (Chống Cắt Cò)</h1>
          <p className="text-slate-500 mt-1">Hệ thống theo dõi toàn bộ luồng khách hàng xin số điện thoại CTV.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border shadow-sm border-l-4 border-l-blue-500">
          <h3 className="text-slate-500 text-sm font-medium">Đang thương lượng</h3>
          <p className="text-3xl font-bold text-slate-900 mt-2">15</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border shadow-sm border-l-4 border-l-emerald-500">
          <h3 className="text-slate-500 text-sm font-medium">Chốt thành công</h3>
          <p className="text-3xl font-bold text-slate-900 mt-2">42</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border shadow-sm border-l-4 border-l-rose-500">
          <h3 className="text-slate-500 text-sm font-medium">Báo thất bại (Cần Check)</h3>
          <p className="text-3xl font-bold text-slate-900 mt-2">8</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="px-6 py-4 font-semibold text-sm text-slate-600">Khách hàng</th>
              <th className="px-6 py-4 font-semibold text-sm text-slate-600">Cộng tác viên</th>
              <th className="px-6 py-4 font-semibold text-sm text-slate-600">Phòng quan tâm</th>
              <th className="px-6 py-4 font-semibold text-sm text-slate-600">Trạng thái (CTV báo)</th>
              <th className="px-6 py-4 font-semibold text-sm text-slate-600">Kiểm tra chéo (Admin)</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {allLeads.map((lead) => (
              <tr key={lead.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-900">{lead.customerName}</div>
                  <div className="text-sm font-bold text-indigo-600">{lead.customerPhone}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-700">{lead.ctvName}</div>
                  <div className="text-sm text-slate-500">{lead.ctvPhone}</div>
                </td>
                <td className="px-6 py-4 text-slate-600">{lead.postTitle}</td>
                <td className="px-6 py-4">
                  {lead.status === 'Success' && <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800"><CheckCircle className="w-3 h-3 mr-1"/> Đã chốt cọc ({lead.commission})</span>}
                  {lead.status === 'Failed' && <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-rose-100 text-rose-800"><AlertTriangle className="w-3 h-3 mr-1"/> Báo rớt</span>}
                  {lead.status === 'Contacted' && <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">Đang trao đổi</span>}
                </td>
                <td className="px-6 py-4">
                  <button className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-indigo-600 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm">
                    <Phone className="w-4 h-4" />
                    Gọi Khách
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
