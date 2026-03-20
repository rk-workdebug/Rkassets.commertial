import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export const Origin: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-32 pb-20 px-6 max-w-5xl mx-auto w-full relative z-10">
      <motion.button 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate('/')}
        className="mb-8 text-sm font-sans uppercase tracking-widest text-gray-500 hover:text-black flex items-center gap-2"
      >
        ← Return Home
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-5xl md:text-7xl font-serif text-black mb-8">The Origin</h1>
        
        {/* Hub Image */}
        <div className="w-full aspect-video bg-gray-200 rounded-2xl overflow-hidden shadow-2xl mb-12 relative">
          <img 
            src="https://picsum.photos/1200/675?grayscale&blur=2" 
            alt="The Hub" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center">
             <h2 className="text-white font-serif text-4xl md:text-6xl tracking-widest drop-shadow-lg">RK HUB</h2>
          </div>
        </div>

        {/* Story Content */}
        <div className="prose prose-lg max-w-none font-sans text-gray-600 space-y-8 leading-loose">
          <p>
            <span className="text-[#9e6b4f] font-serif text-2xl font-bold mr-2">RK Assets</span> 
            was born from a singular vision: to strip away the noise of modern fashion and reveal the structural beauty beneath. Established in 2025, we began not as a clothing brand, but as a design philosophy centered on the concept of the "Asset."
          </p>
          <p>
            We believe that what you wear is not merely utility, but an investment in your personal aesthetic. Each piece is engineered with architectural precision, utilizing materials that speak to endurance and timelessness.
          </p>
          <p>
            Our "Hub" serves as the epicenter of this creation—a space where copper-toned warmth meets the cold precision of minimalism. It is here that we curate collections for the modern individual who values substance over hype, and elegance over excess.
          </p>
          <p>
            Welcome to the new standard. Welcome to RK Assets.
          </p>
        </div>

        <div className="mt-16 border-t border-gray-200 pt-12 text-center">
            <p className="font-serif italic text-2xl text-black">"Structure is the ultimate luxury."</p>
            <p className="mt-4 text-sm font-sans uppercase tracking-widest text-[#9e6b4f]">— The Founder</p>
        </div>
      </motion.div>
    </div>
  );
};