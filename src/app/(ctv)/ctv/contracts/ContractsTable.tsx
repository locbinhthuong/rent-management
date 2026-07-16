'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Loader2, Plus, FileText, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function ContractsTable() {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: contracts = [], isLoading } = useQuery({
    queryKey: ['ctv-contracts'],
    queryFn: async () => {
      const res = await fetch('/api/ctv/contracts');
      if (!res.ok) throw new Error('Failed to fetch');
      return res.json();
    }
  });

  if (isLoading) {
    return <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-cyan-500" /></div>;
  }

  const filteredContracts = contracts.filter((c: any) => 
    c.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.customer_phone.includes(searchTerm)
  );

  return (
    <div className="space-y-4">
      {/* Search & Actions */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Tìm theo tên khách, SĐT..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none"
          />
        </div>
        
        {/* Create Contract is usually triggered from LeadsTable, but we can have a button here */}
        <Link href="/ctv/customers">
          <Button className="bg-cyan-500 hover:bg-cyan-600 text-white gap-2 rounded-xl">
            <Plus className="w-4 h-4" /> Tạo Hợp Đồng Mới
          </Button>
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-sm">
                <th className="p-4 font-semibold">Khách Hàng</th>
                <th className="p-4 font-semibold">Phòng Thuê</th>
                <th className="p-4 font-semibold">Thời Hạn</th>
                <th className="p-4 font-semibold">Tiền Cọc & Thuê</th>
                <th className="p-4 font-semibold">Trạng Thái</th>
                <th className="p-4 font-semibold">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredContracts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center">
                      <FileText className="w-12 h-12 text-slate-300 mb-3" />
                      <p>Chưa có hợp đồng nào</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredContracts.map((contract: any) => (
                  <tr key={contract._id} className="border-b border-slate-100 hover:bg-slate-50/50 transition">
                    <td className="p-4">
                      <div className="font-bold text-slate-900">{contract.customer_name}</div>
                      <div className="text-sm text-slate-500">{contract.customer_phone}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm font-medium text-slate-800 line-clamp-1 max-w-[200px]">
                        {contract.property_id?.title || 'Phòng đã xóa'}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm text-slate-600">
                        Từ: <span className="font-medium text-slate-800">{format(new Date(contract.start_date), 'dd/MM/yyyy')}</span>
                      </div>
                      <div className="text-sm text-slate-600">
                        Đến: <span className="font-medium text-slate-800">{format(new Date(contract.end_date), 'dd/MM/yyyy')}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm text-slate-600">
                        Cọc: <span className="font-bold text-emerald-600">{contract.deposit_amount?.toLocaleString()}đ</span>
                      </div>
                      <div className="text-sm text-slate-600">
                        Thuê: <span className="font-bold text-cyan-600">{contract.monthly_rent?.toLocaleString()}đ</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                        contract.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 
                        contract.status === 'Expired' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {contract.status === 'Active' ? 'Đang hiệu lực' : contract.status === 'Expired' ? 'Hết hạn' : 'Đã hủy'}
                      </span>
                    </td>
                    <td className="p-4">
                      <Button variant="ghost" size="sm" className="text-blue-500 hover:text-blue-600 hover:bg-blue-50">
                        Chi tiết
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
