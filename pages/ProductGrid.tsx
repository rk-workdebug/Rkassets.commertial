import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Product, CategoryPath, NAV_ITEMS } from '../types';
import { ProductCard } from '../components/ProductCard';
import { ProductDetailModal } from '../components/ProductDetailModal';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../services/api';

const PRICE_RANGES = [
  { label: 'All Assets', value: 'all' },
  { label: 'Under $300', value: 'low' },
  { label: '$300 - $600', value: 'mid' },
  { label: 'Above $600', value: 'high' },
];

const SORT_OPTIONS = [
  { label: 'Popularity', value: 'popularity' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Newest Arrivals', value: 'newest' },
];

// Skeleton Loader Component
const ProductSkeleton: React.FC<{ index: number }> = ({ index }) => (
    <div className="animate-pulse">
        <div className={`bg-gray-200 rounded-lg w-full mb-4 ${index % 2 === 0 ? 'aspect-square' : 'aspect-[3/2]'}`} />
        <div className="h-4 bg-gray-200 w-3/4 mb-2 rounded" />
        <div className="h-3 bg-gray-200 w-1/2 rounded" />
    </div>
);

export const ProductGrid: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  
  const normalizedCategory = (category as CategoryPath) || 'streetwear';
  
  // State
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPrice, setSelectedPrice] = useState<string>('all');
  const [sortOption, setSortOption] = useState<string>('popularity');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  
  // Responsive Columns State
  const [numColumns, setNumColumns] = useState(() => 
    typeof window !== 'undefined' && window.innerWidth >= 1024 ? 4 : 2
  );

  const productCategories = NAV_ITEMS.filter(item => item.path !== 'customer-service');

  const searchQuery = searchParams.get('q');
  
  // Fetch Data from API
  useEffect(() => {
    const fetchData = async () => {
        setIsLoading(true);
        try {
            const data = await api.getProducts(normalizedCategory, searchQuery || undefined);
            setProducts(data);
        } catch (error) {
            console.error("Failed to fetch assets:", error);
        } finally {
            setIsLoading(false);
        }
    };
    fetchData();
  }, [normalizedCategory, searchQuery]);
  
  const filteredAndSortedProducts = useMemo(() => {
    let result = products.filter(product => {
      let priceMatch = true;
      switch (selectedPrice) {
        case 'low': priceMatch = product.price < 300; break;
        case 'mid': priceMatch = product.price >= 300 && product.price <= 600; break;
        case 'high': priceMatch = product.price > 600; break;
        default: priceMatch = true;
      }
      return priceMatch;
    });

    return result.sort((a, b) => {
      switch (sortOption) {
        case 'price-asc': return a.price - b.price;
        case 'price-desc': return b.price - a.price;
        case 'newest': return parseInt(b.id) - parseInt(a.id);
        case 'popularity': 
        default: return b.reviewCount - a.reviewCount;
      }
    });
  }, [products, selectedPrice, sortOption]);
  
  const handleQuickView = (product: Product) => {
    setSelectedProduct(product);
  };

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

  useEffect(() => {
    if (isFilterOpen || isSortOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isFilterOpen, isSortOpen]);

  // Distribute products into columns
  const columns = useMemo(() => {
    const cols: Product[][] = Array.from({ length: numColumns }, () => []);
    filteredAndSortedProducts.forEach((product, index) => {
      cols[index % numColumns].push(product);
    });
    return cols;
  }, [filteredAndSortedProducts, numColumns]);

  return (
    <div className="pt-32 pb-32 px-4 md:px-8 max-w-[1800px] mx-auto w-full relative z-10 min-h-screen">
      <header className="mb-16 text-center md:text-left px-2">
        {searchQuery ? (
            <div className="mb-6">
                <p className="text-sm font-sans lowercase text-gray-500 mb-2 tracking-wide">results for</p>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-sans font-bold text-black tracking-tight">
                    "{searchQuery}"
                </h1>
            </div>
        ) : (
            <h1 className="text-5xl md:text-7xl lg:text-9xl font-serif text-black mb-6 capitalize tracking-tighter">
                {normalizedCategory.replace('-', ' ')}
            </h1>
        )}
        
        <div className="h-1 w-24 bg-[#D4AF37] mb-8 md:mb-0 hidden md:block" />
        <p className="md:mt-8 text-gray-500 max-w-xl font-sans text-lg leading-relaxed">
            {searchQuery 
                ? `${filteredAndSortedProducts.length} assets found.` 
                : "A study in form and function. Each asset is curated to disrupt the ordinary."}
        </p>
      </header>

      {/* Desktop Filter Section */}
      <div className="hidden md:block mb-12 border-t border-b border-gray-200 py-6 px-2">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-sans uppercase tracking-widest text-gray-400">Collection</span>
            <div className="flex flex-wrap gap-8">
              {productCategories.map((cat) => (
                <button
                  key={cat.path}
                  onClick={() => {
                    navigate(`/collections/${cat.path}`);
                    setSelectedPrice('all');
                  }}
                  className={`text-sm font-sans tracking-widest uppercase transition-colors duration-300 relative group
                    ${normalizedCategory === cat.path && !searchQuery ? 'text-black font-bold' : 'text-gray-400 hover:text-black'}`}
                >
                  {cat.label}
                  {normalizedCategory === cat.path && !searchQuery && (
                    <motion.div 
                      layoutId="activeCategory"
                      className="absolute -bottom-2 left-0 right-0 h-0.5 bg-black"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

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
                      className="absolute -bottom-1 left-0 right-0 h-px bg-[#9e6b4f]"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {isLoading ? (
             <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
                {Array.from({ length: 8 }).map((_, i) => (
                    <ProductSkeleton key={i} index={i} />
                ))}
             </div>
        ) : filteredAndSortedProducts.length > 0 ? (
          <motion.div 
            key={`${normalizedCategory}-${selectedPrice}-${sortOption}-${searchQuery}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="flex gap-6 md:gap-8 lg:gap-10 items-start"
          >
            {columns.map((colProducts, colIndex) => (
              <div key={colIndex} className="flex-1 flex flex-col gap-10">
                {colProducts.map((product, localIndex) => {
                  const isSquare = (colIndex + localIndex) % 2 === 0;

                  return (
                    <ProductCard 
                      key={product.id} 
                      product={product} 
                      index={colIndex * 10 + localIndex}
                      variant={isSquare ? 'square' : 'landscape'}
                      onQuickView={handleQuickView} 
                    />
                  );
                })}
              </div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-32"
          >
            <p className="text-3xl font-serif text-gray-300 italic">No assets available.</p>
            <button 
              onClick={() => { 
                  setSelectedPrice('all'); 
                  if(searchQuery) navigate('/collections/streetwear'); 
              }}
              className="mt-8 px-8 py-3 bg-black text-white text-sm font-sans uppercase tracking-widest hover:bg-[#9e6b4f] transition-colors"
            >
              {searchQuery ? 'Explore Collections' : 'Reset Criteria'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sticky Bottom Tile Bar (Mobile) */}
      <motion.div 
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        transition={{ delay: 0.2, type: 'tween', ease: "easeOut", duration: 0.3 }}
        className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 flex shadow-[0_-4px_20px_rgba(0,0,0,0.05)] md:hidden"
      >
        <button 
          onClick={() => setIsFilterOpen(true)}
          className="flex-1 py-6 flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors group active:bg-gray-100"
        >
          <span className="font-sans text-xs font-bold uppercase tracking-widest text-black">Filter</span>
        </button>
        <div className="w-px bg-gray-200 my-4" />
        <button 
          onClick={() => setIsSortOpen(true)}
          className="flex-1 py-6 flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors group active:bg-gray-100"
        >
          <span className="font-sans text-xs font-bold uppercase tracking-widest text-black">Sort</span>
        </button>
      </motion.div>

      {/* Filter Modal */}
      <AnimatePresence>
        {isFilterOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFilterOpen(false)}
              className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-sm"
            />
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-[70] bg-[#F5F5F0] rounded-t-3xl overflow-hidden max-h-[85vh] flex flex-col shadow-[0_-10px_40px_rgba(0,0,0,0.2)]"
            >
              <div className="px-6 py-5 bg-white border-b border-gray-100 flex justify-between items-center sticky top-0 z-10">
                <h2 className="text-xl font-serif">Filter Assets</h2>
                <button onClick={() => setIsFilterOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">✕</button>
              </div>

              <div className="p-6 overflow-y-auto space-y-8 pb-24">
                {/* Collections */}
                <div>
                  <h3 className="text-xs font-sans font-bold text-gray-400 uppercase tracking-widest mb-4">Collection</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {productCategories.map((cat) => (
                      <button
                        key={cat.path}
                        onClick={() => {
                          navigate(`/collections/${cat.path}`);
                          setIsFilterOpen(false);
                          setSelectedPrice('all');
                        }}
                        className={`py-3 px-4 text-sm font-sans border rounded-xl transition-all
                          ${normalizedCategory === cat.path && !searchQuery
                            ? 'bg-black text-white border-black' 
                            : 'bg-white text-gray-600 border-gray-200 hover:border-black'}`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <h3 className="text-xs font-sans font-bold text-gray-400 uppercase tracking-widest mb-4">Price Range</h3>
                  <div className="space-y-2">
                    {PRICE_RANGES.map((range) => (
                      <label key={range.value} className="flex items-center justify-between p-4 bg-white rounded-xl cursor-pointer hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200">
                        <span className="font-sans text-sm text-gray-800">{range.label}</span>
                        <div className="relative flex items-center">
                          <input 
                            type="radio" 
                            name="price" 
                            className="peer h-5 w-5 cursor-pointer appearance-none rounded-full border border-gray-300 checked:border-[#9e6b4f] checked:bg-[#9e6b4f] transition-all"
                            checked={selectedPrice === range.value}
                            onChange={() => setSelectedPrice(range.value)}
                          />
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 bg-white border-t border-gray-100 absolute bottom-0 left-0 right-0">
                <button 
                  onClick={() => setIsFilterOpen(false)}
                  className="w-full bg-black text-white py-4 font-serif text-lg tracking-widest hover:bg-[#9e6b4f] transition-colors shadow-lg"
                >
                  APPLY FILTERS
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Sort Modal */}
      <AnimatePresence>
        {isSortOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSortOpen(false)}
              className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-sm"
            />
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-[70] bg-[#F5F5F0] rounded-t-3xl overflow-hidden max-h-[85vh] flex flex-col shadow-[0_-10px_40px_rgba(0,0,0,0.2)]"
            >
              <div className="px-6 py-5 bg-white border-b border-gray-100 flex justify-between items-center sticky top-0 z-10">
                <h2 className="text-xl font-serif">Sort By</h2>
                <button onClick={() => setIsSortOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">✕</button>
              </div>

              <div className="p-6 overflow-y-auto pb-24">
                <div className="space-y-2">
                    {SORT_OPTIONS.map((option) => (
                      <label key={option.value} className="flex items-center justify-between p-4 bg-white rounded-xl cursor-pointer hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200">
                        <span className="font-sans text-sm text-gray-800">{option.label}</span>
                        <div className="relative flex items-center">
                          <input 
                            type="radio" 
                            name="sort" 
                            className="peer h-5 w-5 cursor-pointer appearance-none rounded-full border border-gray-300 checked:border-[#9e6b4f] checked:bg-[#9e6b4f] transition-all"
                            checked={sortOption === option.value}
                            onChange={() => setSortOption(option.value)}
                          />
                        </div>
                      </label>
                    ))}
                  </div>
              </div>

               <div className="p-6 bg-white border-t border-gray-100 absolute bottom-0 left-0 right-0">
                <button 
                  onClick={() => setIsSortOpen(false)}
                  className="w-full bg-black text-white py-4 font-serif text-lg tracking-widest hover:bg-[#9e6b4f] transition-colors shadow-lg"
                >
                  SHOW RESULTS
                </button>
              </div>
            </motion.div>
          </>
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