import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, Minimize2, Maximize2, Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

interface Message {
  role: 'user' | 'ai';
  content: string;
}

export const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', content: 'ECOMIG TACTICAL AI SYSTEM ONLINE. Awaiting command.' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const handleOpenAI = () => {
      setIsOpen(true);
      setIsMinimized(false);
    };
    window.addEventListener('open-ecomig-ai', handleOpenAI);
    return () => {
      window.removeEventListener('open-ecomig-ai', handleOpenAI);
    };
  }, []);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await axios.post('/api/chat', {
        message: userMessage,
        history: messages
      });

      setMessages(prev => [...prev, { role: 'ai', content: response.data.response }]);
    } catch (error: any) {
      console.error('AI Error:', error);
      
      const errorData = error.response?.data;
      const errorStr = typeof errorData === 'string' ? errorData.toLowerCase() : '';
      // Robust detection of "Starting Server" HTML page
      const isHtml = errorStr.includes('<!doctype') || errorStr.includes('<html');
      
      if (isHtml && errorStr.includes('starting server')) {
        console.warn('[AI] Server rebooting, retrying in 5s...');
        setTimeout(() => handleSendInternal(userMessage), 5000);
        return;
      }

      const responseText = errorData?.response || '';
      if (responseText.includes('API Key') || responseText.includes('GEMINI_API_KEY')) {
        setMessages(prev => [...prev, { role: 'ai', content: 'SYSTEM ERROR: GEMINI_API_KEY IS MISSING. PLEASE CONFIGURE IN APP SETTINGS > SECRETS AND SELECT YOUR KEY.' }]);
        return;
      }
      
      setMessages(prev => [...prev, { role: 'ai', content: 'COMMUNICATION BREAKDOWN. TACTICAL LINK LOST.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendInternal = async (msg: string) => {
    setIsLoading(true);
    try {
      const response = await axios.post('/api/chat', { message: msg, history: messages });
      setMessages(prev => [...prev, { role: 'ai', content: response.data.response }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'ai', content: 'SECURE LINK FAILURE. TERMINAL OFFLINE.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-32 right-6 z-[1000]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className={`bg-[#000033]/95 backdrop-blur-xl border-2 border-[#00853F]/40 overflow-hidden shadow-[0_0_50px_rgba(0,133,63,0.3)] flex flex-col transition-all duration-300 ${
              isMinimized ? 'h-14 w-64' : 'h-[500px] w-80 md:w-96'
            }`}
          >
            {/* Header */}
            <div className="h-14 bg-[#00853F]/20 flex items-center justify-between px-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Bot size={20} className="text-[#00853F]" />
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black tracking-widest text-[#00853F] leading-none">ECOMIG AI</span>
                  <span className="text-[8px] font-mono text-white/40 leading-none">V 3.0 ALPHA-SECURE</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setIsMinimized(!isMinimized)} className="p-1.5 hover:bg-white/10 rounded transition-colors">
                  {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
                </button>
                <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-white/10 rounded transition-colors text-red-500">
                  <X size={16} />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages */}
                <div ref={scrollRef} className="flex-grow overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-[#00853F]/20 scrollbar-track-transparent">
                  {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${
                        msg.role === 'user' 
                          ? 'bg-blue-600/20 border border-blue-500/30 text-blue-100 rounded-tr-none' 
                          : 'bg-black/40 border border-[#00853F]/20 text-white/90 rounded-tl-none font-mono'
                      }`}>
                        {msg.role === 'ai' && (
                          <div className="flex items-center gap-2 mb-1.5 opacity-50">
                            <Terminal size={10} />
                            <span className="text-[8px] uppercase tracking-[0.2em] font-black">LOG_INCOMING</span>
                          </div>
                        )}
                        {msg.content}
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-black/40 border border-[#00853F]/20 p-3 rounded-2xl rounded-tl-none flex gap-1">
                        <div className="w-1.5 h-1.5 bg-[#00853F] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-1.5 h-1.5 bg-[#00853F] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-1.5 h-1.5 bg-[#00853F] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  )}
                </div>

                {/* Input */}
                <div className="p-4 border-t border-white/10 bg-black/40">
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                      placeholder="ENTER COMMAND..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-[#00853F]/50 transition-colors placeholder:text-white/20 uppercase font-mono"
                    />
                    <button 
                      onClick={handleSend}
                      disabled={isLoading || !input.trim()}
                      className="absolute right-2 p-2 text-[#00853F] hover:bg-[#00853F]/10 rounded-lg transition-colors disabled:opacity-30"
                    >
                      <Send size={18} />
                    </button>
                  </div>
                  <div className="mt-2 text-[8px] text-center text-white/20 uppercase tracking-[0.3em] font-black">
                    End-to-End Encryption Enabled
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => { setIsOpen(true); setIsMinimized(false); }}
        className={`w-16 h-16 bg-[#00853F] rounded-full shadow-[0_0_30px_rgba(0,133,63,0.5)] flex items-center justify-center border-4 border-[#0c2b0c] group relative overflow-hidden ${isOpen ? 'hidden' : ''}`}
      >
        <img 
          src="https://i.postimg.cc/VN8W5R7r/ECOMIG-LOGO.png" 
          alt="ECOMIG AI" 
          referrerPolicy="no-referrer"
          className="w-10 h-10 object-contain group-hover:scale-110 transition-transform"
        />
        <div className="absolute -top-1 -right-1 bg-red-600 text-[8px] font-black px-1.5 py-0.5 rounded-full border border-white/20 animate-pulse">LIVE</div>
      </motion.button>
    </div>
  );
};
