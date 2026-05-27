import React from 'react';
import { Info, History, Target, Shield, AlertTriangle, CheckCircle2, ArrowRight } from 'lucide-react';
import { BrandHeader } from '../common/BrandHeader';

export const AboutMission: React.FC = () => (
  <div className="p-1 sm:p-4 md:p-12 max-w-5xl mx-auto min-h-screen flex items-center justify-center w-full">
    {/* The Requested Green Frame */}
    <div className="relative w-full bg-[#00b359] p-3 sm:p-6 md:p-8 rounded-lg border-4 sm:border-[12px] border-[#1d7a46] shadow-[inset_0_0_60px_rgba(0,0,0,0.2),0_20px_50px_rgba(0,0,0,0.4)] overflow-hidden">
      
      {/* Beveled Effects for the frame */}
      <div className="absolute inset-x-0 top-0 h-1 bg-white/30" />
      <div className="absolute inset-x-0 bottom-0 h-1 bg-black/30" />
      <div className="absolute inset-y-0 left-0 w-1 bg-white/30" />
      <div className="absolute inset-y-0 right-0 w-1 bg-black/30" />

      {/* Styled Header based on image */}
      <div className="flex justify-center -mt-2 mb-8">
        <div className="bg-[#006400] border-2 border-[#00a2ff] px-6 py-2 rounded-full shadow-lg relative group overflow-hidden">
          <div className="absolute inset-0 bg-white/5 group-hover:bg-white/10 transition-colors" />
          <h2 className="text-lg md:text-2xl font-black text-white tracking-[0.08em] uppercase m-0 leading-none whitespace-nowrap">
            ABOUT THE MISSION
          </h2>
        </div>
      </div>

      {/* Content Container */}
      <div className="bg-white/90 backdrop-blur-sm p-4 sm:p-6 md:p-10 rounded-2xl border-4 border-[#1d7a46]/30 shadow-inner space-y-8 text-gray-900">
        
        <div className="p-3 bg-[#004d24] mb-6 rounded-lg border-b-2 border-r-2 border-black/20">
           <BrandHeader title="MISSION PROFILE" subtitle="OPERATIONAL DOSSIER" />
        </div>

        {/* Mission Overview */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 border-b border-[#1d7a46]/20 pb-3">
            <Shield className="text-[#00853F] shrink-0" size={20} />
            <h3 className="text-sm md:text-lg font-black italic uppercase tracking-widest text-[#1a2c4e] m-0 whitespace-nowrap">Operational Overview</h3>
          </div>
          <p className="text-sm md:text-base font-bold leading-relaxed text-gray-750">
            ECOMIG (ECOWAS Mission in The Gambia) is a regional peacekeeping force deployed since January 2017 to stabilize The Gambia. Its primary mandate is to ensure the security and peace of the Gambian people while supporting the democratic transition.
          </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Key Facts */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <History className="text-[#00853F]" size={24} />
              <h4 className="text-xl font-black uppercase tracking-tight text-[#1a2c4e] m-0">Deployment Facts</h4>
            </div>
            <div className="space-y-4 font-bold text-gray-700">
              <div className="flex gap-4 items-start">
                <div className="h-2 w-2 rounded-full bg-[#00853F] mt-2 shrink-0" />
                <p className="m-0">Launched during the 2016–2017 Gambian constitutional crisis.</p>
              </div>
              <div className="flex gap-4 items-start">
                <div className="h-2 w-2 rounded-full bg-[#00853F] mt-2 shrink-0" />
                <p className="m-0">Forces from Senegal, Nigeria, and Ghana form the core contingent.</p>
              </div>
              <div className="flex gap-4 items-start">
                <div className="h-2 w-2 rounded-full bg-[#00853F] mt-2 shrink-0" />
                <p className="m-0">Mandate extended to 2027 to ensure long-term stability.</p>
              </div>
            </div>
          </div>

          {/* Goals */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Target className="text-[#00853F]" size={24} />
              <h4 className="text-xl font-black uppercase tracking-tight text-[#1a2c4e] m-0">Core Objectives</h4>
            </div>
            <div className="grid grid-cols-1 gap-3">
               {[
                 "Support Security Sector Reform (SSR)",
                 "Maintain constitutional order",
                 "Protect the Gambian Presidency",
                 "Civil-Military Cooperation (CIMIC)"
               ].map((goal, i) => (
                 <div key={i} className="bg-[#1d7a46]/5 p-4 rounded-xl border-l-4 border-[#00853F] flex items-center gap-3">
                   <div className="w-2 h-2 bg-[#00853F] rounded-full" />
                   <span className="font-bold text-sm uppercase">{goal}</span>
                 </div>
               ))}
            </div>
          </div>
        </div>

        {/* Tactical Note */}
        <div className="bg-[#1a2c4e] p-6 rounded-2xl flex items-center justify-between group">
           <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-[#00853F] rounded-lg flex items-center justify-center text-white font-black italic">!</div>
              <p className="text-white font-mono text-[10px] tracking-widest uppercase m-0 group-hover:text-[#00853F] transition-colors">Strategic Mission Exit Strategy Phase: IV // 2027</p>
           </div>
           <ArrowRight className="text-white/20 group-hover:text-white transition-colors" size={24} />
        </div>
      </div>

      {/* Decorative corners */}
      <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-white/40" />
      <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-black/40" />
    </div>
  </div>
);

