
import React, { useState, useEffect, useMemo } from 'react';
import { MousePosition } from './types';
import { DISCOURSE_TEXT, DISCOURSE_TEXT_FR, BACKGROUND_IMAGE } from './constants';
import BackgroundWaves from './components/BackgroundWaves';
import ParallaxWrapper from './components/ParallaxWrapper';

type Language = 'en' | 'fr';

const App: React.FC = () => {
  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [lang, setLang] = useState<Language>('fr'); // Default is French
  
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

  const blobSize = 80;

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

  return (
    <main className="relative w-full h-screen bg-white select-none overflow-hidden flex flex-col">
      <BackgroundWaves mousePosition={mousePosition} />

      {/* BASE LAYER (Black on White) */}
      <div className="absolute inset-0 flex flex-col p-8 md:p-16 pointer-events-none z-10">
        <div className="flex justify-between items-start w-full mb-4 md:mb-6">
          <ParallaxWrapper mousePosition={mousePosition} factor={0.03}>
            <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl leading-[0.85] text-black tracking-tight uppercase">
              {headerText}
            </h1>
          </ParallaxWrapper>

          <ParallaxWrapper mousePosition={mousePosition} factor={0.015} className="text-right flex flex-col items-end">
            <div className="font-serif italic text-lg md:text-xl text-black">
              2025 — 2026
            </div>
            <div className="text-[9px] uppercase tracking-[0.3em] text-black/50 mt-1">
              {subheaderText}
            </div>
            <LangSwitcher colorClass="text-black" />
          </ParallaxWrapper>
        </div>

        <div className="flex-1 flex items-center justify-center min-h-0">
          <div className="max-w-2xl w-full">
            <ParallaxWrapper mousePosition={mousePosition} factor={0.005}>
              <div className="space-y-3 md:space-y-4 text-black pointer-events-none">
                {textLines.map((line, idx) => (
                  <p key={idx} className="text-[11px] md:text-[13px] lg:text-[14px] leading-relaxed font-light opacity-90">
                    {line}
                  </p>
                ))}
              </div>
            </ParallaxWrapper>
          </div>
        </div>
        <div className="h-12" />
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

        <div className="absolute inset-0 flex flex-col p-8 md:p-16">
          <div className="flex justify-between items-start w-full mb-4 md:mb-6">
            <ParallaxWrapper mousePosition={mousePosition} factor={0.03}>
              <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl leading-[0.85] text-white tracking-tight uppercase">
                {headerText}
              </h1>
            </ParallaxWrapper>

            <ParallaxWrapper mousePosition={mousePosition} factor={0.015} className="text-right flex flex-col items-end">
              <div className="font-serif italic text-lg md:text-xl text-white">
                2025 — 2026
              </div>
              <div className="text-[9px] uppercase tracking-[0.3em] text-white/80 mt-1">
                {subheaderText}
              </div>
              <LangSwitcher colorClass="text-white" />
            </ParallaxWrapper>
          </div>

          <div className="flex-1 flex items-center justify-center min-h-0">
            <div className="max-w-2xl w-full">
              <ParallaxWrapper mousePosition={mousePosition} factor={0.005}>
                <div className="space-y-3 md:space-y-4 text-white">
                  {textLines.map((line, idx) => (
                    <p key={idx} className="text-[11px] md:text-[13px] lg:text-[14px] leading-relaxed font-light">
                      {line}
                    </p>
                  ))}
                </div>
              </ParallaxWrapper>
            </div>
          </div>
          <div className="h-12" />
        </div>
      </div>

      {/* Cursor Decoration */}
      <div 
        className="fixed top-0 left-0 w-[160px] h-[160px] border border-black/10 rounded-full pointer-events-none z-50 transition-transform duration-75 ease-out"
        style={{
          transform: `translate(${mousePosition.x - 80}px, ${mousePosition.y - 80}px)`,
        }}
      />
      
      {/* Footer Branding */}
      <div className="fixed bottom-8 left-0 w-full px-8 md:px-16 flex justify-between items-end z-40 pointer-events-none">
        <ParallaxWrapper mousePosition={mousePosition} factor={0.005}>
          <div className="text-[9px] uppercase tracking-widest text-black/40">
            {lang === 'en' ? 'Self-hosted with love' : 'Hébergé avec amour'}
          </div>
        </ParallaxWrapper>
        <ParallaxWrapper mousePosition={mousePosition} factor={0.005}>
          <div className="font-serif italic text-base text-black/60">
            Vidio Di Jour
          </div>
        </ParallaxWrapper>
      </div>

      <button 
        onClick={() => setIsSettingsOpen(true)}
        className="fixed bottom-4 right-4 w-2 h-2 rounded-full bg-black/5 hover:bg-black/20 transition-all z-[100] cursor-pointer pointer-events-auto"
        title="Settings"
      />

      {isSettingsOpen && (
        <div className="fixed inset-0 z-[110] flex items-center