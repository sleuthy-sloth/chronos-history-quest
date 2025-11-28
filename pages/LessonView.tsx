import React, { useState, useEffect } from 'react';
import { Activity, ActivityType, Lesson } from '../types';
import { getImage, CIV_THEMES, MASCOT_INTEL } from '../constants';
import { playTTS } from '../services/geminiService';

interface Props {
  lesson: Lesson;
  onExit: () => void;
  onComplete: (xp: number) => void;
  sfxVolume: number;
}

const LessonView: React.FC<Props> = ({ lesson, onExit, onComplete, sfxVolume }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [mapFeedback, setMapFeedback] = useState<'hit' | 'miss' | null>(null);
  const [feedbackState, setFeedbackState] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [sortedItems, setSortedItems] = useState<string[]>([]);
  const [imgError, setImgError] = useState(false);
  const [showingMapQuiz, setShowingMapQuiz] = useState(false);
  const [showScholarNotes, setShowScholarNotes] = useState(false);
  
  // Cipher State
  const [cipherInput, setCipherInput] = useState<string[]>([]);
  
  // Decision State
  const [decisionFeedback, setDecisionFeedback] = useState<string | null>(null);

  // Artifact State
  const [foundHotspots, setFoundHotspots] = useState<string[]>([]);
  const [activeHotspot, setActiveHotspot] = useState<any>(null);

  // Mascot State
  const [mascotMessage, setMascotMessage] = useState<string | null>(null);
  const [mascotVisible, setMascotVisible] = useState(false);

  // Shuffled States
  const [shuffledMatchingGrid, setShuffledMatchingGrid] = useState<{id: string, text: string, type: string}[]>([]);
  const [shuffledSortingPool, setShuffledSortingPool] = useState<string[]>([]);

  const activity = lesson.activities[currentSlideIndex];
  const theme = CIV_THEMES[lesson.civ];
  const progress = ((currentSlideIndex) / lesson.activities.length) * 100;

  useEffect(() => {
    setSelectedOption(null);
    setMapFeedback(null);
    setFeedbackState('idle');
    setMatchedPairs([]);
    setSortedItems([]);
    setCipherInput([]);
    setDecisionFeedback(null);
    setImgError(false);
    setShowingMapQuiz(false);
    setFoundHotspots([]);
    setActiveHotspot(null);
    setShowScholarNotes(false);
    setShuffledMatchingGrid([]);
    setShuffledSortingPool([]);

    // Shuffle Games logic
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

    // Mascot Entrance Logic
    setMascotVisible(false);
    const msg = activity.mascotGuidance || null;
    if (msg) {
        setMascotMessage(msg);
        setTimeout(() => setMascotVisible(true), 500);
    } else {
        setMascotMessage(null);
    }
    
  }, [currentSlideIndex, activity]);

  const playSfx = (url: string) => {
    if (sfxVolume <= 0) return;
    const audio = new Audio(url);
    audio.volume = sfxVolume;
    audio.play().catch(()=>{});
  };

  const handleNext = () => {
    if (currentSlideIndex < lesson.activities.length - 1) {
      setCurrentSlideIndex(prev => prev + 1);
    } else {
      onComplete(lesson.xpReward);
    }
  };

  const triggerMascotReaction = (isCorrect: boolean) => {
      // Get random generic reaction
      const intel = MASCOT_INTEL[lesson.civ];
      let pool = isCorrect 
          ? intel.filter(i => i.mood === 'witty' || i.mood === 'fact') 
          : intel.filter(i => i.mood === 'dark' || i.mood === 'encouraging');
      
      // Fallback if filter is too strict or empty
      if (pool.length === 0) pool = intel;
      
      const reaction = pool[Math.floor(Math.random() * pool.length)];
      setMascotMessage(reaction.fact);
      setMascotVisible(true);
  };

  const checkAnswer = () => {
    let isCorrect = false;

    if (activity.type === ActivityType.QUIZ || activity.type === ActivityType.PRIMARY_SOURCE) {
      isCorrect = selectedOption === activity.correctAnswer;
    } else if (activity.type === ActivityType.READING || activity.type === ActivityType.ARTIFACT_EXPLORATION) {
      isCorrect = true;
    } else if (activity.type === ActivityType.CIPHER) {
        if (JSON.stringify(cipherInput) === JSON.stringify(activity.cipherCorrect)) {
            isCorrect = true;
        }
    } else if (activity.type === ActivityType.MAP_CONQUEST && showingMapQuiz && activity.mapQuiz) {
        isCorrect = selectedOption === activity.mapQuiz.correctAnswer;
    }

    if (isCorrect) {
      setFeedbackState('correct');
      playSfx('https://codeskulptor-demos.commondatastorage.googleapis.com/pang/pop.mp3');
      // Only react if we are not moving immediately (some games might differ)
      if (activity.type === ActivityType.QUIZ || activity.type === ActivityType.MAP_CONQUEST || activity.type === ActivityType.PRIMARY_SOURCE) {
          triggerMascotReaction(true);
      }
    } else {
      setFeedbackState('incorrect');
      playSfx('https://codeskulptor-demos.commondatastorage.googleapis.com/assets/soundboard/explode.wav');
      triggerMascotReaction(false);
    }
  };

  // --- UI Component for missing images ---
  const ImageErrorState = () => (
      <div className="w-full h-64 md:h-96 bg-slate-800 border-2 border-slate-700 border-dashed rounded-xl flex flex-col items-center justify-center p-8 opacity-60">
          <div className="text-4xl mb-4 grayscale">🏛️</div>
          <h4 className="font-serif text-slate-400 font-bold uppercase tracking-widest text-sm text-center">Visual Archive Unavailable</h4>
          <p className="text-slate-500 text-xs text-center mt-2 max-w-xs">The sands of time have obscured this artifact. The text records remain intact.</p>
      </div>
  );

  // --- Renderers ---

  const renderContent = () => {
    const rawUrl = activity.customImage || getImage(activity.imageKeyword || 'history artifact');
    
    switch (activity.type) {
      case ActivityType.READING:
        return (
          <div key={currentSlideIndex} className="flex flex-col items-center animate-fade-in-up w-full max-w-4xl mx-auto">
            <div className="relative w-full group">
                <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-slate-900 border border-slate-700">
                    {imgError ? <ImageErrorState /> : (
                        <>
                            <img 
                                src={rawUrl} 
                                onError={() => setImgError(true)}
                                alt="Historical Scene" 
                                className="w-full h-64 md:h-96 object-cover transform hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-90" />
                            {activity.imageCredit && (
                                <div className="absolute bottom-4 right-4 text-[10px] bg-black/40 backdrop-blur px-2 py-1 rounded border border-white/10 text-slate-300">
                                    © {activity.imageCredit}
                                </div>
                            )}
                        </>
                    )}

                    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                        <h3 className="font-serif text-3xl md:text-4xl text-amber-500 font-bold mb-4 drop-shadow-md border-l-4 border-amber-500 pl-4">{activity.question}</h3>
                    </div>
                </div>
            </div>
            
            <div className="glass-panel p-6 md:p-8 rounded-2xl mt-[-20px] relative z-10 w-[95%] border-t-0 shadow-xl">
              <p className="text-lg md:text-xl leading-relaxed text-slate-200 font-serif font-light tracking-wide">{activity.narrative}</p>
            </div>
          </div>
        );

      case ActivityType.ARTIFACT_EXPLORATION:
        return (
            <div key={currentSlideIndex} className="w-full max-w-4xl mx-auto flex flex-col items-center animate-fade-in-up">
                <div className="relative w-full bg-slate-900 rounded-2xl overflow-hidden border border-slate-700 shadow-2xl group">
                    {imgError ? <ImageErrorState /> : (
                        <img 
                            src={rawUrl} 
                            onError={() => setImgError(true)}
                            className="w-full h-[60vh] object-contain bg-black/50"
                            alt="Artifact"
                        />
                    )}
                    
                    {/* Hotspots - Only show if image is valid */}
                    {!imgError && activity.artifactHotspots?.map((hotspot) => {
                        const isFound = foundHotspots.includes(hotspot.id);
                        return (
                            <button
                                key={hotspot.id}
                                onClick={() => {
                                    setActiveHotspot(hotspot);
                                    if (!isFound) {
                                        setFoundHotspots(prev => [...prev, hotspot.id]);
                                        playSfx('https://codeskulptor-demos.commondatastorage.googleapis.com/pang/pop.mp3');
                                    }
                                }}
                                className={`absolute w-8 h-8 md:w-12 md:h-12 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 flex items-center justify-center transition-all duration-300 z-10
                                    ${isFound 
                                        ? 'bg-green-500/20 border-green-500 text-green-400' 
                                        : 'bg-amber-500/20 border-amber-500 animate-pulse text-amber-400 hover:bg-amber-500/40 hover:scale-110'}
                                `}
                                style={{ top: `${hotspot.y}%`, left: `${hotspot.x}%` }}
                            >
                                {isFound ? '✓' : '🔍'}
                            </button>
                        )
                    })}

                    {/* Instruction Overlay (fades out on interaction) */}
                    {!imgError && foundHotspots.length === 0 && !activeHotspot && (
                         <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur px-6 py-2 rounded-full border border-white/10 text-white text-sm font-bold animate-pulse pointer-events-none">
                             Tap the magnifying glasses to investigate
                         </div>
                    )}
                </div>

                {/* Hotspot Info Panel */}
                <div className={`mt-4 w-full p-6 bg-slate-900/90 border-l-4 ${activeHotspot ? 'border-amber-500' : 'border-slate-700'} rounded-r-xl shadow-lg transition-all min-h-[120px]`}>
                    {activeHotspot ? (
                        <div className="animate-fade-in-up">
                            <h4 className="font-serif text-xl font-bold text-amber-500 mb-2">{activeHotspot.label}</h4>
                            <p className="text-slate-300 text-sm md:text-base">{activeHotspot.description}</p>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full text-slate-500 italic">
                            Select a point of interest to analyze the artifact.
                        </div>
                    )}
                </div>

                <div className="mt-4 text-xs text-slate-400 uppercase tracking-widest font-bold">
                    FOUND: {foundHotspots.length} / {activity.artifactHotspots?.length}
                </div>
            </div>
        );

      case ActivityType.PRIMARY_SOURCE:
        return (
            <div key={currentSlideIndex} className="w-full max-w-3xl mx-auto animate-fade-in-up">
                {/* Parchment Container */}
                <div className="relative p-8 md:p-12 mb-8 bg-[#e3d5b8] text-amber-900 rounded-sm shadow-2xl rotate-1 transform transition-transform hover:rotate-0">
                    {/* Paper Texture Overlay */}
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/old-paper.png')] opacity-60 pointer-events-none rounded-sm" />
                    <div className="absolute inset-0 shadow-[inset_0_0_80px_rgba(87,60,21,0.3)] pointer-events-none rounded-sm" />
                    
                    <div className="relative z-10 font-serif">
                        <div className="text-center border-b-2 border-amber-900/20 pb-4 mb-6">
                            <h3 className="text-2xl font-bold uppercase tracking-widest opacity-80">{activity.question}</h3>
                            <p className="text-xs italic mt-2 opacity-70">{activity.sourceAuthor || "Unknown"}, {activity.sourceDate || "Ancient Era"}</p>
                        </div>
                        
                        <blockquote className="text-xl md:text-2xl leading-relaxed italic text-amber-950 drop-shadow-sm text-justify">
                            "{activity.sourceText}"
                        </blockquote>

                        <div className="flex justify-end mt-6">
                            <div className="w-16 h-16 border-4 border-amber-900/30 rounded-full flex items-center justify-center opacity-40 rotate-12">
                                <span className="text-[10px] font-bold uppercase text-center leading-tight">Royal<br/>Archive</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Analysis Question */}
                <div className="glass-panel p-6 rounded-2xl border border-slate-700">
                    <p className="text-slate-300 mb-4 font-bold text-lg">{activity.narrative}</p>
                    <div className="grid gap-3">
                        {activity.options?.map((opt) => (
                            <button
                                key={opt}
                                onClick={() => setSelectedOption(opt)}
                                disabled={feedbackState !== 'idle'}
                                className={`p-4 text-left rounded-xl border border-white/5 transition-all
                                    ${selectedOption === opt 
                                        ? 'bg-amber-600 text-white shadow-lg' 
                                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}
                                    ${selectedOption === opt && feedbackState === 'correct' ? '!bg-green-600' : ''}
                                    ${selectedOption === opt && feedbackState === 'incorrect' ? '!bg-red-800 !border-red-500' : ''}
                                `}
                            >
                                {opt}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        );

      case ActivityType.QUIZ:
        return (
          <div key={currentSlideIndex} className="w-full max-w-2xl mx-auto mt-4 md:mt-10 animate-fade-in-up">
             {activity.customImage && (
                <div className="mb-8 flex justify-center">
                    <div className="p-1 rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 shadow-xl w-full max-w-lg">
                        {imgError ? <ImageErrorState /> : (
                            <img 
                                src={activity.customImage} 
                                onError={() => setImgError(true)}
                                className="h-32 md:h-48 w-full object-cover rounded-lg opacity-90 border border-slate-600" 
                                alt="Quiz Context" 
                            />
                        )}
                    </div>
                </div>
            )}
            <h3 className="font-serif text-2xl md:text-3xl text-white mb-8 text-center drop-shadow-md font-bold">{activity.question}</h3>
            <div className="grid gap-4">
              {activity.options?.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setSelectedOption(opt)}
                  disabled={feedbackState !== 'idle'}
                  className={`relative p-5 rounded-xl border-b-4 text-left transition-all font-serif text-lg tracking-wide
                    ${selectedOption === opt 
                      ? `bg-slate-700 ${theme.accent} border-b-amber-600 text-white shadow-[0_0_20px_rgba(255,255,255,0.1)] translate-y-1` 
                      : 'bg-slate-800 border-slate-700 border-b-slate-950 text-slate-400 hover:bg-slate-750 hover:border-slate-600 hover:-translate-y-0.5 active:translate-y-1 active:border-b-0'}
                    ${selectedOption === opt && feedbackState === 'correct' ? '!bg-green-700 !border-green-500 !border-b-green-800 animate-pop' : ''}
                    ${selectedOption === opt && feedbackState === 'incorrect' ? '!bg-red-800 !border-red-600 !border-b-red-900 animate-shake' : ''}
                  `}
                >
                  <div className="flex items-center justify-between">
                    <span>{opt}</span>
                    {selectedOption === opt && feedbackState === 'correct' && <span>✨</span>}
                    {selectedOption === opt && feedbackState === 'incorrect' && <span>❌</span>}
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case ActivityType.MAP_CONQUEST:
        return (
          <div key={currentSlideIndex} className={`relative w-full max-w-3xl mx-auto aspect-video bg-slate-800 rounded-2xl overflow-hidden border-4 shadow-2xl animate-fade-in-up ${feedbackState === 'incorrect' ? 'border-red-500 animate-shake' : 'border-slate-700'}`}>
            {imgError ? <div className="absolute inset-0 flex items-center justify-center"><ImageErrorState /></div> : (
                <img 
                    src={rawUrl}
                    onError={() => setImgError(true)}
                    className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity duration-500"
                    alt="Map"
                />
            )}
            
            {/* Grid Overlay */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/grid-me.png')] opacity-10 pointer-events-none" />
            
            {/* Map Instruction Header */}
            {!showingMapQuiz && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-[90%] md:w-auto bg-black/70 p-4 rounded-xl text-white text-center backdrop-blur-md border border-amber-500/30 shadow-xl transition-all hover:bg-black/90 z-20">
                    <p className="font-serif text-lg md:text-xl font-bold text-amber-500">MISSION OBJECTIVE</p>
                    <p className="font-sans text-sm md:text-base text-slate-200">{activity.question}</p>
                </div>
            )}
            
            {/* Miss Click Zone (Transparent, behind buttons but above image) */}
            <div 
                className="absolute inset-0 z-0 cursor-crosshair" 
                onClick={(e) => {
                    if (feedbackState !== 'correct' && !showingMapQuiz && !mapFeedback) {
                        setFeedbackState('incorrect');
                        playSfx('https://codeskulptor-demos.commondatastorage.googleapis.com/assets/soundboard/explode.wav');
                        setTimeout(() => setFeedbackState('idle'), 500);
                    }
                }} 
            />

            {/* Target Button (Above Miss Zone) */}
            {activity.mapTarget && !imgError && !showingMapQuiz && (
               <button
                  onClick={(e) => {
                      e.stopPropagation(); // Prevent miss click trigger
                      setMapFeedback('hit');
                      playSfx('https://codeskulptor-demos.commondatastorage.googleapis.com/pang/pop.mp3');
                      
                      if (activity.mapQuiz) {
                           setTimeout(() => {
                               setShowingMapQuiz(true);
                           }, 1000);
                      } else {
                           setFeedbackState('correct');
                      }
                  }}
                  disabled={mapFeedback === 'hit'}
                  className={`absolute w-24 h-24 rounded-full -translate-x-1/2 -translate-y-1/2 transition-all duration-300 z-10
                    ${mapFeedback === 'hit' ? 'bg-green-500/40 border-2 border-green-400 shadow-[0_0_30px_rgba(34,197,94,0.6)] animate-pop' : 'bg-transparent'}
                    hover:bg-white/10
                  `}
                  style={{ top: `${activity.mapTarget.y}%`, left: `${activity.mapTarget.x}%` }}
               >
                   {mapFeedback === 'hit' && <span className="text-4xl animate-bounce">📍</span>}
               </button>
            )}

            {/* Quiz Overlay */}
            {showingMapQuiz && activity.mapQuiz && (
                <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-center p-8 animate-fade-in-up z-20">
                    <div className="w-20 h-20 bg-green-900/50 rounded-full flex items-center justify-center mb-6 border-2 border-green-500 text-3xl animate-pop shadow-[0_0_30px_rgba(34,197,94,0.3)]">
                        Target Acquired
                    </div>
                    <h3 className="font-serif text-2xl text-white text-center mb-8 max-w-md">
                        {activity.mapQuiz.question}
                    </h3>
                    <div className="grid grid-cols-1 w-full max-w-md gap-3">
                        {activity.mapQuiz.options.map(opt => (
                            <button
                                key={opt}
                                onClick={() => setSelectedOption(opt)}
                                disabled={feedbackState !== 'idle'}
                                className={`p-4 rounded-lg border-2 text-base font-bold text-left transition-all
                                    ${selectedOption === opt 
                                        ? `bg-slate-800 ${theme.accent} text-white shadow-lg scale-[1.02]` 
                                        : 'bg-slate-900 border-slate-700 text-slate-400 hover:bg-slate-800 hover:border-slate-500'}
                                    ${selectedOption === opt && feedbackState === 'correct' ? '!bg-green-700 !border-green-500' : ''}
                                    ${selectedOption === opt && feedbackState === 'incorrect' ? '!bg-red-800 !border-red-600 animate-shake' : ''}
                                `}
                            >
                                {opt}
                            </button>
                        ))}
                    </div>
                </div>
            )}
          </div>
        );
        
      case ActivityType.MATCHING:
        if (shuffledMatchingGrid.length === 0) return <ImageErrorState />;
        
        return (
            <div key={currentSlideIndex} className="w-full max-w-4xl mx-auto animate-fade-in-up">
                <h3 className="text-center font-serif text-3xl mb-8 text-amber-500 drop-shadow-md">Connect the Concepts</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                    {shuffledMatchingGrid.map((item) => {
                        const isSelected = selectedOption === item.text;
                        const isMatched = matchedPairs.includes(item.text);
                        
                        return (
                            <button
                                key={item.text}
                                disabled={isMatched}
                                onClick={() => {
                                    if (!selectedOption) {
                                        setSelectedOption(item.text);
                                    } else {
                                        const pair = activity.pairs?.find(p => 
                                            (p.term === selectedOption && p.definition === item.text) ||
                                            (p.definition === selectedOption && p.term === item.text)
                                        );
                                        if (pair) {
                                            setMatchedPairs(prev => [...prev, item.text, selectedOption]);
                                            setSelectedOption(null);
                                            playSfx('https://codeskulptor-demos.commondatastorage.googleapis.com/pang/pop.mp3');
                                            if (matchedPairs.length + 2 >= (activity.pairs?.length || 0) * 2) {
                                                setFeedbackState('correct');
                                                triggerMascotReaction(true);
                                            }
                                        } else {
                                            setSelectedOption(null);
                                            playSfx('https://codeskulptor-demos.commondatastorage.googleapis.com/assets/soundboard/explode.wav');
                                            triggerMascotReaction(false);
                                        }
                                    }
                                }}
                                className={`p-4 rounded-xl border-b-4 font-serif font-bold text-sm md:text-base transition-all h-32 flex items-center justify-center text-center shadow-lg
                                    ${isMatched ? 'opacity-0 scale-50 pointer-events-none' : 'opacity-100 scale-100'}
                                    ${isSelected 
                                        ? 'border-amber-500 border-b-amber-700 bg-amber-900/50 text-white -translate-y-1' 
                                        : 'border-slate-700 border-b-slate-900 bg-slate-800 text-slate-300 hover:bg-slate-750 hover:-translate-y-0.5'}
                                `}
                            >
                                {item.text}
                            </button>
                        )
                    })}
                </div>
            </div>
        );

      case ActivityType.SORTING:
        if (shuffledSortingPool.length === 0) return <ImageErrorState />;
        
        return (
            <div key={currentSlideIndex} className="w-full max-w-lg mx-auto animate-fade-in-up">
                <h3 className="text-center font-serif text-2xl mb-2 text-white">{activity.question}</h3>
                <p className="text-center text-xs text-amber-500 mb-8 uppercase tracking-[0.2em] font-bold">Chronological Order</p>
                
                <div className={`flex flex-col gap-3 transition-colors p-6 rounded-2xl glass-panel ${feedbackState === 'incorrect' ? 'border-red-500 animate-shake' : ''}`}>
                    <div className="space-y-3 min-h-[100px]">
                        {sortedItems.map((item, index) => (
                            <div key={item} className="p-4 bg-gradient-to-r from-green-900/60 to-slate-800 border border-green-500/50 rounded-xl flex items-center gap-4 animate-pop shadow-lg">
                                <span className="bg-green-500 text-black font-bold w-8 h-8 rounded-full flex items-center justify-center text-sm shadow-md">{index + 1}</span>
                                <span className="text-green-100 font-serif">{item}</span>
                            </div>
                        ))}
                        {sortedItems.length === 0 && (
                            <div className="text-center text-slate-600 italic py-4">Tap items below to add them to the timeline</div>
                        )}
                    </div>

                    <div className="h-px bg-white/10 my-4" />

                    <div className="grid gap-3">
                         {shuffledSortingPool.filter(i => !sortedItems.includes(i)).map(item => (
                             <button
                                key={item}
                                onClick={() => {
                                    const nextIndex = sortedItems.length;
                                    const correctItem = activity.correctOrder?.[nextIndex];
                                    
                                    if (item === correctItem) {
                                        setSortedItems(prev => [...prev, item]);
                                        playSfx('https://codeskulptor-demos.commondatastorage.googleapis.com/pang/pop.mp3');
                                        if (nextIndex + 1 === activity.correctOrder?.length) {
                                            setFeedbackState('correct');
                                            triggerMascotReaction(true);
                                        }
                                    } else {
                                        playSfx('https://codeskulptor-demos.commondatastorage.googleapis.com/assets/soundboard/explode.wav');
                                        setSortedItems([]);
                                        setFeedbackState('incorrect'); 
                                        triggerMascotReaction(false);
                                        setTimeout(() => setFeedbackState('idle'), 500);
                                    }
                                }}
                                className="p-4 bg-slate-800 border-b-4 border-slate-950 rounded-xl text-left transition-all active:scale-95 hover:bg-slate-700 hover:border-slate-800 font-serif text-slate-300"
                             >
                                 {item}
                             </button>
                         ))}
                    </div>
                </div>
            </div>
        );

      case ActivityType.CIPHER:
        return (
            <div key={currentSlideIndex} className="w-full max-w-xl mx-auto animate-fade-in-up flex flex-col items-center">
                <div className="w-full bg-[#1c1917] p-8 rounded-xl border-[6px] border-[#44403c] mb-8 relative shadow-2xl">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/concrete-wall.png')] opacity-30 pointer-events-none" />
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                    
                    <h3 className="font-serif text-2xl text-amber-600 text-center mb-2 relative z-10 font-bold">{activity.question}</h3>
                    <p className="text-sm text-center text-stone-400 mb-8 italic relative z-10">{activity.narrative}</p>
                    
                    {/* The Symbols */}
                    <div className="flex justify-center gap-6 mb-8 relative z-10">
                        {activity.cipherSymbols?.map((sym, i) => (
                            <div key={i} className="text-5xl md:text-6xl drop-shadow-md text-stone-300 font-serif">
                                {sym}
                            </div>
                        ))}
                    </div>
                    
                    {/* The Answer Slots */}
                    <div className="flex flex-wrap justify-center gap-3 relative z-10">
                         {activity.cipherSymbols?.map((_, i) => (
                             <div 
                                key={i} 
                                className={`h-14 min-w-[70px] px-4 bg-black/50 border-b-2 flex items-center justify-center font-bold text-xl text-white transition-all rounded-t-lg
                                    ${cipherInput[i] ? 'border-amber-500 bg-amber-900/20' : 'border-stone-600'}
                                `}
                             >
                                 {cipherInput[i] || ''}
                             </div>
                         ))}
                    </div>
                </div>
                
                {/* Word Bank */}
                <div className="flex flex-wrap justify-center gap-3">
                    {activity.cipherOptions?.map((word, i) => {
                         const usedCount = cipherInput.filter(w => w === word).length;
                         const totalCount = activity.cipherOptions?.filter(w => w === word).length || 0;
                         const isExhausted = usedCount >= totalCount;

                         return (
                            <button
                                key={i + word}
                                disabled={isExhausted || feedbackState === 'correct'}
                                onClick={() => {
                                    if (cipherInput.length < (activity.cipherCorrect?.length || 0)) {
                                        setCipherInput(prev => [...prev, word]);
                                        playSfx('https://codeskulptor-demos.commondatastorage.googleapis.com/pang/pop.mp3');
                                    }
                                }}
                                className={`px-5 py-3 rounded-lg font-bold border-b-4 transition-all active:scale-95 font-serif
                                    ${isExhausted 
                                        ? 'opacity-30 bg-slate-800 border-slate-700 cursor-default' 
                                        : 'bg-stone-700 border-stone-900 hover:border-amber-600 hover:bg-stone-600 text-stone-100'}
                                `}
                            >
                                {word}
                            </button>
                         )
                    })}
                </div>
                
                <button 
                    onClick={() => { setCipherInput([]); playSfx('https://codeskulptor-demos.commondatastorage.googleapis.com/assets/soundboard/explode.wav'); }}
                    className="mt-8 text-xs text-red-400 hover:text-red-300 uppercase tracking-widest font-bold opacity-60 hover:opacity-100 transition-opacity"
                >
                    Reset Stone
                </button>
            </div>
        );

      case ActivityType.DECISION:
        return (
            <div key={currentSlideIndex} className="w-full max-w-3xl mx-auto animate-fade-in-up">
                <div className="text-center mb-10">
                    <div className="w-24 h-24 mx-auto bg-slate-800 rounded-full flex items-center justify-center text-5xl border-4 border-amber-600 shadow-[0_0_30px_rgba(217,119,6,0.4)] mb-6 animate-pulse-slow">
                        👑
                    </div>
                    <h3 className="font-serif text-3xl md:text-4xl text-white mb-4 drop-shadow-md">{activity.question}</h3>
                    <p className="text-slate-400 italic text-lg max-w-lg mx-auto leading-relaxed">"{activity.narrative}"</p>
                    <div className="mt-6 py-2 px-6 bg-red-900/30 rounded-full border border-red-500/30 inline-block text-sm text-red-400 font-bold tracking-widest uppercase shadow-lg">
                        ⚠️ {activity.decisionContext}
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {activity.decisionChoices?.map((choice, i) => (
                        <button
                            key={i}
                            disabled={!!decisionFeedback}
                            onClick={() => {
                                setDecisionFeedback(choice.feedback);
                                if (choice.isCorrect) {
                                    setFeedbackState('correct');
                                    playSfx('https://codeskulptor-demos.commondatastorage.googleapis.com/pang/pop.mp3');
                                    triggerMascotReaction(true);
                                } else {
                                    playSfx('https://codeskulptor-demos.commondatastorage.googleapis.com/assets/soundboard/explode.wav');
                                    setFeedbackState('incorrect');
                                    triggerMascotReaction(false);
                                }
                            }}
                            className={`relative p-6 text-left rounded-2xl border-2 transition-all duration-300 overflow-hidden group
                                ${decisionFeedback 
                                    ? choice.isCorrect 
                                        ? 'bg-green-900/40 border-green-500 text-green-100 shadow-[0_0_30px_rgba(34,197,94,0.3)]'
                                        : 'bg-slate-900 border-slate-800 opacity-40 grayscale'
                                    : 'bg-slate-900 border-slate-700 hover:border-amber-500 hover:bg-slate-800 text-slate-200 hover:-translate-y-1 hover:shadow-xl'}
                            `}
                        >
                             <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <span className="font-serif font-bold text-xl mb-2 block group-hover:text-amber-500 transition-colors">{choice.text}</span>
                        </button>
                    ))}
                </div>

                {decisionFeedback && (
                    <div className="mt-8 p-8 bg-black/60 backdrop-blur-xl rounded-2xl border-l-4 border-amber-500 animate-fade-in-up shadow-2xl">
                        <h4 className="font-bold text-amber-500 mb-3 uppercase text-xs tracking-[0.2em]">Consequence</h4>
                        <p className="text-xl text-white font-serif leading-relaxed">
                            {decisionFeedback}
                        </p>
                    </div>
                )}
            </div>
        );

      default:
        return <div>Unsupported Activity</div>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center relative">
      {/* Background */}
      <div className={`absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-950 to-black z-0`} />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 z-0 pointer-events-none" />

      {/* Top Bar */}
      <div className="w-full p-6 flex items-center justify-between max-w-6xl z-10">
        <button onClick={onExit} className="text-slate-500 hover:text-white transition-colors font-bold tracking-widest text-sm flex items-center gap-2">
            <span>❮</span> EXIT
        </button>
        
        {/* Fancy Progress Bar */}
        <div className="flex-1 mx-8 h-2 bg-slate-800 rounded-full relative overflow-hidden shadow-inner border border-white/5">
            <div className={`absolute inset-0 bg-gradient-to-r ${theme.gradient} opacity-50 blur-sm`} />
            <div 
                className={`h-full ${theme.primary} transition-all duration-700 ease-out relative z-10 shadow-[0_0_10px_currentColor]`}
                style={{ width: `${progress}%` }} 
            >
                <div className="absolute right-0 top-0 bottom-0 w-1 bg-white opacity-50 shadow-[0_0_5px_white]" />
            </div>
        </div>

        <div className="flex gap-4 items-center">
            {activity.scholarNotes && (
                <button 
                    onClick={() => setShowScholarNotes(!showScholarNotes)}
                    className={`w-8 h-8 rounded-full border border-amber-500/30 flex items-center justify-center font-serif font-bold text-amber-500 hover:bg-amber-900/20 transition-colors ${showScholarNotes ? 'bg-amber-900/50' : ''}`}
                    title="Scholar's Notes"
                >
                    i
                </button>
            )}
            <div className="text-red-500 font-bold drop-shadow-md flex gap-1 text-xl">
                <span className="animate-pulse-slow">❤️</span>
                <span className="animate-pulse-slow" style={{ animationDelay: '0.2s'}}>❤️</span>
                <span className="animate-pulse-slow" style={{ animationDelay: '0.4s'}}>❤️</span>
            </div>
        </div>
      </div>

      {/* Main Game Area */}
      <div className="flex-1 w-full flex flex-col justify-center relative z-10 py-6 px-4">
        {renderContent()}

        {/* Scholar's Notes Overlay */}
        {showScholarNotes && activity.scholarNotes && (
             <div className="absolute top-4 right-4 max-w-xs bg-black/80 backdrop-blur-md p-6 rounded-2xl border-l-4 border-amber-500 shadow-2xl animate-fade-in-up z-30">
                 <h4 className="text-amber-500 font-bold uppercase text-xs tracking-widest mb-2">Scholar's Commentary</h4>
                 <p className="text-slate-300 text-sm italic font-serif leading-relaxed">
                     "{activity.scholarNotes}"
                 </p>
                 <button onClick={() => setShowScholarNotes(false)} className="absolute top-2 right-2 text-slate-500 hover:text-white">✕</button>
             </div>
        )}
      </div>

      {/* Bottom Action Bar */}
      <div className={`w-full p-6 md:p-8 border-t border-slate-800/50 bg-slate-900/80 backdrop-blur-md transition-colors duration-500 z-20 sticky bottom-0
         ${feedbackState === 'correct' ? 'bg-green-900/40 border-green-500/30' : ''}
         ${feedbackState === 'incorrect' ? 'bg-red-900/40 border-red-500/30' : ''}
      `}>
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          
          {feedbackState === 'idle' || feedbackState === 'incorrect' ? (
             <button 
               onClick={checkAnswer}
               className={`w-full font-bold font-serif tracking-widest text-lg py-5 rounded-2xl shadow-xl transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed border-b-4
                 ${feedbackState === 'incorrect' ? 'bg-red-600 border-red-800 text-white animate-shake' : 'bg-slate-100 hover:bg-white border-slate-300 text-slate-900'}
               `}
               disabled={
                   (!selectedOption && (activity.type === ActivityType.QUIZ || activity.type === ActivityType.PRIMARY_SOURCE)) ||
                   (activity.type === ActivityType.SORTING) || 
                   (activity.type === ActivityType.MATCHING) || 
                   (activity.type === ActivityType.MAP_CONQUEST && !showingMapQuiz && !mapFeedback) || 
                   (activity.type === ActivityType.MAP_CONQUEST && showingMapQuiz && !selectedOption) ||
                   (activity.type === ActivityType.CIPHER) ||
                   (activity.type === ActivityType.DECISION) ||
                   (activity.type === ActivityType.ARTIFACT_EXPLORATION && foundHotspots.length < (activity.artifactHotspots?.length || 0))
                }
             >
               {feedbackState === 'incorrect' ? 'TRY AGAIN' : activity.type === ActivityType.READING || activity.type === ActivityType.ARTIFACT_EXPLORATION ? 'CONTINUE JOURNEY' : 'CONFIRM SELECTION'}
             </button>
          ) : (
            <div className="flex w-full items-center justify-between animate-fade-in-up">
                <div className="flex flex-col">
                    <span className="font-serif font-bold text-2xl text-green-400 drop-shadow-[0_0_10px_rgba(74,222,128,0.5)]">
                        VICTORY
                    </span>
                    {activity.backgroundInfo && (
                        <span className="text-sm text-slate-300 mt-1 max-w-[200px] md:max-w-xl leading-relaxed opacity-80">{activity.backgroundInfo}</span>
                    )}
                </div>
                <button 
                    onClick={handleNext}
                    className="px-10 py-4 rounded-2xl font-bold font-serif text-slate-900 shadow-[0_0_20px_rgba(74,222,128,0.4)] bg-green-400 hover:bg-green-300 transition-colors ml-4 whitespace-nowrap animate-pop border-b-4 border-green-600"
                >
                    CONTINUE ➔
                </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Mascot Companion Widget (Bottom Left) */}
      {mascotVisible && mascotMessage && (
        <div className="fixed bottom-28 left-4 md:left-8 z-50 flex items-end gap-4 animate-pop max-w-[80vw] md:max-w-md pointer-events-none">
            {/* Portrait */}
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-[3px] border-amber-500 shadow-[0_0_20px_rgba(0,0,0,0.5)] overflow-hidden flex-shrink-0 bg-slate-900 relative">
                 <img src={theme.mascotImage || theme.symbolUrl} className="w-full h-full object-cover" alt="Mascot" />
                 <div className="absolute inset-0 shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]"></div>
            </div>

            {/* Speech Bubble */}
            <div className="bg-slate-900/95 backdrop-blur-xl border border-white/20 p-4 rounded-2xl rounded-bl-none shadow-2xl relative mb-8 animate-fade-in-up">
                <h4 className="text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-1">
                  {theme.mascot}
                </h4>
                <p className="text-sm text-slate-200 font-serif leading-relaxed italic">
                    "{mascotMessage}"
                </p>
            </div>
        </div>
      )}

    </div>
  );
};

export default LessonView;