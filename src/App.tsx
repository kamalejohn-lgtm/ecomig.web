import React, { useState, useEffect, createContext, useContext, ReactNode, Component } from "react";
import { BrowserRouter, Routes, Route, Link, useNavigate, useParams, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { format } from "date-fns";
import { 
  Menu, X, ChevronRight, Shield, Users, Calendar, FileText, 
  MapPin, Phone, Mail, Image as ImageIcon, Newspaper, Clock, LogOut, Plus,
  Edit, Trash2, Eye, Home, Settings, Send, Inbox, Folder, ExternalLink,
  Sparkles, Wand2, Type, MessageCircle, Bot, Download, Globe, Radio, Tv,
  Trophy, Landmark, ArrowLeft, ArrowRight
} from "lucide-react";
import { 
  generateNewsSummary, 
  improveNewsContent, 
  suggestNewsTitle,
  chatWithGemini
} from "./services/gemini";

// Firebase Imports
import { auth, db, storage } from "./firebase";
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithPopup,
  GoogleAuthProvider,
  signOut, 
  User as FirebaseUser 
} from "firebase/auth";
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  onSnapshot,
  where,
  getDocFromServer,
  limit
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, uploadBytesResumable } from "firebase/storage";

// --- TYPES ---
interface UserProfile {
  id: string;
  username: string;
  role: string;
  unit: string;
  full_name: string;
  created_at: string;
}

interface News {
  id: string;
  title: string;
  content: string;
  summary?: string;
  image_url?: string;
  category: string;
  author: string;
  created_at: string;
  updated_at: string;
}

interface Event {
  id: string;
  title: string;
  description: string;
  event_date: string;
  location?: string;
  event_type: string;
  image_url?: string;
  created_by: string;
  created_at: string;
}

interface GalleryImage {
  id: string;
  title: string;
  description?: string;
  image_url: string;
  category: string;
  uploaded_by: string;
  created_at: string;
}

interface Leader {
  id: string;
  name: string;
  title: string;
  position: string;
  unit?: string;
  image_url?: string;
  bio?: string;
  order: number;
}

interface Department {
  id: string;
  name: string;
  code: string;
  description?: string;
}

interface MissionDocument {
  id: string;
  title: string;
  category: "SOP" | "Manual" | "Directive" | "Report";
  file_url: string;
  uploaded_by: string;
  created_at: string;
}

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: "unread" | "read";
  has_attachments?: boolean;
  attachment_count?: number;
  created_at: string;
}

interface InternalMailAttachment {
  name: string;
  url: string;
  type: string;
  size: number;
}

interface InternalMail {
  id: string;
  sender_id: string;
  sender_name: string;
  sender_unit: string;
  receiver_id?: string;
  receiver_unit?: string;
  subject: string;
  body: string;
  is_read: boolean;
  attachments?: InternalMailAttachment[];
  created_at: string;
}

// --- ERROR HANDLING ---
enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid || "Not Logged In",
      email: auth.currentUser?.email || "No Email",
      emailVerified: auth.currentUser?.emailVerified || false,
      isAnonymous: auth.currentUser?.isAnonymous || false,
      tenantId: auth.currentUser?.tenantId || "",
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName || "",
        email: provider.email || "",
        photoUrl: provider.photoURL || ""
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  
  let userMessage = "Database Error: ";
  if (errInfo.error.includes("permission-denied")) {
    userMessage += "Permission Denied. Please check your Firestore security rules.";
  } else if (errInfo.error.includes("quota-exceeded")) {
    userMessage += "Quota Exceeded.";
  } else {
    userMessage += errInfo.error;
  }
  
  alert(userMessage);
  throw new Error(JSON.stringify(errInfo));
}

function handleStorageError(error: any, path: string) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
    },
    path
  }
  console.error('Storage Error: ', JSON.stringify(errInfo));
  
  if (error.code === 'storage/unauthorized') {
    alert("Permission Denied: You do not have permission to upload to this folder. Please check your Firebase Storage rules.");
  } else if (error.code === 'storage/quota-exceeded') {
    alert("Quota Exceeded: Your Firebase Storage quota has been reached.");
  } else if (error.code === 'storage/retry-limit-exceeded') {
    alert("Upload Timed Out: The upload took too long. Please check your internet connection.");
  } else if (error.code === 'storage/invalid-url') {
    alert("Invalid Storage Configuration: The storage bucket URL is incorrect.");
  } else if (error.message?.includes('the client is offline')) {
    alert("Network Error: You appear to be offline or the Firebase Storage service is unreachable.");
  } else {
    alert(`Upload Failed: ${errInfo.error}. Please ensure Firebase Storage is enabled in your Firebase Console.`);
  }
}

