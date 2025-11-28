
import React, { useEffect, useState } from 'react';
import { UserState, LeagueMember } from '../types';
import { CIV_THEMES } from '../constants';
import { getLeagueLeaderboard } from '../services/firebase';

interface Props {
  user: UserState;
}

const League: React.FC<Props> = ({ user }) => {
  const [leaderboard, setLeaderboard] = useState<LeagueMember[]>([]);
  const theme = CIV_THEMES[user.currentCiv];

  useEffect(() => {
    const fetchLeague = async () => {
        const data = await getLeagueLeaderboard();
        const userInList = data.find(m => m.uid === user.uid);
        let combined = data;

        if (!userInList) {
             const userEntry: LeagueMember = {
                uid: user.uid,
                displayName: user.displayName || 'You',
                photoURL: user.photoURL || '',
                xp: user.xp,
                rank: 0,
                civ: user.currentCiv,
                isBot: false
            };
            combined = [...data, userEntry].sort((a, b) => b.xp - a.xp);
        }
        const ranked = combined.map((m, i) => ({ ...m, rank: i + 1 }));
        setLeaderboard(ranked);
    };
    fetchLeague();
  }, [user.xp, user.currentCiv]);

  return (
    <div className="min-h-screen bg-slate-950 p-6 flex flex-col items-center pb-24 relative overflow-hidden">
      {/* Background Ambience */}
      <div className={`absolute top-0 left-0 right-0 h-96 bg-gradient-to-b ${theme.gradient} opacity-20 pointer-events-none`} />
      
      <div className="w-full max-w-2xl animate-fade-in-up relative z-10">
        
        {/* Header */}
        <div className="text-center mb-8">
            <h1 className="font-serif text-4xl font-bold text-white drop-shadow-md mb-2">{theme.leagueTitle}</h1>
            <p className="text-slate-400 text-sm uppercase tracking-widest">Weekly Competition • Ends Sunday</p>
        </div>

        {/* Hero Banner */}
        <div className={`flex items-center justify-between mb-8 p-8 rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden glass-panel`}>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" style={{ backgroundSize: '200% 100%' }}></div>
            <div className="relative z-10">
                <p className="text-amber-500 font-bold uppercase text-xs tracking-[0.2em] mb-2">Current Standing</p>
                <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-serif font-bold text-white">#{leaderboard.find(u => u.uid === user.uid)?.rank || '-'}</span>
                    <span className="text-slate-400 font-mono">/ {leaderboard.length}</span>
                </div>
            </div>
            <div className="w-32 h-32 relative z-10 opacity-80 filter drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                <img src={theme.symbolUrl} className="w-full h-full object-contain" alt="League Icon" />
            </div>
        </div>

        {/* Leaderboard List */}
        <div className="bg-slate-900/50 backdrop-blur border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
            {leaderboard.map((member) => {
                const isCurrentUser = member.uid === user.uid;
                const memberTheme = CIV_THEMES[member.civ];
                
                // Rank Styling
                let rankStyle = "text-slate-500 font-serif";
                let rowBg = "border-slate-800/50";
                
                if (member.rank === 1) {
                    rankStyle = "text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 to-yellow-600 drop-shadow-sm text-2xl";
                    rowBg = "bg-gradient-to-r from-yellow-900/20 to-transparent border-yellow-500/20";
                } else if (member.rank === 2) {
                    rankStyle = "text-transparent bg-clip-text bg-gradient-to-b from-slate-300 to-slate-500 drop-shadow-sm text-xl";
                    rowBg = "bg-gradient-to-r from-slate-800/40 to-transparent border-slate-500/20";
                } else if (member.rank === 3) {
                    rankStyle = "text-transparent bg-clip-text bg-gradient-to-b from-amber-600 to-amber-800 drop-shadow-sm text-xl";
                    rowBg = "bg-gradient-to-r from-amber-900/20 to-transparent border-amber-700/20";
                }

                if (isCurrentUser) {
                    rowBg = "bg-slate-100/10 border-white/20";
                }

                return (
                    <div 
                        key={member.uid}
                        className={`flex items-center p-4 border-b last:border-0 transition-all hover:bg-white/5 ${rowBg}`}
                    >
                        {/* Rank */}
                        <div className={`w-12 text-center font-bold ${rankStyle}`}>
                            {member.rank}
                        </div>
                        
                        {/* Avatar */}
                        <div className={`w-12 h-12 rounded-full mr-4 overflow-hidden border-2 flex items-center justify-center text-xl bg-slate-800 shadow-lg relative
                            ${isCurrentUser ? 'border-amber-500' : 'border-slate-700'}
                        `}>
                            {member.photoURL ? (
                                <img src={member.photoURL} alt="avatar" className="w-full h-full object-cover" />
                            ) : (
                                <span>{memberTheme?.icon || '👤'}</span>
                            )}
                            {/* Rank Badge */}
                            {member.rank <= 3 && (
                                <div className="absolute -top-1 -right-1 text-[10px]">
                                    {member.rank === 1 ? '👑' : member.rank === 2 ? '🥈' : '🥉'}
                                </div>
                            )}
                        </div>

                        {/* Name & Civ */}
                        <div className="flex-1">
                            <h3 className={`font-bold text-sm md:text-base flex items-center gap-2 ${isCurrentUser ? 'text-amber-400' : 'text-slate-200'}`}>
                                {member.displayName}
                                {member.isBot && <span className="text-[9px] bg-slate-800 border border-slate-700 px-1.5 py-0.5 rounded text-slate-500 font-mono tracking-wide">AI</span>}
                            </h3>
                            <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="text-xs grayscale opacity-70">{memberTheme?.icon}</span>
                                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">
                                    {member.civ}
                                </p>
                            </div>
                        </div>

                        {/* XP */}
                        <div className={`font-mono font-bold text-sm md:text-lg ${isCurrentUser ? 'text-white' : 'text-slate-400'}`}>
                            {member.xp} XP
                        </div>
                    </div>
                )
            })}
        </div>
      </div>
    </div>
  );
};

export default League;
