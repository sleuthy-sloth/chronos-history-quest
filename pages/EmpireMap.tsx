

import React, { useState } from 'react';
import { UserState } from '../types';
import { CIV_THEMES, LESSON_DATA } from '../constants';

interface Props {
  user: UserState;
}

const EmpireMap: React.FC<Props> = ({ user }) => {
  const [activeMarker, setActiveMarker] = useState<string | null>(null);
  const theme = CIV_THEMES[user.currentCiv];
  
  // Filter lessons for current Civ
  const civLessons = LESSON_DATA.filter(l => l.civ === user.currentCiv);
  const completedCount = user.completedLessons.filter(id => id.startsWith(user.currentCiv.toLowerCase())).length;
  // Prevent division by zero
  const progressPercent = civLessons.length > 0 ? Math.round((completedCount / civLessons.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden">
        
        {/* Background Texture (War Room Table) */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] bg-cover opacity-30 z-0 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-transparent to-slate-900 z-0"></div>

        {/* Header Stats */}
        <div className="absolute top-4 left-0 right-0 z-20 flex justify-center pointer-events-none">
            <div className="bg-slate-900/90 backdrop-blur-md border border-amber-500/30 rounded-full px-6 py-2 flex items-center gap-4 shadow-2xl animate-fade-in-up">
                <span className="text-2xl">{theme.icon}</span>
                <div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Imperial Expansion</p>
                    <div className="flex items-center gap-2">
                         <div className="w-32 h-2 bg-slate-800 rounded-full overflow-hidden border border-white/10">
                             <div className={`h-full ${theme.primary} transition-all duration-1000 shadow-[0_0_10px_currentColor]`} style={{ width: `${progressPercent}%` }}></div>
                         </div>
                         <span className="font-mono text-amber-500 font-bold text-xs">{progressPercent}%</span>
                    </div>
                </div>
            </div>
        </div>

        {/* Map Container */}
        <div className="relative w-full max-w-6xl aspect-[4/3] md:aspect-[16/9] bg-[#1a1614] rounded-xl overflow-hidden border-[12px] border-[#2e231e] shadow-[0_20px_50px_rgba(0,0,0,0.7),inset_0_0_100px_rgba(0,0,0,0.8)] group transition-all duration-500 hover:scale-[1.01]">
            
            {/* The Map Image - Object Contain to ensure coordinates match perfectly */}
            <div className="absolute inset-0 p-4 md:p-8 flex items-center justify-center bg-[#e6dccf]">
                <img 
                    src={theme.mapImage || theme.coverImage} 
                    alt="Empire Map" 
                    className="w-full h-full object-contain filter sepia-[0.3] contrast-125 saturate-50 mix-blend-multiply opacity-90" 
                    referrerPolicy="no-referrer"
                />
                
                {/* Paper Texture Overlay */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/aged-paper-texture.png')] opacity-60 pointer-events-none mix-blend-multiply" />
                <div className="absolute inset-0 shadow-[inset_0_0_150px_rgba(56,40,26,0.5)] pointer-events-none" />
            </div>

            {/* Grid Overlay */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/grid-me.png')] opacity-10 pointer-events-none mix-blend-overlay" />

            {/* Lesson Markers */}
            {civLessons.map((lesson) => {
                const isCompleted = user.completedLessons.includes(lesson.id);
                // Default coordinates 50,50 if missing
                const coords = lesson.mapCoordinates || { x: 50, y: 50 };

                return (
                    <div 
                        key={lesson.id}
                        className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10 group/marker"
                        style={{ left: `${coords.x}%`, top: `${coords.y}%` }}
                    >
                        {/* Pin Head */}
                        <button
                            onClick={() => setActiveMarker(lesson.id)}
                            className={`
                                relative w-4 h-4 md:w-6 md:h-6 rounded-full border-2 transition-all duration-300 shadow-lg
                                ${isCompleted 
                                    ? 'bg-amber-600 border-white shadow-[0_0_15px_rgba(245,158,11,0.8)] scale-110 z-20' 
                                    : 'bg-slate-700 border-slate-500 opacity-80 hover:scale-110 hover:bg-slate-600 z-10'}
                            `}
                        >
                            {/* Ping Animation for Active/Completed */}
                            {activeMarker === lesson.id && (
                                <div className="absolute inset-0 rounded-full animate-ping bg-white opacity-50"></div>
                            )}
                        </button>

                        {/* Hover Label (Desktop) - Styled like a handwritten note */}
                        <div className="hidden md:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max opacity-0 group-hover/marker:opacity-100 transition-opacity pointer-events-none z-30">
                            <div className="bg-[#f3eacb] text-slate-900 text-xs px-3 py-1 rounded-sm shadow-lg font-serif italic border border-[#d4c5a0] transform rotate-1">
                                {lesson.title}
                            </div>
                            <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-[#d4c5a0] mx-auto"></div>
                        </div>
                    </div>
                );
            })}
        </div>

        {/* Marker Info Card (Popup) */}
        {activeMarker && (
            <div className="absolute bottom-24 md:bottom-12 left-1/2 -translate-x-1/2 w-[90%] md:w-auto z-30 animate-pop">
                {(() => {
                    const l = civLessons.find(l => l.id === activeMarker);
                    if (!l) return null;
                    const isCompleted = user.completedLessons.includes(l.id);
                    
                    return (
                        <div className="bg-[#1c1917]/95 backdrop-blur-md border border-amber-500/40 p-6 rounded-xl shadow-2xl flex flex-col md:flex-row gap-6 items-center text-center md:text-left max-w-2xl relative overflow-hidden">
                            {/* Glow */}
                            <div className={`absolute top-0 left-0 w-1 h-full ${theme.primary}`}></div>

                            <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl border-2 flex-shrink-0 ${isCompleted ? 'bg-amber-900/50 border-amber-500 text-amber-500' : 'bg-slate-800 border-slate-600 text-slate-500'}`}>
                                {isCompleted ? '👑' : '🔒'}
                            </div>
                            <div className="flex-1">
                                <h3 className="font-serif text-xl text-amber-100 font-bold mb-1 tracking-wide">{l.title}</h3>
                                <p className="text-stone-400 text-sm leading-relaxed">{l.description}</p>
                            </div>
                            {isCompleted && (
                                <div className="px-3 py-1 bg-green-900/40 text-green-400 text-[10px] font-bold uppercase tracking-widest rounded border border-green-500/30">
                                    Conquered
                                </div>
                            )}
                            
                            <button 
                                onClick={() => setActiveMarker(null)}
                                className="absolute top-2 right-2 text-stone-500 hover:text-white transition-colors"
                            >
                                ✕
                            </button>
                        </div>
                    )
                })()}
            </div>
        )}

        <div className="absolute bottom-4 right-4 text-[10px] text-slate-600 font-mono opacity-50">
            STRATEGIC COMMAND VIEW • {user.currentCiv}
        </div>
    </div>
  );
};

export default EmpireMap;
