
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
        settings: { ...user.settings, [key]: value }
    };
    onUpdateUser(updatedUser);
    updateUserProgress(user, { settings: updatedUser.settings });

    if (key === 'sfxVolume' && value > 0) {
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
    if (confirm("Are you sure? This will delete your account permanently.")) {
        setIsDeleting(true);
        try {
            await deleteAccount(user);
            window.location.reload();
        } catch (e) {
            alert("Error deleting account. Please re-login and try again.");
            setIsDeleting(false);
        }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 md:p-12 pb-32 flex flex-col items-center">
      <div className="w-full max-w-2xl space-y-6 animate-fade-in-up">
        
        <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white mb-8">Settings</h1>

        {/* Account Section */}
        <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border-2 border-slate-200 dark:border-slate-800">
            <h2 className="text-lg font-bold text-slate-400 uppercase tracking-wider mb-6">Account</h2>
            
            <div className="flex items-center gap-6">
                 <div className="w-20 h-20 rounded-full bg-gray-200 overflow-hidden border-2 border-slate-100 dark:border-slate-700">
                     {user.photoURL ? (
                         <img src={user.photoURL} className="w-full h-full object-cover" />
                     ) : (
                         <div className="w-full h-full flex items-center justify-center text-3xl">👤</div>
                     )}
                 </div>
                 
                 <div className="flex-1">
                     {isEditingName ? (
                        <div className="flex gap-2">
                             <input 
                                value={editNameValue}
                                onChange={(e) => setEditNameValue(e.target.value)}
                                className="border-2 border-slate-300 rounded-xl px-3 py-2 font-bold text-slate-800 w-full"
                             />
                             <button onClick={handleSaveName} className="bg-green-500 text-white px-4 rounded-xl font-bold">Save</button>
                        </div>
                     ) : (
                        <div className="flex items-center gap-3">
                            <h3 className="text-xl font-extrabold text-slate-800 dark:text-white">{user.displayName}</h3>
                            <button onClick={() => setIsEditingName(true)} className="text-slate-400 hover:text-blue-500 text-sm font-bold uppercase">Edit</button>
                        </div>
                     )}
                     <p className="text-slate-500 font-bold text-sm mt-1">{user.email || 'Guest User'}</p>
                 </div>
            </div>
            
            <div className="mt-8 pt-6 border-t-2 border-slate-100 dark:border-slate-800">
                <button onClick={() => { signOut(); window.location.reload(); }} className="w-full py-4 text-slate-600 dark:text-slate-300 font-extrabold uppercase tracking-wide hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl transition-colors">
                    Sign Out
                </button>
            </div>
        </section>

        {/* Preferences */}
        <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border-2 border-slate-200 dark:border-slate-800">
             <h2 className="text-lg font-bold text-slate-400 uppercase tracking-wider mb-6">Preferences</h2>
             
             <div className="space-y-8">
                 <div>
                     <div className="flex justify-between mb-2">
                         <label className="font-bold text-slate-700 dark:text-slate-200">Sound Effects</label>
                     </div>
                     <input 
                        type="range" min="0" max="1" step="0.1"
                        value={user.settings?.sfxVolume ?? 0.5}
                        onChange={(e) => handleUpdateSetting('sfxVolume', parseFloat(e.target.value))}
                        className="w-full h-3 bg-slate-200 rounded-full appearance-none cursor-pointer accent-blue-500"
                     />
                 </div>

                 <div>
                     <div className="flex justify-between mb-2">
                         <label className="font-bold text-slate-700 dark:text-slate-200">Music Volume</label>
                     </div>
                     <input 
                        type="range" min="0" max="1" step="0.1"
                        value={user.settings?.musicVolume ?? 0.3}
                        onChange={(e) => handleUpdateSetting('musicVolume', parseFloat(e.target.value))}
                        className="w-full h-3 bg-slate-200 rounded-full appearance-none cursor-pointer accent-blue-500"
                     />
                 </div>
             </div>
        </section>

        {/* Danger Zone */}
        <section className="mt-8">
             <button 
                onClick={handleDelete}
                className="w-full py-4 text-red-500 font-extrabold uppercase tracking-wide border-2 border-red-100 hover:bg-red-50 rounded-2xl transition-colors"
             >
                {isDeleting ? 'Deleting...' : 'Delete Account'}
             </button>
        </section>

      </div>
    </div>
  );
};

export default Settings;
