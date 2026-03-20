import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';

const SectionCard: React.FC<{ 
  title: string; 
  subtitle: string; 
  image: string; 
  link: string; 
  delay: number;
}> = ({ title, subtitle, image, link, delay }) => {
  const navigate = useNavigate();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6 }}
      onClick={() => navigate(link)}
      className="group relative cursor-pointer overflow-hidden rounded-2xl aspect-video shadow-lg"
    >
      <div className="absolute inset-0 bg-gray-200">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>
      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500" />
      
      <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
        <span className="text-white/80 font-sans text-xs uppercase tracking-widest mb-2 opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
          {subtitle}
        </span>
        <h3 className="text-white font-serif text-2xl md:text-3xl lg:text-4xl tracking-wide group-hover:text-[#9e6b4f] transition-colors duration-300">
          {title}
        </h3>
      </div>
    </motion.div>
  );
};

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  
  // Parallax effects for the hero section to replace 3D depth
  const y1 = useTransform(scrollY, [0, 1000], [0, 300]);
  const opacity = useTransform(scrollY, [0, 600], [1, 0]);
  const scale = useTransform(scrollY, [0, 1000], [1, 1.1]);

  return (
    <div className="w-full relative z-10">
      {/* Editorial 2D Hero Section - Pure CSS/Framer Motion, No 3D */}
      <section className="relative h-screen w-full overflow-hidden flex items-center justify-center -mt-24 bg-[#0a0a0a]">
        {/* Hero Background Image with Parallax */}
        <motion.div
            style={{ y: y1, scale, opacity }}
            className="absolute inset-0 z-0"
        >
             <img
                src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=2574&auto=format&fit=crop"
                alt="Editorial Texture"
                className="w-full h-full object-cover opacity-70"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40" />
        </motion.div>

        {/* Hero Text Content */}
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto mix-blend-screen">
            <motion.div
                 initial={{ opacity: 0, y: 40 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
            >
                <div className="overflow-hidden mb-6 flex justify-center">
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        transition={{ delay: 0.6, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <p className="text-[#9e6b4f] font-sans text-xs md:text-sm tracking-[0.4em] uppercase">
                            The 2025 Standard
                        </p>
                    </motion.div>
                </div>

                <h1 className="text-white font-serif text-6xl md:text-8xl lg:text-9xl tracking-tight mb-8 leading-none drop-shadow-2xl">
                    STRUCTURAL<br />
                    <span className="italic font-light opacity-90 text-white/90">ELEGANCE</span>
                </h1>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2, duration: 0.8 }}
                >
                    <button
                        onClick={() => navigate('/collections/streetwear')}
                        className="group relative inline-flex items-center gap-3 px-12 py-4 border border-white/30 bg-white/5 backdrop-blur-md overflow-hidden transition-all duration-500 hover:border-white/60 hover:bg-white/10"
                    >
                        <span className="relative z-10 text-white font-sans text-xs tracking-[0.2em] uppercase group-hover:text-white transition-colors">
                            Explore Assets
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
                    </button>
                </motion.div>
            </motion.div>
        </div>
      </section>

      <div className="pt-24 pb-20 px-6 max-w-7xl mx-auto bg-[#F5F5F0]">
        {/* Intro Text */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-24"
        >
          <div className="h-16 w-px bg-black/20 mx-auto mb-8" />
          <h2 className="text-4xl md:text-6xl font-serif text-black mb-6 tracking-tight">
            Curated Excellence
          </h2>
          <p className="text-gray-600 font-sans text-lg max-w-xl mx-auto leading-relaxed">
            The hub of minimalist luxury. Explore our curated collections where form meets function in perfect silence.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <SectionCard 
            title="Street Wear" 
            subtitle="Urban Precision"
            image="https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=2574&auto=format&fit=crop"
            link="/collections/streetwear"
            delay={0.1}
          />
          <SectionCard 
            title="Casual" 
            subtitle="Effortless Comfort"
            image="https://images.unsplash.com/photo-1516762689617-e1cffcef479d?q=80&w=2511&auto=format&fit=crop"
            link="/collections/casual"
            delay={0.2}
          />
          <SectionCard 
            title="Winter" 
            subtitle="Seasonal Warmth"
            image="https://images.unsplash.com/photo-1520975661595-6453be3f7070?q=80&w=2574&auto=format&fit=crop"
            link="/collections/winter"
            delay={0.3}
          />
          <SectionCard 
            title="Summer" 
            subtitle="Breezy Aesthetics"
            image="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=2670&auto=format&fit=crop"
            link="/collections/summer"
            delay={0.4}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <SectionCard 
            title="Concierge" 
            subtitle="24/7 AI Assistance"
            image="https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?q=80&w=2670&auto=format&fit=crop"
            link="/collections/customer-service"
            delay={0.5}
          />
          <SectionCard 
            title="Our Origin" 
            subtitle="The Story of RK"
            image="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2670&auto=format&fit=crop"
            link="/origin"
            delay={0.6}
          />
        </div>
      </div>
    </div>
  );
};