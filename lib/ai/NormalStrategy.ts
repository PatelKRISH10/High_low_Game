import { AIStrategy } from './StrategyInterface';
import { GameMemory } from './GameMemory';
import { HumanPreference } from './HumanPreference';

export class NormalStrategy implements AIStrategy {
  public readonly name = 'Normal (Binary Search + Human Preference Heuristics)';

  public calculateGuess(memory: GameMemory): number {
    const { min, max } = memory.getRemainingRange();

    if (min >= max) {
      return min;
    }

    const mid = Math.floor((min + max) / 2);

    // If mid itself has not been guessed, check if a strong human preference number is nearby
    const biasedCandidate = HumanPreference.findBestBiasedCandidate(
      min,
      max,
      mid,
      (num) => memory.hasGuessed(num)
    );

    if (biasedCandidate !== null) {
      return biasedCandidate;
    }

    if (!memory.hasGuessed(mid)) {
      return mid;
    }

    // Fallback: search closest unguessed candidate to mid
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

