'use client';

import React from 'react';
import { Player, Difficulty, DIFFICULTY_CONFIGS } from '@/types/game';
import { formatNumber } from '@/utils/gameUtils';
import { Trophy, Bot, RotateCcw, ArrowRight } from 'lucide-react';

interface WinnerModalProps {
  isOpen: boolean;
  winner: Player;
  difficulty: Difficulty;
  humanSecret: number;
  aiSecret: number;
  totalTurns: number;
  isSaving: boolean;
  onPlayAgain: () => void;
  onReset: () => void;
}

export const WinnerModal: React.FC<WinnerModalProps> = ({
  isOpen,
  winner,
  difficulty,
  humanSecret,
  aiSecret,
  totalTurns,
  isSaving,
  onPlayAgain,
  onReset,
}) => {
  if (!isOpen) return null;

  const isHumanWinner = winner === 'human';
  const config = DIFFICULTY_CONFIGS[difficulty];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 text-center shadow-xl">
        {/* Emblem */}
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-slate-100 text-slate-900">
          {isHumanWinner ? (
            <Trophy className="h-7 w-7 text-amber-600" />
          ) : (
            <Bot className="h-7 w-7 text-slate-700" />
          )}
        </div>

        {/* Title */}
        <span
          className={`inline-block rounded-md px-2.5 py-0.5 text-xs font-semibold border mb-2 ${
            isHumanWinner
              ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
              : 'border-slate-300 bg-slate-100 text-slate-800'
          }`}
        >
          {isHumanWinner ? 'You Won' : 'AI Won'}
        </span>

        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          {isHumanWinner ? 'Game Over — You Won!' : 'Game Over — AI Won'}
        </h2>

        <p className="mt-1 text-xs text-slate-500">
          {isHumanWinner
            ? `You deduced the AI's secret number in ${totalTurns} total turns.`
            : `The AI deduced your number in ${totalTurns} total turns.`}
        </p>

        {/* Secret Numbers Breakdown */}
        <div className="my-5 rounded-xl border border-slate-200 bg-slate-50/70 p-4 text-left space-y-3">
          <div className="grid grid-cols-2 gap-3 text-center border-b border-slate-200/80 pb-3">
            <div>
              <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                Your Secret
              </span>
              <span className="font-mono text-lg font-bold text-slate-900">
                {formatNumber(humanSecret)}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                AI&apos;s Secret
              </span>
              <span className="font-mono text-lg font-bold text-slate-900">
                {formatNumber(aiSecret)}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500">Mode:</span>
            <span className="font-semibold text-slate-900 capitalize">{config.label}</span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500">Total Turns:</span>
            <span className="font-mono font-bold text-slate-900">{totalTurns}</span>
          </div>

          <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200/60 text-slate-400">
            <span>Match Logging:</span>
            <span>{isSaving ? 'Saving...' : 'Saved to database'}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2.5">
          <button
            onClick={onPlayAgain}
            className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 py-2.5 text-xs font-semibold text-white shadow-xs transition hover:bg-slate-800"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Play Again</span>
          </button>

          <button
            onClick={onReset}
            className="flex items-center justify-center gap-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
          >
            <span>Change Mode</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
