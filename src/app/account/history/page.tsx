import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/db';
import Lead from '@/models/Lead';
import Post from '@/models/Post';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Clock, MapPin, Search, Loader2 } from 'lucide-react';
import { Suspense } from 'react';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function HistoryPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-12">
      {/* App Header */}
      <header className="sticky top-0 z-50 bg-slate-50/80 backdrop-blur-xl border-b border-slate-200 h-16 flex items-center px-4">
        <Link href="/account" className="p-2 -ml-2 rounded-full hover:bg-slate-200 transition-colors text-slate-600">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-lg font-space font-bold tracking-wide ml-2 flex-1 text-center pr-9">Lịch sử tư vấn</h1>
      </header>

      <Suspense fallback={
        <main className="max-w-2xl mx-auto px-4 mt-12 flex flex-col items-center justify-center">
          <Loader2 className="w-10 h-10 text-cyan-500 animate-spin mb-4" />
          <p className="text-slate-500 font-medium animate-pulse">Đang tải lịch sử...</p>
        </main>
      }>
        <HistoryContent userId={session.user.id || (session.user as any)._id} />
      </Suspense>
    </div>
  );
}

async function HistoryContent({ userId }: { userId: string }) {
  await connectDB();
  Post.init(); // Ensure Post model is registered

  let leads = [];
  
  if (userId) {
    leads = await Lead.find({ customer_id: userId })
      .populate('post_id')
      .sort({ createdAt: -1 })
      .lean();
  }

  return (
    <main className="max-w-2xl mx-auto px-4 mt-6">
        
        {leads.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm flex flex-col items-center justify-center text-center h-[50vh]">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <Clock className="w-10 h-10 text-slate-300" />
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">Chưa có lịch sử</h2>
            <p className="text-slate-500 mb-6 max-w-xs">
              Bạn chưa gửi yêu cầu tư vấn phòng nào. Hãy khám phá các phòng trọ tuyệt vời trên hệ thống nhé!
            </p>
            <Link 
              href="/"
              className="bg-cyan-500 hover:bg-cyan-400 text-white font-bold py-3 px-6 rounded-full shadow-lg shadow-cyan-500/30 transition-all flex items-center gap-2"
            >
              <Search className="w-5 h-5" />
              Tìm phòng ngay
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {leads.map((lead: any) => {
              const post = lead.post_id;
              const statusColors: any = {
                'New': 'bg-blue-100 text-blue-600',
                'Contacted': 'bg-amber-100 text-amber-600',
                'Success': 'bg-emerald-100 text-emerald-600',
                'Failed': 'bg-rose-100 text-rose-600'
              };
              const statusNames: any = {
                'New': 'Đang chờ',
                'Contacted': 'Đã liên hệ',
                'Success': 'Đã chốt',
                'Failed': 'Thất bại'
              };

              return (
                <div key={lead._id.toString()} className="bg-white border border-slate-200 rounded-3xl p-4 shadow-sm flex gap-4">
                  <div className="relative w-24 h-24 rounded-2xl overflow-hidden shrink-0 bg-slate-100 border border-slate-200">
                    {post?.images?.[0] ? (
                      <Image src={post.images[0]} alt="Phòng" fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">No Image</div>
                    )}
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-center">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-slate-800 line-clamp-1 flex-1 font-space">{post?.title || 'Phòng trọ đã xóa'}</h3>
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-full whitespace-nowrap ml-2 uppercase ${statusColors[lead.status] || statusColors['New']}`}>
                        {statusNames[lead.status] || lead.status}
                      </span>
                    </div>
                    
                    {post && (
                      <p className="text-slate-500 text-xs flex items-center gap-1 mb-2 line-clamp-1">
                        <MapPin className="w-3 h-3 shrink-0" />
                        {post.district}, {post.city}
                      </p>
                    )}
                    
                    <p className="text-xs text-slate-400 mt-auto flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      Yêu cầu lúc: {new Date(lead.createdAt).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

    </main>
  );
}
