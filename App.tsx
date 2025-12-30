
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { MousePosition } from './types';
import { DISCOURSE_TEXT, DISCOURSE_TEXT_FR, BACKGROUND_IMAGE } from './constants';
import BackgroundWaves from './components/BackgroundWaves';
import ParallaxWrapper from './components/ParallaxWrapper';

type Language = 'en' | 'fr';

const App: React.FC = () => {
  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [lang, setLang] = useState<Language>('fr');
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const [revealImage, setRevealImage] = useState(() => {
    return localStorage.getItem('vidio-di-jour-reveal-bg') || BACKGROUND_IMAGE;
  });
  const [tempImageUrl, setTempImageUrl] = useState(revealImage);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      window.requestAnimationFrame(() => {
        setMousePosition({ x: e.clientX, y: e.clientY });
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const saveImage = () => {
    setRevealImage(tempImageUrl);
    localStorage.setItem('vidio-di-jour-reveal-bg', tempImageUrl);
    setIsSettingsOpen(false);
  };

  const textLines = useMemo(() => {
    const text = lang === 'en' ? DISCOURSE_TEXT : DISCOURSE_TEXT_FR;
    return text.split('\n\n');
  }, [lang]);

  const headerText = lang === 'en' ? (
    <>Thank<br />You</>
  ) : (
    <>Merci</>
  );

  const subheaderText = lang === 'en' ? "One Year of Vidio Di Jour" : "Un an de Vidio Di Jour";

  const blobSize = 100;

  const LangSwitcher = ({ colorClass }: { colorClass: string }) => (
    <div className={`flex gap-3 text-[10px] uppercase tracking-widest font-medium ${colorClass} mt-4 pointer-events-auto cursor-pointer`}>
      <button 
        onClick={() => setLang('en')} 
        className={`transition-opacity hover:opacity-100 ${lang === 'en' ? 'opacity-100 underline underline-offset-4' : 'opacity-40'}`}
      >
        EN
      </button>
      <span className="opacity-20">/</span>
      <button 
        onClick={() => setLang('fr')} 
        className={`transition-opacity hover:opacity-100 ${lang === 'fr' ? 'opacity-100 underline underline-offset-4' : 'opacity-40'}`}
      >
        FR
      </button>
    </div>
  );

  const renderContent = (textColor: string, isReveal: boolean = false) => (
    <div className="absolute inset-0 flex flex-col p-8 md:p-16 lg:p-24">
      {/* Header */}
      <div className="flex justify-between items-start w-full mb-6 md:mb-12">
        <ParallaxWrapper mousePosition={mousePosition} factor={0.03}>
          <h1 className={`font-serif text-5xl md:text-7xl lg:text-8xl leading-[0.8] ${textColor} tracking-tight uppercase`}>
            {headerText}
          </h1>
        </ParallaxWrapper>

        <ParallaxWrapper mousePosition={mousePosition} factor={0.015} className="text-right flex flex-col items-end">
          <div className={`font-serif italic text-lg md:text-2xl ${textColor}`}>
            2025 — 2026
          </div>
          <div className={`text-[10px] md:text-xs uppercase tracking-[0.3em] ${isReveal ? 'text-white/80' : 'text-black/50'} mt-1`}>
            {subheaderText}
          </div>
          <LangSwitcher colorClass={textColor} />
        </ParallaxWrapper>
      </div>

      {/* Main Discourse - Added scroll logic to prevent cutting off */}
      <div className="flex-1 flex items-center justify-center overflow-hidden">
        <div className="max-w-2xl w-full h-full max-h-[60vh] md:max-h-none overflow-y-auto no-scrollbar pointer-events-auto">
          <ParallaxWrapper mousePosition={mousePosition} factor={0.005}>
            <div className={`space-y-4 md:space-y-6 ${textColor} pb-12`}>
              {textLines.map((line, idx) => (
                <p key={idx} className="text-[13px] md:text-[15px] lg:text-[16px] leading-relaxed font-light text-justify md:text-left">
                  {line}
                </p>
              ))}
            </div>
          </ParallaxWrapper>
        </div>
      </div>
      
      {/* Footer Branding - Fixed position relative to container */}
      <div className="mt-8 flex justify-between items-end w-full">
        <ParallaxWrapper mousePosition={mousePosition} factor={0.005}>
          <div className={`text-[10px] uppercase tracking-widest ${isReveal ? 'text-white/40' : 'text-black/30'}`}>
            {lang === 'en' ? 'Self-hosted with love' : 'Hébergé avec amour'}
          </div>
        </ParallaxWrapper>
        <ParallaxWrapper mousePosition={mousePosition} factor={0.005}>
          <div className={`font-serif italic text-lg ${isReveal ? 'text-white/60' : 'text-black/40'}`}>
            Vidio Di Jour
          </div>
        </ParallaxWrapper>
      </div>
    </div>
  );

  return (
    <main className="relative w-full h-screen bg-white select-none overflow-hidden flex flex-col">
      <BackgroundWaves mousePosition={mousePosition} />

      {/* BASE LAYER (Black on White) */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {renderContent('text-black')}
      </div>

      {/* REVEAL LAYER (White on Image) */}
      <div 
        className="absolute inset-0 z-30 pointer-events-none overflow-hidden"
        style={{
          clipPath: `circle(${blobSize}px at ${mousePosition.x}px ${mousePosition.y}px)`,
          WebkitClipPath: `circle(${blobSize}px at ${mousePosition.x}px ${mousePosition.y}px)`,
        }}
      >
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${revealImage})` }}
        >
          <div className="absolute inset-0 bg-black/60" />
        </div>

        {renderContent('text-white', true)}
      </div>

      {/* Outer Cursor Halo */}
      <div 
        className="fixed top-0 left-0 w-[200px] h-[200px] border border-black/5 rounded-full pointer-events-none z-50 transition-transform duration-150 ease-out"
        style={{
          transform: `translate(${mousePosition.x - 100}px, ${mousePosition.y - 100}px)`,
        }}
      />
      
      {/* Settings Gear (Small dot) */}
      <button 
        onClick={() => setIsSettingsOpen(true)}
        className="fixed bottom-4 right-4 w-2 h-2 rounded-full bg-black/5 hover:bg-black/20 transition-all z-[100] cursor-pointer pointer-events-auto"
        title="Settings"
      />

      {isSettingsOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-white/95 backdrop-blur-md px-6 pointer-events-auto">
          <div className="bg-white border border-black/10 p-8 md:p-12 max-w-md w-full shadow-2xl space-y-8 animate-in fade-in zoom-in duration-300">
            <div className="space-y-2">
              <h2 className="font-serif text-3xl text-black">Paramètres</h2>
              <p className="text-xs uppercase tracking-widest text-black/40">Configuration Visuelle</p>
            </div>
            
            <div className="space-y-4">
              <label className="block text-sm font-medium text-black/60">
                URL de l'image de fond (reveal)
              </label>
              <input 
                type="text" 
                value={tempImageUrl}
                onChange={(e) => setTempImageUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-4 py-3 border border-black/10 focus:border-black/40 outline-none transition-colors font-light text-sm cursor-text"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button 
                onClick={saveImage}
                className="flex-1 px-6 py-3 bg-black text-white text-xs uppercase tracking-widest hover:bg-black/80 transition-colors cursor-pointer"
              >
                Appliquer
              </button>
              <button 
                onClick={() => setIsSettingsOpen(false)}
                className="px-6 py-3 border border-black/10 text-black text-xs uppercase tracking-widest hover:bg-black/5 transition-colors cursor-pointer"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default App;
