export type Difficulty = 'easy' | 'normal' | 'hell';

export type Player = 'human' | 'ai';

export type GuessFeedback = 'higher' | 'lower' | 'correct';

export type GameStatus =
  | 'idle'
  | 'choosing_secret'
  | 'coin_toss'
  | 'in_progress'
  | 'game_over';

export interface TurnRecord {
  turnNumber: number;
  player: Player;
  guess: number;
  response: GuessFeedback;
  remainingMin: number;
  remainingMax: number;
  timestamp?: number;
}

export interface GameRecord {
  id?: string;
  difficulty: Difficulty;
  winner: Player;
  humanSecret: number;
  aiSecret: number;
  totalTurns: number;
  createdAt?: string | Date;
  turns: TurnRecord[];
}

export interface DifficultyConfig {
  key: Difficulty;
  label: string;
  min: number;
  max: number;
  description: string;
  badge: string;
  badgeColor: string;
}

export const DIFFICULTY_CONFIGS: Record<Difficulty, DifficultyConfig> = {
  easy: {
    key: 'easy',
    label: 'Easy',
    min: 1,
    max: 100,
    description: 'Quick and accessible match with numbers between 1 and 100. Great for a fast duel.',
    badge: '1 - 100',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  normal: {
    key: 'normal',
    label: 'Normal',
    min: 1,
    max: 1000,
    description: 'A balanced challenge of logic and deduction across numbers 1 to 1,000.',
    badge: '1 - 1,000',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  hell: {
    key: 'hell',
    label: 'Hell',
    min: 1,
    max: 10000,
    description: 'An expansive range across 1 to 10,000 for the ultimate test of patience and skill.',
    badge: '1 - 10,000',
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
  },
};

export interface StatisticsData {
  difficulty: Difficulty;
  gamesPlayed: number;
  humanWins: number;
  aiWins: number;
  averageTurns: number;
}
