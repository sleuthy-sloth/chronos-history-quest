
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
    theme: 'dark'
  },
  avatarId: 'recruit_default',
  unlockedAvatars: ['recruit_default', 'scholar_default'],
  friends: []
};

// Production: Use AI Image Generation for dynamic placeholders
export const getImage = (keyword: string) => {
  const prompt = encodeURIComponent(`historical art style, detailed, cinematic lighting, ${keyword}`);
  return `https://image.pollinations.ai/prompt/${prompt}?width=1024&height=768&nologo=true&seed=${Math.random()}`;
};

export const CIV_MUSIC = {
  [CivType.ROME]: "https://cdn.pixabay.com/audio/2022/10/28/audio_650d32b554.mp3", // Epic/Orchestral
  [CivType.EGYPT]: "https://cdn.pixabay.com/audio/2023/05/23/audio_a1e5296048.mp3", // Middle Eastern/Flute
  [CivType.BYZANTIUM]: "https://cdn.pixabay.com/audio/2022/08/02/audio_884fe92c21.mp3", // Chanting/Ethereal
  [CivType.PERSIA]: "https://cdn.pixabay.com/audio/2024/09/11/audio_4024847e30.mp3" // Oud/Strings
};

export const CIV_THEMES = {
  [CivType.ROME]: {
    // Imperial Red & Gold - Darker, richer crimson
    primary: 'bg-[#4a0404]', 
    secondary: 'text-amber-500',
    accent: 'border-amber-600',
    gradient: 'from-[#4a0404] via-[#2d0202] to-slate-950',
    icon: '🦅', // Eagle of the Legion
    symbolUrl: 'https://image.pollinations.ai/prompt/golden%20roman%20imperial%20eagle%20aquila%20symbol%20statue%20metallic%20shiny%203d%20render%20black%20background%20cinematic%20lighting?width=512&height=512&nologo=true',
    coverImage: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=1996&auto=format&fit=crop', // Rome Colosseum/Forum
    texture: 'url("https://www.transparenttextures.com/patterns/black-scales.png")',
    mascot: 'Augustus',
    mascotImage: 'https://image.pollinations.ai/prompt/cinematic%20portrait%20of%20roman%20emperor%20augustus%20young%20handsome%20serious%20detailed%20face%20marble%20statue%20come%20to%20life?width=512&height=512&nologo=true',
    description: "The wolf that nursed the world... before devouring it.",
    leagueTitle: "Legion of Mars",
    mapImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Roman_Empire_Trajan_117AD.png/1280px-Roman_Empire_Trajan_117AD.png",
    props: ['🏛️', '🗡️', '🍷', '🛡️', '🍇', '🧱']
  },
  [CivType.EGYPT]: {
    // Lapis Lazuli & Desert Gold - Deep midnight blue
    primary: 'bg-[#001233]',
    secondary: 'text-[#FFD700]',
    accent: 'border-[#C5A059]',
    gradient: 'from-[#001233] via-[#000a1f] to-slate-950',
    icon: '👁️', // Eye of Horus
    symbolUrl: 'https://image.pollinations.ai/prompt/glowing%20golden%20eye%20of%20horus%20ancient%20egypt%20symbol%20magical%20artifact%20black%20background?width=512&height=512&nologo=true',
    coverImage: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?q=80&w=2070&auto=format&fit=crop', // Pyramids
    texture: 'url("https://www.transparenttextures.com/patterns/wall-4-light.png")',
    mascot: 'Tutankhamen',
    mascotImage: 'https://image.pollinations.ai/prompt/cinematic%20portrait%20of%20pharaoh%20tutankhamun%20young%20royal%20gold%20eyeliner%20detailed%20nemes%20headdress?width=512&height=512&nologo=true',
    description: "They built mountains of stone to challenge the sun itself.",
    leagueTitle: "Court of the Pharaoh",
    mapImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Ancient_Egypt_map-en.svg/836px-Ancient_Egypt_map-en.svg.png",
    props: ['🌴', '🐪', '🏺', '🦂', '☀️', '🐊']
  },
  [CivType.BYZANTIUM]: {
    // Tyrian Purple & Mosaic Gold - Royal, almost black purple
    primary: 'bg-[#2E021F]',
    secondary: 'text-[#FCD34D]',
    accent: 'border-[#FCD34D]',
    gradient: 'from-[#2E021F] via-[#1a0112] to-slate-950',
    icon: '⚓', // The Golden Horn / Maritime strength
    symbolUrl: 'https://image.pollinations.ai/prompt/golden%20chi%20rho%20symbol%20byzantine%20mosaic%20style%20glowing%20ornate%20jewels%20black%20background?width=512&height=512&nologo=true',
    coverImage: 'https://images.unsplash.com/photo-1541662580-b2c286561148?q=80&w=2070&auto=format&fit=crop', // Hagia Sophia interior vibe
    texture: 'url("https://www.transparenttextures.com/patterns/diagmonds-light.png")',
    mascot: 'Justinian',
    mascotImage: 'https://image.pollinations.ai/prompt/cinematic%20portrait%20of%20emperor%20justinian%20byzantine%20crown%20beard%20purple%20robe%20detailed%20mosaic%20style%20realistic?width=512&height=512&nologo=true',
    description: "A golden candle flickering against the coming dark.",
    leagueTitle: "Senate of Nova Roma",
    mapImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Justinian555AD.png/1280px-Justinian555AD.png",
    props: ['⛪', '🕯️', '⛵', '📜', '🕌', '🗝️']
  },
  [CivType.PERSIA]: {
    // Persian Turquoise & Clay - Vibrant teal against dark earth
    primary: 'bg-[#004d40]',
    secondary: 'text-[#ffab40]',
    accent: 'border-[#ffab40]',
    gradient: 'from-[#004d40] via-[#00332a] to-slate-950',
    icon: '🦁', // Lion of Babylon/Persia
    symbolUrl: 'https://image.pollinations.ai/prompt/golden%20ancient%20persian%20lion%20rhyton%20symbol%20metallic%20detailed%20black%20background?width=512&height=512&nologo=true',
    coverImage: 'https://images.unsplash.com/photo-1579975096649-e773152b04cb?q=80&w=2070&auto=format&fit=crop', // Persepolis/Reliefs
    texture: 'url("https://www.transparenttextures.com/patterns/woven-light.png")',
    mascot: 'Cyrus',
    mascotImage: 'https://image.pollinations.ai/prompt/cinematic%20portrait%20of%20cyrus%20the%20great%20persian%20king%20beard%20turban%20royal%20majestic%20detailed%20ancient?width=512&height=512&nologo=true',
    description: "The first empire to realize that tolerance is stronger than steel.",
    leagueTitle: "Satrapy of the Immortals",
    mapImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Achaemenid_Empire_at_its_greatest_extent.png/1280px-Achaemenid_Empire_at_its_greatest_extent.png",
    props: ['🏹', '🐎', '🔥', '🧱', '🦁', '🏺']
  }
};

