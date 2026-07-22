import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import connectDB from '@/lib/db';
import SystemConfig from '@/models/SystemConfig';
import ContactForm from '@/components/ContactForm';

export default async function LienHePage() {
  await connectDB();
  const config = await SystemConfig.findOne().lean();
  const contact = config?.contact || {};

  return (
    <main className="min-h-screen bg-slate-50 pt-8 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-500 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Về trang chủ
        </Link>
        
        <ContactForm contactInfo={contact} />
      </div>
    </main>
  );
}
