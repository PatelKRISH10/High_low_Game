import { AIStrategy } from './StrategyInterface';
import { GameMemory } from './GameMemory';
import { NormalStrategy } from './NormalStrategy';

/**
 * Machine Learning Strategy Interface & Implementation
 *
 * Prepared for Phase 2 integration.
 * In Phase 1, Hell mode defaults to NormalStrategy (or MLStrategy using NormalStrategy fallback),
 * while capturing all game traces into the PostgreSQL database for model training.
 * 
 * To activate a custom ML model (e.g. PyTorch / ONNX Runtime / HuggingFace endpoint),
 * simply plug in the inference weights or endpoint inside predictOptimalGuess()
 * without modifying any UI components or page logic.
 */
export class MLStrategy implements AIStrategy {
  public readonly name = 'Hell (Machine Learning Neural Policy Model)';
  private fallbackStrategy: NormalStrategy;
  private modelEndpoint?: string;

  constructor(modelEndpoint?: string) {
    this.fallbackStrategy = new NormalStrategy();
    this.modelEndpoint = modelEndpoint;
  }

  public calculateGuess(memory: GameMemory): number {
    // If an external ML inference pipeline or weights are provided, execute ML inference
    if (this.modelEndpoint) {
      const mlGuess = this.predictFromEndpoint(memory);
      if (mlGuess !== null) {
        return mlGuess;
      }
    }

    // Phase 1: Delegates to NormalStrategy while collecting Hell mode game records
    return this.fallbackStrategy.calculateGuess(memory);
  }

  private predictFromEndpoint(memory: GameMemory): number | null {
    // Future expansion hook for ONNX/TensorFlow.js or remote inference API
    const { min, max } = memory.getRemainingRange();
    if (min >= max) return min;
    return null;
  }
}

