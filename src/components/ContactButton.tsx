'use client';

import { Phone, Lock, MessageSquare, Send, ChevronDown, Loader2, User } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';

export default function ContactButton({ postId, ctvId, postTitle, ctvPhone }: { postId: string, ctvId: string, postTitle: string, ctvPhone: string }) {
  const { data: session, status } = useSession();
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const prevMessagesLengthRef = useRef(0);

  const fetchMessages = async () => {
    if (!session) return;
    try {
      const res = await fetch(`/api/leads/thread?post_id=${postId}&ctv_id=${ctvId}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
      }
    } catch (err) {}
  };

  useEffect(() => {
    if (showForm) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 3000); // Poll every 3 seconds
      return () => clearInterval(interval);
    }
  }, [showForm, session]);

  useEffect(() => {
    if (showForm && chatContainerRef.current) {
      if (messages.length > prevMessagesLengthRef.current || prevMessagesLengthRef.current === 0) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }
      prevMessagesLengthRef.current = messages.length;
    }
  }, [messages, showForm]);

  const handleAction = async (type: 'call' | 'zalo') => {
    try {
      fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ post_id: postId, ctv_id: ctvId, message: `Khách hàng bấm ${type === 'call' ? 'Gọi điện trực tiếp' : 'Nhắn tin Zalo'}` })
      }).catch(() => {});
    } catch (err) {}
    
    if (type === 'call') {
      window.location.href = `tel:${ctvPhone}`;
    } else {
      window.open(`https://zalo.me/${ctvPhone}`, '_blank');
    }
  };

  const handleSubmitMessage = async () => {
    if (!message.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ post_id: postId, ctv_id: ctvId, message })
      });
      if (res.ok) {
        setMessage('');
        fetchMessages();
      }
    } catch (err) {}
    setLoading(false);
  };

  if (status === 'loading') return null;

  if (!session) {
    return (
      <div className="space-y-3 w-full">
        <Link 
          href="/login" 
          className="w-full flex items-center justify-center gap-2 bg-slate-800 text-white font-bold py-4 rounded-xl hover:bg-slate-700 transition shadow-sm"
        >
          <Lock className="w-5 h-5" />
          Đăng nhập để xem Liên hệ
        </Link>
        <p className="text-xs text-center text-slate-500 leading-relaxed px-2">
          Hệ thống yêu cầu đăng nhập miễn phí để bảo vệ thông tin Cộng tác viên và lưu lịch sử xem phòng của bạn.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 w-full">
      <button 
        onClick={() => handleAction('call')}
        className="w-full flex items-center justify-center gap-3 bg-emerald-500 text-white font-bold py-4 rounded-xl hover:bg-emerald-600 transition shadow-sm"
      >
        <Phone className="w-6 h-6" />
        <span className="text-lg tracking-wide">Gọi: {ctvPhone}</span>
      </button>

      <button 
        onClick={() => handleAction('zalo')}
        className="w-full flex items-center justify-center gap-3 bg-blue-500 text-white font-bold py-4 rounded-xl hover:bg-blue-600 transition shadow-sm"
      >
        <span className="font-black text-xl leading-none">Zalo</span>
        <span className="text-lg tracking-wide">Nhắn tin Zalo</span>
      </button>

      <button 
        onClick={() => setShowForm(!showForm)}
        className="w-full flex items-center justify-between px-4 py-4 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition"
      >
        <div className="flex items-center gap-3">
          <MessageSquare className="w-5 h-5 text-slate-500" />
          <span>Hỗ trợ tư vấn</span>
        </div>
        <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${showForm ? 'rotate-180' : ''}`} />
      </button>

      {/* Slide down chat box */}
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${showForm ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="pt-2">
          <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden flex flex-col h-[400px]">
            {/* Chat Messages Area */}
            <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center text-slate-400 text-sm mt-10">
                  <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-20" />
                  Chưa có tin nhắn nào.<br/>Hãy gửi lời nhắn để bắt đầu trò chuyện.
                </div>
              ) : (
                messages.map((msg, idx) => {
                  // @ts-ignore
                  const isMine = msg.sender_id === session?.user?.id;
                  return (
                    <div key={idx} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${isMine ? 'bg-cyan-500 text-white rounded-tr-sm' : 'bg-white border border-slate-200 text-slate-700 rounded-tl-sm'}`}>
                        {msg.content}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Chat Input Area */}
            <div className="p-3 bg-white border-t border-slate-200">
              <div className="flex gap-2">
                <input 
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmitMessage()}
                  placeholder="Nhập tin nhắn..."
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 text-slate-700 placeholder:text-slate-400"
                />
                <button 
                  onClick={handleSubmitMessage}
                  disabled={loading || !message.trim()}
                  className="bg-slate-900 text-white p-2.5 rounded-lg hover:bg-slate-800 transition disabled:opacity-50 disabled:cursor-not-allowed shrink-0 flex items-center justify-center w-10 h-10"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}