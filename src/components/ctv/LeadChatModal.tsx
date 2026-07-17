'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Send, Loader2, User } from 'lucide-react';
import { useSession } from 'next-auth/react';

export default function LeadChatModal({ lead, onClose }: { lead: any, onClose: () => void }) {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<any[]>([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const prevMessagesLengthRef = useRef(0);

  const fetchMessages = async () => {
    try {
      const res = await fetch(`/api/leads/${lead._id}/messages`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (err) {}
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [lead._id]);

  useEffect(() => {
    if (chatContainerRef.current) {
      if (messages.length > prevMessagesLengthRef.current || prevMessagesLengthRef.current === 0) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }
      prevMessagesLengthRef.current = messages.length;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!message.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/leads/${lead._id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: message })
      });
      if (res.ok) {
        setMessage('');
        fetchMessages();
      }
    } catch (err) {}
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-slate-50 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-slate-200 flex flex-col h-[600px] max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-white p-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-cyan-100 text-cyan-600 rounded-full flex items-center justify-center font-bold">
              {lead.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="font-bold text-slate-800">{lead.name}</h3>
              <p className="text-xs text-slate-500">{lead.post_id?.title}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-slate-400 mt-10">Chưa có tin nhắn nào.</div>
          ) : (
            messages.map((msg, idx) => {
              // @ts-ignore
              const isMine = msg.sender_id === session?.user?.id;
              return (
                <div key={idx} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${isMine ? 'bg-cyan-500 text-white rounded-tr-sm' : 'bg-white border border-slate-200 text-slate-700 rounded-tl-sm shadow-sm'}`}>
                    {msg.content}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Input */}
        <div className="bg-white p-4 border-t border-slate-200">
          <div className="flex gap-2">
            <input 
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Nhập phản hồi..."
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 text-slate-700"
            />
            <button 
              onClick={handleSend}
              disabled={loading || !message.trim()}
              className="bg-cyan-500 text-white rounded-xl aspect-square w-12 flex items-center justify-center hover:bg-cyan-600 disabled:opacity-50 transition"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
