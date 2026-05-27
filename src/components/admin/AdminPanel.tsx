import React, { useState, useRef, useEffect } from "react";
import {
  LayoutDashboard,
  Save,
  X,
  RotateCcw,
  AlertCircle,
  CheckCircle2,
  FileText,
  Image as ImageIcon,
  Link,
  Upload,
  Globe,
  RefreshCcw,
  LayoutGrid,
  Users,
  Plus,
  Trash2,
  Edit,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { NavItem } from "../../types";

interface AdminPanelProps {
  navItems: NavItem[];
  onUpdateNav: (newNav: NavItem[]) => void;
}

const initialLeadership = [
  {
    id: "leader-1",
    name: "MIATTA LILY FRENCH",
    rank: "HE",
    appointment: "HEAD OF MISSION",
    dateFrom: "2024-01-01",
    dateTo: "2026-12-31",
    country: "SENEGAL",
    imageUrl: "https://i.postimg.cc/nVTsmtkD/miatta-jpg.jpg",
    position: 1,
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
    position: 2,
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
    position: 3,
  },
];

const initialChronicle = [
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
    position: 1,
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
    position: 2,
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
    position: 3,
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
    position: 4,
  },
];

const initialDepartments = [
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

export const AdminPanel: React.FC<AdminPanelProps> = ({
  navItems,
  onUpdateNav,
}) => {
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [content, setContent] = useState<string>("");
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [fileType, setFileType] = useState<"text" | "image" | "json">("text");
  const [selectedUnit, setSelectedUnit] = useState<string>("MHQ");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeSubView, setActiveSubView] = useState<"list" | "form">("list");
  const [leadershipList, setLeadershipList] = useState<any[]>([]);
  const [chronicleList, setChronicleList] = useState<any[]>([]);
  const [departmentList, setDepartmentList] = useState<any[]>([]);
  const [eventsList, setEventsList] = useState<any[]>([]);
  const [galleryList, setGalleryList] = useState<any[]>([]);
  const [galleryFormFields, setGalleryFormFields] = useState({
    id: "",
    unitId: "mhq",
    title: "",
    eventType: "Medal Parade",
    date: "",
    time: "",
    location: "",
    description: "",
    status: "Confirmed",
    imageUrl: "",
    files: [] as Array<{ name: string; size: string; type: string; base64?: string }>
  });
  const [formFields, setFormFields] = useState({
    id: "",
    name: "",
    rank: "COLONEL",
    appointment: "FORCE COMMANDER",
    dateFrom: "",
    dateTo: "",
    country: "SENEGAL",
    unit: "SENBAT",
    imageUrl: "",
    position: 1,
  });

  const [eventFormFields, setEventFormFields] = useState({
    id: "",
    unitId: "mhq",
    title: "",
    eventType: "Medal Parade",
    date: "",
    time: "",
    location: "",
    description: "",
    status: "Confirmed",
    imageUrl: "",
    files: [] as Array<{ name: string; size: string; type: string; base64?: string }>
  });
  const [isDragging, setIsDragging] = useState(false);
  const folderInputRef = useRef<HTMLInputElement>(null);
  const multipleFileInputRef = useRef<HTMLInputElement>(null);

  const appointments = [
    "HEAD OF MISSION",
    "FORCE COMMANDER",
    "DEPUTY FORCE COMMANDER",
    "CONTINGENT COMMANDER",
  ];

  const ranks = ["HE", "COLONEL", "LT COL", "MAJ", "CAPT"];
  const countries = ["SENEGAL", "NIGERIA", "GHANA", "SIERRA LEONE"];

  useEffect(() => {
    // Seed leadership list
    const storedLeadership = localStorage.getItem("ecomig_leadership");
    if (storedLeadership) {
      setLeadershipList(JSON.parse(storedLeadership));
    } else {
      localStorage.setItem(
        "ecomig_leadership",
        JSON.stringify(initialLeadership),
      );
      setLeadershipList(initialLeadership);
    }

    // Seed chronicle list
    const storedChronicle = localStorage.getItem("ecomig_chronicle");
    if (storedChronicle) {
      setChronicleList(JSON.parse(storedChronicle));
    } else {
      localStorage.setItem(
        "ecomig_chronicle",
        JSON.stringify(initialChronicle),
      );
      setChronicleList(initialChronicle);
    }

    // Seed departments list
    const storedDepartments = localStorage.getItem("ecomig_departments");
    if (storedDepartments) {
      setDepartmentList(JSON.parse(storedDepartments));
    } else {
      localStorage.setItem(
        "ecomig_departments",
        JSON.stringify(initialDepartments),
      );
      setDepartmentList(initialDepartments);
    }

    // Seed events list
    const storedEvents = localStorage.getItem("ecomig_events");
    if (storedEvents) {
      setEventsList(JSON.parse(storedEvents));
    } else {
      const initialEvents = [
        { id: "e-mhq-1", unitId: "mhq", title: "Regional Security Council Briefing", date: "22 MAY 24", time: "0900Z", status: "Confirmed", location: "Banjul MHQ", description: "Strategic review of regional troop disposition and border controls.", image_url: "https://ais-v2-pre-j6ejmdcxtiu6sbfl6xp46t-168883427679.europe-west3.run.app/api/artifacts/8904719c-8594-44bf-a9ee-bd4900c4c4ea", files: [] },
        { id: "e-mhq-2", unitId: "mhq", title: "Strategic Command Meeting", date: "24 MAY 24", time: "1100Z", status: "Pending", location: "Banjul HQ Block B", description: "Command-level coordination and tactical operations mapping.", image_url: "", files: [] },
        { id: "e-mhq-3", unitId: "mhq", title: "International Press Conference", date: "26 MAY 24", time: "1400Z", status: "Scheduled", location: "Banjul HQ Media Room", description: "Press update on regional security initiatives.", image_url: "", files: [] },
        { id: "e-fhq-1", unitId: "fhq", title: "Force Readiness Inspection", date: "21 MAY 24", time: "0800Z", status: "Active", location: "Yundum Barracks", description: "Review of operational logistics and tactical readiness criteria.", image_url: "https://ais-v2-pre-j6ejmdcxtiu6sbfl6xp46t-168883427679.europe-west3.run.app/api/artifacts/a815a510-91fb-4a81-9b0d-b4f1797e87ab", files: [] },
        { id: "e-fhq-2", unitId: "fhq", title: "Logistic Support Coordination", date: "23 MAY 24", time: "1030Z", status: "Planning", location: "Yundum Command Center", description: "Coordination of division-level logistics and supply-chains.", image_url: "", files: [] },
        { id: "e-senbat-1", unitId: "senbat", title: "Border Patrol Operation X-Ray", date: "20 MAY 24", time: "0400Z", status: "In Progress", location: "Kanilai Border Outpost", description: "Joint boundary patrol maintaining security zone compliance.", image_url: "https://ais-v2-pre-j6ejmdcxtiu6sbfl6xp46t-168883427679.europe-west3.run.app/api/artifacts/0f40d85a-0f8f-4ed3-b68e-9dcc9165b699", files: [] },
        { id: "e-senbat-2", unitId: "senbat", title: "Village Outreach Kanilai", date: "25 MAY 24", time: "0900Z", status: "Confirmed", location: "Kanilai Community Center", description: "CIMIC support providing clean water and medical guidance to Kanilai local communities.", image_url: "", files: [] },
        { id: "e-nigcoy-1", unitId: "nigcoy", title: "Medical Outreach Fajara", date: "22 MAY 24", time: "1000Z", status: "Ready", location: "Fajara Medical Station", description: "Nigerian Contingent providing general health services and medical donations.", image_url: "https://ais-v2-pre-j6ejmdcxtiu6sbfl6xp46t-168883427679.europe-west3.run.app/api/artifacts/f3cc77f8-3e52-4467-8822-2630ce525ee8", files: [] },
        { id: "e-nigcoy-2", unitId: "nigcoy", title: "NIGCOY Medal Parade", date: "30 MAY 24", time: "1600Z", status: "Scheduled", location: "Fajara Parade Ground", description: "Honoring active personnel with ECOWAS integration medals.", image_url: "", files: [] },
        { id: "e-ghancoy-1", unitId: "ghancoy", title: "Joint Patrol with GPF", date: "21 MAY 24", time: "2000Z", status: "Ongoing", location: "Barra Sector", description: "Cooperative operations with the Gambia Police Force in the Barra estuary.", image_url: "", files: [] },
        { id: "e-ghancoy-2", unitId: "ghancoy", title: "GHANCOY Welfare Day", date: "28 MAY 24", time: "1300Z", status: "Confirmed", location: "Barra Base Camp", description: "Special welfare day celebrating regional cohesion and service excellence.", image_url: "", files: [] },
        { id: "e-senfpu-1", unitId: "senfpu", title: "Public Order Drills", date: "22 MAY 24", time: "0700Z", status: "Routine", location: "Banjul Training Yard", description: "Staff tactical maneuvers practicing crowd control and civil security maintenance.", image_url: "", files: [] },
        { id: "e-senfpu-2", unitId: "senfpu", title: "VIP Protection Training", date: "24 MAY 24", time: "0900Z", status: "Active", location: "Banjul HQ Annex", description: "Protective custody simulations for national and diplomat integration.", image_url: "", files: [] }
      ];
      localStorage.setItem("ecomig_events", JSON.stringify(initialEvents));
      setEventsList(initialEvents);
    }

    // Seed gallery list
    const storedGallery = localStorage.getItem("ecomig_gallery");
    if (storedGallery) {
      setGalleryList(JSON.parse(storedGallery));
    } else {
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
      setGalleryList(initialGallery);
    }
  }, []);

  const headings = [
    "HOME MESSAGE",
    "MISSION PROFILE",
    "COMMAND STRUCTURE",
    "CHRONICLE OF COMMAND",
    "GLOBAL NEWS",
    "ECOMIG TV BROADCAST",
    "DEPARTMENTS",
    "NEWS FEED",
    "ECOMIG EVENTS",
    "SPORTS SCORES",
    "GALLERY UPLOADS",
    "SECURE MAILBOX",
    "NAV MENU BARS",
    "MISSION DOCUMENTS",
  ];

  const units = ["MHQ", "FHQ", "SENBAT", "NIGCOY", "GHANCOY", "SENFPU"];

  const getUnitContent = (unit: string) => {
    return JSON.stringify(
      [
        {
          id: `${unit.toLowerCase()}-e1`,
          title: `${unit} Operational Briefing`,
          date: "21 MAY 24",
          time: "0900Z",
        },
        {
          id: `${unit.toLowerCase()}-e2`,
          title: `${unit} CIMIC Outreach`,
          date: "25 MAY 24",
          time: "1100Z",
        },
        {
          id: `${unit.toLowerCase()}-e3`,
          title: `${unit} Welfare Activity`,
          date: "01 JUN 24",
          time: "1400Z",
        },
      ],
      null,
      2,
    );
  };

  const handleUpdateClick = (heading: string) => {
    setEditingItem(heading);
    setStatus("idle");
    setActiveSubView("list");

    if (heading === "NAV MENU BARS") {
      setContent(JSON.stringify(navItems, null, 2));
      setFileType("json");
    } else if (heading === "ECOMIG EVENTS") {
      setContent(getUnitContent(selectedUnit));
      setFileType("json");
    } else if (heading === "GLOBAL NEWS") {
      setContent(
        JSON.stringify(
          [
            {
              id: "bbc",
              name: "BBC WORLD NEWS",
              url: "https://www.bbc.com/news/world/africa",
            },
            {
              id: "aljazeera",
              name: "AL JAZEERA AFRICA",
              url: "https://www.aljazeera.com/africa/",
            },
            {
              id: "reuters",
              name: "REUTERS AFRICA",
              url: "https://www.reuters.com/world/africa/",
            },
          ],
          null,
          2,
        ),
      );
      setFileType("json");
    } else if (heading === "MISSION PROFILE") {
      setContent(
        `### MISSION MISSION STATEMENT\nECOMIG remains committed to the stability of The Gambia through professional security sector support and regional cooperation.\n\n### KEY OBJECTIVES\n1. Maintain Constitutional Order\n2. Protect Civil Society\n3. Regional Security Integration`,
      );
      setFileType("text");
    } else if (heading === "GALLERY UPLOADS") {
      setContent(getUnitContent(selectedUnit));
      setFileType("json");
    } else if (heading === "MISSION DOCUMENTS") {
      setContent(
        "// DOCUMENT REPOSITORY ACCESS GRANTED\n// SECURE ARCHIVE READY",
      );
      setFileType("text");
    } else if (
      heading === "CHRONICLE OF COMMAND" ||
      heading === "COMMAND STRUCTURE" ||
      heading === "DEPARTMENTS"
    ) {
      setFileType("json");
      setFormFields({
        id: "",
        name: "",
        rank: "COLONEL",
        appointment:
          heading === "COMMAND STRUCTURE"
            ? "HEAD OF MISSION"
            : heading === "DEPARTMENTS"
              ? "MHQ"
              : "CONTINGENT COMMANDER",
        dateFrom: "",
        dateTo: "",
        country: "SENEGAL",
        unit: "SENBAT",
        imageUrl: "",
        position: 1,
      });
    } else {
      setContent(
        `// INITIALIZING SECURE BUFFER FOR: ${heading}\n// LOADING CURRENT PARAMETERS...\n\n[AUTHORITY_LEVEL_5_GRANTED]\n\nEnter update content here...`,
      );
      setFileType("text");
    }
  };

  const handleUnitChange = (unit: string) => {
    setSelectedUnit(unit);
    if (editingItem === "ECOMIG EVENTS" || editingItem === "GALLERY UPLOADS") {
      setContent(getUnitContent(unit));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormFields((prev) => ({
          ...prev,
          imageUrl: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveForm = () => {
    setStatus("saving");
    const isDossier = editingItem === "COMMAND STRUCTURE";
    const isDept = editingItem === "DEPARTMENTS";
    const currentList = isDossier
      ? leadershipList
      : isDept
        ? departmentList
        : chronicleList;

    const newOfficer = {
      ...formFields,
      id: formFields.id || "officer_" + Date.now(),
    };

    let updatedList;
    if (formFields.id) {
      updatedList = currentList.map((item) =>
        item.id === formFields.id ? newOfficer : item,
      );
    } else {
      updatedList = [...currentList, newOfficer];
    }

    if (isDossier) {
      setLeadershipList(updatedList);
      localStorage.setItem("ecomig_leadership", JSON.stringify(updatedList));
    } else if (isDept) {
      setDepartmentList(updatedList);
      localStorage.setItem("ecomig_departments", JSON.stringify(updatedList));
    } else {
      setChronicleList(updatedList);
      localStorage.setItem("ecomig_chronicle", JSON.stringify(updatedList));
    }

    setTimeout(() => {
      setStatus("saved");
      setTimeout(() => {
        setStatus("idle");
        setActiveSubView("list");
      }, 1000);
    }, 800);
  };

  const handleEditEventClick = (item: any) => {
    setEventFormFields({
      id: item.id || "",
      unitId: item.unitId || selectedUnit.toLowerCase(),
      title: item.title || "",
      eventType: item.event_type || item.eventType || "Medal Parade",
      date: item.event_date || item.date || "",
      time: item.time || "",
      location: item.location || "",
      description: item.description || item.content || "",
      status: item.status || "Confirmed",
      imageUrl: item.image_url || item.imageUrl || "",
      files: item.files || []
    });
    setActiveSubView("form");
  };

  const handleAddEventClick = () => {
    setEventFormFields({
      id: "",
      unitId: selectedUnit.toLowerCase(),
      title: "",
      eventType: "Medal Parade",
      date: "",
      time: "",
      location: "",
      description: "",
      status: "Confirmed",
      imageUrl: "",
      files: []
    });
    setActiveSubView("form");
  };

  const handleSaveEvent = () => {
    setStatus("saving");
    const newEvent = {
      id: eventFormFields.id || "event_" + Date.now(),
      unitId: selectedUnit.toLowerCase(),
      title: eventFormFields.title,
      event_date: eventFormFields.date,
      time: eventFormFields.time || "0900Z",
      location: eventFormFields.location,
      description: eventFormFields.description,
      event_type: eventFormFields.eventType || "Medal Parade",
      status: eventFormFields.status,
      image_url: eventFormFields.imageUrl,
      files: eventFormFields.files
    };

    let updatedList;
    if (eventFormFields.id) {
      updatedList = eventsList.map((item) =>
        item.id === eventFormFields.id ? newEvent : item
      );
    } else {
      updatedList = [...eventsList, newEvent];
    }

    setEventsList(updatedList);
    localStorage.setItem("ecomig_events", JSON.stringify(updatedList));

    setTimeout(() => {
      setStatus("saved");
      setTimeout(() => {
        setStatus("idle");
        setActiveSubView("list");
      }, 1000);
    }, 800);
  };

  const handleEditGalleryClick = (item: any) => {
    setGalleryFormFields({
      id: item.id || "",
      unitId: item.unitId || selectedUnit.toLowerCase(),
      title: item.title || "",
      eventType: item.event_type || item.eventType || "Medal Parade",
      date: item.event_date || item.date || "",
      time: item.time || "",
      location: item.location || "",
      description: item.description || item.content || "",
      status: item.status || "Confirmed",
      imageUrl: item.image_url || item.imageUrl || "",
      files: item.files || []
    });
    setActiveSubView("form");
  };

  const handleAddGalleryClick = () => {
    setGalleryFormFields({
      id: "",
      unitId: selectedUnit.toLowerCase(),
      title: "",
      eventType: "Medal Parade",
      date: "",
      time: "",
      location: "",
      description: "",
      status: "Confirmed",
      imageUrl: "",
      files: []
    });
    setActiveSubView("form");
  };

  const handleSaveGallery = () => {
    setStatus("saving");
    const newGalleryItem = {
      id: galleryFormFields.id || "gallery_" + Date.now(),
      unitId: selectedUnit.toLowerCase(),
      title: galleryFormFields.title,
      date: galleryFormFields.date,
      time: galleryFormFields.time || "0900Z",
      location: galleryFormFields.location,
      description: galleryFormFields.description,
      eventType: galleryFormFields.eventType || "Medal Parade",
      status: galleryFormFields.status,
      image_url: galleryFormFields.imageUrl,
      files: galleryFormFields.files
    };

    let updatedList;
    if (galleryFormFields.id) {
      updatedList = galleryList.map((item) =>
        item.id === galleryFormFields.id ? newGalleryItem : item
      );
    } else {
      updatedList = [...galleryList, newGalleryItem];
    }

    setGalleryList(updatedList);
    localStorage.setItem("ecomig_gallery", JSON.stringify(updatedList));

    setTimeout(() => {
      setStatus("saved");
      setTimeout(() => {
        setStatus("idle");
        setActiveSubView("list");
      }, 1000);
    }, 800);
  };

  const handleSave = () => {
    setStatus("saving");

    if (editingItem === "NAV MENU BARS") {
      try {
        const newNav = JSON.parse(content);
        onUpdateNav(newNav);
      } catch (e) {
        console.error("Invalid JSON for navigation", e);
      }
    }

    setTimeout(() => {
      setStatus("saved");
      setTimeout(() => {
        setEditingItem(null);
        setStatus("idle");
      }, 1500);
    }, 1000);
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="p-3 md:p-6 relative min-h-screen bg-[#00853F] border-4 md:border-8 border-[#006b32] shadow-[inset_0_0_100px_rgba(0,0,0,0.5)] flex flex-col items-center">
      {/* Outer Bevel Frame */}
      <div className="absolute inset-0 border-t-2 border-l-2 border-white/20 pointer-events-none" />
      <div className="absolute inset-0 border-b-2 border-r-2 border-black/40 pointer-events-none" />

      <header className="w-full max-w-5xl mb-6 flex items-center justify-between p-3 md:p-4 bg-[#00853F] border-[4px] border-[#006b32] relative shadow-xl overflow-hidden mt-2">
        <div className="absolute inset-0 border-t-2 border-l-2 border-white/30 pointer-events-none" />
        <div className="absolute inset-0 border-b-2 border-r-2 border-black/30 pointer-events-none" />

        <div className="flex items-center gap-3 z-10">
          <button
            onClick={handleRefresh}
            className="p-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white transition-all group"
            title="Reload Tactical Frame"
          >
            <RefreshCcw
              size={16}
              className="group-hover:rotate-180 transition-transform duration-500"
            />
          </button>
          <div className="hidden md:block">
            <span className="text-[9px] font-black text-white/40 tracking-[0.3em] uppercase">
              Ecomig Protocol: V5.2
            </span>
          </div>
        </div>

        <h2 className="text-xl md:text-3xl font-black italic uppercase text-white leading-none tracking-tight drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)] text-center absolute left-1/2 -translate-x-1/2 w-full pointer-events-none px-4">
          ADMIN DASHBOARD
        </h2>

        <div className="flex items-center gap-4 z-10">
          <div className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 border border-white/10 rounded-lg">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[8px] font-black text-white uppercase tracking-widest">
              Live Secure
            </span>
          </div>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {!editingItem ? (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-5xl px-3 md:px-0"
          >
            {headings.map((heading, index) => (
              <motion.div
                key={heading}
                className={`group relative bg-white rounded-none border-[4px] border-gray-300 shadow-[8px_8px_20px_rgba(0,0,0,0.3)] transition-all ${
                  index >= 9 ? "lg:col-span-1.5" : ""
                }`}
              >
                {/* 3D Bevel for White Box */}
                <div className="absolute inset-0 border-t border-l border-white pointer-events-none" />
                <div className="absolute inset-0 border-b border-r border-gray-300 pointer-events-none" />

                <div className="p-4 flex flex-col items-center text-center">
                  <h3 className="text-sm md:text-base font-black italic uppercase text-black mb-4 leading-tight border-b-2 border-gray-100 pb-1.5 w-full text-center">
                    {heading}
                  </h3>

                  <div className="w-full space-y-2 relative z-10">
                    <div className="flex items-center justify-between mb-1 px-1">
                      <span className="text-[8px] font-black tracking-widest text-[#00853F] uppercase">
                        System State
                      </span>
                      <div className="flex items-center gap-1">
                        <div className="w-1.2 h-1.2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-[8px] font-bold text-gray-500">
                          SYNCHED
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleUpdateClick(heading)}
                      className="w-full bg-[#00853F] text-white py-2.5 border-b-2 border-r-2 border-[#004d24] hover:bg-[#009e4b] active:border-0 active:translate-y-0.5 active:translate-x-0.5 font-bold text-[10px] tracking-wider uppercase transition-all flex items-center justify-center gap-1.5 group"
                    >
                      <RotateCcw
                        size={12}
                        className="group-hover:rotate-180 transition-transform duration-500"
                      />
                      UPDATE CONTENT
                    </button>
                    <button className="w-full bg-white text-gray-400 py-1.5 border-b border-r border-gray-200 hover:text-[#00853F] hover:border-[#00853F] font-bold text-[8px] tracking-wider uppercase transition-all flex items-center justify-center gap-1.5">
                      <CheckCircle2 size={10} />
                      AUDIT LOGS
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="edit"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="w-full max-w-4xl bg-[#00853F] border-[6px] border-[#006b32] p-4 md:p-6 shadow-xl relative mx-auto font-sans"
          >
            <div className="absolute inset-0 border-t-2 border-l-2 border-white/20 pointer-events-none" />

            <div className="flex flex-col md:flex-row items-center justify-between mb-4 gap-3 overflow-hidden">
              <h3 className="text-lg md:text-xl font-black italic uppercase text-white tracking-tight truncate pr-4">
                EDITING:{" "}
                <span className="bg-white text-[#00853F] px-3 py-0.5">
                  {editingItem}
                </span>
              </h3>

              {(editingItem === "ECOMIG EVENTS" || editingItem === "GALLERY UPLOADS") && (
                <div className="flex items-center gap-2 bg-black/40 p-1.5 rounded-lg border border-white/20">
                  <Users size={12} className="text-[#00853F] ml-1" />
                  <span className="text-[9px] font-black text-white/60 uppercase tracking-widest">
                    Select Unit:
                  </span>
                  <div className="flex gap-1">
                    {units.map((unit) => (
                      <button
                        key={unit}
                        onClick={() => handleUnitChange(unit)}
                        className={`px-2 py-1 rounded text-[9px] font-black transition-all ${
                          selectedUnit === unit
                            ? "bg-[#00853F] text-white shadow-md"
                            : "bg-white/5 text-white/40 hover:bg-white/10"
                        }`}
                      >
                        {unit}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={() => setEditingItem(null)}
                className="p-2.5 bg-red-600 border-b-2 border-r-2 border-red-900 text-white hover:bg-red-500 transition-all active:translate-y-0.5 active:border-0 shrink-0"
              >
                <X size={16} />
              </button>
            </div>

            <div className="relative bg-white p-1 border-[4px] border-gray-300 shadow-inner">
              <div className="absolute inset-0 border-t border-l border-gray-400 pointer-events-none" />
              <div className="flex items-center justify-between bg-gray-50 p-2 mb-1.5 border-b border-gray-200">
                <div className="flex items-center gap-1.5">
                  {fileType === "json" ? (
                    <Globe size={12} className="text-[#00853F]" />
                  ) : (
                    <FileText size={12} className="text-[#00853F]" />
                  )}
                  <span className="text-[9px] font-black tracking-widest text-[#00853F] uppercase text-left block">
                    {editingItem === "COMMAND STRUCTURE" ||
                    editingItem === "CHRONICLE OF COMMAND" ||
                    editingItem === "DEPARTMENTS" ||
                    editingItem === "ECOMIG EVENTS" ||
                    editingItem === "GALLERY UPLOADS"
                      ? `SYSTEM REGISTER: ${editingItem} ${activeSubView === "form" ? "• NEW/EDIT" : "• DIRECTORY"}`
                      : `Buffer Mode: ${fileType === "json" ? "STRATEGIC DATA (JSON)" : "TACTICAL TEXT"}`}
                  </span>
                </div>
                {(editingItem === "COMMAND STRUCTURE" ||
                  editingItem === "CHRONICLE OF COMMAND" ||
                  editingItem === "DEPARTMENTS" ||
                  editingItem === "ECOMIG EVENTS" ||
                  editingItem === "GALLERY UPLOADS") &&
                  activeSubView === "form" && (
                    <button
                      onClick={() => setActiveSubView("list")}
                      className="text-[9px] font-black tracking-widest text-red-600 hover:text-red-800 uppercase"
                    >
                      ← BACK TO LIST
                    </button>
                  )}
              </div>

              {editingItem === "COMMAND STRUCTURE" ||
              editingItem === "CHRONICLE OF COMMAND" ||
              editingItem === "DEPARTMENTS" ||
              editingItem === "ECOMIG EVENTS" ||
              editingItem === "GALLERY UPLOADS" ? (
                activeSubView === "list" ? (
                  editingItem === "GALLERY UPLOADS" ? (
                    /* Render Dynamic Mission Gallery manager list */
                    <div className="p-3 md:p-4 space-y-3">
                      <div className="flex justify-between items-center bg-gray-100 p-2 border border-gray-200">
                        <span className="text-[9px] font-black tracking-widest text-[#00853F] uppercase text-left">
                          MISSION GALLERY - {selectedUnit} (
                          {galleryList.filter(e => e.unitId === selectedUnit.toLowerCase()).length}
                          )
                        </span>
                        <button
                          onClick={handleAddGalleryClick}
                          className="bg-[#00853F] hover:bg-[#009e4b] text-white px-2.5 py-1 text-[9px] font-black tracking-wider uppercase rounded flex items-center gap-1 transition-all shadow-md"
                        >
                          <Plus size={10} />
                          ADD GALLERY ITEM
                        </button>
                      </div>

                      <div className="max-h-[320px] overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                        {galleryList.filter(e => e.unitId === selectedUnit.toLowerCase()).length === 0 ? (
                          <div className="p-8 text-center bg-gray-50 text-gray-400 font-bold text-xs uppercase border border-dashed rounded">
                            No files logged for {selectedUnit}. Click "Add Gallery Item" to upload.
                          </div>
                        ) : (
                          galleryList
                            .filter(e => e.unitId === selectedUnit.toLowerCase())
                            .map((item, idx) => (
                              <div
                                key={item.id || idx}
                                className="bg-gray-50 border border-gray-200 p-2 flex items-center justify-between gap-3 hover:bg-gray-100/70 transition-colors rounded"
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <div className="w-12 h-12 bg-gray-200 border border-gray-300 overflow-hidden flex-shrink-0 rounded flex items-center justify-center">
                                    {item.image_url || item.imageUrl ? (
                                      <img
                                        src={item.image_url || item.imageUrl}
                                        alt=""
                                        className="w-full h-full object-cover"
                                        referrerPolicy="no-referrer"
                                      />
                                    ) : (
                                      <ImageIcon size={16} className="text-gray-400" />
                                    )}
                                  </div>

                                  <div className="text-left min-w-0">
                                    <span className="block text-[8px] font-black text-gray-400 tracking-wide uppercase leading-none mb-1">
                                      {item.date || "NO DATE"} • {item.eventType || "MEDIA"}
                                    </span>
                                    <span className="block text-xs font-black text-[#1a2c4e] truncate leading-none mb-1 uppercase text-left">
                                      {item.title}
                                    </span>
                                    <span className="block text-[8px] font-extrabold text-[#00853F] leading-tight uppercase text-left">
                                      LOCATION: {item.location || "N/A"}
                                    </span>
                                    {item.description && (
                                      <p className="block text-[9px] text-gray-500 truncate text-left mt-0.5">
                                        {item.description}
                                      </p>
                                    )}
                                    {item.files && item.files.length > 0 && (
                                      <span className="inline-block mt-1 text-[8px] font-mono bg-blue-100 text-blue-800 px-1 py-0.2 rounded">
                                        📁 ATTACHED: {item.files.length} file(s)
                                      </span>
                                    )}
                                  </div>
                                </div>

                                <div className="flex items-center gap-1.5 flex-shrink-0">
                                  <button
                                    onClick={() => handleEditGalleryClick(item)}
                                    className="py-1 px-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded font-black text-[9px] uppercase tracking-wider transition-all flex items-center gap-1 shadow-sm"
                                  >
                                    <Edit size={10} />
                                    EDIT
                                  </button>
                                  <button
                                    onClick={() => {
                                      const isConfirmed = window.confirm(
                                        `CONFIRM DELETION: Permanently delete gallery item "${item.title}"?`,
                                      );
                                      if (isConfirmed) {
                                        const updatedList = galleryList.filter((x) => x.id !== item.id);
                                        setGalleryList(updatedList);
                                        localStorage.setItem("ecomig_gallery", JSON.stringify(updatedList));
                                      }
                                    }}
                                    className="py-1 px-2 bg-red-600 hover:bg-red-500 text-white rounded font-black text-[9px] uppercase tracking-wider transition-all flex items-center gap-1 shadow-sm"
                                  >
                                    <Trash2 size={10} />
                                    DEL
                                  </button>
                                </div>
                              </div>
                            ))
                        )}
                      </div>
                    </div>
                  ) : editingItem === "ECOMIG EVENTS" ? (
                    /* Render Dynamic ECOMIG Event manager list */
                    <div className="p-3 md:p-4 space-y-3">
                      <div className="flex justify-between items-center bg-gray-100 p-2 border border-gray-200">
                        <span className="text-[9px] font-black tracking-widest text-[#00853F] uppercase text-left">
                          LOGGED EVENTS - {selectedUnit} (
                          {eventsList.filter(e => e.unitId === selectedUnit.toLowerCase()).length}
                          )
                        </span>
                        <button
                          onClick={handleAddEventClick}
                          className="bg-[#00853F] hover:bg-[#009e4b] text-white px-2.5 py-1 text-[9px] font-black tracking-wider uppercase rounded flex items-center gap-1 transition-all shadow-md"
                        >
                          <Plus size={10} />
                          LOG NEW EVENT
                        </button>
                      </div>

                      <div className="max-h-[320px] overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                        {eventsList.filter(e => e.unitId === selectedUnit.toLowerCase()).length === 0 ? (
                          <div className="p-8 text-center bg-gray-50 text-gray-400 font-bold text-xs uppercase border border-dashed rounded">
                            No events logged for {selectedUnit}. Click "Log New Event" to register.
                          </div>
                        ) : (
                          eventsList
                            .filter(e => e.unitId === selectedUnit.toLowerCase())
                            .map((item, idx) => (
                              <div
                                key={item.id || idx}
                                className="bg-gray-50 border border-gray-200 p-2 flex items-center justify-between gap-3 hover:bg-gray-100/70 transition-colors rounded"
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <div className="w-12 h-12 bg-gray-200 border border-gray-300 overflow-hidden flex-shrink-0 rounded flex items-center justify-center">
                                    {item.image_url || item.imageUrl ? (
                                      <img
                                        src={item.image_url || item.imageUrl}
                                        alt=""
                                        className="w-full h-full object-cover"
                                        referrerPolicy="no-referrer"
                                      />
                                    ) : (
                                      <ImageIcon size={16} className="text-gray-400" />
                                    )}
                                  </div>

                                  <div className="text-left min-w-0">
                                    <span className="block text-[8px] font-black text-gray-400 tracking-wide uppercase leading-none mb-1">
                                      {item.event_date || item.date || "NO DATE"} • {item.time || "0000Z"}
                                    </span>
                                    <span className="block text-xs font-black text-[#1a2c4e] truncate leading-none mb-1 uppercase text-left">
                                      {item.title}
                                    </span>
                                    <span className="block text-[8px] font-extrabold text-[#00853F] leading-tight uppercase text-left">
                                      LOCATION: {item.location || "N/A"} • STATUS: {item.status || "N/A"}
                                    </span>
                                    {item.description && (
                                      <p className="block text-[9px] text-gray-500 truncate text-left mt-0.5">
                                        {item.description}
                                      </p>
                                    )}
                                    {item.files && item.files.length > 0 && (
                                      <span className="inline-block mt-1 text-[8px] font-mono bg-blue-100 text-blue-800 px-1 py-0.2 rounded">
                                        📁 ATTACHED: {item.files.length} file(s)
                                      </span>
                                    )}
                                  </div>
                                </div>

                                <div className="flex items-center gap-1.5 flex-shrink-0">
                                  <button
                                    onClick={() => handleEditEventClick(item)}
                                    className="py-1 px-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded font-black text-[9px] uppercase tracking-wider transition-all flex items-center gap-1 shadow-sm"
                                  >
                                    <Edit size={10} />
                                    EDIT
                                  </button>
                                  <button
                                    onClick={() => {
                                      const isConfirmed = window.confirm(
                                        `CONFIRM DELETION: Permanently delete event "${item.title}"?`,
                                      );
                                      if (isConfirmed) {
                                        const updatedList = eventsList.filter((x) => x.id !== item.id);
                                        setEventsList(updatedList);
                                        localStorage.setItem("ecomig_events", JSON.stringify(updatedList));
                                      }
                                    }}
                                    className="py-1 px-2 bg-red-600 hover:bg-red-500 text-white rounded font-black text-[9px] uppercase tracking-wider transition-all flex items-center gap-1 shadow-sm"
                                  >
                                    <Trash2 size={10} />
                                    DEL
                                  </button>
                                </div>
                              </div>
                            ))
                        )}
                      </div>
                    </div>
                  ) : (
                    /* Render officer list */
                    <div className="p-3 md:p-4 space-y-3">
                    <div className="flex justify-between items-center bg-gray-100 p-2 border border-gray-200">
                      <span className="text-[9px] font-black tracking-widest text-[#00853F] uppercase text-left">
                        CURRENT OFFICERS (
                        {
                          (editingItem === "COMMAND STRUCTURE"
                            ? leadershipList
                            : editingItem === "DEPARTMENTS"
                              ? departmentList
                              : chronicleList
                          ).length
                        }
                        )
                      </span>
                      <button
                        onClick={() => {
                          setFormFields({
                            id: "",
                            name: "",
                            rank: "COLONEL",
                            appointment:
                              editingItem === "COMMAND STRUCTURE"
                                ? "HEAD OF MISSION"
                                : editingItem === "DEPARTMENTS"
                                  ? "MHQ"
                                  : "CONTINGENT COMMANDER",
                            dateFrom: "",
                            dateTo: "",
                            position: 1,
                            country: "SENEGAL",
                            unit: "SENBAT",
                            imageUrl: "",
                          });
                          setActiveSubView("form");
                        }}
                        className="bg-[#00853F] hover:bg-[#009e4b] text-white px-2.5 py-1 text-[9px] font-black tracking-wider uppercase rounded flex items-center gap-1 transition-all shadow-md"
                      >
                        <Plus size={10} />
                        ADD OFFICER
                      </button>
                    </div>

                    <div className="max-h-[320px] overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                      {[
                        ...(editingItem === "COMMAND STRUCTURE"
                          ? leadershipList
                          : editingItem === "DEPARTMENTS"
                            ? departmentList
                            : chronicleList),
                      ].sort((a, b) => (a.position || 1) - (b.position || 1))
                        .length === 0 ? (
                        <div className="p-8 text-center bg-gray-50 text-gray-400 font-bold text-xs uppercase border border-dashed rounded">
                          No officer records found. Click add officer to
                          register.
                        </div>
                      ) : (
                        [
                          ...(editingItem === "COMMAND STRUCTURE"
                            ? leadershipList
                            : editingItem === "DEPARTMENTS"
                              ? departmentList
                              : chronicleList),
                        ]
                          .sort((a, b) => (a.position || 1) - (b.position || 1))
                          .map((item, idx) => (
                            <div
                              key={item.id || idx}
                              className="bg-gray-50 border border-gray-200 p-2 flex items-center justify-between gap-3 hover:bg-gray-100/70 transition-colors rounded"
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div className="w-10 h-12 bg-gray-200 border border-gray-300 overflow-hidden flex-shrink-0 rounded">
                                  {item.imageUrl ? (
                                    <img
                                      src={item.imageUrl}
                                      alt=""
                                      className="w-full h-full object-cover"
                                      referrerPolicy="no-referrer"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                      <ImageIcon
                                        size={14}
                                        className="text-gray-400"
                                      />
                                    </div>
                                  )}
                                </div>

                                <div className="text-left min-w-0">
                                  <span className="block text-[8px] font-black text-gray-400 tracking-wide uppercase leading-none mb-1">
                                    {item.rank || "RANK"} • POSITION{" "}
                                    {item.position || 1}
                                  </span>
                                  <span className="block text-xs font-black text-[#1a2c4e] truncate leading-none mb-1 uppercase text-left">
                                    {item.name || "UNNAMED OFFICER"}
                                  </span>
                                  <span className="block text-[8px] font-extrabold text-[#00853F] leading-tight uppercase text-left">
                                    {item.appointment}{" "}
                                    {item.unit &&
                                    item.appointment === "CONTINGENT COMMANDER"
                                      ? `(${item.unit})`
                                      : ""}{" "}
                                    • {item.country}
                                  </span>
                                  {(item.dateFrom || item.dateTo) && (
                                    <span className="block text-[8px] text-gray-400 font-mono mt-0.5 text-left">
                                      DEPLOYMENT: {item.dateFrom} TO{" "}
                                      {item.dateTo}
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center gap-1.5 flex-shrink-0">
                                <button
                                  onClick={() => {
                                    setFormFields({
                                      id: item.id || "",
                                      name: item.name || "",
                                      rank: item.rank || "COLONEL",
                                      appointment:
                                        item.appointment || "FORCE COMMANDER",
                                      dateFrom: item.dateFrom || "",
                                      dateTo: item.dateTo || "",
                                      position: item.position || 1,
                                      country: item.country || "SENEGAL",
                                      unit: item.unit || "SENBAT",
                                      imageUrl: item.imageUrl || "",
                                    });
                                    setActiveSubView("form");
                                  }}
                                  className="py-1 px-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded font-black text-[9px] uppercase tracking-wider transition-all flex items-center gap-1 shadow-sm"
                                >
                                  <Edit size={10} />
                                  EDIT
                                </button>
                                <button
                                  onClick={() => {
                                    const isConfirmed = window.confirm(
                                      `CONFIRM DELETION: Permanently delete ${item.rank} ${item.name}?`,
                                    );
                                    if (isConfirmed) {
                                      const updatedList = (
                                        editingItem === "COMMAND STRUCTURE"
                                          ? leadershipList
                                          : editingItem === "DEPARTMENTS"
                                            ? departmentList
                                            : chronicleList
                                      ).filter((x) => x.id !== item.id);
                                      if (
                                        editingItem === "COMMAND STRUCTURE"
                                      ) {
                                        setLeadershipList(updatedList);
                                        localStorage.setItem(
                                          "ecomig_leadership",
                                          JSON.stringify(updatedList),
                                        );
                                      } else if (
                                        editingItem === "DEPARTMENTS"
                                      ) {
                                        setDepartmentList(updatedList);
                                        localStorage.setItem(
                                          "ecomig_departments",
                                          JSON.stringify(updatedList),
                                        );
                                      } else {
                                        setChronicleList(updatedList);
                                        localStorage.setItem(
                                          "ecomig_chronicle",
                                          JSON.stringify(updatedList),
                                        );
                                      }
                                    }
                                  }}
                                  className="py-1 px-2 bg-red-600 hover:bg-red-500 text-white rounded font-black text-[9px] uppercase tracking-wider transition-all flex items-center gap-1 shadow-sm"
                                >
                                  <Trash2 size={10} />
                                  DEL
                                </button>
                              </div>
                            </div>
                          ))
                      )}
                    </div>
                  </div>
                )
              ) : (
                editingItem === "GALLERY UPLOADS" ? (
                  /* Render Gallery Form */
                  <div className="p-3 md:p-4 space-y-3 bg-gray-50/50 text-left font-sans">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-0.5 text-left">
                        <label className="text-[9px] font-black text-[#00853F] uppercase tracking-widest text-left block font-sans">
                          Title of Event
                        </label>
                        <input
                          type="text"
                          value={galleryFormFields.title}
                          onChange={(e) =>
                            setGalleryFormFields({
                              ...galleryFormFields,
                              title: e.target.value,
                            })
                          }
                          className="w-full bg-white text-black border border-gray-200 p-2 font-bold text-sm focus:border-[#00853F] outline-none"
                          placeholder="ENTER GALLERY TITLE"
                        />
                      </div>
                      <div className="space-y-0.5 text-left">
                        <label className="text-[9px] font-black text-[#00853F] uppercase tracking-widest text-left block font-sans">
                          Type of Event
                        </label>
                        <select
                          value={galleryFormFields.eventType}
                          onChange={(e) =>
                            setGalleryFormFields({
                              ...galleryFormFields,
                              eventType: e.target.value,
                            })
                          }
                          className="w-full bg-white text-black border border-gray-200 p-2 font-bold text-sm focus:border-[#00853F] outline-none cursor-pointer text-black"
                        >
                          {[
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
                          ].map((et) => (
                            <option key={et} value={et}>
                              {et}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-0.5 text-left">
                        <label className="text-[9px] font-black text-[#00853F] uppercase tracking-widest text-left block font-sans">
                          Date (e.g. 23 MAY 26)
                        </label>
                        <input
                          type="text"
                          value={galleryFormFields.date}
                          onChange={(e) =>
                            setGalleryFormFields({
                              ...galleryFormFields,
                              date: e.target.value,
                            })
                          }
                          className="w-full bg-white text-black border border-gray-200 p-2 font-bold text-sm focus:border-[#00853F] outline-none"
                          placeholder="23 MAY 26"
                        />
                      </div>
                      <div className="space-y-0.5 text-left">
                        <label className="text-[9px] font-black text-[#00853F] uppercase tracking-widest text-left block font-sans">
                          Location
                        </label>
                        <input
                          type="text"
                          value={galleryFormFields.location}
                          onChange={(e) =>
                            setGalleryFormFields({
                              ...galleryFormFields,
                              location: e.target.value,
                            })
                          }
                          className="w-full bg-white text-black border border-gray-200 p-2 font-bold text-sm focus:border-[#00853F] outline-none"
                          placeholder="GALLERY LOCATION"
                        />
                      </div>
                    </div>

                    {/* Image handling with URL and manual upload option */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-0.5 text-left">
                        <label className="text-[9px] font-black text-[#00853F] uppercase tracking-widest text-left block font-sans">
                          URL Upload for Images
                        </label>
                        <div className="flex gap-1.5">
                          <input
                            type="text"
                            value={galleryFormFields.imageUrl}
                            onChange={(e) =>
                              setGalleryFormFields({
                                ...galleryFormFields,
                                imageUrl: e.target.value,
                              })
                            }
                            className="flex-grow bg-white border border-gray-200 p-2 font-bold text-xs focus:border-[#00853F] outline-none text-black placeholder:text-gray-300"
                            placeholder="Specify image link: https://..."
                          />
                        </div>
                      </div>

                      <div className="space-y-0.5 text-left">
                        <label className="text-[9px] font-black text-[#00853F] uppercase tracking-widest text-left block font-sans">
                          Manual Image Selection
                        </label>
                        <div className="flex gap-2 items-center font-sans font-bold">
                          <button
                            type="button"
                            onClick={() => {
                              const input = document.createElement("input");
                              input.type = "file";
                              input.accept = "image/*";
                              input.onchange = (e: any) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onloadend = () => {
                                    setGalleryFormFields((prev) => ({
                                      ...prev,
                                      imageUrl: reader.result as string,
                                    }));
                                  };
                                  reader.readAsDataURL(file);
                                }
                              };
                              input.click();
                            }}
                            className="bg-gray-100 border border-gray-200 hover:bg-gray-200 text-black px-4 py-2 font-bold text-xs uppercase cursor-pointer"
                          >
                            Choose File
                          </button>
                          {galleryFormFields.imageUrl && (
                            <div className="w-10 h-10 border border-gray-300 rounded overflow-hidden">
                              <img
                                src={galleryFormFields.imageUrl}
                                alt="preview"
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-0.5 text-left col-span-2">
                      <label className="text-[9px] font-black text-[#00853F] uppercase tracking-widest text-left block font-sans">
                        Message Box for Events / Details
                      </label>
                      <textarea
                        value={galleryFormFields.description}
                        onChange={(e) =>
                          setGalleryFormFields({
                            ...galleryFormFields,
                            description: e.target.value,
                          })
                        }
                        className="w-full h-[100px] bg-white text-black border border-gray-200 p-3 font-medium text-sm focus:border-[#00853F] outline-none custom-scrollbar"
                        placeholder="ENTER GALLERY RELEVANT DETAILS..."
                      />
                    </div>

                    {/* DRAG & DROP MULTIPLE FILES & SUBFOLDERS SECTION */}
                    <div className="space-y-1.5 text-left">
                      <label className="text-[9px] font-black text-[#00853F] uppercase tracking-widest text-left block font-sans">
                        UPLOAD ATTACHMENTS (FOLDERS/FILES)
                      </label>
                      <div
                        onDragOver={(e) => {
                          e.preventDefault();
                          setIsDragging(true);
                        }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={(e) => {
                          e.preventDefault();
                          setIsDragging(false);
                          if (e.dataTransfer.files) {
                            const filesArray = Array.from(e.dataTransfer.files);
                            const newFiles: any[] = [];
                            filesArray.forEach((file) => {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                newFiles.push({
                                  name: file.name,
                                  size: `${(file.size / 1024).toFixed(1)} KB`,
                                  type: file.type || "application/octet-stream",
                                  base64: reader.result as string
                                });
                                if (newFiles.length === filesArray.length) {
                                  setGalleryFormFields(prev => ({
                                    ...prev,
                                    files: [...prev.files, ...newFiles]
                                  }));
                                }
                              };
                              reader.readAsDataURL(file);
                            });
                          }
                        }}
                        className={`border-2 border-dashed rounded-lg p-5 text-center cursor-pointer transition-all ${
                          isDragging
                            ? "border-[#00853F] bg-[#00853F]/5"
                            : "border-gray-200 bg-white hover:border-[#00853F]"
                        }`}
                      >
                        <Upload className="mx-auto text-gray-400 mb-1" size={18} />
                        <span className="block text-[10px] font-bold text-gray-700">
                          DRAG & DROP DIRECTORIES OR FILES HERE
                        </span>
                        
                        <div className="flex justify-center gap-2 mt-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              multipleFileInputRef.current?.click();
                            }}
                            className="bg-[#00853F] hover:bg-[#006b32] text-white px-2 py-1 rounded text-[8px] uppercase font-black"
                          >
                            Attach Multi-Files
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              folderInputRef.current?.click();
                            }}
                            className="bg-blue-600 hover:bg-blue-800 text-white px-2 py-1 rounded text-[8px] uppercase font-black"
                          >
                            Attach Folder
                          </button>
                        </div>
                      </div>

                      {/* Hidden selection inputs */}
                      <input
                        type="file"
                        multiple
                        ref={multipleFileInputRef}
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files) {
                            const filesArray = Array.from(e.target.files);
                            const newFiles: any[] = [];
                            filesArray.forEach((file) => {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                newFiles.push({
                                  name: file.name,
                                  size: `${(file.size / 1024).toFixed(1)} KB`,
                                  type: file.type || "application/octet-stream",
                                  base64: reader.result as string
                                });
                                if (newFiles.length === filesArray.length) {
                                  setGalleryFormFields(prev => ({
                                    ...prev,
                                    files: [...prev.files, ...newFiles]
                                  }));
                                }
                              };
                              reader.readAsDataURL(file);
                            });
                          }
                        }}
                      />

                      <input
                        type="file"
                        multiple
                        ref={folderInputRef}
                        className="hidden"
                        {...({ webkitdirectory: "", directory: "" } as any)}
                        onChange={(e) => {
                          if (e.target.files) {
                            const filesArray = Array.from(e.target.files);
                            const newFiles: any[] = [];
                            filesArray.forEach((file) => {
                              const reader = new FileReader();
                              const relPath = (file as any).webkitRelativePath || file.name;
                              reader.onloadend = () => {
                                newFiles.push({
                                  name: relPath,
                                  size: `${(file.size / 1024).toFixed(1)} KB`,
                                  type: file.type || "application/octet-stream",
                                  base64: reader.result as string
                                });
                                if (newFiles.length === filesArray.length) {
                                  setGalleryFormFields(prev => ({
                                    ...prev,
                                    files: [...prev.files, ...newFiles]
                                  }));
                                }
                              };
                              reader.readAsDataURL(file);
                            });
                          }
                        }}
                      />

                      {/* Attached items file list */}
                      {galleryFormFields.files && galleryFormFields.files.length > 0 && (
                        <div className="mt-2 bg-gray-100/50 border border-gray-200 p-2 rounded max-h-[100px] overflow-y-auto space-y-1 custom-scrollbar">
                          {galleryFormFields.files.map((file, fIdx) => (
                            <div key={fIdx} className="flex items-center justify-between bg-white border border-gray-150 p-1 rounded px-2">
                              <span className="text-[9px] font-semibold text-gray-700 truncate max-w-[200px] uppercase text-left">
                                📁 {file.name} ({file.size})
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  setGalleryFormFields(prev => ({
                                    ...prev,
                                    files: prev.files.filter((_, idx) => idx !== fIdx)
                                  }));
                                }}
                                className="text-red-600 hover:text-red-800 text-[8px] font-black uppercase"
                              >
                                Delete
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ) : editingItem === "ECOMIG EVENTS" ? (
                  /* Render Event Form */
                  <div className="p-3 md:p-4 space-y-3 bg-gray-50/50 text-left font-sans">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-0.5 text-left">
                        <label className="text-[9px] font-black text-[#00853F] uppercase tracking-widest text-left block">
                          Title of Event
                        </label>
                        <input
                          type="text"
                          value={eventFormFields.title}
                          onChange={(e) =>
                            setEventFormFields({
                              ...eventFormFields,
                              title: e.target.value,
                            })
                          }
                          className="w-full bg-white text-black border border-gray-200 p-2 font-bold text-sm focus:border-[#00853F] outline-none"
                          placeholder="ENTER EVENT TITLE"
                        />
                      </div>
                      <div className="space-y-0.5 text-left">
                        <label className="text-[9px] font-black text-[#00853F] uppercase tracking-widest text-left block">
                          Status Check
                        </label>
                        <select
                          value={eventFormFields.status}
                          onChange={(e) =>
                            setEventFormFields({
                              ...eventFormFields,
                              status: e.target.value,
                            })
                          }
                          className="w-full bg-white text-black border border-gray-200 p-2 font-bold text-sm focus:border-[#00853F] outline-none cursor-pointer text-black"
                        >
                          {["Confirmed", "Pending", "Scheduled", "Active", "In Progress", "Routine", "Ongoing", "Planning", "Ready"].map((st) => (
                            <option key={st} value={st}>
                              {st.toUpperCase()}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-0.5 text-left">
                        <label className="text-[9px] font-black text-[#00853F] uppercase tracking-widest text-left block">
                          Target Military Unit
                        </label>
                        <div className="w-full bg-gray-100 border border-gray-200 p-2 font-black text-xs text-[#00853F] uppercase flex items-center gap-1.5 h-[38px] rounded">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#00853F] animate-pulse" />
                          {selectedUnit} — {
                            selectedUnit === "MHQ" ? "MISSION HEADQUARTERS" :
                            selectedUnit === "FHQ" ? "FORCE HEADQUARTERS" :
                            selectedUnit === "SENBAT" ? "SENEGALESE BATTALION" :
                            selectedUnit === "NIGCOY" ? "NIGERIAN CONTINGENT" :
                            selectedUnit === "GHANCOY" ? "GHANAIAN CONTINGENT" :
                            selectedUnit === "SENFPU" ? "SENEGALESE FORMED POLICE UNIT" : "ECOMIG FORCE UNIT"
                          }
                        </div>
                      </div>

                      <div className="space-y-0.5 text-left">
                        <label className="text-[9px] font-black text-[#00853F] uppercase tracking-widest text-left block">
                          Type of Event
                        </label>
                        <select
                          value={eventFormFields.eventType}
                          onChange={(e) =>
                            setEventFormFields({
                              ...eventFormFields,
                              eventType: e.target.value,
                            })
                          }
                          className="w-full bg-white text-black border border-gray-200 p-2 font-bold text-sm focus:border-[#00853F] outline-none cursor-pointer text-black"
                        >
                          {[
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
                          ].map((et) => (
                            <option key={et} value={et}>
                              {et}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="space-y-0.5 text-left">
                        <label className="text-[9px] font-black text-[#00853F] uppercase tracking-widest text-left block">
                          Date (e.g. 23 MAY 26)
                        </label>
                        <input
                          type="text"
                          value={eventFormFields.date}
                          onChange={(e) =>
                            setEventFormFields({
                              ...eventFormFields,
                              date: e.target.value,
                            })
                          }
                          className="w-full bg-white text-black border border-gray-200 p-2 font-bold text-sm focus:border-[#00853F] outline-none"
                          placeholder="23 MAY 26"
                        />
                      </div>
                      <div className="space-y-0.5 text-left">
                        <label className="text-[9px] font-black text-[#00853F] uppercase tracking-widest text-left block">
                          Zulu Time (e.g. 0900Z)
                        </label>
                        <input
                          type="text"
                          value={eventFormFields.time}
                          onChange={(e) =>
                            setEventFormFields({
                              ...eventFormFields,
                              time: e.target.value,
                            })
                          }
                          className="w-full bg-white text-black border border-gray-200 p-2 font-bold text-sm focus:border-[#00853F] outline-none"
                          placeholder="0900Z"
                        />
                      </div>
                      <div className="space-y-0.5 text-left">
                        <label className="text-[9px] font-black text-[#00853F] uppercase tracking-widest text-left block">
                          Location
                        </label>
                        <input
                          type="text"
                          value={eventFormFields.location}
                          onChange={(e) =>
                            setEventFormFields({
                              ...eventFormFields,
                              location: e.target.value,
                            })
                          }
                          className="w-full bg-white text-black border border-gray-200 p-2 font-bold text-sm focus:border-[#00853F] outline-none"
                          placeholder="EVENT LOCATION"
                        />
                      </div>
                    </div>

                    {/* Image handling with URL and manual upload option */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-0.5 text-left">
                        <label className="text-[9px] font-black text-[#00853F] uppercase tracking-widest text-left block">
                          URL Upload for Images
                        </label>
                        <div className="flex gap-1.5">
                          <input
                            type="text"
                            value={eventFormFields.imageUrl}
                            onChange={(e) =>
                              setEventFormFields({
                                ...eventFormFields,
                                imageUrl: e.target.value,
                              })
                            }
                            className="flex-grow bg-white border border-gray-200 p-2 font-bold text-xs focus:border-[#00853F] outline-none text-black placeholder:text-gray-300"
                            placeholder="Specify image link: https://..."
                          />
                        </div>
                      </div>

                      <div className="space-y-0.5 text-left">
                        <label className="text-[9px] font-black text-[#00853F] uppercase tracking-widest text-left block">
                          Manual Image Selection
                        </label>
                        <div className="flex gap-2 items-center font-sans font-bold">
                          <button
                            type="button"
                            onClick={() => {
                              const input = document.createElement("input");
                              input.type = "file";
                              input.accept = "image/*";
                              input.onchange = (e: any) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onloadend = () => {
                                    setEventFormFields((prev) => ({
                                      ...prev,
                                      imageUrl: reader.result as string,
                                    }));
                                  };
                                  reader.readAsDataURL(file);
                                }
                              };
                              input.click();
                            }}
                            className="bg-gray-100 border border-gray-200 hover:bg-gray-200 text-black px-4 py-2 font-bold text-xs uppercase cursor-pointer"
                          >
                            Choose File
                          </button>
                          {eventFormFields.imageUrl && (
                            <div className="w-10 h-10 border border-gray-300 rounded overflow-hidden">
                              <img
                                src={eventFormFields.imageUrl}
                                alt="preview"
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-0.5 text-left col-span-2">
                      <label className="text-[9px] font-black text-[#00853F] uppercase tracking-widest text-left block font-sans">
                        Message Box for Events / Details
                      </label>
                      <textarea
                        value={eventFormFields.description}
                        onChange={(e) =>
                          setEventFormFields({
                            ...eventFormFields,
                            description: e.target.value,
                          })
                        }
                        className="w-full h-[100px] bg-white text-black border border-gray-200 p-3 font-medium text-sm focus:border-[#00853F] outline-none custom-scrollbar"
                        placeholder="ENTER EVENT SUMMARY DETAILS..."
                      />
                    </div>

                    {/* DRAG & DROP MULTIPLE FILES & SUBFOLDERS SECTION */}
                    <div className="space-y-1.5 text-left">
                      <label className="text-[9px] font-black text-[#00853F] uppercase tracking-widest text-left block">
                        UPLOAD ATTACHMENTS (FOLDERS/FILES)
                      </label>
                      <div
                        onDragOver={(e) => {
                          e.preventDefault();
                          setIsDragging(true);
                        }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={(e) => {
                          e.preventDefault();
                          setIsDragging(false);
                          if (e.dataTransfer.files) {
                            const filesArray = Array.from(e.dataTransfer.files);
                            const newFiles: any[] = [];
                            filesArray.forEach((file) => {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                newFiles.push({
                                  name: file.name,
                                  size: `${(file.size / 1024).toFixed(1)} KB`,
                                  type: file.type || "application/octet-stream",
                                  base64: reader.result as string
                                });
                                if (newFiles.length === filesArray.length) {
                                  setEventFormFields(prev => ({
                                    ...prev,
                                    files: [...prev.files, ...newFiles]
                                  }));
                                }
                              };
                              reader.readAsDataURL(file);
                            });
                          }
                        }}
                        className={`border-2 border-dashed rounded-lg p-5 text-center cursor-pointer transition-all ${
                          isDragging
                            ? "border-[#00853F] bg-[#00853F]/5"
                            : "border-gray-200 bg-white hover:border-[#00853F]"
                        }`}
                      >
                        <Upload className="mx-auto text-gray-400 mb-1" size={18} />
                        <span className="block text-[10px] font-bold text-gray-700">
                          DRAG & DROP DIRECTORIES OR FILES HERE
                        </span>
                        
                        <div className="flex justify-center gap-2 mt-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              multipleFileInputRef.current?.click();
                            }}
                            className="bg-[#00853F] hover:bg-[#006b32] text-white px-2 py-1 rounded text-[8px] uppercase font-black"
                          >
                            Attach Multi-Files
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              folderInputRef.current?.click();
                            }}
                            className="bg-blue-600 hover:bg-blue-800 text-white px-2 py-1 rounded text-[8px] uppercase font-black"
                          >
                            Attach Folder
                          </button>
                        </div>
                      </div>

                      {/* Hidden selection inputs */}
                      <input
                        type="file"
                        multiple
                        ref={multipleFileInputRef}
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files) {
                            const filesArray = Array.from(e.target.files);
                            const newFiles: any[] = [];
                            filesArray.forEach((file) => {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                newFiles.push({
                                  name: file.name,
                                  size: `${(file.size / 1024).toFixed(1)} KB`,
                                  type: file.type || "application/octet-stream",
                                  base64: reader.result as string
                                });
                                if (newFiles.length === filesArray.length) {
                                  setEventFormFields(prev => ({
                                    ...prev,
                                    files: [...prev.files, ...newFiles]
                                  }));
                                }
                              };
                              reader.readAsDataURL(file);
                            });
                          }
                        }}
                      />

                      <input
                        type="file"
                        multiple
                        ref={folderInputRef}
                        className="hidden"
                        {...({ webkitdirectory: "", directory: "" } as any)}
                        onChange={(e) => {
                          if (e.target.files) {
                            const filesArray = Array.from(e.target.files);
                            const newFiles: any[] = [];
                            filesArray.forEach((file) => {
                              const reader = new FileReader();
                              const relPath = (file as any).webkitRelativePath || file.name;
                              reader.onloadend = () => {
                                newFiles.push({
                                  name: relPath,
                                  size: `${(file.size / 1024).toFixed(1)} KB`,
                                  type: file.type || "application/octet-stream",
                                  base64: reader.result as string
                                });
                                if (newFiles.length === filesArray.length) {
                                  setEventFormFields(prev => ({
                                    ...prev,
                                    files: [...prev.files, ...newFiles]
                                  }));
                                }
                              };
                              reader.readAsDataURL(file);
                            });
                          }
                        }}
                      />

                      {/* Attached items file list */}
                      {eventFormFields.files && eventFormFields.files.length > 0 && (
                        <div className="mt-2 bg-gray-100/50 border border-gray-200 p-2 rounded max-h-[100px] overflow-y-auto space-y-1 custom-scrollbar">
                          {eventFormFields.files.map((file, fIdx) => (
                            <div key={fIdx} className="flex items-center justify-between bg-white border border-gray-150 p-1 rounded px-2">
                              <span className="text-[9px] font-semibold text-gray-700 truncate max-w-[200px] uppercase text-left">
                                📁 {file.name} ({file.size})
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  setEventFormFields(prev => ({
                                    ...prev,
                                    files: prev.files.filter((_, idx) => idx !== fIdx)
                                  }));
                                }}
                                className="text-red-600 hover:text-red-800 text-[8px] font-black uppercase"
                              >
                                Delete
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  /* Render officer form entry */
                  <div className="p-3 md:p-4 space-y-3 bg-gray-50/50 text-left">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-0.5 text-left">
                        <label className="text-[9px] font-black text-[#00853F] uppercase tracking-widest text-left block">
                          Rame
                        </label>
                        <input
                          type="text"
                          value={formFields.name}
                          onChange={(e) =>
                            setFormFields({
                              ...formFields,
                              name: e.target.value,
                            })
                          }
                          className="w-full bg-white text-black border border-gray-200 p-2 font-bold text-sm focus:border-[#00853F] outline-none"
                          placeholder="ENTER NAME"
                        />
                      </div>
                      <div className="space-y-0.5 text-left">
                        <label className="text-[9px] font-black text-[#00853F] uppercase tracking-widest text-left block">
                          Rank
                        </label>
                        <select
                          value={formFields.rank}
                          onChange={(e) =>
                            setFormFields({
                              ...formFields,
                              rank: e.target.value,
                            })
                          }
                          className="w-full bg-white text-black border border-gray-200 p-2 font-bold text-sm focus:border-[#00853F] outline-none cursor-pointer"
                          style={{ color: "#00cc00" }}
                        >
                          <option value="" disabled className="text-gray-400">
                            --- SELECT RANK ---
                          </option>
                          {ranks.map((rk) => (
                            <option
                              key={rk}
                              value={rk}
                              className="text-black bg-white font-black"
                              style={{
                                color: "#000000",
                                backgroundColor: "#ffffff",
                              }}
                            >
                              {rk}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-0.5 text-left">
                        <label className="text-[9px] font-black text-[#00853F] uppercase tracking-widest text-left block">
                          Appointment
                        </label>
                        {editingItem === "COMMAND STRUCTURE" ? (
                          <select
                            value={formFields.appointment}
                            onChange={(e) =>
                              setFormFields({
                                ...formFields,
                                appointment: e.target.value,
                              })
                            }
                            className="w-full bg-white text-black border border-gray-200 p-2 font-bold text-sm focus:border-[#00853F] outline-none cursor-pointer"
                            style={{
                              color: "#000000",
                              backgroundColor: "#ffffff",
                            }}
                          >
                            {appointments.map((app) => (
                              <option
                                key={app}
                                value={app}
                                className="text-black bg-white font-semibold"
                              >
                                {app}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type="text"
                            value={formFields.appointment}
                            onChange={(e) =>
                              setFormFields({
                                ...formFields,
                                appointment: e.target.value.toUpperCase(),
                              })
                            }
                            className="w-full bg-white text-black border border-gray-200 p-2 font-bold text-sm focus:border-[#00853F] outline-none"
                            placeholder="ENTER APPOINTMENT (E.G. CHIEF OF STAFF)"
                          />
                        )}
                      </div>
                      {editingItem === "CHRONICLE OF COMMAND" ? (
                        <div className="space-y-0.5 text-left">
                          <label className="text-[9px] font-black text-[#00853F] uppercase tracking-widest text-left block">
                            Unit
                          </label>
                          <select
                            value={formFields.unit}
                            onChange={(e) =>
                              setFormFields({
                                ...formFields,
                                unit: e.target.value,
                              })
                            }
                            className="w-full bg-white text-black border border-gray-200 p-2 font-bold text-sm focus:border-[#00853F] outline-none cursor-pointer"
                            style={{
                              color: "#000000",
                              backgroundColor: "#ffffff",
                            }}
                          >
                            {["SENBAT", "NIGCOY", "GHANCOY", "SENFPU"].map(
                              (unit) => (
                                <option
                                  key={unit}
                                  value={unit}
                                  className="text-black bg-white font-semibold"
                                >
                                  {unit}
                                </option>
                              ),
                            )}
                          </select>
                        </div>
                      ) : (
                        <div className="space-y-0.5 text-left">
                          <label className="text-[9px] font-black text-[#00853F]/40 uppercase tracking-widest block text-left">
                            Unit / HQ Scope
                          </label>
                          <div className="p-2 border border-gray-200 bg-gray-100/50 text-gray-400 font-bold text-xs uppercase text-left">
                            MHQ LOGISTICS ARCHIVE
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-2 bg-white/40 border border-gray-100 rounded">
                      <div className="col-span-1 md:col-span-2 text-left">
                        <span className="text-[9px] font-black text-[#00853F]/60 uppercase tracking-widest block">
                          Period of Deployment
                        </span>
                      </div>
                      <div className="space-y-0.5 text-left">
                        <label className="text-[9px] font-black text-[#00853F] uppercase tracking-widest text-left block">
                          From
                        </label>
                        <input
                          type="date"
                          value={formFields.dateFrom}
                          onChange={(e) =>
                            setFormFields({
                              ...formFields,
                              dateFrom: e.target.value,
                            })
                          }
                          className="w-full bg-white text-black border border-gray-200 p-2 font-bold text-[#00853F] text-xs focus:border-[#00853F] outline-none cursor-pointer"
                        />
                      </div>
                      <div className="space-y-0.5 text-left">
                        <label className="text-[9px] font-black text-[#00853F] uppercase tracking-widest text-left block">
                          To
                        </label>
                        <input
                          type="date"
                          value={formFields.dateTo}
                          onChange={(e) =>
                            setFormFields({
                              ...formFields,
                              dateTo: e.target.value,
                            })
                          }
                          className="w-full bg-white text-black border border-gray-200 p-2 font-bold text-[#00853F] text-xs focus:border-[#00853F] outline-none cursor-pointer"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-0.5 text-left">
                        <label className="text-[9px] font-black text-[#00853F] uppercase tracking-widest text-left block">
                          Country
                        </label>
                        <select
                          value={formFields.country}
                          onChange={(e) =>
                            setFormFields({
                              ...formFields,
                              country: e.target.value,
                            })
                          }
                          className="w-full bg-white text-black border border-gray-200 p-2 font-bold text-sm focus:border-[#00853F] outline-none cursor-pointer"
                          style={{
                            color: "#000000",
                            backgroundColor: "#ffffff",
                          }}
                        >
                          <option value="SENEGAL">SENEGAL</option>
                          <option value="NIGERIA">NIGERIA</option>
                          <option value="GHANA">GHANA</option>
                          <option value="SIERRA LEONE">SIERRA LEONE</option>
                        </select>
                      </div>

                      <div className="space-y-0.5 text-left">
                        <label className="text-[9px] font-black text-[#00853F] uppercase tracking-widest text-left block">
                          Display Position (1 to 6)
                        </label>
                        <select
                          value={formFields.position || 1}
                          onChange={(e) =>
                            setFormFields({
                              ...formFields,
                              position: parseInt(e.target.value, 10),
                            })
                          }
                          className="w-full bg-white text-black border border-gray-200 p-2 font-bold text-sm focus:border-[#00853F] outline-none cursor-pointer"
                          style={{
                            color: "#000000",
                            backgroundColor: "#ffffff",
                          }}
                        >
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="4">4</option>
                          <option value="5">5</option>
                          <option value="6">6</option>
                        </select>
                      </div>

                      <div className="space-y-0.5 text-left">
                        <label className="text-[9px] font-black text-[#00853F] uppercase tracking-widest block text-left">
                          Upload Image
                        </label>
                        <div
                          onClick={() => fileInputRef.current?.click()}
                          className="border border-dashed border-[#00853F]/40 hover:border-[#00853F] rounded p-2 bg-white flex items-center justify-between cursor-pointer transition-all hover:bg-gray-50 group"
                        >
                          <div className="flex items-center gap-2">
                            <ImageIcon
                              size={18}
                              className="text-[#00853F] group-hover:scale-110 transition-transform"
                            />
                            <div className="text-left">
                              <span className="block text-[9px] font-black text-[#00853F] tracking-wider uppercase text-left">
                                Post / Upload Image
                              </span>
                              <span className="block text-[7px] text-gray-400 font-bold text-left">
                                CLICK TO UPLOAD
                              </span>
                            </div>
                          </div>
                          {formFields.imageUrl ? (
                            <div className="w-6 h-8 border border-gray-200 rounded overflow-hidden">
                              <img
                                src={formFields.imageUrl}
                                alt="preview"
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                          ) : (
                            <div className="w-6 h-8 bg-gray-50 border border-gray-200 rounded flex items-center justify-center">
                              <Upload size={10} className="text-gray-400" />
                            </div>
                          )}
                          <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/*"
                            className="hidden"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-0.5 text-left">
                      <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest text-left block">
                        Or specify Image URL
                      </label>
                      <div className="flex gap-1.5">
                        <div className="p-2 bg-gray-100/50 border border-gray-200 flex items-center">
                          <Link size={12} className="text-gray-400" />
                        </div>
                        <input
                          type="text"
                          value={formFields.imageUrl}
                          onChange={(e) =>
                            setFormFields({
                              ...formFields,
                              imageUrl: e.target.value,
                            })
                          }
                          className="flex-grow bg-white border border-gray-200 p-2 font-bold text-xs focus:border-[#00853F] outline-none text-black placeholder:text-gray-300"
                          placeholder="HTTPS://..."
                        />
                      </div>
                    </div>
                  </div>
                )
              )
              ) : (
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full h-[260px] bg-transparent p-4 outline-none font-sans font-bold text-sm md:text-base text-black leading-normal placeholder:text-gray-300 custom-scrollbar"
                  placeholder="URL: https://... (or other tactical data)"
                />
              )}
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              {editingItem === "COMMAND STRUCTURE" ||
              editingItem === "CHRONICLE OF COMMAND" ||
              editingItem === "DEPARTMENTS" ||
              editingItem === "ECOMIG EVENTS" ||
              editingItem === "GALLERY UPLOADS" ? (
                activeSubView === "form" ? (
                  <button
                    onClick={
                      editingItem === "GALLERY UPLOADS"
                        ? handleSaveGallery
                        : editingItem === "ECOMIG EVENTS"
                          ? handleSaveEvent
                          : handleSaveForm
                    }
                    disabled={status !== "idle"}
                    className={`flex-grow md:flex-grow-0 px-8 py-3.5 font-black text-xs tracking-wider uppercase transition-all shadow-md active:translate-y-0.5 border-b-2 border-r-2 ${
                      status === "saved"
                        ? "bg-green-500 text-white border-green-800"
                        : "bg-white text-[#00853F] border-gray-300 hover:bg-gray-55"
                    }`}
                  >
                    {status === "saving"
                      ? "UPLOADING..."
                      : status === "saved"
                        ? "VERIFIED"
                        : editingItem === "GALLERY UPLOADS"
                          ? "POST PICTURE TO GALLERY"
                          : editingItem === "ECOMIG EVENTS"
                            ? "POST EVENT TO SITE"
                            : "POST OFFICER TO SITE"}
                  </button>
                ) : (
                  <div className="text-[9px] font-black text-white/50 tracking-wider uppercase bg-black/10 px-3 py-1.5 rounded">
                    {editingItem === "GALLERY UPLOADS"
                      ? "Gallery Upload Live Management Active"
                      : editingItem === "ECOMIG EVENTS"
                        ? "Event Schedule Live Management Active"
                        : "Roster Live Management Active"}
                  </div>
                )
              ) : (
                <button
                  onClick={handleSave}
                  disabled={status !== "idle"}
                  className={`flex-grow md:flex-grow-0 px-8 py-3.5 font-black text-xs tracking-wider uppercase transition-all shadow-md active:translate-y-0.5 border-b-2 border-r-2 ${
                    status === "saved"
                      ? "bg-green-500 text-white border-green-800"
                      : "bg-white text-[#00853F] border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {status === "saving"
                    ? "UPLOADING..."
                    : status === "saved"
                      ? "VERIFIED"
                      : "SAVE CHANGES"}
                </button>
              )}

              <button
                onClick={() => setContent("")}
                className="flex-grow md:flex-grow-0 px-6 py-3.5 bg-[#006b32] text-white border-b-2 border-r-2 border-[#004d24] font-black text-xs tracking-wider uppercase hover:bg-[#00853F] transition-all"
              >
                RESET
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="w-full max-w-5xl mt-6 mb-4 p-3 md:p-4 bg-[#006b32] border-[2px] border-[#004d24] flex flex-col md:flex-row items-center justify-between gap-3 relative overflow-hidden text-white shadow-lg">
        <div className="absolute inset-0 border-t border-l border-white/10 pointer-events-none" />
        <div className="text-center md:text-left z-10">
          <h4 className="text-sm font-black italic uppercase mb-0.5">
            SYSTEM HANDSHAKE
          </h4>
          <p className="text-white/60 font-medium italic text-[10px]">
            MHQ nodes synchronized. Localized encryption active.
          </p>
        </div>
        <div className="flex gap-2.5 z-10">
          <span className="text-[10px] font-bold">
            UTC CLOCK:{" "}
            <span className="font-mono text-white tracking-widest font-black">
              10:00:00
            </span>
          </span>
        </div>
      </footer>
    </div>
  );
};
