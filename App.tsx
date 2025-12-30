
import React, { useState, useEffect, useMemo } from 'react';
import { MousePosition } from './types';
import { DISCOURSE_TEXT, DISCOURSE_TEXT_FR } from './constants';
import BackgroundWaves from './components/BackgroundWaves';
import ParallaxWrapper from './components/ParallaxWrapper';

type Language = 'en' | 'fr';

const App: React.FC = () => {
  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 });
  const [lang, setLang] = useState<Language>('fr');

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      window.requestAnimationFrame(() => {
        setMousePosition({ x: e.clientX, y: e.clientY });
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

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

  return (
    <main className="relative w-full h-[100dvh] bg-white overflow-hidden flex flex-col">
      {/* Subtle animated background */}
      <BackgroundWaves mousePosition={mousePosition} />

      {/* Main Content Container */}
      <div className="relative z-10 flex flex-col h-full p-6 md:p-10 lg:p-14 pointer-events-none">
        
        {/* Header Section */}
        <header className="flex justify-between items-start w-full mb-6 md:mb-8 lg:mb-10 flex-shrink-0">
          <ParallaxWrapper mousePosition={mousePosition} factor={0.03}>
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl leading-[0.8] text-black tracking-tighter uppercase">
              {headerText}
            </h1>
          </ParallaxWrapper>

          <ParallaxWrapper mousePosition={mousePosition} factor={0.015} className="text-right flex flex-col items-end">
            <div className="font-serif italic text-lg md:text-2xl text-black">
              2025 — 2026
            </div>
            <div className="text-[9px] md:text-[10px] uppercase tracking-[0.4em] text-black/40 mt-1">
              {subheaderText}
            </div>
            
            {/* Language Switcher */}
            <nav className="flex gap-4 text-[10px] uppercase tracking-widest font-bold text-black mt-4 pointer-events-auto">
              <button 
                onClick={() => setLang('en')} 
                className={`transition-all duration-300 hover:opacity-100 ${lang === 'en' ? 'opacity-100 underline underline-offset-4' : 'opacity-20'}`}
              >
                EN
              </button>
              <button 
                onClick={() => setLang('fr')} 
                className={`transition-all duration-300 hover:opacity-100 ${lang === 'fr' ? 'opacity-100 underline underline-offset-4' : 'opacity-20'}`}
              >
                FR
              </button>
            </nav>
          </ParallaxWrapper>
        </header>

        {/* Discourse Section - Responsive columns with local scroll */}
        <section className="flex-1 overflow-hidden w-full relative">
          <div className="absolute inset-0 overflow-y-auto no-scrollbar pointer-events-auto">
            <ParallaxWrapper mousePosition={mousePosition} factor={0.005} className="w-full">
              <div className="columns-1 md:columns-2 lg:columns-3 gap-8 lg:gap-14 w-full text-black pb-12">
                {textLines.map((line, idx) => (
                  <p 
                    key={idx} 
                    className="mb-6 text-[12px] md:text-[14px] lg:text-[16px] leading-relaxed font-light text-black/90 text-justify break-inside-avoid selection:bg-black selection:text-white"
                  >
                    {line}
                  </p>
                ))}
              </div>
            </ParallaxWrapper>
          </div>
          
          {/* Subtle Fade Effect at bottom of text area for small devices */}
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent pointer-events-none md:hidden" />
        </section>
        
        {/* Footer */}
        <footer className="mt-4 md:mt-8 flex justify-between items-end w-full flex-shrink-0">
          <ParallaxWrapper mousePosition={mousePosition} factor={0.01}>
            <div className="text-[9px] uppercase tracking-[0.2em] text-black/30 font-medium">
              {lang === 'en' ? 'A private space for the collective' : 'Un espace privé pour le collectif'}
            </div>
          </ParallaxWrapper>
          <ParallaxWrapper mousePosition={mousePosition} factor={0.01}>
            <div className="font-serif italic text-xl md:text-2xl text-black/10">
              Vidio Di Jour
            </div>
          </ParallaxWrapper>
        </footer>
      </div>
    </main>
  );
};

export default App;
