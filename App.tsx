
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

  const activeLesson = LESSON_DATA.find(l => l.id === activeLessonId);
  const currentCivLessons = LESSON_DATA.filter(l => l.civ === user?.currentCiv);
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

      // CRITICAL FIX: Update local state immediately with the result
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
    if (!user) return;
    
    const today = new Date().toDateString();
    const lastLogin = new Date(user.lastLoginDate).toDateString();
    let newStreak = user.streak;
    
    if (today !== lastLogin) {
        newStreak += 1; 
    }

    const updates = {
        xp: user.xp + earnedXp,
        completedLessons: [...user.completedLessons, activeLessonId!],
        streak: newStreak,
        lastLoginDate: new Date().toISOString()
    };
    
    const updatedUser = await updateUserProgress(user, updates);
    setUser(updatedUser);
    setActiveLessonId(null);
  };

  if (loading) return <div className="h-screen bg-slate-950 flex items-center justify-center text-amber-500 font-serif">Loading Chronos...</div>;

  if (!user) {
      return (
          <div className="h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden text-slate-100">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=1996&auto=format&fit=crop')] bg-cover opacity-20" />
              <div className="z-10 bg-slate-900/80 p-12 rounded-2xl border border-slate-700 backdrop-blur-sm text-center shadow-2xl animate-fade-in-up">
                  <h1 className="font-serif text-5xl text-amber-500 font-bold mb-4">CHRONOS</h1>
                  <p className="text-slate-300 mb-8 max-w-md">The history of the world is waiting. Join the legion.</p>
                  
                  <div className="flex flex-col gap-4">
                      <button 
                        onClick={() => handleOpenAuth('login')}
                        className="bg-amber-600 hover:bg-amber-500 text-white px-8 py-3 rounded-full font-bold transition-colors w-full"
                      >
                          Login / Sign Up
                      </button>
                      
                      <button 
                        onClick={handleGuestEntry}
                        className="text-slate-400 hover:text-white text-sm font-bold uppercase tracking-widest border-b border-transparent hover:border-slate-500 pb-1"
                      >
                          Continue as Guest
                      </button>
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
        return <Dashboard lessons={currentCivLessons} user={user} onStartLesson={startLesson} />;
      case 'league':
        return <League user={user} />;
      case 'map':
        return <EmpireMap user={user} />;
      case 'profile':
        return <Profile user={user} onUpdateUser={setUser} />;
      case 'settings':
        return <Settings user={user} onUpdateUser={setUser} />;
      default:
        return <Dashboard lessons={currentCivLessons} user={user} onStartLesson={startLesson} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden transition-colors duration-300">
      <BackgroundMusic volume={user.settings?.musicVolume ?? 0.3} currentCiv={user.currentCiv} />
      
      <Sidebar 
        user={user} 
        currentView={currentView} 
        onNavigate={setCurrentView} 
        onSwitchCiv={handleSwitchCiv}
        onOpenAuth={() => handleOpenAuth('signup')}
      />

      {isGuest && (
          <div className="absolute top-0 left-0 md:left-64 right-0 bg-amber-600/90 text-white px-4 py-2 z-30 flex items-center justify-between text-xs md:text-sm font-bold shadow-lg">
              <span>You are playing as a Guest. Sign up to save your progress!</span>
              <button 
                onClick={() => handleOpenAuth('signup')}
                className="bg-black/30 hover:bg-black/50 px-3 py-1 rounded"
              >
                  Save Progress
              </button>
          </div>
      )}

      <main className={`flex-1 md:ml-64 h-screen overflow-y-auto relative scroll-smooth ${isGuest ? 'pt-10' : ''}`}>
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
