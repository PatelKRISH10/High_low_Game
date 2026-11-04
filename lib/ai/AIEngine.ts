import { Difficulty, GuessFeedback } from '@/types/game';
import { AIStrategy } from './StrategyInterface';
import { EasyStrategy } from './EasyStrategy';
import { NormalStrategy } from './NormalStrategy';
import { MLStrategy } from './MLStrategy';
import { GameMemory } from './GameMemory';
import { GameRecorder } from './GameRecorder';

/**
 * AIEngine
 * 
 * Central facade for all AI decision-making.
 * The UI layer NEVER directly calculates AI guesses or exposes internal strategies.
 * It strictly communicates through AIEngine.
 */
export class AIEngine {
  private static instance: AIEngine | null = null;

  private memory: GameMemory;
  private recorder: GameRecorder;
  private strategies: Map<Difficulty, AIStrategy>;
  private currentDifficulty: Difficulty = 'normal';

  constructor(min: number = 1, max: number = 100) {
    this.memory = new GameMemory(min, max);
    this.recorder = new GameRecorder();

    // Strategy Registry: modular and open for extension
    this.strategies = new Map<Difficulty, AIStrategy>([
      ['easy', new EasyStrategy()],
      ['normal', new NormalStrategy()],
      // Hell mode currently utilizes MLStrategy (which in Phase 1 uses NormalStrategy and logs all data)
      ['hell', new MLStrategy()],
    ]);
  }

  public static getInstance(): AIEngine {
    if (!AIEngine.instance) {
      AIEngine.instance = new AIEngine(1, 100);
    }
    return AIEngine.instance;
  }

  /**
   * Pluggable strategy replacer.
   * Allows hot-swapping any difficulty's strategy (e.g. replacing Normal with MLStrategy)
   * at runtime without touching UI code.
   */
  public setStrategy(difficulty: Difficulty, strategy: AIStrategy): void {
    this.strategies.set(difficulty, strategy);
  }

  /**
   * Initializes or resets the AI for a new game match.
   */
  public initGame(
    difficulty: Difficulty,
    min: number,
    max: number,
    humanSecret: number = 0,
    aiSecret: number = 0
  ): void {
    this.currentDifficulty = difficulty;
    this.memory.reset(min, max);
    this.recorder.startSession(difficulty, humanSecret, aiSecret);
  }

  /**
   * Records the feedback for an AI guess to update its search memory.
   */
  public recordFeedback(guess: number, response: GuessFeedback): void {
    this.memory.updateBounds(guess, response);
  }

  /**
   * Computes and returns the next guess chosen by the AI.
   * The UI strictly calls this method.
   */
  public getNextGuess(): number {
    const strategy = this.strategies.get(this.currentDifficulty) ?? this.strategies.get('normal')!;
    return strategy.calculateGuess(this.memory);
  }

  /**
   * Static helper for direct invocation: AIEngine.getNextGuess()
   */
  public static getNextGuess(): number {
    return AIEngine.getInstance().getNextGuess();
  }

  /**
   * Static helper to init game
   */
  public static initGame(
    difficulty: Difficulty,
    min: number,
    max: number,
    humanSecret: number = 0,
    aiSecret: number = 0
  ): void {
    AIEngine.getInstance().initGame(difficulty, min, max, humanSecret, aiSecret);
  }

  /**
   * Static helper to record feedback
   */
  public static recordFeedback(guess: number, response: GuessFeedback): void {
    AIEngine.getInstance().recordFeedback(guess, response);
  }

  public getMemory(): GameMemory {
    return this.memory;
  }

  public getRecorder(): GameRecorder {
    return this.recorder;
  }

  public getActiveStrategyName(): string {
    const strategy = this.strategies.get(this.currentDifficulty);
    return strategy ? strategy.name : 'Unknown Strategy';
  }
}

