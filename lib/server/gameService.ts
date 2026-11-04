import { prisma, isDatabaseConfigured } from '@/lib/prisma';
import { Difficulty, GameRecord, StatisticsData } from '@/types/game';

// In-memory fallback cache ONLY used in local development when DATABASE_URL is not set
interface InMemoryStore {
  games: GameRecord[];
  stats: Record<Difficulty, StatisticsData>;
}

const memoryStore: InMemoryStore = {
  games: [],
  stats: {
    easy: { difficulty: 'easy', gamesPlayed: 0, humanWins: 0, aiWins: 0, averageTurns: 0 },
    normal: { difficulty: 'normal', gamesPlayed: 0, humanWins: 0, aiWins: 0, averageTurns: 0 },
    hell: { difficulty: 'hell', gamesPlayed: 0, humanWins: 0, aiWins: 0, averageTurns: 0 },
  },
};

export class GameService {
  /**
   * Records a completed game match and updates global statistics.
   */
  public static async recordGame(gameData: GameRecord): Promise<{ success: boolean; id?: string }> {
    const { difficulty, winner, humanSecret, aiSecret, totalTurns, turns } = gameData;
    const isProduction = process.env.NODE_ENV === 'production';

    // In production or when DATABASE_URL is provided, Prisma MUST be used.
    if (isDatabaseConfigured() || isProduction) {
      if (!isDatabaseConfigured()) {
        throw new Error('Database is not configured: DATABASE_URL environment variable is missing.');
      }

      try {
        const createdGame = await prisma.game.create({
          data: {
            difficulty,
            winner,
            humanSecret,
            aiSecret,
            totalTurns,
            turns: {
              create: turns.map((t) => ({
                turnNumber: t.turnNumber,
                player: t.player,
                guess: t.guess,
                response: t.response,
                remainingMin: t.remainingMin,
                remainingMax: t.remainingMax,
              })),
            },
          },
        });

        // Update Statistics atomically in Prisma
        await this.updatePrismaStats(difficulty, winner, totalTurns);

        return { success: true, id: createdGame.id };
      } catch (err) {
        console.error('Prisma database error during recordGame:', err);
        throw new Error(
          `Database error while saving game: ${err instanceof Error ? err.message : String(err)}`
        );
      }
    }

    // In-memory fallback: ONLY available during local offline development without DATABASE_URL
    const id = `mem_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const savedRecord: GameRecord = {
      ...gameData,
      id,
      createdAt: new Date().toISOString(),
    };
    memoryStore.games.unshift(savedRecord);
    this.updateMemoryStats(difficulty, winner, totalTurns);

    return { success: true, id };
  }

  private static async updatePrismaStats(
    difficulty: Difficulty,
    winner: 'human' | 'ai',
    totalTurns: number
  ): Promise<void> {
    const existing = await prisma.statistics.findUnique({
      where: { difficulty },
    });

    if (!existing) {
      await prisma.statistics.create({
        data: {
          difficulty,
          gamesPlayed: 1,
          humanWins: winner === 'human' ? 1 : 0,
          aiWins: winner === 'ai' ? 1 : 0,
          averageTurns: totalTurns,
        },
      });
    } else {
      const newGamesPlayed = existing.gamesPlayed + 1;
      const newHumanWins = existing.humanWins + (winner === 'human' ? 1 : 0);
      const newAiWins = existing.aiWins + (winner === 'ai' ? 1 : 0);
      const newAvgTurns =
        (existing.averageTurns * existing.gamesPlayed + totalTurns) / newGamesPlayed;

      await prisma.statistics.update({
        where: { difficulty },
        data: {
          gamesPlayed: newGamesPlayed,
          humanWins: newHumanWins,
          aiWins: newAiWins,
          averageTurns: Math.round(newAvgTurns * 10) / 10,
        },
      });
    }
  }

  private static updateMemoryStats(
    difficulty: Difficulty,
    winner: 'human' | 'ai',
    totalTurns: number
  ): void {
    const stat = memoryStore.stats[difficulty];
    const newPlayed = stat.gamesPlayed + 1;
    const newHumanWins = stat.humanWins + (winner === 'human' ? 1 : 0);
    const newAiWins = stat.aiWins + (winner === 'ai' ? 1 : 0);
    const newAvg = (stat.averageTurns * stat.gamesPlayed + totalTurns) / newPlayed;

    stat.gamesPlayed = newPlayed;
    stat.humanWins = newHumanWins;
    stat.aiWins = newAiWins;
    stat.averageTurns = Math.round(newAvg * 10) / 10;
  }

  /**
   * Fetches stats for all difficulty modes.
   */
  public static async getStatistics(): Promise<Record<Difficulty, StatisticsData>> {
    const isProduction = process.env.NODE_ENV === 'production';

    if (isDatabaseConfigured() || isProduction) {
      if (!isDatabaseConfigured()) {
        throw new Error('Database is not configured: DATABASE_URL environment variable is missing.');
      }

      try {
        const stats = await prisma.statistics.findMany();
        const result: Record<Difficulty, StatisticsData> = {
          easy: { difficulty: 'easy', gamesPlayed: 0, humanWins: 0, aiWins: 0, averageTurns: 0 },
          normal: { difficulty: 'normal', gamesPlayed: 0, humanWins: 0, aiWins: 0, averageTurns: 0 },
          hell: { difficulty: 'hell', gamesPlayed: 0, humanWins: 0, aiWins: 0, averageTurns: 0 },
        };

        for (const row of stats) {
          if (row.difficulty in result) {
            result[row.difficulty as Difficulty] = {
              difficulty: row.difficulty as Difficulty,
              gamesPlayed: row.gamesPlayed,
              humanWins: row.humanWins,
              aiWins: row.aiWins,
              averageTurns: row.averageTurns,
            };
          }
        }
        return result;
      } catch (err) {
        console.error('Prisma database error during getStatistics:', err);
        throw new Error(
          `Database error while fetching statistics: ${err instanceof Error ? err.message : String(err)}`
        );
      }
    }

    return memoryStore.stats;
  }

  /**
   * Retrieves recent games, optionally filtered by difficulty (useful for Hell mode ML traces).
   */
  public static async getRecentGames(difficulty?: Difficulty, limit: number = 20) {
    const isProduction = process.env.NODE_ENV === 'production';

    if (isDatabaseConfigured() || isProduction) {
      if (!isDatabaseConfigured()) {
        throw new Error('Database is not configured: DATABASE_URL environment variable is missing.');
      }

      try {
        return await prisma.game.findMany({
          where: difficulty ? { difficulty } : undefined,
          include: {
            turns: {
              orderBy: { turnNumber: 'asc' },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: limit,
        });
      } catch (err) {
        console.error('Prisma database error during getRecentGames:', err);
        throw new Error(
          `Database error while fetching recent games: ${err instanceof Error ? err.message : String(err)}`
        );
      }
    }

    let filtered = memoryStore.games;
    if (difficulty) {
      filtered = filtered.filter((g) => g.difficulty === difficulty);
    }
    return filtered.slice(0, limit);
  }
}
