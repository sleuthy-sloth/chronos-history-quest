
import { ActivityType, CivType, Lesson, UserState, LeagueTier, LeagueMember, Achievement, Avatar, MascotIntel } from './types';

export const INITIAL_USER_STATE: UserState = {
  uid: '',
  displayName: '',
  email: '',
  photoURL: null,
  xp: 0,
  gems: 100,
  streak: 0,
  lastLoginDate: new Date().toISOString(),
  level: 1,
  completedLessons: [],
  unlockedAchievements: [],
  currentCiv: CivType.ROME,
  hasOnboarded: false,
  settings: {
    musicVolume: 0.3,
    sfxVolume: 0.5,
    theme: 'system'
  },
  avatarId: 'recruit_default',
  unlockedAvatars: ['recruit_default', 'scholar_default'],
  friends: []
};

// Fallback generator
export const getImage = (keyword: string) => {
  const prompt = encodeURIComponent(`historical museum artifact photo, high quality, ${keyword}`);
  return `https://image.pollinations.ai/prompt/${prompt}?width=800&height=600&nologo=true&seed=${Math.random()}`;
};

export const CIV_MUSIC = {
  [CivType.ROME]: "https://cdn.pixabay.com/audio/2022/10/28/audio_650d32b554.mp3",
  [CivType.EGYPT]: "https://cdn.pixabay.com/audio/2023/05/23/audio_a1e5296048.mp3",
  [CivType.BYZANTIUM]: "https://cdn.pixabay.com/audio/2022/08/02/audio_884fe92c21.mp3",
  [CivType.PERSIA]: "https://cdn.pixabay.com/audio/2024/09/11/audio_4024847e30.mp3"
};

export const CIV_THEMES = {
  [CivType.ROME]: {
    primary: 'bg-red-600', 
    dark: 'bg-red-800',
    border: 'border-red-800',
    text: 'text-red-700',
    bgLight: 'bg-red-50',
    gradient: 'from-red-600 to-red-700',
    accent: 'border-red-600',
    secondary: 'text-red-500',
    icon: '🏛️',
    symbolUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Vexilloid_of_the_Roman_Empire.svg/512px-Vexilloid_of_the_Roman_Empire.svg.png',
    coverImage: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=800&auto=format&fit=crop',
    mascot: 'Augustus',
    mascotImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Augustus_Bevagna_Glyptothek_Munich_317.jpg/640px-Augustus_Bevagna_Glyptothek_Munich_317.jpg',
    description: "The Rise of Rome",
    leagueTitle: "Legion League",
    mapImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Roman_Empire_Trajan_117AD.png/800px-Roman_Empire_Trajan_117AD.png",
    props: ['🏛️', '🛡️']
  },
  [CivType.EGYPT]: {
    primary: 'bg-yellow-500',
    dark: 'bg-yellow-700',
    border: 'border-yellow-700',
    text: 'text-yellow-800',
    bgLight: 'bg-yellow-50',
    gradient: 'from-yellow-400 to-yellow-500',
    accent: 'border-yellow-500',
    secondary: 'text-yellow-600',
    icon: '👁️',
    symbolUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Wedjat_%28Udjat%29_eye_amulet_MET_DP115664.jpg/800px-Wedjat_%28Udjat%29_eye_amulet_MET_DP115664.jpg',
    coverImage: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?q=80&w=800&auto=format&fit=crop',
    mascot: 'Tutankhamen',
    mascotImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Tutanchamun_Maske.jpg/640px-Tutanchamun_Maske.jpg',
    description: "Sands of the Nile",
    leagueTitle: "Pharaoh League",
    mapImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Ancient_Egypt_map-en.svg/800px-Ancient_Egypt_map-en.svg.png",
    props: ['🌴', '🏺']
  },
  [CivType.BYZANTIUM]: {
    primary: 'bg-purple-600',
    dark: 'bg-purple-800',
    border: 'border-purple-800',
    text: 'text-purple-700',
    bgLight: 'bg-purple-50',
    gradient: 'from-purple-600 to-purple-700',
    accent: 'border-purple-600',
    secondary: 'text-purple-500',
    icon: '⛪',
    symbolUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Chi_Rho.svg/800px-Chi_Rho.svg.png',
    coverImage: 'https://images.unsplash.com/photo-1596367407072-acf97105cb36?q=80&w=800&auto=format&fit=crop',
    mascot: 'Justinian',
    mascotImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Mosaic_of_Justinian_I_-_Basilica_San_Vitale_%28Ravenna%29.jpg/640px-Mosaic_of_Justinian_I_-_Basilica_San_Vitale_%28Ravenna%29.jpg',
    description: "The Golden City",
    leagueTitle: "Imperial League",
    mapImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Justinian555AD.png/800px-Justinian555AD.png",
    props: ['⛪', '📜']
  },
  [CivType.PERSIA]: {
    primary: 'bg-teal-600',
    dark: 'bg-teal-800',
    border: 'border-teal-800',
    text: 'text-teal-700',
    bgLight: 'bg-teal-50',
    gradient: 'from-teal-600 to-teal-700',
    accent: 'border-teal-600',
    secondary: 'text-teal-500',
    icon: '🦁',
    symbolUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Simurgh.svg/800px-Simurgh.svg.png',
    coverImage: 'https://images.unsplash.com/photo-1579975096649-e773152b04cb?q=80&w=800&auto=format&fit=crop',
    mascot: 'Cyrus',
    mascotImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Cyrus_Cylinder_front.jpg/640px-Cyrus_Cylinder_front.jpg',
    description: "Empire of Kings",
    leagueTitle: "Immortal League",
    mapImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Achaemenid_Empire_at_its_greatest_extent.png/800px-Achaemenid_Empire_at_its_greatest_extent.png",
    props: ['🏹', '🐎']
  }
};

