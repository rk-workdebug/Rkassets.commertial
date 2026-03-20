import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { sendMessageToGemini } from '../services/geminiService';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
}

export const CustomerService: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'bot', text: 'Welcome to RK Assets Concierge. How may I assist you with our collections today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { id: Date.now().toString(), sender: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const history = messages.map(m => `${m.sender}: ${m.text}`);
    const botResponseText = await sendMessageToGemini(userMsg.text, history);

    const botMsg: Message = { id: (Date.now() + 1).toString(), sender: 'bot', text: botResponseText };
    setMessages(prev => [...prev, botMsg]);
    setIsLoading(false);
  };

  return (
    <div className="pt-40 pb-20 px-6 max-w-4xl mx-auto w-full relative z-10 flex flex-col flex-grow">
       <header className="mb-12">
        <h1 className="text-5xl md:text-6xl font-serif text-black mb-4">Concierge</h1>
        <div className="h-1 w-20 bg-[#9e6b4f]" />
        <p className="mt-4 text-gray-600 font-sans">
          Experience our AI-powered assistance for immediate support regarding sizing, collections, and care.
        </p>
      </header>

      <div className="flex-1 bg-white/50 backdrop-blur-md rounded-2xl border border-gray-200 shadow-xl overflow-hidden flex flex-col h-[600px]">
        {/* Chat Window */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={msg.id}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[80%] p-4 rounded-2xl text-sm font-sans leading-relaxed
                ${msg.sender === 'user' 
                  ? 'bg-black text-white rounded-br-none' 
                  : 'bg-white text-black border border-gray-100 rounded-bl-none shadow-sm'
                }`}
              >
                {msg.text}
              </div>
            </motion.div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
               <div className="bg-white p-4 rounded-2xl rounded-bl-none border border-gray-100 shadow-sm flex gap-2">
                 <span className="w-2 h-2 bg-[#9e6b4f] rounded-full animate-bounce" />
                 <span className="w-2 h-2 bg-[#9e6b4f] rounded-full animate-bounce delay-75" />
                 <span className="w-2 h-2 bg-[#9e6b4f] rounded-full animate-bounce delay-150" />
               </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form onSubmit={handleSend} className="p-4 bg-white border-t border-gray-100 flex gap-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Inquire about our assets..."
            className="flex-1 bg-[#F5F5F0] rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-black font-sans transition-all"
          />
          <button 
            type="submit"
            disabled={isLoading}
            className="bg-black text-white px-6 py-3 rounded-xl hover:bg-[#9e6b4f] transition-colors disabled:opacity-50 font-serif"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};