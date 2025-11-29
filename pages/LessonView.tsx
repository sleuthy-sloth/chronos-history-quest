
import React, { useState, useEffect, useRef } from 'react';
import { Lesson, ActivityType } from '../types';
import { CIV_THEMES, MASCOT_INTEL, getImage } from '../constants';

interface Props {
  lesson: Lesson;
  onExit: () => void;
  onComplete: (xp: number) => void;
  sfxVolume: number;
}

const LessonView: React.FC<Props> = ({ lesson, onExit, onComplete, sfxVolume }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [feedbackState, setFeedbackState] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  
  // NEW: Stable state for randomized games
  const [shuffledMatchingGrid, setShuffledMatchingGrid] = useState<{id: string, text: string, type: string}[]>([]);
  const [shuffledSortingPool, setShuffledSortingPool] = useState<string[]>([]);
  const [sortedItems, setSortedItems] = useState<string[]>([]);

  const activity = lesson.activities[currentSlideIndex];
  const theme = CIV_THEMES[lesson.civ];
  const progress = ((currentSlideIndex) / lesson.activities.length) * 100;

  useEffect(() => {
    setSelectedOption(null);
    setFeedbackState('idle');
    setShowBottomSheet(false);
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
        setSortedItems([]);
    }

  }, [currentSlideIndex, activity]);

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

      switch(activity.type) {
          case ActivityType.READING:
              isCorrect = true;
              break;
          case ActivityType.QUIZ:
              isCorrect = selectedOption === activity.correctAnswer;
              break;
          case ActivityType.SORTING:
              if (activity.correctOrder && sortedItems.length === activity.correctOrder.length) {
                   isCorrect = sortedItems.every((val, index) => val === activity.correctOrder![index]);
              }
              break;
          default:
              isCorrect = true;
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
          onComplete(lesson.xpReward);
      }
  };

  const handleSortItemClick = (item: string) => {
      if (shuffledSortingPool.includes(item)) {
          setShuffledSortingPool(prev => prev.filter(i => i !== item));
          setSortedItems(prev => [...prev, item]);
      } else {
          setSortedItems(prev => prev.filter(i => i !== item));
          setShuffledSortingPool(prev => [...prev, item]);
      }
      playSfx('pop');
  };

  return (
    <div className="h-screen bg-white dark:bg-slate-950 flex flex-col overflow-hidden font-duo">
        
        {/* Top Bar */}
        <div className="flex items-center gap-4 p-4 max-w-3xl mx-auto w-full z-10">
            <button onClick={onExit} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-2xl font-bold">
                ✕
            </button>
            <div className="flex-1 h-4 bg-gray-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <div 
                    className={`h-full ${theme.primary} transition-all duration-500 ease-out rounded-full`}
                    style={{ width: `${progress}%` }}
                >
                    <div className="h-2 w-full bg-white/20 rounded-full mt-1"></div>
                </div>
            </div>
            <div className="text-red-500 font-bold flex items-center gap-1">
                ❤️ 5
            </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto pb-40 flex flex-col items-center p-6 max-w-2xl mx-auto w-full">
            
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-700 dark:text-gray-200 mb-8 text-center self-start w-full">
                {activity.question}
            </h1>

            {activity.type === ActivityType.READING && (
                <div className="w-full flex flex-col gap-6">
                    <div className="relative group w-full min-h-[200px] bg-gray-100 dark:bg-slate-900 rounded-2xl overflow-hidden border-2 border-gray-200 dark:border-slate-700 shadow-sm">
                        <img 
                            src={activity.customImage || getImage(activity.question)} 
                            className="w-full h-full object-contain" 
                            alt="Historical Artifact"
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/800px-No_image_available.svg.png';
                            }}
                        />
                        {activity.imageCredit && (
                            <div className="absolute bottom-0 right-0 left-0 bg-black/60 text-white text-[10px] px-2 py-1 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity text-center">
                                Source: {activity.imageCredit}
                            </div>
                        )}
                    </div>
                    
                    {/* Teaching Text Block - Use Serif for Narrative Feel */}
                    <div className="bg-gray-50 dark:bg-slate-900 border-l-4 p-6 rounded-r-xl" style={{ borderColor: theme.primary.replace('bg-', 'var(--tw-text-opacity)') }}>
                        <p className="text-lg md:text-xl text-slate-800 dark:text-slate-300 leading-relaxed font-serif whitespace-pre-line">
                            {activity.narrative}
                        </p>
                    </div>

                    {/* Mascot Hint */}
                    <div className="flex items-end gap-4 mt-2">
                         <img src={theme.mascotImage} className="w-20 h-20 object-contain drop-shadow-md" alt="Mascot" referrerPolicy="no-referrer" />
                         <div className="bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-700 p-4 rounded-2xl rounded-bl-none text-gray-600 dark:text-gray-400 font-bold text-sm shadow-sm flex-1 relative">
                             {activity.mascotGuidance}
                             <div className="absolute -bottom-[2px] -left-[2px] w-4 h-4 bg-white dark:bg-slate-800 border-b-2 border-l-2 border-gray-200 dark:border-slate-700 transform rotate-45"></div>
                         </div>
                    </div>
                </div>
            )}

            {activity.type === ActivityType.QUIZ && (
                <div className="grid grid-cols-1 gap-3 w-full">
                    {activity.options?.map((opt) => (
                        <button
                            key={opt}
                            onClick={() => { setSelectedOption(opt); playSfx('pop'); }}
                            disabled={showBottomSheet}
                            className={`
                                p-4 rounded-2xl border-2 border-b-4 text-left font-bold text-lg transition-all
                                ${selectedOption === opt 
                                    ? `${theme.bgLight} ${theme.border} ${theme.text}` 
                                    : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700'}
                            `}
                        >
                            <div className="flex justify-between items-center">
                                {opt}
                                {selectedOption === opt && <span className={`${theme.primary} text-white text-xs px-2 py-1 rounded`}>SELECTED</span>}
                            </div>
                        </button>
                    ))}
                    {activity.mascotGuidance && (
                        <div className="flex items-center gap-3 mt-4 opacity-70">
                            <img src={theme.mascotImage} className="w-12 h-12 object-contain" referrerPolicy="no-referrer" />
                            <p className="text-sm font-bold text-gray-500">"{activity.mascotGuidance}"</p>
                        </div>
                    )}
                </div>
            )}

            {activity.type === ActivityType.SORTING && (
                <div className="w-full flex flex-col gap-6">
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest text-center">Tap to Order</p>
                    
                    <div className="flex flex-col gap-2 min-h-[150px] bg-gray-100 dark:bg-slate-900 rounded-2xl p-4 border-2 border-dashed border-gray-300 dark:border-slate-700">
                        {sortedItems.length === 0 && <span className="text-center text-gray-400 italic my-auto">Tap items below to sort them here</span>}
                        {sortedItems.map((item, idx) => (
                            <button
                                key={`sorted-${idx}`}
                                onClick={() => handleSortItemClick(item)}
                                disabled={showBottomSheet}
                                className={`w-full p-3 bg-white dark:bg-slate-800 border-2 font-bold rounded-xl shadow-sm text-left flex items-center gap-3 ${theme.border} ${theme.text}`}
                            >
                                <span className={`${theme.primary} text-white w-6 h-6 rounded-full flex items-center justify-center text-xs`}>{idx + 1}</span>
                                {item}
                            </button>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 gap-2">
                        {shuffledSortingPool.map((item, idx) => (
                            <button
                                key={`pool-${idx}`}
                                onClick={() => handleSortItemClick(item)}
                                disabled={showBottomSheet}
                                className="w-full p-3 bg-white dark:bg-slate-800 border-2 border-b-4 border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-300 font-bold rounded-xl active:border-b-2 active:translate-y-1 transition-all text-left"
                            >
                                {item}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>

        {/* Bottom Bar */}
        <div className={`
            fixed bottom-0 left-0 w-full p-4 border-t border-gray-200 dark:border-slate-800 transition-colors z-50
            ${showBottomSheet ? (feedbackState === 'correct' ? 'bg-green-100 dark:bg-green-900/20' : 'bg-red-100 dark:bg-red-900/20') : 'bg-white dark:bg-slate-900'}
        `}>
            <div className="max-w-2xl mx-auto flex justify-between items-center">
                {showBottomSheet ? (
                    <div className="flex-1 flex items-center justify-between animate-fade-in-up">
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-3xl bg-white ${feedbackState === 'correct' ? 'text-green-500' : 'text-red-500'}`}>
                                {feedbackState === 'correct' ? '✓' : '✕'}
                            </div>
                            <div>
                                <h3 className={`font-extrabold text-xl ${feedbackState === 'correct' ? 'text-green-600' : 'text-red-600'}`}>
                                    {feedbackState === 'correct' ? 'Excellent!' : 'Correct Solution:'}
                                </h3>
                                {feedbackState === 'incorrect' && (
                                    <div className="text-red-500 text-sm font-bold mt-1">
                                        {activity.correctAnswer || (activity.correctOrder ? "Order incorrect" : "Keep learning!")}
                                    </div>
                                )}
                            </div>
                        </div>
                        <button 
                            onClick={handleNext}
                            className={`px-8 py-3 rounded-2xl font-extrabold uppercase tracking-wide text-white border-b-4 active:border-b-0 active:translate-y-1 transition-all
                                ${feedbackState === 'correct' ? 'bg-green-500 border-green-700' : 'bg-red-500 border-red-700'}
                            `}
                        >
                            Continue
                        </button>
                    </div>
                ) : (
                    <button 
                        onClick={handleCheck}
                        disabled={
                            (activity.type === ActivityType.QUIZ && !selectedOption) ||
                            (activity.type === ActivityType.SORTING && shuffledSortingPool.length > 0)
                        }
                        className={`w-full py-3 rounded-2xl font-extrabold uppercase tracking-wide text-white border-b-4 active:border-b-0 active:translate-y-1 transition-all
                            ${(
                                (activity.type === ActivityType.QUIZ && !selectedOption) ||
                                (activity.type === ActivityType.SORTING && shuffledSortingPool.length > 0)
                              )
                                ? 'bg-gray-300 border-gray-400 cursor-not-allowed text-gray-500' 
                                : `${theme.primary} ${theme.border} hover:opacity-90`}
                        `}
                    >
                        {activity.type === ActivityType.READING ? 'CONTINUE' : 'CHECK'}
                    </button>
                )}
            </div>
        </div>
    </div>
  );
};

export default LessonView;
