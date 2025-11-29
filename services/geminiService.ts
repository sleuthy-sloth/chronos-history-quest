

import { GoogleGenAI, LiveServerMessage, Modality, Type } from "@google/genai";

// Secure API Key access using process.env.API_KEY as per guidelines.
// The 'define' block in vite.config.ts ensures this is replaced with the string literal at build time.
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

// AudioContext Singleton to avoid browser limits
let sharedAudioContext: AudioContext | null = null;
const getAudioContext = (sampleRate = 24000) => {
    if (!sharedAudioContext) {
        sharedAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate });
    } else if (sharedAudioContext.state === 'suspended') {
        sharedAudioContext.resume();
    }
    return sharedAudioContext;
};

// --- Standard Content Generation ---

export const generateLessonContent = async (topic: string, civ: string) => {
  const ai = getAI();
  const prompt = `
    Create a historical lesson about "${topic}" for the civilization "${civ}".
    It should be formatted as a JSON object with a title, description, and an array of 3 activities.
    Activity 1: Type READING. A dramatic narrative paragraph (max 100 words).
    Activity 2: Type QUIZ. A multiple choice question with 4 options and 1 correct answer.
    Activity 3: Type MATCHING. 3 pairs of terms and definitions.
    
    Format:
    {
      "title": "string",
      "description": "string",
      "activities": [ ... ]
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            activities: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  type: { type: Type.STRING },
                  question: { type: Type.STRING },
                  narrative: { type: Type.STRING },
                  options: { type: Type.ARRAY, items: { type: Type.STRING } },
                  correctAnswer: { type: Type.STRING },
                  pairs: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        term: { type: Type.STRING },
                        definition: { type: Type.STRING }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Gemini generation failed", error);
    return null;
  }
};

// --- TTS Service ---

export const playTTS = async (text: string, voiceName: string = 'Kore') => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) throw new Error("No audio data");

    const audioCtx = getAudioContext();
    const audioBuffer = await decodeAudioData(decode(base64Audio), audioCtx);
    
    const source = audioCtx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioCtx.destination);
    source.start();
    return source; // Return source to allow stopping
  } catch (e) {
    console.error("TTS Failed, falling back", e);
    // Fallback
    const u = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(u);
    return null;
  }
};

// --- Live API (Real-time Tutor) ---

export const connectLiveTutor = async (
  onAudioData: (buffer: AudioBuffer) => void,
  onClose: () => void
) => {
  const ai = getAI();
  const inputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
  
  // Use shared context for playback to be efficient
  const decodingAudioContext = getAudioContext(24000);
  
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  
  let currentSession: any = null;

  const sessionPromise = ai.live.connect({
    model: 'gemini-2.5-flash-native-audio-preview-09-2025',
    config: {
      responseModalities: [Modality.AUDIO],
      systemInstruction: "You are a wise, Socratic history tutor named Chronos. You are teaching a student about historical events. Be dramatic, authoritative, but encouraging. Keep responses concise.",
      speechConfig: {
        voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Fenrir' } }
      }
    },
    callbacks: {
      onopen: () => {
        console.log("Live Tutor Connected");
        // Stream audio from the microphone to the model.
        const source = inputAudioContext.createMediaStreamSource(stream);
        const scriptProcessor = inputAudioContext.createScriptProcessor(4096, 1, 1);
        
        scriptProcessor.onaudioprocess = (e) => {
          const inputData = e.inputBuffer.getChannelData(0);
          const pcmBlob = createBlob(inputData);
          sessionPromise.then(session => {
            currentSession = session;
            session.sendRealtimeInput({ media: pcmBlob });
          });
        };
        
        source.connect(scriptProcessor);
        scriptProcessor.connect(inputAudioContext.destination);
      },
      onmessage: async (msg: LiveServerMessage) => {
        const base64Audio = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
        if (base64Audio) {
           const audioBuffer = await decodeAudioData(decode(base64Audio), decodingAudioContext);
           onAudioData(audioBuffer);
        }
      },
      onclose: () => {
        console.log("Live Tutor Disconnected");
        cleanup();
        onClose();
      },
      onerror: (e) => {
        console.error("Live Tutor Error", e);
        cleanup();
        onClose();
      }
    }
  });

  const cleanup = () => {
     try {
         stream.getTracks().forEach(t => t.stop());
         inputAudioContext.close();
         // Don't close decoding context as it might be shared, just suspend if needed or leave active
     } catch (e) {
         console.warn("Cleanup error", e);
     }
  };

  // Return a controller
  return {
      disconnect: () => {
          cleanup();
          // Attempt to close session if SDK exposes it
          // sessionPromise.then(s => s.close && s.close()); 
          // Since SDK close method might vary, cutting the stream is the effective disconnect.
      }
  };
};


// --- Audio Utils ---

function createBlob(data: Float32Array): { data: string; mimeType: string } {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}

function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
): Promise<AudioBuffer> {
  const sampleRate = 24000;
  const numChannels = 1;
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}
