
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
    theme: 'system' // Default to system/light for the new look
  },
  avatarId: 'recruit_default',
  unlockedAvatars: ['recruit_default', 'scholar_default'],
  friends: []
};

// Fallback generator (kept for dynamic content, but lessons primarily use customImage now)
export const getImage = (keyword: string) => {
  const prompt = encodeURIComponent(`historical museum artifact photo, high quality, ${keyword}`);
  return `https://image.pollinations.ai/prompt/${prompt}?width=1024&height=768&nologo=true&seed=${Math.random()}`;
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
    // Wikimedia SVG (Transparent)
    symbolUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Vexilloid_of_the_Roman_Empire.svg/512px-Vexilloid_of_the_Roman_Empire.svg.png',
    coverImage: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=1996&auto=format&fit=crop',
    mascot: 'Augustus',
    // Prima Porta Headshot (Cropped to fit round)
    mascotImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Statue-Augustus.jpg/640px-Statue-Augustus.jpg',
    description: "The Rise of Rome",
    leagueTitle: "Legion League",
    mapImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Roman_Empire_Trajan_117AD.png/1280px-Roman_Empire_Trajan_117AD.png",
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
    // Wikimedia SVG (Transparent)
    symbolUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Eye_of_Horus_bw.svg/1024px-Eye_of_Horus_bw.svg.png',
    coverImage: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?q=80&w=2070&auto=format&fit=crop',
    mascot: 'Tutankhamen',
    // Gold Mask Headshot
    mascotImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Tutanchamun_Maske.jpg/640px-Tutanchamun_Maske.jpg',
    description: "Sands of the Nile",
    leagueTitle: "Pharaoh League",
    mapImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Ancient_Egypt_map-en.svg/836px-Ancient_Egypt_map-en.svg.png",
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
    // Wikimedia SVG (Transparent)
    symbolUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Chi_Rho.svg/1024px-Chi_Rho.svg.png',
    coverImage: 'https://images.unsplash.com/photo-1596367407072-acf97105cb36?q=80&w=2070&auto=format&fit=crop',
    mascot: 'Justinian',
    // Mosaic Face Crop
    mascotImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Mosaic_of_Justinian_I_-_Basilica_San_Vitale_%28Ravenna%29.jpg/640px-Mosaic_of_Justinian_I_-_Basilica_San_Vitale_%28Ravenna%29.jpg',
    description: "The Golden City",
    leagueTitle: "Imperial League",
    mapImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Justinian555AD.png/1280px-Justinian555AD.png",
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
    // Wikimedia SVG (Transparent)
    symbolUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Simurgh.svg/1024px-Simurgh.svg.png',
    coverImage: 'https://images.unsplash.com/photo-1579975096649-e773152b04cb?q=80&w=2070&auto=format&fit=crop',
    mascot: 'Cyrus',
    // Cyrus Relief Crop
    mascotImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Cyrus_Cylinder_front.jpg/640px-Cyrus_Cylinder_front.jpg',
    description: "Empire of Kings",
    leagueTitle: "Immortal League",
    mapImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Achaemenid_Empire_at_its_greatest_extent.png/1280px-Achaemenid_Empire_at_its_greatest_extent.png",
    props: ['🏹', '🐎']
  }
};

export const CIV_PROLOGUES = {
  [CivType.ROME]: {
    quote: "I found Rome a city of bricks and left it a city of marble.",
    author: "Augustus",
    voice: "Fenrir"
  },
  [CivType.EGYPT]: {
    quote: "My name is Ozymandias, King of Kings.",
    author: "Shelley",
    voice: "Fenrir"
  },
  [CivType.BYZANTIUM]: {
    quote: "Solomon, I have outdone thee!",
    author: "Justinian",
    voice: "Fenrir"
  },
  [CivType.PERSIA]: {
    quote: "I am Cyrus, King of the Universe.",
    author: "Cyrus Cylinder",
    voice: "Fenrir"
  }
};

