import React from 'react';
import { motion } from 'framer-motion';
import { Newspaper, Radio } from 'lucide-react';
import { BrandHeader } from '../common/BrandHeader';
import { GoogleTranslate } from '../ui/GoogleTranslate';

export const NewspaperReview: React.FC = () => {
  const headlines = [
    "SSHFC registers sound performance under National SOE evaluation",
    "GPU raises alarm over press freedom challenges at ACHPR session",
    "Baboucarr Jagne Leads ECOWAS Delegation to Observer Mission",
    "Police grant permit to GALA for first anniversary commemoration",
    "China Embassy Counselor confers with GRA on opportunities",
    "State fails to file charges against forex bureau murder suspects"
  ];

  const newspapers = [
    { id: 'point', name: 'THE POINT', region: 'The Gambia', url: 'https://thepoint.gm/' },
    { id: 'standard', name: 'THE STANDARD', region: 'The Gambia', url: 'https://standard.gm/' },
    { id: 'sahara', name: 'SAHARA REPORTERS', region: 'Nigeria/Global', url: 'https://saharareporters.com/' },
    { id: 'vanguard', name: 'VANGUARD', region: 'Nigeria', url: 'https://www.vanguardngr.com/' },
    { id: 'foroyaa', name: 'FOROYAA', region: 'The Gambia', url: 'https://foroyaa.net/' },
    { id: 'lesoleil', name: 'LE SOLEIL', region: 'Senegal', url: 'https://lesoleil.sn/' },
    { id: 'daily', name: 'DAILY NEWS', region: 'The Gambia', url: 'https://dailynews.gm/' }
  ];

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

  return (
    <div className="p-1 sm:p-3 md:p-6 max-w-7xl mx-auto space-y-4 w-full">
      {/* Live Ticker to make it "Active/Life" */}
      <div className="bg-[#00853F] h-10 flex items-center overflow-hidden border border-white/20 rounded-xl shadow-lg">
        <div className="px-4 bg-black flex items-center z-10 h-full">
          <Radio size={16} className="text-[#00853F] mr-2 animate-pulse" />
          <span className="text-[9px] font-black italic tracking-widest text-white">LIVE</span>
        </div>
        <motion.div 
          animate={{ x: [800, -2000] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="whitespace-nowrap flex space-x-12"
        >
          {headlines.map((h, i) => (
            <span key={i} className="text-white font-bold italic tracking-tighter text-xs uppercase">
              {h} <span className="mx-6 text-black opacity-30">///</span>
            </span>
          ))}
        </motion.div>
      </div>

      <div className="backdrop-blur-xl bg-black/65 p-2 sm:p-4 md:p-8 rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden">
        {/* Tactical HUD accents */}
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#00853F]" />
        
        {/* Top-Left Translation Switcher */}
        <div className="flex justify-start mb-4 relative z-20">
          <GoogleTranslate />
        </div>
        
        <div className="flex justify-between items-center mb-4">
           <BrandHeader title="NEWS FEED" subtitle="MEDIA MONITORING DIVISION" />
         </div>

        <header className="mb-6 border-l-4 border-[#00853F] pl-4">
           <p className="text-[#00853F] font-black text-[9px] tracking-[0.3em] uppercase mb-1 italic">MEDIA MONITORING // MISSION ALIGNMENT</p>
           <h2 className="text-xl md:text-4xl font-black italic uppercase text-white leading-none tracking-tighter">NEWSPAPERS <span className="text-[#00853F]">REVIEW</span></h2>
        </header>
        
        <div className="space-y-3 relative z-10">
          {/* Top Row - 4 Up */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {newspapers.slice(0, 4).map((news) => (
              <motion.a 
                key={news.id}
                href={getTranslatedUrl(news.url)}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02, filter: "brightness(1.1)" }}
                className="bg-white/[0.03] p-2.5 rounded-lg border border-white/10 hover:border-[#00853F] transition-all group cursor-pointer shadow-lg active:scale-95 block"
              >
                <div className="aspect-[16/7] bg-white rounded mb-2.5 relative overflow-hidden flex items-center justify-center border border-white/10">
                   <Newspaper size={20} className="text-[#00853F] opacity-15" />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/95 to-transparent" />
                   <div className="absolute bottom-1 right-1 flex justify-end">
                      <span className="text-[7px] font-black text-[#00853F] tracking-widest uppercase italic bg-white/10 px-1.5 py-0.5 rounded backdrop-blur-md">REGION: {news.region}</span>
                   </div>
                </div>
                <h3 className="text-xs md:text-sm font-black italic uppercase text-white group-hover:text-[#00853F] transition-colors leading-tight tracking-tighter drop-shadow-md text-left">{news.name}</h3>
                <p className="text-white/40 font-medium italic mt-1 text-[10px] leading-snug text-left">Latest coverage and sub-regional stability report from {news.name}. Tactical observation mission in progress.</p>
                
                <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[7px] font-black text-[#00853F] tracking-widest uppercase">ACTIVE FEED</span>
                  <div className="w-1.5 h-1.5 bg-[#00853F] rounded-full animate-pulse shadow-[0_0_8px_#00853F]" />
                </div>
              </motion.a>
            ))}
          </div>

          {/* Bottom Row - 3 Down (Centered dynamically) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 max-w-5xl mx-auto gap-3">
            {newspapers.slice(4).map((news) => (
              <motion.a 
                key={news.id}
                href={getTranslatedUrl(news.url)}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02, filter: "brightness(1.1)" }}
                className="bg-white/[0.03] p-2.5 rounded-lg border border-white/10 hover:border-[#00853F] transition-all group cursor-pointer shadow-lg active:scale-95 block"
              >
                <div className="aspect-[16/7] bg-white rounded mb-2.5 relative overflow-hidden flex items-center justify-center border border-white/10">
                   <Newspaper size={20} className="text-[#00853F] opacity-15" />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/95 to-transparent" />
                   <div className="absolute bottom-1 right-1 flex justify-end">
                      <span className="text-[7px] font-black text-[#00853F] tracking-widest uppercase italic bg-white/10 px-1.5 py-0.5 rounded backdrop-blur-md">REGION: {news.region}</span>
                   </div>
                </div>
                <h3 className="text-xs md:text-sm font-black italic uppercase text-white group-hover:text-[#00853F] transition-colors leading-tight tracking-tighter drop-shadow-md text-left">{news.name}</h3>
                <p className="text-white/40 font-medium italic mt-1 text-[10px] leading-snug text-left">Latest coverage and sub-regional stability report from {news.name}. Tactical observation mission in progress.</p>
                
                <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[7px] font-black text-[#00853F] tracking-widest uppercase">ACTIVE FEED</span>
                  <div className="w-1.5 h-1.5 bg-[#00853F] rounded-full animate-pulse shadow-[0_0_8px_#00853F]" />
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};


