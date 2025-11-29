

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { UserState, CivType, LeagueMember, Avatar } from '../types';
import { INITIAL_USER_STATE, LEAGUE_BOT_POOL, AVATARS } from '../constants';

const apiKey = process.env.API_KEY;

const firebaseConfig = {
  apiKey: apiKey,
  authDomain: "chronos-391c8.firebaseapp.com",
  projectId: "chronos-391c8",
  storageBucket: "chronos-391c8.firebasestorage.app",
  messagingSenderId: "206930794082",
  appId: "1:206930794082:web:a4f9a3031f483de031633b"
};

const isFirebaseConfigured = !!firebaseConfig.apiKey;

let auth: firebase.auth.Auth;
let db: firebase.firestore.Firestore;

if (isFirebaseConfigured) {
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
  auth = firebase.auth();
  db = firebase.firestore();
}

const getLocalGuestUser = (): UserState | null => {
    const local = localStorage.getItem('chronos_user');
    if (local) {
        const parsed = JSON.parse(local);
        if (parsed.uid && parsed.uid.startsWith('guest-')) {
            return parsed;
        }
    }
    return null;
};

export const signInWithGoogle = async (): Promise<UserState | null> => {
  if (!isFirebaseConfigured) return createGuestUser();
  try {
    const provider = new firebase.auth.GoogleAuthProvider();
    const result = await auth.signInWithPopup(provider);
    if (result.user) {
      const guestData = getLocalGuestUser();
      return await fetchOrCreateUserProfile(result.user, guestData);
    }
    return null;
  } catch (error: any) {
    console.error("Sign in failed", error);
    if (error.code === 'auth/unauthorized-domain' || error.code === 'auth/operation-not-allowed') {
        alert("Domain not authorized. Falling back to Guest Mode.");
        return createGuestUser();
    }
    return null;
  }
};

export const registerWithEmailAndPassword = async (email: string, pass: string, name: string): Promise<UserState> => {
    if (!isFirebaseConfigured) throw new Error("Firebase not configured");
    const result = await auth.createUserWithEmailAndPassword(email, pass);
    if (result.user) {
        await result.user.updateProfile({ displayName: name });
        const guestData = getLocalGuestUser();
        const finalGuestData = guestData ? { ...guestData, displayName: name } : null;
        return await fetchOrCreateUserProfile(result.user, finalGuestData);
    }
    throw new Error("Registration failed");
};

export const logInWithEmailAndPassword = async (email: string, pass: string): Promise<UserState> => {
    if (!isFirebaseConfigured) throw new Error("Firebase not configured");
    const result = await auth.signInWithEmailAndPassword(email, pass);
    if (result.user) {
        const guestData = getLocalGuestUser();
        return await fetchOrCreateUserProfile(result.user, guestData);
    }
    throw new Error("Login failed");
};

export const createGuestUser = (): UserState => {
    const existing = getLocalGuestUser();
    if (existing) return existing;
    const mockUser: UserState = {
      ...INITIAL_USER_STATE,
      uid: 'guest-' + Date.now(),
      displayName: 'Guest Explorer',
      email: null,
    };
    saveUserLocally(mockUser);
    return mockUser;
}

export const signOut = async () => {
  if (isFirebaseConfigured) await auth.signOut();
  localStorage.removeItem('chronos_user');
};

export const deleteAccount = async (user: UserState) => {
  if (isFirebaseConfigured && user.uid && !user.uid.startsWith('guest-')) {
    await db.collection('users').doc(user.uid).delete();
    const currentUser = auth.currentUser;
    if (currentUser) await currentUser.delete();
  }
  localStorage.removeItem('chronos_user');
};

export const subscribeToAuthChanges = (callback: (user: UserState | null) => void) => {
  const local = localStorage.getItem('chronos_user');
  if (local) {
      const parsed = JSON.parse(local);
      if (parsed.uid.startsWith('guest-')) callback(parsed);
  }
  if (!isFirebaseConfigured) {
    callback(local ? JSON.parse(local) : null);
    return () => {};
  }
  return auth.onAuthStateChanged(async (firebaseUser) => {
    if (firebaseUser) {
      const userProfile = await fetchOrCreateUserProfile(firebaseUser, null);
      callback(userProfile);
    } else {
      const local = localStorage.getItem('chronos_user');
      if (local && JSON.parse(local).uid.startsWith('guest-')) callback(JSON.parse(local));
      else callback(null);
    }
  });
};

const fetchOrCreateUserProfile = async (firebaseUser: firebase.User, guestData: UserState | null): Promise<UserState> => {
  const userRef = db.collection('users').doc(firebaseUser.uid);
  const snap = await userRef.get();
  const now = new Date();

  if (snap.exists) {
    const userData = snap.data() as UserState;
    const lastLogin = new Date(userData.lastLoginDate);
    const today = new Date();
    const lastLoginMidnight = new Date(lastLogin.getFullYear(), lastLogin.getMonth(), lastLogin.getDate());
    const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const oneDay = 1000 * 60 * 60 * 24;
    const diffDays = Math.round(Math.abs((todayMidnight.getTime() - lastLoginMidnight.getTime()) / oneDay));
    let newStreak = userData.streak;
    if (diffDays === 1) newStreak += 1;
    else if (diffDays > 1) newStreak = 1;
    const updates = { lastLoginDate: now.toISOString(), streak: newStreak };
    await userRef.update(updates);
    const finalUser = { ...userData, ...updates };
    saveUserLocally(finalUser);
    return finalUser;
  } else {
    let newUser: UserState;
    if (guestData) {
        newUser = {
            ...guestData,
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: guestData.displayName !== 'Guest Explorer' ? guestData.displayName : (firebaseUser.displayName || 'Traveler'),
            photoURL: firebaseUser.photoURL || guestData.photoURL,
            lastLoginDate: now.toISOString()
        };
    } else {
        newUser = {
            ...INITIAL_USER_STATE,
            uid: firebaseUser.uid,
            displayName: firebaseUser.displayName || 'Traveler',
            email: firebaseUser.email,
            photoURL: firebaseUser.photoURL,
            lastLoginDate: now.toISOString(),
            streak: 1,
            settings: INITIAL_USER_STATE.settings,
            avatarId: 'recruit_default',
            unlockedAvatars: ['recruit_default', 'scholar_default'],
            friends: []
        };
    }
    await userRef.set(newUser);
    saveUserLocally(newUser);
    return newUser;
  }
};

