import React from 'react';
import { Lock, Mail, Globe, Menu, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface InternalLoginProps {
  setIsAdmin: (a: boolean) => void;
}

export const InternalLogin: React.FC<InternalLoginProps> = ({ setIsAdmin }) => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col relative font-sans overflow-hidden">
      {/* Camo Background Overlay (Subtle) */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/camo.png")' }} />

      {/* Header Bar */}
      <header className="bg-[#000080] p-4 flex items-center justify-between border-b border-white/20 shadow-sm relative z-20">
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <div className="h-16 flex items-center justify-center py-1">
               <img 
                 src="https://i.postimg.cc/VN8W5R7r/ECOMIG-LOGO.png" 
                 alt="ECOMIG" 
                 referrerPolicy="no-referrer"
                 className="h-full w-auto object-contain drop-shadow-md brightness-110 contrast-110" 
               />
            </div>
          </div>
          <div className="hidden md:flex items-center gap-3 ml-4">
             <img src="https://flagcdn.com/sn.svg" referrerPolicy="no-referrer" className="w-10 shadow-sm" alt="Senegal" />
             <img src="https://flagcdn.com/ng.svg" referrerPolicy="no-referrer" className="w-10 shadow-sm" alt="Nigeria" />
             <img src="https://flagcdn.com/gh.svg" referrerPolicy="no-referrer" className="w-10 shadow-sm" alt="Ghana" />
          </div>
        </div>

        <div className="bg-white/10 hover:bg-white/20 p-4 text-white hover:text-white transition-colors cursor-pointer rounded-sm border border-white/20">
           <Menu size={32} strokeWidth={3} />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center p-6 relative z-10">
        {/* Outer border margin wrapper with military tactical camouflage aesthetic */}
        <div 
          className="w-full max-w-lg p-3 md:p-5 border-4 border-[#1e2a1b] shadow-[0_20px_60px_rgba(0,0,0,0.3)] relative rounded-sm"
          style={{ 
            backgroundImage: 'url("https://www.transparenttextures.com/patterns/camo.png")',
            backgroundColor: '#3a4b32'
          }}
        >
          {/* Inner white card panel */}
          <div className="w-full bg-white border border-gray-200 p-8 md:p-12 relative shadow-inner">
            {/* Corner bracket decorative elements */}
            <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#00853F]/40" />
            <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[#00853F]/40" />
            <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[#00853F]/40" />
            <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#00853F]/40" />
            
            <div className="flex justify-center mb-8">
               <div className="flex items-center gap-2">
                  <div className="w-12 h-12">
                     <img src="https://i.postimg.cc/VN8W5R7r/ECOMIG-LOGO.png" referrerPolicy="no-referrer" alt="Logo" className="w-full h-full object-contain" />
                  </div>
                  <div className="flex gap-2">
                     <img src="https://flagcdn.com/sn.svg" referrerPolicy="no-referrer" className="w-6" alt="Senegal" />
                     <img src="https://flagcdn.com/ng.svg" referrerPolicy="no-referrer" className="w-6" alt="Nigeria" />
                     <img src="https://flagcdn.com/gh.svg" referrerPolicy="no-referrer" className="w-6" alt="Ghana" />
                  </div>
               </div>
            </div>

            <div className="text-center mb-12">
              <h2 className="text-4xl font-black text-[#1a1c29] tracking-tight uppercase font-display">MISSION PORTAL</h2>
            </div>

            <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-2">
                <label className="flex items-center gap-3 text-gray-400 font-bold text-xs tracking-widest uppercase ml-1">
                   <Mail size={16} /> EMAIL
                </label>
                <input 
                  type="email" 
                  className="w-full px-6 py-5 bg-white border border-gray-200 focus:border-[#00853F] outline-none transition-all text-black font-medium text-lg rounded-none shadow-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-3 text-gray-400 font-bold text-xs tracking-widest uppercase ml-1">
                   <Lock size={16} /> PASSWORD
                </label>
                <input 
                  type="password" 
                  className="w-full px-6 py-5 bg-white border border-gray-200 focus:border-[#00853F] outline-none transition-all text-black font-medium text-lg rounded-none shadow-sm"
                />
              </div>

              <button 
                onClick={() => setIsAdmin(true)}
                className="w-full bg-[#00853F] text-white py-6 font-black text-xs tracking-[0.2em] uppercase hover:bg-[#006e34] transition-all shadow-xl active:scale-95"
              >
                LOGIN WITH EMAIL
              </button>
            </form>

            <div className="text-center mt-6">
               <button 
                  onClick={() => setIsAdmin(true)}
                  className="text-[#00853F] font-black text-[10px] tracking-widest uppercase underline hover:text-[#006e34] transition-colors"
                  id="quick-login-admin"
               >
                  QUICK LOGIN AS ADMIN@ECOMIG.ORG
               </button>
            </div>

            <div className="relative my-12 flex items-center justify-center">
               <div className="absolute inset-x-0 border-t border-gray-200" />
               <span className="relative bg-white px-6 text-[10px] font-black text-gray-400 tracking-widest uppercase">OR</span>
            </div>

            <button className="w-full border border-gray-200 py-4 flex items-center justify-center gap-4 hover:bg-gray-50 transition-all shadow-sm">
               <img src="https://www.google.com/images/branding/googleg/1x/googleg_standard_color_128dp.png" referrerPolicy="no-referrer" className="w-6" alt="Google" />
               <span className="font-bold text-gray-600">Sign in with Google</span>
            </button>

            <div className="text-center mt-12">
               <button className="text-gray-400 font-black text-[10px] tracking-widest uppercase hover:text-gray-600 transition-colors">FORGOT PASSWORD?</button>
            </div>
          </div>
        </div>
      </main>

      {/* Floating Alert Badge */}
      <div className="fixed bottom-10 right-10 z-50 flex flex-col items-center">
         <div className="relative">
            <div className="absolute -top-4 -right-2 bg-red-600 text-white text-[8px] font-black px-2 py-1 rounded-sm shadow-lg border border-white/20">ALERT</div>
            <div className="w-24 h-24 bg-[#00853F] rounded-full border-4 border-white shadow-2xl flex items-center justify-center relative group cursor-pointer hover:scale-110 transition-all">
               <div className="absolute inset-0 bg-white/10 rounded-full animate-ping pointer-events-none" />
               <img src="https://i.postimg.cc/VN8W5R7r/ECOMIG-LOGO.png" referrerPolicy="no-referrer" className="w-16 h-16 object-contain opacity-50" />
            </div>
            <div className="absolute -bottom-2 -left-2 bg-yellow-400 text-black text-[9px] font-black px-3 py-1 shadow-lg border border-white/40">JTK</div>
         </div>
      </div>

    </div>
  );
};
