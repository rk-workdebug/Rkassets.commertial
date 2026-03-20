import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/ProductCard';
import { getAllProducts } from '../data/mockData';
import { Product } from '../types';

export const Wishlist: React.FC = () => {
  const { wishlist } = useShop();
  const navigate = useNavigate();
  const allProducts = getAllProducts();
  
  // Init with correct columns to avoid flash
  const [numColumns, setNumColumns] = useState(() => 
    typeof window !== 'undefined' && window.innerWidth >= 1024 ? 4 : 2
  );
  
  // Filter full product objects based on wishlist IDs
  const wishlistedProducts = allProducts.filter(p => wishlist.includes(p.id));

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) { // lg breakpoint
        setNumColumns(4);
      } else {
        setNumColumns(2);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Distribute products into columns
  const columns = useMemo(() => {
    const cols: Product[][] = Array.from({ length: numColumns }, () => []);
    wishlistedProducts.forEach((product, index) => {
      cols[index % numColumns].push(product);
    });
    return cols;
  }, [wishlistedProducts, numColumns]);

  return (
    <div className="pt-40 pb-20 px-6 max-w-7xl mx-auto z-10 relative w-full">
      <motion.button 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate('/collections/streetwear')}
        className="mb-8 text-sm font-sans uppercase tracking-widest text-gray-500 hover:text-black flex items-center gap-2"
      >
        ← Curate More
      </motion.button>

      <header className="mb-12">
        <h1 className="text-5xl md:text-6xl font-serif text-black mb-4">Curated by You</h1>
        <div className="h-1 w-20 bg-[#D4AF37]" />
      </header>

      {wishlistedProducts.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <p className="text-xl font-serif text-gray-400 mb-8">Your wishlist is currently empty.</p>
          <button 
            onClick={() => navigate('/collections/streetwear')}
            className="px-8 py-3 bg-black text-white font-serif tracking-widest hover:bg-[#9e6b4f] transition-colors"
          >
            START CURATING
          </button>
        </motion.div>
      ) : (
        <AnimatePresence>
          <div className="flex gap-6 md:gap-8 lg:gap-10 items-start">
             {columns.map((colProducts, colIndex) => (
              <div key={colIndex} className="flex-1 flex flex-col gap-10">
                {colProducts.map((product, localIndex) => {
                  // Checkerboard Logic
                  const isSquare = (colIndex + localIndex) % 2 === 0;
                  
                  return (
                    <ProductCard 
                      key={product.id} 
                      product={product} 
                      index={colIndex * 10 + localIndex}
                      variant={isSquare ? 'square' : 'landscape'}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </AnimatePresence>
      )}
    </div>
  );
};