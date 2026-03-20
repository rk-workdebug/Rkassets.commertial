
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product, Review } from '../types';
import { RKLogo } from './RKLogo';
import { useShop } from '../context/ShopContext';
import { api } from '../services/api';

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose }) => {
  const { addToCart, toggleWishlist, isInWishlist, showNotification, user, openAuthModal, updateUserXP } = useShop();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReview, setNewReview] = useState({ content: '', rating: 5 });
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [currentImageIdx, setCurrentImageIdx] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Swipe State
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Selection State
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes?.[0] || 'One Size');
  const [selectedColor, setSelectedColor] = useState<string>(product.colors?.[0] || '#000000');

  // Load reviews on mount
  useEffect(() => {
    const loadReviews = async () => {
        const data = await api.getReviews(product.id);
        setReviews(data);
    };
    loadReviews();
  }, [product.id]);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (isLightboxOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isLightboxOpen]);

  const images = product.images && product.images.length > 0 ? product.images : [product.image];
  const isWishlisted = isInWishlist(product.id);

  const getRatingColor = (rating: number) => {
    if (rating >= 3.9) return 'text-green-600';
    if (rating >= 2.8) return 'text-yellow-500';
    return 'text-red-500';
  };

  const handleReviewClick = () => {
    if (!user) {
        showNotification('Please log in to review');
        openAuthModal();
        return;
    }
    setShowReviewForm(!showReviewForm);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.content || !user) return;

    setIsSubmittingReview(true);
    try {
        const result = await api.submitReview(product.id, user.id, newReview.rating, newReview.content);
        if (result.success && result.review) {
            setReviews([result.review, ...reviews]);
            setNewReview({ content: '', rating: 5 });
            setShowReviewForm(false);
            updateUserXP(result.xpEarned);
            showNotification(`Review added! You gained ${result.xpEarned} XP`);
        }
    } catch (e) {
        showNotification('Error posting review');
    } finally {
        setIsSubmittingReview(false);
    }
  };

  const handleAcquire = () => {
    addToCart(product, selectedSize, selectedColor);
  };

  const handleShare = async () => {
    // Construct the deep link manually
    const shareUrl = `${window.location.origin}${window.location.pathname}#/product/${product.id}`;
    
    const shareData = {
      title: product.name,
      text: `Discover ${product.name} at RK Assets.`,
      url: shareUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.debug('Share cancelled');
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareData.url);
        showNotification('Link copied to clipboard');
      } catch (err) {
        console.error('Failed to copy', err);
      }
    }
  };

  // Touch Handlers for Carousel
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && images.length > 1) {
        setCurrentImageIdx((prev) => (prev + 1) % images.length);
    }
    if (isRightSwipe && images.length > 1) {
        setCurrentImageIdx((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  return (
    <>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
      >
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/80 backdrop-blur-md" 
          onClick={onClose}
        />

        {/* Modal Content */}
        <motion.div 
          layoutId={`card-container-${product.id}`}
          className="relative w-full max-w-6xl bg-[#F5F5F0] rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[85vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-4 left-4 md:left-auto md:top-6 md:right-6 z-20 w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center hover:bg-black hover:text-white transition-colors shadow-lg"
          >
            ✕
          </button>

          {/* Left: Image Carousel */}
          <div 
            className="w-full md:w-1/2 relative bg-gray-200 h-64 md:h-auto group"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            style={{ touchAction: 'pan-y' }}
          >
            <motion.img 
              key={currentImageIdx}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.31 }}
              src={images[currentImageIdx]} 
              alt={product.name}
              className="w-full h-full object-cover cursor-zoom-in"
              onClick={() => setIsLightboxOpen(true)}
            />
            
            {/* Carousel Controls */}
            {images.length > 1 && (
              <>
                <button 
                  onClick={(e) => { e.stopPropagation(); setCurrentImageIdx((prev) => (prev - 1 + images.length) % images.length); }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/80 backdrop-blur rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
                >
                  ←
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); setCurrentImageIdx((prev) => (prev + 1) % images.length); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/80 backdrop-blur rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
                >
                  →
                </button>
                <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2">
                    {images.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={(e) => { e.stopPropagation(); setCurrentImageIdx(idx); }}
                            className={`w-2 h-2 rounded-full transition-all ${idx === currentImageIdx ? 'bg-white scale-125' : 'bg-white/50'}`}
                        />
                    ))}
                </div>
              </>
            )}

            <div className="absolute top-8 left-8 text-white pointer-events-none hidden md:block">
               <RKLogo className="w-12 h-12 mb-4 opacity-80" color="#FFF" />
            </div>
          </div>

          {/* Right: Details & Reviews */}
          <div className="w-full md:w-1/2 flex flex-col h-full overflow-hidden">
            <div className="p-8 md:p-12 overflow-y-auto custom-scrollbar pt-16 md:pt-12">
              
              {/* Header */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex justify-between items-start mb-2">
                    <h2 className="text-sm font-sans uppercase tracking-[0.2em] text-[#9e6b4f]">{product.category}</h2>
                    <div className="flex items-center gap-2">
                        <span className={`text-sm font-bold ${getRatingColor(product.rating)}`}>★ {product.rating}</span>
                        <span className="text-xs text-gray-500 font-sans">({reviews.length} ratings)</span>
                    </div>
                </div>
                
                <div className="flex justify-between items-start gap-4 mb-4">
                  <h1 className="text-3xl md:text-5xl font-serif text-black leading-tight">{product.name}</h1>
                  <div className="flex items-center gap-2 mt-1 flex-shrink-0">
                    <button 
                        onClick={handleShare}
                        className="p-3 rounded-full bg-white border border-gray-100 shadow-sm hover:bg-gray-50 transition-colors group"
                        title="Share Asset"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 group-hover:scale-110 transition-transform">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
                        </svg>
                    </button>
                    <button 
                        onClick={() => toggleWishlist(product)}
                        className="p-3 rounded-full bg-white border border-gray-100 shadow-sm hover:bg-gray-50 transition-colors group"
                        title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                    >
                        <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 24 24" 
                        strokeWidth={1.5} 
                        stroke="currentColor" 
                        className={`w-6 h-6 transition-all duration-300 ${
                            isWishlisted 
                            ? "fill-black text-black scale-110" 
                            : "fill-none text-black group-hover:scale-110"
                        }`}
                        >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                        </svg>
                    </button>
                  </div>
                </div>

                <p className="text-2xl font-medium font-sans mb-6">${product.price.toLocaleString()}</p>

                {/* Options: Size & Color */}
                <div className="mb-6 space-y-4">
                    {/* Size */}
                    <div>
                        <span className="text-xs font-sans uppercase tracking-widest text-gray-500 mb-2 block">Size</span>
                        <div className="flex flex-wrap gap-2">
                            {product.sizes?.map((size) => (
                                <button
                                    key={size}
                                    onClick={() => setSelectedSize(size)}
                                    className={`w-12 h-12 flex items-center justify-center text-sm border font-sans transition-all rounded-lg ${
                                        selectedSize === size 
                                            ? 'border-black bg-black text-white shadow-md' 
                                            : 'border-gray-200 text-gray-700 hover:border-black bg-white'
                                    }`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Color */}
                    <div>
                        <span className="text-xs font-sans uppercase tracking-widest text-gray-500 mb-2 block">Color</span>
                        <div className="flex gap-3">
                            {product.colors?.map((color) => (
                                <button
                                    key={color}
                                    onClick={() => setSelectedColor(color)}
                                    className={`w-8 h-8 rounded-full border border-gray-200 shadow-sm transition-transform ${
                                        selectedColor === color ? 'ring-2 ring-black ring-offset-2 scale-110' : 'hover:scale-110'
                                    }`}
                                    style={{ backgroundColor: color }}
                                    title={color}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Drop on Cart Button */}
                <button 
                    onClick={(e) => { e.stopPropagation(); handleAcquire(); }}
                    className="flex items-center gap-3 mb-8 group w-fit"
                >
                    <span className="text-xs font-sans uppercase tracking-[0.2em] text-gray-400 group-hover:text-black transition-colors">Drop on</span>
                    <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center group-hover:border-black group-hover:bg-black group-hover:text-white transition-all shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                        </svg>
                    </div>
                </button>
                
                <p className="text-gray-600 font-sans leading-relaxed mb-8">
                  Crafted with precision. Use the navigation to explore asset angles. Click the image for full-screen inspection.
                </p>

                <div className="mb-12">
                    <button 
                        onClick={handleAcquire}
                        className="w-full bg-black text-white py-4 px-8 font-serif text-lg tracking-widest hover:bg-[#9e6b4f] transition-colors shadow-lg"
                    >
                        ACQUIRE NOW
                    </button>
                </div>
              </motion.div>
            </div>
            
             <div className="w-full h-px bg-gray-200 mb-8 mx-8" />
             
             {/* Reviews in Modal */}
            <div className="px-8 md:px-12 pb-12">
                <div className="flex justify-between items-end mb-6">
                    <h3 className="text-xl font-serif">Client Feedback</h3>
                    <button 
                        onClick={handleReviewClick}
                        className="text-sm font-sans uppercase tracking-wider underline hover:text-[#9e6b4f]"
                    >
                        {showReviewForm ? 'Cancel' : 'Write Review'}
                    </button>
                </div>

                {showReviewForm && (
                     <form onSubmit={handleSubmitReview} className="mb-8">
                         <div className="mb-2">
                             <select 
                                value={newReview.rating}
                                onChange={(e) => setNewReview({...newReview, rating: Number(e.target.value)})}
                                className="w-full bg-[#F5F5F0] p-2 rounded text-sm"
                            >
                                <option value="5">★★★★★ Excellent</option>
                                <option value="4">★★★★☆ Good</option>
                            </select>
                         </div>
                         <textarea 
                            value={newReview.content}
                            onChange={(e) => setNewReview({...newReview, content: e.target.value})}
                            placeholder="Your critique..."
                            className="w-full bg-[#F5F5F0] p-3 rounded text-sm mb-2 h-20"
                            required
                        />
                        <button type="submit" disabled={isSubmittingReview} className="bg-black text-white px-4 py-2 text-xs uppercase">Submit</button>
                     </form>
                )}

                <div className="space-y-6">
                    {reviews.slice(0, 3).map(review => (
                        <div key={review.id} className="border-b border-gray-100 pb-4 last:border-0">
                             <div className="flex justify-between items-center mb-1">
                                <span className="font-serif text-sm">{review.author}</span>
                                <span className="text-[#D4AF37] text-xs">{'★'.repeat(review.rating)}</span>
                             </div>
                             <p className="text-xs text-gray-500 font-sans">{review.content}</p>
                        </div>
                    ))}
                    {reviews.length === 0 && <p className="text-xs text-gray-400">No reviews yet.</p>}
                </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
};
