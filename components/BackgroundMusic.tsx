import React, { useEffect, useRef, useState } from 'react';
import { CIV_MUSIC } from '../constants';
import { CivType } from '../types';

interface Props {
  volume: number;
  currentCiv?: CivType;
}

const BackgroundMusic: React.FC<Props> = ({ volume, currentCiv = CivType.ROME }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);
  const currentTrack = useRef(CIV_MUSIC[currentCiv]);

  useEffect(() => {
    // Initial Setup
    audioRef.current = new Audio(currentTrack.current);
    audioRef.current.loop = true;
    
    const handleInteraction = () => {
        if (!userInteracted) {
            setUserInteracted(true);
        }
    };
    window.addEventListener('click', handleInteraction);
    return () => {
        window.removeEventListener('click', handleInteraction);
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
        }
    };
  }, []);

  // Handle Track Switching based on Civ
  useEffect(() => {
      if (!audioRef.current || !CIV_MUSIC[currentCiv]) return;
      
      const newTrack = CIV_MUSIC[currentCiv];
      if (newTrack !== currentTrack.current) {
          // Crossfade simulation: Fade out, switch, fade in
          const oldAudio = audioRef.current;
          
          // Switch track
          currentTrack.current = newTrack;
          audioRef.current.src = newTrack;
          
          if (isPlaying && userInteracted) {
             audioRef.current.play().catch(console.warn);
          }
      }
  }, [currentCiv]);

  // Effect to handle volume and play state changes
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = volume;
      
      if (volume > 0 && !isPlaying && userInteracted) {
         const playPromise = audio.play();
         if (playPromise !== undefined) {
             playPromise.then(() => setIsPlaying(true)).catch(e => console.log("Autoplay blocked", e));
         }
      } else if (volume === 0 && isPlaying) {
          audio.pause();
          setIsPlaying(false);
      }
    }
  }, [volume, userInteracted, isPlaying]);

  return (
    <div className="fixed bottom-20 left-4 md:bottom-4 md:left-4 z-50">
      <button 
        onClick={() => {
            if(audioRef.current?.paused && volume > 0) {
                audioRef.current.play();
                setIsPlaying(true);
            } else {
                audioRef.current?.pause();
                setIsPlaying(false);
            }
        }}
        className="p-2 bg-black/50 rounded-full hover:bg-black/70 text-white text-xs backdrop-blur-sm transition-all border border-white/10"
        style={{ opacity: volume === 0 ? 0.5 : 1 }}
      >
        {isPlaying ? '🔊' : '🔇'}
      </button>
    </div>
  );
};

export default BackgroundMusic;