export const CIV_PROLOGUES = {
  [CivType.ROME]: {
    quote: "To ravage, to slaughter, to usurp under false titles, they call empire; and where they make a desert, they call it peace.",
    author: "Tacitus",
    voice: "Fenrir"
  },
  [CivType.EGYPT]: {
    quote: "My name is Ozymandias, King of Kings; Look on my Works, ye Mighty, and despair! Nothing beside remains. Round the decay of that colossal Wreck, boundless and bare.",
    author: "Percy Bysshe Shelley",
    voice: "Fenrir"
  },
  [CivType.BYZANTIUM]: {
    quote: "If you wish to save yourself, Sire, it is not difficult. We have money, the sea is there, and the ships are waiting. But consider whether, after you have saved yourself, you may not wish that you had died.",
    author: "Empress Theodora (to Justinian)",
    voice: "Fenrir"
  },
  [CivType.PERSIA]: {
    quote: "I am Cyrus, King of the Universe, the Great King, the Powerful King, King of Babylon, King of the Four Quarters of the World.",
    author: "The Cyrus Cylinder",
    voice: "Fenrir"
  }
};

export const MASCOT_INTEL: Record<CivType, MascotIntel[]> = {
  [CivType.ROME]: [
    { fact: "I found Rome a city of bricks and left it a city of marble. You found this question difficult and left it... blank?", mood: 'witty' },
    { fact: "Fun fact: Romans used urine to whiten their teeth. Smile!", mood: 'fact' },
    { fact: "The Praetorian Guard auctioned off the Empire to the highest bidder in 193 AD. Loyalty has a price.", mood: 'dark' },
    { fact: "Decimation means executing 1 in 10 soldiers. Don't make me decimate your XP.", mood: 'dark' },
    { fact: "Julius Caesar was bald. He wore the laurel wreath to hide it. Vanity is eternal.", mood: 'witty' }
  ],
  [CivType.EGYPT]: [
    { fact: "I became Pharoah at nine years old. What have you achieved lately?", mood: 'witty' },
    { fact: "My tomb was the only one found intact. Everyone else was robbed. I guess I'm the winner.", mood: 'witty' },
    { fact: "They say there is a curse on my tomb. 'Death shall come on swift wings'. Just saying.", mood: 'dark' },
    { fact: "I reversed my father's religious revolution. The old gods are the best gods.", mood: 'fact' },
    { fact: "My famous gold mask weighs 22 pounds. Heavy is the head that wears the crown.", mood: 'fact' }
  ],
  [CivType.BYZANTIUM]: [
    { fact: "I built the Hagia Sophia. Solomon, I have outdone thee!", mood: 'witty' },
    { fact: "I codified Roman Law. Without me, your lawyers would be out of a job.", mood: 'fact' },
    { fact: "My wife Theodora convinced me not to flee during the riots. She wears the pants in this empire.", mood: 'witty' },
    { fact: "The Plague killed half the population of Constantinople. Wash your hands.", mood: 'dark' },
    { fact: "We call it the 'Roman Empire'. Historians call it 'Byzantine'. I don't care what you call it, just obey.", mood: 'witty' }
  ],
  [CivType.PERSIA]: [
    { fact: "We invented ice cream (Faloodeh) in 400 BC. You're welcome.", mood: 'fact' },
    { fact: "I created the first Charter of Human Rights. We were woke before it was cool.", mood: 'witty' },
    { fact: "Xerxes whipped the sea because a storm destroyed his bridge. Talk about anger management issues.", mood: 'witty' },
    { fact: "In our empire, if you lied, it was considered a sin worse than violence. Tell me the truth: did you guess that last answer?", mood: 'dark' },
    { fact: "We wear trousers. The Greeks wear skirts. Who is the civilized one really?", mood: 'witty' }
  ]
};

