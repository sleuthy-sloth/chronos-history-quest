
export enum CivType {
  ROME = 'ROME',
  EGYPT = 'EGYPT',
  BYZANTIUM = 'BYZANTIUM',
  PERSIA = 'PERSIA'
}

export enum ActivityType {
  READING = 'READING',
  QUIZ = 'QUIZ',
  MAP_CONQUEST = 'MAP_CONQUEST',
  MATCHING = 'MATCHING',
  SORTING = 'SORTING',
  CIPHER = 'CIPHER',
  DECISION = 'DECISION',
  ARTIFACT_EXPLORATION = 'ARTIFACT_EXPLORATION',
  PRIMARY_SOURCE = 'PRIMARY_SOURCE'
}

export interface Activity {
  id: string;
  type: ActivityType;
  question: string;
  narrative?: string;
  options?: string[];
  correctAnswer?: string | string[];
  pairs?: { term: string; definition: string }[];
  items?: string[];
  correctOrder?: string[];
  mapTarget?: { x: number; y: number; label: string };
  imageKeyword?: string;
  customImage?: string;
  imageCredit?: string;
  backgroundInfo?: string;
  scholarNotes?: string;
  mascotGuidance?: string;

  mapQuiz?: {
    question: string;
    options: string[];
    correctAnswer: string;
  };

  cipherSymbols?: string[];
  cipherCorrect?: string[];
  cipherOptions?: string[];

  decisionContext?: string;
  decisionChoices?: {
    text: string;
    isCorrect: boolean;
    feedback: string;
  }[];

  artifactHotspots?: {
    id: string;
    x: number;
    y: number;
    label: string;
    description: string;
  }[];

  sourceText?: string;
  sourceAuthor?: string;
  sourceDate?: string;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  civ: CivType;
  activities: Activity[];
  xpReward: number;
  locked: boolean;
  completed: boolean;
  mapCoordinates?: { x: number; y: number };
  
  // New fields for AI Generation Framework
  isSkeleton?: boolean; // If true, content needs to be generated on the fly
  topic?: string;       // The prompt for the AI to generate content
  unitId?: number;      // For grouping into the 10-unit structure
  unitTitle?: string;
}

export interface UserSettings {
  musicVolume: number;
  sfxVolume: number;
  theme: 'light' | 'dark' | 'system';
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  condition: (user: UserState) => boolean;
}

export interface Avatar {
  id: string;
  name: string;
  url: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  description: string;
  unlockCondition?: string;
  cost?: number;
  requiredLevel?: number;
}

export interface UserState {
  uid: string;
  displayName: string;
  email: string | null;
  photoURL: string | null;
  
  xp: number;
  gems: number;
  streak: number;
  lastLoginDate: string;
  level: number;
  
  completedLessons: string[];
  unlockedAchievements: string[];
  currentCiv: CivType;
  hasOnboarded: boolean;
  leagueId?: string;
  settings: UserSettings;

  avatarId: string;
  unlockedAvatars: string[];
  friends: string[];

  // Cache for AI generated lessons so we don't regenerate them
  generatedLessons: Record<string, Lesson>; 
}

export interface LeagueMember {
  uid: string;
  displayName: string;
  photoURL: string;
  xp: number;
  rank: number;
  civ: CivType;
  isBot?: boolean;
}

export interface MascotIntel {
  fact: string;
  mood: 'witty' | 'dark' | 'fact' | 'encouraging';
}
