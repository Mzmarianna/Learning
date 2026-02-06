/**
 * Warrior Identity System
 * Transforms students into warriors with ranks, titles, and progression
 */

import { User } from './types';
import { WarriorProfile, WarriorRank } from './types/kingdom';
import { db, isFirebaseConfigured } from './firebase';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';

// ============================================================================
// HELPER - CHECK IF WE CAN USE FIRESTORE
// ============================================================================

function canUseFirestore(): boolean {
  return isFirebaseConfigured && db !== null;
}

// ============================================================================
// MOCK STORAGE FOR DEMO MODE
// ============================================================================

const MOCK_WARRIOR_STORAGE_KEY = 'mockWarriorProfiles';

function getMockWarriors(): Record<string, WarriorProfile> {
  try {
    const stored = localStorage.getItem(MOCK_WARRIOR_STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

function saveMockWarrior(warrior: WarriorProfile): void {
  try {
    const warriors = getMockWarriors();
    warriors[warrior.uid] = warrior;
    localStorage.setItem(MOCK_WARRIOR_STORAGE_KEY, JSON.stringify(warriors));
  } catch (error) {
    console.error('Error saving mock warrior:', error);
  }
}

function getMockWarrior(uid: string): WarriorProfile | null {
  const warriors = getMockWarriors();
  const warrior = warriors[uid];
  
  if (!warrior) return null;
  
  // Convert date strings back to Date objects
  return {
    ...warrior,
    lastActiveDate: new Date(warrior.lastActiveDate),
    createdAt: new Date(warrior.createdAt),
  };
}

// ============================================================================
// WARRIOR NAME GENERATION
// ============================================================================

const WARRIOR_ADJECTIVES = [
  'the Brave',
  'the Wise',
  'the Quick',
  'the Strong',
  'the Fearless',
  'the Clever',
  'the Bold',
  'the Mighty',
  'the Swift',
  'the True',
  'the Valiant',
  'the Keen',
  'the Determined',
  'the Brilliant',
  'the Noble',
  'the Unstoppable',
  'the Curious',
  'the Fierce',
  'the Relentless',
  'the Radiant',
];

export function generateWarriorName(displayName: string): string {
  const firstName = displayName.split(' ')[0];
  const randomAdj = WARRIOR_ADJECTIVES[Math.floor(Math.random() * WARRIOR_ADJECTIVES.length)];
  return `${firstName} ${randomAdj}`;
}

// ============================================================================
// RANK CALCULATION
// ============================================================================

export function calculateWarriorRank(totalXP: number, questsCompleted: number): WarriorRank {
  // Legendary: 10,000+ XP and 30+ quests
  if (totalXP >= 10000 && questsCompleted >= 30) return 'Legendary';
  
  // Master: 5,000+ XP and 15+ quests
  if (totalXP >= 5000 && questsCompleted >= 15) return 'Master';
  
  // Skilled: 2,000+ XP and 6+ quests
  if (totalXP >= 2000 && questsCompleted >= 6) return 'Skilled';
  
  // Novice: Starting rank
  return 'Novice';
}

export function getWarriorTitle(rank: WarriorRank): string {
  const titles: Record<WarriorRank, string> = {
    Novice: 'Apprentice of the Kingdom',
    Skilled: 'Guardian of Knowledge',
    Master: 'Champion of Mastery',
    Legendary: 'Keeper of the Realm',
  };
  return titles[rank];
}

export function getRankColor(rank: WarriorRank): string {
  const colors: Record<WarriorRank, string> = {
    Novice: '#8B5CF6', // Purple
    Skilled: '#06B6D4', // Cyan
    Master: '#F59E0B', // Amber
    Legendary: '#EF4444', // Red
  };
  return colors[rank];
}

export function getRankEmoji(rank: WarriorRank): string {
  const emojis: Record<WarriorRank, string> = {
    Novice: '🛡️',
    Skilled: '⚔️',
    Master: '👑',
    Legendary: '🏆',
  };
  return emojis[rank];
}

// ============================================================================
// XP & LEVEL CALCULATION
// ============================================================================

export function calculateLevel(totalXP: number): number {
  // Level formula: Level = floor(sqrt(XP / 100)) + 1
  // This creates a curved progression that gets harder over time
  return Math.floor(Math.sqrt(totalXP / 100)) + 1;
}

export function calculateXPForNextLevel(currentLevel: number): number {
  // XP needed for next level = (nextLevel - 1)^2 * 100
  const nextLevel = currentLevel + 1;
  return Math.pow(nextLevel - 1, 2) * 100;
}

export function calculateXPToNextLevel(totalXP: number): number {
  const currentLevel = calculateLevel(totalXP);
  const xpForNextLevel = calculateXPForNextLevel(currentLevel);
  return xpForNextLevel - totalXP;
}

export function calculateLevelProgress(totalXP: number): number {
  const currentLevel = calculateLevel(totalXP);
  const xpForCurrentLevel = Math.pow(currentLevel - 1, 2) * 100;
  const xpForNextLevel = calculateXPForNextLevel(currentLevel);
  const xpIntoLevel = totalXP - xpForCurrentLevel;
  const xpNeededForLevel = xpForNextLevel - xpForCurrentLevel;
  
  return Math.floor((xpIntoLevel / xpNeededForLevel) * 100);
}

// ============================================================================
// AVATAR SYSTEM
// ============================================================================

const STARTER_AVATARS = {
  helmets: ['basic-helmet', 'leather-cap', 'iron-helm'],
  armors: ['starter-armor', 'leather-tunic', 'chain-mail'],
  weapons: ['wooden-sword', 'training-staff', 'bronze-blade'],
  colors: ['#8B5CF6', '#06B6D4', '#F59E0B', '#10B981', '#EC4899', '#EF4444'],
};

export function getDefaultAvatar(favoriteColor?: string): WarriorProfile['avatar'] {
  return {
    helmet: 'basic-helmet',
    armor: 'starter-armor',
    weapon: 'wooden-sword',
    color: favoriteColor || STARTER_AVATARS.colors[0],
  };
}

// ============================================================================
// WARRIOR PROFILE CREATION
// ============================================================================

export async function createWarriorProfile(user: User): Promise<WarriorProfile> {
  const warriorProfile: WarriorProfile = {
    uid: user.uid,
    displayName: user.displayName,
    warriorName: generateWarriorName(user.displayName),
    rank: 'Novice',
    title: 'Apprentice of the Kingdom',
    
    avatar: getDefaultAvatar(user.preferences?.favoriteColor),
    
    totalXP: user.totalXP || 0,
    level: calculateLevel(user.totalXP || 0),
    xpToNextLevel: calculateXPToNextLevel(user.totalXP || 0),
    
    questsCompleted: 0,
    challengesCompleted: 0,
    bossesDefeated: 0,
    perfectChallenges: 0,
    
    currentStreak: 0,
    longestStreak: 0,
    lastActiveDate: new Date(),
    
    badgeIds: [],
    powerIds: [],
    
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  if (canUseFirestore()) {
    // Save to Firestore
    const warriorRef = doc(db, 'warriors', user.uid);
    await setDoc(warriorRef, warriorProfile);
  } else {
    // Save to mock storage
    saveMockWarrior(warriorProfile);
  }
  
  return warriorProfile;
}

// ============================================================================
// WARRIOR PROFILE RETRIEVAL
// ============================================================================

export async function getWarriorProfile(uid: string): Promise<WarriorProfile | null> {
  if (canUseFirestore()) {
    const warriorRef = doc(db, 'warriors', uid);
    const warriorSnap = await getDoc(warriorRef);
    
    if (!warriorSnap.exists()) {
      return null;
    }
    
    return warriorSnap.data() as WarriorProfile;
  } else {
    // Retrieve from mock storage
    return getMockWarrior(uid);
  }
}

// ============================================================================
// WARRIOR PROFILE UPDATE
// ============================================================================

export async function updateWarriorProfile(
  uid: string,
  updates: Partial<WarriorProfile>
): Promise<void> {
  if (canUseFirestore()) {
    const warriorRef = doc(db, 'warriors', uid);
    
    await updateDoc(warriorRef, {
      ...updates,
      updatedAt: new Date(),
    });
  } else {
    // Update mock storage
    const warrior = getMockWarrior(uid);
    if (warrior) {
      const updatedWarrior = { ...warrior, ...updates, updatedAt: new Date() };
      saveMockWarrior(updatedWarrior);
    }
  }
}

export async function updateWarriorXP(uid: string, xpToAdd: number): Promise<WarriorProfile> {
  const warrior = await getWarriorProfile(uid);
  if (!warrior) throw new Error('Warrior profile not found');
  
  const newTotalXP = warrior.totalXP + xpToAdd;
  const newLevel = calculateLevel(newTotalXP);
  const newRank = calculateWarriorRank(newTotalXP, warrior.questsCompleted);
  const newTitle = getWarriorTitle(newRank);
  const newXPToNextLevel = calculateXPToNextLevel(newTotalXP);
  
  const leveledUp = newLevel > warrior.level;
  const rankedUp = newRank !== warrior.rank;
  
  await updateWarriorProfile(uid, {
    totalXP: newTotalXP,
    level: newLevel,
    rank: newRank,
    title: newTitle,
    xpToNextLevel: newXPToNextLevel,
  });
  
  // Return updated profile with flags
  return {
    ...warrior,
    totalXP: newTotalXP,
    level: newLevel,
    rank: newRank,
    title: newTitle,
    xpToNextLevel: newXPToNextLevel,
    leveledUp,
    rankedUp,
  } as any;
}

export async function updateWarriorStreak(uid: string): Promise<void> {
  const warrior = await getWarriorProfile(uid);
  if (!warrior) throw new Error('Warrior profile not found');
  
  const today = new Date();
  const lastActive = warrior.lastActiveDate;
  
  // Check if this is a new day
  const isNewDay = !isSameDay(today, lastActive);
  
  if (isNewDay) {
    // Check if streak continues (yesterday)
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const streakContinues = isSameDay(lastActive, yesterday);
    
    const newStreak = streakContinues ? warrior.currentStreak + 1 : 1;
    const newLongestStreak = Math.max(newStreak, warrior.longestStreak);
    
    await updateWarriorProfile(uid, {
      currentStreak: newStreak,
      longestStreak: newLongestStreak,
      lastActiveDate: today,
    });
  }
}

export async function incrementQuestComplete(uid: string): Promise<void> {
  const warrior = await getWarriorProfile(uid);
  if (!warrior) throw new Error('Warrior profile not found');
  
  await updateWarriorProfile(uid, {
    questsCompleted: warrior.questsCompleted + 1,
  });
}

export async function incrementChallengeComplete(uid: string, isPerfect: boolean = false): Promise<void> {
  const warrior = await getWarriorProfile(uid);
  if (!warrior) throw new Error('Warrior profile not found');
  
  await updateWarriorProfile(uid, {
    challengesCompleted: warrior.challengesCompleted + 1,
    perfectChallenges: isPerfect ? warrior.perfectChallenges + 1 : warrior.perfectChallenges,
  });
}

export async function incrementBossDefeated(uid: string): Promise<void> {
  const warrior = await getWarriorProfile(uid);
  if (!warrior) throw new Error('Warrior profile not found');
  
  await updateWarriorProfile(uid, {
    bossesDefeated: warrior.bossesDefeated + 1,
  });
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function isSameDay(date1: Date, date2: Date): boolean {
  // Ensure both are Date objects
  const d1 = date1 instanceof Date ? date1 : new Date(date1);
  const d2 = date2 instanceof Date ? date2 : new Date(date2);
  
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

// ============================================================================
// WARRIOR STATS
// ============================================================================

export interface WarriorStats {
  totalXP: number;
  level: number;
  rank: WarriorRank;
  questsCompleted: number;
  challengesCompleted: number;
  bossesDefeated: number;
  perfectChallenges: number;
  currentStreak: number;
  longestStreak: number;
  accuracyRate: number; // Perfect / Total challenges
  averageXPPerDay: number;
}

export async function getWarriorStats(uid: string): Promise<WarriorStats> {
  const warrior = await getWarriorProfile(uid);
  if (!warrior) throw new Error('Warrior profile not found');
  
  const accuracyRate = warrior.challengesCompleted > 0
    ? Math.round((warrior.perfectChallenges / warrior.challengesCompleted) * 100)
    : 0;
  
  const daysSinceCreated = Math.max(
    1,
    Math.floor((Date.now() - warrior.createdAt.getTime()) / (1000 * 60 * 60 * 24))
  );
  const averageXPPerDay = Math.round(warrior.totalXP / daysSinceCreated);
  
  return {
    totalXP: warrior.totalXP,
    level: warrior.level,
    rank: warrior.rank,
    questsCompleted: warrior.questsCompleted,
    challengesCompleted: warrior.challengesCompleted,
    bossesDefeated: warrior.bossesDefeated,
    perfectChallenges: warrior.perfectChallenges,
    currentStreak: warrior.currentStreak,
    longestStreak: warrior.longestStreak,
    accuracyRate,
    averageXPPerDay,
  };
}