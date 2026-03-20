
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useShop } from '../context/ShopContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login, register } = useShop();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let result;
      if (isLogin) {
        result = await login(formData.email, formData.password);
      } else {
        result = await register(formData.name, formData.email, formData.password);
      }

      if (result.success) {
        onClose();
        // Reset form
        setFormData({ name: '', email: '', password: '' });
      } else {
        setError(result.error || 'Authentication failed');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-md bg-[#F5F5F0] rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-serif text-black mb-2">
              {isLogin ? 'Welcome Back' : 'Join the Hub'}
            </h2>
            <p className="text-xs font-sans uppercase tracking-widest text-gray-400">
              {isLogin ? 'Access your dossier' : 'Begin your collection'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <input 
                  type="text" 
                  placeholder="Full Name"
                  className="w-full bg-white border border-gray-200 p-4 rounded-lg font-sans text-sm focus:outline-none focus:border-black transition-colors"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  required={!isLogin}
                />
              </div>
            )}
            <div>
              <input 
                type="email" 
                placeholder="Email Address"
                className="w-full bg-white border border-gray-200 p-4 rounded-lg font-sans text-sm focus:outline-none focus:border-black transition-colors"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>
            <div>
              <input 
                type="password" 
                placeholder="Password"
                className="w-full bg-white border border-gray-200 p-4 rounded-lg font-sans text-sm focus:outline-none focus:border-black transition-colors"
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
                required
              />
            </div>

            {error && (
              <p className="text-red-500 text-xs font-sans text-center">{error}</p>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-black text-white py-4 font-serif text-sm tracking-widest hover:bg-[#9e6b4f] transition-colors disabled:opacity-50 mt-4"
            >
              {loading ? 'PROCESSING...' : (isLogin ? 'ENTER' : 'REGISTER')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button 
              onClick={() => { setIsLogin(!isLogin); setError(''); }}
              className="text-xs font-sans text-gray-500 hover:text-black transition-colors"
            >
              {isLogin ? "Don't have an account? Apply here." : "Already a member? Sign in."}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
