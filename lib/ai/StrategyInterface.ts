import { GameMemory } from './GameMemory';

export interface AIStrategy {
  readonly name: string;
  calculateGuess(memory: GameMemory): number;
  reset?(): void;
}

