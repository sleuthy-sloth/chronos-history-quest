
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
  narrative?: string; // For reading cards
  options?: string[]; // For quiz
  correctAnswer?: string | string[];
  pairs?: { term: string; definition: string }[]; // For matching
  items?: string[]; // For sorting (scrambled)
  correctOrder?: string[]; // For sorting (correct sequence)
  mapTarget?: { x: number; y: number; label: string }; // For map (percentages)
  imageKeyword?: string;
  customImage?: string; // Direct URL override
  imageCredit?: string; // Source attribution
  backgroundInfo?: string; // Pop up after answer
  scholarNotes?: string; // Optional deep dive context
  mascotGuidance?: string; // Specific hint/flavor text from the mascot

  // Map Quiz (Follow up question after finding location)
  mapQuiz?: {
    question: string;
    options: string[];
    correctAnswer: string;
  };

  // Cipher Game Fields
  cipherSymbols?: string[]; // E.g. ["𓀀", "𓁈"]
  cipherCorrect?: string[]; // Correct sequence of words
  cipherOptions?: string[]; // Pool of words to choose from

  // Decision/Roleplay Game Fields
  decisionContext?: string; // Scenario description
  decisionChoices?: {
    text: string;
    isCorrect: boolean;
    feedback: string; // Outcome text
  }[];

  // Artifact Exploration Fields
  artifactHotspots?: {
    id: string;
    x: number; // Percentage
    y: number; // Percentage
    label: string;
    description: string;
  }[];

  // Primary Source Fields
  sourceText?: string; // The actual historical text
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
  mapCoordinates?: { x: number; y: number }; // Percentage 0-100 on the Civ Map
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
  unlockCondition?: string; // Text description
  cost?: number; // Gems
  requiredLevel?: number;
}

export interface UserState {
  uid: string;
  displayName: string;
  email: string | null;
  photoURL: string | null;
  
  // Progression Fields
  xp: number;
  gems: number;
  streak: number; // Consecutive days logged in
  lastLoginDate: string; // ISO Date string
  level: number;
  
  completedLessons: string[];
  unlockedAchievements: string[];
  currentCiv: CivType;
  hasOnboarded: boolean;
  leagueId?: string;
  settings: UserSettings;

  // Profile & Social
  avatarId: string;
  unlockedAvatars: string[];
  friends: string[]; // List of UIDs
}

export interface LeagueMember {
  uid: string;
  displayName: string;
  photoURL: string;
  xp: number; // Weekly XP
  rank: number;
  civ: CivType;
  isBot?: boolean;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export enum LeagueTier {
  BRONZE = 'BRONZE',
  SILVER = 'SILVER',
  GOLD = 'GOLD',
  PLATINUM = 'PLATINUM',
  DIAMOND = 'DIAMOND',
  CHRONOS = 'CHRONOS'
}

export interface MascotIntel {
  fact: string;
  mood: 'witty' | 'dark' | 'fact' | 'encouraging';
}