export const MASCOT_INTEL: Record<CivType, MascotIntel[]> = {
  [CivType.ROME]: [
    { fact: "Keep going! Rome wasn't built in a day!", mood: 'encouraging' },
    { fact: "Did you know Romans used urine to whiten teeth? Gross!", mood: 'witty' },
    { fact: "Watch out for Brutus.", mood: 'dark' },
    { fact: "Victory comes to those who study!", mood: 'fact' },
    { fact: "The Colosseum could hold 50,000 spectators.", mood: 'fact' }
  ],
  [CivType.EGYPT]: [
    { fact: "Pyramids were NOT built by slaves! They were paid workers.", mood: 'fact' },
    { fact: "Cats were sacred. Don't mess with the cats.", mood: 'witty' },
    { fact: "I became Pharaoh at age 9. What have you done?", mood: 'witty' },
    { fact: "Mummification took 70 days. Don't rush!", mood: 'fact' },
    { fact: "The Nile flows North. Weird, right?", mood: 'fact' }
  ],
  [CivType.BYZANTIUM]: [
    { fact: "We call ourselves Romans, not Byzantines.", mood: 'fact' },
    { fact: "The Walls of Constantinople held for 1000 years!", mood: 'encouraging' },
    { fact: "Purple is the color of royalty. Nice choice.", mood: 'witty' },
    { fact: "Greek Fire is a secret recipe. Don't ask.", mood: 'dark' },
    { fact: "Justinian's code is the basis of modern law.", mood: 'fact' }
  ],
  [CivType.PERSIA]: [
    { fact: "We invented the postal service. You're welcome.", mood: 'fact' },
    { fact: "Cyrus was the first to declare human rights.", mood: 'fact' },
    { fact: "Our archers are legendary. Aim true!", mood: 'encouraging' },
    { fact: "Tolerance is strength.", mood: 'fact' },
    { fact: "The Royal Road is 1600 miles long. Keep walking!", mood: 'encouraging' }
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
  {
    id: 'first_step',
    title: 'First Steps',
    description: 'Complete 1 lesson.',
    icon: '👟',
    condition: (u) => u.completedLessons.length >= 1
  },
  {
    id: 'streak_3',
    title: 'On Fire',
    description: '3 day streak.',
    icon: '🔥',
    condition: (u) => u.streak >= 3
  },
  {
    id: 'tribute_gods',
    title: 'Walk like an Egyptian',
    description: 'Complete an Egypt lesson.',
    icon: '👁️',
    condition: (u) => u.completedLessons.some(id => id.startsWith('egypt'))
  },
  {
    id: 'rome_novice',
    title: 'Legionary',
    description: '3 Rome lessons.',
    icon: '🏛️',
    condition: (u) => u.completedLessons.filter(id => id.startsWith('rome')).length >= 3
  },
  {
    id: 'gem_hoarder',
    title: 'Big Spender',
    description: 'Earn 500 Gems.',
    icon: '💎',
    condition: (u) => u.gems >= 500
  }
];

export const LESSON_DATA: Lesson[] = [
  // ================= ROME =================
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
        id: 'r1-teach-1',
        type: ActivityType.READING,
        question: 'Origins of Rome',
        narrative: "In the shadow of history, the origins of Rome are shrouded in myth and bloodshed. We are told that the Eternal City was founded in **753 BC**, not by a council of elders, but by two young brothers: **Romulus and Remus**. \n\nBorn of a Vestal Virgin and Mars, the god of War, their life began with an execution order. A jealous king, fearing their lineage, commanded they be drowned in the Tiber River. But destiny—and the river's current—had other plans.",
        mascotGuidance: "My father Mars gave me my sword. My mother gave me my destiny.",
        customImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Rubens_Romulus_and_Remus.jpg/1280px-Rubens_Romulus_and_Remus.jpg",
        imageCredit: "Romulus and Remus by Peter Paul Rubens (1616)",
        scholarNotes: "While the story of the twins is myth, archaeological evidence confirms that early settlements on the Palatine Hill date back to the mid-8th century BC, aligning eerily well with the legendary date of 753 BC."
      },
      {
        id: 'r1-teach-2',
        type: ActivityType.READING,
        question: 'The She-Wolf',
        narrative: "The basket containing the infants did not sink. It drifted into the reeds at the foot of the Palatine Hill, where a she-wolf, known in Latin as **Lupa**, heard their cries. \n\nIn a moment of unnatural mercy, the beast did not devour them but nursed them in her cave, the Lupercal. They were later discovered by the shepherd Faustulus, who raised them as his own. The savagery of the wolf and the humility of the shepherd would define the Roman character forever.",
        mascotGuidance: "We are children of the wolf. That is why we bite.",
        customImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/She-wolf_suckles_Romulus_and_Remus.jpg/1024px-She-wolf_suckles_Romulus_and_Remus.jpg",
        imageCredit: "Capitoline Wolf, Musei Capitolini",
        scholarNotes: "The famous bronze statue of the She-Wolf was long thought to be Etruscan (5th century BC), but modern carbon dating suggests it might actually be medieval (11th century AD). The twins were added during the Renaissance."
      },
      {
        id: 'r1-check-1',
        type: ActivityType.QUIZ,
        question: "Who saved the twins from the river?",
        options: ["A Lion", "A She-Wolf", "A Bear", "A Soldier"],
        correctAnswer: "A She-Wolf",
        mascotGuidance: "Think of the symbol of Rome."
      },
      {
        id: 'r1-teach-3',
        type: ActivityType.READING,
        question: 'The Fatal Argument',
        narrative: "When the brothers came of age, they returned to found a city on the banks of the Tiber. But power cannot be shared. Romulus favored the **Palatine Hill**, a defensible fortress. Remus preferred the Aventine. \n\nThey turned to **augury**—reading the will of the gods in the flight of birds. Remus saw six vultures first, claiming priority. Romulus saw twelve vultures later, claiming superiority. The debate turned violent.",
        mascotGuidance: "The gods favored me with twelve birds. Remus was just impatient.",
        customImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Seven_Hills_of_Rome.svg/1024px-Seven_Hills_of_Rome.svg.png",
        imageCredit: "Map of the Seven Hills of Rome"
      },
      {
        id: 'r1-teach-4',
        type: ActivityType.READING,
        question: 'The First Wall',
        narrative: "Romulus began to dig the trench for his city's walls—the *pomerium*. It was a sacred boundary. Remus, mocking his brother's ambition, leapt back and forth over the shallow ditch, laughing at its weakness. \n\nRomulus, consumed by rage and the weight of his destiny, drew his sword and struck his brother dead. As Remus fell, Romulus shouted the curse that would echo through the ages: *'So perish anyone who leaps over my walls!'* Rome was baptized in the blood of a brother.",
        mascotGuidance: "A city needs walls. And walls need blood.",
        customImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Jacques-Louis_David_-_The_Intervention_of_the_Sabine_Women_-_Google_Art_Project.jpg/1280px-Jacques-Louis_David_-_The_Intervention_of_the_Sabine_Women_-_Google_Art_Project.jpg",
        imageCredit: "The Intervention of the Sabine Women, Jacques-Louis David",
        scholarNotes: "This act of fratricide (brother-killing) haunted the Roman psyche. Later historians would point to it as the original sin of Rome, foreshadowing the bloody civil wars that would eventually destroy the Republic."
      },
      {
        id: 'r1-final',
        type: ActivityType.SORTING,
        question: 'Chronology of Founding',
        items: ['Twins abandoned in Tiber', 'Nursed by She-Wolf', 'Argument over Hills', 'Romulus kills Remus'],
        correctOrder: ['Twins abandoned in Tiber', 'Nursed by She-Wolf', 'Argument over Hills', 'Romulus kills Remus'],
      }
    ]
  },
  {
    id: 'rome-2',
    title: 'The Seven Kings',
    description: 'Monarchy to Republic',
    civ: CivType.ROME,
    locked: true,
    completed: false,
    xpReward: 100,
    mapCoordinates: { x: 45, y: 38 },
    activities: [
        {
        id: 'r2-1',
        type: ActivityType.READING,
        question: 'The Tyrant',
        narrative: "For 250 years, Rome was ruled by kings. Some were wise, like Numa Pompilius who established the religion. But absolute power corrupts. The seventh and final king, **Tarquin the Proud** (Tarquinius Superbus), was a tyrant who murdered senators and treated citizens like slaves. \n\nThe monarchy had rotted from within. The spark that ignited the revolution came from his son, Sextus, who committed a heinous crime against the noblewoman Lucretia. Her tragic death rallied the people to say 'Enough'.",
        mascotGuidance: "We do not speak his name without spitting.",
        customImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/The_Rape_of_Lucretia_%28Titian%29_-_Fitzwilliam_Museum.jpg/800px-The_Rape_of_Lucretia_%28Titian%29_-_Fitzwilliam_Museum.jpg",
        imageCredit: "Tarquin and Lucretia, Titian",
        scholarNotes: "Many of Rome's 'Kings' were actually Etruscan warlords. The expulsion of the Tarquins wasn't just a political revolution; it was likely an independence war against Etruscan domination."
      },
      {
        id: 'r2-3',
        type: ActivityType.QUIZ,
        question: "Who was the last King of Rome?",
        options: ["Romulus", "Tarquin the Proud", "Caesar", "Augustus"],
        correctAnswer: "Tarquin the Proud",
        mascotGuidance: "He was 'Superbus'—arrogant."
      }
    ]
  },
    // ================= EGYPT =================
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
        question: 'The Inundation',
        narrative: "To understand Egypt, you must understand the river. The Greek historian Herodotus called Egypt 'The Gift of the Nile', and he was right. Without it, there is only the Sahara. \n\nEvery year, fueled by monsoons deep in Africa, the Nile swells and floods its banks. This event, the **Inundation**, was not a disaster but a miracle. It deposited thick, black silt onto the land. The Egyptians called their country **Kemet** (The Black Land), distinguishing it from **Deshret** (The Red Land) of the deadly desert beyond.",
        mascotGuidance: "The river is a god. It brings life from death.",
        customImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Egypt.Giza.Sphinx.01.jpg/1280px-Egypt.Giza.Sphinx.01.jpg",
        imageCredit: "The Great Sphinx of Giza"
      },
      {
        id: 'e1-2',
        type: ActivityType.QUIZ,
        question: "What did Egyptians call their fertile land?",
        options: ["The Red Land", "The Black Land (Kemet)", "The Gold Land", "The White Land"],
        correctAnswer: "The Black Land (Kemet)",
        mascotGuidance: "Black is the color of fertile soil."
      }
    ]
  },
   // ================= BYZANTIUM =================
   {
    id: 'byz-1',
    title: 'New Rome',
    description: 'Constantine moves East',
    civ: CivType.BYZANTIUM,
    locked: false,
    completed: false,
    xpReward: 100,
    mapCoordinates: { x: 40, y: 40 },
    activities: [
      {
        id: 'b1-1',
        type: ActivityType.READING,
        question: 'Nova Roma',
        narrative: "By the 4th century AD, Rome was a dying city—too far from the frontiers, too full of pagan ghosts. Emperor **Constantine the Great** looked East. He found the ancient Greek city of Byzantium, sitting perfectly on the Bosporus Strait between Europe and Asia. \n\nIn 330 AD, he consecrated it as **Nova Roma** (New Rome), though the world would come to know it as **Constantinople**. While the West sank into the Dark Ages, this city would shine as the 'Queen of Cities' for another thousand years.",
        mascotGuidance: "Rome is the past. Constantinople is the future.",
        customImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Hagia_Sophia_Mars_2013.jpg/1280px-Hagia_Sophia_Mars_2013.jpg",
        imageCredit: "Hagia Sophia, Istanbul"
      },
       {
        id: 'b1-2',
        type: ActivityType.QUIZ,
        question: "What was the original name of Constantinople?",
        options: ["Athens", "Byzantium", "Alexandria", "Troy"],
        correctAnswer: "Byzantium",
        mascotGuidance: "The empire is named after this city."
      }
    ]
  },
   // ================= PERSIA =================
   {
    id: 'persia-1',
    title: 'Cyrus the Great',
    description: 'Building an Empire',
    civ: CivType.PERSIA,
    locked: false,
    completed: false,
    xpReward: 100,
    mapCoordinates: { x: 60, y: 45 },
    activities: [
      {
        id: 'p1-1',
        type: ActivityType.READING,
        question: 'The King of Kings',
        narrative: "Before **Cyrus the Great**, empires were machines of terror. The Assyrians flayed their enemies; the Babylonians enslaved them. Cyrus chose a different path. \n\nWhen he conquered the mighty city of Babylon in 539 BC, he did not burn it. He walked through the Ishtar Gate as a liberator. He issued a decree, written on a clay cylinder, that allowed captive peoples—including the Jews—to return to their homelands and worship their own gods. It was the birth of the Achaemenid Empire, the first true superpower.",
        mascotGuidance: "I do not conquer to destroy. I conquer to unite.",
        customImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Cyrus_Cylinder_front.jpg/1024px-Cyrus_Cylinder_front.jpg",
        imageCredit: "The Cyrus Cylinder, British Museum"
      },
       {
        id: 'p1-2',
        type: ActivityType.QUIZ,
        question: "What is the 'Cyrus Cylinder' known for?",
        options: ["A declaration of war", "Early Human Rights", "A recipe for bread", "A map of the stars"],
        correctAnswer: "Early Human Rights",
        mascotGuidance: "Tolerance was my greatest weapon."
      }
    ]
  }
];
