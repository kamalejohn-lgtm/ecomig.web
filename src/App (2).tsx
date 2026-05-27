import React, { useState } from 'react';
import { Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Layout Components
import { TopNav } from './components/layout/TopNav';

// Feature Components
import { Home } from './components/home/Home';
import { AboutMission } from './components/about/AboutMission';
import { MissionDepartments } from './components/departments/MissionDepartments';
import { EcomigTV } from './components/tv/EcomigTV';
import { MissionLeadership } from './components/leadership/MissionLeadership';
import { ChronicleOfCommand } from './components/chronicle/ChronicleOfCommand';
import { InternalLogin } from './components/auth/InternalLogin';
import { AdminPanel } from './components/admin/AdminPanel';
import { GlobalNews } from './components/news/GlobalNews';
import { NewspaperReview } from './components/news/NewspaperReview';
import { NewsFeed } from './components/news/NewsFeed';
import { MissionCalendar } from './components/calendar/MissionCalendar';
import { SportsPortal } from './components/sports/SportsPortal';
import { GalleryViewer } from './components/gallery/GalleryViewer';
import { InternalMailPortal } from './components/mail/InternalMailPortal';
import { EcomigEvents } from './components/events/EcomigEvents';
import { AIAssistant } from './components/ui/AIAssistant';
import { ContactMission } from './components/contact/ContactMission';
import { MissionDocumentsArchive } from './components/documents/MissionDocumentsArchive';

import { NavItem } from './types';

const App = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [isAdmin, setIsAdmin] = useState(false);
  const [navItems, setNavItems] = useState<NavItem[]>([
    { id: 'home', label: 'HOME MESSAGE', subLabel: 'SYSTEM STATE: SYNCHED' },
    { id: 'about', label: 'MISSION PROFILE', subLabel: 'SYSTEM STATE: SYNCHED' },
    { id: 'leadership', label: 'COMMAND STRUCTURE', subLabel: 'SYSTEM STATE: SYNCHED' },
    { id: 'chronicle', label: 'CHRONICLE OF COMMAND', subLabel: 'SYSTEM STATE: SYNCHED' },
    { id: 'depts', label: 'DEPARTMENTS', subLabel: 'SYSTEM STATE: SYNCHED' },
    { id: 'events', label: 'ECOMIG EVENTS', subLabel: 'SYSTEM STATE: SYNCHED' },
    { id: 'gallery', label: 'GALLERY UPLOADS', subLabel: 'SYSTEM STATE: SYNCHED' },
    { id: 'tv', label: 'ECOMIG TV BROADCAST', subLabel: 'SYSTEM STATE: SYNCHED' },
    { id: 'news', label: 'GLOBAL NEWS', subLabel: 'SYSTEM STATE: SYNCHED' },
    { id: 'newspaper_review', label: 'NEWS FEED', subLabel: 'SYSTEM STATE: SYNCHED' },
    { id: 'sports', label: 'MISSION SPORTS', subLabel: 'SYSTEM STATE: SYNCHED' },
    { id: 'mailbox', label: 'SECURE MAILBOX', subLabel: 'SYSTEM STATE: SYNCHED' },
    { id: 'documents', label: 'MISSION DOCUMENTS', subLabel: 'SYSTEM STATE: SYNCHED' },
    { id: 'contact', label: 'CONTACT US', subLabel: 'SYSTEM STATE: SYNCHED' },
    { id: 'login', label: 'COMMAND LOGIN', subLabel: 'SYSTEM STATE: SECURE' },
    { id: 'admin', label: 'ADMIN DASHBOARD', subLabel: 'SYSTEM STATE: MASTER' },
  ]);

   return (
    <div className="min-h-screen text-white relative overflow-x-hidden font-sans selection:bg-[#00853F] selection:text-white transition-colors duration-1000 bg-transparent">
      {activeTab !== 'login' && (
        <TopNav 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          isAdmin={isAdmin} 
          setIsAdmin={setIsAdmin} 
          navItems={navItems}
        />
      )}
      
      <main className="relative z-10 flex flex-col items-center">
        <AnimatePresence>
          {isAdmin && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 pointer-events-none z-[99]"
            >
              <div className="absolute inset-0 border-[20px] border-[#00853F]/20" />
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00853F] to-transparent animate-pulse" />
              <div className="absolute top-0 right-10 p-4 bg-[#00853F] text-white font-black text-[10px] tracking-[0.3em] uppercase italic">
                SECURE COMMAND SESSION ACTIVE // L-V-L 5
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`w-full ${activeTab === 'home' && !isAdmin ? '' : activeTab === 'login' ? 'min-h-screen' : 'max-w-[1380px] mt-24 sm:mt-28 mb-16 sm:mb-24 bg-transparent backdrop-blur-[2px] rounded-3xl overflow-hidden min-h-[80vh] px-2 sm:px-6'} relative`}
        >
          <AnimatePresence mode="wait">
            {isAdmin ? (
               <motion.div key="admin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                  <AdminPanel navItems={navItems} onUpdateNav={(newNav) => setNavItems(newNav)} />
               </motion.div>
            ) : (
              <>
                {activeTab === 'home' && (
                  <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                    <Home setActiveTab={setActiveTab} />
                  </motion.div>
                )}

                {activeTab === 'about' && (
                  <motion.div key="about" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
                    <AboutMission />
                  </motion.div>
                )}

                {activeTab === 'depts' && (
                  <motion.div key="depts" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.02 }} transition={{ duration: 0.3 }}>
                    <MissionDepartments />
                  </motion.div>
                )}

                {activeTab === 'tv' && (
                  <motion.div key="tv" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
                    <div className="p-4 md:p-8">
                       <EcomigTV />
                    </div>
                  </motion.div>
                )}

                {activeTab === 'leadership' && (
                  <motion.div key="leadership" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
                    <div className="p-4 md:p-8">
                       <MissionLeadership />
                    </div>
                  </motion.div>
                )}

                {activeTab === 'chronicle' && (
                  <motion.div key="chronicle" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
                    <ChronicleOfCommand />
                  </motion.div>
                )}

                {activeTab === 'login' && (
                  <motion.div 
                    key="login" 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }} 
                    transition={{ duration: 0.3 }}
                    className="w-full h-full"
                  >
                    <InternalLogin setIsAdmin={setIsAdmin} />
                  </motion.div>
                )}

                {activeTab === 'admin' && (
                  <motion.div key="admin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                    <AdminPanel navItems={navItems} onUpdateNav={(newNav) => setNavItems(newNav)} />
                  </motion.div>
                )}

                {activeTab === 'news' && (
                  <motion.div key="news" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
                    <div className="p-4 md:p-8">
                      <GlobalNews />
                    </div>
                  </motion.div>
                )}

                {activeTab === 'newspaper_review' && (
                  <motion.div key="newspaper_review" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
                    <div className="p-4 md:p-8">
                      <NewspaperReview />
                    </div>
                  </motion.div>
                )}

                {activeTab === 'feed' && (
                  <motion.div key="feed" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
                    <NewsFeed />
                  </motion.div>
                )}

                {activeTab === 'events' && (
                  <motion.div key="events" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                    <EcomigEvents />
                  </motion.div>
                )}

                {activeTab === 'calendar' && (
                  <motion.div key="calendar" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                    <MissionCalendar />
                  </motion.div>
                )}

                {activeTab === 'sports' && (
                  <motion.div key="sports" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                    <SportsPortal />
                  </motion.div>
                )}

                {activeTab === 'gallery' && (
                  <motion.div key="gallery" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                    <GalleryViewer />
                  </motion.div>
                )}

                {activeTab === 'mailbox' && (
                  <motion.div key="mailbox" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                    <InternalMailPortal />
                  </motion.div>
                )}

                {activeTab === 'documents' && (
                  <motion.div key="documents" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                    <MissionDocumentsArchive />
                  </motion.div>
                )}
                
                {activeTab === 'contact' && (
                  <motion.div key="contact" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
                    <ContactMission />
                  </motion.div>
                )}
              </>
            )}
          </AnimatePresence>
        </motion.div>

        <div className="mt-20 flex items-center gap-16 opacity-30 pointer-events-none group font-display">
           <span className="font-bold italic text-3xl tracking-tighter text-white/50 group-hover:text-white transition-colors">ECOMIG</span>
           <span className="font-bold italic text-3xl tracking-tighter text-[#00853F]/50 group-hover:text-[#00853F] transition-colors">ECOWAS</span>
           <Shield size={48} className="text-white/50 group-hover:text-white transition-colors" />
           <span className="font-bold italic text-3xl tracking-tighter text-white/50 group-hover:text-white transition-colors">MHQ-01</span>
        </div>
      </main>
      <AIAssistant />
    </div>
  );
};

export default App;
