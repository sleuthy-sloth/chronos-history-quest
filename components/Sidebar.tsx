
import React, { useState, useEffect } from 'react';
import { UserState, CivType } from '../types';
import { CIV_THEMES, AVATARS, MASCOT_INTEL } from '../constants';

interface Props {
  user: UserState;
  onNavigate: (view: string) => void;
  onSwitchCiv: (civ: CivType) => void;
  onOpenAuth: () => void;
  currentView: string;
}

const Sidebar: React.FC<Props> = ({ user, onNavigate, onSwitchCiv, onOpenAuth, currentView }) => {
  const [showCivMenu, setShowCivMenu] = useState(false);
  const [mascotQuote, setMascotQuote] = useState({ fact: "Loading history...", mood: 'fact' });
  const theme = CIV_THEMES[user.currentCiv];
  
  const avatar = AVATARS.find(a => a.id === user.avatarId) || AVATARS[0];
  const isGuest = user.uid.startsWith('guest-');

  const navItems = [
    { id: 'dashboard', label: 'Path', icon: '🗺️' },
    { id: 'map', label: 'Atlas', icon: '🌍' },
    { id: 'league', label: 'League', icon: '🏆' },
    { id: 'profile', label: 'Dossier', icon: '👤' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  useEffect(() => {
      const intel = MASCOT_INTEL[user.currentCiv];
      const randomFact = intel[Math.floor(Math.random() * intel.length)];
      setMascotQuote(randomFact);
  }, [user.currentCiv]);

  return (
    <div className="fixed bottom-0 left-0 w-full h-16 md:h-screen md:w-72 bg-[#0a0f1c] border-t md:border-t-0 md:border-r border-white/5 flex md:flex-col z-40 shadow-2xl backdrop-blur-sm">
      
      {/* Brand Header */}
      <div className="hidden md:flex flex-col items-center p-8 border-b border-white/5 relative bg-gradient-to-b from-white/5 to-transparent">
        <h1 
            className="font-serif text-3xl text-amber-500 font-bold tracking-[0.2em] cursor-pointer hover:text-amber-400 transition-colors drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]" 
            onClick={() => onNavigate('dashboard')}
        >
            CHRONOS
        </h1>
        
        {/* Civ Switcher */}
        <div className="mt-6 w-full relative">
            <button 
                onClick={() => setShowCivMenu(!showCivMenu)}
                className={`w-full flex items-center justify-between bg-slate-900/50 px-4 py-3 rounded-xl border border-white/10 hover:border-amber-500/50 transition-all group shadow-lg`}
            >
                <div className="flex items-center gap-3">
                    <span className="text-xl filter drop-shadow-md group-hover:scale-110 transition-transform">{theme.icon}</span>
                    <span className="font-serif font-bold text-sm text-slate-200 tracking-wide">{user.currentCiv}</span>
                </div>
                <span className="text-xs text-slate-500 group-hover:text-amber-500 transition-colors">▼</span>
            </button>

            {/* Dropdown */}
            {showCivMenu && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-[#0f172a] border border-white/10 rounded-xl shadow-2xl z-50 p-2 flex flex-col gap-1 animate-fade-in-up">
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
                                className={`flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 text-left transition-colors ${user.currentCiv === c ? 'bg-white/10 border border-white/5' : ''}`}
                            >
                                <span className="text-lg">{t.icon}</span>
                                <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">{c}</span>
                            </button>
                        )
                    })}
                </div>
            )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex md:flex-col justify-evenly md:justify-start md:p-4 gap-1 md:gap-3 w-full">
        {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`group relative flex flex-col md:flex-row items-center md:gap-4 p-2 md:p-3 md:pl-6 rounded-xl transition-all flex-1 md:flex-none justify-center md:justify-start overflow-hidden
                  ${isActive ? 'text-amber-400 bg-white/5' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'}
                `}
              >
                {/* Active Indicator Bar */}
                <div className={`absolute left-0 top-2 bottom-2 w-1 rounded-r bg-amber-500 transition-all duration-300 ${isActive ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full'}`} />
                
                <span className={`text-2xl md:text-xl transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>{item.icon}</span>
                <span className="text-[10px] md:text-sm font-serif font-bold tracking-widest uppercase md:block mt-1 md:mt-0">
                  {item.label}
                </span>
                
                {/* Hover glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </button>
            );
        })}
      </nav>

      {/* Mascot Intel (Holographic Card) */}
      <div className="hidden md:block p-6">
          <div className="relative group">
              {/* Border Gradient & Glow */}
              <div className={`absolute -inset-0.5 bg-gradient-to-r ${theme.gradient} opacity-30 group-hover:opacity-60 transition duration-500 blur-sm rounded-2xl`}></div>
              
              <div className="relative bg-[#0f172a] p-5 rounded-xl border border-white/10">
                  <div className="flex items-center gap-3 mb-3 border-b border-white/5 pb-2">
                       <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-lg shadow-inner">
                           {theme.icon}
                       </div>
                       <span className={`text-[10px] font-bold ${theme.secondary} uppercase tracking-[0.2em]`}>{theme.mascot}</span>
                  </div>
                  <p className="text-xs text-slate-300 italic leading-relaxed font-serif opacity-80 group-hover:opacity-100 transition-opacity">
                      "{mascotQuote.fact}"
                  </p>
                  <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]"></div>
              </div>
          </div>
      </div>

      {/* User Stats Footer */}
      {isGuest ? (
          <button 
             onClick={onOpenAuth}
             className="hidden md:block mx-4 mb-4 p-4 rounded-xl border border-amber-500/30 bg-amber-900/10 hover:bg-amber-900/20 transition-all text-left group"
          >
             <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-amber-500/50 group-hover:border-amber-500 text-xl">
                     💾
                 </div>
                 <div>
                     <p className="text-xs font-bold text-amber-500 uppercase tracking-wider">Unsaved Progress</p>
                     <p className="text--[10px] text-slate-400">Tap to secure legacy</p>
                 </div>
             </div>
          </button>
      ) : (
        <button 
            onClick={() => onNavigate('profile')}
            className="hidden md:block border-t border-white/5 bg-[#0f172a] hover:bg-slate-900 transition-colors p-6"
        >
            <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full p-0.5 bg-gradient-to-br from-amber-500 to-transparent">
                    <img src={avatar.url} alt="User" className="w-full h-full object-cover rounded-full bg-slate-900" />
                </div>
                <div className="overflow-hidden">
                    <p className="text-sm font-bold text-white truncate font-serif">{user.displayName}</p>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Level {user.level}</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
                 <div className="bg-white/5 rounded px-2 py-1.5 flex items-center justify-between">
                     <span>💎</span>
                     <span className="font-mono font-bold text-slate-300">{user.gems}</span>
                 </div>
                 <div className="bg-white/5 rounded px-2 py-1.5 flex items-center justify-between">
                     <span>🔥</span>
                     <span className="font-mono font-bold text-slate-300">{user.streak}</span>
                 </div>
            </div>
        </button>
      )}
    </div>
  );
};

export default Sidebar;
