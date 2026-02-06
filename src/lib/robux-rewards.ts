/**
 * Robux Rewards System
 * 800 XP = 800 Robux redeemable
 * Promotes safe risk-taking through extrinsic rewards → intrinsic motivation
 */

export interface RobuxTransaction {
  id: string;
  studentId: string;
  type: 'earn' | 'redeem';
  amount: number;
  xpCost?: number;
  reason: string;
  timestamp: Date;
  status: 'pending' | 'completed' | 'denied';
}

export interface RobuxBalance {
  studentId: string;
  totalEarned: number;
  totalRedeemed: number;
  currentBalance: number;
  lastUpdated: Date;
}

// ==================== CONVERSION RATE ====================

export const XP_TO_ROBUX_RATE = 1; // 1 XP = 1 Robux
export const MIN_REDEMPTION = 800; // Minimum 800 Robux to redeem

// ==================== ROBUX CALCULATIONS ====================

export function calculateRobuxFromXP(xp: number): number {
  return Math.floor(xp * XP_TO_ROBUX_RATE);
}

export function calculateXPFromRobux(robux: number): number {
  return Math.floor(robux / XP_TO_ROBUX_RATE);
}

export function canRedeemRobux(currentBalance: number): boolean {
  return currentBalance >= MIN_REDEMPTION;
}

export function getNextMilestone(currentBalance: number): number {
  if (currentBalance < MIN_REDEMPTION) {
    return MIN_REDEMPTION;
  }
  // Return next 100 increment
  return Math.ceil(currentBalance / 100) * 100;
}

// ==================== EARNING ROBUX ====================

export function earnRobuxForActivity(
  activityType: 'challenge_complete' | 'quest_complete' | 'daily_login' | 'streak' | 'mastery',
  xpEarned: number
): RobuxTransaction {
  const robuxAmount = calculateRobuxFromXP(xpEarned);
  
  return {
    id: `earn-${Date.now()}`,
    studentId: 'PLACEHOLDER_STUDENT_ID',
    type: 'earn',
    amount: robuxAmount,
    reason: getEarnReason(activityType, xpEarned),
    timestamp: new Date(),
    status: 'completed',
  };
}

function getEarnReason(activityType: string, xp: number): string {
  const reasons: Record<string, string> = {
    challenge_complete: `Completed challenge! +${xp} XP`,
    quest_complete: `Finished entire quest! +${xp} XP`,
    daily_login: `Logged in today! +${xp} XP`,
    streak: `${Math.floor(xp / 10)} day streak! +${xp} XP`,
    mastery: `Mastered a skill! +${xp} XP`,
  };
  return reasons[activityType] || `Earned ${xp} XP!`;
}

// ==================== REDEEMING ROBUX ====================

export function createRedemptionRequest(
  studentId: string,
  robuxAmount: number,
  robloxUsername: string
): RobuxTransaction {
  return {
    id: `redeem-${Date.now()}`,
    studentId,
    type: 'redeem',
    amount: robuxAmount,
    xpCost: calculateXPFromRobux(robuxAmount),
    reason: `Redeemed ${robuxAmount} Robux to @${robloxUsername}`,
    timestamp: new Date(),
    status: 'pending',
  };
}

// ==================== ROBUX BALANCE ====================

export function getRobuxBalance(studentId: string): RobuxBalance {
  // Demo mode: Load from localStorage
  const stored = localStorage.getItem(`robuxBalance-${studentId}`);
  
  if (stored) {
    const balance = JSON.parse(stored);
    balance.lastUpdated = new Date(balance.lastUpdated);
    return balance;
  }
  
  // Default balance
  return {
    studentId,
    totalEarned: 0,
    totalRedeemed: 0,
    currentBalance: 0,
    lastUpdated: new Date(),
  };
}

export function updateRobuxBalance(
  studentId: string,
  transaction: RobuxTransaction
): RobuxBalance {
  const balance = getRobuxBalance(studentId);
  
  if (transaction.type === 'earn') {
    balance.totalEarned += transaction.amount;
    balance.currentBalance += transaction.amount;
  } else if (transaction.type === 'redeem' && transaction.status === 'completed') {
    balance.totalRedeemed += transaction.amount;
    balance.currentBalance -= transaction.amount;
  }
  
  balance.lastUpdated = new Date();
  
  // Save to localStorage (demo mode)
  localStorage.setItem(`robuxBalance-${studentId}`, JSON.stringify(balance));
  
  return balance;
}

