import { GuessFeedback } from '@/types/game';

export interface GuessHistoryEntry {
  guess: number;
  response: GuessFeedback;
  remainingMin: number;
  remainingMax: number;
  timestamp: number;
}

export class GameMemory {
  private _minBound: number;
  private _maxBound: number;
  private readonly _initialMin: number;
  private readonly _initialMax: number;
  private readonly _history: GuessHistoryEntry[] = [];
  private readonly _guessedNumbers: Set<number> = new Set();

  constructor(min: number = 1, max: number = 100) {
    this._initialMin = min;
    this._initialMax = max;
    this._minBound = min;
    this._maxBound = max;
  }

  get minBound(): number {
    return this._minBound;
  }

  get maxBound(): number {
    return this._maxBound;
  }

  get initialMin(): number {
    return this._initialMin;
  }

  get initialMax(): number {
    return this._initialMax;
  }

  get history(): ReadonlyArray<GuessHistoryEntry> {
    return this._history;
  }

  public hasGuessed(num: number): boolean {
    return this._guessedNumbers.has(num);
  }

  public getRemainingRange(): { min: number; max: number; count: number } {
    const count = Math.max(0, this._maxBound - this._minBound + 1);
    return {
      min: this._minBound,
      max: this._maxBound,
      count,
    };
  }

  /**
   * Updates search boundaries based on opponent feedback.
   * - "higher": Secret number is HIGHER than guess -> minBound becomes guess + 1
   * - "lower": Secret number is LOWER than guess -> maxBound becomes guess - 1
   * - "correct": Bound collapses to guess
   */
  public updateBounds(guess: number, response: GuessFeedback): void {
    this._guessedNumbers.add(guess);

    if (response === 'higher') {
      this._minBound = Math.max(this._minBound, guess + 1);
    } else if (response === 'lower') {
      this._maxBound = Math.min(this._maxBound, guess - 1);
    } else if (response === 'correct') {
      this._minBound = guess;
      this._maxBound = guess;
    }

    // Safety guard to ensure min never strictly exceeds max
    if (this._minBound > this._maxBound) {
      this._minBound = Math.min(this._minBound, this._maxBound);
    }

    this._history.push({
      guess,
      response,
      remainingMin: this._minBound,
      remainingMax: this._maxBound,
      timestamp: Date.now(),
    });
  }

  public reset(min?: number, max?: number): void {
    this._minBound = min ?? this._initialMin;
    this._maxBound = max ?? this._initialMax;
    this._history.length = 0;
    this._guessedNumbers.clear();
  }
}

