
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, CartItem, User } from '../types';
import { api } from '../services/api';

interface NotificationState {
  message: string;
  visible: boolean;
  link?: string;
}

interface ShopContextType {
  cart: CartItem[];
  wishlist: string[]; 
  user: User | null;
  notification: NotificationState;
  
  // Cart Actions
  addToCart: (product: Product, size?: string, color?: string) => void;
  removeFromCart: (cartId: string) => void;
  clearCart: () => void;
  isInCart: (productId: string) => boolean;
  
  // Wishlist Actions
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  
  // Auth Actions
  login: (email: string, pass: string) => Promise<any>;
  register: (name: string, email: string, pass: string) => Promise<any>;
  logout: () => void;
  updateUserXP: (amount: number) => void;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  isAuthModalOpen: boolean;

  // Notification
  closeNotification: () => void;
  showNotification: (message: string, link?: string) => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [notification, setNotification] = useState<NotificationState>({ message: '', visible: false });
  const [user, setUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    const savedWishlist = localStorage.getItem('rk-wishlist');
    const savedCart = localStorage.getItem('rk-cart');
    const savedUser = localStorage.getItem('rk-user-session');
    
    if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  // Save to local storage on change
  useEffect(() => {
    localStorage.setItem('rk-wishlist', JSON.stringify(wishlist));
    localStorage.setItem('rk-cart', JSON.stringify(cart));
  }, [wishlist, cart]);

  const showToast = (msg: string, link?: string) => {
    setNotification({ message: msg, visible: true, link });
    setTimeout(() => {
      setNotification(prev => (prev.message === msg ? { ...prev, visible: false } : prev));
    }, 4000);
  };

  // --- Auth Handlers ---

  const login = async (email: string, pass: string) => {
    const res = await api.login(email, pass);
    if (res.success && res.user) {
      setUser(res.user);
      localStorage.setItem('rk-user-session', JSON.stringify(res.user));
      showToast(`Welcome back, ${res.user.name.split(' ')[0]}`);
    }
    return res;
  };

  const register = async (name: string, email: string, pass: string) => {
    const res = await api.register(name, email, pass);
    if (res.success && res.user) {
      setUser(res.user);
      localStorage.setItem('rk-user-session', JSON.stringify(res.user));
      showToast('Account created successfully');
    }
    return res;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('rk-user-session');
    showToast('You have been logged out');
  };

  const updateUserXP = (amount: number) => {
    if (user) {
        const updatedUser = { ...user, xp: user.xp + amount };
        setUser(updatedUser);
        localStorage.setItem('rk-user-session', JSON.stringify(updatedUser));
    }
  };

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  // --- Cart/Wishlist Handlers ---

  const getShortName = (name: string) => {
    const words = name.split(' ');
    if (words.length > 3) {
      return words.slice(0, 3).join(' ') + '...';
    }
    return name;
  };

  const addToCart = (product: Product, size?: string, color?: string) => {
    const selectedSize = size || (product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'One Size');
    const selectedColor = color || (product.colors && product.colors.length > 0 ? product.colors[0] : '#000000');
    
    const cartId = `${product.id}-${selectedSize}-${selectedColor}`;
    const existingItem = cart.find(item => item.cartId === cartId);

    if (!existingItem) {
      const newItem: CartItem = { ...product, cartId, selectedSize, selectedColor };
      setCart([...cart, newItem]);
      showToast(`${getShortName(product.name)} added to Cart`, '/cart');
    } else {
      showToast(`${getShortName(product.name)} already in Cart`, '/cart');
    }
  };

  const removeFromCart = (cartId: string) => {
    setCart(cart.filter(item => item.cartId !== cartId));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('rk-cart');
  };

  const isInCart = (productId: string) => {
    return cart.some(item => item.id === productId);
  };

  const toggleWishlist = (product: Product) => {
    const isPresent = wishlist.includes(product.id);
    const shortName = getShortName(product.name);

    if (isPresent) {
      setWishlist(wishlist.filter(id => id !== product.id));
      showToast(`${shortName} removed from Wishlist`);
    } else {
      setWishlist([...wishlist, product.id]);
      showToast(`${shortName} added to Wishlist`, '/wishlist');
    }
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);
  const closeNotification = () => setNotification(prev => ({ ...prev, visible: false }));
  const showNotification = (message: string, link?: string) => showToast(message, link);

  return (
    <ShopContext.Provider value={{ 
      cart, wishlist, user, notification,
      addToCart, removeFromCart, clearCart, isInCart,
      toggleWishlist, isInWishlist,
      login, register, logout, updateUserXP,
      openAuthModal, closeAuthModal, isAuthModalOpen,
      closeNotification, showNotification
    }}>
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (context === undefined) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