export const CIV_PROLOGUES = {
  [CivType.ROME]: { quote: "I found Rome a city of bricks and left it a city of marble.", author: "Augustus", voice: "Fenrir" },
  [CivType.EGYPT]: { quote: "My name is Ozymandias, King of Kings.", author: "Shelley", voice: "Fenrir" },
  [CivType.BYZANTIUM]: { quote: "Solomon, I have outdone thee!", author: "Justinian", voice: "Fenrir" },
  [CivType.PERSIA]: { quote: "I am Cyrus, King of the Universe.", author: "Cyrus Cylinder", voice: "Fenrir" }
};

export const MASCOT_INTEL: Record<CivType, MascotIntel[]> = {
  [CivType.ROME]: [
    { fact: "Rome wasn't built in a day!", mood: 'encouraging' },
    { fact: "Romans used urine to whiten teeth. Gross.", mood: 'witty' },
    { fact: "The Colosseum held 50,000 people.", mood: 'fact' }
  ],
  [CivType.EGYPT]: [
    { fact: "Workers built the pyramids, not slaves.", mood: 'fact' },
    { fact: "Cats were sacred animals.", mood: 'witty' },
    { fact: "The Nile flows North.", mood: 'fact' }
  ],
  [CivType.BYZANTIUM]: [
    { fact: "We called ourselves Romans.", mood: 'fact' },
    { fact: "The Walls stood for 1000 years.", mood: 'encouraging' },
    { fact: "Greek Fire burned even on water.", mood: 'dark' }
  ],
  [CivType.PERSIA]: [
    { fact: "We invented the postal service.", mood: 'fact' },
    { fact: "Cyrus declared the first human rights.", mood: 'fact' },
    { fact: "Tolerance is strength.", mood: 'encouraging' }
  ]
};

export const LEAGUE_BOT_POOL = {
  [CivType.ROME]: ['Marcus', 'Livia', 'Centurion', 'Scipio', 'Cicero'],
  [CivType.EGYPT]: ['Cleo', 'Anubis', 'Scribe', 'Horus', 'Nile'],
  [CivType.BYZANTIUM]: ['Belisarius', 'Anna', 'GreekFire', 'Justinian', 'Sofia'],
  [CivType.PERSIA]: ['Xerxes', 'Immortal', 'Cyrus', 'Satrap', 'Darius']
};

