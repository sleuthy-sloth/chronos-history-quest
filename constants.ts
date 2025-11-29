
import { ActivityType, CivType, Lesson, UserState, Achievement, Avatar, MascotIntel } from './types';

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
  friends: [],
  generatedLessons: {}
};

export const getImage = (keyword: string) => {
  // Use Pollinations for reliable AI art based on the prompt
  const prompt = encodeURIComponent(`historical museum artifact photo, high quality, ${keyword}, 8k, photorealistic`);
  return `https://image.pollinations.ai/prompt/${prompt}?width=800&height=600&nologo=true&seed=${Math.random()}`;
};

export const CIV_MUSIC = {
  [CivType.ROME]: "https://cdn.pixabay.com/audio/2022/10/28/audio_650d32b554.mp3",
  [CivType.EGYPT]: "https://cdn.pixabay.com/audio/2023/05/23/audio_a1e5296048.mp3",
  [CivType.BYZANTIUM]: "https://cdn.pixabay.com/audio/2022/08/02/audio_884fe92c21.mp3",
  [CivType.PERSIA]: "https://cdn.pixabay.com/audio/2024/09/11/audio_4024847e30.mp3"
};

// Tactical Historian Aesthetics - Balanced, rich tones, distinct borders
export const CIV_THEMES = {
  [CivType.ROME]: {
    primary: 'bg-red-800', 
    dark: 'bg-red-950',
    border: 'border-red-900',
    text: 'text-red-900',
    bgLight: 'bg-stone-200',
    gradient: 'from-red-900 to-stone-900',
    accent: 'border-red-800',
    secondary: 'text-red-800',
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
    primary: 'bg-amber-700',
    dark: 'bg-amber-950',
    border: 'border-amber-900',
    text: 'text-amber-900',
    bgLight: 'bg-orange-50',
    gradient: 'from-amber-800 to-stone-900',
    accent: 'border-amber-700',
    secondary: 'text-amber-800',
    icon: '👁️',
    symbolUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Eye_of_Horus_colored.svg/512px-Eye_of_Horus_colored.svg.png',
    coverImage: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?q=80&w=800&auto=format&fit=crop',
    mascot: 'Tutankhamen',
    mascotImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Tutanchamun_Maske.jpg/640px-Tutanchamun_Maske.jpg',
    description: "Sands of the Nile",
    leagueTitle: "Pharaoh League",
    mapImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Ancient_Egypt_map-en.svg/800px-Ancient_Egypt_map-en.svg.png",
    props: ['🌴', '🏺']
  },
  [CivType.BYZANTIUM]: {
    primary: 'bg-indigo-800',
    dark: 'bg-indigo-950',
    border: 'border-indigo-900',
    text: 'text-indigo-900',
    bgLight: 'bg-indigo-50',
    gradient: 'from-indigo-900 to-stone-900',
    accent: 'border-indigo-800',
    secondary: 'text-indigo-800',
    icon: '⛪',
    symbolUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Chi_Rho.svg/800px-Chi_Rho.svg.png',
    coverImage: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?q=80&w=800&auto=format&fit=crop',
    mascot: 'Justinian',
    mascotImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Mosaic_of_Justinian_I_-_Basilica_San_Vitale_%28Ravenna%29.jpg/640px-Mosaic_of_Justinian_I_-_Basilica_San_Vitale_%28Ravenna%29.jpg',
    description: "The Golden City",
    leagueTitle: "Imperial League",
    mapImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Justinian555AD.png/800px-Justinian555AD.png",
    props: ['⛪', '📜']
  },
  [CivType.PERSIA]: {
    primary: 'bg-teal-800',
    dark: 'bg-teal-950',
    border: 'border-teal-900',
    text: 'text-teal-900',
    bgLight: 'bg-teal-50',
    gradient: 'from-teal-900 to-stone-900',
    accent: 'border-teal-800',
    secondary: 'text-teal-800',
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


// --- DYNAMIC CURRICULUM FRAMEWORK (10 Units x ~10 Topics) ---

const UNIT_STRUCTURE = {
  [CivType.ROME]: [
    { title: "The Founding", topics: ["Romulus & Remus", "The Seven Kings", "Birth of Republic"] },
    { title: "The Republic", topics: ["Struggle of Orders", "Latin Wars", "Samnite Wars", "Pyrrhic Victory", "The Twelve Tables"] },
    { title: "Punic Wars", topics: ["Hannibal Crossing Alps", "Battle of Cannae", "Scipio Africanus", "Carthage Must Be Destroyed"] },
    { title: "Crisis", topics: ["The Gracchi Brothers", "Marius & Sulla", "Spartacus Revolt", "Social War"] },
    { title: "Fall of Republic", topics: ["First Triumvirate", "Caesar's Crossing", "Ides of March", "Antony & Cleopatra"] },
    { title: "The Empire", topics: ["Augustus Caesar", "Pax Romana", "The Mad Emperors (Caligula/Nero)", "Great Fire of Rome"] },
    { title: "Peak Power", topics: ["Trajan's Conquests", "Hadrian's Wall", "Marcus Aurelius", "The Antonine Plague"] },
    { title: "The Decline", topics: ["Crisis of 3rd Century", "Diocletian", "Constantine", "Battle of Milvian Bridge"] },
    { title: "Christian Rome", topics: ["Edict of Milan", "Council of Nicaea", "Theodosius", "End of Paganism"] },
    { title: "The Fall", topics: ["Sack of 410", "Attila the Hun", "Romulus Augustulus", "Legacy of Rome"] }
  ],
  [CivType.EGYPT]: [
    { title: "The Old Kingdom", topics: ["Gift of the Nile", "Narmer Unification", "Imhotep & Djoser"] },
    { title: "Age of Pyramids", topics: ["Great Pyramid of Giza", "The Sphinx", "Collapse of Old Kingdom", "Mummification"] },
    { title: "Middle Kingdom", topics: ["Mentuhotep II", "Literature & Art", "Hyksos Invasion"] },
    { title: "New Kingdom", topics: ["Ahmose I", "Hatshepsut", "Thutmose III", "Battle of Megiddo"] },
    { title: "The Heretic", topics: ["Akhenaten", "Nefertiti", "The Aten", "Amarna Art"] },
    { title: "The Boy King", topics: ["Tutankhamen", "Restoration", "The Tomb Discovery"] },
    { title: "Ramesside Era", topics: ["Ramesses II", "Battle of Kadesh", "Abu Simbel", "First Peace Treaty"] },
    { title: "Third Int. Period", topics: ["Sea Peoples", "Libyan Pharaohs", "Nubian Pharaohs", "Assyrian Invasion"] },
    { title: "Late Period", topics: ["Persian Conquest", "Alexander the Great", "Ptolemy I", "The Rosetta Stone"] },
    { title: "The End", topics: ["Library of Alexandria", "Cleopatra VII", "Roman Annexation", "Death of the Gods"] }
  ],
  [CivType.BYZANTIUM]: [
    { title: "New Rome", topics: ["The Great Split", "Constantine's City", "Theodosian Walls"] },
    { title: "Justinian's Age", topics: ["Justinian & Theodora", "Nika Riots", "Hagia Sophia", "Codex Justinianus"] },
    { title: "Reconquest", topics: ["Belisarius", "Gothic Wars", "Plague of Justinian", "Ravenna Mosaics"] },
    { title: "Survival", topics: ["Persian Wars", "Siege of 626", "Heraclius", "Battle of Yarmouk"] },
    { title: "Arab Invasions", topics: ["Loss of Egypt", "Greek Fire", "Siege of 717", "Theme System"] },
    { title: "Iconoclasm", topics: ["Smashing Icons", "Religious War", "Empress Irene", "Charlemagne"] },
    { title: "Golden Age", topics: ["Macedonian Dynasty", "Basil the Slayer", "Conversion of Rus", "Varangian Guard"] },
    { title: "Decline", topics: ["Great Schism", "Manzikert", "First Crusade", "Komnenian Restoration"] },
    { title: "The Latin Empire", topics: ["Sack of 1204", "Exile in Nicaea", "Reconquest of 1261"] },
    { title: "The End", topics: ["Ottoman Rise", "Siege of 1453", "Fall of Constantinople", "Legacy of Byzantium"] }
  ],
  [CivType.PERSIA]: [
    { title: "The Founding", topics: ["The Medes", "Cyrus the Great", "Conquest of Babylon"] },
    { title: "King of Kings", topics: ["Cambyses II", "Darius the Great", "The Satraps", "Behistun Inscription"] },
    { title: "Greco-Persian Wars", topics: ["Ionian Revolt", "Marathon", "Xerxes Invasion", "Thermopylae"] },
    { title: "High Empire", topics: ["Persepolis", "Zoroastrianism", "Royal Road", "Garden Paradise (Pairidaeza)"] },
    { title: "Decline", topics: ["Artaxerxes", "Court Intrigues", "Revolts", "March of the Ten Thousand"] },
    { title: "Alexander", topics: ["Battle of Gaugamela", "Burning of Persepolis", "Death of Darius III"] },
    { title: "Seleucids", topics: ["Hellenistic Rule", "Parthian Rise", "Silk Road", "Ctesiphon"] },
    { title: "Sassanids", topics: ["Ardashir I", "Shapur vs Rome", "Capture of Valerian", "Rock Reliefs"] },
    { title: "Golden Age", topics: ["Khosrow I", "Academy of Gundishapur", "Eternal Peace", "Mazdakite Movement"] },
    { title: "The Fall", topics: ["Byzantine War", "Islamic Conquest", "Battle of al-Qadisiyyah", "Survival of Culture"] }
  ]
};

// Hardcoded "Hero" lessons (Unit 1, Lessons 1-3) to ensure great first impression
const HARDCODED_LESSONS = [
  // ROME UNIT 1
  {
    id: 'rome-1-1',
    title: 'Brothers of Blood',
    description: 'The myth of Romulus and Remus',
    civ: CivType.ROME,
    unitId: 1,
    unitTitle: "The Founding",
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
        customImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/She-wolf_suckles_Romulus_and_Remus.jpg/640px-She-wolf_suckles_Romulus_and_Remus.jpg",
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
  
  // EGYPT UNIT 1
  {
    id: 'egypt-1-1',
    title: 'Gift of the Nile',
    description: 'Life in the Desert',
    civ: CivType.EGYPT,
    unitId: 1,
    unitTitle: "The Old Kingdom",
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
        customImage: "https://images.unsplash.com/photo-1572252009286-268acec5ca0a?q=80&w=800&auto=format&fit=crop",
        imageCredit: "The Nile River"
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

  // BYZANTIUM UNIT 1
  {
    id: 'byzantium-1-1',
    title: 'Crisis & Rebirth',
    description: 'Diocletian splits the world',
    civ: CivType.BYZANTIUM,
    unitId: 1,
    unitTitle: "New Rome",
    locked: false,
    completed: false,
    xpReward: 100,
    mapCoordinates: { x: 40, y: 40 },
    activities: [
      {
        id: 'b1-1',
        type: ActivityType.READING,
        question: 'The World in Chaos',
        narrative: "By the 3rd Century AD, the Roman Empire was dying. Inflation, civil war, and plague had brought it to its knees. Emperors were assassinated almost every year. It was too vast for one man to rule.",
        mascotGuidance: "Order had to be restored at any cost.",
        customImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Venice_-_The_Tetrarchs_03.jpg/640px-Venice_-_The_Tetrarchs_03.jpg",
        imageCredit: "The Tetrarchs"
      },
      {
        id: 'b1-2',
        type: ActivityType.READING,
        question: 'The Great Split',
        narrative: "Emperor Diocletian made a radical decision: he cut the map in half. He created the **Tetrarchy** (Rule of Four). The West would be ruled from Milan or Rome; the East from Nicomedia. This split saved the empire but doomed the West.",
        scholarNotes: "The East was far wealthier, with older cities and trade routes. The West was rural and vulnerable to barbarian incursions.",
        mascotGuidance: "Sometimes you must amputate a limb to save the body."
      },
      {
        id: 'b1-3',
        type: ActivityType.QUIZ,
        question: "What was the Tetrarchy?",
        options: ["Rule of One", "Rule of Four", "Democracy", "Anarchy"],
        correctAnswer: "Rule of Four"
      }
    ]
  },
  {
    id: 'byzantium-1-2',
    title: 'Nova Roma',
    description: 'Constantine founds the City',
    civ: CivType.BYZANTIUM,
    unitId: 1,
    unitTitle: "New Rome",
    locked: true,
    completed: false,
    xpReward: 120,
    mapCoordinates: { x: 42, y: 40 },
    activities: [
      {
        id: 'b2-1',
        type: ActivityType.READING,
        question: 'A New Capital',
        narrative: "Constantine the Great defeated his rivals and united the empire once more. But he hated Rome—it was pagan, corrupt, and far from the wealthy East. He looked to the strategic city of Byzantium on the **Bosporus Strait**.",
        mascotGuidance: "I needed a Christian capital for a Christian empire.",
        customImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Solidus-Constantine_I-Thessalonica-RIC_186.jpg/640px-Solidus-Constantine_I-Thessalonica-RIC_186.jpg",
        imageCredit: "Coin of Constantine"
      },
      {
        id: 'b2-2',
        type: ActivityType.MAP_CONQUEST,
        question: 'Locate the Bosporus Strait.',
        customImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Roman_Empire_with_diocesan_boundaries_300_AD.png/800px-Roman_Empire_with_diocesan_boundaries_300_AD.png",
        mapTarget: { x: 55, y: 38, label: "Constantinople" },
        mapQuiz: {
           question: "Why was this location chosen?",
           options: ["Good farming", "Controls trade between Europe & Asia", "Near Rome", "It was empty"],
           correctAnswer: "Controls trade between Europe & Asia"
        }
      }
    ]
  },
  {
    id: 'byzantium-1-3',
    title: 'The Walls',
    description: 'The Shield of God',
    civ: CivType.BYZANTIUM,
    unitId: 1,
    unitTitle: "New Rome",
    locked: true,
    completed: false,
    xpReward: 150,
    mapCoordinates: { x: 44, y: 40 },
    activities: [
      {
        id: 'b3-1',
        type: ActivityType.READING,
        question: 'Impregnable',
        narrative: "As the barbarians overran the West, Emperor Theodosius II built the greatest fortifications in history: The **Theodosian Walls**. Triple-layered, with a moat and massive towers, they would protect the city for a thousand years.",
        mascotGuidance: "Let the Huns come. They will break against stone.",
        customImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Theodosian_Walls.jpg/800px-Theodosian_Walls.jpg",
        imageCredit: "Theodosian Walls (Restored)"
      },
      {
        id: 'b3-2',
        type: ActivityType.QUIZ,
        question: "Who famously failed to breach the walls?",
        options: ["Attila the Hun", "Julius Caesar", "Alexander the Great", "Napoleon"],
        correctAnswer: "Attila the Hun"
      },
      {
        id: 'b3-3',
        type: ActivityType.SORTING,
        question: 'Order the Defenses (Out to In)',
        items: ['The Moat', 'Outer Wall', 'Inner Wall', 'The City'],
        correctOrder: ['The Moat', 'Outer Wall', 'Inner Wall', 'The City']
      }
    ]
  },

  // PERSIA UNIT 1
  {
    id: 'persia-1-1',
    title: 'The Rising Storm',
    description: 'Cyrus overthrows the Medes',
    civ: CivType.PERSIA,
    unitId: 1,
    unitTitle: "The Founding",
    locked: false,
    completed: false,
    xpReward: 100,
    mapCoordinates: { x: 60, y: 45 },
    activities: [
      {
        id: 'p1-1',
        type: ActivityType.READING,
        question: 'Vassals No More',
        narrative: "The Persians were a humble nomadic tribe, vassals to the powerful Median Empire. But **Cyrus the Great** united the Persian tribes and revolted against his own grandfather, the Median King Astyages. This was not just a rebellion; it was a revolution.",
        mascotGuidance: "Destiny is not given. It is seized.",
        customImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Achaemenid_Soldiers.jpg/800px-Achaemenid_Soldiers.jpg",
        imageCredit: "Persian Guards Frieze"
      },
      {
        id: 'p1-2',
        type: ActivityType.QUIZ,
        question: "Who did the Persians overthrow?",
        options: ["The Greeks", "The Medes", "The Romans", "The Egyptians"],
        correctAnswer: "The Medes"
      }
    ]
  },
  {
    id: 'persia-1-2',
    title: 'The Liberator',
    description: 'Conquest of Babylon',
    civ: CivType.PERSIA,
    unitId: 1,
    unitTitle: "The Founding",
    locked: true,
    completed: false,
    xpReward: 120,
    mapCoordinates: { x: 58, y: 48 },
    activities: [
      {
        id: 'p2-1',
        type: ActivityType.READING,
        question: 'The Fall of Babylon',
        narrative: "In 539 BC, Cyrus marched on Babylon, the greatest city on earth. Instead of a siege, he diverted the Euphrates river and marched his troops under the walls. But he did not sack the city. He entered as a liberator.",
        mascotGuidance: "I come in peace, so long as you kneel.",
        customImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Cyrus_Cylinder_front.jpg/640px-Cyrus_Cylinder_front.jpg",
        imageCredit: "The Cyrus Cylinder"
      },
      {
        id: 'p2-2',
        type: ActivityType.DECISION,
        question: 'The Temple of Marduk',
        narrative: "The priests of Babylon fear you will destroy their idols, as the Assyrians did. How do you treat their gods?",
        decisionContext: "Religious tolerance is a new concept in the ancient world.",
        decisionChoices: [
          { text: "Destroy the Idols", isCorrect: false, feedback: "The city revolts. You must now rule by fear." },
          { text: "Respect Marduk", isCorrect: true, feedback: "The priests proclaim you King of the Universe. You rule without bloodshed." }
        ]
      }
    ]
  },
  {
    id: 'persia-1-3',
    title: 'The Royal Road',
    description: 'Connecting the Empire',
    civ: CivType.PERSIA,
    unitId: 1,
    unitTitle: "The Founding",
    locked: true,
    completed: false,
    xpReward: 150,
    mapCoordinates: { x: 62, y: 46 },
    activities: [
      {
        id: 'p3-1',
        type: ActivityType.READING,
        question: 'Eyes and Ears',
        narrative: "To rule an empire stretching from India to Greece, you need speed. Darius I built the **Royal Road**. A messenger could travel 1,600 miles in 7 days using a relay system of fresh horses. It was the ancient internet.",
        mascotGuidance: "Neither snow nor rain nor heat nor gloom of night stays these couriers...",
        scholarNotes: "Herodotus's description of the Persian postal service is the motto of the US Postal Service today."
      },
      {
        id: 'p3-2',
        type: ActivityType.QUIZ,
        question: "What was a Satrap?",
        options: ["A Priest", "A Governor", "A Soldier", "A Slave"],
        correctAnswer: "A Governor"
      },
      {
        id: 'p3-3',
        type: ActivityType.MAP_CONQUEST,
        question: 'Trace the Royal Road from Susa to Sardis.',
        customImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Achaemenid_Empire_at_its_greatest_extent.png/800px-Achaemenid_Empire_at_its_greatest_extent.png",
        mapTarget: { x: 45, y: 40, label: "Sardis" },
        mapQuiz: {
            question: "What allowed the messengers to travel so fast?",
            options: ["Magic Carpets", "Relay Stations (Horses)", "Paved Roads only", "Boats"],
            correctAnswer: "Relay Stations (Horses)"
        }
      }
    ]
  }
];

// Generate the full curriculum (combines hardcoded + skeleton)
export const generateCurriculum = (): Lesson[] => {
  const allLessons: Lesson[] = [];

  // Iterate over each Civ
  Object.entries(UNIT_STRUCTURE).forEach(([civKey, units]) => {
    const civ = civKey as CivType;
    
    units.forEach((unit, unitIdx) => {
      const unitNum = unitIdx + 1;
      
      unit.topics.forEach((topic, topicIdx) => {
        const lessonNum = topicIdx + 1;
        const lessonId = `${civ.toLowerCase()}-${unitNum}-${lessonNum}`;
        
        // Check if hardcoded exists
        const hardcoded = HARDCODED_LESSONS.find(l => l.id === lessonId);
        
        if (hardcoded) {
          allLessons.push(hardcoded);
        } else {
          // Create Skeleton Lesson
          allLessons.push({
            id: lessonId,
            title: topic,
            description: `Unit ${unitNum} Lesson`,
            civ: civ,
            unitId: unitNum,
            unitTitle: unit.title,
            locked: true, // App.tsx handles unlocking logic
            completed: false,
            xpReward: 100,
            mapCoordinates: { x: 50 + (topicIdx * 5), y: 50 + (unitIdx * 5) }, // Dummy coords
            activities: [],
            isSkeleton: true,
            topic: topic
          });
        }
      });
    });
  });

  return allLessons;
};

export const LESSON_DATA = generateCurriculum();
