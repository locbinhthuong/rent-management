import React from 'react';

export default function CTVLeadsPage() {
  // Mock data for demonstration. In reality, fetch from /api/leads
  const leads = [
    { id: 1, name: 'Nguyễn Văn Khách', phone: '0901234567', postTitle: 'Phòng trọ sinh viên Gò Vấp', status: 'New', time: '10 phút trước' },
    { id: 2, name: 'Trần Thị Thuê', phone: '0939888999', postTitle: 'Chung cư mini Quận 7', status: 'Contacted', time: '2 giờ trước' },
  ];

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Danh sách Khách Hàng Tiềm Năng (Leads)</h1>
          <p className="text-slate-500 mt-1">Quản lý những khách hàng đã bấm lấy số điện thoại của bạn.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="px-6 py-4 font-semibold text-sm text-slate-600">Khách hàng</th>
              <th className="px-6 py-4 font-semibold text-sm text-slate-600">Số điện thoại</th>
              <th className="px-6 py-4 font-semibold text-sm text-slate-600">Phòng quan tâm</th>
              <th className="px-6 py-4 font-semibold text-sm text-slate-600">Trạng thái</th>
              <th className="px-6 py-4 font-semibold text-sm text-slate-600">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {leads.map((lead) => (
              <tr key={lead.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-900">{lead.name}</td>
                <td className="px-6 py-4 font-bold text-indigo-600">{lead.phone}</td>
                <td className="px-6 py-4 text-slate-600">{lead.postTitle}</td>
                <td className="px-6 py-4">
                  {lead.status === 'New' && <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Mới</span>}
                  {lead.status === 'Contacted' && <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">Đang trao đổi</span>}
                </td>
                <td className="px-6 py-4">
                  <button className="text-sm font-medium text-indigo-600 hover:text-indigo-800">Báo cáo chốt đơn</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
