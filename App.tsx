
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
    <main className="relative w-full h-screen bg-white overflow-hidden flex flex-col">
      {/* Subtle animated background */}
      <BackgroundWaves mousePosition={mousePosition} />

      {/* Main Content Container */}
      <div className="relative z-10 flex flex-col h-full p-6 md:p-10 lg:p-14 pointer-events-none">
        
        {/* Header Section */}
        <header className="flex justify-between items-start w-full mb-4 md:mb-8 lg:mb-10">
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

        {/* Discourse Section - Multi-column layout with enlarged text */}
        <section className="flex-1 flex items-center justify-center overflow-hidden w-full">
          <ParallaxWrapper mousePosition={mousePosition} factor={0.005} className="w-full">
            <div className="columns-1 md:columns-2 lg:columns-3 gap-10 lg:gap-14 w-full text-black pointer-events-auto">
              {textLines.map((line, idx) => (
                <p 
                  key={idx} 
                  className="mb-6 text-[13px] md:text-[15px] lg:text-[17px] leading-relaxed font-light text-black/90 text-justify break-inside-avoid selection:bg-black selection:text-white"
                >
                  {line}
                </p>
              ))}
            </div>
          </ParallaxWrapper>
        </section>
        
        {/* Footer */}
        <footer className="mt-4 md:mt-8 flex justify-between items-end w-full">
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
