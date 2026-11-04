import { Difficulty, DIFFICULTY_CONFIGS } from '@/types/game';

/**
 * Generates a random integer within inclusive bounds [min, max].
 */
export function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Calculates remaining percentage of search space.
 */
export function calculateEntropyReduction(
  initialMin: number,
  initialMax: number,
  currentMin: number,
  currentMax: number
): { remainingCount: number; initialCount: number; reductionPercent: number } {
  const initialCount = initialMax - initialMin + 1;
  const currentCount = Math.max(1, currentMax - currentMin + 1);
  const eliminated = initialCount - currentCount;
  const reductionPercent = Math.min(100, Math.max(0, Math.round((eliminated / initialCount) * 100)));

  return {
    remainingCount: currentCount,
    initialCount,
    reductionPercent,
  };
}

/**
 * Formats numbers with commas (e.g. 10,000)
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat().format(num);
}

/**
 * Returns formatted relative or readable date.
 */
export function formatDate(dateString?: string | Date): string {
  if (!dateString) return 'Just now';
  const d = new Date(dateString);
  return d.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

