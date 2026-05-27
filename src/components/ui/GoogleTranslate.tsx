import React, { useEffect, useRef, useState } from 'react';
import { Globe, Check } from 'lucide-react';

declare global {
  interface Window {
    googleTranslateElementInit: () => void;
    google: any;
  }
}

export const GoogleTranslate: React.FC = () => {
  const initialized = useRef(false);
  const [currentLang, setCurrentLang] = useState('en');

  useEffect(() => {
    // Read the current language from cookie on mount
    const getLanguageFromCookie = () => {
      const match = document.cookie.match(/googtrans=\/en\/([a-z]{2})/);
      if (match && match[1]) {
        return match[1];
      }
      return localStorage.getItem('ecomig_current_lang') || 'en';
    };

    const activeLang = getLanguageFromCookie();
    setCurrentLang(activeLang);
    localStorage.setItem('ecomig_current_lang', activeLang);

    // Define the custom callback Google Translate expects
    window.googleTranslateElementInit = () => {
      // Create translation element and render into a hidden element
      new window.google.translate.TranslateElement(
        {
          pageLanguage: 'en',
          includedLanguages: 'en,fr',
          autoDisplay: false,
        },
        'google_translate_element_hidden'
      );
    };

    if (!initialized.current) {
      const addScript = () => {
        const script = document.createElement('script');
        script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
        script.async = true;
        document.body.appendChild(script);
      };

      if (!document.querySelector('script[src*="translate.google.com"]')) {
        addScript();
      } else if (window.google && window.google.translate) {
        window.googleTranslateElementInit();
      }
      initialized.current = true;
    }
  }, []);

  const handleLanguageChange = (lang: string) => {
    setCurrentLang(lang);
    localStorage.setItem('ecomig_current_lang', lang);
    window.dispatchEvent(new Event('ecomig_language_changed'));
    
    // 1. Write the cookies to store translator preferences across page changes/reloads
    document.cookie = `googtrans=/en/${lang}; path=/;`;
    document.cookie = `googtrans=/en/${lang}; path=/; domain=${window.location.hostname}`;
    
    // 2. Trigger translation elements in DOM
    const select = document.querySelector('.goog-te-combo') as HTMLSelectElement;
    if (select) {
      select.value = lang;
      select.dispatchEvent(new Event('change'));
    } else {
      // Standard layout could be simple layout where we click instead,
      // but write cookie & reload ensures absolute bulletproof fallback
      console.log('Combo element missing, loading via cookies...');
      window.location.reload();
    }
  };

  return (
    <div className="flex items-center gap-2 bg-black/60 border border-white/10 rounded-lg p-1 shadow-lg backdrop-blur-md">
      <div className="flex items-center gap-1.5 px-2 text-white/40">
        <Globe size={11} className="text-[#00853F]" />
        <span className="text-[9px] font-black uppercase tracking-widest hidden sm:inline">LANG:</span>
      </div>
      
      <div className="flex items-center gap-1">
        <button
          onClick={() => handleLanguageChange('en')}
          className={`px-2.5 py-1 text-[9px] font-black tracking-widest rounded transition-all flex items-center gap-1 uppercase ${
            currentLang === 'en'
              ? 'bg-[#00853F] text-white shadow-md'
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
          title="Translate to English"
        >
          <span>EN</span>
          {currentLang === 'en' && <Check size={8} className="stroke-[3]" />}
        </button>
        
        <button
          onClick={() => handleLanguageChange('fr')}
          className={`px-2.5 py-1 text-[9px] font-black tracking-widest rounded transition-all flex items-center gap-1 uppercase ${
            currentLang === 'fr'
              ? 'bg-[#00853F] text-white shadow-md'
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
          title="Traduire en Français"
        >
          <span>FR</span>
          {currentLang === 'fr' && <Check size={8} className="stroke-[3]" />}
        </button>
      </div>

      {/* Hidden container container of TranslateElement dropdown to let us control programmatically */}
      <div id="google_translate_element_hidden" style={{ display: 'none', position: 'absolute', width: 0, height: 0, overflow: 'hidden' }} />
      
      <style>{`
        /* Remove original top translate bar */
        iframe.skiptranslate, iframe.goog-te-banner-frame {
          display: none !important;
          visibility: hidden !important;
        }
        body {
          top: 0 !important;
        }
        /* Remove tooltip helper from popups */
        .goog-tooltip, .goog-tooltip:hover {
          display: none !important;
        }
        .goog-text-highlight {
          background-color: transparent !important;
          box-shadow: none !important;
        }
      `}</style>
    </div>
  );
};
