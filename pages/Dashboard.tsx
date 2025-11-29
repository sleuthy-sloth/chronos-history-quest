

import React from 'react';
import { Lesson, UserState, CivType } from '../types';
import { CIV_THEMES } from '../constants';

interface Props {
  lessons: Lesson[];
  user: UserState;
  onStartLesson: (lessonId: string) => void;
  onSwitchCiv: (civ: CivType) => void;
}

const Dashboard: React.FC<Props> = ({ lessons, user, onStartLesson, onSwitchCiv }) => {
  const theme = CIV_THEMES[user.currentCiv];

  // Group lessons into visual "Units"
  // Note: 'lessons' prop is already enriched with completed/locked status by App.tsx
  const units = [
      { id: 1, title: theme.description, lessons: lessons.slice(0, 3), color: theme.primary },
      // Placeholder for future expansion
      // { id: 2, title: "Expansion Era", lessons: lessons.slice(3, 6), color: theme.primary },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 pb-32">
        
        {/* Mobile Header - Timeline Switcher */}
        <div className="md:hidden sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-gray-200 dark:border-slate-800 p-4 flex justify-between items-center shadow-sm">
            <div className="flex gap-4 font-bold text-gray-500">
                <span className="flex items-center gap-1"><span className="text-red-500">❤️</span> 5</span>
                <span className="flex items-center gap-1"><span className="text-blue-500">💎</span> {user.gems}</span>
            </div>
            <button 
                onClick={() => onSwitchCiv(user.currentCiv)} 
                className={`flex items-center gap-2 px-3 py-1 rounded-xl border-b-4 active:border-b-0 active:translate-y-1 transition-all ${theme.bgLight} ${theme.border}`}
            >
                <span className="text-2xl">{theme.icon}</span>
                <span className={`font-extrabold uppercase text-xs ${theme.text}`}>Timeline</span>
            </button>
        </div>
        
        <div className="max-w-xl mx-auto pt-8 px-4">
            {units.map((unit) => (
                <div key={unit.id} className="mb-12">
                    {/* Unit Header - Uses CIV SPECIFIC Color */}
                    <div className={`rounded-2xl p-4 mb-8 flex justify-between items-center text-white shadow-3d ${theme.primary}`}>
                        <div>
                            <h3 className="uppercase text-sm font-extrabold opacity-80">Unit {unit.id}</h3>
                            <h2 className="text-xl font-extrabold">{unit.title}</h2>
                        </div>
                        <span className="text-3xl opacity-50">📖</span>
                    </div>

                    {/* The Path */}
                    <div className="flex flex-col items-center gap-6 relative">
                         {unit.lessons.map((lesson, idx) => {
                             const isLocked = lesson.locked;
                             const isCompleted = lesson.completed;
                             const isActive = !isLocked && !isCompleted;
                             
                             // Zig-zag offset
                             const offset = idx % 2 === 0 ? '0px' : (idx % 4 === 1 ? '50px' : '-50px');
                             
                             return (
                                 <div key={lesson.id} className="relative group" style={{ transform: `translateX(${offset})` }}>
                                     {/* Floating "Start" Bubble for Active Lesson */}
                                     {isActive && (
                                         <div className={`absolute -top-12 left-1/2 -translate-x-1/2 bg-white dark:bg-slate-800 font-bold py-2 px-4 rounded-xl shadow-xl border-2 animate-bounce whitespace-nowrap z-20 ${theme.text} ${theme.border}`}>
                                             START +{lesson.xpReward} XP
                                             <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white dark:bg-slate-800 border-b-2 border-r-2 transform rotate-45 ${theme.border}`}></div>
                                         </div>
                                     )}

                                     <button
                                        onClick={() => !isLocked && onStartLesson(lesson.id)}
                                        disabled={isLocked}
                                        className={`
                                            w-20 h-20 rounded-full flex items-center justify-center border-b-4 transition-all active:border-b-0 active:translate-y-1 relative z-10
                                            ${isCompleted 
                                                ? 'bg-amber-400 border-amber-600 text-white' // Gold for completed
                                                : isLocked 
                                                    ? 'bg-gray-200 dark:bg-slate-800 border-gray-300 dark:border-slate-700 text-gray-400' 
                                                    : `${theme.primary} ${theme.border} text-white shadow-lg scale-110`}
                                        `}
                                     >
                                         <span className="text-3xl">
                                             {isCompleted ? '👑' : isLocked ? '🔒' : '★'}
                                         </span>
                                         
                                         {/* Circular Progress Ring (Simulated) */}
                                         {isActive && (
                                             <div className="absolute inset-0 rounded-full border-4 border-white/30 animate-pulse"></div>
                                         )}
                                     </button>
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
