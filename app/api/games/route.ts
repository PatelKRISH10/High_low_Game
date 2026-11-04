import { NextRequest, NextResponse } from 'next/server';
import { GameService } from '@/lib/server/gameService';
import { Difficulty, GameRecord } from '@/types/game';

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as GameRecord;

    if (!body || !body.difficulty || !body.winner || typeof body.totalTurns !== 'number') {
      return NextResponse.json(
        { error: 'Invalid game payload. difficulty, winner, and totalTurns are required.' },
        { status: 400 }
      );
    }

    const result = await GameService.recordGame(body);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('API /api/games POST Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Database error while saving game' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const difficulty = searchParams.get('difficulty') as Difficulty | null;
    const limitParam = searchParams.get('limit');
    const limit = limitParam ? parseInt(limitParam, 10) : 20;

    const games = await GameService.getRecentGames(difficulty || undefined, limit);
    return NextResponse.json({ games });
  } catch (error) {
    console.error('API /api/games GET Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Database error while fetching games' },
      { status: 500 }
    );
  }
}
