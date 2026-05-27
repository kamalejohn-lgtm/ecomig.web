import React, { useState, useEffect } from 'react';
import { History, Shield, Award } from 'lucide-react';
import { FlagSenegal, FlagNigeria, FlagGhana } from '../common/Flags';

interface CommanderProp {
  name: string;
  role: string;
  unit: string;
  image: string;
}

const CommanderCard: React.FC<CommanderProp> = ({ name, role, unit, image }) => (
  <div className="flex flex-col items-center gap-4 w-full">
    <div className="bg-[#006400] border-[3px] border-[#0099cc] px-4 py-1.5 rounded-xl shadow-md min-w-[160px] flex items-center justify-center whitespace-nowrap">
        <span className="text-white font-black text-[9px] uppercase tracking-widest">{unit}</span>
    </div>
    <div className="group relative w-full max-w-[190px]">
      <div className="relative p-1 bg-white border-[6px] border-[#3d5a2b] shadow-xl overflow-hidden aspect-[4/5]">
        <div className="w-full h-full relative overflow-hidden bg-gray-100 border-2 border-black/10">
          <img 
            src={image || "https://i.postimg.cc/KYNN3HsZ/senbat-jpg.png"} 
            alt={name} 
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
          />
        </div>
      </div>
    </div>
    <div className="text-center">
        <h3 className="text-[14px] font-black text-[#1a2c4e] uppercase leading-tight">{name}</h3>
        <p className="text-[#00853F] font-bold text-[8px] tracking-tighter uppercase">{role}</p>
    </div>
  </div>
);

const defaultChronicle = [
  {
    id: "chronicle-1",
    name: "Current Contingent Commander",
    rank: "COLONEL",
    appointment: "CONTINGENT COMMANDER",
    dateFrom: "2024-01-01",
    dateTo: "2026-12-31",
    country: "SENEGAL",
    unit: "SENBAT",
    imageUrl: "https://i.postimg.cc/KYNN3HsZ/senbat-jpg.png",
    position: 1
  },
  {
    id: "chronicle-2",
    name: "LT COL RN OGEMAFLE",
    rank: "LT COL",
    appointment: "CONTINGENT COMMANDER",
    dateFrom: "2024-01-01",
    dateTo: "2026-12-31",
    country: "GHANA",
    unit: "GHANCOY",
    imageUrl: "https://i.postimg.cc/SNkxD1gB/ghancoyc-jpg.png",
    position: 2
  },
  {
    id: "chronicle-3",
    name: "Lt Col SA Agada",
    rank: "LT COL",
    appointment: "CONTINGENT COMMANDER",
    dateFrom: "2024-01-01",
    dateTo: "2026-12-31",
    country: "NIGERIA",
    unit: "NIGCOY",
    imageUrl: "https://i.postimg.cc/7Z9Z7Z9Z/nigcoy.jpg",
    position: 3
  },
  {
    id: "chronicle-4",
    name: "Current Contingent Commander",
    rank: "COLONEL",
    appointment: "CONTINGENT COMMANDER",
    dateFrom: "2024-01-01",
    dateTo: "2026-12-31",
    country: "SENEGAL",
    unit: "SENFPU",
    imageUrl: "https://i.postimg.cc/fRT6bMBj/senfpu.jpg",
    position: 4
  }
];

export const ChronicleOfCommand: React.FC = () => {
  const [commanders, setCommanders] = useState<any[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('ecomig_chronicle');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        parsed.sort((a: any, b: any) => (a.position || 1) - (b.position || 1));
        setCommanders(parsed);
      } catch (e) {
        setCommanders(defaultChronicle);
      }
    } else {
      setCommanders(defaultChronicle);
    }
  }, []);

  return (
    <div className="p-1 sm:p-4 md:p-8 max-w-7xl mx-auto w-full">
      {/* Outer Military Bevel Frame */}
      <div className="relative bg-[#f3f4f6] p-[2px] shadow-[0_40px_80px_rgba(0,0,0,0.3)] border-t-[8px] border-l-[8px] sm:border-t-[30px] sm:border-l-[30px] border-white border-b-[8px] border-r-[8px] sm:border-b-[30px] sm:border-r-[30px] border-gray-400">
        
        {/* Inner shadow/bevel line */}
        <div className="absolute inset-0 border-[2px] border-gray-500/20 pointer-events-none" />

        {/* Main Board Content Area */}
        <div className="relative bg-white border-[3px] border-[#0099cc] p-3 sm:p-8 md:p-12 min-h-[900px] flex flex-col items-center">
          
          {/* Main Title Header with Logos and Flags integrated */}
          <div className="w-full relative bg-[#006400] border-[4px] border-[#0099cc] mb-12 p-4 md:p-6 rounded-xl shadow-[0_10px_20px_rgba(0,0,0,0.3)] flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center group">
                <div className="h-10 flex items-center justify-center transition-all px-1 bg-white/10 rounded p-1">
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
            
            <div className="text-center md:absolute md:left-1/2 md:-translate-x-1/2 w-full md:w-auto px-4">
              <h2 className="text-sm xs:text-base sm:text-xl md:text-2xl lg:text-3xl font-black text-white tracking-[0.05em] uppercase drop-shadow-lg font-sans whitespace-nowrap">
                 CHRONICLE OF COMMAND
              </h2>
              <p className="text-[7px] sm:text-[9px] font-bold text-white/70 tracking-[0.25em] uppercase mt-0.5 whitespace-nowrap">TACTICAL RECORDS DIVISION</p>
            </div>
            
            {/* Empty spacer element on desktop to balance layout and maintain flex space */}
            <div className="hidden md:block w-32" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 w-full max-w-6xl mb-20 px-4">
            {commanders.map((commander, index) => (
              <CommanderCard 
                key={commander.id || index} 
                unit={commander.unit || "SENBAT"}
                name={commander.name || "UNNAMED OFFICER"}
                role={`${commander.rank || "COLONEL"} • ${commander.country || "SENEGAL"}`}
                image={commander.imageUrl} 
              />
            ))}
          </div>

          {/* Tactical Bottom Footer */}
          <div className="mt-auto w-full pt-12 flex flex-col items-center opacity-30">
            <div className="h-1 w-64 bg-[#3d5a2b] mb-4" />
            <p className="text-[10px] font-black tracking-[1em] text-[#1a2c4e] uppercase italic text-center">HISTORICAL COMMAND ARCHIVE // TACTICAL RECORDS DIVISION</p>
          </div>
        </div>
      </div>
    </div>
  );
};
