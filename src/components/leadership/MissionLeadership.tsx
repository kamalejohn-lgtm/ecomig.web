import React, { useState, useEffect } from 'react';
import { ShieldCheck, User } from 'lucide-react';
import { BrandHeader } from '../common/BrandHeader';

interface LeaderProp {
  name: string;
  role: string;
  image: string;
}

const LeaderCard: React.FC<LeaderProp & { header?: string }> = ({ name, role, image, header }) => (
  <div className="flex flex-col items-center gap-4 w-full">
    {header && (
      <div className="bg-[#006400] border-[3px] border-[#0099cc] px-4 py-2 rounded-xl shadow-[0_4px_10px_rgba(0,0,0,0.25)] min-w-[220px] flex items-center justify-center whitespace-nowrap">
        <span className="text-white font-black text-[9px] md:text-[11px] uppercase tracking-widest">{header}</span>
      </div>
    )}
    <div className="group relative w-full max-w-[220px]">
      <div className="relative p-1 bg-white border-[6px] border-[#3d5a2b] shadow-xl overflow-hidden aspect-[4/5]">
        <div className="w-full h-full relative overflow-hidden bg-gray-100 border-2 border-black/10">
          <img 
            src={image || "https://i.postimg.cc/sft27DWG/staff-jpg-Copy.png"} 
            alt={name} 
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
          />
        </div>
      </div>
    </div>
    <div className="text-center h-12 flex flex-col justify-start">
        <h3 className="text-lg font-black text-[#1a2c4e] uppercase leading-tight">{name}</h3>
        <p className="text-[#00853F] font-bold text-[9px] tracking-tighter uppercase">{role}</p>
    </div>
  </div>
);

const StaffLeaderCard: React.FC<LeaderProp & { header?: string }> = ({ name, role, image, header }) => (
  <div className="flex flex-col items-center gap-4 w-full max-w-[580px]">
    {header && (
      <div className="bg-[#004d24] border-[3px] border-[#0099cc] px-6 py-2.5 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.3)] min-w-[240px] flex items-center justify-center whitespace-nowrap">
        <span className="text-white font-black text-[10px] md:text-[12px] uppercase tracking-widest">{header}</span>
      </div>
    )}
    <div className="group relative w-full">
      <div className="relative p-1.5 bg-white border-[6px] border-[#3d5a2b] shadow-2xl overflow-hidden aspect-[4/3] rounded">
        <div className="w-full h-full relative overflow-hidden bg-gray-50 border border-black/10">
          <img 
            src={image || "https://i.postimg.cc/sft27DWG/staff-jpg-Copy.png"} 
            alt={name} 
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
          />
        </div>
      </div>
    </div>
    <div className="text-center min-h-[44px] flex flex-col justify-start">
        <h3 className="text-lg md:text-xl font-black text-[#1a2c4e] uppercase tracking-wide leading-tight">{name}</h3>
        <p className="text-[#00853F] font-bold text-[10px] tracking-wider uppercase mt-1">{role}</p>
    </div>
  </div>
);

const defaultLeadership = [
  {
    id: "leader-1",
    name: "MIATTA LILY FRENCH",
    rank: "HE",
    appointment: "HEAD OF MISSION",
    dateFrom: "2024-01-01",
    dateTo: "2026-12-31",
    country: "SENEGAL",
    imageUrl: "https://i.postimg.cc/nVTsmtkD/miatta-jpg.jpg",
    position: 1
  },
  {
    id: "leader-2",
    name: "COLONEL A TINE",
    rank: "COLONEL",
    appointment: "FORCE COMMANDER",
    dateFrom: "2024-01-01",
    dateTo: "2026-12-31",
    country: "SENEGAL",
    imageUrl: "https://i.postimg.cc/4dWJYXgK/tine-jpg.jpg",
    position: 2
  },
  {
    id: "leader-3",
    name: "COLONEL OKENIYI",
    rank: "COLONEL",
    appointment: "DEPUTY FORCE COMMANDER",
    dateFrom: "2024-01-01",
    dateTo: "2026-12-31",
    country: "NIGERIA",
    imageUrl: "https://i.postimg.cc/vTpwnBSM/okeniyi-jpg-png-Copy.jpg",
    position: 3
  }
];