export const updateUserProgress = async (user: UserState, updates: Partial<UserState>) => {
  const updatedUser = { ...user, ...updates };
  if (isFirebaseConfigured && user.uid && !user.uid.startsWith('guest-')) {
    try {
        await db.collection('users').doc(user.uid).update(updates);
    } catch (e) { console.error("Sync error", e); }
  }
  saveUserLocally(updatedUser);
  return updatedUser;
};

const saveUserLocally = (user: UserState) => {
  localStorage.setItem('chronos_user', JSON.stringify(user));
};

export const getFriendDetails = async (friendUids: string[]): Promise<LeagueMember[]> => {
    if (!isFirebaseConfigured || friendUids.length === 0) return [];
    try {
        const chunks = friendUids.slice(0, 10);
        const q = db.collection('users').where(firebase.firestore.FieldPath.documentId(), 'in', chunks);
        const snap = await q.get();
        return snap.docs.map(doc => {
            const d = doc.data() as UserState;
            const avatar = AVATARS.find(a => a.id === d.avatarId);
            return {
                uid: d.uid,
                displayName: d.displayName,
                photoURL: avatar?.url || d.photoURL || '',
                xp: d.xp,
                rank: 0,
                civ: d.currentCiv
            };
        });
    } catch (e) { return []; }
};

export const addFriend = async (currentUser: UserState, friendUid: string): Promise<UserState> => {
    if (!isFirebaseConfigured) return currentUser;
    if (currentUser.friends.includes(friendUid)) return currentUser;
    const friendDoc = await db.collection('users').doc(friendUid).get();
    if (!friendDoc.exists) throw new Error("User not found");
    const newFriends = [...currentUser.friends, friendUid];
    return updateUserProgress(currentUser, { friends: newFriends });
};

const getCachedBots = (count: number): LeagueMember[] => {
    const key = 'chronos_league_bots_v2';
    const cached = localStorage.getItem(key);
    const now = Date.now();
    const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
    if (cached) {
        try {
            const { timestamp, bots } = JSON.parse(cached);
            if (now - timestamp < TWENTY_FOUR_HOURS && bots.length >= count) {
                return bots.slice(0, count);
            }
        } catch (e) {}
    }
    const newBots = generateSmartBots(30);
    localStorage.setItem(key, JSON.stringify({ timestamp: now, bots: newBots }));
    return newBots.slice(0, count);
};

export const getLeagueLeaderboard = async (): Promise<LeagueMember[]> => {
  let realUsers: LeagueMember[] = [];
  if (isFirebaseConfigured) {
    try {
      const usersRef = db.collection('users');
      const querySnapshot = await usersRef.orderBy('xp', 'desc').limit(10).get();
      querySnapshot.forEach((doc) => {
        const u = doc.data() as UserState;
        const avatar = AVATARS.find(a => a.id === u.avatarId);
        realUsers.push({
          uid: u.uid,
          displayName: u.displayName,
          photoURL: avatar?.url || u.photoURL || '',
          xp: u.xp,
          rank: 0,
          civ: u.currentCiv || CivType.ROME,
          isBot: false
        });
      });
    } catch (e) { console.error("Error fetching leaderboard", e); }
  }

  const totalSlots = 30;
  const neededBots = Math.max(0, totalSlots - realUsers.length);
  if (neededBots > 0) {
    const bots = getCachedBots(neededBots);
    realUsers = [...realUsers, ...bots];
  }
  return realUsers.sort((a, b) => b.xp - a.xp).map((m, i) => ({ ...m, rank: i + 1 }));
};

const generateSmartBots = (count: number): LeagueMember[] => {
  const bots: LeagueMember[] = [];
  const civs = Object.values(CivType);
  // 0 = Sunday. We want league to end Sunday night, so day 0 is actually Day 7 effectively.
  // 1 = Mon (Day 1), 6 = Sat (Day 6).
  let dayOfWeek = new Date().getDay();
  if (dayOfWeek === 0) dayOfWeek = 7; 
  
  // Realistic XP: ~80-100 XP per day for an active user.
  // We add some variance so not all bots are the same.
  const baseDailyXp = 80; 

  for (let i = 0; i < count; i++) {
    const randomCiv = civs[Math.floor(Math.random() * civs.length)];
    const names = LEAGUE_BOT_POOL[randomCiv];
    const name = names[Math.floor(Math.random() * names.length)] + `_${Math.floor(Math.random() * 100)}`;
    
    // Variance: Some bots are slackers (0.5), some are grinders (1.5)
    const skillMultiplier = (Math.random() * 1.0) + 0.5; 
    
    // Bot XP = DaysPassed * DailyRate * Skill
    const botXp = Math.floor(dayOfWeek * baseDailyXp * skillMultiplier);
    
    const randomAvatar = AVATARS[Math.floor(Math.random() * AVATARS.length)];
    bots.push({
      uid: `bot-${i}-${Date.now()}`,
      displayName: name,
      photoURL: randomAvatar.url,
      xp: botXp,
      rank: 0,
      civ: randomCiv,
      isBot: true
    });
  }
  return bots;
};
