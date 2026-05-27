import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutGrid, Users, ArrowLeft, Camera } from 'lucide-react';
import { BrandHeader } from '../common/BrandHeader';

export const EcomigEvents: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'units' | 'cimic' | 'unit-details'>('units');
  const [selectedUnit, setSelectedUnit] = useState<any>(null);

  const units = [
    { id: 'mhq', label: 'MHQ', commander: 'Col A Tine', location: 'Banjul' },
    { id: 'fhq', label: 'FHQ', commander: 'Col Okeniyi', location: 'Yundum' },
    { id: 'senbat', label: 'SENBAT', commander: 'Col Diouf', location: 'Kanilai' },
    { id: 'nigcoy', label: 'NIGCOY', commander: 'Lt Col Ibrahim', location: 'Fajara' },
    { id: 'ghancoy', label: 'GHANCOY', commander: 'Lt Col Boateng', location: 'Barra' },
    { id: 'senfpu', label: 'SENFPU', commander: 'Maj Sarr', location: 'Banjul' },
  ];

  const [events] = useState<any[]>(() => {
    const stored = localStorage.getItem("ecomig_events");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error(e);
      }
    }
    return [
      { id: "e-mhq-1", unitId: "mhq", title: "Regional Security Council Briefing", date: "22 MAY 24", time: "0900Z", status: "Confirmed", location: "Banjul MHQ", description: "Strategic review of regional troop disposition and border controls.", image_url: "https://ais-v2-pre-j6ejmdcxtiu6sbfl6xp46t-168883427679.europe-west3.run.app/api/artifacts/8904719c-8594-44bf-a9ee-bd4900c4c4ea", files: [], event_type: "ECOWAS Anniversary" },
      { id: "e-mhq-2", unitId: "mhq", title: "Strategic Command Meeting", date: "24 MAY 24", time: "1100Z", status: "Pending", location: "Banjul HQ Block B", description: "Command-level coordination and tactical operations mapping.", image_url: "", files: [], event_type: "Army Day Celebration" },
      { id: "e-mhq-3", unitId: "mhq", title: "International Press Conference", date: "26 MAY 24", time: "1400Z", status: "Scheduled", location: "Banjul HQ Media Room", description: "Press update on regional security initiatives.", image_url: "", files: [], event_type: "ECOWAS Anniversary" },
      { id: "e-fhq-1", unitId: "fhq", title: "Force Readiness Inspection", date: "21 MAY 24", time: "0800Z", status: "Active", location: "Yundum Barracks", description: "Review of operational logistics and tactical readiness criteria.", image_url: "https://ais-v2-pre-j6ejmdcxtiu6sbfl6xp46t-168883427679.europe-west3.run.app/api/artifacts/a815a510-91fb-4a81-9b0d-b4f1797e87ab", files: [], event_type: "Army Day Celebration" },
      { id: "e-fhq-2", unitId: "fhq", title: "Logistic Support Coordination", date: "23 MAY 24", time: "1030Z", status: "Planning", location: "Yundum Command Center", description: "Coordination of division-level logistics and supply-chains.", image_url: "", files: [], event_type: "Army Day Celebration" },
      { id: "e-senbat-1", unitId: "senbat", title: "Border Patrol Operation X-Ray", date: "20 MAY 24", time: "0400Z", status: "In Progress", location: "Kanilai Border Outpost", description: "Joint boundary patrol maintaining security zone compliance.", image_url: "https://ais-v2-pre-j6ejmdcxtiu6sbfl6xp46t-168883427679.europe-west3.run.app/api/artifacts/0f40d85a-0f8f-4ed3-b68e-9dcc9165b699", files: [], event_type: "Army Day Celebration" },
      { id: "e-senbat-2", unitId: "senbat", title: "Village Outreach Kanilai", date: "25 MAY 24", time: "0900Z", status: "Confirmed", location: "Kanilai Community Center", description: "CIMIC support providing clean water and medical guidance to Kanilai local communities.", image_url: "", files: [], event_type: "Cultural events" },
      { id: "e-nigcoy-1", unitId: "nigcoy", title: "Medical Outreach Fajara", date: "22 MAY 24", time: "1000Z", status: "Ready", location: "Fajara Medical Station", description: "Nigerian Contingent providing general health services and medical donations.", image_url: "https://ais-v2-pre-j6ejmdcxtiu6sbfl6xp46t-168883427679.europe-west3.run.app/api/artifacts/f3cc77f8-3e52-4467-8822-2630ce525ee8", files: [], event_type: "Pink October" },
      { id: "e-nigcoy-2", unitId: "nigcoy", title: "NIGCOY Medal Parade", date: "30 MAY 24", time: "1600Z", status: "Scheduled", location: "Fajara Parade Ground", description: "Honoring active personnel with ECOWAS integration medals.", image_url: "", files: [], event_type: "Medal Parade" },
      { id: "e-ghancoy-1", unitId: "ghancoy", title: "Joint Patrol with GPF", date: "21 MAY 24", time: "2000Z", status: "Ongoing", location: "Barra Sector", description: "Cooperative operations with the Gambia Police Force in the Barra estuary.", image_url: "https://ais-v2-pre-j6ejmdcxtiu6sbfl6xp46t-168883427679.europe-west3.run.app/api/artifacts/0f40d85a-0f8f-4ed3-b68e-9dcc9165b699", files: [], event_type: "ECOWAS Anniversary" },
      { id: "e-ghancoy-2", unitId: "ghancoy", title: "GHANCOY Welfare Day", date: "28 MAY 24", time: "1300Z", status: "Confirmed", location: "Barra Base Camp", description: "Special welfare day celebrating regional cohesion and service excellence.", image_url: "", files: [], event_type: "Cultural events" },
      { id: "e-senfpu-1", unitId: "senfpu", title: "Public Order Drills", date: "22 MAY 24", time: "0700Z", status: "Routine", location: "Banjul Training Yard", description: "Staff tactical maneuvers practicing crowd control and civil security maintenance.", image_url: "", files: [], event_type: "Army Day Celebration" },
      { id: "e-senfpu-2", unitId: "senfpu", title: "VIP Protection Training", date: "24 MAY 24", time: "0900Z", status: "Active", location: "Banjul HQ Annex", description: "Protective custody simulations for national and diplomat integration.", image_url: "", files: [], event_type: "Independence Day Parade" }
    ];
  });

  const handleUnitClick = (unit: any) => {
    setSelectedUnit(unit);
    setActiveTab('unit-details');
  };

  const baseCimicImages = [
    {
      url: "https://ais-v2-pre-j6ejmdcxtiu6sbfl6xp46t-168883427679.europe-west3.run.app/api/artifacts/8904719c-8594-44bf-a9ee-bd4900c4c4ea",
      caption: "Nigerian Contingent Donation Activity - NIGCOY 10",
      type: "Donation"
    },
    {
      url: "https://ais-v2-pre-j6ejmdcxtiu6sbfl6xp46t-168883427679.europe-west3.run.app/api/artifacts/a815a510-91fb-4a81-9b0d-b4f1797e87ab",
      caption: "Educational Support & Community Outreach",
      type: "Education"
    },
    {
      url: "https://ais-v2-pre-j6ejmdcxtiu6sbfl6xp46t-168883427679.europe-west3.run.app/api/artifacts/0f40d85a-0f8f-4ed3-b68e-9dcc9165b699",
      caption: "ECOMIG Force Civil-Military Cooperation Group",
      type: "CIMIC"
    },
    {
      url: "https://ais-v2-pre-j6ejmdcxtiu6sbfl6xp46t-168883427679.europe-west3.run.app/api/artifacts/f3cc77f8-3e52-4467-8822-2630ce525ee8",
      caption: "Mission Personnel Group Activity - The Gambia",
      type: "Outreach"
    }
  ];

  const cimicImages = [
    ...baseCimicImages,
    ...events
      .filter((e) => (e.image_url || e.imageUrl) && !baseCimicImages.some((c) => c.url === (e.image_url || e.imageUrl)))
      .map((e) => ({
        url: e.image_url || e.imageUrl,
        caption: `${e.title} - ${e.location || 'ECOMIG ACTIVITY'}`,
        type: e.status || "Operational"
      }))
  ];

  return (
    <div className="p-1 sm:p-3 md:p-6 max-w-6xl mx-auto min-h-screen w-full">
      {/* Outer Tactical Frame */}
      <div className="relative bg-[#1a2c4e] p-2 sm:p-4 md:p-8 rounded-2xl border-4 sm:border-[6px] border-[#2b3e5a] shadow-[inset_0_0_100px_rgba(0,0,0,0.5),0_15px_30px_rgba(0,0,0,0.4)] overflow-hidden">
        
        {/* Decorative Scifi Brackets */}
        <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-white/10 rounded-tl-xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-black/30 rounded-br-xl pointer-events-none" />

        {/* Global Navigation - Breadcrumbs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <BrandHeader title="FORCE EVENTS" subtitle="OPERATIONAL CALENDAR" />
          <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-lg border border-white/10 h-min self-start sm:self-center">
            <LayoutGrid size={12} className="text-[#00853F]" />
            <span className="text-[9px] font-black tracking-widest text-white/60 uppercase">Operations</span>
            <span className="text-white/20">/</span>
            {(activeTab === 'cimic' || activeTab === 'unit-details') && (
              <button 
                onClick={() => setActiveTab('units')}
                className="flex items-center gap-1 text-[9px] font-black tracking-widest text-white uppercase hover:text-[#00853F] transition-colors"
              >
                <ArrowLeft size={9} /> Units
              </button>
            )}
            {activeTab === 'unit-details' && (
              <>
                <span className="text-white/20">/</span>
                <span className="text-[9px] font-black tracking-widest text-white uppercase">{selectedUnit?.label}</span>
              </>
            )}
            {activeTab === 'units' && (
              <span className="text-[9px] font-black tracking-widest text-white uppercase">Force Structures</span>
            )}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'unit-details' ? (
             <motion.div
              key="unit-details"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-6"
             >
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 md:p-6 rounded-2xl border-[6px] border-[#3d5a2b] shadow-xl">
                  <div className="text-center md:text-left">
                    <h3 className="text-2xl md:text-4xl font-black text-[#1a2c4e] uppercase mb-1">{selectedUnit?.label}</h3>
                    <div className="flex flex-wrap items-center gap-2 justify-center md:justify-start">
                      <div className="flex items-center gap-1.5 bg-black/5 px-2.5 py-1 rounded-md">
                        <Users size={12} className="text-[#00853F]" />
                        <span className="text-[9px] font-black text-[#00853F] uppercase tracking-widest">{selectedUnit?.commander}</span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-black/5 px-2.5 py-1 rounded-md">
                        <LayoutGrid size={12} className="text-[#00853F]" />
                        <span className="text-[9px] font-black text-[#00853F] uppercase tracking-widest">{selectedUnit?.location}</span>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => setActiveTab('units')}
                    className="p-2.5 px-4 bg-[#1a2c4e] text-white rounded-xl hover:bg-[#00853F] transition-all flex items-center gap-2 font-black uppercase text-[10px] tracking-widest"
                  >
                    <ArrowLeft size={12} /> Back to Units
                  </button>
                </div>

                <div className="bg-black/20 p-4 md:p-6 rounded-2xl border border-white/10 space-y-3">
                  <h4 className="text-base font-black text-white italic uppercase tracking-widest border-b border-white/10 pb-2 text-left">Tactical Engagements</h4>
                  {events.filter((e) => e.unitId === selectedUnit?.id).map((event) => (
                    <div key={event.id} className="flex flex-col md:flex-row items-start justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors gap-4 text-left">
                      <div className="flex flex-col sm:flex-row items-start gap-4 w-full min-w-0">
                        {/* Event Date badge */}
                        <div className="text-center bg-white/10 px-3 py-2 rounded-lg border border-white/10 min-w-[85px] self-start">
                          <span className="block text-[8px] font-black text-white/40 uppercase tracking-widest">{event.time || "0000Z"}</span>
                          <span className="text-xs font-black text-[#fbbf24] uppercase block whitespace-nowrap">{event.date}</span>
                        </div>

                        {/* Event Thumbnail */}
                        {(event.imageUrl || event.image_url) && (
                          <div className="w-16 h-16 bg-black/30 border border-white/10 rounded-lg overflow-hidden flex-shrink-0 self-start">
                            <img
                              src={event.imageUrl || event.image_url}
                              alt=""
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        )}

                        <div className="flex-grow min-w-0 text-left">
                          <h5 className="text-base font-black text-white uppercase tracking-tight">{event.title}</h5>
                          <div className="flex flex-wrap items-center gap-2 mt-1">
                            <span className="text-[9px] font-mono text-white/40 uppercase tracking-widest">Op-ID: {selectedUnit?.label.toUpperCase()}-{event.id.toString().substring(0, 6)}</span>
                            {event.event_type && (
                              <span className="text-[9px] font-bold text-amber-400 uppercase tracking-widest bg-amber-950/40 px-2 py-0.5 rounded border border-amber-900/30">
                                🏷️ {event.event_type}
                              </span>
                            )}
                            {event.location && (
                              <span className="text-[9px] font-bold text-green-400 uppercase tracking-widest bg-green-950/40 px-2 py-0.5 rounded border border-green-900/30">
                                📍 {event.location}
                              </span>
                            )}
                          </div>
                          
                          {event.description && (
                            <p className="text-xs text-gray-300 mt-2 bg-black/20 p-2.5 rounded-lg border border-white/5 leading-relaxed">
                              {event.description}
                            </p>
                          )}

                          {/* Render Attached Files & Subfolder files */}
                          {event.files && event.files.length > 0 && (
                            <div className="mt-3 space-y-1.5 text-left">
                              <span className="block text-[9px] font-black text-blue-300 uppercase tracking-widest">
                                📁 Security Attachments ({event.files.length})
                              </span>
                              <div className="flex flex-wrap gap-1.5">
                                {event.files.map((file: any, fIdx: number) => (
                                  <a
                                    key={fIdx}
                                    href={file.base64 || "#"}
                                    download={file.name}
                                    onClick={(e) => {
                                      if (!file.base64) e.preventDefault();
                                    }}
                                    className="bg-white/5 hover:bg-white/15 border border-white/10 rounded px-2.5 py-1 text-[9px] text-blue-200 uppercase font-black tracking-wide flex items-center gap-1.5 transition-all cursor-pointer"
                                  >
                                    <span>📎 {file.name}</span>
                                    <span className="text-white/30 font-semibold text-[8px]">({file.size})</span>
                                  </a>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Event Status */}
                      <div className="mt-2 md:mt-0 flex items-center gap-1.5 bg-[#00853F]/20 px-3 py-1 rounded-full border border-[#00853F]/30 self-start">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#00853F] animate-pulse" />
                        <span className="text-[9px] font-black text-[#00853F] uppercase tracking-widest whitespace-nowrap">
                          {event.status || "CONFIRMED"}
                        </span>
                      </div>
                    </div>
                  ))}
                  {events.filter((e) => e.unitId === selectedUnit?.id).length === 0 && (
                    <div className="text-center py-8 text-white/20 font-black uppercase italic tracking-widest">No Active Engagements Logged</div>
                  )}
                </div>
             </motion.div>
          ) : activeTab === 'units' ? (
             <motion.div 
              key="units-view"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-8"
             >
              {/* Title Section */}
              <div className="text-center relative">
                <div className="inline-block bg-[#006400] border-[3px] border-[#00a2ff]/30 px-5 py-2 rounded-lg shadow-[0_0_15px_rgba(0,100,0,0.35)] relative">
                  <div className="absolute inset-0 border border-white/20 rounded-md m-0.5 pointer-events-none" />
                  <h2 className="text-lg sm:text-xl md:text-2xl font-black text-white tracking-[0.12em] uppercase italic">
                    ECOMIG <span className="text-[#fbbf24]">EVENTS</span>
                  </h2>
                </div>
              </div>

              {/* Units Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 md:gap-4 max-w-4xl mx-auto">
                {units.map((unit) => (
                  <motion.button
                    key={unit.id}
                    onClick={() => handleUnitClick(unit)}
                    whileHover={{ scale: 1.03, translateY: -2 }}
                    whileTap={{ scale: 0.97 }}
                    className="bg-white border-[3px] border-[#3d5a2b] p-3 md:p-4 rounded-xl shadow-md flex flex-col items-center justify-center transition-all group relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-[#00853F]/0 group-hover:bg-[#00853F]/5 transition-colors" />
                    <div className="absolute top-1 right-1 opacity-5 group-hover:opacity-15 transition-opacity">
                      <Users size={18} />
                    </div>
                    <span className="text-base md:text-lg lg:text-xl font-bold text-[#1a2c4e] group-hover:text-[#00853F] transition-colors uppercase tracking-tight">
                      {unit.label}
                    </span>
                    <div className="h-0.5 w-0 group-hover:w-full bg-[#00853F] absolute bottom-0 left-0 transition-all duration-300" />
                  </motion.button>
                ))}
              </div>

              {/* CIMIC Switcher Button */}
              <div className="flex justify-center pt-2">
                <motion.button
                  onClick={() => setActiveTab('cimic')}
                  whileHover={{ scale: 1.02, boxShadow: "0 0 15px rgba(0,133,63,0.15)" }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full max-w-lg bg-white border-[3px] border-[#3d5a2b] py-2.5 px-4 rounded-xl shadow-md flex items-center justify-between transition-all group overflow-hidden relative"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-[#00853F] rounded-full flex items-center justify-center shadow-sm group-hover:rotate-12 transition-transform">
                      <Users className="text-white" size={14} />
                    </div>
                    <span className="text-sm md:text-base font-bold text-[#1a2c4e] uppercase tracking-tight">
                      CIMIC ACTIVITIES
                    </span>
                  </div>
                  <div className="hidden md:block bg-black/5 px-2.5 py-0.5 rounded-full font-black text-[8px] tracking-widest text-[#00853F]">
                    LAUNCH RECAP
                  </div>
                </motion.button>
              </div>
             </motion.div>
          ) : (
            <motion.div 
              key="cimic-view"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-6"
            >
              {/* CIMIC Header */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-black/30 p-4 md:p-6 rounded-2xl border border-white/10">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-[#00853F] rounded-lg shadow-md">
                      <Camera className="text-white" size={20} />
                    </div>
                    <h2 className="text-lg md:text-2xl font-black text-white italic uppercase tracking-wider">
                      CIVIL-MILITARY <span className="text-[#fbbf24]">COOPERATION</span>
                    </h2>
                  </div>
                  <p className="text-white/40 font-mono text-[9px] uppercase tracking-wider">Operational Recap // Mission Community Outreach 2024</p>
                </div>
                <button 
                  onClick={() => setActiveTab('units')}
                  className="px-4 py-2 bg-white text-black font-black uppercase text-[10px] tracking-widest rounded-lg hover:bg-[#00853F] hover:text-white transition-all shadow-md active:scale-95"
                >
                  Return to Units
                </button>
              </div>

              {/* CIMIC Gallery Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {cimicImages.map((image, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    className="group relative bg-[#2b3e5a] rounded-2xl border-[4px] border-white overflow-hidden shadow-xl aspect-[4/3] cursor-zoom-in"
                  >
                    <img 
                      src={image.url} 
                      alt={image.caption} 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    
                    {/* Caption Overlay */}
                    <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/90 via-black/40 to-transparent translate-y-2 group-hover:translate-y-0 transition-transform">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="bg-[#fbbf24] text-black font-black text-[8px] px-1.5 py-0.5 rounded uppercase">{image.type}</span>
                        <div className="h-[1px] flex-1 bg-white/20" />
                      </div>
                      <p className="text-white font-bold text-xs md:text-sm leading-tight uppercase italic">{image.caption}</p>
                    </div>

                    {/* Corner Tactical ID */}
                    <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded border border-white/10">
                      <span className="text-[8px] font-mono text-white/60">IMG_NODE_0{idx + 1}</span>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Bottom Tactical Statement */}
              <div className="bg-[#122b12] border-l-4 border-[#00853F] p-4 rounded-r-xl">
                 <p className="text-gray-300 font-medium italic text-xs md:text-sm">
                    "Building bridges between security forces and the community is central to our operational mandate. These activities represent the Nigerian Contingent's dedication to peace and stability in The Gambia."
                 </p>
                 <p className="mt-2 text-[#fbbf24] font-black text-xs tracking-widest uppercase">— FORCE HQ PRESS RELEASE</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tactical Status Footer */}
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-wrap justify-between items-center gap-4 opacity-50">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#00853F] animate-pulse" />
              <span className="text-[10px] font-black tracking-widest text-white uppercase italic">Active Node</span>
            </div>
            <div className="h-4 w-[1px] bg-white/10" />
            <span className="text-[10px] font-mono text-white tracking-tighter uppercase">ECOMIG-ARCHIVE-MHQ</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black text-white uppercase tracking-widest">Auth Level: MISSION COORD</span>
          </div>
        </div>
      </div>
    </div>
  );
};
