
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Review, Product } from '../types';
import { api } from '../services/api';
import { RKLogo } from '../components/RKLogo';
import { useShop } from '../context/ShopContext';

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, isInWishlist, showNotification, user, openAuthModal, updateUserXP } = useShop();
  
  // State
  const [product, setProduct] = useState<Product | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
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
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Fetch Product & Reviews
  useEffect(() => {
    const fetchProduct = async () => {
        if (!id) return;
        setIsLoading(true);
        try {
            const data = await api.getProductById(id);
            const reviewData = await api.getReviews(id);
            setProduct(data);
            setReviews(reviewData);
            if (data) {
                setSelectedSize(data.sizes?.[0] || 'One Size');
                setSelectedColor(data.colors?.[0] || '#000000');
            }
        } catch (error) {
            console.error("Failed to load asset:", error);
        } finally {
            setIsLoading(false);
        }
    };
    fetchProduct();
  }, [id]);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (isLightboxOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isLightboxOpen]);

  // Loading State
  if (isLoading) {
      return (
          <div className="min-h-screen flex items-center justify-center">
              <div className="flex flex-col items-center animate-pulse">
                  <RKLogo className="w-12 h-12 mb-4 text-gray-300" />
                  <p className="text-xs font-sans uppercase tracking-widest text-gray-400">Loading Asset...</p>
              </div>
          </div>
      );
  }

  // Not Found State
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <h1 className="text-2xl font-serif mb-4">Asset Not Found</h1>
          <button onClick={() => navigate('/')} className="text-[#9e6b4f] underline">Return Home</button>
        </div>
      </div>
    );
  }

  const images = product.images && product.images.length > 0 ? product.images : [product.image];
  const isWishlisted = isInWishlist(product.id);

  const getRatingColor = (rating: number) => {
    if (rating >= 3.9) return 'text-green-600';
    if (rating >= 2.8) return 'text-yellow-500';
    return 'text-red-500';
  };

  const handleReviewClick = () => {
    if (!user) {
      showNotification('Please log in to submit a review');
      openAuthModal();
      return;
    }
    setShowReviewForm(!showReviewForm);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.content || !user || !product) return;
    
    setIsSubmittingReview(true);
    try {
       const result = await api.submitReview(product.id, user.id, newReview.rating, newReview.content);
       if (result.success && result.review) {
          setReviews([result.review, ...reviews]);
          setNewReview({ content: '', rating: 5 });
          setShowReviewForm(false);
          updateUserXP(result.xpEarned);
          showNotification(`Review posted! +${result.xpEarned} XP`);
       }
    } catch (error) {
       console.error(error);
       showNotification('Failed to post review');
    } finally {
       setIsSubmittingReview(false);
    }
  };

  const handleAcquire = () => {
    if (product) addToCart(product, selectedSize, selectedColor);
  };

  const handleShare = async () => {
    const shareData = {
      title: product.name,
      text: `Discover ${product.name} at RK Assets.`,
      url: window.location.href,
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
    <div className="pt-40 pb-20 px-6 max-w-7xl mx-auto z-10 relative">
      <motion.button 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate(-1)}
        className="mb-8 text-sm font-sans uppercase tracking-widest text-gray-500 hover:text-black flex items-center gap-2"
      >
        ← Back to Collection
      </motion.button>

      <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-start">
        {/* Left: Image Carousel */}
        <div 
            className="w-full lg:w-1/2 relative aspect-[3/4] lg:aspect-[4/5] bg-gray-200 rounded-lg overflow-hidden shadow-xl group"
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
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
          
           {/* Carousel Controls */}
           {images.length > 1 && (
            <>
              <button 
                onClick={() => setCurrentImageIdx((prev) => (prev - 1 + images.length) % images.length)}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/30 backdrop-blur text-white rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 z-20"
              >
                ←
              </button>
              <button 
                onClick={() => setCurrentImageIdx((prev) => (prev + 1) % images.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/30 backdrop-blur text-white rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 z-20"
              >
                →
              </button>
              <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-3 z-20">
                {images.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrentImageIdx(idx)}
                        className={`w-2 h-2 rounded-full transition-all ${idx === currentImageIdx ? 'bg-white scale-150' : 'bg-white/50 hover:bg-white'}`}
                    />
                ))}
              </div>
            </>
          )}

          <div className="absolute top-8 left-8 text-white pointer-events-none">
             <RKLogo className="w-16 h-16 mb-4 opacity-80" color="#FFF" />
          </div>
        </div>

        {/* Right: Details & Reviews */}
        <div className="w-full lg:w-1/2 flex flex-col">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-4">
               <h2 className="text-sm font-sans uppercase tracking-[0.2em] text-[#9e6b4f]">{product.category}</h2>
               <div className="flex items-center gap-2">
                    <span className={`text-base font-bold ${getRatingColor(product.rating)}`}>★ {product.rating}</span>
                    <span className="text-sm text-gray-500 font-sans">({reviews.length} ratings)</span>
               </div>
            </div>

            {/* Title, Share and Wishlist Buttons */}
            <div className="flex justify-between items-start gap-4 mb-6">
              <h1 className="text-5xl md:text-5xl lg:text-6xl font-serif text-black leading-tight">{product.name}</h1>
              <div className="flex items-center gap-3 mt-2 flex-shrink-0">
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

            <p className="text-3xl font-medium font-sans mb-6">${product.price.toLocaleString()}</p>
            
            {/* Options: Size & Color */}
            <div className="mb-8 space-y-5">
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
                                        ? 'border-black bg-black text-white' 
                                        : 'border-gray-300 text-gray-700 hover:border-black'
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
                    <div className="flex gap-4">
                        {product.colors?.map((color) => (
                            <button
                                key={color}
                                onClick={() => setSelectedColor(color)}
                                className={`w-10 h-10 rounded-full border border-gray-200 shadow-sm transition-transform ${
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
                onClick={handleAcquire}
                className="flex items-center gap-3 mb-10 group w-fit"
            >
                <span className="text-sm font-sans uppercase tracking-[0.2em] text-gray-500 group-hover:text-black transition-colors">Drop on</span>
                <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center group-hover:border-black group-hover:bg-black group-hover:text-white transition-all shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                        </svg>
                </div>
            </button>
            
            <p className="text-gray-600 font-sans leading-relaxed text-lg mb-10 max-w-xl">
              Crafted with precision for the discerning individual. This piece embodies the minimalist philosophy of RK Assets, featuring premium materials and an uncompromising attention to detail.
            </p>

            <div className="mb-16">
                <button 
                  onClick={handleAcquire}
                  className="w-full bg-black text-white py-5 px-8 font-serif text-lg tracking-widest hover:bg-[#9e6b4f] transition-colors shadow-lg"
                >
                  ACQUIRE NOW
                </button>
            </div>
          </motion.div>

          <div className="w-full h-px bg-gray-200 mb-12" />

          {/* Reviews Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex justify-between items-end mb-8">
              <h3 className="text-2xl font-serif">Client Feedback</h3>
              <button 
                onClick={handleReviewClick}
                className="text-sm font-sans uppercase tracking-wider underline hover:text-[#9e6b4f]"
              >
                {showReviewForm ? 'Cancel' : 'Write Review'}
              </button>
            </div>

            <AnimatePresence>
              {showReviewForm && (
                <motion.form
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  onSubmit={handleSubmitReview}
                  className="mb-8 bg-white p-6 rounded-xl border border-gray-100 overflow-hidden shadow-sm"
                >
                  <p className="text-xs font-sans text-gray-400 mb-4 uppercase tracking-wide">
                    Posting as <span className="text-black font-bold">{user?.name}</span>
                  </p>
                  
                  <div className="mb-4">
                    <select 
                      value={newReview.rating}
                      onChange={(e) => setNewReview({...newReview, rating: Number(e.target.value)})}
                      className="w-full bg-[#F5F5F0] p-3 rounded-lg font-sans text-sm focus:outline-none focus:ring-1 focus:ring-black"
                    >
                      <option value="5">★★★★★ Excellent</option>
                      <option value="4">★★★★☆ Good</option>
                      <option value="3">★★★☆☆ Average</option>
                      <option value="2">★★☆☆☆ Fair</option>
                      <option value="1">★☆☆☆☆ Poor</option>
                    </select>
                  </div>
                  <textarea 
                    placeholder="Share your experience..."
                    value={newReview.content}
                    onChange={(e) => setNewReview({...newReview, content: e.target.value})}
                    className="w-full bg-[#F5F5F0] p-3 rounded-lg font-sans text-sm mb-4 h-24 resize-none focus:outline-none focus:ring-1 focus:ring-black"
                    required
                  />
                  <button 
                    type="submit" 
                    disabled={isSubmittingReview}
                    className="bg-black text-white px-6 py-2 text-sm font-sans uppercase tracking-widest hover:bg-[#9e6b4f] transition-colors disabled:opacity-50"
                  >
                    {isSubmittingReview ? 'Posting...' : 'Submit (+10 XP)'}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>

            <div className="space-y-8">
              {reviews.length === 0 ? (
                 <p className="text-gray-400 font-serif italic text-sm">No reviews yet. Be the first to critique.</p>
              ) : (
                reviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
                    <div className="flex justify-between items-start mb-2">
                        <span className="font-serif text-lg">{review.author}</span>
                        <span className="text-xs text-gray-400 font-sans uppercase">{new Date(review.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex text-[#D4AF37] text-xs mb-3">
                        {[...Array(5)].map((_, i) => (
                        <span key={i}>{i < review.rating ? '★' : '☆'}</span>
                        ))}
                    </div>
                    <p className="text-gray-600 font-sans text-sm leading-relaxed">"{review.content}"</p>
                    </div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4"
            onClick={() => setIsLightboxOpen(false)}
          >
            <div className="relative group flex justify-center items-center max-w-full max-h-full" onClick={(e) => e.stopPropagation()}>
                <motion.img 
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  src={images[currentImageIdx]} 
                  alt="Full Screen" 
                  className="max-w-full max-h-[85vh] md:max-h-[90vh] object-contain shadow-2xl select-none"
                />
                 {images.length > 1 && (
                    <>
                    <button 
                        onClick={(e) => { e.stopPropagation(); setCurrentImageIdx((prev) => (prev - 1 + images.length) % images.length); }}
                        className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-14 md:h-14 bg-black/20 hover:bg-black/50 text-white rounded-full flex items-center justify-center transition-all backdrop-blur-sm opacity-100 md:opacity-0 md:group-hover:opacity-100 z-50 text-2xl"
                    >
                        ‹
                    </button>
                    <button 
                        onClick={(e) => { e.stopPropagation(); setCurrentImageIdx((prev) => (prev + 1) % images.length); }}
                        className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-14 md:h-14 bg-black/20 hover:bg-black/50 text-white rounded-full flex items-center justify-center transition-all backdrop-blur-sm opacity-100 md:opacity-0 md:group-hover:opacity-100 z-50 text-2xl"
                    >
                        ›
                    </button>
                    </>
                )}
                <button 
                  className="absolute top-2 right-2 md:top-4 md:right-4 w-10 h-10 bg-black/50 hover:bg-black text-white rounded-full flex items-center justify-center transition-colors backdrop-blur-sm z-50"
                  onClick={() => setIsLightboxOpen(false)}
                >
                  ✕
                </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
