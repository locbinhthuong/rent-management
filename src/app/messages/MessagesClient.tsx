'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ImageIcon } from 'lucide-react';

interface LeadProps {
  id: string;
  title: string;
  image: string;
  time: string;
  content: string;
  status: string;
  statusColor: string;
  customerName?: string;
}

export default function MessagesClient({ leads }: { leads: LeadProps[] }) {
  const [activeTab, setActiveTab] = useState('Tất cả');

  const tabs = ['Tất cả', 'Đang chờ', 'Đã phản hồi'];

  // Map "New" to "Đang chờ", "Contacted"/"Success" to "Đã phản hồi"
  const getMappedStatus = (status: string) => {
    if (status === 'New') return 'Đang chờ';
    return 'Đã phản hồi';
  };

  const filteredLeads = leads.filter(lead => {
    if (activeTab === 'Tất cả') return true;
    return getMappedStatus(lead.status) === activeTab;
  });

  return (
    <>
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

      <div className="flex flex-col gap-4">
        {filteredLeads.length === 0 ? (
          <div className="text-center py-20 text-slate-500 font-medium">
            Không có yêu cầu tư vấn nào.
          </div>
        ) : (
          filteredLeads.map((lead) => (
            <Link href={`/messages/${lead.id}`} key={lead.id} className="bg-white/80 backdrop-blur border border-slate-200 rounded-2xl p-4 flex gap-4 cursor-pointer hover:bg-slate-100/80 transition-colors block">
              <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden shrink-0 relative border border-slate-300">
                {lead.image ? (
                  <Image src={lead.image} alt={lead.title} fill className="object-cover" />
                ) : (
                  <ImageIcon className="w-6 h-6 text-slate-400" />
                )}
              </div>
              
              <div className="flex-1 min-w-0 flex flex-col gap-1">
                <div className="flex justify-between items-start gap-2">
                  <h3 className="font-bold text-slate-800 text-sm md:text-base line-clamp-1">{lead.title}</h3>
                  <span className="text-slate-500 text-[10px] md:text-xs whitespace-nowrap shrink-0">{lead.time}</span>
                </div>
                
                {lead.customerName && (
                  <p className="text-xs font-medium text-slate-500">
                    Từ: {lead.customerName}
                  </p>
                )}
                
                <p className="text-slate-600 text-xs md:text-sm line-clamp-2 leading-relaxed">
                  &quot;{lead.content}&quot;
                </p>
                
                <div className="mt-2 flex">
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-md border ${lead.statusColor}`}>
                    {getMappedStatus(lead.status)}
                  </span>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </>
  );
}
