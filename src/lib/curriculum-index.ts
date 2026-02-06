import { Level } from './curriculum-data';
import L1UM from './curriculum-data';
import L2UM from './curriculum-data-L2UM';
import L3UM from './curriculum-data-L3UM';
import { 
  WARRIORS_CURRICULUM, 
  type WarriorQuest,
  getWarriorQuestByWeek,
  getWarriorQuestById,
  getTotalWarriorsXP,
  calculateWarriorQuestProgress 
} from './curriculum/warriors-curriculum';
import { EXPLORERS_HUB_CURRICULUM, type ExplorerQuest } from './curriculum/explorers-hub-curriculum';

// All Math Curriculum Levels
export const MathCurriculum: Level[] = [L1UM, L2UM, L3UM];

// Tier-Based Curricula
export {
  WARRIORS_CURRICULUM,
  EXPLORERS_HUB_CURRICULUM,
  getWarriorQuestByWeek,
  getWarriorQuestById,
  getTotalWarriorsXP,
  calculateWarriorQuestProgress,
};

export type { WarriorQuest, ExplorerQuest };

// Export individual levels
export { L1UM, L2UM, L3UM };