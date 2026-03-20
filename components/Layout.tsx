
import React from 'react';
import { Navbar } from './Navbar';
import { RKWatermark } from './RKLogo';
import { Notification } from './Notification';
import { Footer } from './Footer';
import { AuthModal } from './AuthModal';
import { useShop } from '../context/ShopContext';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthModalOpen, closeAuthModal } = useShop();

  return (
    <div className="min-h-screen w-full bg-[#F5F5F0] relative selection:bg-[#9e6b4f] selection:text-white flex flex-col overflow-x-hidden">
      
      <RKWatermark className="z-0 opacity-[0.03]" />
      
      <Navbar />
      
      <Notification />

      <AuthModal isOpen={isAuthModalOpen} onClose={closeAuthModal} />
      
      <main className="flex-grow w-full relative z-10 flex flex-col pt-24">
        {children}
      </main>
      
      <Footer />
    </div>
  );
};
