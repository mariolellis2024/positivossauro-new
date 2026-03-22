/**
 * Persistence layer for game progress using localStorage.
 * No login required — everything stays on the user's device.
 */

const STORAGE_KEY = "positivossauro-progress";

export interface GameProgress {
  completedCollections: number[];
  bestTimes: Record<number, number>; // collectionIndex → ms
  totalWordsFound: number;
  hintsUsed: number;
  streak: { count: number; lastPlayedDate: string };
  badges: string[];
  sessionsPlayed: number;
}

function defaultProgress(): GameProgress {
  return {
    completedCollections: [],
    bestTimes: {},
    totalWordsFound: 0,
    hintsUsed: 0,
    streak: { count: 0, lastPlayedDate: "" },
    badges: [],
    sessionsPlayed: 0,
  };
}

export function loadProgress(): GameProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultProgress();
    return { ...defaultProgress(), ...JSON.parse(raw) };
  } catch {
    return defaultProgress();
  }
}

export function saveProgress(progress: GameProgress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // Storage full or unavailable — silently fail
  }
}

/**
 * Update the daily streak.
 * Call this once per session when the player completes at least one collection.
 */
export function updateStreak(progress: GameProgress): GameProgress {
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const { lastPlayedDate, count } = progress.streak;

  if (lastPlayedDate === today) {
    // Already played today, no change
    return progress;
  }

  const yesterday = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10);

  if (lastPlayedDate === yesterday) {
    // Consecutive day!
    return {
      ...progress,
      streak: { count: count + 1, lastPlayedDate: today },
    };
  }

  // Streak broken (or first time)
  return {
    ...progress,
    streak: { count: 1, lastPlayedDate: today },
  };
}

/**
 * Badge definitions and checker.
 */
export interface BadgeDef {
  id: string;
  label: string;
  emoji: string;
  description: string;
  check: (p: GameProgress) => boolean;
}

export const BADGE_DEFINITIONS: BadgeDef[] = [
  {
    id: "first_collection",
    label: "primeira coleção",
    emoji: "🌱",
    description: "completou a primeira coleção",
    check: (p) => p.completedCollections.length >= 1,
  },
  {
    id: "five_collections",
    label: "explorador",
    emoji: "🧭",
    description: "completou 5 coleções",
    check: (p) => p.completedCollections.length >= 5,
  },
  {
    id: "all_collections",
    label: "mestre das palavras",
    emoji: "👑",
    description: "completou todas as 18 coleções",
    check: (p) => p.completedCollections.length >= 18,
  },
  {
    id: "fifty_words",
    label: "caçador de palavras",
    emoji: "🔍",
    description: "encontrou 50 palavras no total",
    check: (p) => p.totalWordsFound >= 50,
  },
  {
    id: "hundred_words",
    label: "lenda das palavras",
    emoji: "⭐",
    description: "encontrou 100 palavras no total",
    check: (p) => p.totalWordsFound >= 100,
  },
  {
    id: "streak_3",
    label: "3 dias seguidos",
    emoji: "🔥",
    description: "jogou 3 dias seguidos",
    check: (p) => p.streak.count >= 3,
  },
  {
    id: "streak_7",
    label: "uma semana inteira",
    emoji: "💪",
    description: "jogou 7 dias seguidos",
    check: (p) => p.streak.count >= 7,
  },
  {
    id: "streak_30",
    label: "compromisso consigo",
    emoji: "🦕",
    description: "jogou 30 dias seguidos",
    check: (p) => p.streak.count >= 30,
  },
  {
    id: "no_hints",
    label: "sem ajuda",
    emoji: "🧠",
    description: "completou uma sessão sem pedir dica",
    // This is checked differently (per session), so always false here.
    // It's granted manually in game logic.
    check: () => false,
  },
];

/**
 * Check all badges and return newly unlocked ones.
 */
export function checkBadges(progress: GameProgress): string[] {
  const newBadges: string[] = [];
  for (const badge of BADGE_DEFINITIONS) {
    if (!progress.badges.includes(badge.id) && badge.check(progress)) {
      newBadges.push(badge.id);
    }
  }
  return newBadges;
}
