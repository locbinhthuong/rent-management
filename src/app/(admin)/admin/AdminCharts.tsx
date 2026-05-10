'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function AdminCharts({ leadStats }: { leadStats: any[] }) {
  const COLORS = ['#10b981', '#f59e0b', '#3b82f6', '#ef4444'];
  
  // Xử lý data cho PieChart
  const pieData = leadStats.map(item => ({
    name: item._id === 'Success' ? 'Chốt thành công' : 
          item._id === 'Contacted' ? 'Đã liên hệ' :
          item._id === 'New' ? 'Mới' : 'Thất bại',
    value: item.count
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-white p-6 border border-slate-100 rounded-xl shadow-sm">
        <h4 className="font-bold text-slate-800 mb-6 text-center">Tỷ lệ chuyển đổi Khách hàng (Leads)</h4>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} Khách`, 'Số lượng']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="bg-white p-6 border border-slate-100 rounded-xl shadow-sm">
        <h4 className="font-bold text-slate-800 mb-6 text-center">Biểu đồ Trạng thái (Bar Chart)</h4>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={pieData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip cursor={{fill: '#f8fafc'}} formatter={(value) => [`${value} Khách`, 'Số lượng']} />
              <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
