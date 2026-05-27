import React, { useState } from "react";
import {
  BookOpen,
  Compass,
  FileText,
  HelpCircle,
  Video,
  Tv,
  Radio,
  Lock,
  Terminal,
  Activity,
  ChevronRight,
  Shield,
  Search,
  CheckCircle,
  Download,
  AlertTriangle,
  ExternalLink,
  Wifi,
  Sliders,
  Maximize2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Types for Handbook content
interface HandbookChapter {
  id: string;
  title: string;
  shortDesc: string;
  docCode: string;
  category: "VIDEO" | "TV" | "SECURITY" | "GENERAL";
  icon: React.ReactNode;
  sections: {
    sectionTitle: string;
    paragraphs: string[];
    steps?: string[];
    infobox?: {
      title: string;
      content: string;
      type: "warning" | "info" | "success";
    };
  }[];
}

export const MissionDocumentsArchive: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<"ALL" | "VIDEO" | "TV" | "SECURITY">("ALL");
  const [activeChapterId, setActiveChapterId] = useState<string>("ch-1");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSignOffAuthorized, setIsSignOffAuthorized] = useState(false);
  const [hasSignedOff, setHasSignedOff] = useState(false);
  const [officerName, setOfficerName] = useState("");
  const [activeTab, setActiveTab] = useState<"MANUALS" | "SCHEMATICS" | "TACTICAL_MAP">("MANUALS");

  // Telemetry alignment simulator inside the handbook
  const [dishAngle, setDishAngle] = useState(45);
  const [gainLevel, setGainLevel] = useState(82);
  const [channelFreq, setChannelFreq] = useState("348.150 MHz");
  const [isAligned, setIsAligned] = useState(true);

  const chapters: HandbookChapter[] = [
    {
      id: "ch-1",
      title: "SECURE SATCOM VIDEO CONFERENCING (SVC)",
      shortDesc: "Complete operational procedures for establishing multi-party video terminals on AES-256.",
      docCode: "TM-105-SVC",
      category: "VIDEO",
      icon: <Video className="text-[#0099cc]" size={20} />,
      sections: [
        {
          sectionTitle: "1.0 INTRODUCTION & CRYPTO ENGINE OVERVIEW",
          paragraphs: [
            "The ECOMIG Secure Satcom Video Conferencing (SVC) system resides directly as a modular subsystem embedded in the Secure Mailbox. It enables real-time high-definition operations coordination among the Mission Headquarters (MHQ), Force Headquarters (FHQ), Deputy Force Commander (DFC), and various field contingent headquarters (SENBAT, NIGCOY, GHANCOY, SENFPU).",
            "To guarantee absolute tactical isolation, all voice and video packets undergo client-side encryption before reaching the transponder bridge. The system utilizes Advanced Encryption Standard (AES) with a 256-bit key operating in Galois/Counter Mode (GCM). High-latency satellite ground links are optimized via dynamic packet headers and forward error correction (FEC)."
          ],
          infobox: {
            title: "AUTOMATIC CRYPTO KEY ROTATION",
            content: "The cryptological engine rotates dynamic salt hashes in 4.5-minute cycles. This is displayed as green hex streams on top of the conference panel. No manual security synchronization is required.",
            type: "success"
          }
        },
        {
          sectionTitle: "2.5 INITIATING OR JOINING A SECURE PANEL",
          paragraphs: [
            "Officers can navigate to their Secure Mailbox tab to manage or join active operational briefs. The layout features an integrated JOC briefing lobby. To initialize a channel, apply the following sequence:"
          ],
          steps: [
            "Enter the tactical title of the meeting inside the 'TACTICAL BRIEFING TITLE' field.",
            "Choose an appropriate Security Classification Level (RESTRICTED, SECRET, TOP SECRET, or COSMIC YES). This sets the dynamic decryption filter strength.",
            "Click on the 'BROADCAST SECURE SIGNAL' button to lock in the frequency and post the active beacon.",
            "To join an existing channel on the SATWELL radar, review the available list and click the 'JOIN SEC >' button to complete the quantum satellite handshake."
          ]
        },
        {
          sectionTitle: "3.2 COVERT IN-CALL HARDWARE CONTROLS",
          paragraphs: [
            "Operational security (OPSEC) requires strict hardware discipline. The SVC HUD provides one-click visual and auditory isolation controls. When entering a briefing, configure the workspace according to guidelines:"
          ],
          steps: [
            "MUTE MICROPHONE (Mic Icon): Disables the local audio input channel. It changes the button color to deep RED. Always mute when not actively presenting.",
            "MASK CAMERA (Video Icon): Switches off local webcam transport. The panel switches into 'CRYPT CAM MASKED' mode, substituting live footage with an ecowas tactical secure seal.",
            "SHARE TACTICAL MAP (Monitor Icon): Casts the central operation overlay grid to all connected monitors at 1080p resolution, with an 18:1 telemetry compression ratio for low bandwidth settings.",
            "DISCONNECT SIGNAL (Red Phone Icon): Immediately severs the active bridge transponder and releases local hardware locks cleanly."
          ],
          infobox: {
            title: "LOCAL COMMAND BOX (SEC-CLI)",
            content: "An advanced command console is available under the Secure Chat Channel. Type 'CLEAR' to purge chat history, or 'MUTE ALL' to force-silence all participants during crisis scenarios.",
            type: "warning"
          }
        }
      ]
    },
    {
      id: "ch-2",
      title: "ECOMIG TV TACTICAL BROADCAST OPERATIONS",
      shortDesc: "Satellite relay streams, telemetry indicators, and custom stream inject instructions.",
      docCode: "TM-112-BCST",
      category: "TV",
      icon: <Tv className="text-green-500" size={20} />,
      sections: [
        {
          sectionTitle: "1.0 MULTI-CHANNEL SATELLITE DISTRIBUTION SYSTEM (ETV)",
          paragraphs: [
            "The ECOMIG TV (ETV) unit is the strategic media and news broadcast delivery platform of the mission. It functions as an online satellite interface, piping active field briefings, daily sports tallies, global news portals, and tactical bulletins into officers' quarters.",
            "We compile tactical footage directly from field deployments (SENBAT operations, NIGCOY logistics patrols, GHANAIAN training updates) into centralized video packages. The receiver is configured to process live streams, local security recordings, and backup news reels."
          ]
        },
        {
          sectionTitle: "2.1 SELECTING AND OVERRIDING SIGNALS",
          paragraphs: [
            "Deployable units can interact with the broadcast selector on the right panel of the ECOMIG TV screen. The terminal is preset with several military channels:"
          ],
          steps: [
            "ECOMIG MHQ CHANNEL (Channel 1): Official mission statement documentaries, troop deployment briefs, and ECOWAS protocol directives.",
            "SENBAT COMBAT DRILLS (Channel 2): Specialized live exercise reports and physical tactical maneuvers.",
            "NIGCOY SUPPORT CONVOYS (Channel 3): Logistics supply routes and strategic escort briefings.",
            "GHANCOY CIMIC COOPERATION (Channel 4): Civil-military outreach programs and community security initiatives."
          ]
        },
        {
          sectionTitle: "3.0 LIVE CUSTOM TELEMETRY & FEED INFECTION",
          paragraphs: [
            "Under administrative command scenarios, authorized security officers can override existing feeds with a live operational URL loop. Use the 'BROADCAST CONTROL CONSOLE' button to reveal the feed injector:",
            "Paste the valid video stream source URL (e.g., MP4 file, YouTube secure broadcast, or rtsp source stream) inside the stream payload box and commit change. The signal is redistributed immediately across all local area network (LAN) monitors."
          ],
          infobox: {
            title: "TELEMETRY METRICS & DISH ALIGNMENT",
            content: "Optimal receiver gain must exceed 75% for HD feeds. Use the diagnostic alignment tuner to adjust the transponder polarization angle to achieve stabilization.",
            type: "info"
          }
        }
      ]
    },
    {
      id: "ch-3",
      title: "TACTICAL COMMUNICATIONS SECURITY PROTOCOLS",
      shortDesc: "Standard cryptographic guidelines and military information governance rules.",
      docCode: "FM-33-SEC",
      category: "SECURITY",
      icon: <Lock className="text-amber-500" size={20} />,
      sections: [
        {
          sectionTitle: "1.1 OPERATIONAL SECURITY & CLASSIFICATIONS",
          paragraphs: [
            "All informational assets are governed under rigid regional treaties. Staff must treat all documents, transmissions, and briefings with care. The four main security classification filters are designated as follows:"
          ],
          steps: [
            "RESTRICTED: Internal operational logs and department personnel charts. Only shared with active personnel.",
            "SECRET: Tactical convoy intervals, contingent locations, and JOC briefing links.",
            "TOP SECRET: Mission leadership coordinates, daily intelligence briefings, and active cyber relays.",
            "COSMIC YES: ECOWAS joint cabinet defense decrees, specialized operational commands, and high-frequency military satellite controls."
          ]
        },
        {
          sectionTitle: "2.2 HARDWARE INCIDENT REPORTING",
          paragraphs: [
            "Should a local terminal fail to load webcam devices, the portal falls back directly onto static simulations. Always inspect browser authorization keys to verify that 'Camera' and 'Microphone' permissions are allowed. If the browser blocks frame access, open the portal inside a standard secure standalone tab."
          ],
          infobox: {
            title: "EMERGENCY BREACH DIRECTIVE",
            content: "Should physical security be comprised, immediately scroll to the bottom of the administrative command panel and trigger 'PURGE CACHE'. This instantly overwrites local state parameters and wipes out the secure session keys.",
            type: "warning"
          }
        }
      ]
    }
  ];

  // Filters chapters based on selection and search
  const filteredChapters = chapters.filter((ch) => {
    const matchesCategory = selectedCategory === "ALL" || ch.category === selectedCategory;
    const matchesSearch =
      ch.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ch.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ch.docCode.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const activeChapter = chapters.find((ch) => ch.id === activeChapterId) || chapters[0];

  const handleSignOff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!officerName.trim()) return;
    setHasSignedOff(true);
  };

  return (
    <div className="w-full max-w-7xl mx-auto py-1 sm:py-4 md:py-8 px-1 sm:px-4 md:px-8 animate-fade-in text-[#1f2937]">
      {/* Heavy Military Style Binder Layout */}
      <div className="relative bg-[#ebedd4] p-3 sm:p-4 md:p-8 rounded-3xl border-4 sm:border-[16px] border-[#314a22] shadow-[0_25px_50px_rgba(0,0,0,0.6)]">
        {/* Binder Screws & Spine Visuals */}
        <div className="absolute top-6 left-6 block w-5 h-5 bg-zinc-400 rounded-full border-t border-white border-b border-black/50 shadow-inner" />
        <div className="absolute bottom-6 left-6 block w-5 h-5 bg-zinc-400 rounded-full border-t border-white border-b border-black/50 shadow-inner" />
        <div className="absolute top-6 right-6 block w-5 h-5 bg-zinc-400 rounded-full border-t border-white border-b border-black/50 shadow-inner" />
        <div className="absolute bottom-6 right-6 block w-5 h-5 bg-zinc-400 rounded-full border-t border-white border-b border-black/50 shadow-inner" />

        {/* Brand Header */}
        <div className="w-full bg-[#314a22] p-4 rounded-xl text-white mb-6 flex flex-col md:flex-row md:items-center justify-between border-b-4 border-black/40 gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white flex items-center justify-center rounded-lg border-2 border-green-700">
              <Shield className="text-[#00853F]" size={28} />
            </div>
            <div>
              <span className="bg-[#0099cc] text-white font-mono font-black text-[9px] px-2 py-0.5 rounded tracking-widest uppercase">
                FM-01-2026
              </span>
              <h1 className="text-xl md:text-2xl font-black tracking-tight font-sans">
                ECOMIG MILITARY FIELD MANUAL
              </h1>
              <p className="text-[10px] text-green-300 font-mono uppercase tracking-widest mt-0.5">
                SECURE CONFERENCING & ETV BROADCAST HANDBOOK
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs">
            <span className="text-green-300">AUTHORITY LEVEL:</span>
            <span className="bg-red-600/95 text-white text-[10px] font-black px-2.5 py-1 rounded border border-red-500">
              SECRET / JOC
            </span>
          </div>
        </div>

        {/* Dashboard sub-navigation tabs */}
        <div className="flex border-b-2 border-gray-300 mb-6 gap-2">
          {[
            { id: "MANUALS", label: "OPERATIONAL HANDBOOK", icon: <BookOpen size={14} /> },
            { id: "SCHEMATICS", label: "SATELLITE TELEMETRY LINK", icon: <Sliders size={14} /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-3 text-xs font-black tracking-wider uppercase flex items-center gap-2 border-t-4 transition-all rounded-t-lg ${
                activeTab === tab.id
                  ? "bg-white border-[#314a22] text-[#314a22] shadow-[0_4px_10px_rgba(0,0,0,0.1)] font-extrabold"
                  : "bg-transparent border-transparent text-gray-600 hover:text-black hover:bg-white/5"
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "MANUALS" ? (
            <motion.div
              key="manuals-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6"
            >
              {/* Left Column: Chapters Directory */}
              <div className="lg:col-span-4 bg-white/80 backdrop-blur-sm p-4 rounded-xl border-2 border-gray-300 shadow-sm flex flex-col justify-between">
                <div>
                  {/* Search and Filters */}
                  <div className="mb-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search field manuals..."
                        className="w-full bg-white border border-gray-300 focus:border-[#314a22] pl-9 pr-4 py-2 rounded text-xs text-[#1a2c4e] outline-none font-bold placeholder:text-gray-400 font-mono"
                      />
                    </div>
                  </div>

                  {/* Quick Filters */}
                  <div className="flex gap-1 flex-wrap mb-4">
                    {[
                      { id: "ALL", label: "ALL" },
                      { id: "VIDEO", label: "VIDEO" },
                      { id: "TV", label: "ECOMIG TV" },
                      { id: "SECURITY", label: "SECURITY DEPT" }
                    ].map((filt) => (
                      <button
                        key={filt.id}
                        onClick={() => setSelectedCategory(filt.id as any)}
                        className={`text-[9px] font-black px-2.5 py-1.5 rounded tracking-wide border transition-all ${
                          selectedCategory === filt.id
                            ? "bg-[#314a22] text-white border-[#314a22] shadow"
                            : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {filt.label}
                      </button>
                    ))}
                  </div>

                  <h3 className="text-[10px] font-black tracking-widest text-[#314a22] uppercase border-b border-gray-200 pb-2 mb-3">
                    MANUAL DIRECTIVES LIST
                  </h3>

                  {/* Chapter items */}
                  <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
                    {filteredChapters.map((ch) => (
                      <button
                        key={ch.id}
                        onClick={() => setActiveChapterId(ch.id)}
                        className={`w-full text-left p-3 rounded-lg border-2 transition-all flex items-start gap-3 group ${
                          activeChapterId === ch.id
                            ? "bg-amber-100/50 border-amber-600 shadow-md"
                            : "bg-white/60 border-gray-200 hover:border-gray-300 hover:bg-white"
                        }`}
                      >
                        <div className="mt-1 bg-white p-1 rounded border border-gray-300 flex items-center justify-center">
                          {ch.icon}
                        </div>
                        <div className="flex-grow min-w-0">
                          <div className="flex justify-between items-center">
                            <span className="font-mono text-[9px] font-bold text-[#0099cc] tracking-wider leading-none">
                              {ch.docCode}
                            </span>
                            <span className="bg-[#314a22]/10 text-[#314a22] text-[7px] font-black px-1.5 py-0.5 rounded leading-none">
                              {ch.category}
                            </span>
                          </div>
                          <h4 className="text-xs font-black text-gray-900 truncate mt-1 group-hover:text-amber-700 transition-colors">
                            {ch.title}
                          </h4>
                          <p className="text-[10px] text-gray-500 line-clamp-2 mt-0.5">
                            {ch.shortDesc}
                          </p>
                        </div>
                      </button>
                    ))}

                    {filteredChapters.length === 0 && (
                      <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded text-gray-400 font-bold uppercase text-xs">
                        No manual matches query.
                      </div>
                    )}
                  </div>
                </div>

                {/* Satellite sync status */}
                <div className="mt-6 pt-4 border-t border-gray-200 bg-zinc-50 p-2.5 rounded border border-gray-200">
                  <div className="flex items-center gap-2">
                    <Wifi className="text-green-600 animate-pulse animate-duration-1000" size={16} />
                    <div>
                      <h5 className="text-[10px] font-black text-[#314a22] leading-tight">
                        LIVE RECOGNITION DECREE
                      </h5>
                      <p className="text-[8px] text-gray-500 font-mono tracking-wider mt-0.5">
                        DIAG-ANTENNA: aligned | BEACON IP: secure
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Active Document Reader */}
              <div className="lg:col-span-8 bg-white p-6 md:p-8 rounded-xl border-2 border-gray-300 shadow-sm flex flex-col justify-between min-h-[580px] select-text">
                <div>
                  {/* Chapter Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-2 border-dashed border-gray-250 pb-4 mb-6 gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="bg-[#314a22] text-white font-mono text-[9px] font-black px-2 py-0.5 rounded uppercase shadow-sm">
                          {activeChapter.docCode}
                        </span>
                        <span className="text-[10px] font-mono text-[#0099cc] font-bold uppercase tracking-widest border-l pl-2">
                          ECOMIG OPERATIONS MANUAL
                        </span>
                      </div>
                      <h2 className="text-lg md:text-xl font-black text-gray-900 tracking-tight mt-1.5 uppercase leading-snug">
                        {activeChapter.title}
                      </h2>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-center">
                      <button
                        onClick={() => window.print()}
                        className="bg-[#314a22]/10 text-[#314a22] hover:bg-[#314a22] hover:text-white border border-[#314a22]/35 hover:border-[#314a22] px-3 py-1.5 rounded text-[10px] font-black tracking-widest uppercase transition-all flex items-center gap-1 cursor-pointer"
                        title="Print Manual"
                      >
                        <FileText size={12} /> PRINT DIRECTIVE
                      </button>
                    </div>
                  </div>

                  {/* Chapter Section Blocks */}
                  <div className="space-y-6">
                    {activeChapter.sections.map((sec, sIdx) => (
                      <div key={sIdx} className="bg-[#fbfcfa] border border-gray-250 p-4 rounded-lg relative overflow-hidden">
                        {/* Sub-bevel decoration */}
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-[#314a22]" />

                        <h3 className="text-xs font-black tracking-widest text-[#314a22] uppercase mb-3 flex items-center gap-2">
                          <ChevronRight className="text-[#0099cc]" size={14} /> {sec.sectionTitle}
                        </h3>

                        <div className="space-y-3.5 text-xs text-gray-750 font-sans font-medium leading-relaxed">
                          {sec.paragraphs.map((p, pIdx) => (
                            <p key={pIdx}>{p}</p>
                          ))}
                        </div>

                        {/* If step list exists */}
                        {sec.steps && (
                          <div className="mt-4 bg-[#f3f4ec] p-4 rounded border border-gray-250 font-sans">
                            <h4 className="text-[10px] font-black text-gray-800 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                              <Activity size={12} className="text-[#314a22]" /> ACTION PIPELINE PROTOCOLS
                            </h4>
                            <ul className="space-y-2.5">
                              {sec.steps.map((st, stIdx) => (
                                <li key={stIdx} className="flex gap-2.5 text-xs leading-relaxed text-gray-800">
                                  <span className="font-mono text-[10px] font-black bg-[#314a22] text-white w-5 h-5 rounded-full flex items-center justify-center shrink-0 shadow-sm mt-0.5 select-none">
                                    {stIdx + 1}
                                  </span>
                                  <span className="font-bold">{st}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* If infobox block exists */}
                        {sec.infobox && (
                          <div
                            className={`mt-4 p-4 rounded-lg border-2 flex items-start gap-3 ${
                              sec.infobox.type === "warning"
                                ? "bg-amber-50 border-amber-300 text-amber-905"
                                : sec.infobox.type === "success"
                                  ? "bg-emerald-50 border-emerald-300 text-emerald-905"
                                  : "bg-[#0099cc]/5 border-[#0099cc]/30 text-blue-900"
                            }`}
                          >
                            <div className="mt-0.5">
                              {sec.infobox.type === "warning" ? (
                                <AlertTriangle size={18} className="text-amber-600" />
                              ) : sec.infobox.type === "success" ? (
                                <CheckCircle size={18} className="text-emerald-600" />
                              ) : (
                                <HelpCircle size={18} className="text-[#0099cc]" />
                              )}
                            </div>
                            <div>
                              <h5 className="text-[10px] font-black uppercase tracking-wider leading-none mb-1.5">
                                {sec.infobox.title}
                              </h5>
                              <p className="text-[11px] font-bold leading-normal text-gray-800">
                                {sec.infobox.content}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Operational Sign-off Form */}
                <div className="mt-8 pt-6 border-t-2 border-gray-250 bg-amber-50/70 p-4 rounded-xl border border-amber-200/60 font-sans">
                  {hasSignedOff ? (
                    <motion.div
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="flex items-center gap-3.5 p-3 bg-emerald-100/50 border-2 border-emerald-500 rounded-lg text-emerald-950 font-bold text-xs"
                    >
                      <CheckCircle className="text-emerald-600" size={24} />
                      <div>
                        <h4 className="font-black text-xs uppercase tracking-wider text-emerald-900 leading-none">
                          OFFICIAL DIRECTIVE CONFIRMED & REGISTERED
                        </h4>
                        <p className="font-mono text-[10px] text-emerald-700 mt-1">
                          Officer: <span className="underline font-black">{officerName.toUpperCase()}</span> | Time: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()} || REGISTRATION HASH LOCK COMPLETED
                        </p>
                      </div>
                    </motion.div>
                  ) : (
                    <div>
                      <h4 className="text-[10px] font-black text-[#314a22] tracking-widest uppercase mb-1 flex items-center gap-1">
                        <Lock size={12} className="text-amber-600" /> MANDATORY OFFICER SIGN-OFF DECREE
                      </h4>
                      <p className="text-[10px] text-gray-600 mb-4 leading-relaxed font-bold">
                        Under ECOMIG Joint Communication Regulations, all senior commanders and dispatch staff are required to sign off on SVC Operations (TM-105) and ECOMIG TV Distribution guidelines (TM-112).
                      </p>

                      <form onSubmit={handleSignOff} className="flex flex-col sm:flex-row gap-3">
                        <input
                          type="text"
                          required
                          value={officerName}
                          onChange={(e) => setOfficerName(e.target.value)}
                          placeholder="e.g. MAJOR GENERAL J BARROW"
                          className="flex-grow bg-white border-2 border-gray-300 focus:border-[#314a22] p-3 rounded text-xs text-gray-900 outline-none font-bold placeholder:text-gray-400 capitalize"
                        />
                        <button
                          type="submit"
                          className="bg-[#314a22] hover:bg-green-800 text-white font-black text-xs px-6 py-3 border-b-4 border-r-4 border-[#1c2c13] rounded uppercase tracking-widest transition-all cursor-pointer hover:scale-[1.01] active:translate-y-0.5 active:border-0 flex items-center justify-center gap-2 shrink-0"
                        >
                          LOCK IN ACCREDITATION <CheckCircle size={14} />
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ) : (
            // Schematics Satellite alignment diagnostics view
            <motion.div
              key="schematics-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="bg-zinc-950 border-2 border-zinc-800 p-6 md:p-8 rounded-xl relative overflow-hidden"
            >
              {/* Retro military scope/telemetry grid decoration */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,100,0,0.15)_0%,transparent_80%)] pointer-events-none" />
              <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.3)_50%)] bg-[size:100%_4px] pointer-events-none animate-flicker" />

              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 text-white font-mono">
                {/* Left Side Antenna Alignment Slider UI */}
                <div className="lg:col-span-5 bg-black/50 border border-green-800/40 p-5 rounded-lg flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Sliders className="text-[#0099cc]" size={16} />
                      <h4 className="text-xs font-black tracking-widest text-[#0099cc] uppercase">
                        SATELLITE BEACON ALIGNMENT TUNER
                      </h4>
                    </div>
                    <p className="text-[10px] text-gray-400 mb-6 leading-relaxed">
                      ECOMIG TV feeds and SVC video transponder channels rely on precision geostationary orbital locking. Manually align the polarization angles of the MHQ receiver dish to maximize signal gain ratio.
                    </p>

                    <div className="space-y-6">
                      {/* Polarization Slider */}
                      <div>
                        <div className="flex justify-between text-[10px] font-bold uppercase mb-2">
                          <span className="text-gray-300">Antenna Azimuth Angle:</span>
                          <span className="text-[#0099cc]">{dishAngle}° N</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="180"
                          value={dishAngle}
                          onChange={(e) => {
                            const val = parseInt(e.target.value);
                            setDishAngle(val);
                            // optimal angle is between 70 and 90
                            const diff = Math.abs(val - 80);
                            const optimalGain = Math.max(20, 100 - diff * 1.5);
                            setGainLevel(Math.floor(optimalGain));
                            setIsAligned(optimalGain >= 75);
                          }}
                          className="w-full accent-[#0099cc]/70 bg-zinc-800 h-2 rounded-lg cursor-pointer"
                        />
                        <div className="flex justify-between text-[8px] text-zinc-500 mt-1 uppercase">
                          <span>0° (West)</span>
                          <span className="text-green-500">80° (OPTIMAL RECEPTOR)</span>
                          <span>180° (East)</span>
                        </div>
                      </div>

                      {/* Diagnostic values */}
                      <div className="grid grid-cols-2 gap-4 bg-zinc-900/80 p-4 border border-zinc-800 rounded">
                        <div>
                          <span className="block text-[8px] text-gray-500 uppercase">SIGNAL GAIN RATIO:</span>
                          <span
                            className={`text-sm font-black ${
                              gainLevel >= 75 ? "text-green-400" : "text-amber-500"
                            }`}
                          >
                            {gainLevel}% dBi
                          </span>
                        </div>

                        <div>
                          <span className="block text-[8px] text-gray-500 uppercase">SAT BEACON STATUS:</span>
                          <span
                            className={`text-sm font-black flex items-center gap-1 ${
                              isAligned ? "text-green-400" : "text-amber-500"
                            }`}
                          >
                            {isAligned ? "SYNCHED" : "ALIGN REQUIRED"}
                          </span>
                        </div>
                      </div>

                      {/* Frequency Quick-Selector */}
                      <div>
                        <label className="block text-[9px] text-gray-400 uppercase tracking-wider mb-2">
                          Primary Multi-Cast Feed Frequency
                        </label>
                        <div className="grid grid-cols-2 gap-2 text-center text-[10px]">
                          {[
                            { id: "348.150 MHz", name: "SVC PRIMARY JOC" },
                            { id: "142.925 MHz", name: "DFC CELL FEED" },
                            { id: "419.050 MHz", name: "J2 INTEL NETWORK" },
                            { id: "89.400 MHz", name: "ETV COMMERCIAL BROADCAST" }
                          ].map((freq) => (
                            <button
                              key={freq.id}
                              onClick={() => setChannelFreq(freq.id)}
                              className={`p-2.5 rounded text-[9px] font-black tracking-widest border transition-all ${
                                channelFreq === freq.id
                                  ? "bg-green-950 text-green-300 border-green-500 shadow"
                                  : "bg-black text-gray-500 border-zinc-800 hover:text-white"
                              }`}
                            >
                              {freq.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Operational status alert */}
                  <div className="mt-6 pt-4 border-t border-zinc-900 flex justify-between items-center text-[9px] text-zinc-500/80 uppercase">
                    <span>Cryptographic Key:</span>
                    <span className="text-green-500/80 font-bold">AES-GCM-256 Enabled</span>
                  </div>
                </div>

                {/* Right Side Visual Satellite Orbit representation */}
                <div className="lg:col-span-7 bg-black/60 border border-green-800/40 p-5 rounded-lg flex flex-col justify-between items-center min-h-[420px] relative">
                  <div className="w-full flex justify-between items-center mb-4">
                    <span className="text-[10px] font-bold text-green-400 flex items-center gap-1.5 uppercase">
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
                      Dynamic Radar Array Visualization
                    </span>
                    <span className="text-[9px] text-[#0099cc] font-mono tracking-wider">
                      LATENCY: {Math.max(12, 450 - gainLevel * 4.5).toFixed(0)} ms
                    </span>
                  </div>

                  {/* Satellite Simulated Dish Alignment Target Scope */}
                  <div className="relative w-64 h-64 border-2 border-green-950 rounded-full flex items-center justify-center p-4">
                    {/* Radar swept lines */}
                    <div className="absolute inset-2 border border-green-905/30 rounded-full border-dashed" />
                    <div className="absolute inset-12 border border-green-905/20 rounded-full" />
                    <div className="absolute inset-24 border border-green-905/10 rounded-full border-dashed" />

                    {/* Horizontal & Vertical Scope Axes */}
                    <div className="absolute w-full h-[1px] bg-green-905/20" />
                    <div className="absolute h-full w-[1px] bg-green-905/20" />

                    {/* Satellite Dish Icon representing orientation */}
                    <motion.div
                      animate={{ rotate: dishAngle }}
                      transition={{ type: "spring", stiffness: 60 }}
                      className="relative z-10 p-6 bg-zinc-900 border-2 border-green-500 rounded-full flex items-center justify-center shadow-lg cursor-grab active:cursor-grabbing"
                    >
                      <Radio className="text-green-400" size={32} />
                      {/* Target Indicator alignment glow */}
                      {isAligned && (
                        <div className="absolute inset-0 rounded-full border-2 border-green-400 animate-ping opacity-40" />
                      )}
                    </motion.div>

                    {/* Floating Target Node representing geostationary Sat position at 80 degrees */}
                    <div className="absolute top-[28%] right-[19%]">
                      <div className="relative flex items-center justify-center">
                        <div className="w-4 h-4 bg-[#0099cc] rounded-full flex items-center justify-center shadow-lg border border-white">
                          <Activity className="text-white" size={10} />
                        </div>
                        <span className="absolute -top-5 left-0 text-[8px] font-semibold text-[#0099cc] tracking-widest whitespace-nowrap bg-black/80 px-1 py-0.5 rounded">
                          ECOMIG-SAT-B (80°)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom metrics info bar */}
                  <div className="w-full bg-[#00170a]/50 p-4 rounded-lg border border-green-950/60 mt-4">
                    <h5 className="text-[10px] font-black text-green-300 uppercase tracking-widest mb-1">
                      REAL-TIME TRANSPONDER DIAGNOSTIC SIGNAL
                    </h5>
                    <p className="text-[10px] font-sans text-gray-300 leading-normal font-medium">
                      Telemetry alignment parameters are fully satisfied. Under active tuning conditions, the transponder locks onto the secure feed at <span className="text-green-400 font-bold">{channelFreq}</span> routing through Dakar Ground Link relay stations. Total satellite signal loss ratio: <span className="text-green-400 font-bold">{(100 - gainLevel) * 0.08}%</span>.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Outer military decorative footer stamp */}
        <div className="mt-8 flex flex-col md:flex-row md:items-center justify-between opacity-35 text-[9px] font-mono select-none tracking-widest uppercase text-gray-500 gap-3 border-t-2 border-[#314a22]/15 pt-4">
          <div className="flex gap-2 items-center">
            <span className="w-2 h-2 rounded bg-green-600 animate-pulse" />
            <span>CONFIDENT CLASS DECREE STATUS: STANDBY</span>
          </div>
          <span>DOCUMENT REFERENCE ID: FM-TM-SECURE-COMMS-2026-A</span>
        </div>
      </div>
    </div>
  );
};
