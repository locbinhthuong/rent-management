'use client';

import { useState, useRef, useEffect } from 'react';
import { Bell, Check, ExternalLink } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';

interface Notification {
  _id: string;
  title: string;
  content: string;
  link?: string;
  is_read: boolean;
  createdAt: string;
}

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const res = await fetch('/api/notifications');
      if (!res.ok) throw new Error('Network error');
      return res.json();
    },
    refetchInterval: 30000, // Poll every 30 seconds
  });

  const notifications: Notification[] = data?.notifications || [];
  const unreadCount = data?.unreadCount || 0;

  const markAsReadMutation = useMutation({
    mutationFn: async (id?: string) => {
      await fetch('/api/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const handleMarkAsRead = (id: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    markAsReadMutation.mutate(id);
  };

  const handleMarkAllAsRead = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    markAsReadMutation.mutate();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-600 hover:text-cyan-500 hover:bg-slate-100 rounded-full transition-colors focus:outline-none"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white shadow-sm">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/80 backdrop-blur-md">
            <h3 className="font-bold text-slate-800">Thông báo</h3>
            {unreadCount > 0 && (
              <button 
                onClick={handleMarkAllAsRead}
                className="text-xs font-semibold text-cyan-600 hover:text-cyan-700 hover:underline"
              >
                Đánh dấu tất cả đã đọc
              </button>
            )}
          </div>
          
          <div className="max-h-[60vh] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-slate-500">
                <Bell className="w-12 h-12 text-slate-300 mx-auto mb-3 opacity-50" />
                <p className="text-sm">Bạn chưa có thông báo nào</p>
              </div>
            ) : (
              <div className="flex flex-col">
                {notifications.map((notification) => (
                  <Link 
                    href={notification.link || '#'} 
                    key={notification._id}
                    onClick={() => !notification.is_read && handleMarkAsRead(notification._id)}
                    className={`p-4 border-b border-slate-100 hover:bg-slate-50 transition-colors flex gap-3 ${!notification.is_read ? 'bg-cyan-50/30' : ''}`}
                  >
                    <div className="mt-1 flex-shrink-0">
                      <div className={`w-2 h-2 rounded-full ${!notification.is_read ? 'bg-cyan-500' : 'bg-transparent'}`}></div>
                    </div>
                    <div className="flex-1">
                      <h4 className={`text-sm ${!notification.is_read ? 'font-bold text-slate-900' : 'font-semibold text-slate-700'}`}>
                        {notification.title}
                      </h4>
                      <p className={`text-sm mt-1 line-clamp-2 ${!notification.is_read ? 'text-slate-700' : 'text-slate-500'}`}>
                        {notification.content}
                      </p>
                      <span className="text-[10px] text-slate-400 font-medium mt-2 block">
                        {new Date(notification.createdAt).toLocaleString('vi-VN')}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
