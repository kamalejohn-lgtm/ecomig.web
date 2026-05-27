import React from 'react';
import { Calendar } from 'lucide-react';
import { BrandHeader } from '../common/BrandHeader';

export const MissionCalendar: React.FC = () => (
  <div className="p-16">
    <BrandHeader title="MISSION CALENDAR" subtitle="CHRONOLOGICAL LOGS" />
    <header className="mb-16">
       <p className="text-[#00853F] font-black text-[12px] tracking-[0.5em] uppercase mb-4 italic">CHRONOLOGICAL LOGS</p>
       <h2 className="text-7xl font-black italic uppercase text-white leading-none">MISSION <span className="text-[#00853F]">CALENDAR</span></h2>
    </header>
    <div className="p-20 border border-white/5 bg-black/10 backdrop-blur-md rounded-3xl text-center">
       <Calendar className="text-[#00853F] mx-auto mb-8 opacity-20" size={60} />
       <p className="text-white/40 font-black tracking-widest uppercase italic">CALENDAR SYNC PENDING ADMINISTRATIVE BROADCAST</p>
    </div>
  </div>
);
