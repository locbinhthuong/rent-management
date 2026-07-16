'use client';

import { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import ContactModal from './ContactModal';

export default function ContactButton({ postId, ctvId, postTitle }: { postId: string, ctvId: string, postTitle: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 text-slate-900 font-bold py-2.5 rounded-xl hover:bg-indigo-700 transition shadow-sm"
      >
        <MessageSquare className="w-4 h-4" />
        Nhận tư vấn
      </button>
      <ContactModal isOpen={isOpen} onClose={() => setIsOpen(false)} postId={postId} ctvId={ctvId} postTitle={postTitle} />
    </>
  );
}
