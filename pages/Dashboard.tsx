
import React, { useMemo } from 'react';
import { Lesson, UserState, CivType } from '../types';
import { CIV_THEMES, AVATARS } from '../constants';

interface Props {
  lessons: Lesson[];
  user: UserState;
  onStartLesson: (lessonId: string) => void;
}

const Dashboard: React.FC<Props> = ({ lessons, user, onStartLesson }) => {
  const theme = CIV_THEMES[user.currentCiv];
  const avatarUrl = AVATARS.find(a => a.id === user.avatarId)?.url;

  const getDramaticIntro = (civ: CivType) => {
      switch(civ) {
          case CivType.ROME:
              return "Imagine, if you will, a city of mud and outlaws that would one day dictate the destiny of the entire Mediterranean world.";
          case CivType.EGYPT:
              return "The sands of time have buried countless names, but some were carved so deep that even eternity could not erase them.";
          case CivType.BYZANTIUM:
              return "While the lights went out across Europe, one city kept the flame of Rome burning for another thousand years.";
          case CivType.PERSIA:
              return "They say history is written by the victors. But the Persians built a world where you didn't have to be a victor to survive.";
          default:
              return "The past is a foreign country. They do things differently there.";
      }
  };

  const nodeSpacing = 160;
  const amplitude = 25; // Percentage offset from center (50). Keeps nodes at 25% and 75% width.

  // Calculate container height explicitly so scrolling works
  const pathContainerHeight = Math.max(lessons.length * nodeSpacing + 200, 600);

  // Generate SVG Path
  const { pathD, nodes } = useMemo(() => {
    const points = lessons.map((_, i) => ({
      x: i % 2 === 0 ? 50 - amplitude : 50 + amplitude, // Alternate left/right offset from 50%
      y: 50 + (i * nodeSpacing)
    }));

    let d = `M 50 0 L ${points[0]?.x || 50} ${points[0]?.y || 50}`;
    
    for (let i = 0; i < points.length - 1; i++) {
      const current = points[i];
      const next = points[i + 1];
      // Bezier curve control points
      const cp1y = current.y + (nodeSpacing / 2);
      const cp2y = next.y - (nodeSpacing / 2);
      d += ` C ${current.x} ${cp1y}, ${next.x} ${cp2y}, ${next.x} ${next.y}`;
    }

    // Extend path a bit after last node
    if (points.length > 0) {
        const last = points[points.length - 1];
        d += ` L 50 ${last.y + 100}`;
    }

    return { pathD: d, nodes: points };
  }, [lessons]);

  // Generate Props (Decorations)
  const props = useMemo(() => {
      const availableProps = theme.props || ['🏛️'];
      const items = [];
      const count = Math.floor(pathContainerHeight / 100); 
      
      for(let i=0; i<count; i++) {
          const isLeft = Math.random() > 0.5;
          const yPos = Math.random() * pathContainerHeight;
          // Scatter them away from the center path (which is roughly 25% to 75%)
          // Left side: 5% to 20%. Right side: 80% to 95%
          const xPos = isLeft ? 5 + Math.random() * 15 : 80 + Math.random() * 15;
          const scale = 0.5 + Math.random() * 1.5;
          const rotation = (Math.random() - 0.5) * 20;
          const emoji = availableProps[Math.floor(Math.random() * availableProps.length)];
          
          items.push({ x: xPos, y: yPos, scale, rotation, emoji });
      }
      return items;
  }, [theme, pathContainerHeight]);

  // Find active node index for Avatar placement
  const activeNodeIndex = lessons.findIndex(l => !l.locked && !l.completed);
  // If all completed, place at end. If none active (all locked?? shouldn't happen), place at 0.
  const avatarIndex = activeNodeIndex === -1 ? (lessons.every(l => l.completed) ? lessons.length - 1 : 0) : activeNodeIndex;
  const avatarNode = nodes[avatarIndex];

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center relative overflow-x-hidden pb-32">
      {/* Dynamic Background */}
      <div className={`absolute inset-0 bg-gradient-to-b ${theme.gradient} opacity-20 pointer-events-none fixed`} />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none fixed" />

      {/* Hero Section */}
      <div className="w-full relative z-10 pt-8 pb-12 px-4 flex flex-col items-center">
         <div className="glass-panel max-w-4xl w-full rounded-3xl relative overflow-hidden border-t border-white/10 shadow-2xl animate-fade-in-up group">
            
            {/* Cover Image Background */}
            <div className="absolute inset-0 z-0">
                <img src={theme.coverImage} className="w-full h-full object-cover opacity-20 group-hover:scale-105 transition-transform duration-[2s] grayscale group-hover:grayscale-0" alt="Hero" />
                <div className={`absolute inset-0 bg-gradient-to-r ${theme.gradient} opacity-90 mix-blend-multiply`} />
            </div>

            <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
                <div className={`w-32 h-32 md:w-40 md:h-40 p-4 rounded-full border border-white/10 bg-black/30 shadow-2xl backdrop-blur-md animate-float flex items-center justify-center`}>
                    <img 
                        src={theme.symbolUrl} 
                        alt="icon" 
                        className="w-full h-full object-contain drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]" 
                    />
                </div>
                <div className="text-center md:text-left flex-1">
                    <h2 className={`font-serif text-xs md:text-sm font-bold tracking-[0.4em] uppercase mb-2 ${theme.secondary} opacity-90`}>Current Exhibition</h2>
                    <h1 className="font-serif text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg tracking-wide">{theme.leagueTitle}</h1>
                    <div className="h-1 w-20 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto md:mx-0 mb-6 opacity-70" />
                    <p className="text-slate-200 font-serif italic text-lg leading-relaxed max-w-2xl drop-shadow-md">
                        "{getDramaticIntro(user.currentCiv)}"
                    </p>
                </div>
            </div>
         </div>
      </div>

      {/* The Path */}
      <div className="relative w-full max-w-lg" style={{ height: `${pathContainerHeight}px` }}>
        
        {/* Props (Decorations) Layer */}
        {props.map((prop, i) => (
            <div 
                key={i}
                className="absolute pointer-events-none opacity-40 filter grayscale-[0.5] hover:grayscale-0 hover:opacity-80 transition-all duration-500"
                style={{ 
                    left: `${prop.x}%`, 
                    top: `${prop.y}px`, 
                    transform: `scale(${prop.scale}) rotate(${prop.rotation}deg)`,
                    fontSize: '2rem'
                }}
            >
                {prop.emoji}
            </div>
        ))}

        {/* SVG Curve */}
        {/* ViewBox 0-100 on X axis maps to 0-100% of container width. Y axis matches pixels. */}
        <svg 
            className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-visible"
            viewBox={`0 0 100 ${pathContainerHeight}`}
            preserveAspectRatio="none"
        >
            {/* Glow Path */}
            <path 
                d={pathD} 
                fill="none" 
                className={`${theme.secondary} blur-md`}
                stroke="currentColor" 
                strokeWidth="16" 
                strokeOpacity="0.1"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
            />
            {/* Core Path */}
            <path 
                d={pathD} 
                fill="none" 
                className="text-slate-700"
                stroke="currentColor" 
                strokeWidth="4" 
                strokeDasharray="8 8"
                vectorEffect="non-scaling-stroke"
            />
            {/* Progress Path (Simulated) */}
             <path 
                d={pathD} 
                fill="none" 
                className={theme.secondary} 
                stroke="currentColor" 
                strokeWidth="4" 
                strokeDasharray="1000"
                strokeDashoffset={1000 - (user.completedLessons.filter(id => id.startsWith(user.currentCiv.toLowerCase())).length / lessons.length) * 1000} // Simple visual approximation
                vectorEffect="non-scaling-stroke"
            />
        </svg>

        {/* Nodes */}
        {lessons.map((lesson, index) => {
          const isLocked = lesson.locked;
          const isCompleted = lesson.completed;
          const isActive = !isLocked && !isCompleted;
          
          // Position
          const node = nodes[index];
          const leftPos = node ? node.x : 50;
          const topPos = node ? node.y : 0;

          return (
            <div 
                key={lesson.id} 
                className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
                style={{ left: `${leftPos}%`, top: `${topPos}px` }}
            >
              {/* Tooltip */}
               <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-48 text-center transition-all duration-300 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0'} z-20 pointer-events-none`}>
                  <div className="bg-slate-900/90 text-white text-sm font-bold py-2 px-3 rounded-lg border border-slate-700 shadow-xl backdrop-blur-md font-serif tracking-wide">
                      {lesson.title}
                  </div>
                  <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-slate-800 mx-auto"></div>
              </div>

              {/* Node Button */}
              <button
                onClick={() => !isLocked && onStartLesson(lesson.id)}
                disabled={isLocked}
                className={`
                  relative w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center transition-all duration-300
                  ${isCompleted 
                    ? 'bg-amber-600 shadow-[0_0_25px_rgba(217,119,6,0.6)] border-4 border-amber-400' 
                    : isLocked 
                        ? 'bg-slate-800 border-4 border-slate-700 grayscale cursor-not-allowed opacity-70' 
                        : `bg-slate-900 border-4 ${theme.accent} shadow-[0_0_40px_rgba(255,255,255,0.3)] animate-pulse-slow`
                  }
                  hover:scale-110 active:scale-95 z-10
                `}
              >
                {/* Inner Ring */}
                <div className={`absolute inset-1 rounded-full border-2 border-white/10 border-dashed ${isActive ? 'animate-spin-slow' : ''}`} />

                <span className="text-3xl md:text-4xl relative z-10 filter drop-shadow-lg">
                    {isCompleted ? '👑' : isLocked ? '🔒' : '⚔️'}
                </span>

                {/* Stars for score */}
                {isCompleted && (
                    <div className="absolute -bottom-3 flex gap-0.5">
                        <span className="text-xs text-yellow-300 drop-shadow-md">★</span>
                        <span className="text-xs text-yellow-300 drop-shadow-md">★</span>
                        <span className="text-xs text-yellow-300 drop-shadow-md">★</span>
                    </div>
                )}
              </button>
            </div>
          );
        })}

        {/* Player Avatar Marker */}
        {avatarNode && avatarUrl && (
            <div 
                className="absolute transform -translate-x-1/2 -translate-y-1/2 z-30 transition-all duration-1000 ease-in-out"
                style={{ 
                    left: `${avatarNode.x}%`, 
                    top: `${avatarNode.y - 70}px` // Floating above the node
                }}
            >
                <div className="relative animate-bounce-slow">
                     <div className="w-16 h-16 rounded-full border-4 border-white bg-slate-900 shadow-xl overflow-hidden">
                         <img src={avatarUrl} alt="Player" className="w-full h-full object-cover" />
                     </div>
                     <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-white mx-auto mt-1"></div>
                </div>
            </div>
        )}

      </div>
    </div>
  );
};

export default Dashboard;
