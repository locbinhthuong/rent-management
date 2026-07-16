'use client';
import { useState, useEffect } from 'react';

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/admin/categories');
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description }),
      });
      setName('');
      setDescription('');
      fetchCategories();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xoá?')) return;
    try {
      await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' });
      fetchCategories();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Quản Lý Danh Mục</h1>
      
      <div className="bg-white p-4 rounded-lg shadow-sm border mb-8">
        <h2 className="font-semibold mb-4">Thêm danh mục mới</h2>
        <form onSubmit={handleCreate} className="flex gap-4">
          <input 
            type="text" 
            placeholder="Tên danh mục..." 
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-2 rounded flex-1"
            required
          />
          <input 
            type="text" 
            placeholder="Mô tả..." 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
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
              <th className="p-4">Tên</th>
              <th className="p-4">Slug</th>
              <th className="p-4">Mô tả</th>
              <th className="p-4">Trạng thái</th>
              <th className="p-4 w-24">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="p-4 text-center">Đang tải...</td></tr>
            ) : categories.map((cat: any) => (
              <tr key={cat._id} className="border-b last:border-0 hover:bg-gray-50">
                <td className="p-4 font-medium">{cat.name}</td>
                <td className="p-4 text-gray-500">{cat.slug}</td>
                <td className="p-4 text-gray-500">{cat.description}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs ${cat.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {cat.isActive ? 'Hoạt động' : 'Đã khóa'}
                  </span>
                </td>
                <td className="p-4">
                  <button onClick={() => handleDelete(cat._id)} className="text-red-500 hover:text-red-700 text-sm font-medium">
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