// --- AUTH CONTEXT ---
interface AuthContextType {
  user: FirebaseUser | null;
  profile: UserProfile | null;
  login: (email: string, pass: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        console.log("Auth state changed: User logged in", firebaseUser.email);
        try {
          // 1. Try to find by UID
          const docRef = doc(db, "users", firebaseUser.uid);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            console.log("Profile found by UID.");
            setProfile(docSnap.data() as UserProfile);
          } else {
            // 2. Try to find by Email (Pre-authorized case)
            console.log("No UID profile, checking for pre-authorized email...");
            const q = query(collection(db, "users"), where("username", "==", firebaseUser.email));
            const snap = await getDocs(q);
            
            if (!snap.empty) {
              const preAuthDoc = snap.docs[0];
              const preAuthData = preAuthDoc.data() as UserProfile;
              console.log("Found pre-authorized profile by email. Linking to UID...");
              
              // Link this profile to the UID for future fast lookups
              const updatedProfile = { ...preAuthData, id: firebaseUser.uid };
              await setDoc(doc(db, "users", firebaseUser.uid), updatedProfile);
              
              // Optionally delete the old random-id doc if it's different
              if (preAuthDoc.id !== firebaseUser.uid) {
                await deleteDoc(doc(db, "users", preAuthDoc.id));
              }
              
              setProfile(updatedProfile);
            } else {
              // 3. Create new pending profile
              console.log("No pre-authorization found, creating pending profile...");
              const isAdminEmail = firebaseUser.email === "admin@ecomig.org" || firebaseUser.email === "kamalejohn@gmail.com";
              const pendingProfile: UserProfile = {
                id: firebaseUser.uid,
                username: firebaseUser.email || "user",
                role: isAdminEmail ? "admin" : "pending",
                unit: "Unknown",
                full_name: firebaseUser.displayName || "New User",
                created_at: new Date().toISOString()
              };
              await setDoc(docRef, pendingProfile);
              setProfile(pendingProfile);
            }
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
        }
      } else {
        console.log("Auth state changed: User logged out");
        setProfile(null);
      }
      setLoading(false);
    });

    // Test connection
    const testConnection = async () => {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error) {
        if(error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration. ");
        }
      }
    }
    testConnection();

    return () => unsubscribe();
  }, []);

  const login = async (email: string, pass: string) => {
    try {
      console.log(`Attempting login for ${email}...`);
      await signInWithEmailAndPassword(auth, email, pass);
      console.log("Login successful.");
    } catch (error: any) {
      console.error("Auth error code:", error.code, "Message:", error.message);
      
      // If it's the admin email and user doesn't exist, create it (bootstrapping)
      const isAdminEmail = email === "admin@ecomig.org" || email === "kamalejohn@gmail.com";
      const isNewUserError = error.code === "auth/user-not-found" || 
                            error.code === "auth/invalid-credential" || 
                            error.code === "auth/invalid-login-credentials";
      
      if (isAdminEmail && isNewUserError) {
        try {
          console.log(`Bootstrapping admin account for ${email}...`);
          await createUserWithEmailAndPassword(auth, email, pass);
          console.log("Admin account created and logged in.");
          return;
        } catch (createError: any) {
          console.error("Create error code:", createError.code);
          if (createError.code === "auth/operation-not-allowed") {
            throw new Error("Email/Password login is currently disabled in the Firebase Console. Please enable it under Authentication > Sign-in method.");
          }
          if (createError.code === "auth/email-already-in-use") {
            // User exists but password was wrong (since signIn failed)
            throw new Error("Incorrect password for this account. If you've forgotten it, please use the 'Forgot Password' link to reset it.");
          }
          throw createError;
        }
      }
      
      if (error.code === "auth/operation-not-allowed") {
        throw new Error("Email/Password login is currently disabled in the Firebase Console. Please enable it under Authentication > Sign-in method.");
      }
      
      throw error;
    }
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, profile, login, loginWithGoogle, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// --- COMPONENTS ---
const EcomigLogo = () => {
  const [error, setError] = useState(false);
  
  return (
    <div className="flex items-center gap-2">
      <img 
        src="https://customer-assets.emergentagent.com/job_secure-comms-36/artifacts/yxcc2zx2_image.png" 
        alt="ECOMIG Logo" 
        className={`h-12 md:h-16 object-contain ${error ? 'hidden' : 'block'}`}
        referrerPolicy="no-referrer"
        onError={() => {
          console.error("ECOMIG Logo failed to load.");
          setError(true);
        }}
      />
      {error && (
        <div className="bg-green-800 text-white px-3 py-1 rounded font-bold text-sm uppercase tracking-widest border border-white/20">
          ECOMIG
        </div>
      )}
    </div>
  );
};

const PageHeader = ({ title, subtitle, icon, breadcrumb }: { title: string, subtitle?: string, icon?: ReactNode, breadcrumb?: ReactNode }) => (
  <div className="bg-slate-900/90 backdrop-blur-md text-white py-16 md:py-24">
    <div className="max-w-7xl mx-auto px-8">
      {breadcrumb && <div className="mb-6">{breadcrumb}</div>}
      <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex-shrink-0"
        >
          <img 
            src="https://customer-assets.emergentagent.com/job_secure-comms-36/artifacts/yxcc2zx2_image.png" 
            alt="ECOMIG Logo" 
            className="h-24 md:h-32 object-contain"
            referrerPolicy="no-referrer"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center justify-center md:justify-start gap-4 mb-2">
            {icon && <div className="text-green-500">{icon}</div>}
            <h1 className="font-heading text-4xl md:text-6xl font-bold uppercase tracking-tighter">{title}</h1>
          </div>
          {subtitle && <p className="text-slate-400 max-w-2xl text-lg font-light">{subtitle}</p>}
        </motion.div>
      </div>
    </div>
  </div>
);

const MailboxIcon = () => {
  const { user, profile } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user || !profile) return;
    
    // Count personal unread
    const q1 = query(collection(db, "internal_mail"), where("receiver_id", "==", user.uid), where("is_read", "==", false));
    const unsub1 = onSnapshot(q1, (snap) => {
      const personalCount = snap.size;
      setUnreadCount(prev => personalCount); // This is a bit simplified, but fine for now
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, "internal_mail");
    });

    // Count unit unread (simplified: just personal for now to avoid complex logic)
    return () => unsub1();
  }, [user, profile]);

  return (
    <div className="relative">
      <Inbox size={18} />
      {unreadCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
          {unreadCount}
        </span>
      )}
    </div>
  );
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Leadership", path: "/leadership" },
    { 
      name: "Departments", 
      path: "/departments",
      subLinks: [
        { name: "MHQ", path: "/departments/mhq" },
        { name: "FHQ", path: "/departments/fhq" },
        { name: "SENBAT", path: "/departments/senbat" },
        { name: "NIGCOY", path: "/departments/nigcoy" },
        { name: "GHANCOY", path: "/departments/ghancoy" },
        { name: "SENFPU", path: "/departments/senfpu" },
      ]
    },
    { 
      name: "Global News", 
      path: "/news",
      subLinks: [
        { name: "World News", path: "https://news.google.com", external: true },
        { name: "Africa News", path: "https://allafrica.com", external: true },
        { name: "BBC News", path: "https://www.bbc.com/news", external: true },
        { name: "CNN", path: "https://www.cnn.com", external: true },
        { name: "Al Jazeera", path: "https://www.aljazeera.com", external: true },
        { name: "Sports", path: "https://www.bbc.com/sport", external: true },
        { name: "Politics", path: "https://www.reuters.com/politics", external: true },
        { name: "TV Garden", path: "https://tvgarden.com", external: true },
        { name: "Newspaper Reviews", path: "/news#reviews", external: false },
      ]
    },
    { 
      name: "Events", 
      path: "/events",
      subLinks: [
        { name: "ECOWAS Events", path: "/events/ecowas" },
        { name: "MHQ Events", path: "/events/mhq" },
        { name: "FHQ Events", path: "/events/fhq" },
        { name: "SENBAT Events", path: "/events/senbat" },
        { name: "NIGCOY Events", path: "/events/nigcoy" },
        { name: "GHANCOY Events", path: "/events/ghancoy" },
        { name: "SENFPU Events", path: "/events/senfpu" },
        { name: "Training", path: "/events/training" },
      ]
    },
    { name: "Gallery", path: "/gallery" },
    { name: "Mailbox", path: "/mailbox", icon: <MailboxIcon /> },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900 shadow-lg">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex items-center justify-between h-20">
            <Link to="/" className="flex items-center gap-3 flex-shrink-0">
              <EcomigLogo />
              <span className="text-white font-heading text-xl font-bold uppercase tracking-widest hidden lg:block">
                ECOMIG
              </span>
            </Link>

            <div className="hidden lg:flex items-center gap-4 xl:gap-6">
              {navLinks.map((link) => (
                <div key={link.path} className="relative group">
                  <Link 
                    to={link.path} 
                    className="text-white font-medium text-sm uppercase tracking-wider hover:text-green-400 transition-colors flex items-center gap-2 py-4"
                  >
                    {link.icon && link.icon}
                    {link.name}
                    {link.subLinks && <ChevronRight size={14} className="rotate-90" />}
                  </Link>
                  
                  {link.subLinks && (
                    <div className="absolute top-full left-0 w-56 bg-slate-900 border-t-2 border-green-600 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      <div className="flex flex-col">
                        {link.subLinks.map(sub => (
                          sub.external ? (
                            <a 
                              key={sub.path} 
                              href={sub.path} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="px-6 py-3 text-xs text-slate-300 hover:text-white hover:bg-slate-800 uppercase font-bold tracking-widest border-b border-slate-800 last:border-0 flex items-center justify-between"
                            >
                              {sub.name}
                              <ExternalLink size={12} className="opacity-50" />
                            </a>
                          ) : (
                            <Link 
                              key={sub.path} 
                              to={sub.path} 
                              className="px-6 py-3 text-xs text-slate-300 hover:text-white hover:bg-slate-800 uppercase font-bold tracking-widest border-b border-slate-800 last:border-0"
                            >
                              {sub.name}
                            </Link>
                          )
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
              <Link to="/admin" className="bg-green-700 text-white font-bold text-sm px-5 py-2 uppercase tracking-wider hover:bg-green-800 transition-colors flex-shrink-0">
                Admin
              </Link>
            </div>

            <button onClick={() => setIsOpen(true)} className="lg:hidden text-white p-2">
              <Menu size={28} />
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            className="mobile-menu"
          >
            <div className="flex justify-between items-center mb-8">
              <EcomigLogo />
              <button onClick={() => setIsOpen(false)} className="text-white p-2">
                <X size={32} />
              </button>
            </div>
            <nav className="flex flex-col">
              {navLinks.map((link) => (
                <div key={link.path}>
                  <Link to={link.path} onClick={() => setIsOpen(false)} className="mobile-nav-link flex items-center gap-3">
                    {link.icon && link.icon}
                    {link.name}
                  </Link>
                  {link.subLinks && (
                    <div className="pl-6 flex flex-col bg-slate-800/50">
                      {link.subLinks.map(sub => (
                        sub.external ? (
                          <a 
                            key={sub.path} 
                            href={sub.path} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            onClick={() => setIsOpen(false)} 
                            className="py-3 text-slate-400 uppercase text-sm font-bold tracking-widest hover:text-green-400 flex items-center justify-between pr-6"
                          >
                            {sub.name}
                            <ExternalLink size={14} />
                          </a>
                        ) : (
                          <Link 
                            key={sub.path} 
                            to={sub.path} 
                            onClick={() => setIsOpen(false)} 
                            className="py-3 text-slate-400 uppercase text-sm font-bold tracking-widest hover:text-green-400"
                          >
                            {sub.name}
                          </Link>
                        )
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <Link to="/admin" onClick={() => setIsOpen(false)} className="mobile-nav-link text-green-400">
                Admin Portal
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const Footer = () => (
  <footer className="bg-slate-900/95 backdrop-blur-md text-white py-12 border-t border-slate-800">
    <div className="max-w-7xl mx-auto px-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
        <div>
          <EcomigLogo />
          <p className="mt-4 text-slate-400 text-sm">
            ECOWAS Mission in The Gambia - Securing Peace, Building Trust
          </p>
        </div>
        <div>
          <h4 className="font-heading text-lg font-bold uppercase mb-4 text-green-500">Quick Links</h4>
          <div className="flex flex-col gap-2 text-slate-400 text-sm">
            <Link to="/about" className="hover:text-white">About ECOMIG</Link>
            <Link to="/leadership" className="hover:text-white">Leadership</Link>
            <Link to="/news" className="hover:text-white">News</Link>
            <Link to="/contact" className="hover:text-white">Contact</Link>
          </div>
        </div>
        <div>
          <h4 className="font-heading text-lg font-bold uppercase mb-4 text-green-500">Departments</h4>
          <div className="flex flex-col gap-2 text-slate-400 text-sm">
            <Link to="/departments/fhq" className="hover:text-white">FHQ</Link>
            <Link to="/departments/mhq" className="hover:text-white">MHQ</Link>
            <Link to="/departments/senbat" className="hover:text-white">SENBAT</Link>
            <Link to="/departments/nigcoy" className="hover:text-white">NIGCOY</Link>
          </div>
        </div>
        <div>
          <h4 className="font-heading text-lg font-bold uppercase mb-4 text-green-500">Contact</h4>
          <div className="flex flex-col gap-3 text-slate-400 text-sm">
            <div className="flex items-center gap-2"><MapPin size={16} /><span>Banjul, The Gambia</span></div>
            <div className="flex items-center gap-2"><Phone size={16} /><span>+220 360 2206</span></div>
            <div className="flex items-center gap-2"><Mail size={16} /><span>info@ecomig.org</span></div>
            <div className="flex items-center gap-4 mt-2">
              <a href="https://wa.me/2203602206" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-green-500 transition-colors" title="WhatsApp">
                <MessageCircle size={20} />
              </a>
              <a href="https://t.me/ecomig_mission" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-blue-400 transition-colors" title="Telegram">
                <Send size={20} />
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-800 mt-12 pt-8 text-center text-slate-500 text-xs">
        <p>&copy; {new Date().getFullYear()} ECOMIG - ECOWAS Mission in The Gambia. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

const ChatBot = ({ news }: { news: News[] }) => {
  const { profile } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: "user" | "ai", text: string, timestamp: string }[]>([
    { role: "ai", text: "Greetings. I am the ECOMIG Mission AI. How can I assist you today?", timestamp: format(new Date(), "HH:mm:ss") }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    const timestamp = format(new Date(), "HH:mm:ss");
    setMessages(prev => [...prev, { role: "user", text: userMsg, timestamp }]);
    setInput("");
    setLoading(true);

    try {
      const newsContext = news.slice(0, 5).map(n => `Title: ${n.title}\nContent: ${n.summary || n.content}`).join("\n\n");
      const aiResponse = await chatWithGemini(userMsg, newsContext);
      const aiText = aiResponse || "I am unable to process that request at the moment.";
      const aiTimestamp = format(new Date(), "HH:mm:ss");
      
      setMessages(prev => [...prev, { role: "ai", text: aiText, timestamp: aiTimestamp }]);

      if (profile) {
        await addDoc(collection(db, "chat_logs"), {
          user_id: profile.id,
          user_name: profile.full_name,
          user_unit: profile.unit,
          question: userMsg,
          answer: aiText,
          created_at: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { role: "ai", text: "Error: AI service unavailable. Please try again later.", timestamp: format(new Date(), "HH:mm:ss") }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[500] font-mono">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-[350px] md:w-[400px] h-[600px] bg-[#151619]/90 backdrop-blur-md border border-[#2d2e32] rounded-xl shadow-2xl flex flex-col overflow-hidden mb-4"
          >
            {/* Hardware Header */}
            <div className="p-4 bg-[#1a1b1e] border-b border-[#2d2e32] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${loading ? 'bg-amber-500 animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.6)]' : 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]'}`} />
                <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold">Mission AI / System Active</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-white transition-colors">
                <X size={16} />
              </button>
            </div>

            {/* Message Display */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide bg-[#0d0e10]">
              {messages.map((m, i) => (
                <div key={i} className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[9px] text-slate-500 uppercase tracking-widest">{m.role === "user" ? "Personnel" : "AI-Unit"}</span>
                    <span className="text-[9px] text-slate-600">[{m.timestamp}]</span>
                  </div>
                  <div className={`max-w-[85%] p-3 rounded-lg text-sm leading-relaxed ${
                    m.role === "user" 
                      ? "bg-[#2d2e32] text-slate-200 border-r-2 border-green-600" 
                      : "bg-[#1a1b1e] text-green-400 border-l-2 border-green-800"
                  }`}>
                    {m.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex items-center gap-2 text-green-700">
                  <span className="text-[10px] animate-pulse">ANALYZING MISSION DATA...</span>
                </div>
              )}
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="p-4 bg-[#1a1b1e] border-t border-[#2d2e32]">
              <div className="relative">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="ENTER COMMAND OR QUERY..."
                  className="w-full bg-[#0d0e10] border border-[#2d2e32] rounded p-3 text-xs text-green-500 focus:outline-none focus:border-green-800 placeholder:text-slate-700 uppercase tracking-wider"
                />
                <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-green-800 hover:text-green-500 transition-colors">
                  <Send size={18} />
                </button>
              </div>
              <div className="mt-2 flex justify-between items-center">
                <span className="text-[8px] text-slate-600 uppercase tracking-widest">Secure Channel 04-Alpha</span>
                <span className="text-[8px] text-slate-600 uppercase tracking-widest">ECOMIG-HQ-GAMBIA</span>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className={`w-16 h-16 rounded-full shadow-2xl transition-all duration-300 flex items-center justify-center bg-[#151619] border-2 border-green-800 text-green-500 shadow-[0_0_20px_rgba(34,197,94,0.2)] hover:scale-110 hover:border-green-500 group`}
      >
        <div className="absolute inset-0 rounded-full border border-green-500/20 animate-ping" />
        {isOpen ? <X size={28} /> : <MessageCircle size={28} className="group-hover:rotate-12 transition-transform" />}
      </button>
    </div>
  );
};

// --- PAGES ---
const HomePage = () => {
  const [news, setNews] = useState<News[]>([]);
  const [docs, setDocs] = useState<MissionDocument[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const qNews = query(collection(db, "news"), orderBy("created_at", "desc"), limit(3));
    const unsubNews = onSnapshot(qNews, (snapshot) => {
      setNews(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as News)));
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, "news");
    });

    const qDocs = query(collection(db, "documents"), orderBy("created_at", "desc"), limit(6));
    const unsubDocs = onSnapshot(qDocs, (snapshot) => {
      setDocs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MissionDocument)));
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, "documents");
    });

    return () => { unsubNews(); unsubDocs(); };
  }, []);

  return (
    <div className="min-h-screen relative">
      <ChatBot news={news} />
      <section className="hero-section">
        <div className="hero-overlay bg-black/40" />
        <div className="relative z-10 max-w-7xl mx-auto px-8 text-center text-white">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <img src="https://customer-assets.emergentagent.com/job_secure-comms-36/artifacts/yxcc2zx2_image.png" alt="ECOMIG Logo" className="h-32 md:h-40 mx-auto mb-6" referrerPolicy="no-referrer" />
            <h1 className="font-heading text-5xl md:text-8xl font-bold uppercase tracking-tighter mb-4">ECOMIG</h1>
            <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto font-light">
              ECOWAS Mission in The Gambia - Securing Peace, Building Trust, Strengthening Democracy
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/about" className="btn-primary">Learn More</Link>
              <Link to="/contact" className="btn-secondary border-white text-white hover:bg-white hover:text-slate-900">Contact Us</Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-12 bg-slate-900">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link to="/gallery" className="flex items-center justify-center gap-3 bg-green-900 text-white p-6 hover:bg-green-800 transition-colors">
              <ImageIcon size={24} /><span className="font-heading text-xl font-bold uppercase">Gallery</span>
            </Link>
            <Link to="/news" className="flex items-center justify-center gap-3 bg-slate-800 text-white p-6 hover:bg-slate-700 transition-colors">
              <Newspaper size={24} /><span className="font-heading text-xl font-bold uppercase">News</span>
            </Link>
            <Link to="/events" className="flex items-center justify-center gap-3 bg-red-900 text-white p-6 hover:bg-red-800 transition-colors">
              <Calendar size={24} /><span className="font-heading text-xl font-bold uppercase">Events</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Mission Leadership Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="section-title">Mission Leadership</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">The dedicated leaders guiding ECOMIG's mission for peace and stability in The Gambia.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-20">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl overflow-hidden shadow-xl border border-slate-100 group"
            >
              <div className="aspect-[4/5] overflow-hidden">
                <img 
                  src="/miatta.jpg" 
                  alt="H.E Miatta Lily French" 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-8 text-center">
                <span className="inline-block px-3 py-1 bg-green-100 text-green-800 text-[10px] font-bold uppercase tracking-widest rounded-full mb-4">Head of Mission</span>
                <h3 className="font-heading text-2xl font-bold text-slate-900">H.E Miatta Lily French</h3>
                <p className="text-slate-500 mt-2 text-sm">Head of Mission in The Gambia</p>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl overflow-hidden shadow-xl border border-slate-100 group"
            >
              <div className="aspect-[4/5] overflow-hidden">
                <img 
                  src="https://picsum.photos/seed/tine/800/1000" 
                  alt="Col A Tine" 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-8 text-center">
                <span className="inline-block px-3 py-1 bg-green-100 text-green-800 text-[10px] font-bold uppercase tracking-widest rounded-full mb-4">Force Commander</span>
                <h3 className="font-heading text-2xl font-bold text-slate-900">Col A Tine</h3>
                <p className="text-slate-500 mt-2 text-sm">Force Commander ECOMIG</p>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl overflow-hidden shadow-xl border border-slate-100 group"
            >
              <div className="aspect-[4/5] overflow-hidden">
                <img 
                  src="https://picsum.photos/seed/okeniyi/800/1000" 
                  alt="Col KH Okeniyi" 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-8 text-center">
                <span className="inline-block px-3 py-1 bg-green-100 text-green-800 text-[10px] font-bold uppercase tracking-widest rounded-full mb-4">Deputy Force Commander</span>
                <h3 className="font-heading text-2xl font-bold text-slate-900">Col KH Okeniyi</h3>
                <p className="text-slate-500 mt-2 text-sm">Deputy Force Commander</p>
              </div>
            </motion.div>
          </div>

          {/* Staff Officers Poster Section */}
          <div className="mt-20">
            <div className="text-center mb-12">
              <h3 className="font-heading text-3xl font-bold uppercase text-slate-900">Staff Officers</h3>
              <div className="h-1 w-20 bg-green-700 mx-auto mt-4"></div>
            </div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto bg-white p-4 rounded-2xl shadow-2xl border border-slate-200"
            >
              <img 
                src="https://picsum.photos/seed/staff/1200/1600" 
                alt="ECOMIG Staff Officers" 
                className="w-full h-auto rounded-xl"
                referrerPolicy="no-referrer"
              />
              <div className="mt-6 text-center p-4">
                <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">ECOMIG Newsletter | 4th Edition</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="section-title">Latest News</h2>
          </div>

          {/* Featured Link */}
          <div className="mb-12 bg-slate-50/80 backdrop-blur-md border-l-8 border-green-800 p-8 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-heading text-2xl font-bold uppercase text-slate-900">ECOMIG Web Portal Live</h3>
              <p className="text-slate-600 mt-2">The official ECOMIG web portal is now live and accessible to the public.</p>
            </div>
            <a 
              href="https://ecomig-portal.onrender.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn-primary whitespace-nowrap"
            >
              Visit Official Portal
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {news.map((item) => (
              <div key={item.id} className="news-card">
                <img src={item.image_url || "https://picsum.photos/seed/news/800/400"} alt={item.title} referrerPolicy="no-referrer" />
                <div className="p-6">
                  <span className="badge badge-green">{item.category}</span>
                  <h3 className="font-heading text-xl font-bold mt-3 mb-2">{item.title}</h3>
                  <p className="text-slate-600 text-sm line-clamp-2 mb-4">{item.summary || item.content}</p>
                  <Link to={`/news/${item.id}`} className="text-green-700 font-bold text-sm flex items-center gap-1 hover:text-green-900">
                    Read More <ChevronRight size={16} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link to="/news" className="btn-primary">View All News</Link>
          </div>

          <div className="mt-24">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="section-title text-left mb-4">Document Library</h2>
                <p className="text-slate-600 max-w-2xl">Access official SOPs, mission manuals, and ECOWAS directives.</p>
              </div>
              <div className="hidden md:flex gap-2">
                {["SOP", "Manual", "Directive", "Report"].map(cat => (
                  <span key={cat} className="px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-widest rounded border border-slate-200">{cat}</span>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {docs.map((doc) => (
                <motion.div 
                  key={doc.id}
                  whileHover={{ y: -5 }}
                  className="bg-white border border-slate-200 p-6 rounded-lg flex items-start gap-4 group cursor-pointer shadow-sm hover:shadow-md transition-all"
                  onClick={() => window.open(doc.file_url, '_blank')}
                >
                  <div className="p-3 bg-slate-100 rounded text-green-700 group-hover:bg-green-700 group-hover:text-white transition-colors">
                    <FileText size={24} />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">{doc.category}</span>
                    <h3 className="text-slate-900 font-bold mb-2 group-hover:text-green-700 transition-colors">{doc.title}</h3>
                    <div className="flex items-center gap-2 text-slate-400 text-xs">
                      <Download size={12} />
                      <span>Download PDF</span>
                    </div>
                  </div>
                </motion.div>
              ))}
              {docs.length === 0 && (
                <div className="col-span-full py-12 text-center text-slate-400 border-2 border-dashed border-slate-200 rounded-xl">
                  No documents available in the library.
                </div>
              )}
            </div>
          </div>

          <div className="mt-24 text-center">
            <h2 className="section-title">Upcoming Events</h2>
          </div>

          <div className="mt-12 bg-white/80 backdrop-blur-md border-l-8 border-red-800 p-8 shadow-xl rounded-r-lg flex flex-col md:flex-row gap-8 items-center">
            <div className="flex-shrink-0 bg-red-900 text-white p-6 text-center w-32 rounded-lg shadow-lg">
              <div className="font-heading text-4xl font-bold">22</div>
              <div className="text-sm uppercase font-bold">Mar</div>
            </div>
            <div className="flex-1">
              <span className="badge badge-red">Change of Command</span>
              <h3 className="font-heading text-2xl font-bold mt-3 text-slate-900 uppercase">Colonel Aliou Tine Takes over as New Force Commander</h3>
              <p className="text-slate-600 mt-4">
                Colonel Aliou Tine has officially taken over as the new Force Commander of the ECOWAS Mission in The Gambia (ECOMIG).
              </p>
              <div className="mt-6 flex flex-wrap gap-4 items-center">
                <Link to="/events" className="btn-primary">View All Events</Link>
                <a 
                  href="https://africa24tv.com/colonel-aliou-tine-takes-over-as-new-economic-community-of-west-african-states-mission-in-the-gambia-force-commander/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-red-700 font-bold hover:underline flex items-center gap-2 text-sm"
                >
                  Read Full Story <ExternalLink size={16} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const AboutPage = () => (
  <div className="min-h-screen pt-20">
    <PageHeader 
      title="About ECOMIG" 
      subtitle="The ECOWAS Mission in The Gambia - Securing peace, supporting democracy"
      icon={<Shield size={32} />}
    />
    <section className="py-20 bg-white/80 backdrop-blur-md shadow-xl mt-[-40px] relative z-10 max-w-7xl mx-auto rounded-lg">
      <div className="max-w-4xl mx-auto px-8">
        <h2 className="section-title">Our History</h2>
        <p className="text-slate-600 leading-relaxed mb-8 text-lg">
          The ECOWAS Mission in The Gambia (ECOMIG) was established in January 2017 following the political crisis in The Gambia. 
          The mission was deployed to support the peaceful transition of power and ensure the safety of the Gambian people during a critical period in the nation's history.
        </p>
        <p className="text-slate-600 leading-relaxed mb-12 text-lg">
          ECOMIG comprises military contingents from several ECOWAS member states, including Senegal, Nigeria, Ghana, and others. 
          The mission operates under the mandate of the ECOWAS Authority of Heads of State and Government.
        </p>
        <h2 className="section-title">Our Mandate</h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            "Maintain peace and stability in The Gambia",
            "Support democratic governance and constitutional order",
            "Provide a secure environment for citizens and institutions",
            "Coordinate with Gambian security forces for national security",
            "Support security sector reform initiatives",
            "Provide security for the President and Government institutions"
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-3 bg-slate-50/80 backdrop-blur-sm p-4 border-l-4 border-green-700">
              <Shield className="text-green-700 mt-1 flex-shrink-0" size={20} />
              <span className="text-slate-700 font-medium">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  </div>
);

const MailboxPage = () => {
  const { user, profile } = useAuth();
  const [messages, setMessages] = useState<InternalMail[]>([]);
  const [sentMessages, setSentMessages] = useState<InternalMail[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"inbox" | "sent" | "compose">("inbox");
  const [selectedMessage, setSelectedMessage] = useState<InternalMail | null>(null);
  
  // Compose state
  const [recipientType, setRecipientType] = useState<"user" | "unit">("unit");
  const [recipientId, setRecipientId] = useState("");
  const [recipientUnit, setRecipientUnit] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [sending, setSending] = useState(false);

  const units = [
    "MHQ", "FHQ", "FC", "DFC", "J1/4 CELL", "J2 CELL", "J3/5 CELL", 
    "J6 CELL", "J7/9 CELL", "PM", "PIO", "SENBAT", "NIGCOY", "GHANCOY", "SENFPU"
  ];

  useEffect(() => {
    if (!user || !profile) return;

    // Inbox: Messages sent to me OR to my unit
    const qInbox = query(
      collection(db, "internal_mail"),
      where("receiver_id", "==", user.uid),
      orderBy("created_at", "desc")
    );

    const qUnitInbox = query(
      collection(db, "internal_mail"),
      where("receiver_unit", "==", profile.unit),
      orderBy("created_at", "desc")
    );

    const unsubInbox = onSnapshot(qInbox, (snap) => {
      const personal = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as InternalMail));
      setMessages(prev => {
        const others = prev.filter(m => m.receiver_unit === profile.unit);
        return [...personal, ...others].sort((a, b) => b.created_at.localeCompare(a.created_at));
      });
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, "internal_mail");
    });

    const unsubUnitInbox = onSnapshot(qUnitInbox, (snap) => {
      const unitMails = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as InternalMail));
      setMessages(prev => {
        const others = prev.filter(m => m.receiver_id === user.uid);
        return [...unitMails, ...others].sort((a, b) => b.created_at.localeCompare(a.created_at));
      });
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, "internal_mail");
    });

    // Sent: Messages sent by me
    const qSent = query(
      collection(db, "internal_mail"),
      where("sender_id", "==", user.uid),
      orderBy("created_at", "desc")
    );

    const unsubSent = onSnapshot(qSent, (snap) => {
      setSentMessages(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as InternalMail)));
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, "internal_mail");
    });

    return () => { unsubInbox(); unsubUnitInbox(); unsubSent(); };
  }, [user, profile]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !profile) return;
    setSending(true);

    try {
      const uploadedAttachments: InternalMailAttachment[] = [];
      
      for (const file of attachments) {
        const storageRef = ref(storage, `mail_attachments/${user.uid}/${Date.now()}_${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);
        const snapshot = await new Promise<any>((resolve, reject) => {
          uploadTask.on('state_changed', null, reject, () => resolve(uploadTask.snapshot));
        });
        const url = await getDownloadURL(snapshot.ref);
        uploadedAttachments.push({
          name: file.name,
          url,
          type: file.type,
          size: file.size
        });
      }

      const newMail: Omit<InternalMail, "id"> = {
        sender_id: user.uid,
        sender_name: profile.full_name,
        sender_unit: profile.unit,
        subject,
        body,
        is_read: false,
        attachments: uploadedAttachments,
        created_at: new Date().toISOString()
      };

      if (recipientType === "user") {
        newMail.receiver_id = recipientId;
      } else {
        newMail.receiver_unit = recipientUnit;
      }

      await addDoc(collection(db, "internal_mail"), newMail);
      setSubject("");
      setBody("");
      setRecipientId("");
      setRecipientUnit("");
      setAttachments([]);
      setActiveTab("sent");
      alert("Message sent successfully!");
    } catch (error) {
      console.error("Error sending mail:", error);
      alert("Failed to send message.");
    } finally {
      setSending(false);
    }
  };

  const markAsRead = async (msg: InternalMail) => {
    if (msg.is_read) return;
    try {
      await updateDoc(doc(db, "internal_mail", msg.id), { is_read: true });
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  if (!user) return <div className="pt-32 text-center">Please login to access the mailbox.</div>;

  return (
    <div className="min-h-screen pt-20 bg-slate-50">
      <PageHeader 
        title="Internal Mail" 
        subtitle="Secure communication channel for departments and personnel"
        icon={<Inbox size={32} />}
      />

      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-slate-200">
              <div className="p-4 bg-slate-100 border-b border-slate-200">
                <button 
                  onClick={() => { setActiveTab("compose"); setSelectedMessage(null); }}
                  className="w-full btn-primary flex items-center justify-center gap-2"
                >
                  <Plus size={18} /> Compose
                </button>
              </div>
              <nav className="flex flex-col">
                <button 
                  onClick={() => { setActiveTab("inbox"); setSelectedMessage(null); }}
                  className={`flex items-center gap-3 px-6 py-4 text-sm font-bold uppercase tracking-widest transition-colors ${activeTab === "inbox" ? "bg-green-50 text-green-700 border-r-4 border-green-600" : "text-slate-600 hover:bg-slate-50"}`}
                >
                  <Inbox size={18} /> Inbox ({messages.filter(m => !m.is_read).length})
                </button>
                <button 
                  onClick={() => { setActiveTab("sent"); setSelectedMessage(null); }}
                  className={`flex items-center gap-3 px-6 py-4 text-sm font-bold uppercase tracking-widest transition-colors ${activeTab === "sent" ? "bg-green-50 text-green-700 border-r-4 border-green-600" : "text-slate-600 hover:bg-slate-50"}`}
                >
                  <Send size={18} /> Sent
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === "compose" ? (
              <div className="bg-white rounded-xl shadow-md p-8 border border-slate-200">
                <h2 className="font-heading text-2xl font-bold mb-6 uppercase">New Message</h2>
                <form onSubmit={handleSendMessage} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Recipient Type</label>
                      <div className="flex gap-4">
                        <button 
                          type="button"
                          onClick={() => setRecipientType("unit")}
                          className={`flex-1 py-2 rounded-lg border-2 font-bold text-xs uppercase transition-all ${recipientType === "unit" ? "border-green-600 bg-green-50 text-green-700" : "border-slate-200 text-slate-400"}`}
                        >
                          Department/Unit
                        </button>
                        <button 
                          type="button"
                          onClick={() => setRecipientType("user")}
                          className={`flex-1 py-2 rounded-lg border-2 font-bold text-xs uppercase transition-all ${recipientType === "user" ? "border-green-600 bg-green-50 text-green-700" : "border-slate-200 text-slate-400"}`}
                        >
                          Individual User
                        </button>
                      </div>
                    </div>
                    <div>
                      {recipientType === "unit" ? (
                        <>
                          <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Select Department</label>
                          <select 
                            required
                            value={recipientUnit}
                            onChange={(e) => setRecipientUnit(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none"
                          >
                            <option value="">-- Select Unit --</option>
                            {units.map(u => <option key={u} value={u}>{u}</option>)}
                          </select>
                        </>
                      ) : (
                        <>
                          <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Recipient User ID</label>
                          <input 
                            required
                            type="text"
                            value={recipientId}
                            onChange={(e) => setRecipientId(e.target.value)}
                            placeholder="Enter User UID"
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none"
                          />
                        </>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Subject</label>
                    <input 
                      required
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Message Body</label>
                    <textarea 
                      required
                      rows={8}
                      value={body}
                      onChange={(e) => setBody(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Attachments</label>
                    <div className="flex flex-col gap-2">
                      <input 
                        type="file" 
                        multiple 
                        onChange={(e) => {
                          if (e.target.files) {
                            setAttachments(Array.from(e.target.files));
                          }
                        }}
                        className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                      />
                      {attachments.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {attachments.map((f, i) => (
                            <div key={i} className="flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-full text-xs font-medium text-slate-600 border border-slate-200">
                              <FileText size={12} /> {f.name} ({(f.size / 1024).toFixed(1)} KB)
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button type="submit" disabled={sending} className="btn-primary flex items-center gap-2">
                      {sending ? "Sending..." : <><Send size={18} /> Send Message</>}
                    </button>
                  </div>
                </form>
              </div>
            ) : selectedMessage ? (
              <div className="bg-white rounded-xl shadow-md overflow-hidden border border-slate-200">
                <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                  <button 
                    onClick={() => setSelectedMessage(null)}
                    className="text-slate-500 hover:text-slate-900 flex items-center gap-2 text-sm font-bold uppercase"
                  >
                    <ChevronRight size={18} className="rotate-180" /> Back to List
                  </button>
                  <div className="text-xs text-slate-400 font-mono">
                    {format(new Date(selectedMessage.created_at), "MMM d, yyyy HH:mm")}
                  </div>
                </div>
                <div className="p-8">
                  <div className="mb-8">
                    <h2 className="font-heading text-3xl font-bold text-slate-900">{selectedMessage.subject}</h2>
                    <div className="flex items-center gap-4 mt-4">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold text-xl">
                        {selectedMessage.sender_name[0]}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">{selectedMessage.sender_name}</div>
                        <div className="text-xs text-slate-500 uppercase tracking-widest">
                          From: {selectedMessage.sender_unit} 
                          {selectedMessage.receiver_unit && ` | To: ${selectedMessage.receiver_unit}`}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="prose max-w-none text-slate-700 whitespace-pre-wrap border-t border-slate-100 pt-8 pb-8">
                    {selectedMessage.body}
                  </div>

                  {selectedMessage.attachments && selectedMessage.attachments.length > 0 && (
                    <div className="mt-8 pt-8 border-t border-slate-100">
                      <h4 className="text-xs font-bold uppercase text-slate-400 mb-4 flex items-center gap-2">
                        <Folder size={14} /> Attachments ({selectedMessage.attachments.length})
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedMessage.attachments.map((att, i) => (
                          <a 
                            key={i} 
                            href={att.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-lg hover:border-green-500 hover:shadow-md transition-all group"
                          >
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-slate-100 rounded text-slate-500 group-hover:bg-green-50 group-hover:text-green-600">
                                <FileText size={20} />
                              </div>
                              <div className="min-w-0">
                                <div className="text-sm font-bold text-slate-700 truncate max-w-[150px]">{att.name}</div>
                                <div className="text-xs text-slate-400">{(att.size / 1024).toFixed(1)} KB</div>
                              </div>
                            </div>
                            <Download size={18} className="text-slate-400 group-hover:text-green-600" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-md overflow-hidden border border-slate-200">
                <div className="p-4 bg-slate-50 border-b border-slate-200">
                  <h2 className="font-heading text-xl font-bold uppercase text-slate-900">
                    {activeTab === "inbox" ? "Inbox" : "Sent Messages"}
                  </h2>
                </div>
                <div className="divide-y divide-slate-100">
                  {loading ? (
                    <div className="p-12 text-center text-slate-400">Loading messages...</div>
                  ) : (activeTab === "inbox" ? messages : sentMessages).length === 0 ? (
                    <div className="p-12 text-center text-slate-400">No messages found.</div>
                  ) : (activeTab === "inbox" ? messages : sentMessages).map(msg => (
                    <div 
                      key={msg.id} 
                      onClick={() => { setSelectedMessage(msg); markAsRead(msg); }}
                      className={`p-6 hover:bg-slate-50 cursor-pointer transition-colors flex items-center gap-6 ${activeTab === "inbox" && !msg.is_read ? "bg-green-50/30 border-l-4 border-green-600" : ""}`}
                    >
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${activeTab === "inbox" && !msg.is_read ? "bg-green-600 text-white" : "bg-slate-200 text-slate-600"}`}>
                        {msg.sender_name[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className={`text-sm font-bold truncate ${activeTab === "inbox" && !msg.is_read ? "text-slate-900" : "text-slate-600"}`}>
                            {msg.sender_name} <span className="text-xs font-normal text-slate-400 uppercase ml-2">({msg.sender_unit})</span>
                          </h3>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {format(new Date(msg.created_at), "MMM d")}
                          </span>
                        </div>
                        <div className={`text-sm font-bold truncate flex items-center gap-2 ${activeTab === "inbox" && !msg.is_read ? "text-slate-900" : "text-slate-500"}`}>
                          {msg.subject}
                          {msg.attachments && msg.attachments.length > 0 && <Folder size={12} className="text-slate-400" />}
                        </div>
                        <div className="text-xs text-slate-400 truncate mt-1">
                          {msg.body}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const LeadershipPage = () => {
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "leaders"), orderBy("order", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setLeaders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Leader)));
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, "leaders");
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen pt-20">
      <PageHeader 
        title="Leadership" 
        subtitle="The dedicated leaders guiding ECOMIG's mission for peace and stability"
        icon={<Users size={32} />}
      />
      <section className="py-20 bg-white/80 backdrop-blur-md shadow-xl mt-[-40px] relative z-10 max-w-7xl mx-auto rounded-lg">
        <div className="max-w-7xl mx-auto px-8">
          {loading ? <div className="text-center">Loading...</div> : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {leaders.map(leader => (
                <div key={leader.id} className="card overflow-hidden group">
                  <div className="aspect-[3/4] overflow-hidden">
                    <img src={leader.image_url || "https://picsum.photos/seed/leader/400/500"} alt={leader.name} className="w-full h-full object-cover transition-transform group-hover:scale-105" referrerPolicy="no-referrer" />
                  </div>
                  <div className="p-8">
                    <span className="badge badge-green">{leader.position}</span>
                    <h3 className="font-heading text-2xl font-bold mt-4 text-slate-900">{leader.title}</h3>
                    <p className="text-green-800 font-bold text-lg">{leader.name}</p>
                    <p className="text-slate-500 text-sm mt-4 leading-relaxed">{leader.bio}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

const DepartmentDetailPage = () => {
  const { code } = useParams<{ code: string }>();
  const [department, setDepartment] = useState<Department | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!code) return;
    // Fetch all departments and find the match in the client to be case-insensitive and handle special characters
    const unsubscribe = onSnapshot(collection(db, "departments"), (snapshot) => {
      const allDepts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Department));
      // Replace dashes back to slashes for comparison if needed, or just compare normalized
      const match = allDepts.find(d => {
        const normalizedCode = d.code.toUpperCase().replace(/\//g, '-');
        return normalizedCode === decodeURIComponent(code).toUpperCase();
      });
      if (match) {
        setDepartment(match);
      } else {
        setDepartment(null);
      }
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, "departments");
      setLoading(false);
    });
    return () => unsubscribe();
  }, [code]);

  if (loading) return <div className="min-h-screen pt-40 text-center text-white">Loading Department Details...</div>;
  if (!department) return <div className="min-h-screen pt-40 text-center text-white">Department Not Found</div>;

  return (
    <div className="min-h-screen pt-20">
      <PageHeader 
        title={department.code} 
        subtitle={department.name}
        icon={<Landmark size={32} />}
        breadcrumb={
          <Link to="/departments" className="text-green-400 flex items-center gap-2 mb-6 hover:underline font-bold uppercase tracking-widest text-xs">
            <ArrowLeft size={16} /> Back to Departments
          </Link>
        }
      />
      
      <section className="py-20 bg-white/80 backdrop-blur-md shadow-xl mt-[-40px] relative z-10 max-w-7xl mx-auto rounded-lg">
        <div className="max-w-4xl mx-auto px-8">
          <div className="prose prose-lg max-w-none">
            <div className="bg-slate-50 p-8 rounded-xl border border-slate-100 mb-12">
              <h3 className="text-xl font-bold text-slate-900 mb-4 uppercase tracking-tight">Mission & Responsibilities</h3>
              <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{department.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3 mb-4 text-green-800">
                  <Shield size={24} />
                  <h4 className="font-bold uppercase">Operational Mandate</h4>
                </div>
                <p className="text-sm text-slate-600">This unit operates under the direct command of the Force Headquarters, ensuring adherence to ECOWAS protocols and mission-specific directives.</p>
              </div>
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3 mb-4 text-green-800">
                  <Users size={24} />
                  <h4 className="font-bold uppercase">Personnel & Staffing</h4>
                </div>
                <p className="text-sm text-slate-600">Comprised of specialized officers and personnel from ECOWAS member states, working in a multinational environment to achieve mission objectives.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const DepartmentsPage = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "departments"), (snapshot) => {
      setDepartments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Department)));
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, "departments");
    });
    return () => unsubscribe();
  }, []);

  const seniorityOrder = [
    "MHQ", "FHQ", "SENBAT", "NIGCOY", "GHANCOY", "SENFPU"
  ];

  const fhqSubCells = [
    "FC", "DFC", "J1/4 CELL", "J2 CELL", "J3/5 CELL", "J6 CELL", "J7/9 CELL", "PM", "PIO"
  ];

  const getDeptByCode = (code: string) => departments.find(d => d.code.toUpperCase() === code.toUpperCase());

  return (
    <div className="min-h-screen pt-20">
      <PageHeader 
        title="Departments" 
        subtitle="The organizational structure of ECOMIG arranged by seniority"
        icon={<Landmark size={32} />}
      />
      
      <section className="py-20 bg-white/80 backdrop-blur-md shadow-xl mt-[-40px] relative z-10 max-w-7xl mx-auto rounded-lg">
        <div className="max-w-7xl mx-auto px-8 space-y-16">
          {seniorityOrder.map(code => {
            const dept = getDeptByCode(code);
            if (!dept) return null;

            return (
              <Link key={dept.id} to={`/departments/${dept.code.toLowerCase().replace(/\//g, '-')}`} id={code.toLowerCase()} className="block scroll-mt-24 group">
                <div className="flex items-center gap-6 mb-8">
                  <div className="h-px flex-1 bg-slate-200"></div>
                  <h2 className="font-heading text-4xl font-bold uppercase text-slate-900 tracking-tighter group-hover:text-green-700 transition-colors">{dept.code}</h2>
                  <div className="h-px flex-1 bg-slate-200"></div>
                </div>
                
                <div className="bg-slate-50 rounded-xl p-8 border border-slate-100 shadow-sm group-hover:shadow-md transition-all group-hover:border-green-200">
                  <h3 className="text-2xl font-bold text-green-800 mb-4 flex items-center justify-between">
                    {dept.name}
                    <ArrowRight className="opacity-0 group-hover:opacity-100 transition-opacity" size={24} />
                  </h3>
                  <p className="text-slate-600 leading-relaxed max-w-4xl">{dept.description}</p>
                </div>

                {code === "FHQ" && (
                  <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {fhqSubCells.map(subCode => {
                      const subDept = getDeptByCode(subCode);
                      if (!subDept) return null;
                      return (
                        <Link key={subDept.id} to={`/departments/${subDept.code.toLowerCase().replace(/\//g, '-')}`} className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-all hover:border-green-300">
                          <h4 className="font-heading text-xl font-bold text-green-700 uppercase">{subDept.code}</h4>
                          <p className="text-slate-900 font-bold text-sm mt-1">{subDept.name}</p>
                          <p className="text-slate-500 text-xs mt-3 line-clamp-3">{subDept.description}</p>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </Link>
            );
          })}

          {/* Other departments not in seniority list */}
          {departments.filter(d => !seniorityOrder.includes(d.code.toUpperCase()) && !fhqSubCells.includes(d.code.toUpperCase())).length > 0 && (
            <div>
              <div className="flex items-center gap-6 mb-8">
                <div className="h-px flex-1 bg-slate-200"></div>
                <h2 className="font-heading text-2xl font-bold uppercase text-slate-400 tracking-widest">Other Units</h2>
                <div className="h-px flex-1 bg-slate-200"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {departments.filter(d => !seniorityOrder.includes(d.code.toUpperCase()) && !fhqSubCells.includes(d.code.toUpperCase())).map(dept => (
                  <Link key={dept.id} to={`/departments/${dept.code.toLowerCase().replace(/\//g, '-')}`} className="dept-card group">
                    <h3 className="font-heading text-2xl font-bold uppercase text-green-400 group-hover:text-white transition-colors">{dept.code}</h3>
                    <p className="text-white font-bold mt-1 text-xs">{dept.name}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

const NewsPage = () => {
  const { category } = useParams<{ category?: string }>();
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "news"), orderBy("created_at", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      let fetchedNews = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as News));
      
      if (category) {
        const normalizedCategory = category.toUpperCase();
        fetchedNews = fetchedNews.filter(n => 
          n.category?.toUpperCase() === normalizedCategory || 
          n.title.toUpperCase().includes(normalizedCategory) ||
          n.content.toUpperCase().includes(normalizedCategory)
        );
      }
      
      setNews(fetchedNews);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, "news");
      setLoading(false);
    });
    return () => unsubscribe();
  }, [category]);

  const pageTitle = category ? `${category.toUpperCase()} NEWS` : "NEWS";

  return (
    <div className="min-h-screen pt-20">
      <PageHeader 
        title={pageTitle} 
        subtitle={category ? `Latest updates and reports on ${category.toUpperCase()}` : "Latest updates and announcements from ECOMIG"}
        icon={<Newspaper size={32} />}
      />
      <section className="py-20 bg-white/80 backdrop-blur-md shadow-xl mt-[-40px] relative z-10 max-w-7xl mx-auto rounded-lg">
        <div className="max-w-7xl mx-auto px-8">
          {/* Sub-navigation for categories - External Links */}
          <div className="mt-12 flex flex-wrap gap-4">
            <Link to="/news" className={`px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider transition-all ${!category ? 'bg-green-700 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>
              ECOMIG News
            </Link>
            {[
              { name: "World", url: "https://news.google.com" },
              { name: "Africa", url: "https://allafrica.com" },
              { name: "BBC", url: "https://www.bbc.com/news" },
              { name: "CNN", url: "https://www.cnn.com" },
              { name: "Al Jazeera", url: "https://www.aljazeera.com" },
              { name: "Sports", url: "https://www.bbc.com/sport" },
              { name: "Politics", url: "https://www.reuters.com/politics" }
            ].map(cat => (
              <a 
                key={cat.name} 
                href={cat.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider transition-all bg-slate-800 text-slate-400 hover:bg-slate-700 flex items-center gap-2"
              >
                {cat.name}
                <ExternalLink size={12} />
              </a>
            ))}
          </div>

          {/* Global News Network Section */}
          <div className="mb-16">
            <div className="flex items-center gap-4 mb-8">
              <Globe className="text-green-700" size={32} />
              <h2 className="font-heading text-3xl font-bold uppercase text-slate-900">Global News Network</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              {[
                { name: "World News", url: "https://news.google.com", icon: Globe },
                { name: "Africa News", url: "https://allafrica.com", icon: MapPin },
                { name: "BBC News", url: "https://www.bbc.com/news", icon: Newspaper },
                { name: "CNN", url: "https://www.cnn.com", icon: Radio },
                { name: "Al Jazeera", url: "https://www.aljazeera.com", icon: Tv },
                { name: "TV Garden", url: "https://tvgarden.com", icon: Globe },
                { name: "Sports", url: "https://www.bbc.com/sport", icon: Trophy },
                { name: "Politics", url: "https://www.reuters.com/politics", icon: Landmark }
              ].map(site => (
                <a 
                  key={site.name} 
                  href={site.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-xl border border-slate-100 hover:bg-green-50 hover:border-green-200 transition-all group text-center"
                >
                  <site.icon className="text-slate-400 group-hover:text-green-700 mb-3 transition-colors" size={24} />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-600 group-hover:text-green-900">{site.name}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Newspaper Reviews Section */}
          <div id="reviews" className="mb-16 scroll-mt-24">
            <div className="flex items-center gap-4 mb-8">
              <Newspaper className="text-green-700" size={32} />
              <h2 className="font-heading text-3xl font-bold uppercase text-slate-900">Newspaper Reviews</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: "The Point", url: "https://thepoint.gm", description: "Independent news covering The Gambia and the sub-region." },
                { name: "Foroyaa", url: "https://foroyaa.net", description: "In-depth investigative journalism and socio-political analysis." },
                { name: "The Standard", url: "https://standard.gm", description: "Daily news, sports, and business updates from The Gambia." },
                { name: "Vanguard", url: "https://www.vanguardngr.com", description: "Leading Nigerian newspaper with comprehensive regional coverage." },
                { name: "Sahara Reporters", url: "http://saharareporters.com", description: "Investigative journalism focusing on West African news and politics." },
                { name: "Daily News", url: "https://dailynews.gm", description: "Comprehensive coverage of local and international events." }
              ].map(paper => (
                <a 
                  key={paper.name} 
                  href={paper.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-6 bg-white rounded-xl border border-slate-200 hover:border-green-400 hover:shadow-lg transition-all group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-heading text-xl font-bold text-slate-900 group-hover:text-green-800 transition-colors uppercase">{paper.name}</h3>
                    <ExternalLink size={16} className="text-slate-300 group-hover:text-green-600" />
                  </div>
                  <p className="text-slate-500 text-sm leading-relaxed">{paper.description}</p>
                  <div className="mt-4 text-xs font-bold text-green-700 uppercase tracking-widest flex items-center gap-2">
                    Read Review <ArrowRight size={12} />
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Useful Links Section - Only show on main news page */}
          {!category && (
            <div className="mb-16 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-slate-50/80 backdrop-blur-sm border-l-8 border-green-800 p-8 shadow-lg">
                <h2 className="font-heading text-2xl font-bold uppercase mb-4 text-slate-900">Official Portal</h2>
                <p className="text-slate-600 mb-6 text-sm">The official ECOMIG web portal is now live. Access it directly below:</p>
                <a 
                  href="https://ecomig-portal.onrender.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn-primary inline-block text-sm"
                >
                  Visit Official Portal
                </a>
              </div>
              <div className="bg-slate-50/80 backdrop-blur-sm border-l-8 border-blue-800 p-8 shadow-lg">
                <h2 className="font-heading text-2xl font-bold uppercase mb-4 text-slate-900">Featured News</h2>
                <p className="text-slate-600 mb-4 text-md font-bold">Nigeria: 80 militants killed, army says</p>
                <p className="text-slate-500 mb-4 text-xs">Source: DW.com</p>
                <a 
                  href="https://www.dw.com/en/nigeria-80-militants-killed-in-nigeria-following-army-operation/a-71738734" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-blue-700 font-bold hover:underline flex items-center gap-2 text-sm"
                >
                  Read on DW.com <ExternalLink size={16} />
                </a>
              </div>
              <div className="bg-slate-50/80 backdrop-blur-sm border-l-8 border-red-800 p-8 shadow-lg">
                <h2 className="font-heading text-2xl font-bold uppercase mb-4 text-slate-900">Force Commander</h2>
                <p className="text-slate-600 mb-4 text-md font-bold">Colonel Aliou Tine Takes over as New Force Commander</p>
                <p className="text-slate-500 mb-4 text-xs">Source: Africa24 TV</p>
                <a 
                  href="https://africa24tv.com/colonel-aliou-tine-takes-over-as-new-economic-community-of-west-african-states-mission-in-the-gambia-force-commander/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-red-700 font-bold hover:underline flex items-center gap-2 text-sm"
                >
                  Read on Africa24 TV <ExternalLink size={16} />
                </a>
              </div>
            </div>
          )}

          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-800 mx-auto"></div>
              <p className="mt-4 text-slate-500 font-bold uppercase tracking-widest">Loading News...</p>
            </div>
          ) : news.length === 0 ? (
            <div className="text-center py-20 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
              <Newspaper size={48} className="mx-auto text-slate-300 mb-4" />
              <p className="text-slate-500 font-bold uppercase tracking-widest">No {category ? category.toUpperCase() : ""} news found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {news.map(item => (
                <div key={item.id} className="news-card">
                  <img src={item.image_url || "https://picsum.photos/seed/news/800/400"} alt={item.title} referrerPolicy="no-referrer" />
                  <div className="p-6">
                    <span className="badge badge-green">{item.category}</span>
                    <h3 className="font-heading text-xl font-bold mt-3 mb-2">{item.title}</h3>
                    <p className="text-slate-600 text-sm line-clamp-3 mb-4">{item.summary || item.content}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-xs flex items-center gap-1"><Clock size={14} />{format(new Date(item.created_at), "MMM d, yyyy")}</span>
                      <Link to={`/news/${item.id}`} className="text-green-700 font-bold text-sm hover:text-green-900">Read More</Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

const NewsDetailPage = () => {
  const { id } = useParams();
  const [news, setNews] = useState<News | null>(null);
  useEffect(() => {
    if (!id) return;
    const unsubscribe = onSnapshot(doc(db, "news", id), (snapshot) => {
      if (snapshot.exists()) {
        setNews({ id: snapshot.id, ...snapshot.data() } as News);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, `news/${id}`);
    });
    return () => unsubscribe();
  }, [id]);

  if (!news) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen pt-20">
      <PageHeader 
        title={news.title} 
        subtitle={`By ${news.author} • ${format(new Date(news.created_at), "MMMM d, yyyy")}`}
        icon={<Newspaper size={32} />}
      />
      <article className="max-w-4xl mx-auto px-8 py-20 bg-white/90 backdrop-blur-sm shadow-xl mt-[-40px] relative z-10 rounded-lg mb-20">
        <img src={news.image_url || "https://picsum.photos/seed/news/1200/600"} alt={news.title} className="w-full h-auto rounded-lg shadow-xl mb-12" referrerPolicy="no-referrer" />
        <div className="prose prose-xl max-w-none text-slate-700 leading-relaxed">
          {news.content.split('\n').map((p, i) => <p key={i} className="mb-6">{p}</p>)}
        </div>
        <Link to="/news" className="btn-secondary mt-12 inline-block">Back to News</Link>
      </article>
    </div>
  );
};

const EventsPage = () => {
  const { category } = useParams<{ category?: string }>();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let q = query(collection(db, "events"), orderBy("event_date", "desc"));
    
    // If category is provided, we filter by it. 
    // We'll assume event_type or a new category field matches the URL param.
    // For now, let's filter client-side or update the query if we want to be more efficient.
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      let fetchedEvents = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Event));
      
      if (category) {
        const normalizedCategory = category.toUpperCase();
        fetchedEvents = fetchedEvents.filter(e => 
          e.event_type.toUpperCase().includes(normalizedCategory) || 
          (e as any).category?.toUpperCase() === normalizedCategory
        );
      }
      
      setEvents(fetchedEvents);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, "events");
      setLoading(false);
    });
    return () => unsubscribe();
  }, [category]);

  const pageTitle = category ? `${category.toUpperCase()} EVENTS` : "EVENTS";

  return (
    <div className="min-h-screen pt-20">
      <PageHeader 
        title={pageTitle} 
        subtitle={category ? `Specific events and activities for ${category.toUpperCase()}` : "Upcoming mission-wide events and activities"}
        icon={<Calendar size={32} />}
      />
      <section className="py-20 bg-white/80 backdrop-blur-md shadow-xl mt-[-40px] relative z-10 max-w-7xl mx-auto rounded-lg">
        <div className="max-w-7xl mx-auto px-8">
          {/* Sub-navigation for categories */}
          <div className="mt-12 flex flex-wrap gap-4">
            <Link to="/events" className={`px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider transition-all ${!category ? 'bg-green-700 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>
              All Events
            </Link>
            {["ECOWAS", "MHQ", "FHQ", "SENBAT", "NIGCOY", "GHANCOY", "SENFPU", "TRAINING"].map(cat => (
              <Link 
                key={cat} 
                to={`/events/${cat.toLowerCase()}`} 
                className={`px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider transition-all ${category?.toLowerCase() === cat.toLowerCase() ? 'bg-green-700 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
              >
                {cat}
              </Link>
            ))}
          </div>

          {/* Featured Event Section - Only show on main events page or if it matches category */}
          {(!category || category.toLowerCase() === 'ecowas') && (
            <div className="mb-16 bg-white/80 backdrop-blur-md border-l-8 border-red-800 p-8 shadow-xl rounded-r-lg">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="flex-shrink-0 bg-red-900 text-white p-6 text-center w-32 rounded-lg shadow-lg">
                  <div className="font-heading text-4xl font-bold">22</div>
                  <div className="text-sm uppercase font-bold">Mar</div>
                </div>
                <div className="flex-1">
                  <span className="badge badge-red">Change of Command</span>
                  <h2 className="font-heading text-3xl font-bold mt-3 text-slate-900">Colonel Aliou Tine Takes over as New Force Commander</h2>
                  <p className="text-slate-600 mt-4 text-lg">
                    Colonel Aliou Tine has officially taken over as the new Force Commander of the ECOWAS Mission in The Gambia (ECOMIG).
                  </p>
                  <div className="mt-6 flex flex-wrap gap-4 items-center">
                    <a 
                      href="https://africa24tv.com/colonel-aliou-tine-takes-over-as-new-economic-community-of-west-african-states-mission-in-the-gambia-force-commander/" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="btn-primary flex items-center gap-2"
                    >
                      Read on Africa24 TV <ExternalLink size={18} />
                    </a>
                    <p className="text-slate-500 text-sm flex items-center gap-2 font-medium">
                      <MapPin size={18} className="text-red-700" /> Banjul, The Gambia
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-800 mx-auto"></div>
              <p className="mt-4 text-slate-500 font-bold uppercase tracking-widest">Loading Events...</p>
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-20 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
              <Calendar size={48} className="mx-auto text-slate-300 mb-4" />
              <p className="text-slate-500 font-bold uppercase tracking-widest">No {category ? category.toUpperCase() : ""} events scheduled</p>
            </div>
          ) : (
            <div className="space-y-8">
              {events.map(event => (
                <div key={event.id} className="card p-8 flex flex-col md:flex-row gap-8 items-center">
                  <div className="flex-shrink-0 bg-green-900 text-white p-6 text-center w-32 rounded-lg">
                    <div className="font-heading text-4xl font-bold">{format(new Date(event.event_date), "dd")}</div>
                    <div className="text-sm uppercase font-bold">{format(new Date(event.event_date), "MMM")}</div>
                  </div>
                  <div className="flex-1">
                    <span className="badge badge-blue">{event.event_type}</span>
                    <h3 className="font-heading text-3xl font-bold mt-3 text-slate-900">{event.title}</h3>
                    {event.image_url && (
                      <div className="mt-4 rounded-lg overflow-hidden border border-slate-200 shadow-md">
                        <img 
                          src={event.image_url} 
                          alt={event.title} 
                          className="w-full h-64 object-cover" 
                          referrerPolicy="no-referrer" 
                        />
                      </div>
                    )}
                    <p className="text-slate-600 mt-4 text-lg">{event.description}</p>
                    {event.location && <p className="text-slate-500 text-sm mt-4 flex items-center gap-2 font-medium"><MapPin size={18} className="text-green-700" /> {event.location}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

const GalleryPage = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [selected, setSelected] = useState<GalleryImage | null>(null);
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "images"), (snapshot) => {
      setImages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as GalleryImage)));
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, "images");
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen pt-20">
      <PageHeader 
        title="Gallery" 
        subtitle="Photos from ECOMIG operations and events"
        icon={<ImageIcon size={32} />}
      />
      <section className="py-20 bg-white/80 backdrop-blur-md shadow-xl mt-[-40px] relative z-10 max-w-7xl mx-auto rounded-lg">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {images.map(img => (
              <div key={img.id} className="relative group cursor-pointer aspect-square overflow-hidden" onClick={() => setSelected(img)}>
                <img src={img.image_url} alt={img.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"><Eye className="text-white" size={40} /></div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/95 z-[200] flex items-center justify-center p-8" onClick={() => setSelected(null)}>
            <button className="absolute top-8 right-8 text-white"><X size={40} /></button>
            <div className="max-w-5xl w-full" onClick={e => e.stopPropagation()}>
              <img src={selected.image_url} alt={selected.title} className="max-w-full max-h-[80vh] mx-auto shadow-2xl" referrerPolicy="no-referrer" />
              <div className="text-white text-center mt-8">
                <h3 className="font-heading text-3xl font-bold uppercase">{selected.title}</h3>
                <p className="text-slate-400 mt-2 text-lg">{selected.description}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ContactPage = () => {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [files, setFiles] = useState<{ image: File | null, folder: FileList | null }>({ image: null, folder: null });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const attachments: { name: string, url: string, type: string }[] = [];
      
      // Upload single image if exists
      if (files.image) {
        const storageRef = ref(storage, `contacts/${Date.now()}_${files.image.name}`);
        const uploadTask = uploadBytesResumable(storageRef, files.image);
        const snapshot = await new Promise<any>((resolve, reject) => {
          uploadTask.on('state_changed', null, reject, () => resolve(uploadTask.snapshot));
        });
        const url = await getDownloadURL(snapshot.ref);
        attachments.push({ name: files.image.name, url, type: files.image.type });
      }
      
      // Upload folder files if exist
      if (files.folder) {
        for (let i = 0; i < files.folder.length; i++) {
          const file = files.folder[i];
          const storageRef = ref(storage, `contacts/${Date.now()}_folder_${file.name}`);
          const uploadTask = uploadBytesResumable(storageRef, file);
          const snapshot = await new Promise<any>((resolve, reject) => {
            uploadTask.on('state_changed', null, reject, () => resolve(uploadTask.snapshot));
          });
          const url = await getDownloadURL(snapshot.ref);
          attachments.push({ name: file.name, url, type: file.type });
        }
      }

      await addDoc(collection(db, "messages"), {
        ...form,
        attachments,
        has_attachments: attachments.length > 0,
        attachment_count: attachments.length,
        status: "unread",
        created_at: new Date().toISOString()
      });
      setSent(true);
      setForm({ name: "", email: "", subject: "", message: "" });
      setFiles({ image: null, folder: null });
    } catch (error: any) {
      if (error.code?.startsWith('storage/')) {
        handleStorageError(error, "contacts");
      } else {
        handleFirestoreError(error, OperationType.CREATE, "messages");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20">
      <PageHeader 
        title="Contact Us" 
        subtitle="Get in touch with ECOMIG - We're here to help"
        icon={<Mail size={32} />}
      />
      <section className="py-20 bg-white/80 backdrop-blur-md shadow-xl mt-[-40px] relative z-10 max-w-7xl mx-auto rounded-lg">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-2 gap-16">
          <div className="bg-white/80 backdrop-blur-md p-10 shadow-2xl border-t-8 border-green-800">
            <h2 className="font-heading text-3xl font-bold uppercase mb-8 text-slate-900">Send a Message</h2>
            {sent ? <div className="bg-green-100 text-green-800 p-6 font-bold text-center rounded">Message Sent Successfully!</div> : (
              <form onSubmit={submit} className="space-y-6">
                <div><label className="form-label">Name</label><input type="text" className="form-input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required /></div>
                <div><label className="form-label">Email</label><input type="email" className="form-input" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required /></div>
                <div><label className="form-label">Subject</label><input type="text" className="form-input" value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} required /></div>
                <div><label className="form-label">Message</label><textarea className="form-input min-h-[150px]" value={form.message} onChange={e => setForm({...form, message: e.target.value})} required /></div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border-2 border-dashed border-slate-200 p-4 rounded-lg hover:border-green-500 transition-colors">
                    <label className="form-label flex items-center gap-2 cursor-pointer">
                      <ImageIcon size={20} className="text-green-700" />
                      <span>Upload Image</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={e => setFiles({...files, image: e.target.files ? e.target.files[0] : null})} 
                      />
                    </label>
                    {files.image && <p className="text-xs text-green-600 mt-2 font-medium truncate">{files.image.name}</p>}
                  </div>

                  <div className="border-2 border-dashed border-slate-200 p-4 rounded-lg hover:border-green-500 transition-colors">
                    <label className="form-label flex items-center gap-2 cursor-pointer">
                      <Folder size={20} className="text-green-700" />
                      <span>Upload Folder</span>
                      <input 
                        type="file" 
                        // @ts-ignore
                        webkitdirectory="" 
                        directory="" 
                        className="hidden" 
                        onChange={e => setFiles({...files, folder: e.target.files})} 
                      />
                    </label>
                    {files.folder && <p className="text-xs text-green-600 mt-2 font-medium">{files.folder.length} files selected</p>}
                  </div>
                </div>

                <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
                  {loading ? "Sending..." : "Send Message"} <Send size={20} />
                </button>
              </form>
            )}
          </div>
          <div className="space-y-8">
            <div className="bg-green-900/90 backdrop-blur-md text-white p-10 rounded-lg shadow-xl">
              <h2 className="font-heading text-3xl font-bold uppercase mb-8">Contact Info</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4"><MapPin size={28} className="text-green-400" /><div><h4 className="font-bold">Headquarters</h4><p className="text-slate-300">ECOMIG Headquarters, Bakau, The Gambia</p></div></div>
                <div className="flex items-start gap-4">
                  <Phone size={28} className="text-green-400" />
                  <div>
                    <h4 className="font-bold">Phone</h4>
                    <p className="text-slate-300">+220 360 2206</p>
                    <p className="text-slate-300">+220 340 1305</p>
                    <p className="text-slate-300">+220 518 5706</p>
                  </div>
                </div>
                <div className="flex items-start gap-4"><Mail size={28} className="text-green-400" /><div><h4 className="font-bold">Email</h4><p className="text-slate-300">info@ecomig.org</p></div></div>
                <div className="pt-6 border-t border-green-800/50 flex gap-4">
                  <a href="https://wa.me/2203602206" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors font-bold text-sm">
                    <MessageCircle size={20} /> WhatsApp
                  </a>
                  <a href="https://t.me/ecomig_mission" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors font-bold text-sm">
                    <Send size={20} /> Telegram
                  </a>
                </div>
              </div>
            </div>
            <div className="bg-slate-900 text-white p-10 rounded-lg shadow-xl">
              <h3 className="font-heading text-2xl font-bold uppercase mb-4">Office Hours</h3>
              <p className="text-slate-400">Monday - Friday: 8:00 AM - 5:00 PM</p>
              <p className="text-slate-400">Saturday - Sunday: Closed</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [resetSent, setResetSent] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { profile, login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (profile) navigate("/admin/dashboard");
  }, [profile, navigate]);

  const handleGoogleLogin = async () => {
    setIsLoggingIn(true);
    try {
      await loginWithGoogle();
      navigate("/admin/dashboard");
    } catch (error: any) {
      console.error("Google login error:", error);
      alert("Error logging in with Google: " + error.message);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleQuickBootstrap = async () => {
    setIsLoggingIn(true);
    setEmail("admin@ecomig.org");
    setPass("admin123");
    
    // Small delay to ensure state updates (though not strictly necessary for the call itself)
    setTimeout(async () => {
      try {
        await login("admin@ecomig.org", "admin123");
        navigate("/admin/dashboard");
      } catch (error: any) {
        console.error("Quick login error:", error);
        alert("Quick login failed: " + error.message);
      } finally {
        setIsLoggingIn(false);
      }
    }, 100);
  };

  const handleForgotPassword = async () => {
    if (!email) {
      alert("Please enter your email address first.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      setResetSent(true);
      alert("Password reset email sent! Please check your inbox.");
    } catch (error: any) {
      console.error("Reset error:", error);
      alert("Error sending reset email: " + error.message);
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    try {
      await login(email, pass);
      navigate("/admin/dashboard");
    } catch (error: any) {
      console.error("Login error:", error);
      if (error.message.includes("Email/Password login is currently disabled")) {
        alert(error.message);
      } else if (error.message.includes("Incorrect password for this account")) {
        alert(error.message);
      } else if (error.code === "auth/network-request-failed") {
        alert("Network error. Please check your connection.");
      } else if (error.code === "auth/too-many-requests") {
        alert("Too many failed attempts. Please try again later.");
      } else {
        alert("Invalid credentials. If you've forgotten your password, use the 'Forgot Password' link below.");
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="bg-white/95 backdrop-blur-md p-10 w-full max-w-md shadow-2xl border-t-8 border-green-800">
        <div className="text-center mb-10">
          <EcomigLogo />
          <h1 className="font-heading text-3xl font-bold uppercase mt-6 text-slate-900">Mission Portal</h1>
        </div>
        <form onSubmit={submit} className="space-y-6">
          <div><label className="form-label">Email</label><input type="email" className="form-input" value={email} onChange={e => setEmail(e.target.value)} required disabled={isLoggingIn} /></div>
          <div><label className="form-label">Password</label><input type="password" className="form-input" value={pass} onChange={e => setPass(e.target.value)} required disabled={isLoggingIn} /></div>
          <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2" disabled={isLoggingIn}>
            {isLoggingIn ? <Clock className="animate-spin" size={20} /> : null}
            {isLoggingIn ? "Processing..." : "Login with Email"}
          </button>
          <button 
            type="button" 
            onClick={handleQuickBootstrap} 
            disabled={isLoggingIn}
            className="w-full text-xs text-green-700 font-bold hover:underline mt-2 disabled:opacity-50"
          >
            Quick Login as admin@ecomig.org
          </button>
        </form>

        <div className="mt-6">
          <div className="relative flex items-center justify-center mb-6">
            <div className="border-t border-slate-200 w-full"></div>
            <span className="bg-white px-4 text-slate-400 text-sm absolute">OR</span>
          </div>
          <button 
            onClick={handleGoogleLogin}
            disabled={isLoggingIn}
            className="w-full flex items-center justify-center gap-3 bg-white border border-slate-300 py-3 rounded-md font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm disabled:opacity-50"
          >
            {isLoggingIn ? <Clock className="animate-spin" size={20} /> : (
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            )}
            {isLoggingIn ? "Authenticating..." : "Sign in with Google"}
          </button>
        </div>
        
        <div className="mt-6 text-center space-y-4">
          <button 
            onClick={handleForgotPassword}
            className="text-sm text-slate-500 hover:text-green-700 transition-colors underline"
          >
            Forgot Password?
          </button>
          
          <p className="text-slate-400 text-xs">
            Default: admin@ecomig.org / admin123
          </p>
          
          <Link to="/" className="block text-green-800 font-bold hover:underline">
            Back to Website
          </Link>
        </div>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const { profile, logout, loading } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState("news");
  const [news, setNews] = useState<News[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [docs, setDocs] = useState<MissionDocument[]>([]);
  const [msgs, setMsgs] = useState<Message[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [chatLogs, setChatLogs] = useState<any[]>([]);
  const [internalMails, setInternalMails] = useState<InternalMail[]>([]);
  const [showModal, setShowModal] = useState<"news" | "edit_news" | "event" | "edit_event" | "user" | "doc" | "image" | "edit_image" | null>(null);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [selectedNews, setSelectedNews] = useState<News | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [newDoc, setNewDoc] = useState({ title: "", category: "SOP", file_url: "" });
  const [connectionStatus, setConnectionStatus] = useState<{firestore: string, storage: string} | null>(null);

  useEffect(() => {
    const checkConnections = async () => {
      const status = { firestore: "Checking...", storage: "Checking..." };
      setConnectionStatus(status);
      
      try {
        await getDocs(query(collection(db, "users"), limit(1)));
        status.firestore = "Connected";
      } catch (e: any) {
        status.firestore = `Error: ${e.message}`;
      }
      
      try {
        const testRef = ref(storage, 'test_connection.txt');
        const blob = new Blob(["test"], { type: 'text/plain' });
        const uploadTask = uploadBytesResumable(testRef, blob);
        await new Promise<any>((resolve, reject) => {
          uploadTask.on('state_changed', null, reject, () => resolve(uploadTask.snapshot));
        });
        status.storage = "Connected";
      } catch (e: any) {
        status.storage = `Error: ${e.message}`;
      }
      
      setConnectionStatus({...status});
    };
    
    if (profile?.role === 'admin') {
      checkConnections();
    }
  }, [profile]);

  const addDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    await addDoc(collection(db, "documents"), {
      ...newDoc,
      uploaded_by: profile.full_name,
      created_at: new Date().toISOString()
    });
    setNewDoc({ title: "", category: "SOP", file_url: "" });
    setShowModal(null);
  };

  const handleDeleteDoc = async (id: string) => {
    console.log("Attempting to delete document:", id);
    try {
      await deleteDoc(doc(db, "documents", id));
      console.log("Document deleted successfully");
    } catch (error) {
      console.error("Delete Document Error:", error);
      handleFirestoreError(error, OperationType.DELETE, `documents/${id}`);
    }
  };

  useEffect(() => {
    if (!loading && !profile) {
      navigate("/admin");
      return;
    }
    if (!profile) return;
    
    const qNews = query(collection(db, "news"), orderBy("created_at", "desc"));
    const unsubNews = onSnapshot(qNews, (snapshot) => {
      setNews(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as News)));
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, "news");
    });

    const qEvents = query(collection(db, "events"), orderBy("event_date", "desc"));
    const unsubEvents = onSnapshot(qEvents, (snapshot) => {
      setEvents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Event)));
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, "events");
    });

    const qMsgs = query(collection(db, "messages"), orderBy("created_at", "desc"));
    const unsubMsgs = onSnapshot(qMsgs, (snapshot) => {
      setMsgs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message)));
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, "messages");
    });

    const qUsers = query(collection(db, "users"), orderBy("created_at", "desc"));
    const unsubUsers = onSnapshot(qUsers, (snapshot) => {
      setUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as UserProfile)));
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, "users");
    });

    const qDocs = query(collection(db, "documents"), orderBy("created_at", "desc"));
    const unsubDocs = onSnapshot(qDocs, (snapshot) => {
      setDocs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MissionDocument)));
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, "documents");
    });

    const qLogs = query(collection(db, "chat_logs"), orderBy("created_at", "desc"), limit(50));
    const unsubLogs = onSnapshot(qLogs, (snapshot) => {
      setChatLogs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, "chat_logs");
    });

    const qInternalMail = query(collection(db, "internal_mail"), orderBy("created_at", "desc"), limit(50));
    const unsubInternalMail = onSnapshot(qInternalMail, (snapshot) => {
      setInternalMails(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as InternalMail)));
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, "internal_mail");
    });

    const qImages = query(collection(db, "images"), orderBy("created_at", "desc"));
    const unsubImages = onSnapshot(qImages, (snapshot) => {
      setImages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as GalleryImage)));
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, "images");
    });

    return () => { unsubNews(); unsubEvents(); unsubMsgs(); unsubUsers(); unsubLogs(); unsubDocs(); unsubInternalMail(); unsubImages(); };
  }, [profile, loading, navigate]);

  const activateUser = async (id: string) => {
    try {
      await updateDoc(doc(db, "users", id), { role: "user" });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${id}`);
    }
  };

  const deleteUser = async (id: string) => {
    console.log("Attempting to delete user:", id);
    try {
      await deleteDoc(doc(db, "users", id));
      console.log("User deleted successfully");
    } catch (error) {
      console.error("Delete User Error:", error);
      handleFirestoreError(error, OperationType.DELETE, `users/${id}`);
    }
  };

  const deleteNews = async (id: string) => {
    console.log("Attempting to delete news:", id);
    try {
      await deleteDoc(doc(db, "news", id));
      console.log("News deleted successfully");
    } catch (error) {
      console.error("Delete News Error:", error);
      handleFirestoreError(error, OperationType.DELETE, `news/${id}`);
    }
  };

  const deleteEvent = async (id: string) => {
    console.log("Attempting to delete event:", id);
    try {
      await deleteDoc(doc(db, "events", id));
      console.log("Event deleted successfully");
    } catch (error) {
      console.error("Delete Event Error:", error);
      handleFirestoreError(error, OperationType.DELETE, `events/${id}`);
    }
  };

  const deleteImage = async (id: string) => {
    console.log("Attempting to delete image:", id);
    try {
      await deleteDoc(doc(db, "images", id));
      console.log("Image deleted successfully");
    } catch (error) {
      console.error("Delete Image Error:", error);
      handleFirestoreError(error, OperationType.DELETE, `images/${id}`);
    }
  };

  const markRead = async (id: string) => {
    try {
      await updateDoc(doc(db, "messages", id), { status: "read" });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `messages/${id}`);
    }
  };

  if (!profile) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-slate-900/95 backdrop-blur-md text-white p-6 flex items-center justify-between shadow-xl border-b border-white/10">
        <div className="flex items-center gap-6">
          <div className="bg-white/10 p-2 rounded-lg backdrop-blur-sm">
            <EcomigLogo />
          </div>
          <span className="font-heading text-2xl font-bold uppercase tracking-widest hidden md:inline text-white drop-shadow-sm">Dashboard</span>
        </div>
        <div className="flex items-center gap-6">
          <span className="text-slate-400 font-medium">{profile.full_name} ({profile.role})</span>
          <button onClick={() => { logout(); navigate("/admin"); }} className="flex items-center gap-2 text-red-400 font-bold hover:text-red-300"><LogOut size={20} /> Logout</button>
        </div>
      </header>

      {/* Connection Status Indicator */}
      {profile?.role === 'admin' && connectionStatus && (
        <div className="bg-slate-100 border-b border-slate-200 px-8 py-2 flex gap-6 text-[10px] font-mono uppercase tracking-wider">
          <div className="flex items-center gap-2">
            <span className="text-slate-500">Firestore:</span>
            <span className={connectionStatus.firestore === "Connected" ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
              {connectionStatus.firestore}
            </span>
          </div>
          <div className="flex items-center gap-2 border-l border-slate-300 pl-6">
            <span className="text-slate-500">Storage:</span>
            <span className={connectionStatus.storage === "Connected" ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
              {connectionStatus.storage}
            </span>
          </div>
          <div className="ml-auto text-slate-400 italic">
            * Connection test performed on dashboard load
          </div>
        </div>
      )}
      <div className="flex flex-1">
        <aside className="w-72 bg-slate-800/90 backdrop-blur-md p-8 space-y-4">
          <Link to="/" className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 font-bold"><Home size={20} /> View Site</Link>
          {[
            { id: "news", label: "News", icon: Newspaper },
            { id: "events", label: "Events", icon: Calendar },
            { id: "docs", label: "Documents", icon: FileText },
            { id: "gallery", label: "Gallery", icon: ImageIcon },
            { id: "inbox", label: "Inbox", icon: Inbox },
            { id: "chat", label: "Chat Logs", icon: MessageCircle },
            { id: "mail", label: "Internal Mail", icon: Mail },
            { id: "users", label: "Users", icon: Users }
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} className={`w-full flex items-center gap-4 p-4 font-bold uppercase tracking-wider transition-colors ${tab === t.id ? "bg-green-800 text-white" : "text-slate-400 hover:bg-slate-700 hover:text-white"}`}>
              <t.icon size={20} /> {t.label}
              {t.id === "inbox" && msgs.filter(m => m.status === "unread").length > 0 && <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">{msgs.filter(m => m.status === "unread").length}</span>}
            </button>
          ))}
        </aside>
        <main className="flex-1 p-12">
          <div className="flex items-center justify-between mb-12">
            <h1 className="font-heading text-4xl font-bold uppercase text-white drop-shadow-lg">
              {tab === "news" ? "Manage News" : tab === "events" ? "Manage Events" : tab === "users" ? "User Management" : tab === "gallery" ? "Manage Gallery" : "Messages"}
            </h1>
            {tab === "news" && <button onClick={() => setShowModal("news")} className="btn-primary flex items-center gap-2"><Plus size={20} /> Add News</button>}
            {tab === "events" && <button onClick={() => setShowModal("event")} className="btn-primary flex items-center gap-2"><Plus size={20} /> Add Event</button>}
            {tab === "docs" && <button onClick={() => setShowModal("doc")} className="btn-primary flex items-center gap-2"><Plus size={20} /> Add Document</button>}
            {tab === "gallery" && <button onClick={() => setShowModal("image")} className="btn-primary flex items-center gap-2"><Plus size={20} /> Add Image</button>}
            {tab === "users" && profile.role === "admin" && <button onClick={() => setShowModal("user")} className="btn-primary flex items-center gap-2"><Plus size={20} /> Add User</button>}
          </div>
          <div className="bg-white/90 backdrop-blur-md shadow-2xl rounded-lg overflow-hidden border border-white/20">
            {tab === "news" && (
              <table className="w-full">
                <thead className="bg-slate-50/50 backdrop-blur-sm border-b">
                  <tr><th className="text-left p-6 font-heading uppercase text-slate-500">Title</th><th className="text-left p-6 font-heading uppercase text-slate-500">Created</th><th className="text-left p-6 font-heading uppercase text-slate-500">Actions</th></tr>
                </thead>
                <tbody>
                  {news.map(n => (
                    <tr key={n.id} className="border-b hover:bg-slate-50/50 transition-colors">
                      <td className="p-6 font-bold text-slate-900">{n.title}</td>
                      <td className="p-6 text-slate-500">{format(new Date(n.created_at), "MMM d, yyyy")}</td>
                      <td className="p-6 flex gap-4">
                        <button onClick={() => { setSelectedNews(n); setShowModal("edit_news"); }} className="text-blue-600 hover:text-blue-800">
                          <Edit size={20} />
                        </button>
                        <button onClick={() => deleteNews(n.id)} className="text-red-600 hover:text-red-800">
                          <Trash2 size={20} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {tab === "events" && (
              <table className="w-full">
                <thead className="bg-slate-50/50 backdrop-blur-sm border-b">
                  <tr><th className="text-left p-6 font-heading uppercase text-slate-500">Title</th><th className="text-left p-6 font-heading uppercase text-slate-500">Date</th><th className="text-left p-6 font-heading uppercase text-slate-500">Actions</th></tr>
                </thead>
                <tbody>
                  {events.map(e => (
                    <tr key={e.id} className="border-b hover:bg-slate-50/50 transition-colors">
                      <td className="p-6 font-bold text-slate-900">{e.title}</td>
                      <td className="p-6 text-slate-500">{format(new Date(e.event_date), "MMM d, yyyy")}</td>
                      <td className="p-6 flex gap-4">
                        <button onClick={() => { setSelectedEvent(e); setShowModal("edit_event"); }} className="text-blue-600 hover:text-blue-800">
                          <Edit size={20} />
                        </button>
                        <button onClick={() => deleteEvent(e.id)} className="text-red-600 hover:text-red-800">
                          <Trash2 size={20} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {tab === "docs" && (
              <table className="w-full">
                <thead className="bg-slate-50/50 backdrop-blur-sm border-b">
                  <tr><th className="text-left p-6 font-heading uppercase text-slate-500">Title</th><th className="text-left p-6 font-heading uppercase text-slate-500">Category</th><th className="text-left p-6 font-heading uppercase text-slate-500">Actions</th></tr>
                </thead>
                <tbody>
                  {docs.map(d => (
                    <tr key={d.id} className="border-b hover:bg-slate-50/50 transition-colors">
                      <td className="p-6 font-bold text-slate-900">{d.title}</td>
                      <td className="p-6 text-slate-500"><span className="px-2 py-1 bg-slate-100/50 rounded text-xs font-bold">{d.category}</span></td>
                      <td className="p-6 flex gap-4">
                        <button onClick={() => window.open(d.file_url, "_blank")} className="text-blue-600 hover:text-blue-800">
                          <Download size={20} />
                        </button>
                        <button onClick={() => handleDeleteDoc(d.id)} className="text-red-600 hover:text-red-800">
                          <Trash2 size={20} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {tab === "gallery" && (
              <div className="p-8 grid grid-cols-2 md:grid-cols-4 gap-6">
                {images.map(img => (
                  <div key={img.id} className="relative group rounded-lg overflow-hidden border border-slate-200">
                    <img src={img.image_url} alt={img.title} className="w-full aspect-square object-cover" referrerPolicy="no-referrer" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4 text-center">
                      <p className="text-white text-xs font-bold mb-2 truncate w-full">{img.title}</p>
                      <div className="flex gap-2">
                        <button onClick={() => { setSelectedImage(img); setShowModal("edit_image"); }} className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
                          <Edit size={16} />
                        </button>
                        <button onClick={() => deleteImage(img.id)} className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {images.length === 0 && <div className="col-span-full p-12 text-center text-slate-400">No images in gallery yet.</div>}
              </div>
            )}
            {tab === "chat" && (
              <div className="divide-y">
                {chatLogs.map(log => (
                  <div key={log.id} className="p-6 hover:bg-slate-50/50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="font-bold text-slate-900">{log.user_name}</span>
                        <span className="text-slate-400 text-xs ml-2">({log.user_unit})</span>
                      </div>
                      <span className="text-slate-400 text-xs">{format(new Date(log.created_at), "MMM d, h:mm a")}</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <span className="text-xs font-bold text-green-700 uppercase min-w-[60px]">User:</span>
                        <p className="text-sm text-slate-700">{log.question}</p>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-xs font-bold text-blue-700 uppercase min-w-[60px]">AI:</span>
                        <p className="text-sm text-slate-600 italic">{log.answer}</p>
                      </div>
                    </div>
                  </div>
                ))}
                {chatLogs.length === 0 && <div className="p-12 text-center text-slate-400">No chat logs available yet.</div>}
              </div>
            )}
            {tab === "mail" && (
              <div className="divide-y">
                {internalMails.map(mail => (
                  <div key={mail.id} className="p-6 hover:bg-slate-50/50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="font-bold text-slate-900">{mail.sender_name}</span>
                        <span className="text-slate-400 text-xs ml-2 uppercase">({mail.sender_unit})</span>
                        <span className="mx-2 text-slate-300">→</span>
                        <span className="font-bold text-green-700">
                          {mail.receiver_unit ? `Unit: ${mail.receiver_unit}` : `User ID: ${mail.receiver_id}`}
                        </span>
                      </div>
                      <span className="text-slate-400 text-xs font-mono">{format(new Date(mail.created_at), "MMM d, HH:mm")}</span>
                    </div>
                    <div className="mb-2">
                      <p className="text-sm font-bold text-slate-600 uppercase">Subject: {mail.subject}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                      <p className="text-slate-700 whitespace-pre-wrap text-sm">{mail.body}</p>
                      {mail.attachments && mail.attachments.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-slate-200 flex flex-wrap gap-2">
                          {mail.attachments.map((att, i) => (
                            <a key={i} href={att.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-white px-2 py-1 rounded border border-slate-200 text-[10px] font-bold text-slate-500 hover:border-green-500 transition-colors">
                              <FileText size={12} /> {att.name}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {internalMails.length === 0 && <div className="p-12 text-center text-slate-400">No internal mail logs available yet.</div>}
              </div>
            )}
            {tab === "inbox" && (
              <div className="divide-y">
                {msgs.map(m => (
                  <div key={m.id} className={`p-8 ${m.status === "unread" ? "bg-green-50/50 border-l-8 border-green-600" : ""}`}>
                    <div className="flex justify-between mb-4">
                      <h3 className="text-xl font-bold text-slate-900">{m.subject}</h3>
                      <span className="text-slate-400 text-sm">{format(new Date(m.created_at), "MMM d, yyyy h:mm a")}</span>
                    </div>
                    <p className="text-slate-500 mb-4 font-medium">From: {m.name} ({m.email})</p>
                    <p className="text-slate-700 leading-relaxed">{m.message}</p>
                    {m.has_attachments && (
                      <div className="mt-4 space-y-2">
                        <div className="flex items-center gap-2 text-slate-600 font-bold text-sm">
                          <Folder size={18} className="text-green-700" />
                          <span>{m.attachment_count} Attachment(s)</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {m.attachments?.map((att: any, i: number) => (
                            <a 
                              key={i} 
                              href={att.url} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded border border-slate-200 text-xs font-bold text-slate-600 hover:border-green-500 hover:bg-white transition-all"
                            >
                              <FileText size={14} /> {att.name}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                    {m.status === "unread" && <button onClick={() => markRead(m.id)} className="mt-6 text-green-700 font-bold flex items-center gap-2 hover:text-green-900"><Eye size={18} /> Mark as Read</button>}
                  </div>
                ))}
              </div>
            )}
            {tab === "users" && (
              <table className="w-full">
                <thead className="bg-slate-50/50 backdrop-blur-sm border-b">
                  <tr>
                    <th className="text-left p-6 font-heading uppercase text-slate-500">Name</th>
                    <th className="text-left p-6 font-heading uppercase text-slate-500">Role</th>
                    <th className="text-left p-6 font-heading uppercase text-slate-500">Unit</th>
                    <th className="text-left p-6 font-heading uppercase text-slate-500">Joined</th>
                    <th className="text-left p-6 font-heading uppercase text-slate-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id} className="border-b hover:bg-slate-50/50 transition-colors">
                      <td className="p-6">
                        <div className="font-bold text-slate-900">{u.full_name}</div>
                        <div className="text-xs text-slate-400">{u.username}</div>
                      </td>
                      <td className="p-6">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                          u.role === "admin" ? "bg-red-100 text-red-700" : 
                          u.role === "pending" ? "bg-yellow-100 text-yellow-700" : 
                          "bg-blue-100 text-blue-700"
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="p-6 text-slate-500 font-medium">{u.unit}</td>
                      <td className="p-6 text-slate-500">{format(new Date(u.created_at), "MMM d, yyyy")}</td>
                      <td className="p-6 flex gap-4">
                        {u.role === "pending" && (
                          <button onClick={() => activateUser(u.id)} className="text-green-600 hover:text-green-800 font-bold text-xs uppercase">Activate</button>
                        )}
                        {u.id !== profile.id && (
                          <button onClick={() => deleteUser(u.id)} className="text-red-600 hover:text-red-800"><Trash2 size={20} /></button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </main>
      </div>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-8">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white/95 backdrop-blur-md w-full max-w-2xl rounded-lg shadow-2xl overflow-hidden">
              <div className="bg-slate-900/90 backdrop-blur-md p-6 text-white flex justify-between items-center">
                <h2 className="font-heading text-2xl font-bold uppercase">
                  {showModal === "news" ? "Add News Article" : 
                   showModal === "edit_news" ? "Edit News Article" :
                   showModal === "event" ? "Add Event" : 
                   showModal === "edit_event" ? "Edit Event" :
                   showModal === "doc" ? "Upload Mission Document" :
                   showModal === "image" ? "Add Gallery Image" :
                   showModal === "edit_image" ? "Edit Image Details" :
                   "Add Authorized User"}
                </h2>
                <button onClick={() => setShowModal(null)}><X size={24} /></button>
              </div>
              <div className="p-8">
                {showModal === "news" ? <NewsForm onSuccess={() => setShowModal(null)} /> : 
                 showModal === "edit_news" ? <EditNewsForm news={selectedNews!} onSuccess={() => { setShowModal(null); setSelectedNews(null); }} /> :
                 showModal === "event" ? <EventForm onSuccess={() => setShowModal(null)} /> :
                 showModal === "edit_event" ? <EditEventForm event={selectedEvent!} onSuccess={() => { setShowModal(null); setSelectedEvent(null); }} /> :
                 showModal === "doc" ? (
                   <form onSubmit={addDocument} className="space-y-4">
                     <div>
                       <label className="form-label">Document Title</label>
                       <input type="text" value={newDoc.title} onChange={e => setNewDoc({...newDoc, title: e.target.value})} className="form-input" required />
                     </div>
                     <div>
                       <label className="form-label">Category</label>
                       <select value={newDoc.category} onChange={e => setNewDoc({...newDoc, category: e.target.value as any})} className="form-input">
                         <option value="SOP">SOP (Standard Operating Procedure)</option>
                         <option value="Manual">Mission Manual</option>
                         <option value="Directive">ECOWAS Directive</option>
                         <option value="Report">Monthly Report</option>
                       </select>
                     </div>
                     <div>
                       <label className="form-label">File URL (PDF)</label>
                       <input type="url" value={newDoc.file_url} onChange={e => setNewDoc({...newDoc, file_url: e.target.value})} className="form-input" placeholder="https://..." required />
                     </div>
                     <div className="flex gap-4 pt-4">
                       <button type="submit" className="btn-primary flex-1">Upload</button>
                       <button type="button" onClick={() => setShowModal(null)} className="btn-secondary flex-1">Cancel</button>
                     </div>
                   </form>
                 ) : showModal === "image" ? (
                   <ImageForm onSuccess={() => setShowModal(null)} />
                 ) : showModal === "edit_image" ? (
                   <EditImageForm image={selectedImage!} onSuccess={() => { setShowModal(null); setSelectedImage(null); }} />
                 ) :
                 <UserForm onSuccess={() => setShowModal(null)} />}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ImageForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const { profile } = useAuth();
  const [form, setForm] = useState({ title: "", description: "", category: "General" });
  const [file, setFile] = useState<File | null>(null);
  const [folder, setFolder] = useState<FileList | null>(null);
  const [uploadType, setUploadType] = useState<"single" | "folder">("single");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) {
      alert("User profile not loaded. Please try logging out and in again.");
      return;
    }

    setLoading(true);
    
    try {
      if (uploadType === "single") {
        if (!file) {
          alert("Please select a file first.");
          setLoading(false);
          return;
        }
        console.log("Starting single gallery upload for:", file.name);
        const storageRef = ref(storage, `gallery/${Date.now()}_${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);
        const snapshot = await new Promise<any>((resolve, reject) => {
          uploadTask.on('state_changed', null, reject, () => resolve(uploadTask.snapshot));
        });
        const url = await getDownloadURL(snapshot.ref);
        
        await addDoc(collection(db, "images"), {
          ...form,
          image_url: url,
          uploaded_by: profile.full_name,
          created_at: new Date().toISOString()
        });
      } else {
        if (!folder || folder.length === 0) {
          alert("Please select a folder first.");
          setLoading(false);
          return;
        }
        
        setProgress({ current: 0, total: folder.length });
        console.log(`Starting folder upload for ${folder.length} files`);
        
        for (let i = 0; i < folder.length; i++) {
          const f = folder[i];
          if (!f.type.startsWith("image/")) continue;
          
          setProgress({ current: i + 1, total: folder.length });
          const storageRef = ref(storage, `gallery/${Date.now()}_${f.name}`);
          const uploadTask = uploadBytesResumable(storageRef, f);
          const snapshot = await new Promise<any>((resolve, reject) => {
            uploadTask.on('state_changed', null, reject, () => resolve(uploadTask.snapshot));
          });
          const url = await getDownloadURL(snapshot.ref);
          
          await addDoc(collection(db, "images"), {
            title: f.name.split('.')[0], // Use filename as title
            description: form.description || `Uploaded from folder: ${f.name}`,
            category: form.category,
            image_url: url,
            uploaded_by: profile.full_name,
            created_at: new Date().toISOString()
          });
        }
      }
      
      console.log("Gallery upload(s) completed successfully.");
      onSuccess();
    } catch (error: any) {
      console.error("Gallery Upload Error:", error);
      handleStorageError(error, "gallery");
    } finally {
      setLoading(false);
      setProgress({ current: 0, total: 0 });
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="flex gap-4 mb-4">
        <button 
          type="button" 
          onClick={() => setUploadType("single")}
          className={`flex-1 py-2 rounded-lg border-2 font-bold text-xs uppercase transition-all ${uploadType === "single" ? "border-green-600 bg-green-50 text-green-700" : "border-slate-200 text-slate-400"}`}
        >
          Single Image
        </button>
        <button 
          type="button" 
          onClick={() => setUploadType("folder")}
          className={`flex-1 py-2 rounded-lg border-2 font-bold text-xs uppercase transition-all ${uploadType === "folder" ? "border-green-600 bg-green-50 text-green-700" : "border-slate-200 text-slate-400"}`}
        >
          Upload Folder
        </button>
      </div>

      {uploadType === "single" && (
        <div><label className="form-label">Image Title</label><input type="text" className="form-input" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required={uploadType === "single"} /></div>
      )}
      
      <div><label className="form-label">Category</label><select className="form-input" value={form.category} onChange={e => setForm({...form, category: e.target.value})}><option>General</option><option>Operations</option><option>Training</option><option>Ceremony</option></select></div>
      <div><label className="form-label">Description</label><textarea className="form-input" value={form.description} onChange={e => setForm({...form, description: e.target.value})} /></div>
      
      <div>
        <label className="form-label">{uploadType === "single" ? "Select Image File" : "Select Folder"}</label>
        {uploadType === "single" ? (
          <input 
            type="file" 
            accept="image/*" 
            onChange={e => setFile(e.target.files ? e.target.files[0] : null)} 
            className="form-input"
            required={uploadType === "single"}
          />
        ) : (
          <input 
            type="file" 
            // @ts-ignore
            webkitdirectory="" 
            directory="" 
            onChange={e => setFolder(e.target.files)} 
            className="form-input"
            required={uploadType === "folder"}
          />
        )}
      </div>

      {loading && progress.total > 0 && (
        <div className="bg-slate-100 h-2 w-full rounded-full overflow-hidden mt-4">
          <div 
            className="bg-green-600 h-full transition-all duration-300" 
            style={{ width: `${(progress.current / progress.total) * 100}%` }}
          />
        </div>
      )}
      {loading && progress.total > 0 && (
        <p className="text-[10px] text-slate-500 font-mono text-center mt-1 uppercase">
          Uploading: {progress.current} of {progress.total} files
        </p>
      )}

      <button type="submit" disabled={loading} className="btn-primary w-full">
        {loading ? (uploadType === "folder" ? "Uploading Folder..." : "Uploading...") : (uploadType === "folder" ? "Upload Folder to Gallery" : "Upload to Gallery")}
      </button>
    </form>
  );
};

const EditImageForm = ({ image, onSuccess }: { image: GalleryImage, onSuccess: () => void }) => {
  const [form, setForm] = useState({ title: image.title, description: image.description || "", category: image.category });
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateDoc(doc(db, "images", image.id), form);
      onSuccess();
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `images/${image.id}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div><label className="form-label">Image Title</label><input type="text" className="form-input" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required /></div>
      <div><label className="form-label">Category</label><select className="form-input" value={form.category} onChange={e => setForm({...form, category: e.target.value})}><option>General</option><option>Operations</option><option>Training</option><option>Ceremony</option></select></div>
      <div><label className="form-label">Description</label><textarea className="form-input min-h-[100px]" value={form.description} onChange={e => setForm({...form, description: e.target.value})} /></div>
      <div className="flex gap-4 pt-4">
        <button type="submit" disabled={loading} className="btn-primary flex-1">{loading ? "Saving..." : "Save Changes"}</button>
        <button type="button" onClick={onSuccess} className="btn-secondary flex-1">Cancel</button>
      </div>
    </form>
  );
};

const EditNewsForm = ({ news, onSuccess }: { news: News, onSuccess: () => void }) => {
  const [form, setForm] = useState({ title: news.title, content: news.content, summary: news.summary || "", category: news.category });
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateDoc(doc(db, "news", news.id), {
        ...form,
        updated_at: new Date().toISOString()
      });
      onSuccess();
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `news/${news.id}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div><label className="form-label">Title</label><input type="text" className="form-input" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required /></div>
      <div><label className="form-label">Category</label><select className="form-input" value={form.category} onChange={e => setForm({...form, category: e.target.value})}><option>General</option><option>Security</option><option>Politics</option><option>Humanitarian</option></select></div>
      <div><label className="form-label">Summary</label><textarea className="form-input" value={form.summary} onChange={e => setForm({...form, summary: e.target.value})} /></div>
      <div><label className="form-label">Content</label><textarea className="form-input min-h-[200px]" value={form.content} onChange={e => setForm({...form, content: e.target.value})} required /></div>
      <div className="flex gap-4 pt-4">
        <button type="submit" disabled={loading} className="btn-primary flex-1">{loading ? "Saving..." : "Save Changes"}</button>
        <button type="button" onClick={onSuccess} className="btn-secondary flex-1">Cancel</button>
      </div>
    </form>
  );
};

const EditEventForm = ({ event, onSuccess }: { event: Event, onSuccess: () => void }) => {
  const [form, setForm] = useState({ title: event.title, description: event.description, event_date: event.event_date, location: event.location, event_type: event.event_type });
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateDoc(doc(db, "events", event.id), form);
      onSuccess();
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `events/${event.id}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div><label className="form-label">Title</label><input type="text" className="form-input" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required /></div>
      <div><label className="form-label">Type</label><select className="form-input" value={form.event_type} onChange={e => setForm({...form, event_type: e.target.value})}><option>Official</option><option>Training</option><option>Community</option><option>Ceremony</option></select></div>
      <div><label className="form-label">Date</label><input type="date" className="form-input" value={form.event_date} onChange={e => setForm({...form, event_date: e.target.value})} required /></div>
      <div><label className="form-label">Location</label><input type="text" className="form-input" value={form.location} onChange={e => setForm({...form, location: e.target.value})} required /></div>
      <div><label className="form-label">Description</label><textarea className="form-input min-h-[100px]" value={form.description} onChange={e => setForm({...form, description: e.target.value})} required /></div>
      <div className="flex gap-4 pt-4">
        <button type="submit" disabled={loading} className="btn-primary flex-1">{loading ? "Saving..." : "Save Changes"}</button>
        <button type="button" onClick={onSuccess} className="btn-secondary flex-1">Cancel</button>
      </div>
    </form>
  );
};

const NewsForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const { profile } = useAuth();
  const [form, setForm] = useState({ title: "", content: "", summary: "", category: "General", image_url: "" });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("News form submitted. File:", file?.name, "Profile:", profile?.full_name);
    if (!profile) {
      alert("User profile not loaded. Please try logging out and in again.");
      return;
    }
    setLoading(true);
    console.log("Starting news upload for:", file?.name || "No file");
    
    const uploadTimeout = setTimeout(() => {
      setLoading(false);
      alert("Upload is taking longer than expected. Please check your internet connection or Firebase Storage rules.");
    }, 45000);

    try {
      let finalImageUrl = form.image_url;
      
      if (file) {
        const storageRef = ref(storage, `news/${Date.now()}_${file.name}`);
        console.log("Storage ref created:", storageRef.fullPath);
        
        const uploadTask = uploadBytesResumable(storageRef, file);
        
        const snapshot = await new Promise<any>((resolve, reject) => {
          uploadTask.on('state_changed', null, reject, () => resolve(uploadTask.snapshot));
        });

        clearTimeout(uploadTimeout);
        console.log("Upload successful, getting URL...");
        finalImageUrl = await getDownloadURL(snapshot.ref);
        console.log("Download URL obtained:", finalImageUrl);
      } else {
        clearTimeout(uploadTimeout);
      }

      await addDoc(collection(db, "news"), {
        ...form,
        image_url: finalImageUrl,
        author: profile?.full_name || "Admin",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      console.log("Firestore document created.");
      onSuccess();
    } catch (error) {
      console.error("News Upload Error:", error);
      if (file) {
        handleStorageError(error, `news/${file.name}`);
      } else {
        handleFirestoreError(error, OperationType.CREATE, "news");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAiAction = async (action: "title" | "summary" | "improve") => {
    if (!form.content && action !== "title") {
      alert("Please enter some content first.");
      return;
    }
    if (!form.content && action === "title") {
      alert("Please enter some content so I can suggest a title.");
      return;
    }

    setAiLoading(action);
    try {
      let result = "";
      if (action === "title") {
        result = await suggestNewsTitle(form.content) || "";
        setForm(prev => ({ ...prev, title: result.replace(/^"|"$/g, '') }));
      } else if (action === "summary") {
        result = await generateNewsSummary(form.content) || "";
        setForm(prev => ({ ...prev, summary: result }));
      } else if (action === "improve") {
        result = await improveNewsContent(form.content) || "";
        setForm(prev => ({ ...prev, content: result }));
      }
    } catch (error: any) {
      console.error("AI Action Error:", error);
      if (error.message?.includes("MISSING_API_KEY")) {
        alert("AI Assistant: Please set your GEMINI_API_KEY in the Render environment variables.");
      } else {
        alert("AI Assistant is currently unavailable. Please try again later.");
      }
    } finally {
      setAiLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-green-50 p-4 rounded-lg border border-green-100 flex items-center gap-3 mb-4">
        <Sparkles className="text-green-700" size={24} />
        <div>
          <h4 className="font-bold text-green-900 text-sm">AI News Assistant</h4>
          <p className="text-green-700 text-xs">Use Gemini to help you write and refine your news articles.</p>
        </div>
      </div>

      <form onSubmit={submit} className="space-y-4">
        <div className="relative">
          <label className="form-label">Title</label>
          <div className="flex gap-2">
            <input type="text" className="form-input" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
            <button 
              type="button" 
              onClick={() => handleAiAction("title")}
              disabled={!!aiLoading}
              className="p-2 bg-slate-100 text-slate-600 rounded hover:bg-slate-200 transition-colors flex-shrink-0"
              title="Suggest Title"
            >
              {aiLoading === "title" ? <div className="animate-spin rounded-full h-4 w-4 border-2 border-slate-600 border-t-transparent" /> : <Type size={20} />}
            </button>
          </div>
        </div>

        <div><label className="form-label">Category</label><select className="form-input" value={form.category} onChange={e => setForm({...form, category: e.target.value})}><option>General</option><option>Operations</option><option>Humanitarian</option><option>Security</option></select></div>
        
        <div className="relative">
          <label className="form-label">Summary</label>
          <div className="flex gap-2">
            <input type="text" className="form-input" value={form.summary} onChange={e => setForm({...form, summary: e.target.value})} />
            <button 
              type="button" 
              onClick={() => handleAiAction("summary")}
              disabled={!!aiLoading}
              className="p-2 bg-slate-100 text-slate-600 rounded hover:bg-slate-200 transition-colors flex-shrink-0"
              title="Auto-generate Summary"
            >
              {aiLoading === "summary" ? <div className="animate-spin rounded-full h-4 w-4 border-2 border-slate-600 border-t-transparent" /> : <FileText size={20} />}
            </button>
          </div>
        </div>

        <div>
          <label className="form-label">Featured Image</label>
          <div className="flex flex-col gap-2">
            <input 
              type="file" 
              accept="image/*" 
              onChange={e => setFile(e.target.files ? e.target.files[0] : null)} 
              className="form-input"
            />
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">OR URL:</span>
              <input type="text" className="form-input text-xs py-1" value={form.image_url} onChange={e => setForm({...form, image_url: e.target.value})} placeholder="https://..." />
            </div>
          </div>
        </div>
        
        <div className="relative">
          <label className="form-label flex justify-between items-center">
            Content
            <button 
              type="button" 
              onClick={() => handleAiAction("improve")}
              disabled={!!aiLoading}
              className="text-xs flex items-center gap-1 text-green-700 font-bold hover:text-green-900"
            >
              {aiLoading === "improve" ? "Improving..." : <><Wand2 size={14} /> Improve with AI</>}
            </button>
          </label>
          <textarea className="form-input min-h-[200px]" value={form.content} onChange={e => setForm({...form, content: e.target.value})} required />
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? "Saving..." : "Save News Article"}</button>
      </form>
    </div>
  );
};

const EventForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const { profile } = useAuth();
  const [form, setForm] = useState({ title: "", description: "", event_date: "", location: "", event_type: "Official", image_url: "" });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Event form submitted. File:", file?.name, "Profile:", profile?.full_name);
    if (!profile) {
      alert("User profile not loaded. Please try logging out and in again.");
      return;
    }
    setLoading(true);
    console.log("Starting event upload for:", file?.name || "No file");
    
    const uploadTimeout = setTimeout(() => {
      setLoading(false);
      alert("Upload is taking longer than expected. Please check your internet connection or Firebase Storage rules.");
    }, 45000);

    try {
      let finalImageUrl = form.image_url;
      
      if (file) {
        const storageRef = ref(storage, `events/${Date.now()}_${file.name}`);
        console.log("Storage ref created:", storageRef.fullPath);
        
        const uploadTask = uploadBytesResumable(storageRef, file);
        
        const snapshot = await new Promise<any>((resolve, reject) => {
          uploadTask.on('state_changed', 
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log('Upload is ' + progress + '% done');
            }, 
            (error) => {
              console.error("Upload Task Error:", error);
              reject(error);
            }, 
            () => {
              resolve(uploadTask.snapshot);
            }
          );
        });

        console.log("Upload successful, getting URL...");
        finalImageUrl = await getDownloadURL(snapshot.ref);
        console.log("Download URL obtained:", finalImageUrl);
      }
      
      clearTimeout(uploadTimeout);
      console.log("Adding event document to Firestore...");
      await addDoc(collection(db, "events"), {
        ...form,
        image_url: finalImageUrl,
        created_by: profile?.full_name || "Admin",
        created_at: new Date().toISOString()
      });
      console.log("Event document created successfully.");
      onSuccess();
    } catch (error: any) {
      clearTimeout(uploadTimeout);
      console.error("Event Upload Error:", error);
      if (error.code?.startsWith('storage/')) {
        handleStorageError(error, `events/${file?.name || 'unknown'}`);
      } else {
        handleFirestoreError(error, OperationType.CREATE, "events");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div><label className="form-label">Event Title</label><input type="text" className="form-input" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required /></div>
      <div><label className="form-label">Event Type</label><select className="form-input" value={form.event_type} onChange={e => setForm({...form, event_type: e.target.value})}><option>Official</option><option>Training</option><option>Community</option><option>Ceremony</option></select></div>
      <div><label className="form-label">Date</label><input type="date" className="form-input" value={form.event_date} onChange={e => setForm({...form, event_date: e.target.value})} required /></div>
      <div><label className="form-label">Location</label><input type="text" className="form-input" value={form.location} onChange={e => setForm({...form, location: e.target.value})} /></div>
      <div>
        <label className="form-label">Event Image</label>
        <div className="flex flex-col gap-2">
          <input 
            type="file" 
            accept="image/*" 
            onChange={e => setFile(e.target.files ? e.target.files[0] : null)} 
            className="form-input"
          />
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">OR URL:</span>
            <input type="text" className="form-input text-xs py-1" value={form.image_url} onChange={e => setForm({...form, image_url: e.target.value})} placeholder="https://..." />
          </div>
        </div>
      </div>
      <div><label className="form-label">Description</label><textarea className="form-input min-h-[150px]" value={form.description} onChange={e => setForm({...form, description: e.target.value})} required /></div>
      <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? "Saving..." : "Save Event"}</button>
    </form>
  );
};

const UserForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const [form, setForm] = useState({ email: "", full_name: "", unit: "FHQ", role: "user" });
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Find if user already exists by email (username)
      const q = query(collection(db, "users"), where("username", "==", form.email));
      const snap = await getDocs(q);
      
      if (!snap.empty) {
        alert("A profile with this email already exists.");
        setLoading(false);
        return;
      }

      // Create a pre-approved profile. 
      // When the user logs in with this email, the AuthProvider will find it.
      await addDoc(collection(db, "users"), {
        full_name: form.full_name,
        username: form.email,
        role: form.role,
        unit: form.unit,
        created_at: new Date().toISOString()
      });
      
      alert(`User ${form.full_name} has been authorized as ${form.role}. They can now log in using this email.`);
      onSuccess();
    } catch (error) {
      console.error("Error creating user:", error);
      alert("Error creating user profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div><label className="form-label">Email Address</label><input type="email" className="form-input" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required /></div>
      <div><label className="form-label">Full Name</label><input type="text" className="form-input" value={form.full_name} onChange={e => setForm({...form, full_name: e.target.value})} required /></div>
      <div><label className="form-label">Unit / Contingent</label><input type="text" className="form-input" value={form.unit} onChange={e => setForm({...form, unit: e.target.value})} required /></div>
      <div>
        <label className="form-label">Role</label>
        <select className="form-input" value={form.role} onChange={e => setForm({...form, role: e.target.value})}>
          <option value="user">Standard User</option>
          <option value="admin">Administrator</option>
        </select>
      </div>
      <p className="text-xs text-slate-500 italic">Note: This user will be automatically granted access when they first log in with this email.</p>
      <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? "Authorizing..." : "Authorize User"}</button>
    </form>
  );
};

const PendingApproval = () => {
  const { logout, user } = useAuth();
  return (
    <div className="min-h-screen flex items-center justify-center p-8 text-center">
      <div className="bg-white/95 backdrop-blur-md p-10 w-full max-w-md shadow-2xl border-t-8 border-yellow-600">
        <div className="mb-6">
          <img 
            src="https://customer-assets.emergentagent.com/job_secure-comms-36/artifacts/yxcc2zx2_image.png" 
            alt="ECOMIG Logo" 
            className="h-24 mx-auto object-contain"
            referrerPolicy="no-referrer"
          />
        </div>
        <Shield size={64} className="mx-auto text-yellow-600 mb-6" />
        <h1 className="font-heading text-3xl font-bold uppercase text-slate-900 mb-4">Access Pending</h1>
        <p className="text-slate-600 mb-8">
          Your account (<strong>{user?.email}</strong>) has been registered, but it is currently pending approval by the System Administrator.
        </p>
        <div className="bg-slate-50 p-6 rounded-lg mb-8 text-sm text-slate-500 italic">
          Please contact your Unit Commander or the J6 Cell to activate your portal access.
        </div>
        <button onClick={logout} className="btn-secondary w-full">Logout & Return</button>
      </div>
    </div>
  );
};

const Gatekeeper = ({ children }: { children: ReactNode }) => {
  const { user, profile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-700 border-t-transparent mx-auto mb-4"></div>
          <p className="text-white font-bold uppercase tracking-widest">Authenticating...</p>
        </div>
      </div>
    );
  }

  // Allow access to the admin login page without being logged in
  if (location.pathname === "/admin") {
    return <>{children}</>;
  }

  if (!user) {
    return <AdminLogin />;
  }

  if (!profile || profile.role === "pending") {
    return <PendingApproval />;
  }

  return <>{children}</>;
};

// --- APP ---
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Gatekeeper>
          <Routes>
            <Route path="/" element={<><Navbar /><HomePage /><Footer /></>} />
            <Route path="/about" element={<><Navbar /><AboutPage /><Footer /></>} />
            <Route path="/leadership" element={<><Navbar /><LeadershipPage /><Footer /></>} />
            <Route path="/departments" element={<><Navbar /><DepartmentsPage /><Footer /></>} />
            <Route path="/departments/:code" element={<><Navbar /><DepartmentDetailPage /><Footer /></>} />
            <Route path="/news" element={<><Navbar /><NewsPage /><Footer /></>} />
            <Route path="/news/category/:category" element={<><Navbar /><NewsPage /><Footer /></>} />
            <Route path="/news/:id" element={<><Navbar /><NewsDetailPage /><Footer /></>} />
            <Route path="/events" element={<><Navbar /><EventsPage /><Footer /></>} />
            <Route path="/events/:category" element={<><Navbar /><EventsPage /><Footer /></>} />
            <Route path="/gallery" element={<><Navbar /><GalleryPage /><Footer /></>} />
            <Route path="/contact" element={<><Navbar /><ContactPage /><Footer /></>} />
            <Route path="/mailbox" element={<><Navbar /><MailboxPage /><Footer /></>} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Routes>
        </Gatekeeper>
      </BrowserRouter>
    </AuthProvider>
  );
}
