

import React, { useState, useEffect } from 'react';
import { LESSON_DATA } from './constants';
import { UserState, CivType } from './types';
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
    
    if (isDark) {
        root.classList.add('dark');
    } else {
        root.classList.remove('dark');
    }
  }, [user?.settings?.theme]);

  // --- Dynamic Lesson State Logic ---
  const enrichLessons = (lessons: typeof LESSON_DATA, currentUser: UserState) => {
     return lessons.map((lesson, index) => {
         // Check if this specific lesson ID is in the user's completed list
         const isCompleted = currentUser.completedLessons.includes(lesson.id);
         
         // Logic for locking:
         // 1. If it's the first lesson of the CIV unit, it's unlocked by default.
         // 2. Otherwise, it unlocks only if the immediately preceding lesson is completed.
         let isLocked = true;
         if (index === 0) {
             isLocked = false;
         } else {
             const prevLesson = lessons[index - 1];
             if (currentUser.completedLessons.includes(prevLesson.id)) {
                 isLocked = false;
             }
         }
         
         // If a lesson is completed, it must be unlocked (sanity check)
         if (isCompleted) isLocked = false;
         
         return { ...lesson, completed: isCompleted, locked: isLocked };
     });
  };

  const currentCivRawLessons = LESSON_DATA.filter(l => l.civ === user?.currentCiv);
  const currentCivLessons = user ? enrichLessons(currentCivRawLessons, user) : [];
  
  const activeLesson = activeLessonId ? LESSON_DATA.find(l => l.id === activeLessonId) : null;
  
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
      
      const updates: Partial<UserState> = { 
          currentCiv: civ, 
          hasOnboarded: true 
      };
      
      if (name && name.trim().length > 0) {
          updates.displayName = name.trim();
      }

      const updatedUser = await updateUserProgress(user, updates);
      setUser(updatedUser);
  };

  const handleSwitchCiv = async (civ: CivType) => {
      if (!user) return;
      const updatedUser = await updateUserProgress(user, { currentCiv: civ });
      setUser(updatedUser);
      setCurrentView('dashboard');
  };

  const startLesson = (id: string) => {
    setActiveLessonId(id);
  };

  const completeLesson = async (earnedXp: number) => {
    if (!user || !activeLessonId) return;
    
    const today = new Date().toDateString();
    const lastLogin = new Date(user.lastLoginDate).toDateString();
    let newStreak = user.streak;
    
    // Simple streak logic: if logged in on a different day than last time, increment
    // Real prod logic would check if it's exactly the *next* day.
    if (today !== lastLogin) {
        newStreak += 1; 
    }

    // Prevent duplicate XP/Completion for same lesson
    let newCompleted = [...user.completedLessons];
    let xpToAdd = 0;
    
    if (!newCompleted.includes(activeLessonId)) {
        newCompleted.push(activeLessonId);
        xpToAdd = earnedXp;
    } else {
        // Reduced XP for replay
        xpToAdd = 10; 
    }

    const updates = {
        xp: user.xp + xpToAdd,
        completedLessons: newCompleted,
        streak: newStreak,
        lastLoginDate: new Date().toISOString()
    };
    
    // Save to backend/local
    const updatedUser = await updateUserProgress(user, updates);
    
    // Update local state immediately
    setUser(updatedUser);
    
    // Close lesson
    setActiveLessonId(null);
  };

  if (loading) return <div className="h-screen bg-white flex items-center justify-center text-slate-900 font-duo font-bold text-2xl">Loading Chronos...</div>;

  if (!user) {
      return (
          <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-duo text-center relative overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>

              <div className="max-w-4xl w-full flex flex-col md:flex-row items-center gap-12 z-10">
                  
                  {/* Hero Logo */}
                  <div className="flex-1 flex justify-center animate-bounce-slow">
                      <div className="w-64 h-64 md:w-80 md:h-80 relative">
                        {/* Glow */}
                        <div className="absolute inset-0 bg-amber-400 blur-3xl opacity-20 rounded-full"></div>
                        <img 
                            src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Hourglass_modern.svg/1200px-Hourglass_modern.svg.png" 
                            alt="Chronos Logo" 
                            className="relative w-full h-full object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                  </div>

                  {/* CTA Section */}
                  <div className="flex-1 flex flex-col items-center md:items-start gap-6">
                      <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 leading-tight">
                          History is not just dates. <br/>
                          <span className="text-amber-600">It's a story.</span>
                      </h1>
                      <p className="text-lg text-slate-500 font-medium max-w-md">
                          Experience the rise and fall of civilizations through interactive narratives and gamified lessons.
                      </p>
                      
                      <div className="w-full max-w-sm space-y-4 pt-4">
                          {/* PRIMARY: GET STARTED (SIGN UP) */}
                          <button 
                            onClick={() => handleOpenAuth('signup')}
                            className="w-full bg-amber-500 hover:bg-amber-400 text-white border-b-4 border-amber-700 active:border-b-0 active:translate-y-1 py-4 rounded-2xl font-extrabold text-sm uppercase tracking-widest transition-all shadow-xl"
                          >
                              Get Started
                          </button>
                          
                          {/* SECONDARY: LOGIN */}
                          <button 
                            onClick={() => handleOpenAuth('login')}
                            className="w-full bg-white hover:bg-gray-50 text-slate-700 border-2 border-gray-200 border-b-4 hover:border-gray-300 active:border-b-0 active:translate-y-1 py-4 rounded-2xl font-extrabold text-sm uppercase tracking-widest transition-all"
                          >
                              I already have an account
                          </button>

                          {/* TERTIARY: GUEST */}
                          <button 
                            onClick={() => handleGuestEntry()}
                            className="w-full text-slate-400 hover:text-slate-600 font-bold text-xs uppercase tracking-widest py-2 transition-colors"
                          >
                              Try as Guest
                          </button>
                      </div>
                  </div>
              </div>

              <AuthModal 
                isOpen={showAuthModal} 
                onClose={() => setShowAuthModal(false)} 
                onSuccess={(u) => setUser(u)}
                initialMode={authMode}
              />
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
      case 'dashboard':
        return <Dashboard lessons={currentCivLessons} user={user} onStartLesson={startLesson} onSwitchCiv={handleSwitchCiv} />;
      case 'league':
        return <League user={user} />;
      case 'map':
        return <EmpireMap user={user} />;
      case 'profile':
        return <Profile user={user} onUpdateUser={setUser} />;
      case 'settings':
        return <Settings user={user} onUpdateUser={setUser} />;
      default:
        return <Dashboard lessons={currentCivLessons} user={user} onStartLesson={startLesson} onSwitchCiv={handleSwitchCiv} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden transition-colors duration-300 font-duo">
      <BackgroundMusic volume={user.settings?.musicVolume ?? 0.3} currentCiv={user.currentCiv} />
      
      <Sidebar 
        user={user} 
        currentView={currentView} 
        onNavigate={setCurrentView} 
        onSwitchCiv={handleSwitchCiv}
        onOpenAuth={() => handleOpenAuth('signup')}
      />

      {isGuest && (
          <div className="absolute top-0 left-0 md:left-64 right-0 bg-amber-500 text-white px-4 py-3 z-30 flex items-center justify-center gap-4 text-sm font-bold shadow-sm">
              <span>Guest Mode Active. Data not synced.</span>
              <button 
                onClick={() => handleOpenAuth('signup')}
                className="bg-white text-amber-600 px-4 py-1 rounded-xl border-b-2 border-amber-200 active:border-b-0 active:translate-y-px transition-all uppercase text-xs tracking-wider"
              >
                  Save Progress
              </button>
          </div>
      )}

      <main className={`flex-1 md:ml-64 h-screen overflow-y-auto relative scroll-smooth ${isGuest ? 'pt-14' : ''}`}>
        {renderContent()}
      </main>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
        onSuccess={(u) => setUser(u)}
        initialMode={authMode}
      />
    </div>
  );
};

export default App;
