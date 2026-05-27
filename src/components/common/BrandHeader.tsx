import React from 'react';
import { Mail } from 'lucide-react';
import { FlagNigeria, FlagSenegal, FlagGhana } from './Flags';

interface BrandHeaderProps {
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  theme?: 'light' | 'dark';
  titleSize?: string;
}

export const BrandHeader: React.FC<BrandHeaderProps> = ({ title, subtitle, icon, theme = 'dark', titleSize }) => {
  const isLight = theme === 'light';

  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="flex items-center group">
        <div className={`h-8 flex items-center justify-center transition-all px-1 rounded p-1 ${isLight ? 'bg-black/5' : 'bg-white/10'}`}>
           <img 
             src="https://i.postimg.cc/VN8W5R7r/ECOMIG-LOGO.png" 
             alt="ECOMIG" 
             referrerPolicy="no-referrer"
             className="h-full w-auto object-contain transition-transform group-hover:scale-110 drop-shadow-2xl brightness-110 contrast-110" 
           />
        </div>
        <div className={`h-4 w-[1px] mx-2 ${isLight ? 'bg-black/15' : 'bg-white/30'}`} />
        <div className="flex flex-col items-center gap-0.5 self-center">
          <div className="flex items-center gap-1">
            <FlagSenegal className="h-3 w-4.5 rounded-xs border border-white/10" />
            <FlagNigeria className="h-3 w-4.5 rounded-xs border border-white/10" />
            <FlagGhana className="h-3 w-4.5 rounded-xs border border-white/10" />
          </div>
          <span className={`text-[5px] font-black tracking-[0.2em] transition-colors uppercase ${isLight ? 'text-emerald-950/60 group-hover:text-emerald-950' : 'text-white/50 group-hover:text-white'}`}>HQ</span>
        </div>
      </div>
      
      {(title || subtitle) && (
        <div className={`ml-2 pl-3 border-l ${isLight ? 'border-black/15' : 'border-white/10'}`}>
          {title && <h2 className={`${titleSize || 'text-base'} font-bold italic uppercase tracking-tighter leading-none font-display ${isLight ? 'text-slate-900' : 'text-white'}`}>{title}</h2>}
          {subtitle && <p className={`text-[7px] font-bold tracking-widest uppercase mt-0.5 ${isLight ? 'text-slate-600' : 'text-white/40'}`}>{subtitle}</p>}
        </div>
      )}
      
      {icon && React.isValidElement(icon) && (
        <div className={`ml-auto w-8 h-8 flex items-center justify-center rounded ${isLight ? 'bg-black/5' : 'bg-white/10'}`}>
          {React.cloneElement(icon as React.ReactElement<any>, { size: 18 })}
        </div>
      )}
    </div>
  );
};
