import React from 'react';
import { Navbar } from './Navbar';
import { RKWatermark } from './RKLogo';
import { Notification } from './Notification';
import { Footer } from './Footer';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    /* 1. Global Layout Wrapper: Limits max width to 1440px and centers content.
          relative positioning allows absolute children (like Watermark) to be contained. */
    <div className="min-h-screen w-full bg-[#F5F5F0] relative selection:bg-[#9e6b4f] selection:text-white flex flex-col overflow-x-hidden">
      
      {/* Watermark - Absolute to container, low z-index */}
      <RKWatermark className="z-0 opacity-[0.03]" />
      
      {/* Navigation */}
      <Navbar />
      
      {/* Notification Toast */}
      <Notification />
      
      {/* 
         Main Content Area 
         - flex-grow pushes footer down
         - relative z-10 ensures content sits above watermark 
         - pt-24 ensures content starts below the fixed navbar
      */}
      <main className="flex-grow w-full relative z-10 flex flex-col pt-24">
        {children}
      </main>
      
      <Footer />
    </div>
  );
};