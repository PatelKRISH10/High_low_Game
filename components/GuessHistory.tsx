'use client';

import React, { useState } from 'react';
import { TurnRecord } from '@/types/game';
import { formatNumber } from '@/utils/gameUtils';
import { History, User, Bot, ArrowUp, ArrowDown, Check } from 'lucide-react';

interface GuessHistoryProps {
  turns: TurnRecord[];
}

export const GuessHistory: React.FC<GuessHistoryProps> = ({ turns }) => {
  const [filter, setFilter] = useState<'all' | 'human' | 'ai'>('all');

  const filteredTurns = turns.filter((t) => {
    if (filter === 'all') return true;
    return t.player === filter;
  });

  const getResponseBadge = (response: TurnRecord['response']) => {
    switch (response) {
      case 'higher':
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-800 border border-amber-200">
            <ArrowUp className="h-3 w-3" />
            Higher
          </span>
        );
      case 'lower':
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-800 border border-blue-200">
            <ArrowDown className="h-3 w-3" />
            Lower
          </span>
        );
      case 'correct':
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 border border-emerald-200">
            <Check className="h-3 w-3" />
            Correct
          </span>
        );
    }
  };

  return (
    <div className="w-full rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
      {/* Header and Filter */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <History className="h-4 w-4 text-slate-500" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-700">
            History ({turns.length} Turns)
          </h3>
        </div>

        {/* Filter pills */}
        <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-0.5 text-xs">
          <button
            onClick={() => setFilter('all')}
            className={`rounded-md px-2.5 py-1 font-medium transition ${
              filter === 'all'
                ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('human')}
            className={`flex items-center gap-1 rounded-md px-2.5 py-1 font-medium transition ${
              filter === 'human'
                ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <User className="h-3 w-3" />
            You
          </button>
          <button
            onClick={() => setFilter('ai')}
            className={`flex items-center gap-1 rounded-md px-2.5 py-1 font-medium transition ${
              filter === 'ai'
                ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Bot className="h-3 w-3" />
            AI
          </button>
        </div>
      </div>

      {/* History Items */}
      {filteredTurns.length === 0 ? (
        <div className="py-8 text-center text-xs text-slate-400">
          No guesses recorded yet.
        </div>
      ) : (
        <div className="max-h-64 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
          {filteredTurns
            .slice()
            .reverse()
            .map((item) => {
              const isHuman = item.player === 'human';

              return (
                <div
                  key={item.turnNumber}
                  className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50/50 p-2.5 transition hover:bg-slate-50"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-semibold text-slate-400 w-6">
                      #{item.turnNumber}
                    </span>

                    <div className="flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded bg-white border border-slate-200 text-slate-600 shadow-2xs">
                        {isHuman ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
                      </div>

                      <div className="flex items-baseline gap-2">
                        <span className="text-xs text-slate-600 font-medium">
                          {isHuman ? 'You guessed' : 'AI guessed'}
                        </span>
                        <span className="text-base font-bold font-mono text-slate-900">
                          {formatNumber(item.guess)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="hidden sm:inline font-mono text-xs text-slate-500">
                      [{formatNumber(item.remainingMin)} – {formatNumber(item.remainingMax)}]
                    </span>
                    {getResponseBadge(item.response)}
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
};
