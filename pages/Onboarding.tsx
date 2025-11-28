
import React, { useState, useRef, useEffect } from 'react';
import { CivType } from '../types';
import { CIV_THEMES, CIV_PROLOGUES } from '../constants';
import { playTTS } from '../services/geminiService';

interface Props {
  onSelectCiv: (civ: CivType, name?: string) => void;
}

const Onboarding: React.FC<Props> = ({ onSelectCiv }) => {
  const [previewCiv, setPreviewCiv] = useState<CivType | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);

  const handleStopAudio = () => {
    if (audioSourceRef.current) {
        try {
            audioSourceRef.current.stop();
        } catch(e) { /* ignore */ }
        audioSourceRef.current = null;
    }
    setIsPlaying(false);
  };

  const handlePlayPrologue = async (civ: CivType) => {
    if (isPlaying) {
        handleStopAudio();
        return;
    }

    setIsPlaying(true);
    const prologue = CIV_PROLOGUES[civ];
    const text = `The Archives present: ${civ}. ${prologue.quote} - ${prologue.author}`;
    
    // Using Fenrir for that deep, historical narrator vibe
    const source = await playTTS(text, prologue.voice);
    if (source) {
        audioSourceRef.current = source;
        source.onended = () => setIsPlaying(false);
    } else {
        setIsPlaying(false);
    }
  };

  useEffect(() => {
    return () => handleStopAudio();
  }, []);

  if (previewCiv) {
    const theme = CIV_THEMES[previewCiv];
    const prologue = CIV_PROLOGUES[previewCiv];

    return (
        <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col items-center justify-center p-6 transition-all duration-500 overflow-y-auto">
             {/* Background Atmosphere */}
             <div className="absolute inset-0">
                 <img src={theme.coverImage} className="w-full h-full object-cover opacity-20 filter blur-sm scale-110" alt="background" />
                 <div className={`absolute inset-0 bg-gradient-to-t ${theme.gradient} opacity-90`} />
             </div>
             
             <div className="relative z-10 max-w-2xl w-full text-center flex flex-col gap-8 py-12">
                <div className="animate-fade-in-up flex flex-col items-center">
                    <div className="w-48 h-48 mb-6 relative animate-float">
                        <img 
                            src={theme.symbolUrl} 
                            alt={previewCiv} 
                            className="w-full h-full object-contain drop-shadow-[0_0_30px_rgba(255,255,255,0.3)] filter contrast-125"
                        />
                         <div className={`absolute inset-0 bg-gradient-to-t ${theme.gradient} opacity-20 blur-xl -z-10`} />
                    </div>
                    
                    <h2 className={`font-serif text-6xl font-bold text-white tracking-widest mb-2 drop-shadow-md`}>{previewCiv}</h2>
                    <div className={`h-1 w-32 bg-gradient-to-r from-transparent via-white to-transparent mx-auto opacity-50 mb-4 rounded-full`} />
                </div>

                <div className="relative p-10 bg-black/40 rounded-xl border border-white/10 backdrop-blur-md shadow-2xl animate-fade-in-up transform hover:scale-[1.02] transition-transform duration-500" style={{ animationDelay: '0.1s' }}>
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-white/20 rounded-tl-lg" />
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-white/20 rounded-br-lg" />
                    
                    <span className="absolute top-6 left-6 text-5xl text-white/10 font-serif">“</span>
                    <p className="font-serif text-2xl md:text-3xl text-slate-200 leading-relaxed italic relative z-10 px-4">
                        {prologue.quote}
                    </p>
                    <span className="absolute bottom-6 right-6 text-5xl text-white/10 font-serif">”</span>
                    <p className={`mt-8 text-right font-sans font-bold uppercase text-sm tracking-widest ${theme.secondary}`}>
                        — {prologue.author}
                    </p>
                    
                    <button 
                        onClick={() => handlePlayPrologue(previewCiv)}
                        className={`
                            mt-8 mx-auto px-6 py-2 rounded-full font-bold flex items-center gap-2 transition-all text-sm border
                            ${isPlaying ? 'bg-amber-600/20 text-amber-500 border-amber-500/50' : 'bg-white/5 text-slate-400 hover:bg-white/10 border-white/10 hover:border-white/30'}
                        `}
                    >
                        <span>{isPlaying ? '◼ Stop Narration' : '▶ Listen to Prologue'}</span>
                    </button>
                </div>

                <div className="flex flex-col gap-4 justify-center items-center animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                    <button 
                        onClick={() => onSelectCiv(previewCiv)}
                        className={`
                            w-full md:w-auto px-16 py-5 rounded-full font-bold text-lg tracking-[0.2em] uppercase font-serif
                            shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:shadow-[0_0_50px_rgba(255,255,255,0.3)] 
                            transition-all bg-white text-slate-900 hover:scale-105 active:scale-95
                        `}
                    >
                        Enter Timeline
                    </button>
                    
                    <button 
                        onClick={() => {
                            handleStopAudio();
                            setPreviewCiv(null);
                        }}
                        className="text-slate-500 hover:text-white text-xs uppercase tracking-widest border-b border-transparent hover:border-white transition-all pb-1 mt-4"
                    >
                        Return to Gallery
                    </button>
                </div>
             </div>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black z-0" />
      
      <div className="text-center max-w-4xl mb-12 relative z-10 animate-fade-in-up">
        <h1 className="font-serif text-5xl md:text-8xl text-transparent bg-clip-text bg-gradient-to-b from-amber-200 to-amber-600 font-bold mb-4 tracking-widest drop-shadow-sm">CHRONOS</h1>
        <div className="h-px w-32 bg-amber-500/50 mx-auto mb-6" />
        <p className="text-slate-400 text-lg md:text-xl font-light tracking-wide font-serif italic">Select an era to begin your journey</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full max-w-7xl h-[60vh] relative z-10 px-4">
        {Object.entries(CIV_THEMES).map(([civKey, theme], idx) => {
            const civ = civKey as CivType;
            return (
                <button
                    key={civ}
                    onClick={() => setPreviewCiv(civ)}
                    className={`
                        relative group overflow-hidden rounded-xl border border-slate-800 
                        hover:border-white/40 transition-all duration-500 cursor-pointer
                        animate-fade-in-up md:hover:flex-[2] flex-1 flex flex-col justify-end
                    `}
                    style={{ animationDelay: `${idx * 0.1}s` }}
                >
                    {/* Background Image */}
                    <img 
                        src={theme.coverImage} 
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 filter brightness-[0.6] group-hover:brightness-[0.8] grayscale group-hover:grayscale-0"
                        alt={civ}
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${theme.gradient} opacity-60 group-hover:opacity-40 transition-opacity duration-500`} />
                    
                    {/* Content */}
                    <div className="relative z-10 p-6 text-left transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                        <div className="mb-4 opacity-80 group-hover:opacity-100 transition-opacity transform group-hover:-translate-y-2 duration-500">
                             {/* Symbol Image */}
                             <div className="w-16 h-16 relative">
                                <img src={theme.symbolUrl} className="w-full h-full object-contain drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]" alt="icon" />
                             </div>
                        </div>
                        <h3 className={`font-serif text-2xl md:text-3xl font-bold text-white mb-2 tracking-wide border-l-4 ${theme.accent.replace('border-', 'border-')} pl-3`}>{civ}</h3>
                        <p className="text-slate-300 text-xs md:text-sm leading-relaxed opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100 max-h-0 group-hover:max-h-24 overflow-hidden">
                            {theme.description}
                        </p>
                    </div>
                </button>
            )
        })}
      </div>
      
      <div className="mt-8 text-slate-700 text-[10px] uppercase tracking-[0.3em] font-bold relative z-10">
        Est. 2024 • The Museum of Humanity
      </div>
    </div>
  );
};

export default Onboarding;
