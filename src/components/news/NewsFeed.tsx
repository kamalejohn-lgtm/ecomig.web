import React from 'react';
import { Activity } from 'lucide-react';
import { BrandHeader } from '../common/BrandHeader';

export const NewsFeed: React.FC = () => (
  <div className="p-16 text-center py-32 flex flex-col items-center">
     <BrandHeader title="TACTICAL NEWS" subtitle="MISSION UPDATES" />
     <Activity size={80} className="text-[#00853F] mx-auto mb-8 animate-pulse mt-12" />
     <h2 className="text-6xl font-black italic uppercase text-white mb-6 tracking-tighter">NEWS <span className="text-[#00853F]">FEED</span></h2>
     <p className="text-white/40 font-black tracking-[0.3em] uppercase italic">Awaiting tactical news updates from regional sectors...</p>
  </div>
);
