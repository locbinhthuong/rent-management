'use client';

import { useState, useEffect, useOptimistic, startTransition } from 'react';
import { Heart } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { toggleWishlistAction } from '@/actions/wishlist';
import { toast } from 'sonner';

export default function WishlistButton({ post }: { post: any }) {
  const [isSaved, setIsSaved] = useState(false);
  const { data: session } = useSession();
  
  // React 19 useOptimistic hook
  const [optimisticIsSaved, addOptimisticIsSaved] = useOptimistic(
    isSaved,
    (state, newState: boolean) => newState
  );

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
      // Optimistic Update
      startTransition(() => {
        addOptimisticIsSaved(!optimisticIsSaved);
      });

      const res = await toggleWishlistAction(post._id);
      if (res.success) {
        setIsSaved(res.isLiked);
        toast.success(res.message);
        window.dispatchEvent(new Event('wishlist-updated'));
      } else {
        toast.error(res.message);
        // Revert will happen automatically since we didn't update actual state
      }
    } else {
      // Local Storage for guests
      let savedPosts = JSON.parse(localStorage.getItem('wishlist') || '[]');
      
      if (isSaved) {
        savedPosts = savedPosts.filter((p: any) => p._id !== post._id);
        setIsSaved(false);
        toast.info('Đã bỏ lưu tin');
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
        toast.success('Đã lưu tin thành công');
      }
      
      localStorage.setItem('wishlist', JSON.stringify(savedPosts));
      window.dispatchEvent(new Event('wishlist-updated'));
    }
  };

  return (
    <button 
      onClick={toggleWishlist}
      className={`absolute top-3 left-3 p-2 rounded-full backdrop-blur-sm shadow-md transition z-10 ${optimisticIsSaved ? 'bg-red-50 text-red-500' : 'bg-white/80 text-slate-600 hover:text-red-500 hover:bg-white'}`}
      title={optimisticIsSaved ? 'Bỏ lưu' : 'Lưu tin'}
    >
      <Heart className={`w-5 h-5 ${optimisticIsSaved ? 'fill-current' : ''}`} />
    </button>
  );
}
