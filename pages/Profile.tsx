import React, { useState, useEffect } from 'react';
import { UserState, Avatar, LeagueMember } from '../types';
import { AVATARS, CIV_THEMES } from '../constants';
import { updateUserProgress, getFriendDetails, addFriend } from '../services/firebase';

interface Props {
  user: UserState;
  onUpdateUser: (u: UserState) => void;
}

const Profile: React.FC<Props> = ({ user, onUpdateUser }) => {
  const [friends, setFriends] = useState<LeagueMember[]>([]);
  const [friendCodeInput, setFriendCodeInput] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const theme = CIV_THEMES[user.currentCiv];
  const currentAvatar = AVATARS.find(a => a.id === user.avatarId) || AVATARS[0];

  useEffect(() => {
    const fetchFriends = async () => {
        if (user.friends && user.friends.length > 0) {
            const data = await getFriendDetails(user.friends);
            setFriends(data);
        }
    };
    fetchFriends();
  }, [user.friends]);

  const handleEquipAvatar = (avatarId: string) => {
    const updated = { ...user, avatarId: avatarId };
    onUpdateUser(updated);
    updateUserProgress(user, { avatarId: avatarId });
  };

  const handleBuyAvatar = (avatar: Avatar) => {
    if (!avatar.cost) return;
    if (user.gems >= avatar.cost) {
        const updated = { 
            ...user, 
            gems: user.gems - avatar.cost,
            unlockedAvatars: [...(user.unlockedAvatars || []), avatar.id],
            avatarId: avatar.id
        };
        onUpdateUser(updated);
        updateUserProgress(user, { 
            gems: updated.gems,
            unlockedAvatars: updated.unlockedAvatars,
            avatarId: updated.avatarId
        });
        setSuccessMsg(`Purchased ${avatar.name}!`);
        setTimeout(() => setSuccessMsg(null), 3000);
    } else {
        setErrorMsg("Not enough gems!");
        setTimeout(() => setErrorMsg(null), 3000);
    }
  };

  const handleAddFriend = async () => {
    if (!friendCodeInput) return;
    if (friendCodeInput === user.uid) {
        setErrorMsg("You cannot add yourself.");
        return;
    }
    
    try {
        const updated = await addFriend(user, friendCodeInput);
        onUpdateUser(updated);
        setFriendCodeInput('');
        setSuccessMsg("Friend added!");
        setTimeout(() => setSuccessMsg(null), 3000);
    } catch (e) {
        setErrorMsg("User not found or already added.");
        setTimeout(() => setErrorMsg(null), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6 md:p-12 pb-24 flex flex-col items-center">
      <div className="w-full max-w-5xl space-y-12 animate-fade-in-up">

        {/* --- Header: Identity --- */}
        <section className={`relative rounded-3xl p-8 md:p-12 overflow-hidden border border-white/10 shadow-2xl bg-slate-900 group`}>
             <div className={`absolute inset-0 bg-gradient-to-r ${theme.gradient} opacity-40 group-hover:opacity-50 transition-opacity duration-1000`} />
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20" />
             
             <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                 {/* Avatar Display */}
                 <div className="relative">
                     <div className={`w-36 h-36 md:w-48 md:h-48 rounded-full border-[6px] ${theme.accent} bg-slate-800 shadow-[0_0_40px_rgba(0,0,0,0.5)] overflow-hidden flex-shrink-0 relative z-10`}>
                         <img src={currentAvatar.url} alt={currentAvatar.name} className="w-full h-full object-cover" />
                     </div>
                     <div className={`absolute -inset-4 rounded-full ${theme.primary.replace('bg-', 'bg-')} blur-xl opacity-30 animate-pulse-slow`}></div>
                 </div>

                 {/* Stats */}
                 <div className="flex-1 text-center md:text-left">
                     <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-2 drop-shadow-md">{user.displayName}</h1>
                     <p className={`font-bold uppercase tracking-[0.2em] text-sm ${theme.secondary} mb-8`}>{currentAvatar.name}</p>
                     
                     <div className="flex flex-wrap justify-center md:justify-start gap-4">
                        {[
                            { label: 'Level', val: user.level, icon: '⚡' },
                            { label: 'XP', val: user.xp, icon: '⭐' },
                            { label: 'Streak', val: user.streak, icon: '🔥' },
                            { label: 'Gems', val: user.gems, icon: '💎' }
                        ].map(stat => (
                            <div key={stat.label} className="bg-black/40 border border-white/5 px-6 py-3 rounded-xl backdrop-blur-sm hover:bg-black/60 transition-colors">
                                <span className="text-2xl font-bold block text-white font-serif">{stat.val}</span>
                                <span className="text-[10px] uppercase text-slate-400 font-bold tracking-wider flex items-center justify-center md:justify-start gap-1">
                                    {stat.icon} {stat.label}
                                </span>
                            </div>
                        ))}
                     </div>
                 </div>

                 {/* Friend Code */}
                 <div className="bg-slate-950/80 p-5 rounded-2xl text-center backdrop-blur-md border border-white/10 shadow-xl">
                     <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-2">My Legion ID</p>
                     <code className="block bg-black/50 px-4 py-2 rounded-lg text-amber-500 font-mono text-sm select-all cursor-pointer hover:bg-black/70 transition-colors border border-amber-500/20">
                         {user.uid}
                     </code>
                 </div>
             </div>
        </section>

        {/* --- Wardrobe: Avatar Selection --- */}
        <section>
            <h2 className="text-3xl font-serif font-bold mb-8 flex items-center gap-3 text-slate-100">
                <span className="text-amber-500">🎭</span> Wardrobe
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {AVATARS.map(avatar => {
                    const isUnlocked = user.unlockedAvatars?.includes(avatar.id);
                    const isEquipped = user.avatarId === avatar.id;
                    const canAfford = avatar.cost && user.gems >= avatar.cost;

                    return (
                        <button
                            key={avatar.id}
                            disabled={!isUnlocked && !avatar.cost}
                            onClick={() => {
                                if (isUnlocked) handleEquipAvatar(avatar.id);
                                else if (avatar.cost) handleBuyAvatar(avatar);
                            }}
                            className={`relative group rounded-2xl border-2 p-4 transition-all duration-300 flex flex-col items-center gap-3 overflow-hidden
                                ${isEquipped 
                                    ? `border-amber-500 bg-slate-800 shadow-[0_0_20px_rgba(245,158,11,0.2)]` 
                                    : 'border-slate-800 bg-slate-900/50 hover:bg-slate-800 hover:border-slate-600 hover:-translate-y-1 hover:shadow-xl'}
                                ${!isUnlocked ? 'opacity-60 grayscale hover:grayscale-0' : ''}
                            `}
                        >
                            {/* Bg Gradient for equipped */}
                            {isEquipped && <div className="absolute inset-0 bg-gradient-to-b from-amber-500/10 to-transparent pointer-events-none" />}

                            <div className={`w-20 h-20 rounded-full overflow-hidden bg-slate-950 shadow-inner relative z-10 ${isEquipped ? 'ring-2 ring-amber-500 ring-offset-2 ring-offset-slate-900' : ''}`}>
                                <img src={avatar.url} alt={avatar.name} className="w-full h-full object-cover" />
                            </div>
                            
                            <div className="text-center relative z-10">
                                <p className={`text-xs font-bold font-serif tracking-wide ${isEquipped ? 'text-amber-400' : 'text-slate-300'}`}>{avatar.name}</p>
                                {!isUnlocked && avatar.cost && (
                                    <div className={`mt-2 text-[10px] font-bold px-3 py-1 rounded-full inline-flex items-center gap-1
                                        ${canAfford ? 'bg-green-900/50 text-green-400 border border-green-500/30' : 'bg-red-900/50 text-red-400 border border-red-500/30'}
                                    `}>
                                        <span>💎</span> {avatar.cost}
                                    </div>
                                )}
                                {!isUnlocked && !avatar.cost && (
                                     <p className="mt-2 text-[10px] text-slate-500 italic">Locked</p>
                                )}
                            </div>
                            
                            {/* Unlock condition overlay on hover */}
                            <div className="absolute inset-0 bg-slate-950/90 flex items-center justify-center p-4 text-center opacity-0 group-hover:opacity-100 transition-opacity z-20 backdrop-blur-sm">
                                <p className="text-xs text-slate-300 leading-tight">
                                    {isUnlocked ? avatar.description : avatar.unlockCondition || `Cost: ${avatar.cost} Gems`}
                                </p>
                            </div>
                        </button>
                    );
                })}
            </div>
            
            {/* Feedback Messages */}
            <div className="h-8 mt-4 text-center">
                {errorMsg && <p className="text-red-500 text-sm font-bold animate-shake bg-red-900/20 inline-block px-4 py-1 rounded-full border border-red-500/30">{errorMsg}</p>}
                {successMsg && <p className="text-green-500 text-sm font-bold animate-pop bg-green-900/20 inline-block px-4 py-1 rounded-full border border-green-500/30">{successMsg}</p>}
            </div>
        </section>

        {/* --- Social: Friends --- */}
        <section className="bg-slate-900/50 backdrop-blur-md rounded-3xl shadow-xl border border-white/5 p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                 <h2 className="text-3xl font-serif font-bold text-slate-100 flex items-center gap-3">
                    <span className="text-blue-500">🤝</span> Allies
                </h2>
                
                <div className="flex gap-3">
                    <input 
                        type="text" 
                        placeholder="Enter Friend ID..." 
                        value={friendCodeInput}
                        onChange={(e) => setFriendCodeInput(e.target.value)}
                        className="bg-slate-950 border border-slate-700 rounded-xl px-5 py-3 text-sm text-white focus:outline-none focus:border-amber-500 w-full md:w-72 shadow-inner"
                    />
                    <button 
                        onClick={handleAddFriend}
                        className="bg-amber-600 hover:bg-amber-500 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-lg hover:shadow-amber-500/20 active:scale-95"
                    >
                        + Add
                    </button>
                </div>
            </div>

            {friends.length === 0 ? (
                <div className="text-center py-16 border-2 border-dashed border-slate-800 rounded-2xl bg-slate-900/30">
                    <p className="text-slate-500 font-serif text-lg">Your ranks are empty.</p>
                    <p className="text-slate-600 text-sm mt-2">Share your ID to build your legion.</p>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2">
                    {friends.map(friend => (
                        <div key={friend.uid} className="flex items-center p-4 bg-slate-800 rounded-2xl border border-slate-700 hover:border-slate-600 transition-colors shadow-lg">
                             <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-slate-600 mr-4 bg-slate-900">
                                 <img src={friend.photoURL} alt={friend.displayName} className="w-full h-full object-cover" />
                             </div>
                             <div className="flex-1">
                                 <h4 className="font-bold text-white text-lg font-serif">{friend.displayName}</h4>
                                 <div className="flex items-center gap-2 mt-1">
                                     <span className="text-xs text-slate-400 uppercase font-bold tracking-wider bg-slate-900 px-2 py-0.5 rounded border border-slate-700">{friend.civ}</span>
                                 </div>
                             </div>
                             <div className="text-right bg-black/20 px-3 py-2 rounded-lg">
                                 <span className="block font-bold text-amber-500 font-mono">{friend.xp} XP</span>
                             </div>
                        </div>
                    ))}
                </div>
            )}
        </section>

      </div>
    </div>
  );
};

export default Profile;