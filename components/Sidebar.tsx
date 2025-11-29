import React, { useState } from 'react';
import { UserState, CivType } from '../types';
import { CIV_THEMES } from '../constants';

interface Props {
  user: UserState;
  onNavigate: (view: string) => void;
  onSwitchCiv: (civ: CivType) => void;
  onOpenAuth: () => void;
  currentView: string;
}

const Sidebar: React.FC<Props> = ({ user, onNavigate, onSwitchCiv, onOpenAuth, currentView }) => {
  const [showCivMenu, setShowCivMenu] = useState(false);
  const theme = CIV_THEMES[user.currentCiv];
  const isGuest = user.uid.startsWith('guest-');

  const navItems = [
    { id: 'dashboard', label: 'Learn', icon: '🏠' },
    { id: 'league', label: 'Leaderboard', icon: '🛡️' },
    { id: 'map', label: 'Quests', icon: '🗺️' },
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'settings', label: 'More', icon: '⋯' },
  ];

  return (
    <div className="fixed bottom-0 left-0 w-full h-20 md:h-screen md:w-64 bg-white dark:bg-slate-900 border-t md:border-t-0 md:border-r border-duo-gray dark:border-slate-800 flex md:flex-col z-40">
      
      {/* Brand Header */}
      <div className="hidden md:flex flex-col items-start p-6 pb-2">
        <h1 className="font-duo text-3xl text-duo-green font-extrabold tracking-tight cursor-pointer" onClick={() => onNavigate('dashboard')}>
            CHRONOS
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex md:flex-col justify-evenly md:justify-start md:px-4 md:gap-2 w-full">
        {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`
                  group flex md:flex-row flex-col items-center gap-1 md:gap-5 p-2 md:px-4 md:py-3 rounded-xl transition-all flex-1 md:flex-none justify-center md:justify-start
                  ${isActive 
                    ? 'bg-duo-blue/10 text-duo-blue border-duo-blue/30' 
                    : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-800 dark:text-slate-400'}
                `}
              >
                <span className={`text-2xl md:text-xl font-bold ${isActive ? 'scale-110' : ''}`}>{item.icon}</span>
                <span className={`text-[10px] md:text-sm font-bold uppercase tracking-widest md:tracking-wide ${isActive ? 'text-duo-blue' : 'text-gray-500 dark:text-slate-400'}`}>
                  {item.label}
                </span>
              </button>
            );
        })}
      </nav>

      {/* Civ Switcher (Mobile/Desktop) */}
      <div className="hidden md:block p-4">
            <button 
                onClick={() => setShowCivMenu(!showCivMenu)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl border-2 border-b-4 transition-all active:border-b-2 active:translate-y-1 ${theme.bgLight} ${theme.border} ${theme.text}`}
            >
                <span className="text-xl">{theme.icon}</span>
                <span className="font-bold uppercase tracking-wide flex-1 text-left">{user.currentCiv}</span>
                <span className="text-xs">▼</span>
            </button>

            {showCivMenu && (
                <div className="absolute bottom-20 left-4 w-56 bg-white dark:bg-slate-800 border-2 border-duo-gray rounded-2xl shadow-xl z-50 p-2 flex flex-col gap-1">
                    {Object.keys(CIV_THEMES).map((civKey) => {
                        const c = civKey as CivType;
                        const t = CIV_THEMES[c];
                        return (
                            <button
                                key={c}
                                onClick={() => {
                                    onSwitchCiv(c);
                                    setShowCivMenu(false);
                                }}
                                className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-700 text-left transition-colors font-bold text-gray-600 dark:text-slate-200"
                            >
                                <span className="text-xl">{t.icon}</span>
                                <span className="text-sm uppercase">{c}</span>
                            </button>
                        )
                    })}
                </div>
            )}
      </div>
    </div>
  );
};

export default Sidebar;