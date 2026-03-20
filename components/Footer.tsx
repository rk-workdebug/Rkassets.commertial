import React from 'react';
import { RKLogo } from './RKLogo';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#050505] text-white/80 border-t border-white/10 z-10 relative mt-auto w-full">
      <div className="w-full max-w-7xl mx-auto px-6 py-20">
        
        {/* 5. Grid Layout for Footer */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-20">
          
          {/* Brand Column (Span 4) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center gap-3">
               <RKLogo color="#FFF" className="w-8 h-8 flex-shrink-0" />
               <span className="font-serif text-xl tracking-widest text-white">RK ASSETS</span>
            </div>
            <p className="font-sans text-sm leading-relaxed text-gray-400 max-w-xs">
              Redefining the standard of digital luxury. Curated assets for the modern connoisseur, crafted with precision and an obsession for detail.
            </p>
          </div>

          {/* Links Section (Span 8 - Nested Grid) */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-12">
            
            {/* Collections */}
            <div className="flex flex-col gap-6">
              <h4 className="font-serif text-sm text-white uppercase tracking-widest">Collections</h4>
              <nav className="flex flex-col gap-3 font-sans text-sm text-gray-400">
                <Link to="/collections/streetwear" className="hover:text-[#9e6b4f] transition-colors w-fit">Street Wear</Link>
                <Link to="/collections/casual" className="hover:text-[#9e6b4f] transition-colors w-fit">Casual</Link>
                <Link to="/collections/winter" className="hover:text-[#9e6b4f] transition-colors w-fit">Winter</Link>
                <Link to="/collections/summer" className="hover:text-[#9e6b4f] transition-colors w-fit">Summer</Link>
              </nav>
            </div>

            {/* Support */}
            <div className="flex flex-col gap-6">
              <h4 className="font-serif text-sm text-white uppercase tracking-widest">Client Services</h4>
              <nav className="flex flex-col gap-3 font-sans text-sm text-gray-400">
                <Link to="/collections/customer-service" className="hover:text-[#9e6b4f] transition-colors w-fit">Concierge</Link>
                <a href="#" className="hover:text-[#9e6b4f] transition-colors w-fit">Shipping & Returns</a>
                <a href="#" className="hover:text-[#9e6b4f] transition-colors w-fit">Asset Care</a>
                <a href="#" className="hover:text-[#9e6b4f] transition-colors w-fit">Legal & Privacy</a>
              </nav>
            </div>

            {/* Newsletter */}
            <div className="flex flex-col gap-6">
              <h4 className="font-serif text-sm text-white uppercase tracking-widest">The Dossier</h4>
              <p className="font-sans text-sm text-gray-400">
                Subscribe to receive updates on new drops and exclusive access.
              </p>
              <form className="flex border-b border-white/20 pb-2 w-full max-w-xs" onSubmit={(e) => e.preventDefault()}>
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  className="bg-transparent border-none focus:ring-0 text-white placeholder-gray-600 text-sm w-full p-0 outline-none"
                  aria-label="Email Address"
                />
                <button type="submit" className="text-xs uppercase tracking-widest hover:text-[#9e6b4f] transition-colors whitespace-nowrap ml-2">Join</button>
              </form>
            </div>
          </div>
        </div>

        {/* Sub-Footer */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="font-sans text-[10px] text-gray-600 uppercase tracking-widest text-center md:text-left">
            © 2025 RK Assets. All Rights Reserved.
          </p>
          <div className="flex gap-4 opacity-30 grayscale hover:grayscale-0 transition-all duration-500">
             <div className="w-8 h-5 bg-white/20 rounded-sm"></div>
             <div className="w-8 h-5 bg-white/20 rounded-sm"></div>
             <div className="w-8 h-5 bg-white/20 rounded-sm"></div>
          </div>
        </div>
      </div>
    </footer>
  );
};