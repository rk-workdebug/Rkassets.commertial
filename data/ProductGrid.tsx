import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Product, CategoryPath, NAV_ITEMS } from '../types';
import { ProductCard } from '../components/ProductCard';
import { ProductDetailModal } from '../components/ProductDetailModal';
import { motion, AnimatePresence } from 'framer-motion';
import { MOCK_PRODUCTS } from '../data/mockData';

const PRICE_RANGES = [
  { label: 'All Assets', value: 'all' },
  { label: 'Under $300', value: 'low' },
  { label: '$300 - $600', value: 'mid' },
  { label: 'Above $600', value: 'high' },
];

export const ProductGrid: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const normalizedCategory = (category as CategoryPath) || 'streetwear';
  
  const [selectedPrice, setSelectedPrice] = useState<string>('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const productCategories = NAV_ITEMS.filter(item => item.path !== 'customer-service');

  const products = MOCK_PRODUCTS[normalizedCategory] || [];
  
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      switch (selectedPrice) {
        case 'low': return product.price < 300;
        case 'mid': return product.price >= 300 && product.price <= 600;
        case 'high': return product.price > 600;
        default: return true;
      }
    });
  }, [products, selectedPrice]);
  
  const title = normalizedCategory.replace('-', ' ');

  const handleQuickView = (product: Product) => {
    setSelectedProduct(product);
  };

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto min-h-screen relative z-10">
      <header className="mb-12">
        <h1 className="text-5xl md:text-7xl font-serif text-black mb-4 capitalize">
          {title}
        </h1>
        <div className="h-1 w-20 bg-[#D4AF37]" />
        <p className="mt-6 text-gray-600 max-w-lg font-sans leading-relaxed">
          Curated assets for the modern connoisseur. Each piece reflects the dark elegance and premium quality of the RK Assets philosophy.
        </p>
      </header>

      {/* Filter Section */}
      <div className="mb-12 border-t border-b border-gray-200 py-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          {/* Category Filter */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-sans uppercase tracking-widest text-gray-400">Collection</span>
            <div className="flex flex-wrap gap-4">
              {productCategories.map((cat) => (
                <button
                  key={cat.path}
                  onClick={() => {
                    navigate(`/collections/${cat.path}`);
                    setSelectedPrice('all');
                  }}
                  className={`text-sm font-sans tracking-wide transition-colors duration-300 relative group
                    ${normalizedCategory === cat.path ? 'text-black font-medium' : 'text-gray-400 hover:text-black'}`}
                >
                  {cat.label}
                  {normalizedCategory === cat.path && (
                    <motion.div 
                      layoutId="activeCategory"
                      className="absolute -bottom-1 left-0 right-0 h-px bg-black"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Price Filter */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-sans uppercase tracking-widest text-gray-400">Price Range</span>
            <div className="flex flex-wrap gap-4">
              {PRICE_RANGES.map((range) => (
                <button
                  key={range.value}
                  onClick={() => setSelectedPrice(range.value)}
                  className={`text-sm font-sans tracking-wide transition-colors duration-300 relative
                    ${selectedPrice === range.value ? 'text-black font-medium' : 'text-gray-400 hover:text-black'}`}
                >
                  {range.label}
                  {selectedPrice === range.value && (
                    <motion.div 
                      layoutId="activePrice"
                      className="absolute -bottom-1 left-0 right-0 h-px bg-[#008080]"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>

      <AnimatePresence mode="wait">
        {filteredProducts.length > 0 ? (
          <motion.div 
            key={normalizedCategory + selectedPrice}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12"
          >
            {filteredProducts.map((product, index) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                index={index}
                onQuickView={handleQuickView} 
              />
            ))}
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-xl font-serif text-gray-400 italic">No assets found in this range.</p>
            <button 
              onClick={() => setSelectedPrice('all')}
              className="mt-4 text-sm font-sans uppercase tracking-widest text-[#008080] hover:text-black transition-colors"
            >
              Clear Filters
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedProduct && (
          <ProductDetailModal 
            product={selectedProduct} 
            onClose={() => setSelectedProduct(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};