export const LEAGUE_BOT_POOL = {
  [CivType.ROME]: ['Marcus', 'Livia', 'Centurion_X', 'Scipio', 'Cicero_Fan', 'VeniVidiVici', 'BrutusNo'],
  [CivType.EGYPT]: ['Cleo_VII', 'Anubis_99', 'Scribe_Ani', 'Horus_Eye', 'Nile_Walker', 'Imhotep_Builds'],
  [CivType.BYZANTIUM]: ['Belisarius', 'Anna_Comnena', 'Greek_Fire', 'Justinian_Code', 'Hagia_Sofia', 'Varangian_Guard'],
  [CivType.PERSIA]: ['Xerxes_King', 'Immortal_1', 'Cyrus_Great', 'Satrap_Media', 'Darius_Rich', 'Zoroaster']
};

export const AVATARS: Avatar[] = [
  // --- Defaults ---
  {
    id: 'recruit_default',
    name: 'The Recruit',
    url: 'https://image.pollinations.ai/prompt/historical%20silhouette%20of%20a%20hooded%20traveler%20profile%20mystery%20ancient%20world%20digital%20art%20avatar?width=512&height=512&nologo=true&seed=101',
    rarity: 'common',
    description: 'A humble beginning to a legendary journey.'
  },
  {
    id: 'scholar_default',
    name: 'The Scholar',
    url: 'https://image.pollinations.ai/prompt/portrait%20of%20a%20young%20historical%20scholar%20holding%20a%20scroll%20library%20of%20alexandria%20background%20digital%20painting%20avatar?width=512&height=512&nologo=true&seed=102',
    rarity: 'common',
    description: 'Knowledge is the sharpest weapon.'
  },
  // --- Shop / Unlockables ---
  {
    id: 'rome_legionary',
    name: 'Legionary',
    url: 'https://image.pollinations.ai/prompt/cinematic%20portrait%20of%20a%20roman%20legionary%20soldier%20wearing%20galea%20helmet%20red%20cloak%20serious%20expression%20detailed%20armor?width=512&height=512&nologo=true&seed=201',
    rarity: 'rare',
    description: 'Strength and discipline.',
    cost: 500
  },
  {
    id: 'egypt_priest',
    name: 'High Priest',
    url: 'https://image.pollinations.ai/prompt/ancient%20egyptian%20high%20priest%20portrait%20gold%20jewelry%20bald%20linen%20robes%20temple%20background%20cinematic?width=512&height=512&nologo=true&seed=202',
    rarity: 'rare',
    description: 'Keeper of sacred mysteries.',
    cost: 500
  },
  {
    id: 'byz_emperor',
    name: 'Basileus',
    url: 'https://image.pollinations.ai/prompt/byzantine%20emperor%20portrait%20golden%20mosaic%20style%20purple%20robes%20crown%20halo%20effect%20majestic?width=512&height=512&nologo=true&seed=203',
    rarity: 'epic',
    description: 'Ruler of the Queen of Cities.',
    cost: 1500
  },
  {
    id: 'persia_immortal',
    name: 'The Immortal',
    url: 'https://image.pollinations.ai/prompt/persian%20immortal%20soldier%20elite%20warrior%20masked%20face%20scale%20armor%20spear%20ancient%20persia%20cinematic?width=512&height=512&nologo=true&seed=204',
    rarity: 'epic',
    description: 'The elite guard of the King of Kings.',
    cost: 1500
  },
  {
    id: 'philosopher_king',
    name: 'Philosopher King',
    url: 'https://image.pollinations.ai/prompt/greek%20philosopher%20king%20statue%20marble%20bust%20style%20dramatic%20lighting%20stoic%20expression%20classical%20art?width=512&height=512&nologo=true&seed=205',
    rarity: 'legendary',
    description: 'Awarded for completing all timelines.',
    unlockCondition: 'Complete all 4 Civilization paths.'
  }
];

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_step',
    title: 'The Journey Begins',
    description: 'Complete your first history lesson.',
    icon: '📜',
    condition: (u) => u.completedLessons.length >= 1
  },
  {
    id: 'streak_3',
    title: 'Momentum of History',
    description: 'Maintain a 3-day login streak.',
    icon: '🔥',
    condition: (u) => u.streak >= 3
  },
  {
    id: 'tribute_gods',
    title: 'Tribute to the Gods',
    description: 'Complete your first Egyptian civilization lesson.',
    icon: '👁️',
    condition: (u) => u.completedLessons.some(id => id.startsWith('egypt'))
  },
  {
    id: 'rome_novice',
    title: 'Civis Romanus',
    description: 'Complete 3 lessons in the Roman timeline.',
    icon: '🏛️',
    condition: (u) => u.completedLessons.filter(id => id.startsWith('rome')).length >= 3
  },
  {
    id: 'egypt_novice',
    title: 'Scribe of Thoth',
    description: 'Complete 3 lessons in the Egyptian timeline.',
    icon: '👁️',
    condition: (u) => u.completedLessons.filter(id => id.startsWith('egypt')).length >= 3
  },
  {
    id: 'byz_novice',
    title: 'Defender of the Walls',
    description: 'Complete 3 lessons in the Byzantine timeline.',
    icon: '⛪',
    condition: (u) => u.completedLessons.filter(id => id.startsWith('byz')).length >= 3
  },
  {
    id: 'persia_novice',
    title: 'King of Kings',
    description: 'Complete 3 lessons in the Persian timeline.',
    icon: '🦁',
    condition: (u) => u.completedLessons.filter(id => id.startsWith('persia')).length >= 3
  },
  {
    id: 'gem_hoarder',
    title: 'Treasury of Crassus',
    description: 'Amass 500 Gems.',
    icon: '💎',
    condition: (u) => u.gems >= 500
  }
];

