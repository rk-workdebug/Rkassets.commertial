import React, { useState, useRef } from 'react';
import { Product } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';

interface ProductCardProps {
  product: Product;
  index: number;
  variant?: 'square' | 'landscape';
  onQuickView?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, index, variant = 'square' }) => {
  const navigate = useNavigate();
  const { toggleWishlist, isInWishlist, addToCart, showNotification } = useShop();
  const [currentImageIdx, setCurrentImageIdx] = useState(0);
  
  // Interaction State
  const [showOptions, setShowOptions] = useState(false);
  const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isLongPress = useRef(false);

  // Swipe Logic State
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  
  // Safe access to images array
  const images = product.images && product.images.length > 0 ? product.images : (product.image ? [product.image] : []);
  const isWishlisted = isInWishlist(product.id);

  const handleNavigation = () => {
    navigate(`/product/${product.id}`);
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}${window.location.pathname}#/product/${product.id}`;
    const shareData = {
      title: product.name,
      text: `Check out ${product.name} on RK Assets`,
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
        await navigator.clipboard.writeText(shareUrl);
        showNotification('Link copied to clipboard');
      } catch (err) {
        console.error('Failed to copy', err);
      }
    }
    setShowOptions(false);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
    setShowOptions(false);
  };

  // Touch Handlers
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);

    // Long Press Logic
    isLongPress.current = false;
    pressTimer.current = setTimeout(() => {
        isLongPress.current = true;
        setShowOptions(true);
        if (navigator.vibrate) navigator.vibrate(10);
    }, 500); // 500ms threshold
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
    
    // Cancel long press if moving (scrolling/swiping)
    if (pressTimer.current) {
        clearTimeout(pressTimer.current);
        pressTimer.current = null;
    }
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (pressTimer.current) {
        clearTimeout(pressTimer.current);
    }

    // If it was a long press, stop here (menu is open)
    if (isLongPress.current) {
        return;
    }

    // Swipe Logic
    if (touchStart && touchEnd) {
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > 50;
        const isRightSwipe = distance < -50;

        if (isLeftSwipe && images.length > 1) {
            setCurrentImageIdx((prev) => (prev + 1) % images.length);
            return;
        }
        if (isRightSwipe && images.length > 1) {
            setCurrentImageIdx((prev) => (prev - 1 + images.length) % images.length);
            return;
        }
    }

    // If menu is open and we tap non-buttons (bubbled here), close menu
    if (showOptions) {
        setShowOptions(false);
        return;
    }

    // Otherwise, navigate
    handleNavigation();
  };

  // Mouse Handlers for Desktop testing
  const onMouseDown = () => {
    isLongPress.current = false;
    pressTimer.current = setTimeout(() => {
        isLongPress.current = true;
        setShowOptions(true);
    }, 500);
  };

  const onMouseUp = (e: React.MouseEvent) => {
    if (pressTimer.current) clearTimeout(pressTimer.current);
    
    if (isLongPress.current) return;

    if (showOptions) {
        setShowOptions(false);
        return;
    }
    handleNavigation();
  };

  const onMouseLeave = () => {
    if (pressTimer.current) clearTimeout(pressTimer.current);
  };

  // Determine aspect ratio class
  const aspectRatioClass = variant === 'square' ? 'aspect-square' : 'aspect-[3/2]';

  return (
    <div className="group relative select-none cursor-pointer w-full">
      {/* Image Container */}
      <div 
        className={`relative overflow-hidden bg-[#E0E0E0] rounded-2xl w-full ${aspectRatioClass} touch-pan-y`}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
        onContextMenu={(e) => e.preventDefault()} // Prevent context menu on long press
      >
        {images.length > 0 && (
          <motion.img 
              key={images[currentImageIdx]} 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.31 }}
              src={images[currentImageIdx]} 
              alt={product.name}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover block transition-transform duration-1000 ease-out group-hover:scale-105"
          />
        )}

        {/* Carousel Indicators (if multiple images) */}
        {images.length > 1 && (
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 z-10 pointer-events-none">
                {images.map((_, idx) => (
                    <div 
                        key={idx}
                        className={`h-1 rounded-full transition-all duration-300 ${idx === currentImageIdx ? 'w-6 bg-white' : 'w-1.5 bg-white/50'}`}
                    />
                ))}
            </div>
        )}

        {/* Long Press Menu Overlay */}
        <AnimatePresence>
            {showOptions && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/40 z-20 backdrop-blur-[2px]"
                >
                    {/* Action Buttons Container */}
                    <div className="absolute inset-0 flex items-center justify-center gap-6">
                        {/* Wishlist Button */}
                        <motion.button
                            initial={{ scale: 0, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ delay: 0.05 }}
                            onClick={handleWishlist}
                            className="w-14 h-14 bg-white text-black rounded-full shadow-lg flex items-center justify-center hover:bg-[#9e6b4f] hover:text-white transition-colors"
                            title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill={isWishlisted ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                            </svg>
                        </motion.button>

                        {/* Add to Cart Button */}
                        <motion.button
                            initial={{ scale: 0, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ delay: 0.1 }}
                            onClick={handleAddToCart}
                            className="w-16 h-16 bg-black text-white rounded-full shadow-lg flex items-center justify-center hover:bg-[#9e6b4f] transition-colors border-2 border-white"
                            title="Add to Cart"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                            </svg>
                        </motion.button>

                         {/* Share Button */}
                        <motion.button
                            initial={{ scale: 0, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ delay: 0.15 }}
                            onClick={handleShare}
                            className="w-14 h-14 bg-white text-black rounded-full shadow-lg flex items-center justify-center hover:bg-[#9e6b4f] hover:text-white transition-colors"
                            title="Share"
                        >
                           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
                            </svg>
                        </motion.button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
      </div>

      <div className="flex justify-between items-start mt-4">
        <div>
          <h3 className="text-black font-serif text-lg leading-tight group-hover:text-[#9e6b4f] transition-colors">
            {product.name}
          </h3>
          <p className="text-gray-500 text-xs font-sans mt-1 uppercase tracking-wider">{product.category}</p>
        </div>
        <span className="text-black font-medium font-sans">${product.price.toLocaleString()}</span>
      </div>
    </div>
  );
};