export const AVATARS: Avatar[] = [
  {
    id: 'recruit_default',
    name: 'Recruit',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Profile_avatar_placeholder_large.png/600px-Profile_avatar_placeholder_large.png',
    rarity: 'common',
    description: 'Ready for adventure!'
  },
  {
    id: 'scholar_default',
    name: 'Scholar',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png',
    rarity: 'common',
    description: 'Book smart.'
  },
  {
    id: 'rome_legionary',
    name: 'Legionary',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Roman_soldier_black.svg/512px-Roman_soldier_black.svg.png',
    rarity: 'rare',
    description: 'Strength and honor.',
    cost: 500
  },
  {
    id: 'egypt_priest',
    name: 'Priest',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Egyptian_Hieroglyph_A1.svg/512px-Egyptian_Hieroglyph_A1.svg.png',
    rarity: 'rare',
    description: 'Mystical wisdom.',
    cost: 500
  }
];

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first_step', title: 'First Steps', description: 'Complete 1 lesson.', icon: '👟', condition: (u) => u.completedLessons.length >= 1 },
  { id: 'streak_3', title: 'On Fire', description: '3 day streak.', icon: '🔥', condition: (u) => u.streak >= 3 },
  { id: 'tribute_gods', title: 'Walk like an Egyptian', description: 'Complete an Egypt lesson.', icon: '👁️', condition: (u) => u.completedLessons.some(id => id.startsWith('egypt')) },
  { id: 'rome_novice', title: 'Legionary', description: '3 Rome lessons.', icon: '🏛️', condition: (u) => u.completedLessons.filter(id => id.startsWith('rome')).length >= 3 },
  { id: 'gem_hoarder', title: 'Big Spender', description: 'Earn 500 Gems.', icon: '💎', condition: (u) => u.gems >= 500 }
];

