'use client';
import { useState, useEffect } from 'react';

export default function AmenitiesPage() {
  const [amenities, setAmenities] = useState([]);
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchAmenities = async () => {
    try {
      const res = await fetch('/api/admin/amenities');
      const data = await res.json();
      setAmenities(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAmenities();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/admin/amenities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, icon }),
      });
      setName('');
      setIcon('');
      fetchAmenities();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xoá?')) return;
    try {
      await fetch(`/api/admin/amenities/${id}`, { method: 'DELETE' });
      fetchAmenities();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Quản Lý Tiện Ích</h1>
      
      <div className="bg-white p-4 rounded-lg shadow-sm border mb-8">
        <h2 className="font-semibold mb-4">Thêm tiện ích mới</h2>
        <form onSubmit={handleCreate} className="flex gap-4">
          <input 
            type="text" 
            placeholder="Tên tiện ích (vd: Wifi, Máy lạnh)..." 
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-2 rounded flex-1"
            required
          />
          <input 
            type="text" 
            placeholder="Tên icon (vd: wifi, tv)..." 
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
            className="border p-2 rounded flex-1"
          />
          <button type="submit" className="bg-emerald-500 text-white px-4 py-2 rounded font-medium hover:bg-emerald-600">
            Thêm mới
          </button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4">Tên tiện ích</th>
              <th className="p-4">Icon</th>
              <th className="p-4">Trạng thái</th>
              <th className="p-4 w-24">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} className="p-4 text-center">Đang tải...</td></tr>
            ) : amenities.map((amenity: any) => (
              <tr key={amenity._id} className="border-b last:border-0 hover:bg-gray-50">
                <td className="p-4 font-medium">{amenity.name}</td>
                <td className="p-4 text-gray-500">{amenity.icon || '-'}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs ${amenity.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {amenity.isActive ? 'Hoạt động' : 'Đã khóa'}
                  </span>
                </td>
                <td className="p-4">
                  <button onClick={() => handleDelete(amenity._id)} className="text-red-500 hover:text-red-700 text-sm font-medium">
                    Xoá
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
