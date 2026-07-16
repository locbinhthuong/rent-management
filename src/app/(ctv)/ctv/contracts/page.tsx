import CTVMobileHeader from '@/components/ctv/CTVMobileHeader';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import ContractsTable from './ContractsTable';

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

        <ContractsTable />
      </div>
    </main>
  );
}
