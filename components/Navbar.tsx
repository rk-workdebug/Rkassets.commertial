
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { NAV_ITEMS } from '../types';
import { RKLogo } from './RKLogo';
import { useShop } from '../context/ShopContext';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const { cart, wishlist, user, openAuthModal, logout } = useShop();

  // Search State
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const query = searchParams.get('q');
    if (query) {
      setSearchQuery(query);
      setIsSearchActive(true);
    } else {
      if (location.pathname !== '/search') {
          setSearchQuery('');
          setIsSearchActive(false);
      }
    }
    setIsOpen(false);
    setShowProfileMenu(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (isSearchActive && searchInputRef.current) {
        setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [isSearchActive]);

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
        navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleCloseSearch = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSearchQuery('');
    setIsSearchActive(false);
    navigate('/collections/streetwear'); 
  };

  const menuVariants: Variants = {
    closed: {
      opacity: 0,
      x: "100%",
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
    },
    open: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1], staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const linkVariants = {
    closed: { x: 50, opacity: 0 },
    open: { x: 0, opacity: 1 }
  };

  const navBg = isScrolled || isOpen ? 'bg-[#E4E4E1] shadow-sm' : 'bg-transparent';
  const textColor = "text-black"; 
  const logoColor = "#000";

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out border-b border-black/5 ${navBg} h-24 flex items-center`}
      >
        <div className="w-full max-w-7xl mx-auto px-6 flex justify-between items-center relative">
          
          {/* LEFT: Logo Section */}
          <div className={`flex items-center transition-opacity duration-300 ${isSearchActive ? 'opacity-0 md:opacity-100' : 'opacity-100'}`}>
             <Link to="/" className="flex items-center gap-3 group">
                <RKLogo color={logoColor} className="w-9 h-9 transition-transform group-hover:scale-105" />
                <span className="hidden sm:block font-serif text-lg tracking-[0.2em] font-medium text-black group-hover:text-[#9e6b4f] transition-colors pt-1">
                   RK ASSETS
                </span>
             </Link>
          </div>

          {/* RIGHT: Icons Section */}
          <div className="flex items-center gap-4 z-50">
             
             {/* Search Bar */}
             <motion.form 
                initial={false}
                animate={{ 
                    width: isSearchActive ? 260 : 40,
                }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className={`flex items-center rounded-full h-10 overflow-hidden relative
                    ${isSearchActive 
                        ? 'shadow-lg bg-white border border-gray-200' 
                        : 'bg-transparent cursor-pointer hover:bg-black/5 border-none'
                    }
                `}
                onSubmit={handleSearchSubmit}
                onClick={() => { if(!isSearchActive) setIsSearchActive(true); }}
            >
                <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-black">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                    </svg>
                </div>

                <input 
                    ref={searchInputRef}
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search assets..."
                    className={`bg-transparent border-none outline-none text-black font-sans text-sm placeholder-gray-400 h-full w-full pr-8 transition-opacity duration-200
                        ${isSearchActive ? 'opacity-100' : 'opacity-0'}
                    `}
                    disabled={!isSearchActive}
                    onBlur={() => { if(!searchQuery) setIsSearchActive(false); }}
                />

                {isSearchActive && (
                    <button 
                        type="button" 
                        onClick={handleCloseSearch}
                        className="absolute right-2 text-gray-400 hover:text-black p-1 transition-colors flex items-center justify-center w-8 h-8"
                    >
                         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </motion.form>

            {/* User Profile / Auth */}
            <div className="relative">
              <button 
                onClick={() => user ? setShowProfileMenu(!showProfileMenu) : openAuthModal()}
                className={`relative group ${textColor} h-10 flex items-center gap-2 rounded-full hover:bg-black/5 transition-colors ${user ? 'px-3' : 'w-10 justify-center'}`}
              >
                {user ? (
                   <>
                     <span className="text-xs font-sans font-bold text-[#9e6b4f]">{user.xp} XP</span>
                     <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-xs font-serif">
                       {user.name.charAt(0)}
                     </div>
                   </>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 transition-transform group-hover:scale-110">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                  </svg>
                )}
              </button>

              {/* Profile Dropdown */}
              <AnimatePresence>
                {showProfileMenu && user && (
                   <motion.div 
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     exit={{ opacity: 0, y: 10 }}
                     className="absolute top-12 right-0 bg-white shadow-xl border border-gray-100 rounded-xl p-4 w-48 z-50"
                     onMouseLeave={() => setShowProfileMenu(false)}
                   >
                     <div className="pb-3 border-b border-gray-100 mb-3">
                       <p className="font-serif text-sm text-black">{user.name}</p>
                       <p className="font-sans text-xs text-gray-500 mt-1">{user.email}</p>
                     </div>
                     <button onClick={logout} className="w-full text-left text-xs font-sans uppercase tracking-widest text-red-500 hover:text-red-700 transition-colors">
                       Disconnect
                     </button>
                   </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Wishlist */}
            <div 
              onClick={() => navigate('/wishlist')}
              className={`relative cursor-pointer group ${textColor} w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/5 transition-colors`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 transition-transform group-hover:scale-110">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
              </svg>
              {wishlist.length > 0 && (
                  <span className="absolute top-1 right-1 bg-black text-white text-[10px] w-3.5 h-3.5 flex items-center justify-center rounded-full">
                  {wishlist.length}
                  </span>
              )}
            </div>

            {/* Cart */}
            <div 
              onClick={() => navigate('/cart')}
              className={`relative cursor-pointer group ${textColor} w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/5 transition-colors`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 transition-transform group-hover:scale-110">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
              </svg>
              {cart.length > 0 && (
                  <span className="absolute top-1 right-1 bg-[#9e6b4f] text-white text-[10px] w-3.5 h-3.5 flex items-center justify-center rounded-full">
                  {cart.length}
                  </span>
              )}
            </div>

            {/* Hamburger */}
            <button 
              onClick={toggleMenu}
              className="w-10 h-10 flex flex-col justify-center items-end gap-1.5 focus:outline-none group"
              aria-label="Toggle Menu"
            >
              <motion.span 
                  animate={isOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
                  className={`w-6 h-0.5 origin-center transition-all duration-300 ${textColor.includes("white") ? "bg-white" : "bg-black"}`}
              />
              <motion.span 
                  animate={isOpen ? { opacity: 0, x: 20 } : { opacity: 1, x: 0 }}
                  className={`w-4 h-0.5 transition-all duration-300 group-hover:w-6 ${textColor.includes("white") ? "bg-white" : "bg-black"}`}
              />
              <motion.span 
                  animate={isOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
                  className={`w-6 h-0.5 origin-center transition-all duration-300 ${textColor.includes("white") ? "bg-white" : "bg-black"}`}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.nav
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            className="fixed inset-0 z-40 flex justify-end"
          >
            {/* Backdrop Blur */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleMenu}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            {/* Menu Panel */}
            <motion.div className="relative w-full md:w-[50vw] h-full bg-[#E4E4E1] flex flex-col justify-center px-12 md:px-24 shadow-2xl">
               <div className="absolute top-0 right-0 p-12 opacity-5">
                  <RKLogo color="#9e6b4f" className="w-64 h-64" />
               </div>

               <div className="flex flex-col gap-8 relative z-10">
                 <div className="h-px w-24 bg-gradient-to-r from-[#D4AF37] to-transparent mb-4" />
                 {NAV_ITEMS.map((item) => {
                   const isActive = location.pathname === `/collections/${item.path}`;
                   return (
                   <motion.div key={item.path} variants={linkVariants}>
                     <Link
                       to={`/collections/${item.path}`}
                       className={`text-4xl md:text-5xl font-serif tracking-wide transition-all duration-300 flex items-center gap-4 group
                         ${isActive ? 'text-[#9e6b4f] italic' : 'text-black hover:text-[#9e6b4f]'}`
                       }
                     >
                       <span className="relative">
                         {item.label}
                         <span className="absolute -bottom-2 left-0 w-0 h-[2px] bg-[#D4AF37] transition-all duration-300 group-hover:w-full" />
                       </span>
                     </Link>
                   </motion.div>
                   );
                 })}
                 <motion.div key="origin" variants={linkVariants}>
                     <Link
                       to="/origin"
                       className={`text-4xl md:text-5xl font-serif tracking-wide transition-all duration-300 flex items-center gap-4 group
                         ${location.pathname === '/origin' ? 'text-[#9e6b4f] italic' : 'text-black hover:text-[#9e6b4f]'}`
                       }
                     >
                       <span className="relative">
                         Our Origin
                         <span className="absolute -bottom-2 left-0 w-0 h-[2px] bg-[#D4AF37] transition-all duration-300 group-hover:w-full" />
                       </span>
                     </Link>
                 </motion.div>
               </div>
               
               <motion.div variants={linkVariants} className="mt-16 text-black/40 text-sm font-sans relative z-10">
                  <p>© 2025 RK Assets.</p>
                  <p>Ultra-Premium Lifestyle.</p>
               </motion.div>
            </motion.div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
};
