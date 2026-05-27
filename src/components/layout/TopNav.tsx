import React from 'react';
import { Shield } from 'lucide-react';
import { FlagSenegal, FlagNigeria, FlagGhana } from '../common/Flags';
import { GoogleTranslate } from '../ui/GoogleTranslate';

import { NavItem } from '../../types';

interface TopNavProps {
  activeTab: string;
  setActiveTab: (t: string) => void;
  isAdmin: boolean;
  setIsAdmin: (a: boolean) => void;
  navItems: NavItem[];
}

export const TopNav: React.FC<TopNavProps> = ({ activeTab, setActiveTab, isAdmin, setIsAdmin, navItems }) => {

  return (
    <header className="fixed top-0 left-0 right-0 h-20 bg-[#000080] shadow-[0_15px_40px_rgba(0,0,0,0.5)] z-[1000] flex items-center border-b-[4px] border-[#0099cc]">
      <div className="flex items-center h-full px-4 flex-shrink-0 border-r border-white/10 mr-1">
        <div 
          onClick={() => { setActiveTab('home'); setIsAdmin(false); }}
          className="flex items-center cursor-pointer group"
        >
          <div className="flex items-center group">
            <div className="h-10 flex items-center justify-center transition-all px-1">
               <img 
                 src="https://i.postimg.cc/VN8W5R7r/ECOMIG-LOGO.png" 
                 alt="ECOMIG" 
                 referrerPolicy="no-referrer"
                 className="h-full w-auto object-contain transition-transform group-hover:scale-110 drop-shadow-2xl brightness-110 contrast-110" 
               />
            </div>
            <div className="h-6 w-[1px] bg-white/30 mx-2" />
            <div className="flex flex-col items-center gap-0.5 self-center">
              <div className="flex items-center gap-1">
                <FlagSenegal className="h-4 w-6 rounded-sm border border-white/20" />
                <FlagNigeria className="h-4 w-6 rounded-sm border border-white/20" />
                <FlagGhana className="h-4 w-6 rounded-sm border border-white/20" />
              </div>
              <span className="text-[6px] font-black tracking-[0.2em] text-white/50 group-hover:text-white transition-colors uppercase">HQ</span>
            </div>
          </div>
        </div>
      </div>

      <nav className="flex-grow flex items-center h-full px-2 gap-2 overflow-x-auto whitespace-nowrap scrollbar-hide py-1.5">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => { setActiveTab(item.id); setIsAdmin(false); }}
            className={`h-14 sm:h-12 px-4 sm:px-3 rounded-md text-center flex-shrink-0 transition-all font-display border-2 flex flex-col items-center justify-center gap-1 sm:gap-0.5 group relative overflow-hidden ${
              activeTab === item.id 
                ? 'bg-white text-[#000080] border-white shadow-lg scale-105 z-10' 
                : 'text-white border-transparent hover:bg-white/10 hover:border-white/20'
            }`}
          >
            <span className="text-[10px] sm:text-[9px] font-black tracking-wider sm:tracking-widest uppercase leading-tight">{item.label}</span>
            {item.subLabel && (
              <span className={`text-[6px] sm:text-[5px] font-extrabold tracking-tighter uppercase transition-colors ${
                activeTab === item.id ? 'text-[#00853F]' : 'text-white/50 group-hover:text-white/80'
              }`}>
                {item.subLabel}
              </span>
            )}
            {activeTab === item.id && (
              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#00853F]" />
            )}
          </button>
        ))}
        
        <div className="flex items-center gap-3 ml-auto flex-shrink-0 px-4 border-l border-white/10 h-full">
          <GoogleTranslate />
        </div>
      </nav>
    </header>
  );
};
