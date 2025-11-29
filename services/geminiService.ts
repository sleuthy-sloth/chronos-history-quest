
import { GoogleGenAI, LiveServerMessage, Modality, Type } from "@google/genai";
import { Lesson, ActivityType, CivType } from "../types";

// Secure API Key access via process.env
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

// AudioContext Singleton
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

export const generateLessonContent = async (skeletonLesson: Lesson): Promise<Lesson | null> => {
  const ai = getAI();
  const civName = skeletonLesson.civ;
  const topic = skeletonLesson.topic;
  
  const prompt = `
    You are a historian designing a lesson for a "Hardcore History" style learning app.
    Topic: "${topic}" for the Civilization: "${civName}".
    
    Generate a JSON object representing a lesson with EXACTLY 3 activities.
    
    Activity 1: Type "READING". A dramatic, narrative paragraph (80-120 words) teaching the core concept. Include 'mascotGuidance' (a short, witty or profound comment from the civ's leader).
    Activity 2: Type "QUIZ". A multiple choice question with 4 options.
    Activity 3: Type "SORTING" or "MATCHING". 
       - If SORTING: Provide 4 items in chronological or logical order.
       - If MATCHING: Provide 3 pairs of terms and definitions.
    
    The JSON structure must match the schema exactly.
    IMPORTANT: For 'imageKeyword', provide a specific, visual description of a historical artifact or scene suitable for generating an image (e.g. "Roman legionary throwing pilum", "Egyptian workers placing pyramid stone").
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
                  imageKeyword: { type: Type.STRING },
                  mascotGuidance: { type: Type.STRING },
                  scholarNotes: { type: Type.STRING },
                  pairs: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        term: { type: Type.STRING },
                        definition: { type: Type.STRING }
                      }
                    }
                  },
                  items: { type: Type.ARRAY, items: { type: Type.STRING } },
                  correctOrder: { type: Type.ARRAY, items: { type: Type.STRING } }
                }
              }
            }
          }
        }
      }
    });

    const data = JSON.parse(response.text || "{}");
    
    // Enrich with generated images and IDs
    const enrichedActivities = data.activities.map((act: any, idx: number) => {
        const keyword = act.imageKeyword || topic || "history";
        // Use Pollinations for reliable AI art based on the prompt
        const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(keyword + ", historical, cinematic lighting, 8k, museum style")}?width=800&height=600&nologo=true&seed=${Math.random()}`;
        
        return {
            ...act,
            id: `${skeletonLesson.id}-${idx}`,
            customImage: imageUrl,
            // Ensure type is valid enum and Uppercase
            type: act.type ? act.type.toUpperCase() as ActivityType : ActivityType.READING
        };
    });

    return {
        ...skeletonLesson,
        title: data.title || skeletonLesson.title,
        description: data.description || skeletonLesson.description,
        activities: enrichedActivities,
        isSkeleton: false // Mark as fully generated
    };

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
    return source;
  } catch (e) {
    console.error("TTS Failed, falling back", e);
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
  const decodingAudioContext = getAudioContext(24000);
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  let currentSession: any = null;

  const sessionPromise = ai.live.connect({
    model: 'gemini-2.5-flash-native-audio-preview-09-2025',
    config: {
      responseModalities: [Modality.AUDIO],
      systemInstruction: "You are a wise, Socratic history tutor named Chronos. Be dramatic, authoritative, but encouraging.",
      speechConfig: {
        voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Fenrir' } }
      }
    },
    callbacks: {
      onopen: () => {
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
      onclose: () => { cleanup(); onClose(); },
      onerror: (e) => { console.error(e); cleanup(); onClose(); }
    }
  });

  const cleanup = () => {
     try {
         stream.getTracks().forEach(t => t.stop());
         inputAudioContext.close();
     } catch (e) { }
  };

  return { disconnect: () => cleanup() };
};

// --- Audio Utils ---
function createBlob(data: Float32Array): { data: string; mimeType: string } {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) int16[i] = data[i] * 32768;
  return { data: encode(new Uint8Array(int16.buffer)), mimeType: 'audio/pcm;rate=16000' };
}
function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) bytes[i] = binaryString.charCodeAt(i);
  return bytes;
}
async function decodeAudioData(data: Uint8Array, ctx: AudioContext): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length;
  const buffer = ctx.createBuffer(1, frameCount, 24000);
  const channelData = buffer.getChannelData(0);
  for (let i = 0; i < frameCount; i++) channelData[i] = dataInt16[i] / 32768.0;
  return buffer;
}
