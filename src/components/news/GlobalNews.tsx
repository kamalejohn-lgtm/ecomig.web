import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Globe } from 'lucide-react';
import { BrandHeader } from '../common/BrandHeader';
import { GoogleTranslate } from '../ui/GoogleTranslate';

export const GlobalNews: React.FC = () => {
  const [currentLang, setCurrentLang] = React.useState(() => localStorage.getItem('ecomig_current_lang') || 'en');

  React.useEffect(() => {
    const handleLangChange = () => {
      setCurrentLang(localStorage.getItem('ecomig_current_lang') || 'en');
    };
    window.addEventListener('ecomig_language_changed', handleLangChange);
    return () => {
      window.removeEventListener('ecomig_language_changed', handleLangChange);
    };
  }, []);

  const getTranslatedUrl = (url: string) => {
    if (currentLang === 'fr') {
      return `https://translate.google.com/translate?sl=en&tl=fr&u=${encodeURIComponent(url)}`;
    }
    return url;
  };

  const worldNews = [
    { id: 'bbc', name: 'BBC WORLD', detail: 'Global news network', url: 'https://www.bbc.com/news/world' },
    { id: 'africa', name: 'AFRICA NEWS', detail: 'Continental reporting', url: 'https://www.africanews.com/' },
    { id: 'cnn', name: 'CNN INTERNATIONAL', detail: 'Round-the-clock news', url: 'https://edition.cnn.com/world' },
    { id: 'aljazeera', name: 'AL JAZEERA', detail: 'Middle-east perspective', url: 'https://www.aljazeera.com/' },
    { id: 'tvc', name: 'TVC LIVE', detail: 'Nigerian news broadcast', url: 'https://www.tvcentertainment.tv/live/' },
    { id: 'channels', name: 'CHANNELS TV', detail: 'Breaking news coverage', url: 'https://www.channelstv.com/' },
    { id: 'grts', name: 'GRTS TV LIVE', detail: 'Gambia national broadcaster', url: 'https://grts.gm/' },
    { id: 'rts_senegal', name: 'RTS SENEGAL', detail: 'Senegalese national broadcaster', url: 'https://www.rts.sn/' },
    { id: 'sporty', name: 'SPORTY TV LIVE', detail: 'Sports news & events', url: 'https://www.sportytv.com/' },
    { id: 'politics', name: 'POLITICS', detail: 'Tactical political intel', url: 'https://www.politico.com/' }
  ];

  return (
    <div className="p-1 sm:p-4 md:p-12 max-w-7xl mx-auto min-h-screen flex items-center justify-center w-full white-board-container">
      <div className="bg-[#e6f0e6] border-4 sm:border-[16px] border-[#99a199] shadow-[inset_0_0_100px_rgba(0,0,0,0.1),10px_10px_30px_rgba(0,0,0,0.5)] relative p-3 sm:p-8 md:p-16 flex flex-col items-center w-full">
        {/* Outer Frame Bevel */}
        <div className="absolute inset-0 border-t-[8px] border-l-[8px] border-white/40 pointer-events-none" />
        <div className="absolute inset-0 border-b-[8px] border-r-[8px] border-black/20 pointer-events-none" />
        
        {/* Top-Left Translation Switcher */}
        <div className="w-full flex justify-start mb-4 relative z-20">
          <GoogleTranslate />
        </div>

        <div className="w-full flex justify-between items-center mb-8 relative z-20">
           <BrandHeader title="GLOBAL NEWS HUB" subtitle="TACTICAL INTELLIGENCE FEEDS" theme="light" />
        </div>

        <header className="w-full mb-8 bg-[#00a2ed] border-[4px] border-[#0071ba] shadow-xl relative p-4 flex items-center justify-center">
           <div className="absolute inset-0 border-t-2 border-l-2 border-white/30 pointer-events-none" />
           <div className="absolute inset-0 border-b-2 border-r-2 border-black/20 pointer-events-none" />
           <h2 className="text-xl md:text-4xl font-bold italic uppercase text-white leading-none tracking-tighter drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)] font-display">WORLD NEWS</h2>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full relative z-10">
          {worldNews.map((news) => (
            <motion.a 
              key={news.id}
              href={getTranslatedUrl(news.url)}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ translateZ: 10 }}
              className="bg-[#00a651] border-[4px] border-[#006e36] shadow-lg relative p-4 md:p-6 flex flex-col items-center justify-center text-center transition-all group active:translate-y-1 active:shadow-inner"
            >
              <div className="absolute inset-0 border-t-2 border-l-2 border-white/20 pointer-events-none" />
              <div className="absolute inset-0 border-b-2 border-r-2 border-black/20 pointer-events-none" />
              
              <div className="h-10 md:h-14 w-full" /> {/* Placeholder space to match visual layout */}
              
              <div className="absolute inset-0 flex flex-col items-center justify-center px-4 font-display">
                <h3 className="text-base md:text-lg font-bold italic text-white uppercase leading-tight drop-shadow-md group-hover:scale-105 transition-transform">{news.name}</h3>
                <p className="text-[9px] font-bold text-white/50 uppercase tracking-widest mt-1 hidden md:block">{news.detail}</p>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </div>
  );
};
