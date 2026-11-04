import { Difficulty, GameRecord, Player, TurnRecord } from '@/types/game';

export class GameRecorder {
  private currentDifficulty: Difficulty = 'normal';
  private humanSecretNumber: number = 0;
  private aiSecretNumber: number = 0;
  private turns: TurnRecord[] = [];
  private startTime: number = Date.now();

  public startSession(
    difficulty: Difficulty,
    humanSecret: number,
    aiSecret: number
  ): void {
    this.currentDifficulty = difficulty;
    this.humanSecretNumber = humanSecret;
    this.aiSecretNumber = aiSecret;
    this.turns = [];
    this.startTime = Date.now();
  }

  public recordTurn(turn: TurnRecord): void {
    this.turns.push({
      ...turn,
      timestamp: turn.timestamp ?? Date.now(),
    });
  }

  public getTurns(): TurnRecord[] {
    return [...this.turns];
  }

  public createRecord(winner: Player): GameRecord {
    return {
      difficulty: this.currentDifficulty,
      winner,
      humanSecret: this.humanSecretNumber,
      aiSecret: this.aiSecretNumber,
      totalTurns: this.turns.length,
      turns: [...this.turns],
    };
  }

  /**
   * Persists the finished game to the backend API route (/api/games).
   * Hell mode is strictly verified and logged for future ML training.
   */
  public async persistGame(winner: Player): Promise<{ success: boolean; id?: string; error?: string }> {
    const record = this.createRecord(winner);

    try {
      const response = await fetch('/api/games', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(record),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.warn('GameRecorder failed to persist game to backend:', errorText);
        return { success: false, error: errorText };
      }

      const data = await response.json();
      return { success: true, id: data.id };
    } catch (err) {
      console.warn('GameRecorder network error:', err);
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Unknown network error',
      };
    }
  }
}

