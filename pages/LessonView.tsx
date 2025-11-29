
import React, { useState, useEffect } from 'react';
import { Lesson, ActivityType } from '../types';
import { CIV_THEMES, getImage } from '../constants';
import { generateLessonContent } from '../services/geminiService';

interface Props {
  lesson: Lesson;
  onExit: () => void;
  onComplete: (xp: number, generatedLesson?: Lesson) => void;
  sfxVolume: number;
}

const LessonView: React.FC<Props> = ({ lesson: initialLesson, onExit, onComplete, sfxVolume }) => {
  const [lesson, setLesson] = useState<Lesson>(initialLesson);
  const [isLoading, setIsLoading] = useState(initialLesson.isSkeleton);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [feedbackState, setFeedbackState] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [shuffledMatchingGrid, setShuffledMatchingGrid] = useState<any[]>([]);
  const [shuffledSortingPool, setShuffledSortingPool] = useState<string[]>([]);
  const [sortedItems, setSortedItems] = useState<string[]>([]);
  const [showScholarNotes, setShowScholarNotes] = useState(false);

  const theme = CIV_THEMES[lesson.civ];

  // AI Generation Effect for Skeleton Lessons
  useEffect(() => {
    if (initialLesson.isSkeleton) {
        const fetchContent = async () => {
            const generated = await generateLessonContent(initialLesson);
            if (generated) {
                setLesson(generated);
                setIsLoading(false);
            } else {
                alert("Failed to decrypt ancient texts. Please try again.");
                onExit();
            }
        };
        fetchContent();
    }
  }, [initialLesson]);

  const activity = lesson.activities[currentSlideIndex];
  const progress = ((currentSlideIndex) / (lesson.activities.length || 1)) * 100;

  useEffect(() => {
    if (isLoading || !activity) return;
    setSelectedOption(null);
    setFeedbackState('idle');
    setShowBottomSheet(false);
    setShowScholarNotes(false);
    setShuffledMatchingGrid([]);
    setShuffledSortingPool([]);
    setSortedItems([]);

    if (activity.type === ActivityType.MATCHING && activity.pairs) {
        const grid = activity.pairs.flatMap(p => [
            { id: p.term, text: p.term, type: 'term' },
            { id: p.definition, text: p.definition, type: 'def' }
        ]).sort(() => Math.random() - 0.5);
        setShuffledMatchingGrid(grid);
    }

    if (activity.type === ActivityType.SORTING && activity.items) {
        const pool = [...activity.items].sort(() => Math.random() - 0.5);
        setShuffledSortingPool(pool);
    }
  }, [currentSlideIndex, activity, isLoading]);

  const playSfx = (type: 'correct' | 'wrong' | 'pop') => {
    if (sfxVolume <= 0) return;
    const urls = {
        correct: 'https://codeskulptor-demos.commondatastorage.googleapis.com/pang/pop.mp3',
        wrong: 'https://codeskulptor-demos.commondatastorage.googleapis.com/assets/soundboard/explode.wav',
        pop: 'https://codeskulptor-demos.commondatastorage.googleapis.com/pang/arrow.mp3'
    }
    new Audio(urls[type]).play().catch(()=>{});
  };

  const handleCheck = () => {
      let isCorrect = false;
      if (!activity) return;

      switch(activity.type) {
          case ActivityType.READING: isCorrect = true; break;
          case ActivityType.QUIZ: isCorrect = selectedOption === activity.correctAnswer; break;
          case ActivityType.SORTING: 
             if (activity.correctOrder && sortedItems.length === activity.correctOrder.length) 
                isCorrect = sortedItems.every((val, index) => val === activity.correctOrder![index]);
             break;
          default: isCorrect = true;
      }

      if (isCorrect) {
          setFeedbackState('correct');
          playSfx('correct');
      } else {
          setFeedbackState('incorrect');
          playSfx('wrong');
      }
      setShowBottomSheet(true);
  };

  const handleNext = () => {
      if (currentSlideIndex < lesson.activities.length - 1) {
          setCurrentSlideIndex(prev => prev + 1);
      } else {
          onComplete(lesson.xpReward, initialLesson.isSkeleton ? lesson : undefined);
      }
  };

  if (isLoading) {
      return (
          <div className="h-screen bg-stone-900 flex flex-col items-center justify-center text-center p-8 font-serif">
              <div className={`w-16 h-16 border-4 border-stone-700 border-t-amber-500 rounded-sm animate-spin mb-6`}></div>
              <h2 className="text-2xl font-bold text-stone-200 mb-2 uppercase tracking-widest">Decrypting Archives...</h2>
              <p className="text-stone-500 font-mono text-sm">Accessing topic: "{lesson.topic}"</p>
          </div>
      )
  }

  if (!activity) return null;

  return (
    <div className="h-screen bg-stone-100 dark:bg-stone-950 flex flex-col font-serif overflow-hidden">
        
        {/* Progress Header */}
        <div className="flex items-center gap-4 p-4 max-w-3xl mx-auto w-full z-10 bg-white/80 dark:bg-stone-900/80 backdrop-blur border-b border-stone-200 dark:border-stone-800">
            <button onClick={onExit} className="text-stone-400 hover:text-stone-600 text-xl font-bold">✕</button>
            <div className="flex-1 h-1.5 bg-stone-300 dark:bg-stone-800 rounded-sm overflow-hidden">
                <div className={`h-full ${theme.primary} transition-all duration-500`} style={{ width: `${progress}%` }} />
            </div>
            
            {/* Scholar Notes Toggle */}
            {activity.scholarNotes && (
                <button 
                    onClick={() => setShowScholarNotes(!showScholarNotes)}
                    className={`w-8 h-8 flex items-center justify-center rounded-sm border transition-colors ${showScholarNotes ? 'bg-amber-100 text-amber-700 border-amber-300' : 'text-stone-400 border-stone-300 hover:bg-stone-100'}`}
                >
                    📖
                </button>
            )}
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 pb-40 max-w-2xl mx-auto w-full relative">
            
            {/* Scholar Context Card (Overlay) */}
            {showScholarNotes && (
                <div className="mb-6 bg-[#fdfbf7] dark:bg-stone-800 p-6 rounded-sm border border-l-4 border-stone-300 dark:border-stone-700 border-l-amber-600 shadow-md animate-fade-in-up">
                    <h4 className="font-bold text-amber-600 uppercase tracking-widest text-[10px] font-mono mb-2">Field Note</h4>
                    <p className="text-stone-800 dark:text-stone-300 leading-relaxed text-sm font-serif">
                        {activity.scholarNotes}
                    </p>
                </div>
            )}

            <h1 className="text-xl md:text-2xl font-bold text-stone-900 dark:text-stone-100 mb-6 leading-tight">
                {activity.question}
            </h1>

            {activity.type === ActivityType.READING && (
                <div className="space-y-6">
                    <div className="rounded-sm overflow-hidden border-4 border-white dark:border-stone-800 shadow-lg">
                        <img 
                            src={activity.customImage || getImage(activity.question)} 
                            className="w-full h-auto max-h-[300px] object-cover"
                            alt="Historical Scene"
                            referrerPolicy="no-referrer"
                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                         {activity.imageCredit && (
                            <div className="bg-stone-900 text-stone-400 text-[9px] px-2 py-1 text-right uppercase tracking-wider">
                                {activity.imageCredit}
                            </div>
                        )}
                    </div>
                    
                    <div className="prose dark:prose-invert prose-lg max-w-none text-stone-700 dark:text-stone-300 leading-relaxed font-serif">
                        {activity.narrative}
                    </div>

                     <div className="flex items-start gap-4 p-4 bg-stone-200 dark:bg-stone-900 rounded-sm border-l-4 border-l-stone-400 dark:border-l-stone-600">
                         <img src={theme.mascotImage} className="w-12 h-12 rounded-sm object-cover grayscale contrast-125" referrerPolicy="no-referrer" />
                         <div>
                             <p className="text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1 font-mono">{theme.mascot} INTL:</p>
                             <p className="italic text-stone-800 dark:text-stone-200 font-medium">"{activity.mascotGuidance}"</p>
                         </div>
                     </div>
                </div>
            )}

            {activity.type === ActivityType.QUIZ && (
                <div className="grid gap-3">
                    {activity.options?.map((opt) => (
                        <button
                            key={opt}
                            onClick={() => { setSelectedOption(opt); playSfx('pop'); }}
                            disabled={showBottomSheet}
                            className={`
                                p-4 rounded-sm border-2 text-left font-bold text-lg transition-all
                                ${selectedOption === opt 
                                    ? `${theme.bgLight} ${theme.border} ${theme.text} shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]` 
                                    : 'bg-white dark:bg-stone-900 border-stone-300 dark:border-stone-700 hover:border-stone-400 hover:bg-stone-50'}
                            `}
                        >
                            {opt}
                        </button>
                    ))}
                </div>
            )}
            
            {(activity.type === ActivityType.SORTING) && (
                 <div className="space-y-4">
                     <div className="bg-stone-100 dark:bg-stone-900 p-4 rounded-sm border-2 border-stone-300 dark:border-stone-700 border-dashed min-h-[100px] flex flex-col gap-2">
                        {sortedItems.length === 0 && <p className="text-stone-400 italic text-center text-sm font-mono uppercase">Sequence Required</p>}
                        {sortedItems.map(item => (
                            <div key={item} className={`p-3 bg-white dark:bg-stone-800 border border-stone-400 rounded-sm shadow-sm font-bold flex gap-3 items-center`}>
                                <span className={`w-5 h-5 rounded-sm ${theme.primary} text-white flex items-center justify-center text-xs`}>✓</span>
                                {item}
                            </div>
                        ))}
                     </div>
                     <div className="grid gap-2">
                         {shuffledSortingPool.map(item => (
                             <button 
                                key={item} 
                                onClick={() => {
                                    setSortedItems([...sortedItems, item]);
                                    setShuffledSortingPool(pool => pool.filter(i => i !== item));
                                    playSfx('pop');
                                }}
                                className="p-3 bg-white dark:bg-stone-800 border-b-2 border-stone-300 dark:border-stone-700 font-bold text-stone-700 dark:text-stone-300 hover:bg-stone-50 text-left"
                             >
                                 {item}
                             </button>
                         ))}
                     </div>
                 </div>
            )}
        </div>

        {/* Footer */}
        <div className={`fixed bottom-0 left-0 w-full p-4 border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 z-50 transition-colors duration-300
            ${showBottomSheet ? (feedbackState === 'correct' ? 'bg-emerald-50 dark:bg-emerald-950/30' : 'bg-red-50 dark:bg-red-950/30') : ''}
        `}>
            <div className="max-w-2xl mx-auto">
                {showBottomSheet ? (
                    <div className="flex justify-between items-center animate-fade-in-up">
                        <div>
                            <h3 className={`font-bold text-xl uppercase tracking-wider ${feedbackState === 'correct' ? 'text-emerald-800' : 'text-red-800'}`}>
                                {feedbackState === 'correct' ? 'Mission Accomplished' : 'Correction Needed'}
                            </h3>
                            {feedbackState === 'incorrect' && <p className="text-red-700 text-sm mt-1">{activity.correctAnswer || "Try again."}</p>}
                        </div>
                        <button onClick={handleNext} className={`px-8 py-3 rounded-sm font-bold uppercase tracking-widest text-white shadow-lg ${feedbackState === 'correct' ? 'bg-emerald-700 hover:bg-emerald-600' : 'bg-red-700 hover:bg-red-600'}`}>
                            Continue
                        </button>
                    </div>
                ) : (
                    <button 
                        onClick={handleCheck}
                        disabled={activity.type !== ActivityType.READING && !selectedOption && sortedItems.length === 0}
                        className={`w-full py-4 rounded-sm font-bold uppercase tracking-[0.2em] text-white shadow-lg transform active:scale-[0.99] transition-all disabled:opacity-50 disabled:grayscale
                            ${theme.primary}
                        `}
                    >
                        {activity.type === ActivityType.READING ? 'Acknowledged' : 'Confirm'}
                    </button>
                )}
            </div>
        </div>
    </div>
  );
};

export default LessonView;
