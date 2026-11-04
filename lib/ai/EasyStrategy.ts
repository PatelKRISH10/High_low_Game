import { AIStrategy } from './StrategyInterface';
import { GameMemory } from './GameMemory';

export class EasyStrategy implements AIStrategy {
  public readonly name = 'Easy (Binary Search with Random Finish)';

  public calculateGuess(memory: GameMemory): number {
    const { min, max, count } = memory.getRemainingRange();

    if (min >= max) {
      return min;
    }

    // If remaining range is under 10 numbers: switch to random guessing
    if (count < 10) {
      const candidates: number[] = [];
      for (let i = min; i <= max; i++) {
        if (!memory.hasGuessed(i)) {
          candidates.push(i);
        }
      }

      if (candidates.length > 0) {
        const randomIndex = Math.floor(Math.random() * candidates.length);
        return candidates[randomIndex];
      }
    }

    // Default: Binary Search - always guess middle
    const mid = Math.floor((min + max) / 2);
    if (!memory.hasGuessed(mid)) {
      return mid;
    }

    // If mid was somehow previously checked, scan closest unguessed neighbor
    for (let offset = 1; offset <= max - min; offset++) {
      if (mid + offset <= max && !memory.hasGuessed(mid + offset)) {
        return mid + offset;
      }
      if (mid - offset >= min && !memory.hasGuessed(mid - offset)) {
        return mid - offset;
      }
    }

    return mid;
  }
}

