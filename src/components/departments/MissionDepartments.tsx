import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, User, Globe, Briefcase, ImageIcon } from "lucide-react";
import { BrandHeader } from "../common/BrandHeader";

interface DepartmentHead {
  id: string;
  name: string;
  rank: string;
  appointment: string;
  dateFrom: string;
  dateTo: string;
  country: string;
  imageUrl?: string;
  position: number;
}

const initialDepartments: DepartmentHead[] = [
  {
    id: "dept-mhq",
    name: "MISSION HEADQUARTERS CODE-RED",
    rank: "HQ",
    appointment: "MHQ",
    dateFrom: "2024",
    dateTo: "2026",
    country: "ECOWAS",
    imageUrl: "https://i.postimg.cc/VN8W5R7r/ECOMIG-LOGO.png",
    position: 1,
  },
  {
    id: "dept-fhq",
    name: "FORCE HEADQUARTERS DIVISION",
    rank: "HQ",
    appointment: "FHQ",
    dateFrom: "2024",
    dateTo: "2026",
    country: "ECOWAS",
    imageUrl: "https://i.postimg.cc/VN8W5R7r/ECOMIG-LOGO.png",
    position: 2,
  },
  {
    id: "dept-dfc",
    name: "COLONEL OKENIYI [DEPUTY FORCE COMMANDER]",
    rank: "COLONEL",
    appointment: "DFC",
    dateFrom: "2024",
    dateTo: "2026",
    country: "NIGERIA",
    imageUrl: "https://i.postimg.cc/vTpwnBSM/okeniyi-jpg-png-Copy.jpg",
    position: 3,
  },
  {
    id: "dept-j1",
    name: "MAJ SARR (ADMIN & PERSONNEL)",
    rank: "MAJ",
    appointment: "J1",
    dateFrom: "2024",
    dateTo: "2026",
    country: "SENEGAL",
    imageUrl: "https://i.postimg.cc/sft27DWG/staff-jpg-Copy.png",
    position: 4,
  },
  {
    id: "dept-j2",
    name: "MAJ DIOP (MILITARY INTELLIGENCE)",
    rank: "MAJ",
    appointment: "J2",
    dateFrom: "2024",
    dateTo: "2026",
    country: "SENEGAL",
    imageUrl: "https://i.postimg.cc/sft27DWG/staff-jpg-Copy.png",
    position: 5,
  },
  {
    id: "dept-j3",
    name: "COL OKENIYI (OPERATIONS & PLANS)",
    rank: "COLONEL",
    appointment: "J3",
    dateFrom: "2024",
    dateTo: "2026",
    country: "NIGERIA",
    imageUrl: "https://i.postimg.cc/vTpwnBSM/okeniyi-jpg-png-Copy.jpg",
    position: 6,
  },
  {
    id: "dept-j6",
    name: "MAJ J BARROW (COMM & SIGNALS)",
    rank: "MAJ",
    appointment: "J6",
    dateFrom: "2024",
    dateTo: "2026",
    country: "GHANA",
    imageUrl: "https://i.postimg.cc/sft27DWG/staff-jpg-Copy.png",
    position: 7,
  },
  {
    id: "dept-j7",
    name: "MAJ EXERCISES & TRAINING",
    rank: "MAJ",
    appointment: "J7",
    dateFrom: "2024",
    dateTo: "2026",
    country: "SIERRA LEONE",
    imageUrl: "https://i.postimg.cc/sft27DWG/staff-jpg-Copy.png",
    position: 8,
  },
  {
    id: "dept-pm",
    name: "MAJ JATTA (PROVOST MARSHAL)",
    rank: "MAJ",
    appointment: "PM",
    dateFrom: "2024",
    dateTo: "2026",
    country: "SIERRA LEONE",
    imageUrl: "https://i.postimg.cc/sft27DWG/staff-jpg-Copy.png",
    position: 9,
  },
  {
    id: "dept-pio",
    name: "CAPT MENSAH (PUBLIC INFO)",
    rank: "CAPT",
    appointment: "PIO",
    dateFrom: "2024",
    dateTo: "2026",
    country: "GHANA",
    imageUrl: "https://i.postimg.cc/sft27DWG/staff-jpg-Copy.png",
    position: 10,
  },
  {
    id: "dept-procoy",
    name: "PROVO COMPANY SECURITY HQ",
    rank: "COY",
    appointment: "PROCOY",
    dateFrom: "2024",
    dateTo: "2026",
    country: "ECOWAS",
    imageUrl: "https://i.postimg.cc/sft27DWG/staff-jpg-Copy.png",
    position: 11,
  },
  {
    id: "dept-pa",
    name: "PERSONAL ASSISTANT TO HOM/FC",
    rank: "CAPT",
    appointment: "PA",
    dateFrom: "2024",
    dateTo: "2026",
    country: "ECOWAS",
    imageUrl: "https://i.postimg.cc/sft27DWG/staff-jpg-Copy.png",
    position: 12,
  },
  {
    id: "dept-cc",
    name: "CONTINGENT COMMAND CELL",
    rank: "HQ",
    appointment: "CC",
    dateFrom: "2024",
    dateTo: "2026",
    country: "ECOWAS",
    imageUrl: "https://i.postimg.cc/sft27DWG/staff-jpg-Copy.png",
    position: 13,
  },
  {
    id: "dept-comm",
    name: "COMMUNICATIONS CORPS",
    rank: "UNIT",
    appointment: "COMM",
    dateFrom: "2024",
    dateTo: "2026",
    country: "ECOWAS",
    imageUrl: "https://i.postimg.cc/sft27DWG/staff-jpg-Copy.png",
    position: 14,
  },
  {
    id: "dept-senbat",
    name: "SENEGALESE BATTALION [SENBAT]",
    rank: "BATTALION",
    appointment: "SENBAT",
    dateFrom: "2024",
    dateTo: "2026",
    country: "SENEGAL",
    imageUrl: "https://i.postimg.cc/KYNN3HsZ/senbat-jpg.png",
    position: 15,
  },
  {
    id: "dept-nigcoy",
    name: "NIGERIAN COMPANY [NIGCOY]",
    rank: "COMPANY",
    appointment: "NIGCOY",
    dateFrom: "2024",
    dateTo: "2026",
    country: "NIGERIA",
    imageUrl: "https://i.postimg.cc/7Z9Z7Z9Z/nigcoy.jpg",
    position: 16,
  },
  {
    id: "dept-ghancoy",
    name: "GHANAIAN COMPANY [GHANCOY]",
    rank: "COMPANY",
    appointment: "GHANCOY",
    dateFrom: "2024",
    dateTo: "2026",
    country: "GHANA",
    imageUrl: "https://i.postimg.cc/SNkxD1gB/ghancoyc-jpg.png",
    position: 17,
  },
  {
    id: "dept-senfpu",
    name: "SENEGALESE FORMED POLICE UNIT",
    rank: "FPU",
    appointment: "SENFPU",
    dateFrom: "2024",
    dateTo: "2026",
    country: "SENEGAL",
    imageUrl: "https://i.postimg.cc/fRT6bMBj/senfpu.jpg",
    position: 18,
  },
];