export const LESSON_DATA: Lesson[] = [
  // ================= UNIT 1: ROME (THE FOUNDING) =================
  {
    id: 'rome-1',
    title: 'Brothers of Blood',
    description: 'The myth of Romulus and Remus',
    civ: CivType.ROME,
    locked: false,
    completed: false,
    xpReward: 100,
    mapCoordinates: { x: 44, y: 35 },
    activities: [
      {
        id: 'r1-1',
        type: ActivityType.READING,
        question: 'Origins of Rome',
        narrative: "In the shadow of history, the origins of Rome are shrouded in myth. We are told the Eternal City was founded in **753 BC**, not by a council, but by two brothers: **Romulus and Remus**.\n\nSons of Mars, god of War, they were abandoned in the Tiber River by a jealous king. Destiny, however, does not drown easily.",
        mascotGuidance: "My father Mars gave me my sword. My mother gave me my destiny.",
        customImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Rubens_Romulus_and_Remus.jpg/640px-Rubens_Romulus_and_Remus.jpg",
        imageCredit: "Romulus and Remus, Rubens",
        scholarNotes: "Archaeology confirms settlements on the Palatine Hill dating to the mid-8th century BC, aligning eerily well with the legendary date of 753 BC."
      },
      {
        id: 'r1-2',
        type: ActivityType.READING,
        question: 'The She-Wolf',
        narrative: "The basket containing the infants drifted to the foot of the Palatine Hill. There, a she-wolf (**Lupa**) heard their cries.\n\nIn a moment of unnatural mercy, she did not devour them but nursed them. They were later raised by a shepherd. The savagery of the wolf and the humility of the shepherd would define Rome.",
        mascotGuidance: "We are children of the wolf. That is why we bite.",
        customImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/She-wolf_suckles_Romulus_and_Remus.jpg/640px-She-wolf_suckles_Romulus_and_Remus.jpg",
        imageCredit: "Capitoline Wolf, Musei Capitolini"
      },
      {
        id: 'r1-3',
        type: ActivityType.QUIZ,
        question: "Who saved the twins from the river?",
        options: ["A Lion", "A She-Wolf", "A Bear", "A Soldier"],
        correctAnswer: "A She-Wolf"
      },
      {
        id: 'r1-4',
        type: ActivityType.READING,
        question: 'The Fatal Argument',
        narrative: "When they came of age, the brothers sought to build a city. Romulus chose the **Palatine Hill**; Remus, the Aventine.\n\nThey consulted the gods through augury (birds). Remus saw 6 vultures first; Romulus saw 12 later. The dispute turned violent. Romulus killed his brother, shouting: *'So perish anyone who leaps over my walls!'*",
        mascotGuidance: "A city needs walls. And walls need blood.",
        customImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Sabatelli_-_L%27uccisione_di_Remo.jpg/640px-Sabatelli_-_L%27uccisione_di_Remo.jpg",
        imageCredit: "The Killing of Remus, Sabatelli",
        scholarNotes: "Fratricide (brother-killing) is Rome's original sin, foreshadowing the bloody civil wars that would later destroy the Republic."
      },
      {
        id: 'r1-5',
        type: ActivityType.SORTING,
        question: 'Chronology of Founding',
        items: ['Twins abandoned', 'Nursed by Wolf', 'Argument over Hills', 'Romulus kills Remus'],
        correctOrder: ['Twins abandoned', 'Nursed by Wolf', 'Argument over Hills', 'Romulus kills Remus']
      }
    ]
  },
  {
    id: 'rome-2',
    title: 'The Seven Kings',
    description: 'From Monarchy to Tyranny',
    civ: CivType.ROME,
    locked: true,
    completed: false,
    xpReward: 100,
    mapCoordinates: { x: 45, y: 38 },
    activities: [
      {
        id: 'r2-1',
        type: ActivityType.READING,
        question: 'The Age of Kings',
        narrative: "For 250 years, Rome was ruled by kings. The first was Romulus. The second, Numa Pompilius, was a peaceful priest-king who established the **Vestal Virgins** and the calendar.\n\nBut absolute power corrupts. The line ended with the seventh king, **Tarquin the Proud**, a tyrant who murdered senators and ruled by fear.",
        mascotGuidance: "Kings are useful only until they think they are gods.",
        customImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Numa_Pompilius_and_the_Nymph_Egeria.jpg/640px-Numa_Pompilius_and_the_Nymph_Egeria.jpg",
        imageCredit: "Numa Pompilius, Felice Giani"
      },
      {
        id: 'r2-2',
        type: ActivityType.MATCHING,
        question: 'Match the King',
        pairs: [
          { term: 'Romulus', definition: 'Founder' },
          { term: 'Numa', definition: 'Priest' },
          { term: 'Tarquin', definition: 'Tyrant' }
        ]
      },
      {
        id: 'r2-3',
        type: ActivityType.QUIZ,
        question: "Why was Tarquin hated?",
        options: ["He was too poor", "He was a tyrant", "He couldn't read", "He was Greek"],
        correctAnswer: "He was a tyrant"
      }
    ]
  },
  {
    id: 'rome-3',
    title: 'Res Publica',
    description: 'The Birth of the Republic',
    civ: CivType.ROME,
    locked: true,
    completed: false,
    xpReward: 120,
    mapCoordinates: { x: 42, y: 32 },
    activities: [
      {
        id: 'r3-1',
        type: ActivityType.READING,
        question: 'The Oath',
        narrative: "After a crime by the King's son against the noblewoman Lucretia, the Romans snapped. Led by **Brutus**, they expelled Tarquin in 509 BC.\n\nBrutus swore an oath that Rome would **never** again be ruled by a king. They created a *Res Publica* (Public Affair), ruled by two Consuls elected for one year, to prevent tyranny.",
        mascotGuidance: "Liberty is not given. It is taken.",
        customImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Gavin_Hamilton_-_The_Oath_of_Brutus.jpg/800px-Gavin_Hamilton_-_The_Oath_of_Brutus.jpg",
        imageCredit: "The Oath of Brutus, Gavin Hamilton"
      },
      {
        id: 'r3-2',
        type: ActivityType.QUIZ,
        question: "What replaced the King?",
        options: ["An Emperor", "Two Consuls", "A Priest", "A General"],
        correctAnswer: "Two Consuls",
        scholarNotes: "Having two Consuls meant they could veto (forbid) each other. The system was designed to create gridlock so no single man could take over."
      }
    ]
  },

  // ================= UNIT 1: EGYPT (THE FOUNDING) =================
  {
    id: 'egypt-1',
    title: 'Gift of the Nile',
    description: 'Life in the Desert',
    civ: CivType.EGYPT,
    locked: false,
    completed: false,
    xpReward: 100,
    mapCoordinates: { x: 50, y: 20 },
    activities: [
      {
        id: 'e1-1',
        type: ActivityType.READING,
        question: 'The Black Land',
        narrative: "Egypt is the Nile. Without this river, there is only the Sahara. Every year, the river floods, depositing rich black silt.\n\nThe Egyptians called their land **Kemet** (The Black Land), distinguishing it from **Deshret** (The Red Land) of the deadly desert. Life, religion, and time itself were measured by the river's pulse.",
        mascotGuidance: "The river is a god. Respect it.",
        customImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Egypt.Giza.Sphinx.01.jpg/800px-Egypt.Giza.Sphinx.01.jpg",
        imageCredit: "Great Sphinx and Pyramids"
      },
      {
        id: 'e1-2',
        type: ActivityType.QUIZ,
        question: "What is 'Kemet'?",
        options: ["The Red Desert", "The Black Land", "The Blue River", "The White Mountain"],
        correctAnswer: "The Black Land"
      }
    ]
  },
  {
    id: 'egypt-2',
    title: 'Unification',
    description: 'Narmer and the Two Lands',
    civ: CivType.EGYPT,
    locked: true,
    completed: false,
    xpReward: 100,
    mapCoordinates: { x: 50, y: 45 },
    activities: [
      {
        id: 'e2-1',
        type: ActivityType.READING,
        question: 'The Two Crowns',
        narrative: "Before the Pharaohs, there were two Egypts: Upper Egypt (South, White Crown) and Lower Egypt (North, Red Crown).\n\nAround 3100 BC, King **Narmer** conquered the north. He combined the crowns into the **Pschent** (Double Crown), symbolizing total unity. He was the first Lord of the Two Lands.",
        mascotGuidance: "One king. One river. One people.",
        customImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Narmer_Palette.jpg/640px-Narmer_Palette.jpg",
        imageCredit: "The Narmer Palette"
      },
      {
        id: 'e2-2',
        type: ActivityType.MATCHING,
        question: 'Match the Region',
        pairs: [
          { term: 'Upper Egypt', definition: 'South (White)' },
          { term: 'Lower Egypt', definition: 'North (Red)' },
          { term: 'Narmer', definition: 'Unifier' }
        ]
      }
    ]
  },
  {
    id: 'egypt-3',
    title: 'Stairway to Heaven',
    description: 'The First Pyramid',
    civ: CivType.EGYPT,
    locked: true,
    completed: false,
    xpReward: 120,
    mapCoordinates: { x: 48, y: 25 },
    activities: [
      {
        id: 'e3-1',
        type: ActivityType.READING,
        question: 'Imhotep\'s Genius',
        narrative: "Early kings were buried in flat benches called *mastabas*. But the architect **Imhotep** had a vision for King Djoser. He stacked six mastabas on top of each other, creating the **Step Pyramid**.\n\nIt was the first skyscraper in history—a giant stone stairway for the Pharaoh's soul to ascend to the stars.",
        mascotGuidance: "We build for eternity, not for the living.",
        customImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Saqqara_pyramid_ver_2.jpg/800px-Saqqara_pyramid_ver_2.jpg",
        imageCredit: "Step Pyramid of Djoser"
      },
      {
        id: 'e3-2',
        type: ActivityType.QUIZ,
        question: "Who designed the first pyramid?",
        options: ["Djoser", "Narmer", "Imhotep", "Ra"],
        correctAnswer: "Imhotep"
      }
    ]
  },

  // ================= UNIT 1: BYZANTIUM (THE FOUNDING) =================
  {
    id: 'byz-1',
    title: 'The Great Split',
    description: 'East vs West',
    civ: CivType.BYZANTIUM,
    locked: false,
    completed: false,
    xpReward: 100,
    mapCoordinates: { x: 40, y: 40 },
    activities: [
      {
        id: 'b1-1',
        type: ActivityType.READING,
        question: 'A Dying Empire',
        narrative: "By 300 AD, the Roman Empire was too big to rule. It was rotting. Emperor **Diocletian** made a radical decision: he cut the empire in half.\n\nThe West (Rome) was rural and poor. The East (Greece, Egypt, Syria) was urban, rich, and sophisticated. This division saved the Roman name but doomed the city of Rome itself.",
        mascotGuidance: "Sometimes you must amputate a limb to save the body.",
        customImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Venice_-_The_Tetrarchs_03.jpg/800px-Venice_-_The_Tetrarchs_03.jpg",
        imageCredit: "The Tetrarchs"
      },
      {
        id: 'b1-2',
        type: ActivityType.QUIZ,
        question: "Which half of the empire was richer?",
        options: ["West", "East", "North", "South"],
        correctAnswer: "East"
      }
    ]
  },
  {
    id: 'byz-2',
    title: 'Nova Roma',
    description: 'Constantine\'s Vision',
    civ: CivType.BYZANTIUM,
    locked: true,
    completed: false,
    xpReward: 100,
    mapCoordinates: { x: 55, y: 40 },
    activities: [
      {
        id: 'b2-1',
        type: ActivityType.READING,
        question: 'City of Constantine',
        narrative: "Emperor **Constantine** needed a capital closer to the wealthy East and the Persian frontier. He chose the ancient Greek port of Byzantium on the Bosporus Strait.\n\nIn 330 AD, he dedicated it as **Nova Roma** (New Rome). History knows it as Constantinople. It was a Christian city, free of Rome's pagan past, designed to rule the world.",
        mascotGuidance: "Rome is the past. This city is the future.",
        customImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Constantinople_3d_reconstruction_by_Byzantium_1200.jpg/800px-Constantinople_3d_reconstruction_by_Byzantium_1200.jpg",
        imageCredit: "Reconstruction of Constantinople"
      },
      {
        id: 'b2-2',
        type: ActivityType.MAP_CONQUEST,
        question: 'Locate Constantinople',
        customImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Roman_Empire_with_diocesan_boundaries_300_AD.png/800px-Roman_Empire_with_diocesan_boundaries_300_AD.png",
        mapTarget: { x: 55, y: 38, label: 'Constantinople' },
        mapQuiz: { question: "It sits on which strait?", options: ["Bosporus", "Gibraltar", "Nile", "Tiber"], correctAnswer: "Bosporus" }
      }
    ]
  },
  {
    id: 'byz-3',
    title: 'The Walls',
    description: 'The Shield of God',
    civ: CivType.BYZANTIUM,
    locked: true,
    completed: false,
    xpReward: 120,
    mapCoordinates: { x: 56, y: 38 },
    activities: [
      {
        id: 'b3-1',
        type: ActivityType.READING,
        question: 'Triple Defense',
        narrative: "The **Theodosian Walls** were the greatest fortifications ever built. A triple layer of defense: a deep moat, an outer wall, and a massive inner wall with 96 towers.\n\nAttila the Hun turned back at the sight of them. For 1,000 years, they kept the light of civilization burning while Europe slept in darkness.",
        mascotGuidance: "Let the barbarians come. They will break against stone.",
        customImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Theodosian_Walls.jpg/800px-Theodosian_Walls.jpg",
        imageCredit: "Theodosian Walls"
      },
      {
        id: 'b3-2',
        type: ActivityType.SORTING,
        question: 'Order the Defenses',
        items: ['The Moat', 'Outer Wall', 'Inner Wall', 'The City'],
        correctOrder: ['The Moat', 'Outer Wall', 'Inner Wall', 'The City']
      }
    ]
  },

  // ================= UNIT 1: PERSIA (THE FOUNDING) =================
  {
    id: 'persia-1',
    title: 'The Median Yoke',
    description: 'Rise of Cyrus',
    civ: CivType.PERSIA,
    locked: false,
    completed: false,
    xpReward: 100,
    mapCoordinates: { x: 60, y: 45 },
    activities: [
      {
        id: 'p1-1',
        type: ActivityType.READING,
        question: 'Vassals no More',
        narrative: "The Persians were originally a small tribe of horsemen, ruled by the powerful Medes. But **Cyrus the Great** united the Persian clans and revolted.\n\nHe didn't just defeat the Medes; he integrated them. He created a dual monarchy where Medes and Persians fought side by side. It was the beginning of the Achaemenid Empire.",
        mascotGuidance: "Strength comes from unity, not domination.",
        customImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Achaemenid_Soldiers.jpg/800px-Achaemenid_Soldiers.jpg",
        imageCredit: "Persian Guards"
      },
      {
        id: 'p1-2',
        type: ActivityType.QUIZ,
        question: "Who did Cyrus overthrow?",
        options: ["The Greeks", "The Medes", "The Romans", "The Egyptians"],
        correctAnswer: "The Medes"
      }
    ]
  },
  {
    id: 'persia-2',
    title: 'Babylon',
    description: 'Conquest without Fire',
    civ: CivType.PERSIA,
    locked: true,
    completed: false,
    xpReward: 100,
    mapCoordinates: { x: 45, y: 50 },
    activities: [
      {
        id: 'p2-1',
        type: ActivityType.READING,
        question: 'The Open Gate',
        narrative: "Babylon was the greatest city on earth. Its walls were impregnable. But its king, Nabonidus, was hated. \n\nIn 539 BC, Cyrus marched to the city. He didn't need siege engines. The priests of Marduk opened the gates for him. He entered not as a conqueror, but as a restorer of order. He freed the Jewish exiles and allowed them to rebuild Jerusalem.",
        mascotGuidance: "I conquered the world's greatest city without shedding a drop of blood.",
        customImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Cyrus_Cylinder_front.jpg/800px-Cyrus_Cylinder_front.jpg",
        imageCredit: "Cyrus Cylinder"
      },
      {
        id: 'p2-2',
        type: ActivityType.QUIZ,
        question: "How did Cyrus enter Babylon?",
        options: ["By force", "Through a tunnel", "Through open gates", "By starvation"],
        correctAnswer: "Through open gates"
      }
    ]
  },
  {
    id: 'persia-3',
    title: 'King of Kings',
    description: 'Ruling the World',
    civ: CivType.PERSIA,
    locked: true,
    completed: false,
    xpReward: 120,
    mapCoordinates: { x: 35, y: 35 },
    activities: [
      {
        id: 'p3-1',
        type: ActivityType.READING,
        question: 'Satraps and Roads',
        narrative: "To rule an empire stretching from India to Greece, the Persians invented administration. They divided the land into provinces ruled by **Satraps** (Governors).\n\nThey built the **Royal Road**, 1,600 miles long. Using a relay of fresh horses, a message could travel from Susa to Sardis in 7 days. Herodotus wrote: *'Neither snow nor rain nor heat stays these couriers.'*",
        mascotGuidance: "Speed is power.",
        customImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Darius_I_the_Great_receiving_homage.jpg/800px-Darius_I_the_Great_receiving_homage.jpg",
        imageCredit: "Darius the Great"
      },
      {
        id: 'p3-2',
        type: ActivityType.MATCHING,
        question: 'Persian Administration',
        pairs: [
          { term: 'Satrap', definition: 'Governor' },
          { term: 'Royal Road', definition: 'Highway' },
          { term: 'King of Kings', definition: 'Emperor' }
        ]
      }
    ]
  }
];
