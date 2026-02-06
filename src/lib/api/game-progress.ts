/**
 * GAME PROGRESS API
 * Client-side integration for student game progress tracking
 * Includes XP calculation, level progression, gems, and character unlocking
 */

import { supabase } from '../supabase/client';

// ============================================================================
// TYPES
// ============================================================================

export interface GameState {
  user_id: string;
  current_level: number;
  total_xp: number;
  gems: number;
  unlocked_characters: string[];
  created_at: string;
  updated_at: string;
}

export interface CharacterUnlock {
  character_id: string;
  level_required: number;
  name: string;
  description: string;
}

// ============================================================================
// CHARACTER UNLOCK CONFIGURATION
// ============================================================================

const CHARACTER_UNLOCKS: CharacterUnlock[] = [
  {
    character_id: 'wise_owl',
    level_required: 1,
    name: 'Wise Owl',
    description: 'Your starter companion - wise and encouraging!',
  },
  {
    character_id: 'sparkle_unicorn',
    level_required: 1,
    name: 'Sparkle Unicorn',
    description: 'Your starter companion - magical and fun!',
  },
  {
    character_id: 'swift_horse',
    level_required: 5,
    name: 'Swift Horse',
    description: 'Unlock at Level 5 - gallop through challenges!',
  },
  {
    character_id: 'grammar_goat',
    level_required: 10,
    name: 'Grammar Goat',
    description: 'Unlock at Level 10 - master of words!',
  },
  {
    character_id: 'math_dragon',
    level_required: 15,
    name: 'Math Dragon',
    description: 'Unlock at Level 15 - breathes fire with numbers!',
  },
  {
    character_id: 'science_fox',
    level_required: 20,
    name: 'Science Fox',
    description: 'Unlock at Level 20 - clever and curious!',
  },
];

// ============================================================================
// LEVEL CALCULATION
// ============================================================================

/**
 * Calculate level from total XP
 * Formula: Level = floor(total_xp / 1000) + 1
 * Every 1000 XP = 1 level
 */
export function calculateLevel(totalXp: number): number {
  return Math.floor(totalXp / 1000) + 1;
}

/**
 * Calculate XP needed for next level
 */
export function getXpForNextLevel(currentLevel: number): number {
  return currentLevel * 1000;
}

/**
 * Calculate progress to next level as percentage
 */
export function getLevelProgress(totalXp: number): {
  currentLevel: number;
  xpInCurrentLevel: number;
  xpNeededForNext: number;
  progressPercentage: number;
} {
  const currentLevel = calculateLevel(totalXp);
  const xpNeededForNext = getXpForNextLevel(currentLevel);
  const xpAtLevelStart = (currentLevel - 1) * 1000;
  const xpInCurrentLevel = totalXp - xpAtLevelStart;
  const progressPercentage = (xpInCurrentLevel / 1000) * 100;

  return {
    currentLevel,
    xpInCurrentLevel,
    xpNeededForNext,
    progressPercentage: Math.min(progressPercentage, 100),
  };
}

/**
 * Get characters that should be unlocked at a given level
 */
export function getUnlockedCharactersAtLevel(level: number): string[] {
  return CHARACTER_UNLOCKS
    .filter(char => char.level_required <= level)
    .map(char => char.character_id);
}

// ============================================================================
// DATABASE QUERIES
// ============================================================================

/**
 * Get current game state for a student
 */
export async function getUserGameState(userId: string): Promise<GameState | null> {
  try {
    const { data, error } = await supabase
      .from('student_profiles')
      .select('id, current_level, total_xp, gems, unlocked_characters, created_at, updated_at')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching game state:', error);
      return null;
    }

    return {
      user_id: data.id,
      current_level: data.current_level,
      total_xp: data.total_xp,
      gems: data.gems,
      unlocked_characters: data.unlocked_characters || ['wise_owl', 'sparkle_unicorn'],
      created_at: data.created_at,
      updated_at: data.updated_at,
    };
  } catch (err) {
    console.error('Exception in getUserGameState:', err);
    return null;
  }
}

/**
 * Update student progress with XP and gems
 * Auto-calculates level and unlocks characters
 */
