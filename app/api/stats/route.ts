import { NextResponse } from 'next/server';
import { GameService } from '@/lib/server/gameService';

export async function GET() {
  try {
    const stats = await GameService.getStatistics();
    return NextResponse.json({ stats });
  } catch (error) {
    console.error('API /api/stats GET Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error while fetching statistics' },
      { status: 500 }
    );
  }
}

