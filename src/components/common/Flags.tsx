import React from 'react';

export const FlagSenegal = ({ className }: { className?: string }) => (
  <div className={`relative flex aspect-[3/2] overflow-hidden ${className}`}>
    <div className="w-1/3 bg-[#00853f]" />
    <div className="w-1/3 bg-[#fcd116] flex items-center justify-center">
      <div className="w-1/2 h-1/2 bg-[#00853f] [clip-path:polygon(50%_0%,61%_35%,98%_35%,68%_57%,79%_91%,50%_70%,21%_91%,32%_57%,2%_35%,39%_35%)]" />
    </div>
    <div className="w-1/3 bg-[#e31b23]" />
  </div>
);

export const FlagNigeria = ({ className }: { className?: string }) => (
  <div className={`flex aspect-[3/2] overflow-hidden ${className}`}>
    <div className="w-1/3 bg-[#008751]" />
    <div className="w-1/3 bg-white" />
    <div className="w-1/3 bg-[#008751]" />
  </div>
);

export const FlagGhana = ({ className }: { className?: string }) => (
  <div className={`relative flex flex-col aspect-[3/2] overflow-hidden ${className}`}>
    <div className="h-1/3 bg-[#cf0921]" />
    <div className="h-1/3 bg-[#fcd116] flex items-center justify-center">
      <div className="w-1/4 h-[80%] bg-black [clip-path:polygon(50%_0%,61%_35%,98%_35%,68%_57%,79%_91%,50%_70%,21%_91%,32%_57%,2%_35%,39%_35%)]" />
    </div>
    <div className="h-1/3 bg-[#006b3f]" />
  </div>
);

export const EcomigLogo = () => (
    <div className="flex items-center gap-3 scale-90 origin-left">
      <img 
        src="https://i.postimg.cc/VN8W5R7r/ECOMIG-LOGO.png" 
        alt="ECOMIG" 
        referrerPolicy="no-referrer"
        className="h-16 w-auto object-contain brightness-110 drop-shadow-md" 
      />
      <div className="flex gap-2 ml-2">
        <FlagSenegal className="h-4 w-6 rounded-sm shadow-sm" />
        <FlagNigeria className="h-4 w-6 rounded-sm shadow-sm" />
        <FlagGhana className="h-4 w-6 rounded-sm shadow-sm" />
      </div>
    </div>
);
