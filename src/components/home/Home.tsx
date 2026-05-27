import React from 'react';
import { Camera, Newspaper, Calendar } from 'lucide-react';
import { BrandHeader } from '../common/BrandHeader';

interface HomeProps {
  setActiveTab: (t: string) => void;
}

export const Home: React.FC<HomeProps> = ({ setActiveTab }) => (
  <div className="relative min-h-screen w-full flex flex-col items-center pt-20 px-4 overflow-hidden">


    {/* Hero Content Center */}
    <div className="relative z-20 flex flex-col items-center mt-36">
       {/* Transparent Logo and Flags above text */}
       <BrandHeader />

       <h1 className="text-4xl md:text-6xl font-bold italic uppercase text-white leading-none tracking-tighter drop-shadow-[0_10px_25px_rgba(0,0,0,0.9)] font-display">
          ECOMIG
       </h1>
       
       <p className="text-sm md:text-md lg:text-lg font-bold text-white tracking-widest max-w-xl mt-4 px-6 text-center leading-snug drop-shadow-[0_4px_10px_rgba(0,0,0,0.9)]">
          ECOWAS Mission in The Gambia – Securing Peace, Building Trust, Strengthening Democracy
       </p>

       <div className="flex flex-col gap-3 mt-8 w-full max-w-[260px] px-4">
          <button 
            onClick={() => setActiveTab('about')}
            className="w-full bg-[#00853F] text-white py-3 rounded-sm font-black text-sm tracking-[0.2em] uppercase hover:bg-[#007035] transition-all shadow-xl"
          >
            LEARN MORE
          </button>
          <button 
            onClick={() => setActiveTab('contact')}
            className="w-full bg-transparent border-2 border-white text-white py-3 rounded-sm font-black text-sm tracking-[0.2em] uppercase hover:bg-white hover:text-black transition-all shadow-xl"
          >
            CONTACT US
          </button>
       </div>
    </div>

    <div className="fixed bottom-0 left-0 right-0 z-[100] flex flex-col items-center pb-2">
       {/* Triple Stripe Bars */}
       <div className="w-full max-w-4xl px-4 md:px-0 flex flex-col gap-1">
          <button 
            onClick={() => setActiveTab('gallery')}
            className="h-10 bg-[#00853F] w-full flex items-center justify-center gap-4 text-white hover:brightness-110 transition-all rounded-lg shadow-lg"
          >
             <Camera size={20} className="drop-shadow-lg" />
             <span className="text-sm font-black tracking-[0.3em] uppercase">GALLERY</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('news')}
            className="h-10 bg-[#0a0a0a] w-full flex items-center justify-center gap-4 text-white hover:brightness-125 transition-all relative rounded-lg shadow-lg"
          >
             <Newspaper size={20} className="drop-shadow-lg" />
             <span className="text-sm font-black tracking-[0.3em] uppercase">NEWS</span>
             <div className="absolute right-6 bg-red-600 text-white text-[8px] font-black px-3 py-1 rounded-full shadow-[0_0_15px_rgba(220,38,38,0.7)] animate-pulse border border-white/30 uppercase">ALERT</div>
          </button>
          
          <button 
            onClick={() => setActiveTab('events')}
            className="h-10 bg-[#cc0000] w-full flex items-center justify-center gap-4 text-white hover:brightness-110 transition-all rounded-lg shadow-lg"
          >
             <Calendar size={20} className="drop-shadow-lg" />
             <span className="text-sm font-black tracking-[0.3em] uppercase">EVENTS</span>
          </button>
       </div>
    </div>
  </div>
);
