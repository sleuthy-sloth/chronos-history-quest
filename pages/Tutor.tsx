import React, { useState, useRef, useEffect } from 'react';
import { connectLiveTutor } from '../services/geminiService';

const Tutor: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [status, setStatus] = useState<'idle' | 'connecting' | 'live'>('idle');
  const [volume, setVolume] = useState(0); 
  
  const outputCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  
  const nextStartTimeRef = useRef<number>(0);
  const controllerRef = useRef<{ disconnect: () => void } | null>(null);

  useEffect(() => {
      // Cleanup on unmount
      return () => {
          stopSession();
      };
  }, []);

  // Real-time Visualizer Loop
  const updateVisualizer = () => {
      if (analyserRef.current && status === 'live') {
          const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
          analyserRef.current.getByteFrequencyData(dataArray);
          
          // Calculate average volume from frequency data
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
              sum += dataArray[i];
          }
          const average = sum / dataArray.length;
          
          // Smooth the transition
          setVolume(prev => prev + (average - prev) * 0.2);
          
          animationFrameRef.current = requestAnimationFrame(updateVisualizer);
      } else if (status === 'live') {
           animationFrameRef.current = requestAnimationFrame(updateVisualizer);
      }
  };

  useEffect(() => {
      if (status === 'live') {
          updateVisualizer();
      } else {
          if (animationFrameRef.current) {
              cancelAnimationFrame(animationFrameRef.current);
          }
          setVolume(0);
      }
  }, [status]);

  const handleConnect = async () => {
    setStatus('connecting');
    try {
        // Create new context
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioContextClass({ sampleRate: 24000 });
        outputCtxRef.current = ctx;
        
        // Setup Analyser
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 256;
        analyserRef.current = analyser;
        
        nextStartTimeRef.current = ctx.currentTime;
        
        const controller = await connectLiveTutor(
            (audioBuffer) => {
                // Check if context is valid/open before using
                if (!outputCtxRef.current || outputCtxRef.current.state === 'closed') return;
                
                const ctx = outputCtxRef.current;
                const src = ctx.createBufferSource();
                src.buffer = audioBuffer;
                
                // Connect through analyser to destination
                src.connect(analyserRef.current!);
                analyserRef.current!.connect(ctx.destination);
                
                const now = ctx.currentTime;
                // Schedule next chunk
                const startTime = Math.max(now, nextStartTimeRef.current);
                src.start(startTime);
                
                nextStartTimeRef.current = startTime + audioBuffer.duration;
            },
            () => {
                // On Close Callback from Service
                setIsConnected(false);
                setStatus('idle');
                controllerRef.current = null;
                // We should also close our audio context here if the service closed the connection
                if (outputCtxRef.current) {
                    outputCtxRef.current.close();
                    outputCtxRef.current = null;
                }
            }
        );

        controllerRef.current = controller;
        setIsConnected(true);
        setStatus('live');
    } catch (e) {
        console.error(e);
        setStatus('idle');
        alert("Microphone access required or API Key invalid.");
        
        // Cleanup if failed
        if (outputCtxRef.current) {
            outputCtxRef.current.close();
            outputCtxRef.current = null;
        }
    }
  };

  const stopSession = () => {
      if (controllerRef.current) {
          controllerRef.current.disconnect();
          controllerRef.current = null;
      }
      
      // Close local audio context to prevent leaks
      if (outputCtxRef.current) {
          outputCtxRef.current.close();
          outputCtxRef.current = null;
      }
      
      if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
      }

      setIsConnected(false);
      setStatus('idle');
      setVolume(0);
  };

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-950 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1566191767850-932d561286c4?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20" />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-transparent to-slate-950" />

      <div className="z-10 flex flex-col items-center gap-8">
        <div className="relative">
            {/* The Orb */}
            {/* Map volume (0-128 typically) to scale (1 - 2) */}
            <div className={`w-48 h-48 rounded-full blur-xl transition-transform duration-75 ease-linear
                ${status === 'live' ? 'bg-cyan-500' : 'bg-slate-700'}
            `} style={{ transform: `scale(${1 + (volume / 80)})`}} />
            
            <div className={`absolute top-0 left-0 w-48 h-48 rounded-full border-4 flex items-center justify-center bg-slate-900/80 backdrop-blur-md transition-colors duration-500
                ${status === 'live' ? 'border-cyan-400 shadow-[0_0_50px_rgba(34,211,238,0.4)]' : 'border-slate-600'}
            `}>
                <span className="text-6xl">{status === 'live' ? '🎙️' : '😶'}</span>
            </div>
        </div>

        <div className="text-center max-w-md p-4">
            <h2 className="font-serif text-3xl text-white mb-2">The Oracle</h2>
            <p className="text-slate-400">Speak to Chronos directly. Ask about the strategies of Caesar, the fall of Troy, or the laws of Hammurabi.</p>
        </div>

        {!isConnected ? (
            <button 
                onClick={handleConnect}
                disabled={status === 'connecting'}
                className="px-8 py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-full transition-all transform hover:scale-105 shadow-lg flex items-center gap-2"
            >
                {status === 'connecting' ? 'Summoning...' : 'Begin Session'}
            </button>
        ) : (
            <button 
                onClick={stopSession}
                className="px-8 py-4 bg-red-600 hover:bg-red-500 text-white font-bold rounded-full transition-all shadow-lg"
            >
                End Communion
            </button>
        )}
      </div>
    </div>
  );
};

export default Tutor;