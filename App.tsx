
import React, { useState, useEffect } from 'react';
import { LESSON_DATA } from './constants';
import { UserState, CivType, Lesson } from './types';
import Sidebar from './components/Sidebar';
import BackgroundMusic from './components/BackgroundMusic';
import Dashboard from './pages/Dashboard';
import LessonView from './pages/LessonView';
import EmpireMap from './pages/EmpireMap';
import Onboarding from './pages/Onboarding';
import League from './pages/League';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import AuthModal from './components/AuthModal';
import CivSwitcher from './components/CivSwitcher';
import { 
  subscribeToAuthChanges, 
  updateUserProgress, 
  createGuestUser 
} from './services/firebase';

const App: React.FC = () => {
  const [user, setUser] = useState<UserState | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState('dashboard');
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login'|'signup'>('login');
  const [showCivSwitcher, setShowCivSwitcher] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((u) => {
        setUser(u);
        setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    const theme = user.settings?.theme || 'dark';
    const root = window.document.documentElement;
    let isDark = theme === 'dark';
    if (theme === 'system') {
        isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    if (isDark) root.classList.add('dark');
    else root.classList.remove('dark');
  }, [user?.settings?.theme]);

  // Merge Static Curriculum with User-Generated AI Lessons
  const getMergedLessons = (currentUser: UserState) => {
      if (!currentUser) return [];
      
      const civRaw = LESSON_DATA.filter(l => l.civ === currentUser.currentCiv);
      
      return civRaw.map(staticLesson => {
          // If the user has a generated version of this lesson cached, use it
          if (currentUser.generatedLessons && currentUser.generatedLessons[staticLesson.id]) {
              return currentUser.generatedLessons[staticLesson.id];
          }
          return staticLesson;
      });
  };

  const enrichLessons = (lessons: Lesson[], currentUser: UserState) => {
     return lessons.map((lesson, index) => {
         const isCompleted = currentUser.completedLessons.includes(lesson.id);
         let isLocked = true;
         if (index === 0) isLocked = false;
         else {
             const prevLesson = lessons[index - 1];
             if (currentUser.completedLessons.includes(prevLesson.id)) isLocked = false;
         }
         if (isCompleted) isLocked = false;
         return { ...lesson, completed: isCompleted, locked: isLocked };
     });
  };

  const rawLessons = user ? getMergedLessons(user) : [];
  const currentCivLessons = user ? enrichLessons(rawLessons, user) : [];
  const activeLesson = activeLessonId ? rawLessons.find(l => l.id === activeLessonId) : null;
  const isGuest = user && user.uid.startsWith('guest-');

  // --- Handlers ---

  const handleOpenAuth = (mode: 'login' | 'signup') => {
      setAuthMode(mode);
      setShowAuthModal(true);
  };

  const handleGuestEntry = () => {
      const guest = createGuestUser();
      setUser(guest);
  };

  const handleOnboardCiv = async (civ: CivType, name?: string) => {
      if (!user) return;
      const updates: Partial<UserState> = { currentCiv: civ, hasOnboarded: true };
      if (name?.trim()) updates.displayName = name.trim();
      const updatedUser = await updateUserProgress(user, updates);
      setUser(updatedUser);
  };

  const handleSwitchCiv = async (civ: CivType) => {
      if (!user) return;
      const updatedUser = await updateUserProgress(user, { currentCiv: civ });
      setUser(updatedUser);
      setCurrentView('dashboard');
  };

  const startLesson = (id: string) => { setActiveLessonId(id); };

  const completeLesson = async (earnedXp: number, generatedLesson?: Lesson) => {
    if (!user || !activeLessonId) return;
    
    const today = new Date().toDateString();
    const lastLogin = new Date(user.lastLoginDate).toDateString();
    let newStreak = user.streak;
    if (today !== lastLogin) newStreak += 1;

    let newCompleted = [...user.completedLessons];
    let xpToAdd = 0;
    if (!newCompleted.includes(activeLessonId)) {
        newCompleted.push(activeLessonId);
        xpToAdd = earnedXp;
    } else xpToAdd = 10;

    const updates: Partial<UserState> = {
        xp: user.xp + xpToAdd,
        completedLessons: newCompleted,
        streak: newStreak,
        lastLoginDate: new Date().toISOString()
    };

    // Save generated content to persist it
    if (generatedLesson) {
        updates.generatedLessons = {
            ...user.generatedLessons,
            [generatedLesson.id]: generatedLesson
        };
    }
    
    const updatedUser = await updateUserProgress(user, updates);
    setUser(updatedUser);
    setActiveLessonId(null);
  };

  if (loading) return <div className="h-screen bg-stone-100 flex items-center justify-center text-stone-900 font-serif font-bold text-2xl uppercase tracking-widest">Initializing Chronos...</div>;

  if (!user) {
      return (
          <div className="min-h-screen bg-stone-100 flex flex-col items-center justify-center p-6 font-serif text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>
              <div className="max-w-4xl w-full flex flex-col md:flex-row items-center gap-12 z-10">
                  <div className="flex-1 flex justify-center animate-bounce-slow">
                      <div className="w-64 h-64 md:w-80 md:h-80 relative">
                        <div className="absolute inset-0 bg-amber-500 blur-3xl opacity-20 rounded-full"></div>
                        <img 
                            src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Hourglass_modern.svg/1200px-Hourglass_modern.svg.png" 
                            alt="Chronos Logo" 
                            className="relative w-full h-full object-contain drop-shadow-2xl"
                        />
                      </div>
                  </div>
                  <div className="flex-1 flex flex-col items-center md:items-start gap-6">
                      <h1 className="text-4xl md:text-5xl font-black text-stone-800 leading-tight tracking-tight uppercase">
                          HISTORY <span className="text-amber-700">REFORGED</span>
                      </h1>
                      <p className="text-lg text-stone-600 font-medium max-w-md leading-relaxed">
                          Tactical lessons. Immersive narratives. <br/>A living timeline.
                      </p>
                      <div className="w-full max-w-sm space-y-4 pt-4">
                          <button onClick={() => handleOpenAuth('signup')} className="w-full bg-amber-700 hover:bg-amber-600 text-white border-2 border-amber-900 shadow-lg py-4 rounded-lg font-bold text-sm uppercase tracking-widest transition-all">
                              Begin Campaign
                          </button>
                          <button onClick={() => handleOpenAuth('login')} className="w-full bg-white hover:bg-stone-50 text-stone-800 border-2 border-stone-300 py-4 rounded-lg font-bold text-sm uppercase tracking-widest transition-all shadow-sm">
                              Resume Operation
                          </button>
                          <button onClick={() => handleGuestEntry()} className="w-full text-stone-400 hover:text-stone-600 font-bold text-xs uppercase tracking-widest py-2 transition-colors">
                              Guest Clearance
                          </button>
                      </div>
                  </div>
              </div>
              <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} onSuccess={(u) => setUser(u)} initialMode={authMode} />
          </div>
      )
  }

  if (!user.hasOnboarded) {
      return <Onboarding onSelectCiv={handleOnboardCiv} />;
  }

  if (activeLesson) {
    return (
      <LessonView 
        lesson={activeLesson} 
        onExit={() => setActiveLessonId(null)}
        onComplete={completeLesson}
        sfxVolume={user.settings?.sfxVolume ?? 0.5}
      />
    );
  }

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard': return <Dashboard lessons={currentCivLessons} user={user} onStartLesson={startLesson} onSwitchCiv={() => setShowCivSwitcher(true)} />;
      case 'league': return <League user={user} />;
      case 'map': return <EmpireMap user={user} />;
      case 'profile': return <Profile user={user} onUpdateUser={setUser} />;
      case 'settings': return <Settings user={user} onUpdateUser={setUser} />;
      default: return <Dashboard lessons={currentCivLessons} user={user} onStartLesson={startLesson} onSwitchCiv={() => setShowCivSwitcher(true)} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 overflow-hidden transition-colors duration-300 font-serif">
      <BackgroundMusic volume={user.settings?.musicVolume ?? 0.3} currentCiv={user.currentCiv} />
      <Sidebar user={user} currentView={currentView} onNavigate={setCurrentView} onSwitchCiv={(c) => handleSwitchCiv(c)} onOpenAuth={() => handleOpenAuth('signup')} />
      {isGuest && (
          <div className="absolute top-0 left-0 md:left-64 right-0 bg-amber-700 text-white px-4 py-2 z-30 flex items-center justify-center gap-4 text-[10px] font-bold shadow-md uppercase tracking-widest">
              <span>Guest Mode</span>
              <button onClick={() => handleOpenAuth('signup')} className="bg-white text-amber-800 px-3 py-0.5 rounded-sm border border-amber-900 transition-all">Save Data</button>
          </div>
      )}
      <main className={`flex-1 md:ml-64 h-screen overflow-y-auto relative scroll-smooth ${isGuest ? 'pt-10' : ''}`}>
        {renderContent()}
      </main>
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} onSuccess={(u) => setUser(u)} initialMode={authMode} />
      <CivSwitcher isOpen={showCivSwitcher} onClose={() => setShowCivSwitcher(false)} currentCiv={user.currentCiv} onSelect={handleSwitchCiv} />
    </div>
  );
};

export default App;
