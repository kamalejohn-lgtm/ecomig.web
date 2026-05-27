import { Trophy, Calendar, MapPin, Users, Activity, Megaphone } from 'lucide-react';
import { motion } from 'framer-motion';
import { BrandHeader } from '../common/BrandHeader';

export const SportsPortal: React.FC = () => {
  const groups = {
    A: [
      { name: 'ECOMIG FC', logo: 'https://i.postimg.cc/VN8W5R7r/ECOMIG-LOGO.png' },
      { name: 'GRA FC', logo: 'https://flagcdn.com/gm.svg' },
      { name: 'GAF FC', logo: 'https://flagcdn.com/gm.svg' },
      { name: 'GRTS FC', logo: 'https://flagcdn.com/gm.svg' },
    ],
    B: [
      { name: 'GPF FC', logo: 'https://flagcdn.com/gm.svg' },
      { name: 'GFRS FC', logo: 'https://flagcdn.com/gm.svg' },
      { name: 'GPS FC', logo: 'https://flagcdn.com/gm.svg' },
      { name: 'GID FC', logo: 'https://flagcdn.com/gm.svg' },
    ]
  };

  return (
    <div className="p-1 sm:p-4 md:p-8 max-w-7xl mx-auto w-full">
      {/* Outer Military Bevel Frame */}
      <div className="relative bg-[#f3f4f6] p-[2px] shadow-[0_40px_80px_rgba(0,0,0,0.3)] border-t-[8px] border-l-[8px] sm:border-t-[30px] sm:border-l-[30px] border-white border-b-[8px] border-r-[8px] sm:border-b-[30px] sm:border-r-[30px] border-gray-400">
        <div className="absolute inset-0 border-[2px] border-gray-500/20 pointer-events-none" />

        <div className="relative bg-white border-[3px] border-[#0099cc] p-3 sm:p-8 md:p-12 min-h-[900px] flex flex-col items-center">
          
          <div className="w-full bg-[#004d24] mb-6 p-4 border-b-4 border-r-4 border-black/20 rounded-lg flex items-center">
             <BrandHeader title="MISSION SPORTS" subtitle="MORALE & RECREATION DIVISION" />
          </div>

          {/* LATEST ANNOUNCEMENT BOX */}
          <div className="w-full max-w-4xl mb-8 bg-amber-50/80 border-l-[6px] border-[#00853F] p-6 rounded-r-2xl shadow-md border-y border-r border-[#00853F]/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <Megaphone size={120} className="text-[#00853F]" />
            </div>
            
            <div className="flex items-center gap-3 mb-4">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
              <h4 className="text-[10px] font-black tracking-[0.2em] text-[#00853F] uppercase italic flex items-center gap-2">
                <Megaphone size={12} /> LATEST TOURNAMENT ADVISORY // OFFICIAL ANNOUNCEMENT
              </h4>
            </div>
            
            <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-tight mb-4">
              Important Announcement on ECOMIG Football Tournament 2026 Update
            </h3>

            <div className="space-y-4 text-slate-800 font-bold text-sm md:text-base leading-relaxed">
              <p className="text-gray-700 font-semibold">
                The ECOMIG Football Tournament 2026 continues to capture the spirit of unity and discipline among paramilitary institutions and national partners in The Gambia.
              </p>
              
              <div className="bg-white/90 border border-amber-200 p-5 rounded-2xl shadow-sm font-semibold text-amber-950/90 text-sm md:text-base border-l-4 border-amber-500">
                There will be no matches on <span className="underline decoration-2 decoration-[#00853F] font-black">Saturday, 23 May 2026</span> in observance of the Sallah celebration. This pause reflects the tournament’s respect for cultural and religious traditions, allowing players, officials, and supporters to join their families and communities in marking this important occasion.
              </div>

              <div className="mt-6 border-t border-slate-200/60 pt-6">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-3 flex items-center gap-2">
                  ⚽ TOURNAMENT PROGRESS
                </h4>
                <ul className="space-y-3 pl-1">
                  <li className="flex items-start gap-2.5 text-xs md:text-sm text-slate-600 font-semibold">
                    <span className="text-[#00853F] font-black shrink-0">•</span>
                    <span>Group stage matches have been unfolding with high energy and competitive spirit.</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-xs md:text-sm text-slate-600 font-semibold">
                    <span className="text-[#00853F] font-black shrink-0">•</span>
                    <span>Teams including <strong className="font-extrabold text-slate-850">ECOMIG FC, GRA FC, GAF FC, GRTS FC, GPF FC, GFRS FC, GPS FC, and GID FC</strong> continue to battle for top positions.</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-xs md:text-sm text-slate-600 font-semibold">
                    <span className="text-[#00853F] font-black shrink-0">•</span>
                    <span>Fixtures will resume immediately after the Sallah break, ensuring the schedule remains on track toward the semi-finals and the grand final on <strong className="font-extrabold text-slate-850">20 June 2026</strong> at <strong className="font-extrabold text-[#00853F]">Bakau Football Mini Stadium</strong>.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Poster Card Container */}
          <div className="w-full max-w-4xl bg-white border-[4px] border-[#0099cc] rounded-[2rem] p-8 shadow-inner relative overflow-hidden">
            
            {/* Header Section */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 relative z-10">
              <div className="w-16 h-16 flex-shrink-0">
                <img 
                  src="https://i.postimg.cc/VN8W5R7r/ECOMIG-LOGO.png" 
                  alt="ECOMIG" 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain" 
                />
              </div>
              <div className="flex-grow text-center">
                <h1 className="text-3xl md:text-5xl font-black text-yellow-500 tracking-tighter drop-shadow-[2px_2px_0_rgba(0,0,0,0.9)] italic mb-1">
                  ECOMIG
                </h1>
                <h2 className="text-lg md:text-xl font-black tracking-[0.2em] text-black uppercase mb-1">
                  FOOTBALL TOURNAMENT 2026
                </h2>
                <h3 className="text-base md:text-lg font-black tracking-[0.3em] text-black uppercase">
                  OPENING CEREMONY
                </h3>
              </div>
              <div className="w-16 h-16 hidden md:block opacity-0" />
            </div>

            {/* Participation Ribbon */}
            <div className="relative flex justify-center mb-16">
               <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-blue-900 -translate-y-1/2" />
               <div className="relative z-10 bg-white border-2 border-blue-900 px-8 py-2">
                  <div className="absolute -left-4 top-0 bottom-0 w-6 bg-white border-y-2 border-l-2 border-blue-900 [clip-path:polygon(100%_0%,0%_50%,100%_100%)]" />
                  <span className="text-lg font-black text-black tracking-widest px-2">PARTICIPATING TEAMS</span>
                  <div className="absolute -right-4 top-0 bottom-0 w-6 bg-white border-y-2 border-r-2 border-blue-900 [clip-path:polygon(0%_0%,100%_50%,0%_100%)]" />
               </div>
            </div>

            {/* Teams Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center mb-16 relative">
               {/* Group A */}
               <div className="space-y-6">
                  <div className="inline-block border-b-4 border-black pb-1 mb-4">
                    <h4 className="text-2xl font-black text-black">GROUP A</h4>
                  </div>
                  <div className="space-y-4">
                    {groups.A.map(team => (
                      <div key={team.name} className="flex items-center gap-4 group">
                        <img src={team.logo} className="w-8 h-8 object-contain" alt={team.name} referrerPolicy="no-referrer" />
                        <span className="text-xl font-black text-black tracking-tighter group-hover:text-[#00853F] transition-colors">{team.name}</span>
                      </div>
                    ))}
                  </div>
               </div>

               {/* Center Trophy/Ball Area */}
               <div className="flex flex-col items-center justify-center gap-8">
                  <div className="relative group cursor-pointer">
                    <div className="absolute inset-0 bg-yellow-400 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
                    <Trophy size={120} className="text-yellow-600 relative z-10 drop-shadow-xl" />
                  </div>
                  <div className="relative group cursor-pointer scale-110 mb-4">
                    <div className="absolute inset-0 bg-[#00853F] blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
                    <Activity size={80} className="text-[#00853F] relative z-10 drop-shadow-xl" />
                  </div>
               </div>

               {/* Group B */}
               <div className="space-y-6 text-right">
                  <div className="inline-block border-b-4 border-black pb-1 mb-4 ml-auto">
                    <h4 className="text-2xl font-black text-black">GROUP B</h4>
                  </div>
                  <div className="space-y-4">
                    {groups.B.map(team => (
                      <div key={team.name} className="flex items-center justify-end gap-4 group">
                        <span className="text-xl font-black text-black tracking-tighter group-hover:text-blue-900 transition-colors">{team.name}</span>
                        <img src={team.logo} className="w-8 h-8 object-contain" alt={team.name} referrerPolicy="no-referrer" />
                      </div>
                    ))}
                  </div>
               </div>
            </div>

            {/* Footer Stats Rounded Boxes */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div className="border-2 border-blue-600 rounded-xl py-3 px-3 text-center bg-white shadow-md">
                  <span className="text-lg font-black text-black">DATE: 16 MAY 2026</span>
               </div>
               <div className="border-2 border-blue-600 rounded-xl py-3 px-3 text-center bg-white shadow-md">
                  <span className="text-lg font-black text-black uppercase text-[14px]">VENUE: BAKAU FOOTBALL FIELD</span>
               </div>
               <div className="border-2 border-blue-600 rounded-xl py-3 px-3 text-center bg-white shadow-md">
                  <span className="text-lg font-black text-black">TIME: 9:00 AM</span>
               </div>
            </div>

          </div>

          {/* Tournament Overview Text Below */}
          <div className="mt-20 w-full max-w-5xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              <section className="space-y-6">
                <div className="border-l-8 border-[#00853F] pl-6">
                  <h3 className="text-3xl font-black text-black uppercase italic mb-4">Conduct of Tournament</h3>
                  <p className="text-gray-700 text-lg font-bold leading-relaxed">
                    The ECOMIG Football Tournament 2026 officially kicked off on 16 May 2026, bringing together 
                    paramilitary institutions and national partners in The Gambia under the banner of unity, 
                    discipline, and sportsmanship.
                  </p>
                </div>
                <div className="p-8 bg-gray-50 border-2 border-gray-100 rounded-3xl">
                  <h4 className="text-xl font-black text-[#00853F] uppercase mb-4 flex items-center gap-3 italic">
                    <Activity size={24} />
                    IMPACT & OBJECTIVES
                  </h4>
                  <ul className="space-y-3 text-sm font-bold text-gray-600">
                    <li>• STRENGTHEN CAMARADERIE AMONG PARAMILITARY INSTITUTIONS</li>
                    <li>• PROMOTE DISCIPLINE, TEAMWORK, AND HEALTHY COMPETITION</li>
                    <li>• SHOWCASE FOOTBALL AS A TOOL FOR PEACEBUILDING</li>
                    <li>• FOSTER UNITY AMONG SECURITY SERVICES</li>
                  </ul>
                </div>
              </section>

              <div className="bg-[#1a2c4e] p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
                <h4 className="text-2xl font-black italic uppercase mb-8 flex items-center gap-4 text-[#0099cc]">
                  <Calendar size={32} />
                  TOURNAMENT CALENDAR
                </h4>
                <div className="space-y-6">
                  {[
                    { date: '16 MAY 2026', event: 'OPENING CEREMONY', status: 'COMPLETED' },
                    { date: '16 MAY – 05 JUN', event: 'GROUP STAGE MATCHES', status: 'IN PROGRESS' },
                    { date: '10 – 15 JUN', event: 'SEMI-FINALS KNOCKOUT', status: 'SCHEDULED' },
                    { date: '20 JUN 2026', event: 'GRAND FINAL @ BAKAU', status: 'MISSION CRITICAL' },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between border-b border-white/10 pb-6 last:border-0 last:pb-0">
                      <div>
                        <span className="text-xs font-black text-[#0099cc] block tracking-widest">{item.date}</span>
                        <span className="text-lg font-bold uppercase">{item.event}</span>
                      </div>
                      <span className={`text-[10px] font-black px-3 py-1 rounded-sm ${
                        item.status === 'COMPLETED' ? 'bg-green-600' : 'bg-red-600/20 text-red-400 border border-red-600/40'
                      }`}>{item.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Tactical Bottom Footer */}
          <div className="mt-32 w-full pt-12 flex flex-col items-center opacity-30">
            <div className="h-1 w-64 bg-[#3d5a2b] mb-4" />
            <p className="text-[10px] font-black tracking-[1em] text-[#1a2c4e] uppercase italic text-center">MISSION MORALE & RECREATION DIVISION // SPORTS PROTOCOL V.2026</p>
          </div>
        </div>
      </div>
    </div>
  );
};