// ==================== TRANSACTION HISTORY ====================

export function saveTransaction(transaction: RobuxTransaction): void {
  const studentId = transaction.studentId;
  const key = `robuxTransactions-${studentId}`;
  
  const stored = localStorage.getItem(key);
  const transactions: RobuxTransaction[] = stored ? JSON.parse(stored) : [];
  
  transactions.push(transaction);
  
  // Keep last 100 transactions
  if (transactions.length > 100) {
    transactions.shift();
  }
  
  localStorage.setItem(key, JSON.stringify(transactions));
}

export function getTransactionHistory(studentId: string, limit: number = 10): RobuxTransaction[] {
  const key = `robuxTransactions-${studentId}`;
  const stored = localStorage.getItem(key);
  
  if (!stored) return [];
  
  const transactions: RobuxTransaction[] = JSON.parse(stored);
  
  // Convert timestamps back to Date objects
  transactions.forEach(t => {
    t.timestamp = new Date(t.timestamp);
  });
  
  // Return most recent first
  return transactions
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, limit);
}

// ==================== PARENT APPROVAL ====================

export function approveRedemption(transactionId: string): RobuxTransaction | null {
  // In production, this would be a Firebase function
  // For demo, update localStorage
  
  // Find all students (in production, would be from Firestore)
  const allTransactions: RobuxTransaction[] = [];
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith('robuxTransactions-')) {
      const stored = localStorage.getItem(key);
      if (stored) {
        const transactions: RobuxTransaction[] = JSON.parse(stored);
        allTransactions.push(...transactions);
      }
    }
  }
  
  const transaction = allTransactions.find(t => t.id === transactionId);
  
  if (transaction && transaction.status === 'pending') {
    transaction.status = 'completed';
    
    // Update balance
    updateRobuxBalance(transaction.studentId, transaction);
    
    return transaction;
  }
  
  return null;
}

// ==================== WOWL MESSAGES ====================

export function getWowlRobuxMessage(eventType: 'earn' | 'milestone' | 'redeem', amount: number): string {
  const messages = {
    earn: [
      `+${amount} Robux earned.`,
      `${amount} Robux added to your balance.`,
      `Earned ${amount} Robux for that work.`,
    ],
    milestone: [
      `You hit ${amount} Robux. You can redeem now.`,
      `${amount} Robux milestone reached. Redemption available.`,
      `Redemption threshold met: ${amount} Robux.`,
    ],
    redeem: [
      `${amount} Robux redemption processing.`,
      `Redeeming ${amount} Robux. Check with your parent.`,
      `${amount} Robux request submitted.`,
    ],
  };
  
  const options = messages[eventType];
  return options[Math.floor(Math.random() * options.length)];
}

// ==================== PSYCHOLOGICALLY SAFE MESSAGING ====================

export function getEncouragementForLowBalance(currentBalance: number): string {
  const needed = MIN_REDEMPTION - currentBalance;
  
  if (currentBalance === 0) {
    return `Complete challenges to earn Robux. Every XP counts.`;
  }
  
  if (needed > 600) {
    return `${currentBalance} Robux earned so far. Keep working through challenges.`;
  }
  
  if (needed > 400) {
    return `${currentBalance} Robux. Almost halfway to redemption.`;
  }
  
  if (needed > 200) {
    return `${currentBalance} Robux. More than halfway there.`;
  }
  
  return `${needed} more Robux to redeem. Almost there.`;
}

// ==================== INTEGRATION WITH XP ====================

export function syncRobuxWithXP(studentId: string, totalXP: number): void {
  const balance = getRobuxBalance(studentId);
  const expectedRobux = calculateRobuxFromXP(totalXP);
  
  // If there's a discrepancy, add a correction transaction
  if (balance.totalEarned < expectedRobux) {
    const diff = expectedRobux - balance.totalEarned;
    const correction: RobuxTransaction = {
      id: `sync-${Date.now()}`,
      studentId,
      type: 'earn',
      amount: diff,
      reason: 'Balance sync correction',
      timestamp: new Date(),
      status: 'completed',
    };
    
    updateRobuxBalance(studentId, correction);
    saveTransaction(correction);
  }
}