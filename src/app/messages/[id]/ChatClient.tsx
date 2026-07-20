'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface MessageProps {
  id: string;
  content: string;
  senderId: string;
  isMine: boolean;
  createdAt: string;
}

export default function ChatClient({ 
  leadId, 
  initialMessages, 
  currentUserId 
}: { 
  leadId: string, 
  initialMessages: MessageProps[], 
  currentUserId: string 
}) {
  const [messages, setMessages] = useState<MessageProps[]>(initialMessages);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isSending) return;

    const content = inputText.trim();
    setInputText('');
    
    // Optimistic UI update
    const optimisticMsg: MessageProps = {
      id: 'temp-' + Date.now(),
      content: content,
      senderId: currentUserId,
      isMine: true,
      createdAt: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, optimisticMsg]);
    setIsSending(true);

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lead_id: leadId, content })
      });

      if (!res.ok) throw new Error('Gửi tin nhắn thất bại');
      
      const data = await res.json();
      
      // Replace optimistic message with real one
      setMessages(prev => prev.map(m => m.id === optimisticMsg.id ? {
        ...optimisticMsg,
        id: data.message._id,
        createdAt: data.message.createdAt
      } : m));

    } catch (error) {
      console.error(error);
      toast.error('Gửi tin nhắn thất bại. Vui lòng thử lại.');
      // Remove optimistic message on failure
      setMessages(prev => prev.filter(m => m.id !== optimisticMsg.id));
      setInputText(content);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 relative overflow-hidden">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-20">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 font-medium">
            <p>Chưa có tin nhắn nào.</p>
            <p className="text-sm">Hãy gửi tin nhắn đầu tiên để bắt đầu trò chuyện.</p>
          </div>
        ) : (
          messages.map((msg, index) => {
            const date = new Date(msg.createdAt);
            const timeStr = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
            
            return (
              <div key={msg.id} className={`flex flex-col ${msg.isMine ? 'items-end' : 'items-start'}`}>
                <div 
                  className={`max-w-[80%] md:max-w-[70%] px-4 py-2 rounded-2xl ${
                    msg.isMine 
                      ? 'bg-cyan-500 text-white rounded-br-none' 
                      : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-sm'
                  }`}
                >
                  <p className="whitespace-pre-wrap break-words text-sm md:text-base">{msg.content}</p>
                </div>
                <span className="text-[10px] text-slate-400 mt-1 px-1">{timeStr}</span>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input Area */}
      <div className="absolute bottom-0 left-0 right-0 p-3 bg-white border-t border-slate-200">
        <form onSubmit={handleSend} className="max-w-4xl mx-auto flex gap-2">
          <input 
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Nhập tin nhắn..."
            className="flex-1 bg-slate-100 border border-slate-200 rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 text-sm md:text-base"
          />
          <button 
            type="submit"
            disabled={!inputText.trim() || isSending}
            className="w-12 h-12 shrink-0 bg-cyan-500 hover:bg-cyan-600 text-white rounded-full flex items-center justify-center transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5 ml-1" />}
          </button>
        </form>
      </div>
    </div>
  );
}
