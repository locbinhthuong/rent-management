import CTVMobileHeader from '@/components/ctv/CTVMobileHeader';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function CTVContractsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== 'CTV') {
    redirect('/login');
  }

  return (
    <main className="flex-1 bg-slate-50 min-h-screen overflow-y-auto pb-24 md:pb-12">
      <div className="max-w-6xl mx-auto px-4 mt-6 space-y-6">
        <CTVMobileHeader title="Hợp đồng thuê" />
        
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-space tracking-wide">Hợp đồng thuê phòng</h1>
          <p className="text-slate-600 text-sm mt-1">Quản lý các hợp đồng đã chốt với khách hàng.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center mt-8">
          <div className="w-16 h-16 bg-cyan-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-cyan-100">
            <span className="text-2xl">🚧</span>
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Tính năng đang được cập nhật</h2>
          <p className="text-slate-500 max-w-md mx-auto">
            Hệ thống quản lý hợp đồng thuê phòng đang trong quá trình phát triển và sẽ sớm ra mắt trong thời gian tới. Vui lòng quay lại sau!
          </p>
        </div>
      </div>
    </main>
  );
}
