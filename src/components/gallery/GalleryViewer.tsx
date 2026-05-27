import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, MapPin, Calendar, Users, Folder, FileText, Download, Search, Filter, X, Globe, Eye, FolderArchive } from 'lucide-react';
import { BrandHeader } from '../common/BrandHeader';

interface GalleryItem {
  id: string;
  unitId: string;
  title: string;
  eventType: string;
  date: string;
  time?: string;
  location: string;
  description: string;
  status?: string;
  image_url?: string;
  imageUrl?: string;
  files?: Array<{ name: string; size: string; type: string; base64?: string }>;
}

export const GalleryViewer: React.FC = () => {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [selectedUnitFilter, setSelectedUnitFilter] = useState<string>("ALL");
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);

  // Load latest gallery items
  const loadGallery = () => {
    const stored = localStorage.getItem("ecomig_gallery");
    if (stored) {
      try {
        setGalleryItems(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse gallery items:", e);
      }
    } else {
      // Primary default seed list
      const initialGallery = [
        {
          id: "g-nigcoy-1",
          unitId: "nigcoy",
          title: "Nigerian Contingent Donation Activity - NIGCOY 10",
          eventType: "Cultural events",
          date: "22 MAY 24",
          time: "1000Z",
          location: "Fajara Sector",
          description: "Donation of civic materials to the local state schools as part of integration efforts.",
          image_url: "https://ais-v2-pre-j6ejmdcxtiu6sbfl6xp46t-168883427679.europe-west3.run.app/api/artifacts/8904719c-8594-44bf-a9ee-bd4900c4c4ea",
          files: []
        },
        {
          id: "g-fhq-1",
          unitId: "fhq",
          title: "Force Commander Tactical Inspection - Yundum Barracks",
          eventType: "Army Day Celebration",
          date: "21 MAY 24",
          time: "0800Z",
          location: "Yundum Barracks",
          description: "Tactical briefing and physical security checks across the force deployment areas.",
          image_url: "https://ais-v2-pre-j6ejmdcxtiu6sbfl6xp46t-168883427679.europe-west3.run.app/api/artifacts/a815a510-91fb-4a81-9b0d-b4f1797e87ab",
          files: []
        },
        {
          id: "g-nigcoy-2",
          unitId: "nigcoy",
          title: "Medical Outreach and Supply Distribution in Fajara Sector",
          eventType: "Pink October",
          date: "22 MAY 24",
          time: "1200Z",
          location: "Fajara Medical Ground",
          description: "Medical support services, checkups, and diagnostic distributions for neighboring populations.",
          image_url: "https://ais-v2-pre-j6ejmdcxtiu6sbfl6xp46t-168883427679.europe-west3.run.app/api/artifacts/f3cc77f8-3e52-4467-8822-2630ce525ee8",
          files: []
        },
        {
          id: "g-ghancoy-1",
          unitId: "ghancoy",
          title: "GHANCOY Joint Estuary Patrol with Gambia Police Marine Unit",
          eventType: "ECOWAS Anniversary",
          date: "21 MAY 24",
          time: "1500Z",
          location: "Barra Sector",
          description: "Securing the coastal boundaries with close coordination teams from the GPF Marine.",
          image_url: "https://ais-v2-pre-j6ejmdcxtiu6sbfl6xp46t-168883427679.europe-west3.run.app/api/artifacts/0f40d85a-0f8f-4ed3-b68e-9dcc9165b699",
          files: []
        }
      ];
      localStorage.setItem("ecomig_gallery", JSON.stringify(initialGallery));
      setGalleryItems(initialGallery);
    }
  };

  useEffect(() => {
    loadGallery();
    // Watch for updates (polling localStorage)
    const interval = setInterval(loadGallery, 2000);
    return () => clearInterval(interval);
  }, []);

  const units = ["ALL", "MHQ", "FHQ", "SENBAT", "NIGCOY", "GHANCOY", "SENFPU"];
  const eventTypes = [
    "ALL",
    "Independence Day Parade",
    "Cultural events",
    "Medal Parade",
    "ECOWAS Anniversary",
    "Sallah Celebration",
    "Christmas Celebration",
    "Easter Celebration",
    "Children’s Day celebration",
    "Pink October",
    "National Women’s Day Anniversary",
    "Army Day Celebration"
  ];

  // Filter logic
  const filteredItems = galleryItems.filter((item) => {
    const matchesUnit = selectedUnitFilter === "ALL" || item.unitId.toUpperCase() === selectedUnitFilter;
    const matchesType = selectedTypeFilter === "ALL" || item.eventType === selectedTypeFilter;
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.eventType && item.eventType.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesUnit && matchesType && matchesSearch;
  });

  const downloadFile = (file: { name: string; size: string; type: string; base64?: string }) => {
    if (!file.base64) {
      alert("Attachment stream unresolvable locally.");
      return;
    }
    const link = document.createElement("a");
    link.href = file.base64;
    link.download = file.name.split("/").pop() || "attachment";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-1 sm:p-3 md:p-6 max-w-7xl mx-auto min-h-screen font-sans w-full">
      {/* Outer Tactical Frame */}
      <div className="relative bg-[#1a2c4e] p-2 sm:p-4 md:p-8 rounded-2xl border-4 sm:border-[6px] border-[#2b3e5a] shadow-[inset_0_0_100px_rgba(0,0,0,0.5),0_15px_30px_rgba(0,0,0,0.4)] overflow-hidden">
        
        {/* Decorative brackets */}
        <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-white/10 rounded-tl-xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-black/30 rounded-br-xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <BrandHeader title="MISSION GALLERY" subtitle="RECONNAISSANCE LOGS" />
          
          {/* Active stats */}
          <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-lg border border-white/10 text-left h-min">
            <Camera size={12} className="text-[#00853F] animate-pulse" />
            <span className="text-[9px] font-black tracking-widest text-[#00853F] uppercase leading-none block">
              SECURE LOGS SYSTEM: {filteredItems.length} OF {galleryItems.length} VISOBJS DIRECT
            </span>
          </div>
        </div>

        {/* Filters and Search Bar Cluster */}
        <div className="bg-black/20 p-4 border border-white/10 rounded-xl space-y-4 mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            {/* Search inputs */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-white/30" size={14} />
              <input
                type="text"
                placeholder="Search gallery archives..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-black/40 text-white pl-9 pr-3 py-2 text-xs font-bold border border-white/10 rounded-lg outline-none focus:border-[#00853F]"
              />
            </div>

            {/* Event categories list trigger */}
            <div className="flex items-center gap-2">
              <Filter className="text-white/40 shrink-0" size={12} />
              <span className="text-[9px] font-black text-white/40 uppercase tracking-wider shrink-0">Category:</span>
              <select
                value={selectedTypeFilter}
                onChange={(e) => setSelectedTypeFilter(e.target.value)}
                className="w-full bg-black/40 text-white px-2 py-2 text-xs font-bold border border-white/10 rounded-lg outline-none focus:border-[#00853F] cursor-pointer"
              >
                {eventTypes.map(t => (
                  <option key={t} value={t} className="bg-slate-900 text-white">
                    {t === "ALL" ? "All Event Categories" : t}
                  </option>
                ))}
              </select>
            </div>

            {/* Interactive Unit selector links */}
            <div className="flex items-center gap-2">
              <Users className="text-white/40 shrink-0" size={12} />
              <span className="text-[9px] font-black text-white/40 uppercase tracking-wider shrink-0">Unit Section:</span>
              <select
                value={selectedUnitFilter}
                onChange={(e) => setSelectedUnitFilter(e.target.value)}
                className="w-full bg-black/40 text-white px-2 py-2 text-xs font-bold border border-white/10 rounded-lg outline-none focus:border-[#00853F] cursor-pointer"
              >
                {units.map(u => (
                  <option key={u} value={u} className="bg-slate-900 text-white">
                    {u === "ALL" ? "All Tactical Units" : u}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Unit selection quick badges */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-white/5">
            <span className="text-[8px] font-black text-white/30 uppercase tracking-widest mr-1">Roster Sections:</span>
            {units.map(u => (
              <button
                key={u}
                onClick={() => setSelectedUnitFilter(u)}
                className={`px-2 py-0.5 rounded text-[8px] font-extrabold uppercase transition-all tracking-wider ${
                  selectedUnitFilter === u
                    ? "bg-[#00853F] text-white"
                    : "bg-white/5 text-white/60 hover:bg-white/10"
                }`}
              >
                {u}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Image Display Grid */}
        {filteredItems.length === 0 ? (
          <div className="py-20 text-center bg-black/10 border border-dashed border-white/10 rounded-xl space-y-3">
            <Camera className="mx-auto text-white/20" size={32} />
            <p className="text-white/60 text-xs font-black tracking-widest uppercase">
              RECON LOG ARCHIVE CLEAR // NO DIRECT MATCHES FOUND
            </p>
            <p className="text-white/30 text-[10px] font-medium tracking-wide">
              Adjust search keys or filter units above to retrieve active imagery logs.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <motion.div
                layout
                key={item.id}
                whileHover={{ y: -4 }}
                onClick={() => setActiveItem(item)}
                className="group relative bg-[#0f172a] border border-white/10 overflow-hidden cursor-pointer shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:border-[#00853F]/50 transition-all rounded"
              >
                {/* Image layout container */}
                <div className="aspect-[16/10] bg-slate-950 overflow-hidden relative">
                  {item.image_url || item.imageUrl ? (
                    <img
                      src={item.image_url || item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-white/10 bg-slate-900 border-b border-white/5">
                      <Camera size={32} />
                      <span className="text-[8px] font-black uppercase mt-1 tracking-widest text-white/30">DRAFT OUTLINE</span>
                    </div>
                  )}

                  {/* Badges on top */}
                  <div className="absolute top-2 left-2 flex gap-1.5 z-10">
                    <span className="bg-[#00853F] text-white text-[8px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded shadow-md">
                      {item.unitId.toUpperCase()}
                    </span>
                    {item.eventType && (
                      <span className="bg-blue-600 text-white text-[8px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded shadow-md">
                        {item.eventType}
                      </span>
                    )}
                  </div>

                  {/* Dark transparent gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />

                  {/* Quick Action icon */}
                  <div className="absolute bottom-2 right-2 p-1.5 bg-black/60 hover:bg-[#00853F] text-white transition-all rounded shadow-md opacity-0 group-hover:opacity-100">
                    <Eye size={12} />
                  </div>
                </div>

                {/* Information contents text */}
                <div className="p-4 text-left space-y-2">
                  <div className="flex items-center gap-3 text-[9px] font-extrabold tracking-wide text-white/50 uppercase">
                    <span className="flex items-center gap-1">
                      <Calendar size={10} className="text-[#00853F]" />
                      {item.date || "NO DATE"}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin size={10} className="text-red-500" />
                      {item.location || "FIELD SQUADRON"}
                    </span>
                  </div>

                  <h3 className="text-xs md:text-sm font-black text-white group-hover:text-[#00853F] transition-colors uppercase leading-snug line-clamp-1">
                    {item.title}
                  </h3>

                  <p className="text-[10px] text-white/60 font-medium leading-relaxed line-clamp-2">
                    {item.description}
                  </p>

                  {/* Attachments quick-state bar */}
                  {item.files && item.files.length > 0 && (
                    <div className="flex items-center gap-1 bg-white/5 border border-white/10 px-2 py-1 rounded text-[8px] font-bold text-white/70 w-max mt-2">
                      <FolderArchive size={10} className="text-yellow-500" />
                      <span>{item.files.length} ATTACHED DIRECTORY ITEMS</span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* LIGHTBOX / MULTI-ATTACHMENT ZOOM MODAL VIEW */}
      <AnimatePresence>
        {activeItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-3 md:p-6 text-left font-sans"
            onClick={() => setActiveItem(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              className="bg-[#111c2e] border-2 border-white/20 max-w-3xl w-full rounded-xl overflow-hidden shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Absolutes for close */}
              <button
                onClick={() => setActiveItem(null)}
                className="absolute top-3 right-3 p-2 bg-black/60 hover:bg-red-650 text-white rounded-full transition-all border border-white/20 z-20"
              >
                <X size={15} />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-12">
                {/* Media frame */}
                <div className="md:col-span-7 bg-black overflow-hidden relative flex items-center justify-center min-h-[220px] md:min-h-[420px]">
                  {activeItem.image_url || activeItem.imageUrl ? (
                    <img
                      src={activeItem.image_url || activeItem.imageUrl}
                      alt={activeItem.title}
                      className="w-full h-full object-contain max-h-[420px]"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-white/20">
                      <Camera size={48} />
                      <span className="text-[9px] font-black uppercase mt-1">DRAFT IMAGE MISSING</span>
                    </div>
                  )}

                  {/* Absolute sector unit flag */}
                  <span className="absolute bottom-3 left-3 bg-[#00853F] border border-white/20 text-white text-[9px] font-black uppercase px-2.5 py-0.5 tracking-wider">
                    SECTOR: {activeItem.unitId.toUpperCase()}
                  </span>
                </div>

                {/* Right metadata columns */}
                <div className="md:col-span-5 p-5 md:p-6 flex flex-col justify-between max-h-[420px] overflow-y-auto custom-scrollbar bg-[#0d1726] border-t md:border-t-0 md:border-l border-white/10 text-white">
                  <div className="space-y-4">
                    <span className="inline-block bg-blue-600 border border-white/15 text-white font-black text-[8px] tracking-widest px-2.5 py-0.5 uppercase">
                      {activeItem.eventType}
                    </span>

                    <h2 className="text-sm md:text-base font-black uppercase tracking-tight text-white leading-snug">
                      {activeItem.title}
                    </h2>

                    <div className="space-y-1.5 text-[10px] font-bold text-white/50 border-t border-b border-white/5 py-3">
                      <div className="flex items-center gap-2">
                        <Calendar size={11} className="text-[#00853F] shrink-0" />
                        <span>RECON DATE: {activeItem.date || "23 MAY 26"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={11} className="text-red-500 shrink-0" />
                        <span>GRID LOCATION: {activeItem.location || "THE GAMBIA SECTOR"}</span>
                      </div>
                    </div>

                    <div className="space-y-1 text-left">
                      <h4 className="text-[9px] font-black uppercase tracking-wider text-[#00853F]">FIELD OPERATION INTEL</h4>
                      <p className="text-[11px] leading-relaxed text-white/70 font-semibold font-sans">
                        {activeItem.description}
                      </p>
                    </div>
                  </div>

                  {/* Attachments and folders log files download list mapping */}
                  <div className="mt-5 pt-4 border-t border-white/10 text-left space-y-2">
                    <h4 className="text-[9px] font-black uppercase tracking-wide text-white/40 flex items-center gap-1.5">
                      <Folder size={11} className="text-[#00853F]" />
                      ATTACHED TRANSMISSION FILES (
                      {activeItem.files ? activeItem.files.length : 0}
                      )
                    </h4>

                    {!activeItem.files || activeItem.files.length === 0 ? (
                      <em className="block text-[8px] text-white/30 italic font-medium leading-none">
                        No supplementary folders or file attachments logged with this visual packet.
                      </em>
                    ) : (
                      <div className="space-y-1 max-h-[140px] overflow-y-auto custom-scrollbar">
                        {activeItem.files.map((file, idx) => (
                          <div
                            key={idx}
                            onClick={() => downloadFile(file)}
                            className="group/file flex items-center justify-between gap-3 bg-white/5 border border-white/10 hover:border-[#00853F]/40 p-1.5 rounded cursor-pointer transition-colors"
                          >
                            <div className="flex items-center gap-1.5 min-w-0">
                              <FileText size={10} className="text-blue-400 shrink-0" />
                              <span className="text-[8px] font-black text-white/80 uppercase truncate">
                                {file.name.split("/").pop()}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-[8px] font-bold text-white/40 group-hover/file:text-[#00853F] transition-all">
                              <span>{file.size}</span>
                              <Download size={8} />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
