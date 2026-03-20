import React from 'react';
import { Product } from '../types';
import { motion } from 'framer-motion';

interface ProductCardProps {
  product: Product;
  index: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      className="group cursor-pointer"
    >
      <div className="relative overflow-hidden rounded-lg aspect-[3/4] mb-4 bg-gray-200">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
        
        {/* Quick Add Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out">
          <button className="w-full bg-white text-black py-3 px-4 font-sans text-sm tracking-widest uppercase hover:bg-[#008080] hover:text-white transition-colors">
            View Asset
          </button>
        </div>
      </div>
      
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-black font-serif text-lg leading-tight group-hover:text-[#008080] transition-colors">
            {product.name}
          </h3>
          <p className="text-gray-500 text-xs font-sans mt-1 uppercase tracking-wider">{product.category}</p>
        </div>
        <span className="text-black font-medium font-sans">${product.price.toLocaleString()}</span>
      </div>
    </motion.div>
  );
};