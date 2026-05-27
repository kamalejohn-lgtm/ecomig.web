import React from 'react';
import { Mail, Phone, MapPin, Facebook, Send, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { BrandHeader } from '../common/BrandHeader';

export const ContactMission: React.FC = () => {
  const contactInfo = {
    office: {
      name: "ECOMIG Force Headquarters",
      location: "Bakau, The Gambia",
    },
    telephones: [
      "2203602205",
      "+2203401305",
      "+2205185706"
    ],
    social: {
      facebook: "https://www.facebook.com/profile.php?id=61578966714906",
      telegram: "@ecomig_official" // Assuming a telegram handle or just a placeholder if not specified
    }
  };

  return (
    <div className="p-1 sm:p-4 md:p-16 max-w-4xl mx-auto flex flex-col items-center w-full">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full backdrop-blur-3xl bg-black/60 rounded-[3rem] border border-white/10 shadow-2xl overflow-hidden"
      >
        {/* Header - Tactical Style */}
        <div className="bg-[#00853F] p-4 md:p-6 text-center border-b border-white/10 relative overflow-hidden flex flex-col items-center">
          <BrandHeader title="CONTACT US" subtitle="MISSION COMMUNICATIONS NODE" />
          <div className="absolute inset-0 opacity-10">
             <div className="absolute inset-0 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]" />
          </div>
        </div>

        {/* Content Box */}
        <div className="p-2 sm:p-4 md:p-8">
          <div className="bg-white/95 rounded-2xl sm:rounded-[1.5rem] border-4 sm:border-[6px] border-[#2d4d2e] p-3 sm:p-6 md:p-10 text-[#1a1a1a] shadow-inner relative group">
            
            {/* Office Section */}
            <section className="mb-10 text-center space-y-3">
              <div className="flex flex-col items-center gap-1">
                <MapPin className="text-[#00853F]" size={28} />
                <h3 className="text-xl font-black uppercase tracking-tight">OFFICE</h3>
              </div>
              <div className="text-base md:text-lg font-medium leading-relaxed">
                <p>{contactInfo.office.name}</p>
                <p>{contactInfo.office.location}</p>
              </div>
            </section>

            {/* Telephone Section */}
            <section className="mb-10 text-center space-y-4">
              <div className="flex flex-col items-center gap-1">
                <Phone className="text-[#00853F]" size={28} />
                <h3 className="text-xl font-black uppercase tracking-tight">TELEPHONE</h3>
              </div>
              <div className="space-y-2">
                {contactInfo.telephones.map((num, i) => (
                  <a 
                    key={i} 
                    href={`tel:${num.replace(/\s+/g, '')}`} 
                    className="block text-lg md:text-xl font-bold hover:text-[#00853F] transition-colors"
                  >
                    {num}
                  </a>
                ))}
              </div>
            </section>

            {/* Social Media Section */}
            <section className="text-center space-y-4">
              <div className="flex flex-col items-center gap-1">
                <div className="h-8 w-8 flex items-center justify-center bg-[#00853F] rounded-full">
                  <ExternalLink className="text-white" size={16} />
                </div>
                <h3 className="text-xl font-black uppercase tracking-tight">SOCIAL MEDIA</h3>
              </div>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <p className="font-black text-xs tracking-widest uppercase text-[#00853F]">Facebook Link</p>
                  <a 
                    href={contactInfo.social.facebook}
                    target="_blank"
                    rel="no-referrer"
                    className="block text-[#00a3e0] text-xs font-medium hover:underline break-all max-w-sm mx-auto"
                  >
                    {contactInfo.social.facebook}
                  </a>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    <Send className="text-[#0088cc]" size={18} />
                    <h4 className="text-lg font-bold uppercase italic">Telegram</h4>
                  </div>
                </div>
              </div>
            </section>

            {/* Decorative Inner Corners */}
            <div className="absolute top-4 left-4 w-8 h-8 border-t-4 border-l-4 border-[#00853F]/20" />
            <div className="absolute bottom-4 right-4 w-8 h-8 border-b-4 border-r-4 border-[#00853F]/20" />
          </div>
        </div>

        {/* Tactical Footer Label */}
        <div className="bg-black/40 p-6 border-t border-white/5 text-center">
          <p className="text-[10px] font-black tracking-[0.4em] uppercase text-white/40 italic">
            SECURE COMMUNICATION NODE // MHQ-CONTACT-01
          </p>
        </div>
      </motion.div>
    </div>
  );
};
