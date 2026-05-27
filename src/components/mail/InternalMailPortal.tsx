import React, { useState, useRef } from 'react';
import { Mail, Share2, BookOpen, Trash2, LogOut, ChevronDown, Camera, Facebook, MessageCircle, Send, Cpu, Youtube, ExternalLink, CheckCircle2, Lock, Key, Eye, EyeOff, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrandHeader } from '../common/BrandHeader';
import { EcomigVideoConference } from '../video/EcomigVideoConference';

interface Email {
  id: number;
  from: string;
  to: string;
  subject: string;
  body: string;
  frenchBody?: string;
  date: string;
  time: string;
  folder: string;
}

export const InternalMailPortal: React.FC = () => {
  const [activeFolder, setActiveFolder] = useState('inbox');
  const [isComposing, setIsComposing] = useState(false);
  const [selectedMail, setSelectedMail] = useState<Email | null>(null);
  const [showNotification, setShowNotification] = useState<string | null>(null);

  // File upload refs
  const imageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const deptEmails = [
    'admin@ecomig.org', 'mhq@ecomig.org', 'fhq@ecomig.org', 'dfc@ecomig.org',
    'j1@ecomig.org', 'j2@ecomig.org', 'j3@ecomig.org', 'j4@ecomig.org', 'j6@ecomig.org',
    'j7@ecomig.org', 'pm@ecomig.org', 'pi@ecomig.org', 'pa@ecomig.org',
    'cc@ecomig.org', 'procoy@ecomig.org', 'comm@ecomig.org', 'senbat@ecomig.org',
    'nigcoy@ecomig.org', 'ghancoy@ecomig.org', 'senfpu@ecomig.org'
  ];

  // Secured states as requested
  const [currentUser, setCurrentUser] = useState<string | null>(() => {
    return localStorage.getItem('ecomig_current_user') || null;
  });

  const [passwords, setPasswords] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem('ecomig_mail_passwords');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback to default
      }
    }
    const initial: Record<string, string> = {};
    const emailsList = [
      'admin@ecomig.org', 'mhq@ecomig.org', 'fhq@ecomig.org', 'dfc@ecomig.org',
      'j1@ecomig.org', 'j2@ecomig.org', 'j3@ecomig.org', 'j4@ecomig.org', 'j6@ecomig.org',
      'j7@ecomig.org', 'pm@ecomig.org', 'pi@ecomig.org', 'pa@ecomig.org',
      'cc@ecomig.org', 'procoy@ecomig.org', 'comm@ecomig.org', 'senbat@ecomig.org',
      'nigcoy@ecomig.org', 'ghancoy@ecomig.org', 'senfpu@ecomig.org'
    ];
    emailsList.forEach(email => {
      initial[email] = 'ecomig2026'; // Default system-wide password
    });
    return initial;
  });

  const [loginEmail, setLoginEmail] = useState('admin@ecomig.org');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Passwords rotation view states
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [changeCurrent, setChangeCurrent] = useState('');
  const [changeNew, setChangeNew] = useState('');
  const [changeConfirm, setChangeConfirm] = useState('');

  const [emails, setEmails] = useState<Email[]>([
    { id: 1, from: 'admin@ecomig.org', to: 'mhq@ecomig.org', subject: 'TACTICAL RECON UPDATE', body: 'Regional sectors 4 and 5 report stable status. Personnel rotation scheduled for 0600hrs.', date: '16 MAY 2026', time: '09:42', folder: 'inbox' },
    { id: 2, from: 'j4@ecomig.org', to: 'mhq@ecomig.org', subject: 'SUPPLY CHIAN OPTIMIZATION', body: 'New shipment of tactical gear has arrived at the Barra crossing. Awaiting clearance.', date: '15 MAY 2026', time: '14:20', folder: 'inbox' },
    { id: 3, from: 'j6@ecomig.org', to: 'mhq@ecomig.org', subject: 'ENCRYPTION KEY RENEWAL', body: 'All terminal access keys will be rotated at midnight. Please ensure all active sessions are logged out.', date: '14 MAY 2026', time: '11:15', folder: 'inbox' },
    { id: 4, from: 'admin@ecomig.org', to: 'MHQ-ALL', subject: 'JOINT INTELLIGENCE BROADCAST', body: 'All sectors maintain high alert level orange. Coordinate with J2 for satellite updates.', date: '13 MAY 2026', time: '10:00', folder: 'inbox' },
    { id: 5, from: 'mhq@ecomig.org', to: 'j4@ecomig.org', subject: 'LOGISTICS DEPLOYMENT APPROVAL', body: 'Brikama logistics supply depot construction cleared. Initiate sector operations.', date: '12 MAY 2026', time: '16:45', folder: 'inbox' },
    { id: 6, from: 'mhq@ecomig.org', to: 'j6@ecomig.org', subject: 'SIGNAL SECURITY MANUAL', body: 'Establish backup secure frequency blocks at 142.925 MHz for active voice bridges.', date: '11 MAY 2026', time: '08:30', folder: 'inbox' }
  ]);

  const [composeData, setComposeData] = useState({
    from: 'admin@ecomig.org',
    to: '',
    subject: '',
    body: '',
    frenchBody: ''
  });

  const [isTranslating, setIsTranslating] = useState(false);
  const [isTranslatingReceived, setIsTranslatingReceived] = useState(false);
  const translationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const translateText = async (text: string, isCompose: boolean = true) => {
    if (!text.trim()) {
      if (isCompose) setComposeData(prev => ({ ...prev, frenchBody: '' }));
      return;
    }

    if (isCompose) setIsTranslating(true);
    else setIsTranslatingReceived(true);

    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, targetLanguage: 'French' }),
      });
      
      const responseText = await response.text();
      let data: any;

      try {
        data = JSON.parse(responseText);
      } catch (e) {
        // Response was not JSON (likely HTML error page)
        console.error('Non-JSON response received:', responseText.slice(0, 500));
        
        const responseLower = responseText.toLowerCase();
        
        if (responseLower.includes('<!doctype') || responseLower.includes('<html')) {
          if (responseLower.includes('starting server')) {
            console.warn('[MAIL] Server rebooting, silent retry scheduled...');
            // Silent retry after delay, don't trigger notification for this transient state
            setTimeout(() => translateText(text, isCompose), 6000);
            return;
          }
          triggerNotification("ERROR: SECURE CHANNEL RETURNED HTML [502/504]");
        } else {
          triggerNotification(`ERROR: ${responseText.slice(0, 50) || "UNKNOWN SECURE ERROR"}`);
        }
        return;
      }

      if (!response.ok) {
        const errorMsg = data.error || response.statusText || "REQUEST FAILED";
        if (errorMsg.includes("GEMINI_API_KEY") || errorMsg.includes("API Key Missing")) {
          triggerNotification("ERROR: GEMINI_API_KEY IS MISSING. PLEASE SELECT IT IN SETTINGS > SECRETS.");
        } else {
          triggerNotification(`ERROR: ${errorMsg}`);
        }
        return;
      }

      if (data.translatedText) {
        if (isCompose) {
          setComposeData(prev => ({ ...prev, frenchBody: data.translatedText }));
        } else if (selectedMail) {
          setSelectedMail({ ...selectedMail, frenchBody: data.translatedText });
          setEmails(emails.map(e => e.id === selectedMail.id ? { ...e, frenchBody: data.translatedText } : e));
        }
      } else if (data.error) {
        triggerNotification(`ERROR: ${data.error}`);
      }
    } catch (error) {
      console.error('Translation failed:', error);
      triggerNotification('CONNECTION ERROR: CHECK SERVER STATUS');
    } finally {
      if (isCompose) setIsTranslating(false);
      else setIsTranslatingReceived(false);
    }
  };

  const handleBodyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setComposeData(prev => ({ ...prev, body: text }));

    if (translationTimeoutRef.current) {
      clearTimeout(translationTimeoutRef.current);
    }

    translationTimeoutRef.current = setTimeout(() => {
      translateText(text);
    }, 2000);
  };

  const triggerNotification = (message: string) => {
    setShowNotification(message);
    setTimeout(() => setShowNotification(null), 3000);
  };

  const handleSend = () => {
    if (!composeData.to) {
      triggerNotification('ERROR: SELECT A RECIPIENT');
      return;
    }
    if (!composeData.subject.trim()) {
      triggerNotification('ERROR: SUBJECT IDENTIFIER REQUIRED');
      return;
    }
    if (!composeData.body.trim()) {
      triggerNotification('ERROR: MESSAGE CONTENT EMPTY');
      return;
    }

    // Fallback: If French translation is still empty, use English body for French field
    const finalFrenchBody = composeData.frenchBody.trim() || `[EN] ${composeData.body}`;

    const dateFormatted = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase();
    const timeFormatted = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

    // For sent box
    const sentMail: Email = {
      id: Date.now(),
      from: currentUser || 'admin@ecomig.org',
      to: composeData.to,
      subject: composeData.subject,
      body: composeData.body,
      frenchBody: finalFrenchBody,
      date: dateFormatted,
      time: timeFormatted,
      folder: 'sent'
    };

    // For recipient's inbox
    const inboxMail: Email = {
      id: Date.now() + 1,
      from: currentUser || 'admin@ecomig.org',
      to: composeData.to,
      subject: composeData.subject,
      body: composeData.body,
      frenchBody: finalFrenchBody,
      date: dateFormatted,
      time: timeFormatted,
      folder: 'inbox'
    };

    setEmails(prev => [sentMail, inboxMail, ...prev]);
    setIsComposing(false);
    setComposeData({ from: currentUser || 'admin@ecomig.org', to: '', subject: '', body: '', frenchBody: '' });
    triggerNotification('MISSION MESSAGE TRANSMITTED SUCCESSFULLY');
  };

  const handleDelete = (id: number) => {
    setEmails(emails.map(email => 
      email.id === id ? { ...email, folder: 'deleted' } : email
    ));
    setSelectedMail(null);
    triggerNotification('MESSAGE MOVED TO TRASH');
  };

  const permanentlyDelete = (id: number) => {
    setEmails(emails.filter(email => email.id !== id));
    triggerNotification('MESSAGE ERASED PERMANENTLY');
  };

  const filteredEmails = emails.filter(email => {
    if (!currentUser) return false;
    
    // admin@ecomig.org holds master clearance -- sees all items in active folder
    if (currentUser === 'admin@ecomig.org') {
      return email.folder === activeFolder;
    }

    // Other departments see items only where they are sender, individual recipient, or part of MHQ-ALL broadcast list
    const isAffiliated = email.from === currentUser || email.to === currentUser || email.to === 'MHQ-ALL';
    if (!isAffiliated) return false;

    if (activeFolder === 'inbox') {
      return email.folder === 'inbox' && (email.to === currentUser || email.to === 'MHQ-ALL');
    }
    if (activeFolder === 'sent') {
      return email.folder === 'sent' && email.from === currentUser;
    }
    
    return email.folder === activeFolder;
  });

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    const storedPass = passwords[loginEmail] || 'ecomig2026';
    if (loginPassword === storedPass) {
      setCurrentUser(loginEmail);
      localStorage.setItem('ecomig_current_user', loginEmail);
      setLoginPassword('');
      triggerNotification(`SECURE ACCESS GRANTED: ${loginEmail}`);
    } else {
      setLoginError('INVALID AUTHENTICATION KEY OR PASSCODE');
      triggerNotification('ACCESS DENIED: DEV-PROTOCOL OUT OF BOUNDS');
    }
  };

  const updatePassword = (email: string, oldPass: string, newPass: string) => {
    if (passwords[email] !== oldPass) {
      triggerNotification('ERROR: CURRENT PASSWORD INCORRECT');
      return false;
    }
    if (newPass.length < 4) {
      triggerNotification('ERROR: PASSWORD TOO SHORT (MIN 4 CHARS)');
      return false;
    }
    const updated = { ...passwords, [email]: newPass };
    setPasswords(updated);
    localStorage.setItem('ecomig_mail_passwords', JSON.stringify(updated));
    triggerNotification('PASSWORD UPDATED SUCCESSFULLY');
    return true;
  };

  if (!currentUser) {
    return (
      <div className="p-4 md:p-12 max-w-7xl mx-auto w-full relative min-h-screen flex items-center justify-center">
        {/* Camo outer frame */}
        <div className="bg-[#00853F] border-[12px] border-[#006e36] p-1 shadow-2xl overflow-hidden relative rounded-3xl w-full max-w-lg">
          {/* Outer Frame Bevel */}
          <div className="absolute inset-0 border-t-[4px] border-l-[4px] border-white/20 pointer-events-none z-10" />
          <div className="absolute inset-0 border-b-[4px] border-r-[4px] border-black/40 pointer-events-none z-10" />

          {/* Glowing HUD inner grid card */}
          <div className="bg-[#002f15] border-4 border-[#003d1c] p-6 text-white text-center relative z-20 space-y-6">
            <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-[#00ea65]" />
            <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-[#00ea65]" />
            <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-[#00ea65]" />
            <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-[#00ea65]" />

            <div className="flex justify-center flex-col items-center gap-2">
              <ShieldAlert className="text-yellow-400 animate-pulse mb-1" size={36} />
              <BrandHeader title="SECURE MAILBOX" subtitle="DEPARTMENTAL ENCRYPTED LOGON" />
            </div>

            <p className="text-[10px] text-gray-300 font-mono tracking-wider max-w-sm mx-auto leading-relaxed">
              This communications terminal is encrypted under Joint ECOWAS Military Protocol. Unauthorized ingress is strictly prohibited and trace routed.
            </p>

            <form onSubmit={handleLoginSubmit} className="space-y-4 text-left">
              <div className="space-y-1">
                <label className="text-[8px] font-black tracking-widest text-[#00ea65] uppercase block">
                  DEPARTMENT SELECTOR:
                </label>
                <div className="relative bg-white border-2 border-gray-400 p-1 flex items-center">
                  <span className="px-3 text-[9px] font-black text-black tracking-widest border-r border-[#00853F]/10">DEPT:</span>
                  <select 
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="flex-grow bg-transparent px-3 py-2 outline-none font-bold text-black text-xs md:text-sm font-mono appearance-none"
                  >
                    {deptEmails.map(email => (
                      <option key={`login-${email}`} value={email}>{email}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[8px] font-black tracking-widest text-[#00ea65] uppercase block">
                  SECURE PASSCODE / UNLOCK KEY:
                </label>
                <div className="relative bg-white border-2 border-gray-400 p-1 flex items-center">
                  <span className="px-3 text-[9px] font-black text-black tracking-widest border-r border-[#00853F]/10">KEY:</span>
                  <input 
                    type={showPassword ? "text" : "password"}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="ENTER SECRET DEPT PASSCODE"
                    className="flex-grow bg-transparent px-3 py-2 outline-none font-bold text-black text-xs md:text-sm font-mono tracking-wider"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="px-2 text-black/60 hover:text-black transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {loginError && (
                <div className="p-2.5 border border-red-500 bg-red-950/40 text-red-500 text-[9px] font-mono uppercase font-bold text-center tracking-wider">
                  ⚠️ {loginError}
                </div>
              )}

              <button 
                type="submit"
                className="w-full bg-[#00ea65] hover:bg-[#00ff73] text-black py-4 border-b-4 border-r-4 border-green-800 font-extrabold text-[10px] tracking-[0.25em] uppercase transition-all shadow-xl active:translate-y-1 active:border-0"
              >
                UNCOUPLE ENCRYPTED SEALS // SUBMIT
              </button>
            </form>

            <div className="pt-2 border-t border-white/5 bg-black/15 p-3 text-center">
              <span className="text-[9px] font-black text-yellow-400 tracking-wider uppercase block">
                🔑 DEFAULT SEALS UNLOCK PASSCODE:
              </span>
              <span className="text-xs font-mono text-white block mt-1 font-bold bg-[#004d24] py-1 border border-white/10 select-all">
                ecomig2026
              </span>
              <span className="text-[7px] text-gray-400 tracking-widest uppercase block mt-1 leading-normal">
                (After logon, you can customize your department key on this page)
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-1 sm:p-4 md:p-12 max-w-7xl mx-auto w-full relative min-h-screen">
      {/* Hidden File Inputs */}
      <input 
        type="file" 
        ref={imageInputRef} 
        className="hidden" 
        accept="image/*" 
        onChange={(e) => e.target.files?.[0] && triggerNotification(`IMAGE UPLOADED: ${e.target.files[0].name}`)} 
      />
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        onChange={(e) => e.target.files?.[0] && triggerNotification(`FILE UPLOADED: ${e.target.files[0].name}`)} 
      />

      {/* Global Notification */}
      <AnimatePresence>
        {showNotification && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 30 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-0 left-1/2 -translate-x-1/2 z-[100] bg-white text-[#00853F] px-8 py-4 border-[6px] border-[#00853F] font-black text-xs tracking-widest uppercase shadow-2xl flex items-center gap-4"
          >
            <CheckCircle2 size={24} />
            {showNotification}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-[#00a651] border-4 sm:border-[16px] border-[#006e36] shadow-[inset_0_0_100px_rgba(0,0,0,0.5),20px_20px_60px_rgba(0,0,0,0.4)] overflow-hidden flex flex-col md:flex-row min-h-[600px] relative">
        {/* Outer Frame Bevel */}
        <div className="absolute inset-0 border-t-[8px] border-l-[8px] border-white/20 pointer-events-none z-10" />
        <div className="absolute inset-0 border-b-[8px] border-r-[8px] border-black/40 pointer-events-none z-10" />

        {/* Sidebar */}
        <div className="w-full md:w-80 bg-[#004d24] border-r-[8px] border-[#00361a] flex flex-shrink-0 flex-col relative z-20">
          <div className="absolute inset-y-0 right-0 w-[4px] bg-black/20" />
          <div className="p-8 border-b-4 border-[#00361a]">
            <div className="flex flex-col items-center gap-4 mb-8 text-center">
              <BrandHeader title="SECURE MAILS" subtitle="MHQ-01 TERMINAL" />
            </div>
            
            <button 
              onClick={() => { setIsComposing(true); setSelectedMail(null); }}
              className={`w-full py-4 font-black text-[10px] tracking-[0.2em] uppercase transition-all shadow-xl active:translate-y-1 active:border-0 border-b-4 border-r-4 ${
                isComposing ? 'bg-[#00853F] text-white border-[#00361a]' : 'bg-white text-[#00853F] border-gray-300 hover:bg-gray-100'
              }`}
            >
              COMPOSE MESSAGE
            </button>
          </div>

          <div className="flex-grow overflow-y-auto p-4 space-y-3">
            {[
              { id: 'inbox', label: 'INBOX', icon: <Mail size={18} /> },
              { id: 'sent', label: 'SENT', icon: <Share2 size={18} /> },
              { id: 'drafts', label: 'DRAFTS', icon: <BookOpen size={18} /> },
              { id: 'deleted', label: 'DELETED', icon: <Trash2 size={18} /> }
            ].map((folder) => (
              <button
                key={folder.id}
                onClick={() => { setActiveFolder(folder.id); setIsComposing(false); setSelectedMail(null); }}
                className={`w-full flex items-center gap-4 px-6 py-4 transition-all font-bold text-[10px] tracking-widest uppercase border-b-2 border-r-2 ${
                  activeFolder === folder.id && !isComposing 
                    ? 'bg-white text-[#00853F] border-gray-300 shadow-inner translate-x-1 translate-y-1 border-0' 
                    : 'text-white border-transparent hover:bg-white/10'
                }`}
              >
                {folder.icon}
                {folder.label}
              </button>
            ))}

            {/* Vertically arranged small social & copilot links */}
            <div className="pt-4 border-t border-white/10 space-y-3">
              <span className="block text-[8px] font-black text-white/40 tracking-[0.2em] uppercase px-2 mb-1">Portals</span>
              <a 
                href="https://www.facebook.com/people/Ecomig-Ecowas/61578966714906/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-full h-12 flex items-center justify-center bg-[#5b9bd5] text-white rounded-2xl font-black text-base tracking-normal transition-all hover:brightness-110 active:scale-95"
              >
                Facebook
              </a>
              <a 
                href="https://chat.whatsapp.com/HUP3TEu7L1R3baRFISJGYb" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-full h-12 flex items-center justify-center bg-[#00b050] text-white rounded-2xl font-black text-base tracking-normal transition-all hover:brightness-110 active:scale-95"
              >
                WhatsApp
              </a>
               <a 
                href="https://t.me/ecomig_official" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-full h-12 flex items-center justify-center bg-[#0088cc] text-white rounded-2xl font-black text-base tracking-normal transition-all hover:brightness-110 active:scale-95"
              >
                Telegram
              </a>
              <a 
                href="https://www.youtube.com/@ecowas_cedeao" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-full h-12 flex items-center justify-center bg-[#ff0000] text-white rounded-2xl font-black text-base tracking-normal transition-all hover:brightness-110 active:scale-95"
              >
                YouTube
              </a>
              <button 
                onClick={() => window.dispatchEvent(new CustomEvent('open-ecomig-ai'))}
                className="w-full h-12 flex items-center justify-center bg-[#4f46e5] text-white rounded-2xl font-black text-base tracking-normal transition-all hover:brightness-110 active:scale-95 cursor-pointer"
              >
                ECOMIG AI
              </button>
            </div>
          </div>

          {/* Active Operator Status & Rotator Controls */}
          <div className="p-4 mx-4 mb-2 bg-[#001c0c]/80 border border-white/5 space-y-3 rounded">
            <div>
              <p className="text-[7px] font-black text-[#00ea65] tracking-widest uppercase">ACTIVE DEPARTMENT OPERATOR :</p>
              <p className="text-[10px] font-mono font-bold text-white break-all">{currentUser}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5">
              <button 
                onClick={() => { setIsChangingPassword(true); setIsComposing(false); setSelectedMail(null); }}
                className={`py-2 text-[8px] font-black tracking-widest uppercase rounded flex items-center justify-center gap-1.5 transition-colors border ${
                  isChangingPassword 
                    ? 'bg-white text-black border-white' 
                    : 'bg-yellow-400/10 text-yellow-400 border-yellow-400/20 hover:bg-yellow-400/20'
                }`}
              >
                <Key size={10} /> RE-KEY
              </button>
              
              <button 
                onClick={() => {
                  setCurrentUser(null);
                  localStorage.removeItem('ecomig_current_user');
                  setIsChangingPassword(false);
                  setIsComposing(false);
                  setSelectedMail(null);
                  triggerNotification('LOGGED OUT OF TERMINAL PORTAL');
                }}
                className="py-2 bg-red-600/15 hover:bg-red-600/25 text-red-400 border border-red-500/20 rounded text-[8px] font-black tracking-widest uppercase flex items-center justify-center gap-1.5 transition-colors"
              >
                <LogOut size={10} /> LOCK SEAL
              </button>
            </div>
          </div>

          <div className="p-4 bg-black/20">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-white animate-pulse" />
              <span className="text-[9px] font-black text-white/40 tracking-widest uppercase">ENCRYPTED // AES-256</span>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-grow flex flex-col overflow-hidden bg-[#00a651] relative z-20">
          <AnimatePresence mode="wait">
            {isChangingPassword ? (
              <motion.div 
                key="password-change"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-grow flex flex-col p-6 md:p-10 space-y-6"
              >
                <div className="flex flex-col gap-4 border-b-4 border-[#006e36] pb-4 mb-4">
                  <BrandHeader title="SECUR-KEY REGISTRY" subtitle="DEPT ENCRYPTION ROTATION" icon={<Key className="text-yellow-400" />} />
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold italic uppercase text-white tracking-tighter font-display">CHANGE ACCESS KEY</h3>
                    <button onClick={() => setIsChangingPassword(false)} className="p-2 bg-red-600 border-b-2 border-r-2 border-red-900 text-white hover:bg-red-500 transition-all active:translate-y-1 active:border-0">
                       <LogOut size={20} />
                    </button>
                  </div>
                </div>

                <div className="space-y-4 max-w-lg">
                  <p className="text-white/85 font-mono text-[10px] leading-relaxed">
                    Under Communications security protocol (TG-295-SEC), departments may rotate terminal unlock keys at any time. Standard complexity keys must be updated immediately upon security breach detection.
                  </p>

                  <div className="space-y-4">
                    <div className="relative bg-white border-[6px] border-gray-300 p-2 h-[60px] flex items-center group focus-within:border-yellow-500 transition-colors">
                      <div className="absolute inset-0 border-t-2 border-l-2 border-white pointer-events-none" />
                      <span className="px-4 text-[9px] font-black text-black tracking-widest uppercase border-r-2 border-gray-100 group-focus-within:text-yellow-500">CURRENT KEY:</span>
                      <input 
                        type="password" 
                        value={changeCurrent}
                        onChange={(e) => setChangeCurrent(e.target.value)}
                        placeholder="ENTER ACTIVE SECURITY KEY"
                        className="flex-grow bg-transparent px-4 outline-none font-bold text-black text-xs md:text-sm font-mono tracking-widest" 
                      />
                    </div>

                    <div className="relative bg-white border-[6px] border-gray-300 p-2 h-[60px] flex items-center group focus-within:border-[#00853F] transition-colors">
                      <div className="absolute inset-0 border-t-2 border-l-2 border-white pointer-events-none" />
                      <span className="px-4 text-[9px] font-black text-black tracking-widest uppercase border-r-2 border-gray-100 group-focus-within:text-[#00853F]">NEW SECURE KEY:</span>
                      <input 
                        type="password" 
                        value={changeNew}
                        onChange={(e) => setChangeNew(e.target.value)}
                        placeholder="ENTER NEW UNIQUE SECURE KEY"
                        className="flex-grow bg-transparent px-4 outline-none font-bold text-black text-xs md:text-sm font-mono tracking-widest" 
                      />
                    </div>

                    <div className="relative bg-white border-[6px] border-gray-300 p-2 h-[60px] flex items-center group focus-within:border-[#00853F] transition-colors">
                      <div className="absolute inset-0 border-t-2 border-l-2 border-white pointer-events-none" />
                      <span className="px-4 text-[9px] font-black text-black tracking-widest uppercase border-r-2 border-gray-100 group-focus-within:text-emerald-500">CONFIRM KEY:</span>
                      <input 
                        type="password" 
                        value={changeConfirm}
                        onChange={(e) => setChangeConfirm(e.target.value)}
                        placeholder="CONFIRM NEW SECURE KEY"
                        className="flex-grow bg-transparent px-4 outline-none font-bold text-black text-xs md:text-sm font-mono tracking-widest" 
                      />
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button 
                      onClick={() => {
                        if (!changeCurrent) {
                          triggerNotification('ERROR: CURRENT PIN REQUIRED');
                          return;
                        }
                        if (changeNew !== changeConfirm) {
                          triggerNotification('ERROR: CONFIRM PASSCODE ENCRYPTION DEVIATION');
                          return;
                        }
                        const success = updatePassword(currentUser || '', changeCurrent, changeNew);
                        if (success) {
                          setChangeCurrent('');
                          setChangeNew('');
                          setChangeConfirm('');
                          setIsChangingPassword(false);
                        }
                      }}
                      className="px-8 py-3.5 bg-yellow-500 text-black border-b-4 border-r-4 border-yellow-700 hover:bg-yellow-400 font-extrabold text-[10px] tracking-widest uppercase transition-all shadow-lg active:translate-y-1 flex items-center gap-2"
                    >
                      <Key size={14} /> RE-ROTATE SECURITY KEY
                    </button>
                    <button 
                      onClick={() => setIsChangingPassword(false)}
                      className="px-6 py-3.5 bg-[#001c0c] border-2 border-white/10 text-white font-bold text-[10px] tracking-widest uppercase hover:bg-neutral-800 transition-all active:translate-y-1"
                    >
                      CANCEL REGISTRY
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : isComposing ? (
              <motion.div 
                key="compose"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-grow flex flex-col p-6 md:p-10 space-y-6"
              >
                <div className="flex flex-col gap-4 border-b-4 border-[#006e36] pb-4 mb-4">
                  <BrandHeader title="SECURE MAILS" subtitle="MHQ-01 TERMINAL" icon={<Mail className="text-[#00853F]" />} />
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold italic uppercase text-white tracking-tighter font-display">NEW <span className="text-white/60">MESSAGE</span></h3>
                    <button onClick={() => setIsComposing(false)} className="p-2 bg-red-600 border-b-2 border-r-2 border-red-900 text-white hover:bg-red-500 transition-all active:translate-y-1 active:border-0">
                       <LogOut size={20} />
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative bg-white border-[6px] border-gray-300 p-2 min-h-[60px] flex items-center bg-gray-50">
                      <div className="absolute inset-0 border-t-2 border-l-2 border-white pointer-events-none" />
                      <span className="px-4 text-[9px] font-black text-black tracking-widest uppercase border-r-2 border-gray-100">FROM:</span>
                      <span className="flex-grow px-4 font-bold text-[#00853F] text-xs md:text-sm tracking-tight font-mono">
                        {currentUser} [AUTHENTICATED]
                      </span>
                    </div>
                    <div className="relative bg-white border-[6px] border-gray-300 p-2 min-h-[60px] flex items-center">
                      <div className="absolute inset-0 border-t-2 border-l-2 border-white pointer-events-none" />
                      <span className="px-4 text-[9px] font-black text-black tracking-widest uppercase border-r-2 border-gray-100">TO:</span>
                      <select 
                        value={composeData.to}
                        onChange={(e) => setComposeData({...composeData, to: e.target.value})}
                        className="flex-grow bg-transparent px-4 outline-none font-bold text-black text-xs md:text-sm tracking-tight font-mono appearance-none"
                      >
                        <option value="">SELECT RECIPIENT</option>
                        {deptEmails.map(email => (
                          <option key={`to-${email}`} value={email}>{email}</option>
                        ))}
                        <option value="MHQ-ALL">MHQ-ALL UNITS</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="relative bg-white border-[6px] border-gray-300 p-2 h-[60px] flex items-center group focus-within:border-[#00853F] transition-colors">
                    <div className="absolute inset-0 border-t-2 border-l-2 border-white pointer-events-none" />
                    <span className="px-4 text-[9px] font-black text-black tracking-widest uppercase border-r-2 border-gray-100 group-focus-within:text-[#00853F]">SUBJECT:</span>
                    <input 
                      type="text" 
                      value={composeData.subject}
                      onChange={(e) => setComposeData({...composeData, subject: e.target.value})}
                      placeholder="ENTER TACTICAL IDENTIFIER (REQUIRED)"
                      className="flex-grow bg-transparent px-4 outline-none font-bold text-black text-xs md:text-sm tracking-tight font-mono placeholder:text-red-500/30" 
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative bg-white border-[6px] border-gray-300 p-2 flex flex-col">
                      <div className="absolute inset-0 border-t-2 border-l-2 border-white pointer-events-none" />
                      <div className="flex items-center justify-between px-4 py-1 border-b border-gray-100 mb-2">
                        <span className="text-[9px] font-black text-gray-400 tracking-widest uppercase">ENGLISH VERSION</span>
                      </div>
                      <textarea 
                        value={composeData.body}
                        onChange={handleBodyChange}
                        placeholder="ENTER SECURE TRANSMISSION CONTENT..."
                        className="w-full h-[240px] md:h-[180px] p-4 bg-transparent outline-none font-bold text-black text-lg leading-relaxed placeholder:text-gray-300 resize-none custom-scrollbar"
                      />
                    </div>
                    <div className="relative bg-white border-[6px] border-gray-300 p-2 flex flex-col">
                      <div className="absolute inset-0 border-t-2 border-l-2 border-white pointer-events-none" />
                      <div className="flex items-center justify-between px-4 py-1 border-b border-gray-100 mb-2">
                        <span className="text-[9px] font-black text-gray-400 tracking-widest uppercase">FRENCH VERSION (AUTO-TRANSLATED)</span>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => translateText(composeData.body)}
                            className="bg-[#00853F]/10 hover:bg-[#00853F]/20 text-[#00853F] px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest transition-colors flex items-center gap-1"
                          >
                            {isTranslating ? <div className="w-2 h-2 bg-[#00853F] rounded-full animate-ping" /> : <Cpu size={10} />}
                            {isTranslating ? 'SYNCING...' : 'REFRESH'}
                          </button>
                        </div>
                      </div>
                      <textarea 
                        value={composeData.frenchBody}
                        onChange={(e) => setComposeData({...composeData, frenchBody: e.target.value})}
                        placeholder="AUTOMATIC FRENCH TRANSLATION WILL APPEAR HERE..."
                        className="w-full h-[240px] md:h-[180px] p-4 bg-transparent outline-none font-bold text-blue-700 text-lg leading-relaxed placeholder:text-gray-300 resize-none custom-scrollbar"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 mt-auto">
                   <button 
                    onClick={() => imageInputRef.current?.click()}
                    className="px-5 py-2.5 bg-white text-black border-b-2 border-r-2 border-gray-300 font-black text-[9px] tracking-widest uppercase transition-all shadow-md active:translate-y-0.5 active:border-0 flex items-center gap-2"
                   >
                      <Camera size={14} /> UPLOAD IMAGES
                   </button>
                   <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="px-5 py-2.5 bg-white text-black border-b-2 border-r-2 border-gray-300 font-black text-[9px] tracking-widest uppercase transition-all shadow-md active:translate-y-0.5 active:border-0 flex items-center gap-2"
                   >
                      <ExternalLink size={14} /> UPLOAD FILE
                   </button>
                   
                   <div className="flex-grow" />
 
                   <button 
                    onClick={handleSend}
                    className="px-8 py-3 bg-[#004d24] text-white border-b-4 border-r-4 border-[#00361a] font-black text-xs tracking-[0.15em] uppercase hover:bg-[#00853F] transition-all shadow-lg active:translate-y-1 active:border-b active:border-r flex items-center gap-2.5 cursor-pointer"
                   >
                      <Send size={18} /> SEND MESSAGE
                   </button>
                </div>
              </motion.div>
            ) : selectedMail ? (
              <motion.div 
                key="read"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-grow flex flex-col p-6 md:p-10"
              >
                <div className="flex items-center justify-between mb-8">
                  <button 
                    onClick={() => setSelectedMail(null)}
                    className="flex items-center gap-2 bg-white text-[#00853F] px-4 py-2 border-b-4 border-r-4 border-gray-300 font-black text-[9px] tracking-widest uppercase active:translate-y-1 active:border-0"
                  >
                    <ChevronDown className="rotate-90" size={14} /> BACK
                  </button>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => triggerNotification('REPLY FUNCTION ACTIVATED')}
                      className="p-3 bg-white border-b-4 border-r-4 border-gray-300 text-[#00853F] active:translate-y-1 active:border-0"
                    >
                      <Share2 size={20} />
                    </button>
                    <button 
                      onClick={() => activeFolder === 'deleted' ? permanentlyDelete(selectedMail.id) : handleDelete(selectedMail.id)}
                      className="p-3 bg-red-600 border-b-4 border-r-4 border-red-900 text-white active:translate-y-1 active:border-0"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>

                <div className="bg-white border-[8px] border-gray-300 p-8 flex flex-col flex-grow relative shadow-2xl">
                   <div className="absolute inset-0 border-t-2 border-l-2 border-white pointer-events-none" />
                   
                   <header className="mb-10 border-b-2 border-gray-100 pb-8">
                      <div className="flex justify-between items-start mb-6">
                        <h4 className="text-3xl font-bold italic text-black uppercase tracking-tighter leading-tight max-w-2xl font-display">{selectedMail.subject}</h4>
                        <div className="text-right">
                          <p className="text-[#00853F] font-bold text-[10px] tracking-widest">{selectedMail.date}</p>
                          <p className="text-gray-300 font-bold text-[9px] tracking-widest mt-1 uppercase italic">{selectedMail.time} HRS</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-4">
                         <div className="flex items-center bg-gray-50 border-2 border-gray-100 px-4 py-2">
                            <span className="text-[9px] font-black text-gray-400 tracking-widest uppercase mr-3">FROM:</span>
                            <span className="text-xs font-bold text-black font-mono">{selectedMail.from}</span>
                         </div>
                         <div className="flex items-center bg-gray-50 border-2 border-gray-100 px-4 py-2">
                            <span className="text-[9px] font-black text-gray-400 tracking-widest uppercase mr-3">TO:</span>
                            <span className="text-xs font-bold text-black font-mono">{selectedMail.to}</span>
                         </div>
                      </div>
                   </header>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full mt-4">
                      <div className="prose max-w-none border-t md:border-t-0 md:border-r border-gray-100 pt-6 md:pt-0 md:pr-8">
                         <div className="flex items-center gap-2 mb-4">
                            <span className="text-[9px] font-black text-gray-400 tracking-widest uppercase">ENGLISH VERSION</span>
                         </div>
                         <p className="text-lg text-black font-bold italic leading-relaxed">
                           {selectedMail.body}
                         </p>
                      </div>
                      {selectedMail.frenchBody ? (
                        <div className="prose max-w-none pt-6 md:pt-0">
                           <div className="flex items-center gap-2 mb-4">
                              <span className="text-[9px] font-black text-gray-400 tracking-widest uppercase">VERSION FRANÇAISE</span>
                           </div>
                           <p className="text-lg text-blue-700 font-bold italic leading-relaxed">
                             {selectedMail.frenchBody}
                           </p>
                        </div>
                      ) : (
                        <div className="bg-gray-50/50 border-2 border-dashed border-gray-200 p-8 flex flex-col items-center justify-center text-center h-full">
                           <Cpu className="text-gray-300 mb-4" size={40} />
                           <h5 className="text-[10px] font-black text-gray-400 tracking-[0.3em] uppercase mb-4">Tactical Translation Available</h5>
                           <button 
                             onClick={() => translateText(selectedMail.body, false)}
                             disabled={isTranslatingReceived}
                             className={`px-6 py-3 bg-[#00853F] text-white font-black text-[9px] tracking-widest uppercase transition-all shadow-lg active:translate-y-1 ${isTranslatingReceived ? 'opacity-50' : 'hover:scale-105'}`}
                           >
                             {isTranslatingReceived ? 'PROCESSING...' : 'TRANSLATE TO FRENCH'}
                           </button>
                        </div>
                      )}
                   </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-grow flex flex-col"
              >
                <div className="flex flex-col gap-4 border-b-8 border-[#006e36] p-6 mb-4">
                  <BrandHeader title="SECURE MAILS" subtitle="MHQ-01 TERMINAL" icon={<Mail className="text-[#00853F]" />} />
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold italic uppercase text-white tracking-tighter font-display">{activeFolder}</h3>
                    <div className="text-[8px] font-bold text-white/50 tracking-widest uppercase italic">
                      {filteredEmails.length} MESSAGES
                    </div>
                  </div>
                </div>

                <div className="flex-grow overflow-y-auto p-6 custom-scrollbar">
                  <div className="space-y-4">
                    {filteredEmails.length > 0 ? filteredEmails.map((email) => (
                      <motion.div 
                        key={email.id}
                        onClick={() => setSelectedMail(email)}
                        className="bg-white border-[6px] border-gray-300 p-6 flex flex-col md:flex-row items-center gap-6 cursor-pointer group active:translate-y-1 active:border-0 transition-all relative"
                      >
                         <div className="absolute inset-0 border-t-2 border-l-2 border-white pointer-events-none" />
                         <div className="w-12 h-12 bg-[#00853F] border-b-4 border-r-4 border-[#004d24] flex items-center justify-center flex-shrink-0">
                            <Mail size={24} className="text-white" />
                         </div>
                         
                         <div className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                            <div className="md:border-r-2 md:border-gray-100 pr-4">
                               <p className="text-[10px] font-black text-gray-300 tracking-widest uppercase mb-1">ORIGIN:</p>
                               <p className="text-xs font-black text-black font-mono truncate">{email.from}</p>
                            </div>
                            <div className="md:col-span-1">
                               <p className="text-[10px] font-black text-gray-300 tracking-widest uppercase mb-1">SUBJECT:</p>
                               <p className="text-sm font-black italic text-black group-hover:text-[#00853F] transition-colors truncate">{email.subject}</p>
                            </div>
                            <div className="text-right">
                               <p className="text-xs font-black text-black font-mono">{email.time}</p>
                               <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest mt-1">{email.date}</p>
                            </div>
                         </div>
                         
                         <button 
                            onClick={(e) => { e.stopPropagation(); activeFolder === 'deleted' ? permanentlyDelete(email.id) : handleDelete(email.id); }}
                            className="p-3 bg-red-600/10 text-red-600 border-2 border-transparent hover:border-red-600 transition-all"
                         >
                            <Trash2 size={20} />
                         </button>
                      </motion.div>
                    )) : (
                      <div className="flex flex-col items-center justify-center h-full py-20 text-white/40">
                         <Mail size={80} className="mb-6 opacity-20" />
                         <p className="font-black italic tracking-widest uppercase">No messages</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Embedded ECOMIG Secure Live Video Conferencing Suite */}
                  <EcomigVideoConference />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          {/* Institutional Portal Links removed as they are now in the sidebar */}
          <div className="py-6 border-t-8 border-[#006e36] bg-black/10 text-center">
             <span className="text-[9px] font-bold text-white/30 tracking-widest uppercase">SECURE PORTAL CORE v2.4</span>
          </div>
        </div>
      </div>
    </div>
  );
};
