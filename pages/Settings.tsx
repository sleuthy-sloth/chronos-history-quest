import React, { useState } from 'react';
import { UserState } from '../types';
import { updateUserProgress, signOut, deleteAccount } from '../services/firebase';
import { CIV_THEMES } from '../constants';

interface Props {
  user: UserState;
  onUpdateUser: (u: UserState) => void;
}

const Settings: React.FC<Props> = ({ user, onUpdateUser }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editNameValue, setEditNameValue] = useState(user.displayName);

  const theme = CIV_THEMES[user.currentCiv];

  const handleUpdateSetting = (key: string, value: any) => {
    const updatedUser = {
        ...user,
        settings: {
            ...user.settings,
            [key]: value
        }
    };
    onUpdateUser(updatedUser);
    updateUserProgress(user, { settings: updatedUser.settings });

    if (key === 'sfxVolume' && value > 0) {
        // Play a test ping to give audio feedback
        const audio = new Audio('https://codeskulptor-demos.commondatastorage.googleapis.com/pang/pop.mp3');
        audio.volume = value;
        audio.play().catch(()=>{});
    }
  };

  const handleSaveName = async () => {
      if (editNameValue.trim().length > 0) {
          const newName = editNameValue.trim();
          const updatedUser = { ...user, displayName: newName };
          onUpdateUser(updatedUser);
          await updateUserProgress(user, { displayName: newName });
          setIsEditingName(false);
      }
  };

  const handleDelete = async () => {
    if (confirm("Are you absolutely sure? This will delete all your progress, history, and gems. This action cannot be undone.")) {
        setIsDeleting(true);
        try {
            await deleteAccount(user);
            window.location.reload();
        } catch (e) {
            alert("Error deleting account. You may need to sign in again to verify identity.");
            setIsDeleting(false);
        }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6 md:p-12 pb-32 flex flex-col items-center relative overflow-hidden">
      {/* Dynamic Background */}
      <div className={`absolute inset-0 bg-gradient-to-b ${theme.gradient} opacity-20 pointer-events-none`} />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 pointer-events-none" />

      <div className="w-full max-w-2xl animate-fade-in-up space-y-8 relative z-10">
        
        <header className="text-center mb-12">
            <h1 className="font-serif text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-amber-200 to-amber-600 drop-shadow-md tracking-wider mb-2">
                SETTINGS
            </h1>
            <div className="h-px w-24 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent mx-auto" />
            <p className="text-slate-400 text-xs uppercase tracking-[0.3em] mt-4 font-bold">System Configuration</p>
        </header>

        {/* Account Profile Card */}
        <section className="bg-slate-900/50 backdrop-blur-md rounded-3xl p-1 border border-white/10 shadow-2xl overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            
            <div className="bg-slate-950/50 rounded-[22px] p-6 md:p-8">
                <div className="flex flex-col md:flex-row items-center gap-8">
                    {/* Avatar */}
                    <div className="relative">
                         <div className="w-24 h-24 rounded-full p-[2px] bg-gradient-to-br from-amber-500 to-transparent">
                            <div className="w-full h-full rounded-full overflow-hidden bg-slate-800">
                                {user.photoURL ? (
                                    <img src={user.photoURL} alt="User" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-4xl">👤</div>
                                )}
                            </div>
                         </div>
                         <button className="absolute bottom-0 right-0 bg-slate-800 text-white p-1.5 rounded-full border border-slate-600 hover:bg-amber-600 transition-colors shadow-lg">
                             <span className="text-xs">📷</span>
                         </button>
                    </div>
                    
                    {/* Details */}
                    <div className="flex-1 text-center md:text-left w-full">
                        <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                            <span className="text-[10px] font-bold uppercase text-amber-500 tracking-widest border border-amber-500/20 px-2 py-0.5 rounded">
                                Legion ID: {user.uid.slice(0,6)}...
                            </span>
                        </div>

                        {isEditingName ? (
                            <div className="flex items-center gap-2 mt-2 animate-fade-in-up">
                                <input 
                                    type="text" 
                                    value={editNameValue}
                                    onChange={(e) => setEditNameValue(e.target.value)}
                                    className="bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white font-serif text-lg w-full focus:outline-none focus:border-amber-500 shadow-inner"
                                    autoFocus
                                />
                                <button 
                                    onClick={handleSaveName}
                                    className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-lg transition-all active:scale-95"
                                >
                                    Save
                                </button>
                            </div>
                        ) : (
                            <div className="group/edit relative inline-block">
                                <h3 className="font-serif text-3xl text-white font-bold flex items-center gap-3">
                                    {user.displayName}
                                    <button 
                                        onClick={() => {
                                            setEditNameValue(user.displayName);
                                            setIsEditingName(true);
                                        }}
                                        className="opacity-0 group-hover/edit:opacity-100 transition-all text-slate-500 hover:text-amber-500 text-sm transform translate-x-[-10px] group-hover/edit:translate-x-0"
                                    >
                                        ✏️ Edit
                                    </button>
                                </h3>
                            </div>
                        )}
                        
                        <p className="text-slate-500 text-sm mt-1">{user.email || 'Guest Explorer'}</p>
                    </div>

                    <button 
                        onClick={() => {
                            signOut();
                            window.location.reload();
                        }}
                        className="px-6 py-3 border border-slate-700 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 hover:border-slate-500 transition-all text-sm font-bold tracking-wider"
                    >
                        SIGN OUT
                    </button>
                </div>
            </div>
        </section>

        {/* Configuration Grid */}
        <div className="grid md:grid-cols-2 gap-6">
            
            {/* Audio Panel */}
            <section className="bg-slate-900/60 backdrop-blur-md p-6 rounded-3xl border border-white/5 shadow-xl">
                <h2 className="text-lg font-serif font-bold text-slate-200 mb-6 flex items-center gap-2">
                    <span className="text-amber-500">🔊</span> Audio Levels
                </h2>
                
                <div className="space-y-6">
                    <div>
                        <div className="flex justify-between mb-3">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Music</label>
                            <span className="text-xs font-mono text-amber-500 bg-amber-900/20 px-2 py-0.5 rounded">{Math.round((user.settings?.musicVolume || 0) * 100)}%</span>
                        </div>
                        <input 
                            type="range" 
                            min="0" 
                            max="1" 
                            step="0.05"
                            value={user.settings?.musicVolume ?? 0.3}
                            onChange={(e) => handleUpdateSetting('musicVolume', parseFloat(e.target.value))}
                            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500 hover:accent-amber-400"
                        />
                    </div>

                    <div>
                        <div className="flex justify-between mb-3">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">SFX</label>
                            <span className="text-xs font-mono text-amber-500 bg-amber-900/20 px-2 py-0.5 rounded">{Math.round((user.settings?.sfxVolume || 0) * 100)}%</span>
                        </div>
                        <input 
                            type="range" 
                            min="0" 
                            max="1" 
                            step="0.05"
                            value={user.settings?.sfxVolume ?? 0.5}
                            onChange={(e) => handleUpdateSetting('sfxVolume', parseFloat(e.target.value))}
                            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500 hover:accent-amber-400"
                        />
                    </div>
                </div>
            </section>

            {/* Appearance Panel */}
            <section className="bg-slate-900/60 backdrop-blur-md p-6 rounded-3xl border border-white/5 shadow-xl">
                <h2 className="text-lg font-serif font-bold text-slate-200 mb-6 flex items-center gap-2">
                    <span className="text-amber-500">🎨</span> Theme
                </h2>
                
                <div className="grid grid-cols-3 gap-2 h-24">
                    {[
                        { id: 'light', label: 'Light', icon: '☀️' },
                        { id: 'system', label: 'Auto', icon: '💻' },
                        { id: 'dark', label: 'Dark', icon: '🌙' }
                    ].map((mode) => {
                        const active = (user.settings?.theme || 'dark') === mode.id;
                        return (
                            <button
                                key={mode.id}
                                onClick={() => handleUpdateSetting('theme', mode.id)}
                                className={`flex flex-col items-center justify-center gap-2 rounded-xl border-2 transition-all
                                    ${active 
                                        ? 'bg-amber-600/20 border-amber-500 text-amber-500' 
                                        : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-600 hover:text-slate-300'}
                                `}
                            >
                                <span className="text-2xl">{mode.icon}</span>
                                <span className="text-[10px] font-bold uppercase tracking-wider">{mode.label}</span>
                            </button>
                        )
                    })}
                </div>
                <p className="text-[10px] text-slate-500 mt-4 text-center italic">
                    "History is best viewed in the dark."
                </p>
            </section>
        </div>

        {/* Danger Zone */}
        <section className="mt-8 border border-red-900/30 bg-red-950/10 rounded-2xl p-6 transition-all hover:bg-red-950/20">
            <h3 className="text-red-500 font-bold mb-2 flex items-center gap-2 text-sm uppercase tracking-widest">
                ⚠️ Danger Zone
            </h3>
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <p className="text-xs text-slate-500">
                    Permanently erase your legacy. This action cannot be undone.
                </p>
                <button 
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="px-6 py-2 bg-transparent border border-red-900 text-red-700 hover:bg-red-900 hover:text-white hover:border-red-500 rounded-lg text-xs font-bold uppercase tracking-wider transition-all"
                >
                    {isDeleting ? 'Erasing History...' : 'Delete Account'}
                </button>
            </div>
        </section>

        {/* Footer */}
        <div className="text-center pt-8 opacity-40 hover:opacity-100 transition-opacity duration-500">
            <p className="font-serif text-xs text-slate-500">CHRONOS v1.0.0 • Museum of Humanity</p>
            <a href="mailto:support@chronos.ai" className="text-[10px] text-amber-500/50 hover:text-amber-500 mt-2 block">Report an Issue</a>
        </div>

      </div>
    </div>
  );
};

export default Settings;