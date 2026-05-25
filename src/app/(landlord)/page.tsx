import React from 'react';

export default function LandlordDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border shadow-sm">
          <h3 className="text-slate-500 text-sm font-medium">Tổng doanh thu</h3>
          <p className="text-3xl font-bold text-slate-900 mt-2">24.500.000đ</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border shadow-sm">
          <h3 className="text-slate-500 text-sm font-medium">Phòng đang thuê</h3>
          <p className="text-3xl font-bold text-slate-900 mt-2">12 / 15</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border shadow-sm">
          <h3 className="text-slate-500 text-sm font-medium">Yêu cầu duyệt cọc</h3>
          <p className="text-3xl font-bold text-amber-600 mt-2">2 chờ duyệt</p>
        </div>
      </div>
      
      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold">Giao dịch gần đây</h2>
        </div>
        <div className="p-6 text-center text-slate-500">
          Chưa có giao dịch nào được ghi nhận.
        </div>
      </div>
    </div>
  );
}
