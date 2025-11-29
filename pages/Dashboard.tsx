
import React from 'react';
import { Lesson, UserState, CivType } from '../types';
import { CIV_THEMES } from '../constants';

interface Props {
  lessons: Lesson[];
  user: UserState;
  onStartLesson: (lessonId: string) => void;
  onSwitchCiv: () => void;
}

const Dashboard: React.FC<Props> = ({ lessons, user, onStartLesson, onSwitchCiv }) => {
  const theme = CIV_THEMES[user.currentCiv];

  // Group lessons by Unit ID
  const units: { id: number; title: string; lessons: Lesson[] }[] = [];
  lessons.forEach(l => {
      const uId = l.unitId || 1;
      if (!units[uId - 1]) {
          units[uId - 1] = { id: uId, title: l.unitTitle || `Unit ${uId}`, lessons: [] };
      }
      units[uId - 1].lessons.push(l);
  });

  return (
    <div className="min-h-screen bg-stone-100 dark:bg-stone-950 pb-32 font-serif">
        
        {/* Tactical Header */}
        <div className="md:hidden sticky top-0 z-30 bg-stone-200/95 dark:bg-stone-900/95 backdrop-blur-md border-b border-stone-300 dark:border-stone-800 p-3 px-4 flex justify-between items-center shadow-md">
            <button 
                onClick={onSwitchCiv} 
                className={`flex items-center gap-2 px-3 py-1.5 rounded-sm border border-stone-400 dark:border-stone-600 active:translate-y-px transition-all bg-stone-100 dark:bg-stone-800`}
            >
                <img src={theme.symbolUrl} className="w-6 h-6 object-contain" alt={user.currentCiv} referrerPolicy="no-referrer" />
                <span className={`font-bold uppercase text-xs tracking-wider ${theme.text}`}>Timeline</span>
                <span className="text-stone-400 text-xs">▼</span>
            </button>

            <div className="flex gap-4 font-bold text-stone-600 dark:text-stone-400 text-xs tracking-wider font-mono">
                <span className="flex items-center gap-1"><span className="text-amber-600">⭐</span> {user.xp}</span>
                <span className="flex items-center gap-1"><span className="text-blue-600">💎</span> {user.gems}</span>
            </div>
        </div>
        
        <div className="max-w-2xl mx-auto pt-8 px-4">
            {units.map((unit) => (
                <div key={unit.id} className="mb-16">
                    {/* Dossier Style Header - Tactical/Documentary Look */}
                    <div className={`
                        rounded-sm p-4 mb-8 flex justify-between items-center text-white shadow-lg relative overflow-hidden
                        ${theme.primary} border-l-4 border-l-stone-900 border-t border-t-white/10
                    `}>
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cardboard.png')] opacity-10 mix-blend-multiply"></div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-1 opacity-80">
                                <span className="bg-black/30 px-2 py-0.5 rounded-sm text-[10px] font-mono font-bold uppercase tracking-widest border border-white/10">Sector {unit.id}</span>
                            </div>
                            <h2 className="text-xl md:text-2xl font-bold tracking-tight font-serif uppercase">{unit.title}</h2>
                        </div>
                        <span className="text-5xl opacity-20 font-serif font-black absolute -right-2 -bottom-4">{unit.id}</span>
                    </div>

                    {/* Path */}
                    <div className="flex flex-col items-center gap-8 relative">
                         {unit.lessons.map((lesson, idx) => {
                             const isLocked = lesson.locked;
                             const isCompleted = lesson.completed;
                             const isActive = !isLocked && !isCompleted;
                             
                             // Matured Zig-zag
                             const offset = idx % 2 === 0 ? '0px' : (idx % 4 === 1 ? '40px' : '-40px');
                             
                             return (
                                 <div key={lesson.id} className="relative group" style={{ transform: `translateX(${offset})` }}>
                                     
                                     {/* Tactical Popover */}
                                     {isActive && (
                                         <div className={`absolute -top-16 left-1/2 -translate-x-1/2 bg-stone-800 text-white py-2 px-4 rounded-sm shadow-xl border border-stone-600 animate-bounce whitespace-nowrap z-20`}>
                                             <div className="flex flex-col items-center leading-tight">
                                                 <span className="text-[9px] uppercase tracking-widest text-amber-500 font-bold font-mono">Current Objective</span>
                                                 <span className="font-serif text-sm mt-1">{lesson.title}</span>
                                             </div>
                                             <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-stone-800 transform rotate-45 border-r border-b border-stone-600"></div>
                                         </div>
                                     )}

                                     <button
                                        onClick={() => !isLocked && onStartLesson(lesson.id)}
                                        disabled={isLocked}
                                        className={`
                                            w-20 h-20 md:w-24 md:h-24 rounded-lg rotate-45 flex items-center justify-center transition-all duration-300 relative z-10
                                            shadow-[0_4px_10px_rgba(0,0,0,0.4)] hover:scale-105 active:scale-95
                                            ${isCompleted 
                                                ? 'bg-amber-600 border-2 border-amber-400 text-white' 
                                                : isLocked 
                                                    ? 'bg-stone-300 dark:bg-stone-800 border-2 border-stone-400 dark:border-stone-700 text-stone-500 grayscale' 
                                                    : `${theme.primary} border-2 border-white/20 text-white ring-4 ring-offset-2 ring-stone-200 dark:ring-stone-900`}
                                        `}
                                     >
                                         <div className="-rotate-45">
                                             <span className="text-3xl drop-shadow-md relative z-10">
                                                 {isCompleted ? '✓' : isLocked ? '🔒' : '★'}
                                             </span>
                                         </div>
                                     </button>
                                     
                                     {/* Label below button */}
                                     <div className={`absolute top-full mt-4 left-1/2 -translate-x-1/2 w-40 text-center text-xs font-bold uppercase tracking-wider font-mono ${isLocked ? 'opacity-40' : 'opacity-100'}`}>
                                         {lesson.topic || lesson.title}
                                     </div>
                                 </div>
                             )
                         })}
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
};

export default Dashboard;