export async function updateProgress(
  userId: string,
  xpGained: number,
  gemsGained: number = 0
): Promise<{
  success: boolean;
  newLevel?: number;
  leveledUp?: boolean;
  newCharacters?: string[];
  error?: string;
}> {
  try {
    // 1. Get current state
    const current = await getUserGameState(userId);
    if (!current) {
      return {
        success: false,
        error: 'Could not fetch current game state',
      };
    }

    // 2. Calculate new values
    const newTotalXp = current.total_xp + xpGained;
    const newGems = current.gems + gemsGained;
    const oldLevel = current.current_level;
    const newLevel = calculateLevel(newTotalXp);
    const leveledUp = newLevel > oldLevel;

    // 3. Check for new character unlocks
    const currentUnlocked = current.unlocked_characters;
    const shouldBeUnlocked = getUnlockedCharactersAtLevel(newLevel);
    const newCharacters = shouldBeUnlocked.filter(
      char => !currentUnlocked.includes(char)
    );

    // 4. Merge unlocked characters (keep old + add new)
    const updatedUnlockedCharacters = [
      ...new Set([...currentUnlocked, ...newCharacters]),
    ];

    // 5. Update database
    const { error } = await supabase
      .from('student_profiles')
      .update({
        total_xp: newTotalXp,
        current_level: newLevel,
        gems: newGems,
        unlocked_characters: updatedUnlockedCharacters,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (error) {
      console.error('Error updating progress:', error);
      return {
        success: false,
        error: error.message,
      };
    }

    // 6. Log activity if leveled up
    if (leveledUp) {
      await supabase.from('activity_log').insert({
        student_id: userId,
        activity_type: 'level_up',
        activity_data: {
          old_level: oldLevel,
          new_level: newLevel,
          xp_gained: xpGained,
        },
      });
    }

    // 7. Log character unlocks
    if (newCharacters.length > 0) {
      await supabase.from('activity_log').insert({
        student_id: userId,
        activity_type: 'character_unlock',
        activity_data: {
          characters: newCharacters,
          level: newLevel,
        },
      });
    }

    return {
      success: true,
      newLevel,
      leveledUp,
      newCharacters: newCharacters.length > 0 ? newCharacters : undefined,
    };
  } catch (err) {
    console.error('Exception in updateProgress:', err);
    return {
      success: false,
      error: String(err),
    };
  }
}

/**
 * Award XP only (no gems)
 */
export async function awardXp(userId: string, xpAmount: number) {
  return updateProgress(userId, xpAmount, 0);
}

/**
 * Award gems only (no XP)
 */
export async function awardGems(userId: string, gemsAmount: number) {
  return updateProgress(userId, 0, gemsAmount);
}

/**
 * Spend gems (e.g., for shop purchases)
 */
export async function spendGems(
  userId: string,
  gemsAmount: number
): Promise<{ success: boolean; error?: string }> {
  try {
    const current = await getUserGameState(userId);
    if (!current) {
      return { success: false, error: 'Could not fetch game state' };
    }

    if (current.gems < gemsAmount) {
      return { success: false, error: 'Not enough gems' };
    }

    const { error } = await supabase
      .from('student_profiles')
      .update({
        gems: current.gems - gemsAmount,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}

/**
 * Manually unlock a character (e.g., from shop or special event)
 */
export async function unlockCharacter(
  userId: string,
  characterId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const current = await getUserGameState(userId);
    if (!current) {
      return { success: false, error: 'Could not fetch game state' };
    }

    if (current.unlocked_characters.includes(characterId)) {
      return { success: false, error: 'Character already unlocked' };
    }

    const updatedCharacters = [...current.unlocked_characters, characterId];

    const { error } = await supabase
      .from('student_profiles')
      .update({
        unlocked_characters: updatedCharacters,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (error) {
      return { success: false, error: error.message };
    }

    // Log the unlock
    await supabase.from('activity_log').insert({
      student_id: userId,
      activity_type: 'character_unlock',
      activity_data: {
        characters: [characterId],
        method: 'manual',
      },
    });

    return { success: true };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}

/**
 * Get all available characters with unlock status
 */
export async function getCharacterStatus(userId: string): Promise<
  Array<{
    character: CharacterUnlock;
    unlocked: boolean;
    canUnlock: boolean;
  }>
> {
  const current = await getUserGameState(userId);
  if (!current) return [];

  return CHARACTER_UNLOCKS.map(character => ({
    character,
    unlocked: current.unlocked_characters.includes(character.character_id),
    canUnlock: current.current_level >= character.level_required,
  }));
}

/**
 * Get leaderboard (top students by XP)
 */
export async function getLeaderboard(limit: number = 10): Promise<
  Array<{
    student_id: string;
    display_name: string;
    total_xp: number;
    current_level: number;
    rank: number;
  }>
> {
  try {
    const { data, error } = await supabase.rpc('get_leaderboard', {
      p_tier: null,
      p_limit: limit,
    });

    if (error) {
      console.error('Error fetching leaderboard:', error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('Exception in getLeaderboard:', err);
    return [];
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  getUserGameState,
  updateProgress,
  awardXp,
  awardGems,
  spendGems,
  unlockCharacter,
  getCharacterStatus,
  getLeaderboard,
  calculateLevel,
  getXpForNextLevel,
  getLevelProgress,
  CHARACTER_UNLOCKS,
};
