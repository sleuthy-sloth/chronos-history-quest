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

  const navItems = [
    { id: 'dashboard', label: 'Operations', icon: '⌂' },
    { id: 'league', label: 'Rankings', icon: '🏆' },
    { id: 'map', label: 'Intel Map', icon: '🗺' },
    { id: 'profile', label: 'Identity', icon: '👤' },
    { id: 'settings', label: 'System', icon: '⚙' },
  ];

  return (
    <div className="fixed bottom-0 left-0 w-full h-16 md:h-screen md:w-64 bg-stone-100 dark:bg-stone-950 border-t md:border-t-0 md:border-r border-stone-200 dark:border-stone-800 flex md:flex-col z-40 font-serif">
      
      {/* Brand Header */}
      <div className="hidden md:flex flex-col items-start p-6 pb-2 border-b border-stone-200 dark:border-stone-800 mb-2">
        <h1 className="font-serif text-2xl text-stone-800 dark:text-white font-black tracking-tighter cursor-pointer uppercase" onClick={() => onNavigate('dashboard')}>
            CHRONOS
        </h1>
        <span className="text-[9px] uppercase tracking-[0.2em] text-stone-500 font-bold">Historical Initiative</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex md:flex-col justify-evenly md:justify-start md:px-2 w-full">
        {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`
                  group flex md:flex-row flex-col items-center gap-1 md:gap-4 p-2 md:px-4 md:py-3 rounded-xl transition-all flex-1 md:flex-none justify-center md:justify-start
                  ${isActive 
                    ? 'bg-stone-200 dark:bg-stone-800 text-stone-900 dark:text-white border-l-4 border-stone-500' 
                    : 'text-stone-500 hover:bg-stone-200/50 dark:hover:bg-stone-800/50 border-l-4 border-transparent'}
                `}
              >
                <span className={`text-xl font-mono ${isActive ? 'scale-105' : ''}`}>{item.icon}</span>
                <span className={`text-[10px] md:text-xs uppercase tracking-widest ${isActive ? 'font-bold' : 'font-medium'}`}>
                  {item.label}
                </span>
              </button>
            );
        })}
      </nav>

      {/* Civ Switcher (Desktop) */}
      <div className="hidden md:block p-4 border-t border-stone-200 dark:border-stone-800">
            <button 
                onClick={() => setShowCivMenu(!showCivMenu)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl border transition-all hover:brightness-105 ${theme.bgLight} ${theme.border} ${theme.text} border`}
            >
                <span className="text-lg">{theme.icon}</span>
                <span className="font-bold uppercase tracking-wider text-xs flex-1 text-left">{user.currentCiv}</span>
                <span className="text-xs">▼</span>
            </button>

            {showCivMenu && (
                <div className="absolute bottom-20 left-4 w-56 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl shadow-xl z-50 overflow-hidden">
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
                                className="w-full flex items-center gap-3 p-3 hover:bg-stone-100 dark:hover:bg-stone-700 text-left transition-colors border-b border-stone-100 dark:border-stone-700 last:border-0"
                            >
                                <span className="text-lg">{t.icon}</span>
                                <span className="text-xs font-bold uppercase text-stone-600 dark:text-stone-300 tracking-wide">{c}</span>
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