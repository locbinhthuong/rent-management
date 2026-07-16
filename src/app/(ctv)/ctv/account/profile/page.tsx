import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import ProfileForm from '@/components/ProfileForm';

export default async function CTVProfilePage() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== 'CTV') {
    redirect('/login');
  }

  return (
    <div className="flex-1 bg-slate-50 min-h-screen overflow-y-auto pb-24 md:pb-12">
      <div className="max-w-3xl mx-auto px-4 mt-6 space-y-6">
        <div className="flex items-center mb-6">
          <Link href="/ctv/account" className="mr-4 p-2 bg-white rounded-full shadow-sm hover:bg-slate-100 transition">
            <ArrowLeft className="w-5 h-5 text-slate-700" />
          </Link>
          <h1 className="text-2xl font-bold text-slate-900 font-space tracking-wide">Thông tin cá nhân</h1>
        </div>
        
        <ProfileForm />
      </div>
    </div>
  );
}
