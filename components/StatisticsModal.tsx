'use client';

import React, { useEffect, useState } from 'react';
import { Difficulty, StatisticsData, DIFFICULTY_CONFIGS } from '@/types/game';
import { formatNumber } from '@/utils/gameUtils';
import { BarChart3, X, RefreshCw } from 'lucide-react';

interface StatisticsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StatisticsModal: React.FC<StatisticsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [stats, setStats] = useState<Record<Difficulty, StatisticsData> | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/stats');
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats);
      }
    } catch (err) {
      console.warn('Failed to fetch stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchStats();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const difficulties: Difficulty[] = ['easy', 'normal', 'hell'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          title="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center justify-between mb-6 pr-8">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-800">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Game Statistics
              </h3>
              <p className="text-xs text-slate-500">
                Aggregated records stored in PostgreSQL
              </p>
            </div>
          </div>

          <button
            onClick={fetchStats}
            disabled={loading}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-600 hover:bg-slate-50 shadow-2xs"
            title="Refresh statistics"
          >
            <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {difficulties.map((diff) => {
            const config = DIFFICULTY_CONFIGS[diff];
            const data = stats ? stats[diff] : null;
            const gamesPlayed = data?.gamesPlayed ?? 0;
            const humanWins = data?.humanWins ?? 0;
            const aiWins = data?.aiWins ?? 0;
            const winRate = gamesPlayed > 0 ? Math.round((humanWins / gamesPlayed) * 100) : 0;
            const avgTurns = data?.averageTurns ?? 0;

            return (
              <div
                key={diff}
                className="rounded-xl border border-slate-200 bg-slate-50/60 p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold text-slate-900 capitalize">
                    {config.label}
                  </h4>
                  <span className={`rounded px-1.5 py-0.5 text-[10px] font-semibold border ${config.badgeColor}`}>
                    {config.badge}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                    <span className="text-slate-500">Games Played</span>
                    <span className="font-mono font-bold text-slate-900">
                      {formatNumber(gamesPlayed)}
                    </span>
                  </div>

                  <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                    <span className="text-slate-500">Your Wins</span>
                    <span className="font-mono font-bold text-emerald-700">
                      {humanWins}
                    </span>
                  </div>

                  <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                    <span className="text-slate-500">AI Wins</span>
                    <span className="font-mono font-bold text-slate-700">
                      {aiWins}
                    </span>
                  </div>

                  <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                    <span className="text-slate-500">Win Rate</span>
                    <span className="font-mono font-bold text-slate-900">
                      {winRate}%
                    </span>
                  </div>

                  <div className="flex justify-between pt-0.5">
                    <span className="text-slate-500">Avg Turns</span>
                    <span className="font-mono font-bold text-slate-900">
                      {avgTurns}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
