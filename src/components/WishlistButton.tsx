'use client';

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';

export default function WishlistButton({ post }: { post: any }) {
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const savedPosts = JSON.parse(localStorage.getItem('wishlist') || '[]');
    setIsSaved(savedPosts.some((p: any) => p._id === post._id));
  }, [post._id]);

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    let savedPosts = JSON.parse(localStorage.getItem('wishlist') || '[]');
    
    if (isSaved) {
      savedPosts = savedPosts.filter((p: any) => p._id !== post._id);
      setIsSaved(false);
    } else {
      // Chỉ lưu các thông tin cần thiết
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
    // Trigger event to update other components if needed
    window.dispatchEvent(new Event('wishlist-updated'));
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
