import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useShop } from '../context/ShopContext';
import { useNavigate } from 'react-router-dom';

export const Notification: React.FC = () => {
  const { notification, closeNotification } = useShop();
  const navigate = useNavigate();

  return (
    <AnimatePresence>
      {notification.visible && (
        <motion.div
          initial={{ opacity: 0, y: 50, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: 20, x: '-50%' }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-8 left-1/2 z-[100] bg-[#050505] text-white px-8 py-4 rounded-none shadow-2xl border-l-4 border-[#9e6b4f] flex items-center gap-6 min-w-[320px] max-w-[90vw]"
        >
            <div className="flex-1">
                <p className="font-serif text-xs text-[#9e6b4f] uppercase tracking-widest mb-1">Notification</p>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                    <p className="font-sans text-sm tracking-wide font-medium">{notification.message}</p>
                    {notification.link && (
                        <button 
                            onClick={() => {
                                navigate(notification.link!);
                                closeNotification();
                            }}
                            className="text-xs font-sans uppercase tracking-widest underline underline-offset-4 decoration-[#9e6b4f] text-gray-300 hover:text-white transition-colors"
                        >
                            View
                        </button>
                    )}
                </div>
            </div>
            <button 
                onClick={closeNotification}
                className="text-white/50 hover:text-white transition-colors"
            >
                ✕
            </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};