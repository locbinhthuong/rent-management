'use client';

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { useSession } from 'next-auth/react';

export default function WishlistButton({ post }: { post: any }) {
  const [isSaved, setIsSaved] = useState(false);

  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      // Fetch user's wishlist from DB
      fetch('/api/wishlist')
        .then(res => res.json())
        .then(data => {
          if (data.wishlists) {
            setIsSaved(data.wishlists.some((w: any) => w.post_id?._id === post._id));
          }
        });
    } else {
      const savedPosts = JSON.parse(localStorage.getItem('wishlist') || '[]');
      setIsSaved(savedPosts.some((p: any) => p._id === post._id));
    }
  }, [post._id, session]);

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (session) {
      try {
        const res = await fetch('/api/wishlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ post_id: post._id })
        });
        const data = await res.json();
        if (res.ok) {
          setIsSaved(data.isLiked);
          window.dispatchEvent(new Event('wishlist-updated'));
        } else {
          alert(data.message || 'Lỗi hệ thống');
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      // Local Storage for guests
      let savedPosts = JSON.parse(localStorage.getItem('wishlist') || '[]');
      
      if (isSaved) {
        savedPosts = savedPosts.filter((p: any) => p._id !== post._id);
        setIsSaved(false);
      } else {
        const postToSave = {
          _id: post._id,
          title: post.title,
          price: post.price,
          address: post.address,
          image: post.images?.[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop',
          property_type: post.property_type
        };
        savedPosts.push(postToSave);
        setIsSaved(true);
      }
      
      localStorage.setItem('wishlist', JSON.stringify(savedPosts));
      window.dispatchEvent(new Event('wishlist-updated'));
    }
  };

  return (
    <button 
      onClick={toggleWishlist}
      className={`absolute top-3 left-3 p-2 rounded-full backdrop-blur-sm shadow-md transition z-10 ${isSaved ? 'bg-red-50 text-red-500' : 'bg-white/80 text-slate-400 hover:text-red-500 hover:bg-white'}`}
      title={isSaved ? 'Bỏ lưu' : 'Lưu tin'}
    >
      <Heart className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
    </button>
  );
}
