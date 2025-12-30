
import React, { useState, useEffect, useMemo } from 'react';
import { MousePosition } from './types';
import { DISCOURSE_TEXT, BACKGROUND_IMAGE } from './constants';
import BackgroundWaves from './components/BackgroundWaves';
import ParallaxWrapper from './components/ParallaxWrapper';

const App: React.FC = () => {
  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
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

  const textLines = useMemo(() => DISCOURSE_TEXT.split('\n\n'), []);
  // Small cursor blob size
  const blobSize = 80;

  return (
    <main className="relative w-full h-screen bg-white select-none overflow-hidden flex flex-col">
      <BackgroundWaves mousePosition={mousePosition} />

      {/* BASE LAYER (Static Content - Black on White) */}
      <div className="absolute inset-0 flex flex-col p-8 md:p-16 pointer-events-none z-10">
        {/* Header Section - Slightly tighter for space */}
        <div className="flex justify-between items-start w-full mb-4 md:mb-6">
          <ParallaxWrapper mousePosition={mousePosition} factor={0.03}>
            <h1 className="font-serif text-4xl md:text-6xl leading-[0.85] text-black tracking-tight uppercase">
              Thank<br />You
            </h1>
          </ParallaxWrapper>

          <ParallaxWrapper mousePosition={mousePosition} factor={0.015} className="text-right">
            <div className="font-serif italic text-lg md:text-xl text-black">
              2025 — 2026
            </div>
            <div className="text-[9px] uppercase tracking-[0.3em] text-black/50 mt-1">
              One Year of Vidio Di Jour
            </div>
          </ParallaxWrapper>
        </div>

        {/* Centered Text Body - Use justify-center but allow it to move up if space is tight */}
        <div className="flex-1 flex items-center justify-center min-h-0">
          <div className="max-w-2xl w-full">
            <ParallaxWrapper mousePosition={mousePosition} factor={0.005}>
              <div className="space-y-3 md:space-y-4 text-black pointer-events-none">
                {textLines.map((line, idx) => (
                  <p key={idx} className="text-[12px] md:text-[14px] lg:text-[15px] leading-relaxed font-light opacity-90">
                    {line}
                  </p>
                ))}
              </div>
            </ParallaxWrapper>
          </div>
        </div>

        {/* Footer Space Balance */}
        <div className="h-12" />
      </div>

      {/* REVEAL LAYER (Clipped Overlay - White on Image) */}
      <div 
        className="absolute inset-0 z-30 pointer-events-none overflow-hidden"
        style={{
          clipPath: `circle(${blobSize}px at ${mousePosition.x}px ${mousePosition.y}px)`,
          WebkitClipPath: `circle(${blobSize}px at ${mousePosition.x}px ${mousePosition.y}px)`,
        }}
      >
        {/* REVEAL IMAGE BACKGROUND */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${revealImage})` }}
        >
          <div className="absolute inset-0 bg-black/60" />
        </div>

        {/* IDENTICAL CONTENT (WHITE) */}
        <div className="absolute inset-0 flex flex-col p-8 md:p-16">
          <div className="flex justify-between items-start w-full mb-4 md:mb-6">
            <ParallaxWrapper mousePosition={mousePosition} factor={0.03}>
              <h1 className="font-serif text-4xl md:text-6xl leading-[0.85] text-white tracking-tight uppercase">
                Thank<br />You
              </h1>
            </ParallaxWrapper>

            <ParallaxWrapper mousePosition={mousePosition} factor={0.015} className="text-right">
              <div className="font-serif italic text-lg md:text-xl text-white">
                2025 — 2026
              </div>
              <div className="text-[9px] uppercase tracking-[0.3em] text-white/80 mt-1">
                One Year of Vidio Di Jour
              </div>
            </ParallaxWrapper>
          </div>

          <div className="flex-1 flex items-center justify-center min-h-0">
            <div className="max-w-2xl w-full">
              <ParallaxWrapper mousePosition={mousePosition} factor={0.005}>
                <div className="space-y-3 md:space-y-4 text-white">
                  {textLines.map((line, idx) => (
                    <p key={idx} className="text-[12px] md:text-[14px] lg:text-[15px] leading-relaxed font-light">
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

      {/* Custom Cursor Circle Decoration */}
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
            Self-hosted with love
          </div>
        </ParallaxWrapper>
        <ParallaxWrapper mousePosition={mousePosition} factor={0.005}>
          <div className="font-serif italic text-base text-black/60">
            Vidio Di Jour
          </div>
        </ParallaxWrapper>
      </div>

      {/* Settings Trigger */}
      <button 
        onClick={() => setIsSettingsOpen(true)}
        className="fixed bottom-4 right-4 w-2 h-2 rounded-full bg-black/5 hover:bg-black/20 transition-all z-[100] cursor-pointer pointer-events-auto"
        title="Settings"
      />

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-white/90 backdrop-blur-sm px-6 pointer-events-auto">
          <div className="bg-white border border-black/10 p-8 md:p-12 max-w-md w-full shadow-2xl space-y-8 animate-in fade-in zoom-in duration-300">
            <div className="space-y-2">
              <h2 className="font-serif text-3xl text-black">Platform Settings</h2>
              <p className="text-xs uppercase tracking-widest text-black/40">Visual Preferences</p>
            </div>
            
            <div className="space-y-4">
              <label className="block text-sm font-medium text-black/60">
                Background Reveal Image URL
              </label>
              <input 
                type="text" 
                value={tempImageUrl}
                onChange={(e) => setTempImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-4 py-3 border border-black/10 focus:border-black/40 outline-none transition-colors font-light text-sm cursor-text"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button 
                onClick={saveImage}
                className="flex-1 px-6 py-3 bg-black text-white text-xs uppercase tracking-widest hover:bg-black/80 transition-colors cursor-pointer"
              >
                Apply Changes
              </button>
              <button 
                onClick={() => setIsSettingsOpen(false)}
                className="px-6 py-3 border border-black/10 text-black text-xs uppercase tracking-widest hover:bg-black/5 transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default App;
