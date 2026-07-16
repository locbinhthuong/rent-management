'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// Mock data based on the screenshot
const mockMessages = [
  {
    id: 1,
    title: 'Cho thuê Nhà Nguyên Căn',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop',
    time: '10:30, 20/10',
    content: 'Tôi muốn đi xem thực tế căn này, bao giờ bạn rảnh?',
    status: 'Đang chờ', // Pending
    statusColor: 'text-amber-400 bg-amber-400/20 border-amber-400/30'
  },
  {
    id: 2,
    title: 'Phòng trọ cao cấp Quận 7',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1de2c1ffaa?q=80&w=2070&auto=format&fit=crop',
    time: '14:15, 18/10',
    content: 'Giá này có bớt được không bạn? Mình thuê dài hạn.',
    status: 'Đã phản hồi', // Responded
    statusColor: 'text-emerald-400 bg-emerald-400/20 border-emerald-400/30'
  }
];

export default function MessagesPage() {
  const [activeTab, setActiveTab] = useState('Tất cả');

  const tabs = ['Tất cả', 'Đang chờ', 'Đã phản hồi'];

  const filteredMessages = mockMessages.filter(msg => {
    if (activeTab === 'Tất cả') return true;
    return msg.status === activeTab;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* App Header */}
      <header className="sticky top-0 z-50 bg-slate-50/80 backdrop-blur-xl border-b border-slate-200 h-16 flex items-center justify-center px-4">
        <h1 className="text-lg font-space font-bold tracking-wide">Danh sách tư vấn</h1>
      </header>

      <main className="flex-1 w-full max-w-2xl mx-auto px-4 py-4 flex flex-col">
        
        {/* Tabs */}
        <div className="flex bg-white p-1 rounded-xl mb-6 shadow-inner border border-slate-200">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
                activeTab === tab 
                  ? 'bg-slate-100 text-cyan-400 shadow-sm border border-slate-200' 
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="flex flex-col gap-4">
          {filteredMessages.length === 0 ? (
            <div className="text-center py-20 text-slate-500 font-medium">
              Không có tin nhắn nào
            </div>
          ) : (
            filteredMessages.map((msg) => (
              <div key={msg.id} className="bg-white/80 backdrop-blur border border-slate-200 rounded-2xl p-4 flex gap-4 cursor-pointer hover:bg-slate-100/80 transition-colors">
                <div className="w-14 h-14 rounded-full overflow-hidden shrink-0 relative border border-slate-300">
                  <Image src={msg.image} alt={msg.title} fill className="object-cover" />
                </div>
                
                <div className="flex-1 min-w-0 flex flex-col gap-1">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-bold text-slate-800 text-sm md:text-base line-clamp-1">{msg.title}</h3>
                    <span className="text-slate-500 text-[10px] md:text-xs whitespace-nowrap shrink-0">{msg.time}</span>
                  </div>
                  
                  <p className="text-slate-600 text-xs md:text-sm line-clamp-2 leading-relaxed">
                    &quot;{msg.content}&quot;
                  </p>
                  
                  <div className="mt-2 flex">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-md border ${msg.statusColor}`}>
                      {msg.status}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

      </main>
    </div>
  );
}
