
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { api } from '../services/api';
import { OrderPayload } from '../types';

export const Cart: React.FC = () => {
  const { cart, removeFromCart, clearCart, showNotification } = useShop();
  const navigate = useNavigate();

  // Checkout State
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('creditCard1');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState<string | null>(null);

  const subtotal = cart.reduce((acc, item) => acc + item.price, 0);
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + tax;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) return;

    setIsProcessing(true);

    // Construct Payload matching the specific requirement
    const payload: OrderPayload = {
        order: cart.map(item => ({
            id: item.id,
            name: item.name,
            quantity: 1 // Default to 1 as current logic handles single items
        })),
        paymentMethod: paymentMethod,
        deliveryAddress: address
    };

    try {
        const result = await api.submitOrder(payload);
        if (result.success) {
            setOrderComplete(result.orderId);
            clearCart();
        }
    } catch (error) {
        showNotification("Transaction failed. Please try again.");
    } finally {
        setIsProcessing(false);
    }
  };

  const closeCheckout = () => {
      setIsCheckoutOpen(false);
      setOrderComplete(null);
      setAddress('');
      if (orderComplete) {
          navigate('/');
      }
  };

  return (
    <div className="pt-40 pb-20 px-6 max-w-7xl mx-auto z-10 relative w-full flex flex-col min-h-screen">
      <motion.button 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate('/collections/streetwear')}
        className="mb-8 text-sm font-sans uppercase tracking-widest text-gray-500 hover:text-black flex items-center gap-2 w-fit"
      >
        ← Shop More
      </motion.button>

      <header className="mb-12">
        <h1 className="text-5xl md:text-6xl font-serif text-black mb-4">Acquisition Request</h1>
        <div className="h-1 w-20 bg-[#D4AF37]" />
      </header>

      {cart.length === 0 && !orderComplete ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-20 text-center flex-grow"
        >
          <p className="text-xl font-serif text-gray-400 mb-8">Your selection is currently empty.</p>
          <button 
            onClick={() => navigate('/collections/streetwear')}
            className="px-8 py-3 bg-black text-white font-serif tracking-widest hover:bg-[#9e6b4f] transition-colors"
          >
            EXPLORE ASSETS
          </button>
        </motion.div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
          {/* Cart Items List */}
          <div className="flex-1 space-y-8">
            <AnimatePresence>
              {cart.map((item, index) => {
                const isSquare = index % 2 === 0;
                const aspectClass = isSquare ? 'aspect-square' : 'aspect-[3/2]';
                
                return (
                  <motion.div 
                    key={item.cartId}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    className="flex gap-6 border-b border-gray-200 pb-8 items-start"
                  >
                    <div 
                        className={`w-32 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer relative ${aspectClass}`} 
                        onClick={() => navigate(`/product/${item.id}`)}
                    >
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="absolute inset-0 w-full h-full object-cover" 
                      />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                          <div>
                              <h3 className="font-serif text-xl mb-1 cursor-pointer hover:text-[#9e6b4f] transition-colors" onClick={() => navigate(`/product/${item.id}`)}>{item.name}</h3>
                              <p className="text-xs font-sans text-gray-400 uppercase tracking-widest mb-2">{item.category}</p>
                              
                              <div className="flex items-center gap-4 mt-2">
                                  <div className="flex items-center gap-2">
                                      <span className="text-xs text-gray-400 font-sans uppercase">Size:</span>
                                      <span className="text-sm font-medium font-sans">{item.selectedSize}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                      <span className="text-xs text-gray-400 font-sans uppercase">Color:</span>
                                      <div 
                                          className="w-4 h-4 rounded-full border border-gray-200" 
                                          style={{ backgroundColor: item.selectedColor }} 
                                      />
                                  </div>
                              </div>
                          </div>
                          <p className="font-medium font-sans">${item.price.toLocaleString()}</p>
                      </div>
                      
                      <button 
                        onClick={() => removeFromCart(item.cartId)}
                        className="text-xs text-red-500 hover:text-black font-sans uppercase tracking-wider mt-4 underline decoration-1 underline-offset-4"
                      >
                        Remove
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          {cart.length > 0 && (
            <div className="w-full lg:w-96">
                <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-xl sticky top-32">
                <h2 className="font-serif text-2xl mb-8">Summary</h2>
                
                <div className="space-y-4 mb-8 font-sans text-sm">
                    <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>${subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                    <span>Estimated Tax</span>
                    <span>${tax.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="text-[#9e6b4f]">Complimentary</span>
                    </div>
                    <div className="h-px w-full bg-gray-200 my-4" />
                    <div className="flex justify-between text-lg font-medium">
                    <span>Total</span>
                    <span>${total.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                    </div>
                </div>

                <button 
                    onClick={() => setIsCheckoutOpen(true)}
                    className="w-full bg-black text-white py-4 font-serif text-lg tracking-widest hover:bg-[#9e6b4f] transition-colors shadow-lg"
                >
                    PROCEED TO CHECKOUT
                </button>
                <p className="text-center text-xs text-gray-400 mt-4 font-sans">
                    Secure SSL Encryption. Global Shipping.
                </p>
                </div>
            </div>
          )}
        </div>
      )}

      {/* Checkout Modal */}
      <AnimatePresence>
        {isCheckoutOpen && (
            <>
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
                    onClick={() => !isProcessing && !orderComplete && setIsCheckoutOpen(false)}
                />
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-[#F5F5F0] rounded-2xl shadow-2xl z-50 overflow-hidden max-h-[90vh] overflow-y-auto"
                >
                    {orderComplete ? (
                        <div className="p-12 text-center">
                            <motion.div 
                                initial={{ scale: 0 }} 
                                animate={{ scale: 1 }} 
                                transition={{ type: "spring", damping: 12 }}
                                className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                </svg>
                            </motion.div>
                            <h2 className="text-3xl font-serif mb-4">Acquisition Confirmed</h2>
                            <p className="text-gray-600 font-sans mb-8">Your Order ID is <span className="font-bold text-black">{orderComplete}</span>.<br/>A receipt has been sent to your dossier.</p>
                            <button 
                                onClick={closeCheckout}
                                className="bg-black text-white px-8 py-3 font-serif tracking-widest hover:bg-[#9e6b4f] transition-colors w-full"
                            >
                                RETURN TO HUB
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleCheckout} className="p-8">
                             <div className="flex justify-between items-center mb-8">
                                <h2 className="text-2xl font-serif">Finalize Details</h2>
                                <button type="button" onClick={() => setIsCheckoutOpen(false)} disabled={isProcessing} className="text-gray-400 hover:text-black">✕</button>
                             </div>

                             <div className="space-y-6 mb-8">
                                <div>
                                    <label className="block text-xs font-sans uppercase tracking-widest text-gray-500 mb-2">Delivery Address</label>
                                    <textarea 
                                        required
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        placeholder="Enter full shipping address..."
                                        className="w-full bg-white border border-gray-200 rounded-lg p-3 font-sans text-sm h-24 focus:ring-1 focus:ring-black outline-none resize-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-sans uppercase tracking-widest text-gray-500 mb-2">Payment Method</label>
                                    <select 
                                        value={paymentMethod}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="w-full bg-white border border-gray-200 rounded-lg p-3 font-sans text-sm focus:ring-1 focus:ring-black outline-none"
                                    >
                                        <option value="creditCard1">Credit Card (Ending in 4242)</option>
                                        <option value="paypal">PayPal</option>
                                        <option value="crypto">Cryptocurrency (ETH)</option>
                                    </select>
                                </div>
                             </div>

                             <div className="border-t border-gray-200 pt-6">
                                <div className="flex justify-between text-sm font-medium mb-6">
                                    <span>Total Amount</span>
                                    <span>${total.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                                </div>
                                
                                <button 
                                    type="submit"
                                    disabled={isProcessing}
                                    className="w-full bg-black text-white py-4 font-serif text-lg tracking-widest hover:bg-[#9e6b4f] transition-colors shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-3"
                                >
                                    {isProcessing ? (
                                        <>
                                            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            <span>PROCESSING...</span>
                                        </>
                                    ) : (
                                        'CONFIRM ACQUISITION'
                                    )}
                                </button>
                             </div>
                        </form>
                    )}
                </motion.div>
            </>
        )}
      </AnimatePresence>
    </div>
  );
};
