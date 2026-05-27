import React, { useState, useEffect, useRef } from "react";
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Phone,
  PhoneOff,
  Users,
  Radio,
  Terminal,
  Settings,
  Shield,
  ShieldAlert,
  Globe,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Plus,
  MessageSquare,
  Monitor,
  Wifi,
  Cpu,
  Layers,
  Lock,
  Unlock,
  Send,
  Sparkles,
  Camera,
  Activity
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Participant {
  id: string;
  name: string;
  rank: string;
  appointment: string;
  country: string;
  status: "connected" | "connecting" | "disconnected";
  micActive: boolean;
  camActive: boolean;
  isSpeaking: boolean;
  role: "host" | "guest" | "observer";
  avatar: string; // fallback icon/image url
  signal: number; // 1-5 bars
}

interface Message {
  id: string;
  sender: string;
  rank: string;
  text: string;
  time: string;
  isSystem: boolean;
}

interface ConferenceRoom {
  id: string;
  title: string;
  classification: "RESTRICTED" | "SECRET" | "TOP SECRET" | "COSMIC YES";
  activeCount: number;
  relayPoint: string;
  frequency: string;
}

export const EcomigVideoConference: React.FC = () => {
  // 18-Department Satcom Secure speed-dial numbers & parameters
  const departmentCallDirectory = [
    { code: "MHQ", name: "MISSION HEADQUARTERS", num: "*101#", callsign: "MHQ-LEADER-ALPHA", freq: "348.150 MHz", status: "LIVE", imageUrl: "https://i.postimg.cc/VN8W5R7r/ECOMIG-LOGO.png" },
    { code: "FHQ", name: "FORCE HEADQUARTERS", num: "*102#", callsign: "FORCE-COMMANDER-02", freq: "348.150 MHz", status: "LIVE", imageUrl: "https://i.postimg.cc/VN8W5R7r/ECOMIG-LOGO.png" },
    { code: "DFC", name: "DEPUTY FORCE COMMANDER CELL", num: "*103#", callsign: "DFC-LIAISON-TACTICAL", freq: "142.925 MHz", status: "LIVE", imageUrl: "https://i.postimg.cc/vTpwnBSM/okeniyi-jpg-png-Copy.jpg" },
    { code: "J1", name: "ADMINISTRATION & PERSONNEL", num: "*104#", callsign: "J1-PERS-COORD", freq: "210.450 MHz", status: "STANDBY", imageUrl: "https://i.postimg.cc/sft27DWG/staff-jpg-Copy.png" },
    { code: "J2", name: "MILITARY INTELLIGENCE & INFRA", num: "*105#", callsign: "J2-INTEL-NET-ALPHA", freq: "419.050 MHz", status: "LIVE", imageUrl: "https://i.postimg.cc/sft27DWG/staff-jpg-Copy.png" },
    { code: "J3", name: "OPERATIONS & TACTICAL PLANS", num: "*106#", callsign: "J3-OPS-CENTRAL", freq: "348.150 MHz", status: "STANDBY", imageUrl: "https://i.postimg.cc/vTpwnBSM/okeniyi-jpg-png-Copy.jpg" },
    { code: "J6", name: "COMMUNICATIONS & COVERT IT", num: "*107#", callsign: "J6-COMMS-SECURE-COM", freq: "348.150 MHz", status: "LIVE", imageUrl: "https://i.postimg.cc/sft27DWG/staff-jpg-Copy.png" },
    { code: "J7", name: "TACTICAL TRAINING & DOCTRINE", num: "*108#", callsign: "J7-ZEAL-TRAIN-BASE", freq: "195.800 MHz", status: "STANDBY", imageUrl: "https://i.postimg.cc/sft27DWG/staff-jpg-Copy.png" },
    { code: "PM", name: "PROVOST MARSHAL POLICE CORE", num: "*109#", callsign: "PM-PROVOST-FORCE", freq: "115.300 MHz", status: "STANDBY", imageUrl: "https://i.postimg.cc/sft27DWG/staff-jpg-Copy.png" },
    { code: "PIO", name: "PUBLIC INFORMATION & PRESS", num: "*110#", callsign: "PIO-COV-MEDIA-CENTER", freq: "89.400 MHz", status: "STANDBY", imageUrl: "https://i.postimg.cc/sft27DWG/staff-jpg-Copy.png" },
    { code: "PROCOY", name: "PROTECTIVE INFANTRY GUARD COY", num: "*111#", callsign: "PROCOY-CITADEL-LOCK", freq: "348.150 MHz", status: "LIVE", imageUrl: "https://i.postimg.cc/sft27DWG/staff-jpg-Copy.png" },
    { code: "PA", name: "POLITICAL ADVISOR & COORDINATOR", num: "*112#", callsign: "PA-POLAD-INTEGRATOR", freq: "182.400 MHz", status: "STANDBY", imageUrl: "https://i.postimg.cc/sft27DWG/staff-jpg-Copy.png" },
    { code: "CC", name: "CONTINGENT COMMAND CELL", num: "*113#", callsign: "CC-LEAD-COALITION", freq: "142.925 MHz", status: "LIVE", imageUrl: "https://i.postimg.cc/sft27DWG/staff-jpg-Copy.png" },
    { code: "COMM", name: "ECOWAS COMMISSION LIAISON", num: "*114#", callsign: "COMM-ECOWAS-BRUSSELS", freq: "419.050 MHz", status: "STANDBY", imageUrl: "https://i.postimg.cc/sft27DWG/staff-jpg-Copy.png" },
    { code: "SENBAT", name: "SENEGALESE FIELD BATTALION", num: "*115#", callsign: "SENBAT-FRONT-FORCE", freq: "142.925 MHz", status: "LIVE", imageUrl: "https://i.postimg.cc/KYNN3HsZ/senbat-jpg.png" },
    { code: "NIGCOY", name: "NIGERIAN SUPPORT COMPANY", num: "*116#", callsign: "NIGCOY-LOGISTICS-ESC", freq: "89.400 MHz", status: "LIVE", imageUrl: "https://i.postimg.cc/7Z9Z7Z9Z/nigcoy.jpg" },
    { code: "GHANCOY", name: "GHANA HIGH-ANCHOR COMPANY", num: "*117#", callsign: "GHANCOY-TACTICAL-SEC", freq: "210.450 MHz", status: "STANDBY", imageUrl: "https://i.postimg.cc/SNkxD1gB/ghancoyc-jpg.png" },
    { code: "SENFPU", name: "SENEGAL FORMED POLICE UNIT", num: "*118#", callsign: "SENFPU-RIOT-CTRL", freq: "115.300 MHz", status: "LIVE", imageUrl: "https://i.postimg.cc/fRT6bMBj/senfpu.jpg" }
  ];

  // Navigation & session state
  const [isInCall, setIsInCall] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<ConferenceRoom | null>(null);
  const [isLobbySearching, setIsLobbySearching] = useState(false);

  // New speed-dial interface states
  const [dialingDept, setDialingDept] = useState<any | null>(null);
  const [dialProgress, setDialProgress] = useState(0);

  // Sound synthesizer refs
  const audioCtxRef = useRef<AudioContext | null>(null);
  const ringIntervalRef = useRef<any>(null);

  // Dynamic HUD tracking variables for local video simulation fallback
  const [hudTargetHeading, setHudTargetHeading] = useState(182.4);
  const [hudAzimuth, setHudAzimuth] = useState(45.2);

  useEffect(() => {
    const timer = setInterval(() => {
      setHudTargetHeading((prev) => parseFloat((prev + (Math.random() * 0.4 - 0.2)).toFixed(1)));
      setHudAzimuth((prev) => parseFloat((prev + (Math.random() * 0.2 - 0.1)).toFixed(1)));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const startRingingSound = () => {
    try {
      // Clean up first
      stopRingingSound();

      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      
      const ctx = new AudioContextClass();
      audioCtxRef.current = ctx;

      const playBeep = () => {
        if (!ctx || ctx.state === "closed") return;
        if (ctx.state === "suspended") {
          ctx.resume().catch(() => {});
        }

        // Simulating the military satellite dial tone (440Hz + 480Hz combined)
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gainNode = ctx.createGain();

        osc1.frequency.value = 440;
        osc2.frequency.value = 480;

        // Cadet ringing cadence: 0.8s hold, then exponential decay
        gainNode.gain.setValueAtTime(0, ctx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.1);
        gainNode.gain.setValueAtTime(0.08, ctx.currentTime + 0.9);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);

        osc1.connect(gainNode);
        osc2.connect(gainNode);
        gainNode.connect(ctx.destination);

        osc1.start();
        osc2.start();

        osc1.stop(ctx.currentTime + 1.2);
        osc2.stop(ctx.currentTime + 1.2);
      };

      // Play immediate first pulse and loop every 2.0s
      playBeep();
      ringIntervalRef.current = setInterval(playBeep, 2000);
    } catch (e) {
      console.warn("Audio Context setup skipped:", e);
    }
  };

  const stopRingingSound = () => {
    if (ringIntervalRef.current) {
      clearInterval(ringIntervalRef.current);
      ringIntervalRef.current = null;
    }
    if (audioCtxRef.current) {
      if (audioCtxRef.current.state !== "closed") {
        audioCtxRef.current.close().catch(() => {});
      }
      audioCtxRef.current = null;
    }
  };

  // Synchronize ringing tone lifecycle with dialing and lobby search states
  useEffect(() => {
    if (dialingDept || isLobbySearching) {
      startRingingSound();
    } else {
      stopRingingSound();
    }
    return () => {
      stopRingingSound();
    };
  }, [dialingDept, isLobbySearching]);

  const handleDialDeptCall = (dept: any) => {
    setDialingDept(dept);
    setDialProgress(0);
    addConsoleLog(`SATCOM: OUTBOUND DIAL SIGNAL SENT TO [${dept.code}] VIA ${dept.num}`);
    
    const interval = setInterval(() => {
      setDialProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 25;
      });
    }, 500);

    setTimeout(() => {
      const dedicatedRoom: ConferenceRoom = {
        id: `room-dial-${dept.code}-${Date.now()}`,
        title: `${dept.code} SECURE BRIEFING TERMINAL`,
        classification: "SECRET",
        activeCount: 2,
        relayPoint: "ECOMIG-SAT-B",
        frequency: dept.freq
      };

      setSelectedRoom(dedicatedRoom);

      const activeAttendees: Participant[] = [
        {
          id: "part-local-proxy",
          name: "COMMAND OFFICER PROXY",
          rank: "OP-HQ",
          appointment: "MHQ MULTI-PORTAL",
          country: "ECOWAS",
          status: "connected",
          micActive: true,
          camActive: true,
          isSpeaking: false,
          role: "host",
          avatar: "https://i.postimg.cc/sft27DWG/staff-jpg-Copy.png",
          signal: 5
        },
        {
          id: `part-${dept.code}`,
          name: dept.callsign.replace(/-/g, ' '),
          rank: "CMD",
          appointment: dept.name,
          country: "ECOMIG",
          status: "connected",
          micActive: true,
          camActive: true,
          isSpeaking: true,
          role: "guest",
          avatar: dept.imageUrl || "https://i.postimg.cc/sft27DWG/staff-jpg-Copy.png",
          signal: 5
        }
      ];

      setParticipants(activeAttendees);
      setChatMessages([
        {
          id: "m-dial-1",
          sender: "SYSTEM CONTROL",
          rank: "DECREE",
          text: `Satcom line sync established for [${dept.name}] via Secure Dial Code ${dept.num}. Stream frequency: ${dept.freq}. AES-256 Multi-cast link secured.`,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          isSystem: true
        },
        {
          id: "m-dial-2",
          sender: dept.code,
          rank: "CMD",
          text: `This is [${dept.callsign}] reporting in. Secure dial line resolved successfully. Standing by for operations direct.`,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          isSystem: false
        }
      ]);

      setIsInCall(true);
      setDialingDept(null);
      addConsoleLog(`SATCOM: CONCURRENT ENCRYPTED TERM COMPLETED FOR [${dept.code}] AT FQ ${dept.freq}`);
    }, 2400);
  };

  // Hardware state
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);
  const [audioMuted, setAudioMuted] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  // Active call dynamic data
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [rotationKey, setRotationKey] = useState("AES-256://8F3D_4A1C_99FF");
  const [satelliteBars, setSatelliteBars] = useState(4);
  const [jocCommandInput, setJocCommandInput] = useState("");
  const [consoleLogs, setConsoleLogs] = useState<string[]>([
    "SYSINIT: SECURE SATCOM SUITE STARTED.",
    "CRYPTO: ROTATING SECURITY POLICIES: COMPLETED.",
    "RELAY: GROUND STATION DAKAR HANDSHAKE OK."
  ]);

  // UI state
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [conferencingTitle, setConferencingTitle] = useState("JOINT OPERATIONS DEFENSE BRIEF");
  const [classificationLevel, setClassificationLevel] = useState<"RESTRICTED" | "SECRET" | "TOP SECRET" | "COSMIC YES">("SECRET");

  // Media Stream refs
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Static list of mock conference rooms available to join
  const [availableRooms, setAvailableRooms] = useState<ConferenceRoom[]>([
    {
      id: "room-1",
      title: "JOINT OPERATIONS COMMAND (JOC)",
      classification: "TOP SECRET",
      activeCount: 4,
      relayPoint: "ECOMIG-SAT-B",
      frequency: "348.150 MHz"
    },
    {
      id: "room-2",
      title: "DFC FRONT-LINE LIAISON CELL",
      classification: "SECRET",
      activeCount: 2,
      relayPoint: "SENEGAL-RELAY-1",
      frequency: "142.925 MHz"
    },
    {
      id: "room-3",
      title: "J2 INTEL COALITION SYNCHRONIZATION",
      classification: "COSMIC YES",
      activeCount: 3,
      relayPoint: "NIGERIA-SEC-SAT3",
      frequency: "419.050 MHz"
    },
    {
      id: "room-4",
      title: "MHQ LOGISTICS & ESCORT DISPATCH",
      classification: "RESTRICTED",
      activeCount: 1,
      relayPoint: "GAMBIA-CELL-WEST",
      frequency: "89.400 MHz"
    }
  ]);

  // Initial preset participants for the simulated conference
  const initialAttendees: Participant[] = [
    {
      id: "part-1",
      name: "COLONEL SOULEYMANE",
      rank: "COL",
      appointment: "CHIEF OF STAFF",
      country: "SENEGAL",
      status: "connected",
      micActive: true,
      camActive: true,
      isSpeaking: false,
      role: "host",
      avatar: "https://i.postimg.cc/sft27DWG/staff-jpg-Copy.png",
      signal: 5
    },
    {
      id: "part-2",
      name: "COLONEL OKENIYI",
      rank: "COL",
      appointment: "DEPUTY FORCE COMMANDER",
      country: "NIGERIA",
      status: "connected",
      micActive: false,
      camActive: true,
      isSpeaking: false,
      role: "guest",
      avatar: "https://i.postimg.cc/vTpwnBSM/okeniyi-jpg-png-Copy.jpg",
      signal: 4
    },
    {
      id: "part-3",
      name: "MAJ SARR",
      rank: "MAJ",
      appointment: "J1 HEAD ADMIN",
      country: "SENEGAL",
      status: "connecting",
      micActive: false,
      camActive: false,
      isSpeaking: false,
      role: "observer",
      avatar: "https://i.postimg.cc/sft27DWG/staff-jpg-Copy.png",
      signal: 3
    },
    {
      id: "part-4",
      name: "CAPT MENSAH",
      rank: "CAPT",
      appointment: "PUBLIC INFO PIO",
      country: "GHANA",
      status: "disconnected",
      micActive: false,
      camActive: false,
      isSpeaking: false,
      role: "observer",
      avatar: "https://i.postimg.cc/sft27DWG/staff-jpg-Copy.png",
      signal: 1
    }
  ];

  // Request actual user webcam access when camera is on and in call
  const [hasRealLocalStream, setHasRealLocalStream] = useState(false);

  useEffect(() => {
    if (isInCall && camOn) {
      navigator.mediaDevices
        ?.getUserMedia({ video: { width: 320, height: 240 }, audio: micOn })
        .then((stream) => {
          mediaStreamRef.current = stream;
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }
          setHasRealLocalStream(true);
          addConsoleLog("MEDIA: LOCAL WEBCAM STREAM CONNECTED.");
        })
        .catch((err) => {
          console.warn("Camera access denied or unavailable, using security static filter:", err);
          addConsoleLog("MEDIA: FALLBACK TO TACTICAL SIMULATION.");
          setHasRealLocalStream(false);
          // If browser blocked it, we cleanly clear stream
          if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach((track) => track.stop());
            mediaStreamRef.current = null;
          }
        });
    } else {
      setHasRealLocalStream(false);
      // Clean up stream if leaving call or camera toggled off
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;
      }
    }

    return () => {
      setHasRealLocalStream(false);
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isInCall, camOn]);

  // Periodic simulated events: speaker switching, satellite bars flux, rotating crypto keys
  useEffect(() => {
    if (!isInCall) return;

    const interval = setInterval(() => {
      // 1. Randomize who is currently speaking
      setParticipants((prev) => {
        const connectedOnly = prev.filter((p) => p.status === "connected");
        if (connectedOnly.length === 0) return prev;

        const speakingIndex = Math.floor(Math.random() * connectedOnly.length);
        const speakerId = connectedOnly[speakingIndex].id;

        return prev.map((p) => ({
          ...p,
          isSpeaking: p.id === speakerId && Math.random() > 0.4 ? p.micActive : false
        }));
      });

      // 2. Flip connection status for connecting/disconnected participants
      setParticipants((prev) =>
        prev.map((p) => {
          if (p.status === "connecting" && Math.random() > 0.7) {
            addConsoleLog(`SYS: OFFICER [${p.rank} ${p.name}] JOINED ROOM.`);
            return { ...p, status: "connected", micActive: true, camActive: true };
          }
          return p;
        })
      );

      // 3. Rotate cryptographic dynamic AES salt
      const chars = "0123456789ABCDEF";
      let salt = "";
      for (let i = 0; i < 4; i++) salt += chars[Math.floor(Math.random() * 16)];
      setRotationKey(`AES-256://${salt}_4A1C_${Date.now().toString().slice(-4)}`);

      // 4. Flux network strength
      setSatelliteBars((prev) => {
        const next = prev + (Math.random() > 0.5 ? 1 : -1);
        return Math.max(3, Math.min(5, next));
      });
    }, 4500);

    return () => clearInterval(interval);
  }, [isInCall]);

  const addConsoleLog = (text: string) => {
    setConsoleLogs((prev) => [`[${new Date().toLocaleTimeString()}] ${text}`, ...prev.slice(0, 10)]);
  };

  const handleJoinRoom = (room: ConferenceRoom) => {
    setIsLobbySearching(true);
    addConsoleLog(`SATCOM: ESTABLISHING QUANTUM LINK ON ${room.frequency}...`);

    setTimeout(() => {
      setSelectedRoom(room);
      setParticipants(initialAttendees);
      setChatMessages([
        {
          id: "m-1",
          sender: "SYSTEM CONTROL",
          rank: "SECURE",
          text: `Room initialized: [${room.title}] Classification: ${room.classification}. All traffic encrypted via ${room.relayPoint}.`,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          isSystem: true
        },
        {
          id: "m-2",
          sender: "COLONEL SOULEYMANE",
          rank: "COL",
          text: "Welcome back, commanders. Report sector situations before tactical briefing.",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          isSystem: false
        }
      ]);
      setIsInCall(true);
      setIsLobbySearching(false);
      addConsoleLog(`SATCOM: HANDSHAKE SECURED WITH ${room.relayPoint}. ACTIVE SESSION STARTED.`);
    }, 1500);
  };

  const handleCreateRoom = () => {
    if (!conferencingTitle.trim()) return;

    const newRoom: ConferenceRoom = {
      id: `room-${Date.now()}`,
      title: conferencingTitle.toUpperCase().trim(),
      classification: classificationLevel,
      activeCount: 1,
      relayPoint: "ECOMIG-SAT-C",
      frequency: `${(100 + Math.random() * 400).toFixed(3)} MHz`
    };

    setAvailableRooms([newRoom, ...availableRooms]);
    handleJoinRoom(newRoom);
  };

  const handleSendMessage = () => {
    if (!currentMessage.trim()) return;

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: "COMMAND SYSTEM ADM",
      rank: "OP-HQ",
      text: currentMessage.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isSystem: false
    };

    setChatMessages((prev) => [...prev, newMsg]);
    setCurrentMessage("");
    addConsoleLog("CHAT: MESSAGE BROADCAST COMPLETED IN SECURE PORTAL.");
  };

  const handleLocalCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jocCommandInput.trim()) return;

    const command = jocCommandInput.trim().toUpperCase();
    addConsoleLog(`JOC CMD: Executing "${command}"`);

    if (command === "CLEAR") {
      setChatMessages([]);
      addConsoleLog("CONSOLE: CHAT MESSAGES CLEARED.");
    } else if (command.startsWith("MUTE ALL")) {
      setParticipants((prev) => prev.map((p) => ({ ...p, micActive: false })));
      addConsoleLog("JOC CMD: SILENCED MISSION DIRECTORY MIC FEEDS.");
    } else if (command.startsWith("SIGNAL TEST")) {
      addConsoleLog(`SATCOM: STRENGTH ACTIVE AT ${satelliteBars}/5 BARS. CITADEL RELAY SECURE.`);
    } else {
      addConsoleLog(`ERR: COMMAND NOT RECOGNIZED. SUPPORTED: CLEAR, MUTE ALL, SIGNAL TEST.`);
    }

    setJocCommandInput("");
  };

  return (
    <div className="w-full bg-[#002e15] border-t-[6px] border-[#0099cc] p-4 md:p-6 rounded-lg text-white mt-10 shadow-2xl relative overflow-hidden">
      {/* Background Military Radar grid simulation */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,100,0,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(0,100,0,0.04)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

      {/* Title & Classification Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b-[3px] border-[#00a651] pb-4 mb-6 relative z-10 gap-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-[#00853F] border-2 border-[#0099cc] flex items-center justify-center rounded-lg animate-pulse">
            <Radio className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-sm md:text-lg font-black tracking-widest uppercase flex items-center gap-2">
              ECOMIG SATCOM LIVE CONFERENCING
              <span className="bg-[#0099cc]/20 text-[#0099cc] text-[9px] px-2 py-0.5 rounded font-mono border border-[#0099cc]/40">
                SECURE
              </span>
            </h2>
            <p className="text-[9px] text-[#0099cc] font-mono tracking-widest mt-0.5">
              MHQ TACTICAL MULTI-OFFICER ENCRYPTED HUD v4.0.0
            </p>
          </div>
        </div>

        {/* Status meters */}
        <div className="flex items-center gap-6 font-mono text-[10px]">
          <div className="flex items-center gap-2">
            <Globe size={14} className="text-[#0099cc]" />
            <span className="text-gray-400">SATCOM BRIDGE:</span>
            <span className="text-green-400 font-bold">ECOMIG-SAT-SECURE</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((bar) => (
                <div
                  key={bar}
                  className={`w-1 h-3.5 rounded-sm ${
                    bar <= satelliteBars ? "bg-green-400" : "bg-white/10"
                  }`}
                />
              ))}
            </div>
            <span className="text-green-400 font-bold ml-1">STABLE</span>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!isInCall ? (
          // Lobby & Creation Suite
          <motion.div
            key="lobby"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10"
          >
            {/* Left side: Setup / Create Room */}
            <div className="lg:col-span-5 bg-black/40 border-2 border-[#006e36] p-5 rounded-lg flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Plus className="text-[#0099cc]" size={16} />
                  <h3 className="text-xs font-black tracking-widest uppercase text-[#0099cc]">
                    SPIN UP SECURE MILITARY PANEL
                  </h3>
                </div>

                <div className="space-y-4">
                  {/* Title input */}
                  <div>
                    <label className="block text-[9px] font-black text-gray-400 tracking-wider uppercase mb-1.5">
                      Tactical Briefing Title
                    </label>
                    <input
                      type="text"
                      value={conferencingTitle}
                      onChange={(e) => setConferencingTitle(e.target.value)}
                      placeholder="e.g. SECTOR NORTH BORDER ASSESSMENT"
                      className="w-full bg-black/60 border-2 border-gray-600 focus:border-[#0099cc] p-3 rounded font-bold text-xs font-mono text-white outline-none uppercase placeholder:text-gray-600"
                    />
                  </div>

                  {/* Classification Select */}
                  <div>
                    <label className="block text-[9px] font-black text-gray-400 tracking-wider uppercase mb-1.5">
                      Security Classification Mode
                    </label>
                    <div className="grid grid-cols-2 gap-2 text-center">
                      {(["RESTRICTED", "SECRET", "TOP SECRET", "COSMIC YES"] as const).map(
                        (level) => (
                          <button
                            key={level}
                            type="button"
                            onClick={() => setClassificationLevel(level)}
                            className={`p-2.5 rounded text-[10px] font-black tracking-widest transition-all border-2 ${
                              classificationLevel === level
                                ? level === "COSMIC YES"
                                  ? "bg-purple-950 text-purple-300 border-purple-500 shadow-lg scale-[1.03]"
                                  : level === "TOP SECRET"
                                    ? "bg-red-950 text-red-300 border-red-600 shadow-lg scale-[1.03]"
                                    : "bg-[#00853F]/20 text-[#00853F] border-[#00853F] shadow-lg scale-[1.03]"
                                : "bg-black/40 text-gray-400 border-gray-800 hover:border-gray-700 hover:text-white"
                            }`}
                          >
                            {level}
                          </button>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action trigger */}
              <div className="mt-8 pt-4 border-t border-gray-800">
                <button
                  type="button"
                  onClick={handleCreateRoom}
                  className="w-full bg-[#00853F] text-white border-b-4 border-r-4 border-[#004d24] font-black tracking-[0.2em] text-xs py-4 uppercase rounded hover:bg-green-600 hover:scale-[1.01] active:translate-y-0.5 active:border-0 transition-all flex items-center justify-center gap-2"
                >
                  <Video size={16} /> BROADCAST SECURE SIGNAL
                </button>
                <div className="mt-3 text-center bg-black/60 p-2.5 rounded border border-[#00853F]/20">
                  <p className="text-[9px] text-gray-400 font-bold leading-normal">
                    Satcom encryption setup or webcam device blocks? Consult the interactive <span className="text-amber-500 font-black font-mono">TM-105-SVC HANDBOOK</span> in the <span className="text-[#0099cc] font-black">MISSION DOCUMENTS</span> tab for troubleshooting step-by-steps.
                  </p>
                </div>
              </div>
            </div>

            {/* Right side: Available active conference channels */}
            <div className="lg:col-span-7 bg-black/40 border-2 border-[#006e36] p-5 rounded-lg flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Radio className="text-green-500 animate-pulse" size={16} />
                    <h3 className="text-xs font-black tracking-widest uppercase text-green-400">
                      ACTIVE STRATEGIC SATWELL RADAR
                    </h3>
                  </div>
                  <span className="text-[9px] font-mono text-[#0099cc] tracking-widest">
                    {availableRooms.length} SECURE BEACON(S)
                  </span>
                </div>

                {isLobbySearching ? (
                  <div className="h-64 flex flex-col items-center justify-center">
                    <div className="w-12 h-12 border-4 border-t-[#0099cc] border-r-white/10 border-b-white/10 border-l-white/10 rounded-full animate-spin mb-4" />
                    <p className="font-mono text-xs text-[#0099cc] tracking-[0.2em] animate-pulse">
                      ESTABLISHING SEC FLAT-LINK PORTAL...
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                    {availableRooms.map((room) => (
                      <div
                        key={room.id}
                        className="bg-[#00220e]/60 border border-[#00a651]/40 rounded p-4 flex flex-col sm:flex-row sm:items-center justify-between hover:border-[#0099cc] hover:bg-[#002b11] transition-all group"
                      >
                        <div className="mb-3 sm:mb-0">
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-[8px] font-black px-1.5 py-0.5 rounded font-mono border ${
                                room.classification === "COSMIC YES"
                                  ? "bg-purple-950 text-purple-300 border-purple-500/50"
                                  : room.classification === "TOP SECRET"
                                    ? "bg-red-950 text-red-300 border-red-500/50"
                                    : "bg-green-950 text-green-300 border-green-500/50"
                              }`}
                            >
                              {room.classification}
                            </span>
                            <span className="text-[10px] text-gray-400 font-mono">
                              {room.frequency}
                            </span>
                          </div>
                          <h4 className="text-sm font-black text-white group-hover:text-[#0099cc] transition-colors mt-1.5">
                            {room.title}
                          </h4>
                          <p className="text-[9px] text-[#00a651] font-mono mt-0.5">
                            Sat Relay: <span className="text-gray-300">{room.relayPoint}</span>
                          </p>
                        </div>

                        <div className="flex sm:flex-col items-end gap-2 justify-between">
                          <span className="text-[10px] font-bold text-green-400 flex items-center gap-1">
                            <Users size={12} /> {room.activeCount} Attendees ON-LINE
                          </span>
                          <button
                            type="button"
                            onClick={() => handleJoinRoom(room)}
                            className="bg-[#0099cc]/20 hover:bg-[#0099cc] text-[#0099cc] hover:text-white px-4 py-1.5 border border-[#0099cc] rounded text-[10px] font-black tracking-widest uppercase transition-all flex items-center gap-1"
                          >
                            JOIN SEC {">"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Console Logs Footer */}
              <div className="mt-6 pt-3 border-t border-gray-800 font-mono text-[8px] text-green-500/60">
                <div className="flex items-center gap-1.5 mb-1.5 font-bold uppercase text-green-400/80">
                  <Terminal size={10} /> Cryptographic Portal Logs:
                </div>
                <div className="space-y-0.5 max-h-[50px] overflow-y-auto bg-black/30 p-2 rounded">
                  {consoleLogs.map((log, index) => (
                    <div key={index} className="truncate">
                      {log}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* TACTICAL SPEED-DIAL SECURE DIRECTORY (All 18 Departments) */}
            <div className="col-span-12 bg-black/60 border-2 border-[#0099cc]/40 p-5 rounded-lg mt-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#0099cc]/30 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                  <h3 className="text-xs font-black tracking-widest uppercase text-[#0099cc] flex items-center gap-1.5">
                    <Phone size={14} className="text-[#0099cc]" /> TACTICAL SATCOM SPEED-DIAL DIRECTORY (18 DEPARTMENTS)
                  </h3>
                </div>
                <span className="text-[9px] font-mono text-cyan-400/80 tracking-widest uppercase mt-1 sm:mt-0">
                  SECURE CRYPTO-DIAL PROTOCOL *101# - *118#
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
                {departmentCallDirectory.map((dept) => (
                  <div
                    key={dept.code}
                    className="bg-[#001c0a]/60 border border-emerald-500/20 rounded p-3 hover:border-cyan-400 hover:bg-[#002810]/85 transition-all flex flex-col justify-between group relative overflow-hidden"
                  >
                    {/* Status beacon */}
                    <div className="absolute top-2 right-2 flex items-center gap-1">
                      <span className={`w-1.5 h-1.5 rounded-full ${dept.status === 'LIVE' ? 'bg-green-400 animate-ping' : 'bg-amber-400'}`} />
                      <span className="text-[6.5px] font-mono font-bold text-gray-400">{dept.status}</span>
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-black text-white bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-800/80 font-mono">
                          {dept.code}
                        </span>
                        <span className="text-[8px] font-mono text-cyan-400 font-bold tracking-wider">
                          {dept.num}
                        </span>
                      </div>
                      <h4 className="text-[9px] font-black text-gray-300 uppercase tracking-tight mt-1.5 line-clamp-1 group-hover:text-white transition-colors">
                        {dept.name}
                      </h4>
                      <p className="text-[7.5px] text-gray-400 font-mono mt-1">
                        Callsign: <span className="text-gray-400 text-[8px]">{dept.callsign}</span>
                      </p>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-[#00853F]/20 flex flex-col gap-1.5">
                      <div className="flex justify-between text-[7px] font-mono text-gray-500">
                        <span>FREQ: {dept.freq}</span>
                        <span>SAT-LINK</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDialDeptCall(dept)}
                        className="w-full bg-[#00853F]/30 hover:bg-cyan-500 text-cyan-400 hover:text-white border border-cyan-400/40 hover:border-cyan-400 transition-all font-mono font-bold text-[8.5px] py-1.5 rounded uppercase tracking-widest flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Phone size={10} /> DIAL TACTICAL
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          // Active Conference Interface
          <motion.div
            key="conference"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="grid grid-cols-1 xl:grid-cols-12 gap-6 relative z-10"
          >
            {/* Conference Video Stage */}
            <div className={`xl:col-span-${isChatOpen ? "8" : "12"} flex flex-col space-y-4`}>
              {/* Header inside call */}
              <div className="bg-black/40 border border-[#00853F]/40 p-3 rounded flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[8px] bg-red-600 text-white font-black px-1.5 py-0.5 rounded leading-tight tracking-widest">
                      {selectedRoom?.classification || "SECRET"}
                    </span>
                    <h3 className="text-xs font-black tracking-widest text-white uppercase">
                      {selectedRoom?.title || "COVALENT ACTION FORUM"}
                    </h3>
                  </div>
                  <p className="text-[8px] text-gray-400 font-mono tracking-wider mt-1">
                    Frequency: {selectedRoom?.frequency} | Satellite: {selectedRoom?.relayPoint} |{" "}
                    <span className="text-green-400 font-bold">{rotationKey}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 bg-red-600 rounded-full animate-ping" />
                  <span className="text-[9px] font-mono text-red-500 font-bold tracking-widest uppercase">
                    SECURE CALL RECORDING
                  </span>
                </div>
              </div>

              {/* Video Tiles Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 bg-black/30 p-3.5 border border-gray-800 rounded min-h-[380px]">
                {/* Local Camera stream */}
                <div className="relative bg-black border-2 border-[#0099cc] rounded overflow-hidden aspect-video flex flex-col justify-between group shadow-xl">
                  {/* Local video viewport */}
                  {camOn ? (
                    <>
                      {/* Invisible Video element to keep webcam requested & hardware active (light ON) */}
                      <video
                        ref={localVideoRef}
                        autoPlay
                        playsInline
                        muted
                        className="hidden absolute pointer-events-none w-[1px] h-[1px] opacity-0"
                      />

                      {/* Tactical HUD visual representation of command feed */}
                      <div className="absolute inset-0 bg-[#000a04] flex flex-col justify-between overflow-hidden">
                        <style>{`
                          @keyframes scanVertical {
                            0% { top: 0%; opacity: 0.3; }
                            50% { top: 100%; opacity: 0.8; }
                            100% { top: 0%; opacity: 0.3; }
                          }
                        `}</style>
                        {/* Grid Background Pattern */}
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,133,63,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(0,133,63,0.06)_1px,transparent_1px)] bg-[size:10px_10px] pointer-events-none" />
                        
                        {/* Sweeper Scanning line */}
                        <div 
                          className="absolute left-0 w-full h-[2px] bg-green-500/50 shadow-[0_0_8px_#10b981] z-20 pointer-events-none" 
                          style={{ 
                            animation: "scanVertical 4s ease-in-out infinite"
                          }} 
                        />

                        {/* Moving pixel noise overlay */}
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.73)_100%)] z-10 pointer-events-none" />
                        
                        {/* Dynamic green camera HUD */}
                        <div className="absolute inset-0 flex flex-col justify-between p-2.5 z-10 font-mono text-[7px] text-green-400 font-bold pointer-events-none">
                          <div className="flex justify-between items-start">
                            <div className="flex flex-col gap-0.5">
                              <span>CAM_REF // MULTI-PORTAL</span>
                              <span className="text-[#0099cc]">STATUS: ACTIVE (PRIVACY-PROXY)</span>
                            </div>
                            <div className="text-right">
                              <span>FPS: 25.0</span>
                              <span className="block text-amber-500 animate-pulse">● CRYPTO-PROXY</span>
                            </div>
                          </div>

                          {/* Target Reticle Crosshairs */}
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="relative w-12 h-12 border border-green-500/20 rounded-full flex items-center justify-center">
                              <div className="absolute w-3.5 h-[1px] bg-green-400/40" />
                              <div className="absolute h-3.5 w-[1px] bg-green-400/40" />
                              <span className="absolute -bottom-4 text-[5px] text-green-400/60 tracking-wider font-mono">LOCK CONNET-01</span>
                            </div>
                          </div>

                          <div className="flex justify-between items-end">
                            <div>
                              <span>AZ: {hudTargetHeading}°</span>
                              <span className="block">EL: {hudAzimuth}°</span>
                            </div>
                            <div className="text-right flex flex-col items-end">
                              <span>STREAM SECURITY ON</span>
                              <span className="block text-[#0099cc] uppercase">Milcon Direct v18</span>
                            </div>
                          </div>
                        </div>

                        {/* Elegant green-scaled Commander avatar profile image */}
                        <div className="w-full h-full flex items-center justify-center opacity-65 filter hue-rotate-60 brightness-90 contrast-125 select-none relative z-0">
                          <img
                            src="https://i.postimg.cc/VN8W5R7r/ECOMIG-LOGO.png"
                            alt="ECOMIG Command Emblem"
                            className="w-full h-full object-contain p-6 scale-105"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#00170a]">
                      <div className="w-14 h-14 bg-[#00853F]/10 border border-green-500/30 rounded-full flex items-center justify-center mb-2 animate-pulse">
                        <Shield className="text-[#0099cc]" size={26} />
                      </div>
                      <span className="text-[9px] font-black text-[#0099cc] tracking-widest uppercase text-center px-4">
                        CRYPT_CAM MASKED
                      </span>
                    </div>
                  )}

                  {/* Top-layer badges */}
                  <div className="relative z-10 p-2 flex justify-between items-start pointer-events-none">
                    <span className="bg-[#0099cc] text-white text-[8px] font-black tracking-widest px-2 py-0.5 rounded uppercase shadow-md flex items-center gap-1">
                      <Camera size={10} /> LOCAL (YOU)
                    </span>
                    <div className="flex gap-1">
                      {!micOn && (
                        <span className="bg-red-600/90 text-white text-[8px] font-black p-1 rounded">
                          <MicOff size={10} />
                        </span>
                      )}
                      {!camOn && (
                        <span className="bg-red-600/90 text-white text-[8px] font-black p-1 rounded">
                          <VideoOff size={10} />
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Bottom-layer info overlays */}
                  <div className="relative z-10 p-2 bg-gradient-to-t from-black/85 to-transparent flex justify-between items-end">
                    <div>
                      <h4 className="text-[10px] font-black tracking-wide">COMMAND TERMINAL</h4>
                      <p className="text-[8px] text-[#0099cc] font-mono">ECOWAS MHQ SUITE</p>
                    </div>
                    <span className="text-[8px] text-green-400 font-mono">1085kbps</span>
                  </div>
                </div>

                {/* Satellite Connected Participants */}
                {participants
                  .filter((p) => p.status !== "disconnected")
                  .map((p) => (
                    <div
                      key={p.id}
                      className={`relative bg-black border-2 rounded overflow-hidden aspect-video flex flex-col justify-between transition-all shadow-xl group ${
                        p.isSpeaking ? "border-green-400 ring-2 ring-green-400/30" : "border-gray-800"
                      }`}
                    >
                      {/* Avatar picture or simulated loop */}
                      {p.status === "connecting" ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80">
                          <div className="w-8 h-8 border-2 border-t-green-400 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mb-2" />
                          <span className="text-[8px] font-mono text-green-400 uppercase tracking-widest">
                            Sat Link-Up...
                          </span>
                        </div>
                      ) : p.camActive ? (
                        <div className="absolute inset-0 group">
                          <img
                            src={p.avatar}
                            alt={p.name}
                            className="w-full h-full object-cover filter brightness-95 group-hover:scale-105 transition-all"
                            referrerPolicy="no-referrer"
                          />
                          {/* Animated filter lines */}
                          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#002e15]/20 pointer-events-none" />
                          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] pointer-events-none" />
                        </div>
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950">
                          <div className="w-12 h-12 bg-zinc-900 border border-zinc-700 rounded-full flex items-center justify-center mb-1">
                            <Users className="text-gray-500" size={20} />
                          </div>
                          <span className="text-[8px] text-gray-500 font-bold uppercase tracking-widest">
                            CAMERA OFF
                          </span>
                        </div>
                      )}

                      {/* Header overlay for attendee status */}
                      <div className="relative z-10 p-2 flex justify-between items-start pointer-events-none">
                        <span className="bg-black/75 text-white text-[8px] font-black tracking-widest px-2 py-0.5 rounded uppercase flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping" />
                          {p.rank} {p.name.split(" ")[0]}
                        </span>

                        <div className="flex gap-1">
                          {!p.micActive && (
                            <span className="bg-red-600/90 text-white text-[8px] font-black p-1 rounded">
                              <MicOff size={10} />
                            </span>
                          )}
                          {!p.camActive && (
                            <span className="bg-red-600/90 text-white text-[8px] font-black p-1 rounded">
                              <VideoOff size={10} />
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Custom Audio bouncing wavelength when speaking */}
                      {p.isSpeaking && p.micActive && (
                        <div className="absolute bottom-10 left-3 flex gap-0.5 items-end h-4 pointer-events-none bg-black/80 px-1.5 py-0.5 rounded">
                          <span className="w-0.5 h-2 bg-green-400 rounded-full animate-[bounce_0.6s_infinite]" />
                          <span className="w-0.5 h-3.5 bg-green-400 rounded-full animate-[bounce_0.4s_infinite_0.1s]" />
                          <span className="w-0.5 h-1.5 bg-green-400 rounded-full animate-[bounce_0.8s_infinite_0.2s]" />
                          <span className="w-0.5 h-3 bg-green-400 rounded-full animate-[bounce_0.5s_infinite_0.3s]" />
                        </div>
                      )}

                      {/* Bottom informational metrics overlay */}
                      <div className="relative z-10 p-2 bg-gradient-to-t from-black/85 to-transparent flex justify-between items-end">
                        <div>
                          <h4 className="text-[9px] font-bold text-gray-300 uppercase leading-tight">
                            {p.appointment}
                          </h4>
                          <p className="text-[8px] text-green-400 font-mono tracking-widest">
                            {p.country}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[7px] text-gray-400 font-mono">
                            SIG: {p.signal * 20}%
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}

                {/* Inactive offline grid placeholders */}
                {participants
                  .filter((p) => p.status === "disconnected")
                  .map((p) => (
                    <div
                      key={p.id}
                      className="bg-[#00170a]/60 border border-dashed border-gray-800 rounded p-4 flex flex-col items-center justify-center text-center opacity-40 group hover:opacity-65 transition-all aspect-video relative"
                    >
                      <PhoneOff className="text-red-500 mb-2" size={18} />
                      <h4 className="text-[10px] font-black text-gray-300 uppercase">
                        {p.rank} {p.name.split(" ")[0]}
                      </h4>
                      <p className="text-[8px] text-[#0099cc] font-mono mt-0.5">{p.appointment}</p>
                      <button
                        onClick={() => {
                          setParticipants((prev) =>
                            prev.map((item) =>
                              item.id === p.id ? { ...item, status: "connecting" } : item
                            )
                          );
                          addConsoleLog(`SATCOM: FORCE DIAL SIGNAL SENT TO ${p.name}`);
                        }}
                        className="mt-3 bg-white/10 text-white font-mono text-[8px] px-2.5 py-1 rounded hover:bg-white/20 transition-all uppercase"
                      >
                        DIAL SIGNAL
                      </button>
                    </div>
                  ))}
              </div>

              {/* Hardware & Session control bar */}
              <div className="bg-black/60 border-2 border-gray-800 p-4 rounded-lg flex flex-wrap items-center justify-between gap-4">
                {/* Audio controls */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setMicOn(!micOn)}
                    className={`p-3 rounded-lg font-bold text-xs transition-all ${
                      micOn
                        ? "bg-[#00853F] hover:bg-green-600 text-white"
                        : "bg-red-600 hover:bg-red-700 text-white"
                    }`}
                    title={micOn ? "Mute Microphone" : "Unmute Microphone"}
                  >
                    {micOn ? <Mic size={18} /> : <MicOff size={18} />}
                  </button>

                  <button
                    onClick={() => setCamOn(!camOn)}
                    className={`p-3 rounded-lg font-bold text-xs transition-all ${
                      camOn
                        ? "bg-[#00853F] hover:bg-green-600 text-white"
                        : "bg-red-600 hover:bg-red-700 text-white"
                    }`}
                    title={camOn ? "Stop Web Cam" : "Start Web Cam"}
                  >
                    {camOn ? <Video size={18} /> : <VideoOff size={18} />}
                  </button>

                  <button
                    onClick={() => setAudioMuted(!audioMuted)}
                    className={`p-3 rounded-lg font-bold text-xs transition-all bg-black/40 text-gray-300 hover:text-white border border-gray-700 hover:border-gray-500`}
                    title={audioMuted ? "Enable Sound" : "Mute Sound"}
                  >
                    {audioMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                  </button>
                </div>

                {/* Core operational switches */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setScreenSharing(!screenSharing);
                      addConsoleLog(
                        `MEDIA: SCREEN SHARING ${!screenSharing ? "ACTIVATED" : "DEACTIVATED"}.`
                      );
                    }}
                    className={`px-4 py-2.5 bg-black/40 border-[2px] rounded text-[10px] font-black tracking-widest uppercase transition-all flex items-center gap-2 ${
                      screenSharing
                        ? "text-[#0099cc] border-[#0099cc] bg-[#0099cc]/10"
                        : "text-gray-300 border-gray-700"
                    }`}
                  >
                    <Monitor size={14} />{" "}
                    {screenSharing ? "SHARING MONITOR" : "SHARE TACTICAL MAP"}
                  </button>

                  <button
                    onClick={() => setIsChatOpen(!isChatOpen)}
                    className={`px-4 py-2.5 bg-black/40 border-[2px] rounded text-[10px] font-black tracking-widest uppercase transition-all flex items-center gap-2 ${
                      isChatOpen
                        ? "text-green-400 border-[#00a651] bg-green-950/20"
                        : "text-gray-300 border-gray-700"
                    }`}
                  >
                    <MessageSquare size={14} /> CHAT BRIEF ({chatMessages.length})
                  </button>
                </div>

                {/* red escape leave phone button */}
                <button
                  onClick={() => {
                    setIsInCall(false);
                    setSelectedRoom(null);
                    // clear user media if active
                    if (mediaStreamRef.current) {
                      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
                      mediaStreamRef.current = null;
                    }
                    addConsoleLog("SATCOM: DISCONNECTED FROM BRIDGE SATELLITE CORE.");
                  }}
                  className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white border-b-4 border-r-4 border-red-900 rounded font-black text-[10px] tracking-widest uppercase transition-all flex items-center gap-2"
                >
                  <PhoneOff size={14} /> DISCONNECT SIGNAL
                </button>
              </div>

              {/* Share screen status overlay */}
              {screenSharing && (
                <div className="bg-[#002b11] border-2 border-[#0099cc] p-4 rounded text-xs leading-relaxed flex flex-col sm:flex-row items-center justify-between gap-4 select-none">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#0099cc]/20 rounded-full animate-pulse">
                      <Activity className="text-[#0099cc]" size={16} />
                    </div>
                    <div>
                      <p className="font-bold text-[#0099cc] uppercase tracking-wider text-[10px]">
                        Tactical Map Stream Output Enabled
                      </p>
                      <p className="text-[10px] text-gray-400 font-mono mt-0.5">
                        AES-256 Multi-cast stream active, resolution 1080p, relay compression 18:1
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setScreenSharing(false)}
                    className="p-1 px-3 border border-red-500 hover:bg-red-500/10 text-red-500 uppercase font-mono text-[9px] font-bold rounded"
                  >
                    STOP FEED
                  </button>
                </div>
              )}
            </div>

            {/* Right Side Cryptographic Messaging HUD inside call */}
            {isChatOpen && (
              <div className="xl:col-span-4 bg-black/40 border-2 border-gray-800 p-4 rounded-lg flex flex-col justify-between h-[510px]">
                {/* Chat header */}
                <div>
                  <div className="flex items-center justify-between border-b border-gray-800 pb-3 mb-4">
                    <span className="text-[10px] font-black text-[#0099cc] tracking-widest uppercase flex items-center gap-1.5">
                      <Lock size={12} className="text-[#0099cc]" /> SECURE CHAT CHANNEL
                    </span>
                    <span className="text-[9px] font-mono text-gray-400">AES-GCM-256</span>
                  </div>

                  {/* Message Container streams */}
                  <div className="space-y-3 h-[320px] overflow-y-auto pr-1 select-text custom-scrollbar">
                    {chatMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`p-2.5 rounded text-xs ${
                          msg.isSystem
                            ? "bg-[#002e15]/40 border-l-4 border-amber-500 text-amber-300 font-mono text-[9px] leading-normal"
                            : "bg-black/30 text-white"
                        }`}
                      >
                        {!msg.isSystem && (
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-mono text-[9px] text-[#0099cc] font-black">
                              [{msg.rank}] {msg.sender.split(" ")[0]}
                            </span>
                            <span className="text-[8px] text-gray-400 font-mono font-medium">
                              {msg.time}
                            </span>
                          </div>
                        )}
                        <p className={`leading-relaxed ${msg.isSystem ? "" : "font-bold text-gray-200"}`}>
                          {msg.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Chat input block & local command line */}
                <div className="space-y-2 mt-4">
                  {/* Console Command Input */}
                  <form
                    onSubmit={handleLocalCommandSubmit}
                    className="flex bg-black/60 rounded border border-gray-800 focus-within:border-green-500 overflow-hidden"
                  >
                    <span className="bg-zinc-900 border-r border-gray-800 text-[10px] font-mono font-black text-gray-500 flex items-center px-2.5 select-none text-center">
                      SEC-CLI
                    </span>
                    <input
                      type="text"
                      value={jocCommandInput}
                      onChange={(e) => setJocCommandInput(e.target.value)}
                      placeholder="Type command... (e.g. CLEAR / MUTE ALL)"
                      className="flex-grow bg-transparent text-[10px] text-green-400 font-mono p-2 outline-none font-bold"
                    />
                    <button type="submit" className="hidden" />
                  </form>

                  {/* Standard Chat Input */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={currentMessage}
                      onChange={(e) => setCurrentMessage(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                      placeholder="SEND CRYP-MSG..."
                      className="flex-grow bg-black/60 border-2 border-gray-750 focus:border-[#00853F] px-3.5 py-2.5 text-xs text-white outline-none rounded font-bold"
                    />
                    <button
                      onClick={handleSendMessage}
                      className="px-4 bg-[#00853F] hover:bg-green-600 rounded text-white font-bold transition-all flex items-center justify-center cursor-pointer"
                    >
                      <Send size={14} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dynamic Handshake / Dialing Satcom Overlay */}
      <AnimatePresence>
        {dialingDept && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/95 z-55 flex flex-col items-center justify-center p-6 backdrop-blur-md select-none"
          >
            <div className="max-w-md w-full bg-[#001407]/95 border-2 border-cyan-500 rounded-lg p-6 shadow-[0_0_40px_rgba(6,182,212,0.15)] relative overflow-hidden text-center">
              {/* Radar Sweeper grid */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(0,250,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,250,0,0.02)_1px,transparent_1px)] bg-[size:12px_12px] opacity-40 pointer-events-none" />
              
              <div className="relative z-10 space-y-5">
                {/* Warning / encrypted badge */}
                <div className="inline-flex items-center gap-1.5 bg-cyan-950/85 text-cyan-400 text-[9px] font-mono px-3 py-1 rounded border border-cyan-800 uppercase tracking-widest mx-auto">
                  <Shield size={12} className="animate-pulse" /> OUTBOUND ENCRYPTED COM LINK
                </div>

                {/* Pulsing ring animation */}
                <div className="flex justify-center my-6 relative">
                  <div className="w-24 h-24 rounded-full border-4 border-cyan-500/10 flex items-center justify-center relative">
                    <div className="absolute inset-0 rounded-full border border-cyan-500 animate-[ping_1.8s_infinite] opacity-60" />
                    <div className="absolute inset-2 rounded-full border border-emerald-400 animate-[ping_2.4s_infinite] opacity-40" />
                    <Phone className="text-cyan-400 animate-bounce" size={32} />
                  </div>
                </div>

                {/* Dial metadata */}
                <div className="space-y-1">
                  <p className="text-[10px] text-gray-400 font-mono tracking-widest uppercase">
                    ESTABLISHING SATCOM TRUNK
                  </p>
                  <h3 className="text-lg font-black font-sans text-white uppercase tracking-tight">
                    {dialingDept.name}
                  </h3>
                  <p className="text-xs text-cyan-400 font-mono font-bold">
                    TACTICAL PORTAL DIAL: <span className="underline">{dialingDept.num}</span>
                  </p>
                </div>

                {/* Signal parameters info bar */}
                <div className="bg-black/60 p-3 rounded border border-cyan-500/20 grid grid-cols-2 gap-2 text-[8px] font-mono text-gray-400 text-left">
                  <div>
                    <span className="text-gray-500">CALL-SIGN:</span> <span className="text-white font-bold">{dialingDept.callsign}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">TRANSPONDER:</span> <span className="text-white font-bold">{dialingDept.freq}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">BANDWIDTH:</span> <span className="text-emerald-400 font-bold">AES-256 GCM</span>
                  </div>
                  <div>
                    <span className="text-gray-500">CONNECT TYPE:</span> <span className="text-emerald-400 font-bold">MILCON DIRECT</span>
                  </div>
                </div>

                {/* Synchronizing Progress bar */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-[8px] font-mono">
                    <span className="text-[#0099cc] font-black animate-pulse">CRYPTOGRAPHIC NEGOTIATION...</span>
                    <span className="text-cyan-400 font-bold">{dialProgress}%</span>
                  </div>
                  <div className="w-full bg-zinc-900 rounded-full h-1.5 overflow-hidden border border-cyan-500/15">
                    <motion.div
                      className="bg-gradient-to-r from-[#0099cc] to-green-400 h-full rounded-full"
                      initial={{ width: "0%" }}
                      animate={{ width: `${dialProgress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>

                {/* Abortion Switch */}
                <button
                  type="button"
                  onClick={() => {
                    setDialingDept(null);
                    addConsoleLog("SATCOM: TACTICAL SPEED-DIAL ABORTED BY OPERATIONS");
                  }}
                  className="px-5 py-2 hover:bg-red-950/60 text-red-400 hover:text-white border border-red-500/30 hover:border-red-500 rounded text-[9px] font-black tracking-widest uppercase transition-all mt-4 inline-flex items-center gap-1 cursor-pointer"
                >
                  <PhoneOff size={10} /> ABORT SIGNAL
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