// --- CURRICULUM DATA ---

export const LESSON_DATA: Lesson[] = [
  // ================= ROME =================
  {
    id: 'rome-1',
    title: 'Brothers of Blood',
    description: 'The myth of Romulus and Remus and the brutal founding of the city.',
    civ: CivType.ROME,
    locked: false,
    completed: false,
    xpReward: 100,
    mapCoordinates: { x: 44, y: 35 },
    activities: [
      {
        id: 'r1-0',
        type: ActivityType.ARTIFACT_EXPLORATION,
        question: 'Examine the Capitoline Wolf',
        narrative: 'Inspect the ancient bronze statue that symbolizes the founding of Rome. Find the hidden details.',
        customImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/She-wolf_suckles_Romulus_and_Remus.jpg/1024px-She-wolf_suckles_Romulus_and_Remus.jpg',
        imageCredit: 'Musei Capitolini',
        mascotGuidance: "Ah, the wolf that nursed my ancestors. Look closely at the twins—they were added centuries later during the Renaissance!",
        artifactHotspots: [
            { id: 'h1', x: 25, y: 40, label: 'The She-Wolf', description: 'The "Lupa" is an Etruscan bronze from the 5th century BC, though the twins were added during the Renaissance.' },
            { id: 'h2', x: 50, y: 75, label: 'The Twins', description: 'Romulus and Remus suckling. They were abandoned to die in the Tiber but saved by this beast.' },
            { id: 'h3', x: 70, y: 30, label: 'The Expression', description: 'Notice the alert, fierce gaze. Rome was born from survival and violence, not peace.' }
        ],
        scholarNotes: "While the wolf is ancient, recent carbon dating suggests it might actually be Medieval! History is often rewritten by science."
      },
      {
        id: 'r1-1',
        type: ActivityType.READING,
        question: 'The Sons of Mars',
        // Updated: Added Palatine Hill and Fratricide context
        narrative: "Romulus and Remus, sons of Mars, were abandoned in the Tiber but saved by a she-wolf. As adults, they decided to build a city but argued over the location. Romulus chose the Palatine Hill. The argument turned violent, and Romulus killed his own brother. Rome was built on blood.",
        customImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/She-wolf_suckles_Romulus_and_Remus.jpg/1024px-She-wolf_suckles_Romulus_and_Remus.jpg',
        imageCredit: 'Capitoline Wolf, Musei Capitolini',
        scholarNotes: "The killing of Remus was a warning: 'So perish all who cross my walls.' Rome put the State above family from Day 1.",
        mascotGuidance: "Fratricide is an ugly word, but a necessary act. One King, One Rome. A city divided cannot stand."
      },
      {
        id: 'r1-2',
        type: ActivityType.SORTING,
        question: 'Order the Myth',
        items: ['Twins abandoned', 'Saved by She-Wolf', 'Quarrel over Hills', 'Romulus kills Remus'],
        correctOrder: ['Twins abandoned', 'Saved by She-Wolf', 'Quarrel over Hills', 'Romulus kills Remus'],
        backgroundInfo: "Romulus stood on the Palatine, Remus on the Aventine. The birds favored Romulus, but the sword decided the victor.",
        mascotGuidance: "Put these events in order. And do not make a mistake, or you might end up like Remus."
      },
      {
        id: 'r1-3',
        type: ActivityType.READING,
        question: 'City of Outlaws',
        narrative: "Romulus needed men for his new city on the Palatine. He didn't invite kings; he opened the gates to criminals, exiles, and runaway slaves. To secure a future generation, they famously abducted women from the neighboring Sabine tribe.",
        customImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Poussin_-_L%27Enl%C3%A8vement_des_Sabines%2C_INV_7290.jpg/1280px-Poussin_-_L%27Enl%C3%A8vement_des_Sabines%2C_INV_7290.jpg',
        imageCredit: 'The Abduction of the Sabine Women, Poussin',
        mascotGuidance: "We were not born noble. We made ourselves noble through conquest. Rome welcomes all who can fight."
      },
      {
        id: 'r1-4',
        type: ActivityType.QUIZ,
        question: "Which hill did Romulus choose to found Rome upon?",
        options: ["Aventine", "Palatine", "Capitoline", "Esquiline"],
        correctAnswer: "Palatine",
        backgroundInfo: "The Palatine Hill became the home of emperors. It is where we get the word 'Palace'.",
        mascotGuidance: "My own house stands on this hill. It is the heart of the Empire. Choose wisely."
      }
    ]
  },
  {
    id: 'rome-2',
    title: 'The Seven Kings',
    description: 'From the warlord Romulus to the tyrant Tarquin.',
    civ: CivType.ROME,
    locked: true,
    completed: false,
    xpReward: 120,
    mapCoordinates: { x: 45, y: 38 },
    activities: [
      {
        id: 'r2-1',
        type: ActivityType.READING,
        question: 'From Priest to Tyrant',
        // Updated: Explicitly mentioned Numa as Priest and Tarquin as Tyrant
        narrative: "Rome had 7 kings. Romulus was the Founder. He was followed by Numa, the Priest King, who created the calendar and the Vestal Virgins. But the line ended with Tarquin the Proud, a violent tyrant who terrorized the people and ignored the Senate.",
        customImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Numa_Pompilius_and_the_Nymph_Egeria.jpg/800px-Numa_Pompilius_and_the_Nymph_Egeria.jpg',
        mascotGuidance: "Kings... a detestable title. Though I hold the power of a King, I would never use the word."
      },
      {
        id: 'r2-2',
        type: ActivityType.MATCHING,
        question: 'Match the King to his Role',
        pairs: [
          { term: 'Romulus', definition: 'Founder' },
          { term: 'Numa', definition: 'Priest' },
          { term: 'Tarquin', definition: 'Tyrant' }
        ],
        backgroundInfo: "The name 'Rex' (King) became a dirty word in Rome, forever associated with Tarquin's tyranny."
      },
      {
        id: 'r2-3',
        type: ActivityType.QUIZ,
        question: "Who was the last King of Rome?",
        options: ["Numa Pompilius", "Tarquin the Proud", "Servius Tullius", "Ancus Marcius"],
        correctAnswer: "Tarquin the Proud",
        backgroundInfo: "Tarquinius Superbus was expelled in 509 BC, marking the end of the Monarchy."
      }
    ]
  },
  {
    id: 'rome-3',
    title: 'Res Publica',
    description: 'The birth of the Republic and the oath against kings.',
    civ: CivType.ROME,
    locked: true,
    completed: false,
    xpReward: 150,
    mapCoordinates: { x: 42, y: 32 },
    activities: [
      {
        id: 'r3-1',
        type: ActivityType.READING,
        question: 'The Oath of Brutus',
        narrative: "After Tarquin's son assaulted the noblewoman Lucretia, Lucius Junius Brutus led a revolt. He swore by her blood that Rome would never again be ruled by a king. They established a 'Res Publica' (Public Affair), but deep class divisions remained between the rich Patricians and poor Plebeians.",
        customImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Gavin_Hamilton_-_The_Oath_of_Brutus.jpg/1280px-Gavin_Hamilton_-_The_Oath_of_Brutus.jpg',
        mascotGuidance: "A Republic is fragile. It requires virtue. When virtue fails, someone must... step in."
      },
      {
        id: 'r3-2',
        type: ActivityType.DECISION,
        question: 'The Senate Debate',
        // Updated: Contextualized the decision
        narrative: 'The Plebeians (commoners) have abandoned the city, refusing to fight in the army until they get rights. The Patricians (nobles) are furious. As Consul, you must solve this Strike of the Plebs.',
        decisionContext: 'The army is paralyzed without Plebeian soldiers.',
        decisionChoices: [
          { text: 'Crush them with the Legions', isCorrect: false, feedback: 'Disaster! The legions ARE the Plebeians. You have no army.' },
          { text: 'Appoint a Dictator', isCorrect: false, feedback: 'The people fear another Tarquin. They riot and burn the Senate.' },
          { text: 'Create the Tribune of the Plebs', isCorrect: true, feedback: 'Wise. You give the people a representative with Veto power. They return to the army.' }
        ]
      },
      {
        id: 'r3-3',
        type: ActivityType.MAP_CONQUEST,
        question: 'The Republic begins its expansion. Locate the Italian Peninsula.',
        customImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Roman_conquest_of_Italy.svg/1024px-Roman_conquest_of_Italy.svg.png',
        imageCredit: 'Roman Conquest of Italy, Wikimedia Commons',
        mapTarget: { x: 40, y: 55, label: 'Italy' },
        mapQuiz: {
            question: "Which mountain range runs down the spine of Italy?",
            options: ["The Alps", "The Apennines", "The Pyrenees", "The Carpathians"],
            correctAnswer: "The Apennines"
        }
      }
    ]
  },

  // ================= EGYPT =================
  {
    id: 'egypt-1',
    title: 'Gift of the Nile',
    description: 'Geography is destiny. The black land and the red land.',
    civ: CivType.EGYPT,
    locked: false,
    completed: false,
    xpReward: 100,
    mapCoordinates: { x: 50, y: 20 },
    activities: [
      {
        id: 'e1-1',
        type: ActivityType.PRIMARY_SOURCE,
        question: 'The Hymn to the Nile',
        narrative: 'Analyze this ancient text written in 2100 BC. What does it tell us about how Egyptians viewed their river?',
        sourceText: "Hail to thee, O Nile! Who manifests thyself over this land, and comes to give life to Egypt! Mysterious is thy issuing forth from the darkness... \n\nLord of the fish, during the inundation, no bird alights on the crops. You create the grain, you bring forth the barley, assuring perpetuity to the temples. If you cease your toil and your work, then all that exists is in anguish.",
        sourceAuthor: "Unknown Scribe, Middle Kingdom",
        options: ["It was viewed as a dangerous enemy", "It was worshipped as a god and provider", "It was used only for transportation", "It was ignored by the people"],
        correctAnswer: "It was worshipped as a god and provider",
        backgroundInfo: "The Nile's annual flood (inundation) was not feared but celebrated. It deposited the rich black silt that made farming possible in the desert.",
        scholarNotes: "The Egyptians called their land 'Kemet' (The Black Land) after this silt, distinguishing it from 'Deshret' (The Red Land) of the deadly desert.",
        mascotGuidance: "Without the Nile, my kingdom is but dust. Read the hymn carefully—do we fear the flood, or welcome it?"
      },
      {
        id: 'e1-2',
        type: ActivityType.READING,
        question: 'Guardians of the Dead',
        // Updated: Added Anubis content to prepare for Cipher
        narrative: "Life in Egypt revolved around the Nile and the Afterlife. They believed the god Anubis (Inpu), depicted with a Jackal's head, watched over the mummification process and weighed the hearts of the dead against the feather of truth.",
        customImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Egypt_Giza_Pyramids_Sphinx_and_Man_on_Camel_at_Sunset.jpg/1280px-Egypt_Giza_Pyramids_Sphinx_and_Man_on_Camel_at_Sunset.jpg',
        mascotGuidance: "I have met Anubis. His scale is exact. Ensure your heart is lighter than a feather."
      },
      {
        id: 'e1-3',
        type: ActivityType.CIPHER,
        question: 'Decipher the God',
        narrative: 'Translate the hieroglyphs to reveal the name of the Jackal God.',
        cipherSymbols: ['𓇋', '𓈖', '𓊪', '𓅱'], // i-n-p-w
        cipherCorrect: ['He', 'Who', 'Counts', 'Hearts'],
        cipherOptions: ['Sun', 'He', 'River', 'Who', 'Life', 'Counts', 'Hearts', 'Cat'],
        backgroundInfo: "Inpu (Anubis) was the guardian of the necropolis."
      },
      {
        id: 'e1-4',
        type: ActivityType.MAP_CONQUEST,
        question: 'The Nile flows North into the sea. Tap the Nile Delta.',
        customImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Ancient_Egypt_map-en.svg/800px-Ancient_Egypt_map-en.svg.png',
        mapTarget: { x: 45, y: 15, label: 'Delta' },
        mapQuiz: {
            question: "Into which sea does the Nile River flow?",
            options: ["Red Sea", "Mediterranean Sea", "Dead Sea", "Black Sea"],
            correctAnswer: "Mediterranean Sea"
        }
      }
    ]
  },
  {
    id: 'egypt-2',
    title: 'The Double Crown',
    description: 'Narmer unifies the Two Lands.',
    civ: CivType.EGYPT,
    locked: true,
    completed: false,
    xpReward: 120,
    mapCoordinates: { x: 50, y: 45 },
    activities: [
      {
        id: 'e2-1',
        type: ActivityType.READING,
        question: 'The Pschent',
        // Updated: Explicitly named the Pschent
        narrative: "King Narmer unified the two lands of Egypt. To show his total power, he combined the White Crown of the South and the Red Crown of the North into a single headdress: the Double Crown, or 'Pschent'.",
        customImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Narmer_Palette.jpg/800px-Narmer_Palette.jpg',
        imageCredit: 'The Narmer Palette, Cairo Museum',
        mascotGuidance: "One land, one King. I wear the Double Crown to show that I rule both the reed and the bee."
      },
      {
        id: 'e2-2',
        type: ActivityType.QUIZ,
        question: "What symbol represents the unified Egypt?",
        options: ["The Double Crown (Pschent)", "The Ankh", "The Crook and Flail", "The Sphinx"],
        correctAnswer: "The Double Crown (Pschent)",
        backgroundInfo: "It symbolized dominion over both the Nile Valley and the Delta."
      },
      {
        id: 'e2-3',
        type: ActivityType.SORTING,
        question: 'Rise of the Pharaohs',
        items: ['Warring Tribes', 'King Narmer Conquers', 'Unification', 'First Dynasty'],
        correctOrder: ['Warring Tribes', 'King Narmer Conquers', 'Unification', 'First Dynasty']
      }
    ]
  },
  {
    id: 'egypt-3',
    title: 'Age of Pyramids',
    description: 'Imhotep, Djoser, and the stairway to heaven.',
    civ: CivType.EGYPT,
    locked: true,
    completed: false,
    xpReward: 150,
    mapCoordinates: { x: 48, y: 25 },
    activities: [
      {
        id: 'e3-1',
        type: ActivityType.READING,
        question: 'Machines of Resurrection',
        // Updated: Mentioned purpose of pyramids
        narrative: "Imhotep designed the Step Pyramid for Pharaoh Djoser by stacking mastabas (bench tombs). These weren't just monuments; they were 'Resurrection Machines'. Their shape was a stairway for the King's soul to ascend to the stars and join the sun god Ra.",
        customImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Saqqara_pyramid_ver_2.jpg/1024px-Saqqara_pyramid_ver_2.jpg',
        imageCredit: 'Pyramid of Djoser, Saqqara'
      },
      {
        id: 'e3-2',
        type: ActivityType.MATCHING,
        question: 'Match the Term',
        pairs: [
          { term: 'Mastaba', definition: 'Bench Tomb' },
          { term: 'Imhotep', definition: 'Architect' },
          { term: 'Djoser', definition: 'The Pharaoh' }
        ]
      },
      {
        id: 'e3-3',
        type: ActivityType.QUIZ,
        question: "What were the Pyramids built for?",
        options: ["Grain Storage", "Tombs for Kings", "Temples for Ra", "Palaces"],
        correctAnswer: "Tombs for Kings",
        backgroundInfo: "They ensured the Pharaoh's Ka (soul) lived forever."
      }
    ]
  },

  // ================= BYZANTIUM =================
  {
    id: 'byz-1',
    title: 'Crisis & Rebirth',
    description: 'How the Roman Empire almost died, and how it split.',
    civ: CivType.BYZANTIUM,
    locked: false,
    completed: false,
    xpReward: 100,
    mapCoordinates: { x: 40, y: 40 },
    activities: [
      {
        id: 'b1-1',
        type: ActivityType.READING,
        question: 'The Great Split',
        // Updated: Contrasted East vs West wealth
        narrative: "To save the crumbling empire, Diocletian split it into four parts. The Western half was rural and poor. The Eastern half (Greece, Egypt, Turkey) was urban, rich, and spoke Greek. This division would determine the future of Europe.",
        customImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Venice_-_The_Tetrarchs_03.jpg/800px-Venice_-_The_Tetrarchs_03.jpg',
        imageCredit: 'The Tetrarchs, St Mark\'s Basilica',
        mascotGuidance: "Rome had grown too large for one man. But dividing power... that often leads to blood."
      },
      {
        id: 'b1-2',
        type: ActivityType.MATCHING,
        question: 'Match the Reform',
        pairs: [
          { term: 'Diocletian', definition: 'The Splitter' },
          { term: 'Tetrarchy', definition: 'Rule of Four' },
          { term: 'East', definition: 'Rich & Greek' }
        ]
      },
      {
        id: 'b1-3',
        type: ActivityType.QUIZ,
        question: "Which half of the Empire was wealthier?",
        options: ["The East", "The West"],
        correctAnswer: "The East",
        backgroundInfo: "The East survived for 1,000 years after the West fell.",
        mascotGuidance: "The West had only forests and barbarians. We in the East had the silk, the grain, and the gold."
      }
    ]
  },
  {
    id: 'byz-2',
    title: 'Nova Roma',
    description: 'Constantine founds the city that changes the world.',
    civ: CivType.BYZANTIUM,
    locked: true,
    completed: false,
    xpReward: 120,
    mapCoordinates: { x: 55, y: 40 },
    activities: [
      {
        id: 'b2-1',
        type: ActivityType.READING,
        question: 'The New Capital',
        // Updated: Explicitly mentioned Nova Roma name
        narrative: "Emperor Constantine moved the capital to the Greek city of Byzantium on the Bosporus Strait. He officially named it 'Nova Roma' (New Rome), but history would remember it as the City of Constantine: Constantinople.",
        customImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Constantinople_3d_reconstruction_by_Byzantium_1200.jpg/1280px-Constantinople_3d_reconstruction_by_Byzantium_1200.jpg',
        imageCredit: 'Reconstruction of Constantinople'
      },
      {
        id: 'b2-2',
        type: ActivityType.MAP_CONQUEST,
        question: 'Tap the location of Constantinople.',
        customImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Roman_Empire_with_diocesan_boundaries_300_AD.png/1280px-Roman_Empire_with_diocesan_boundaries_300_AD.png',
        imageCredit: 'Roman Empire 300AD, Wikimedia Commons',
        mapTarget: { x: 55, y: 38, label: 'Constantinople' },
        mapQuiz: {
            question: "Constantinople sits on which strategic strait?",
            options: ["The Dardanelles", "The Bosporus", "Gibraltar", "The Corinth Canal"],
            correctAnswer: "The Bosporus"
        }
      },
      {
        id: 'b2-3',
        type: ActivityType.QUIZ,
        question: "What did Constantine rename the city?",
        options: ["Nova Roma", "Alexandria", "Athens II", "Petrus"],
        correctAnswer: "Nova Roma",
        backgroundInfo: "It was intended to be a Christian Rome, free from the pagan past."
      }
    ]
  },
  {
    id: 'byz-3',
    title: 'The Walls',
    description: 'The greatest defensive fortifications in history.',
    civ: CivType.BYZANTIUM,
    locked: true,
    completed: false,
    xpReward: 150,
    mapCoordinates: { x: 56, y: 38 },
    activities: [
      {
        id: 'b3-1',
        type: ActivityType.READING,
        question: 'The Shield of God',
        // Updated: Mentioned Ottoman Cannons
        narrative: "The Theodosian Walls were a triple-layered defense system that protected the city for a millennium. Attila the Hun couldn't break them. The Arabs couldn't climb them. It wasn't until 1453, with the invention of massive Ottoman cannons, that the walls finally fell.",
        customImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Theodosian_Walls.jpg/1280px-Theodosian_Walls.jpg'
      },
      {
        id: 'b3-2',
        type: ActivityType.SORTING,
        question: 'Order the Defenses (Outside In)',
        items: ['The Moat', 'Low Outer Wall', 'Massive Inner Wall', 'The City'],
        correctOrder: ['The Moat', 'Low Outer Wall', 'Massive Inner Wall', 'The City']
      },
      {
        id: 'b3-3',
        type: ActivityType.QUIZ,
        question: "What finally breached the walls in 1453?",
        options: ["Giant Cannons", "Wooden Horse", "Earthquake", "Treachery"],
        correctAnswer: "Giant Cannons",
        backgroundInfo: "The 'Basilic' cannon was 27 feet long and fired a 1,200 lb stone ball."
      }
    ]
  },

  // ================= PERSIA =================
  {
    id: 'persia-1',
    title: 'The Rising Storm',
    description: 'From vassals to conquerors. The Medes and the Persians.',
    civ: CivType.PERSIA,
    locked: false,
    completed: false,
    xpReward: 100,
    mapCoordinates: { x: 60, y: 45 },
    activities: [
      {
        id: 'p1-1',
        type: ActivityType.READING,
        question: 'Horse Lords',
        narrative: "The Persians were originally a nomadic vassal tribe living in the shadow of the Medes. They were expert horsemen who relied on the composite bow. Under Cyrus, they overthrew their Median overlords and stormed out of the Iranian Plateau.",
        customImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Achaemenid_Soldiers.jpg/1280px-Achaemenid_Soldiers.jpg',
        imageCredit: 'Achaemenid Frieze, Persepolis',
        mascotGuidance: "My people were not city builders initially. We were riders. The bow is the extension of the Persian soul."
      },
      {
        id: 'p1-2',
        type: ActivityType.MAP_CONQUEST,
        question: 'Locate the Iranian Plateau, the heartland of Persia.',
        customImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Achaemenid_Empire_map.png/1280px-Achaemenid_Empire_map.png',
        mapTarget: { x: 55, y: 50, label: 'Persis' },
        mapQuiz: {
            question: "Which mountain range shields the Iranian Plateau from the North?",
            options: ["The Alps", "The Alborz", "The Himalayas", "The Andes"],
            correctAnswer: "The Alborz"
        }
      },
      {
        id: 'p1-3',
        type: ActivityType.QUIZ,
        question: "What was the main weapon of Persian warfare?",
        options: ["The Bow", "The Phalanx", "The Chariot", "The Elephant"],
        correctAnswer: "The Bow",
        backgroundInfo: "They would darken the sky with arrows to break enemy formations before charging."
      }
    ]
  },
  {
    id: 'persia-2',
    title: 'The Liberator',
    description: 'Cyrus the Great takes Babylon without a fight.',
    civ: CivType.PERSIA,
    locked: true,
    completed: false,
    xpReward: 120,
    mapCoordinates: { x: 45, y: 50 },
    activities: [
      {
        id: 'p2-1',
        type: ActivityType.READING,
        question: 'A New Kind of King',
        // Updated: Contrasted with Assyrians
        narrative: "Unlike the Assyrians, who ruled by terror and flayed their enemies, Cyrus ruled by tolerance. When he conquered Babylon, he paid respect to their chief god, Marduk. He allowed the exiled Jews to return home. He conquered hearts, not just land.",
        customImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Cyrus_Cylinder_front.jpg/1024px-Cyrus_Cylinder_front.jpg',
        imageCredit: 'The Cyrus Cylinder, British Museum',
        mascotGuidance: "Why rule by fear when you can rule by love? A happy subject pays taxes. A dead one pays nothing."
      },
      {
        id: 'p2-2',
        type: ActivityType.DECISION,
        question: "The Gates of Babylon",
        narrative: "The priests of Marduk offer to open the gates if you respect their god.",
        decisionContext: "The Assyrian way would be to burn the temple.",
        decisionChoices: [
          { text: "Sack the city", isCorrect: false, feedback: "You gain gold, but the people revolt. You are just another tyrant." },
          { text: "Respect Marduk & The Priests", isCorrect: true, feedback: "History remembers you as a messiah. You take the greatest city on earth without shedding blood." }
        ]
      },
      {
        id: 'p2-3',
        type: ActivityType.MATCHING,
        question: 'Match the Policy',
        pairs: [
          { term: 'Assyrians', definition: 'Rule by Terror' },
          { term: 'Persians', definition: 'Rule by Tolerance' },
          { term: 'Babylon', definition: 'The Great City' }
        ]
      }
    ]
  },
  {
    id: 'persia-3',
    title: 'The Royal Road',
    description: 'Connecting the world\'s largest empire.',
    civ: CivType.PERSIA,
    locked: true,
    completed: false,
    xpReward: 150,
    mapCoordinates: { x: 35, y: 35 },
    activities: [
      {
        id: 'p3-1',
        type: ActivityType.READING,
        question: 'The King\'s Eyes',
        narrative: "To govern such a vast empire, Darius I divided it into 20 provinces ruled by governors called 'Satraps'. He connected them with the Royal Road. A message could travel 1,600 miles in just 7 days using a relay of fresh horses.",
        customImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Darius_I_the_Great_receiving_homage.jpg/1280px-Darius_I_the_Great_receiving_homage.jpg'
      },
      {
        id: 'p3-2',
        type: ActivityType.SORTING,
        question: 'How the Relay Works',
        items: ['King sends message', 'Rider gallops to station', 'Fresh horse swapped', 'Next rider takes over'],
        correctOrder: ['King sends message', 'Rider gallops to station', 'Fresh horse swapped', 'Next rider takes over'],
      },
      {
        id: 'p3-3',
        type: ActivityType.QUIZ,
        question: "What is a Satrap?",
        options: ["A Governor", "A Priest", "A General", "A Slave"],
        correctAnswer: "A Governor",
        backgroundInfo: "Satraps collected taxes and raised armies, but were watched by spies known as the 'King's Ears'."
      }
    ]
  }
];
