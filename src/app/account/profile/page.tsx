import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import ProfileForm from '@/components/ProfileForm';

export default async function CustomerProfilePage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200 h-16 flex items-center px-4">
        <Link href="/account" className="p-2 -ml-2 text-slate-600 hover:text-slate-900 transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-lg font-space font-bold tracking-wide ml-2">Thông tin cá nhân</h1>
      </header>
      
      <main className="max-w-xl mx-auto p-4 mt-4">
        <ProfileForm />
      </main>
    </div>
  );
}
