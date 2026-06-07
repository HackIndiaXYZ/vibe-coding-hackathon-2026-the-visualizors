import React, { useState, useEffect } from 'react';

export default function InteractiveBackground({ children, isDark }) {
  const [mousePos, setMousePos] = useState({ x: 500, y: 500 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      // Smooth tracking using raw coordinates
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className={`relative min-h-screen transition-colors duration-700 overflow-hidden ${isDark ? 'bg-slate-950' : 'bg-slate-50'}`}>
      
      {/* Dynamic Cursor Glow */}
      <div 
        className={`absolute w-[600px] h-[600px] rounded-full blur-[100px] pointer-events-none transition-transform duration-100 ease-out z-0 opacity-40 ${isDark ? 'bg-indigo-600/30' : 'bg-indigo-300/40'}`}
        style={{ 
          transform: `translate(${mousePos.x - 300}px, ${mousePos.y - 300}px)`,
        }}
      />

      {/* Background Mesh Grid Pattern */}
      <div 
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: isDark 
            ? 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)'
            : 'linear-gradient(rgba(0, 0, 0, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 0, 0, 0.03) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      />

      {/* Static Accent Orbs */}
      <div className={`absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none z-0 ${isDark ? 'bg-emerald-900/20' : 'bg-emerald-200/40'}`} />
      <div className={`absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none z-0 ${isDark ? 'bg-orange-900/20' : 'bg-orange-200/40'}`} />

      {/* Main Content Layer */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}