const DepartmentCard: React.FC<DepartmentHead> = ({
  name,
  rank,
  appointment,
  country,
  imageUrl,
  position,
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    whileHover={{ scale: 1.02 }}
    className="flex flex-col items-center gap-3 w-full backdrop-blur-md bg-white border-[3px] border-[#0099cc] p-4 rounded-xl shadow-lg hover:shadow-2xl transition-all"
  >
    {appointment && (
      <div className="bg-[#004d24] border-[2px] border-[#0099cc] px-4 py-2 rounded-xl shadow-md min-w-[180px] flex items-center justify-center whitespace-nowrap">
        <span className="text-white font-black text-[9px] uppercase tracking-widest">
          {appointment}
        </span>
      </div>
    )}
    <div className="group relative w-full max-w-[150px]">
      <div className="relative p-0.5 bg-white border-[4px] border-[#3d5a2b] shadow-md overflow-hidden aspect-[4/5] rounded">
        <div className="w-full h-full relative overflow-hidden bg-gray-100 border border-black/10">
          <img
            src={imageUrl || "https://i.postimg.cc/sft27DWG/staff-jpg-Copy.png"}
            alt={name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>
      </div>
    </div>
    <div className="text-center min-h-[44px] flex flex-col justify-start">
      <h3 className="text-base font-black text-[#1a2c4e] uppercase leading-tight">
        {rank} {name}
      </h3>
      <p className="text-[#00853F] font-bold text-[9px] tracking-wider uppercase mt-1">
        {country} • POS {position}
      </p>
    </div>
  </motion.div>
);

export const MissionDepartments: React.FC = () => {
  const [departments, setDepartments] = useState<DepartmentHead[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("ecomig_departments");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.length < 18) {
          localStorage.setItem("ecomig_departments", JSON.stringify(initialDepartments));
          setDepartments(initialDepartments);
        } else {
          parsed.sort((a: any, b: any) => (a.position || 1) - (b.position || 1));
          setDepartments(parsed);
        }
      } catch (e) {
        setDepartments(initialDepartments);
      }
    } else {
      localStorage.setItem("ecomig_departments", JSON.stringify(initialDepartments));
      setDepartments(initialDepartments);
    }
  }, []);

  return (
    <div className="p-1 sm:p-4 md:p-8 max-w-7xl mx-auto animate-fade-in w-full">
      {/* Outer Military Bevel Frame - White/Grey 3D effect */}
      <div className="relative bg-[#f3f4f6] p-[2px] shadow-[0_40px_80px_rgba(0,0,0,0.3)] border-t-[8px] border-l-[8px] sm:border-t-[30px] sm:border-l-[30px] border-white border-b-[8px] border-r-[8px] sm:border-b-[30px] sm:border-r-[30px] border-gray-400">
        {/* Inner shadow/bevel line */}
        <div className="absolute inset-0 border-[2px] border-gray-500/20 pointer-events-none" />

        {/* Main Board Content Area */}
        <div className="relative bg-white border-[3px] border-[#0099cc] p-3 sm:p-6 md:p-12 min-h-[900px] flex flex-col items-center">
          <div className="w-full bg-[#004d24] mb-6 p-4 border-b-4 border-r-4 border-black/20 rounded-lg flex items-center">
            <BrandHeader
              title="DEPARTMENTS"
              subtitle="MHQ-01 SPECIALIST COMMAND"
            />
          </div>

          {/* Main Title Header */}
          <div className="mb-8 mt-2">
            <div className="bg-[#006400] border-[4px] border-[#0099cc] px-6 md:px-16 py-3 rounded-xl shadow-[0_10px_20px_rgba(0,0,0,0.3)]">
              <h2 className="text-xl md:text-3xl font-black text-white tracking-[0.02em] uppercase text-center drop-shadow-lg font-sans">
                MISSION <span className="text-white">DEPARTMENTS</span>
              </h2>
            </div>
          </div>

          {/* Departments Grid */}
          {departments.length === 0 ? (
            <div className="p-16 text-center border-2 border-dashed border-gray-200 rounded-xl text-gray-400 font-bold uppercase w-full">
              No matching department records found.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 w-full max-w-7xl mb-16">
              {departments.map((dept, index) => (
                <DepartmentCard key={dept.id || index} {...dept} />
              ))}
            </div>
          )}

          {/* Tactical Bottom Footer */}
          <div className="mt-auto w-full pt-12 flex flex-col items-center opacity-30">
            <div className="h-1 w-64 bg-[#3d5a2b] mb-4" />
            <div className="flex gap-2 items-center">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
              <span className="text-[9px] font-mono font-bold tracking-widest uppercase">
                MHQ TACTICAL SECTIONS DIRECTORY SYNCHRONIZED
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