export const MissionLeadership: React.FC = () => {
  const [leadership, setLeadership] = useState<any[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('ecomig_leadership');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        parsed.sort((a: any, b: any) => (a.position || 1) - (b.position || 1));
        setLeadership(parsed);
      } catch (e) {
        setLeadership(defaultLeadership);
      }
    } else {
      setLeadership(defaultLeadership);
    }
  }, []);

  // Map appointments to the displayed fields
  const getLeaderFields = (item: any) => {
    let header = item.appointment;
    let role = "Operational Commander";

    if (item.appointment === 'HEAD OF MISSION') {
      role = "Head of Mission / ECOWAS Rep";
    } else if (item.appointment === 'FORCE COMMANDER') {
      role = "ECOMIG Force Commander";
    } else if (item.appointment === 'DEPUTY FORCE COMMANDER') {
      role = "Deputy Force Commander";
    } else {
      role = `${item.rank || ''} - ${item.country || ''} DELEGATE`;
    }

    return {
      name: item.name || "UNNAMED OFFICER",
      role: role,
      image: item.imageUrl,
      header: header
    };
  };

  // Separate individual leaders (usually 3 main entries) from staff officers entry
  const mainLeaders = leadership.filter(item => {
    const nameStr = (item.name || "").toUpperCase();
    const appStr = (item.appointment || "").toUpperCase();
    const isStaff = nameStr.includes("STAFF") || 
                    appStr.includes("STAFF") || 
                    nameStr.includes("OFFICIER") || 
                    appStr.includes("OFFICIER") ||
                    nameStr.includes("ÉTAT-MAJOR") ||
                    nameStr.includes("ETAT-MAJOR") ||
                    nameStr.includes("FHQ") ||
                    appStr.includes("FHQ") ||
                    (item.imageUrl && item.imageUrl.toLowerCase().includes("staff"));
    return !isStaff;
  });

  const staffItem = leadership.find(item => {
    const nameStr = (item.name || "").toUpperCase();
    const appStr = (item.appointment || "").toUpperCase();
    return nameStr.includes("STAFF") || 
           appStr.includes("STAFF") || 
           nameStr.includes("OFFICIER") || 
           appStr.includes("OFFICIER") ||
           nameStr.includes("ÉTAT-MAJOR") ||
           nameStr.includes("ETAT-MAJOR") ||
           nameStr.includes("FHQ") ||
           appStr.includes("FHQ") ||
           (item.imageUrl && item.imageUrl.toLowerCase().includes("staff"));
  });

  const displayStaff = {
    name: "STAFF OFFICERS",
    role: "Operational Command Staff",
    image: staffItem?.imageUrl || "https://i.postimg.cc/sft27DWG/staff-jpg-Copy.png",
    header: "STAFF OFFICERS AT FHQ"
  };

  return (
    <div className="p-1 sm:p-4 md:p-8 max-w-7xl mx-auto w-full">
      {/* Outer Military Bevel Frame - White/Grey 3D effect as per mockup */}
      <div className="relative bg-[#f3f4f6] p-[2px] shadow-[0_40px_80px_rgba(0,0,0,0.3)] border-t-[8px] border-l-[8px] sm:border-t-[30px] sm:border-l-[30px] border-white border-b-[8px] border-r-[8px] sm:border-b-[30px] sm:border-r-[30px] border-gray-400">
        
        {/* Inner shadow/bevel line */}
        <div className="absolute inset-0 border-[2px] border-gray-500/20 pointer-events-none" />

        {/* Main Board Content Area (White background as per mockup) */}
        <div className="relative bg-white border-[3px] border-[#0099cc] p-3 sm:p-12 md:p-20 min-h-[900px] flex flex-col items-center">
          
          <div className="w-full bg-[#004d24] mb-6 p-4 border-b-4 border-r-4 border-black/20 rounded-lg flex items-center">
             <BrandHeader title="COMMAND STRUCTURE" subtitle="MHQ-01 CENTRAL COMMAND" titleSize="text-xl sm:text-2xl font-black" />
          </div>

          {/* Main Title Header - Green Box with Blue Border */}
          <div className="mb-12 mt-4">
             <div className="bg-[#006400] border-[4px] border-[#0099cc] px-6 md:px-12 py-3 rounded-xl shadow-[0_10px_20px_rgba(0,0,0,0.3)]">
                <h2 className="text-sm md:text-lg font-extrabold text-white tracking-[0.02em] uppercase text-center drop-shadow-lg font-sans whitespace-nowrap">
                   MISSION <span className="text-white">LEADERSHIP</span>
                </h2>
             </div>
          </div>

          {/* Top Command Line - Core Leaders */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-x-12 md:gap-y-16 w-full max-w-6xl justify-items-center mb-16">
            {mainLeaders.map((item, index) => {
              const mapped = getLeaderFields(item);
              return (
                <div key={item.id || index} className="w-full sm:w-[280px] flex justify-center">
                  <LeaderCard {...mapped} />
                </div>
              );
            })}
          </div>

          {/* Centered Staff Officers Block */}
          <div className="w-full flex justify-center items-center mt-12 mb-20 px-4">
            <StaffLeaderCard {...displayStaff} />
          </div>

          {/* Tactical Bottom Footer */}
          <div className="mt-auto w-full pt-10 sm:pt-20 flex flex-col items-center opacity-30">
            <div className="h-1 w-64 bg-[#3d5a2b] mb-4" />
            <p className="text-[12px] font-black tracking-[1em] text-[#1a2c4e] uppercase italic">ECOWAS // ECOMIG HQ DIVISION</p>
          </div>
        </div>
      </div>
    </div>
  );
};

