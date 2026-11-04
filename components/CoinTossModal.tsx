'use client';

import React from 'react';
import { Player } from '@/types/game';
import { User, Bot, Dices } from 'lucide-react';

interface CoinTossModalProps {
  isOpen: boolean;
  isTossing: boolean;
  result: Player | null;
  onToss: () => void;
}

export const CoinTossModal: React.FC<CoinTossModalProps> = ({
  isOpen,
  isTossing,
  result,
  onToss,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 text-center shadow-xl">
        <h3 className="text-lg font-bold text-slate-900 tracking-tight">
          First Turn Coin Toss
        </h3>
        <p className="mt-1 text-xs text-slate-500">
          Deciding who makes the opening guess
        </p>

        {/* Coin Display */}
        <div className="my-6 flex justify-center items-center">
          <div
            className={`flex h-24 w-24 items-center justify-center rounded-full border-2 border-slate-300 bg-slate-100 shadow-sm transition-transform duration-500 ${
              isTossing
                ? 'animate-spin scale-105'
                : 'scale-100'
            }`}
          >
            <div className="flex flex-col items-center justify-center text-slate-800">
              {isTossing ? (
                <Dices className="h-8 w-8 animate-spin text-slate-500" />
              ) : result === 'human' ? (
                <>
                  <User className="h-8 w-8 text-slate-900" />
                  <span className="text-[10px] font-bold tracking-wider uppercase mt-1">You</span>
                </>
              ) : result === 'ai' ? (
                <>
                  <Bot className="h-8 w-8 text-slate-900" />
                  <span className="text-[10px] font-bold tracking-wider uppercase mt-1">AI</span>
                </>
              ) : (
                <Dices className="h-8 w-8 text-slate-500" />
              )}
            </div>
          </div>
        </div>

        {/* Status feedback */}
        {result ? (
          <div>
            <div
              className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-semibold border ${
                result === 'human'
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                  : 'border-blue-200 bg-blue-50 text-blue-800'
              }`}
            >
              {result === 'human' ? (
                <span>You won the toss! You guess first.</span>
              ) : (
                <span>AI won the toss! AI guesses first.</span>
              )}
            </div>
            <p className="mt-2 text-xs text-slate-400">Loading duel...</p>
          </div>
        ) : (
          <button
            onClick={onToss}
            disabled={isTossing}
            className="w-full rounded-xl bg-slate-900 py-3 text-xs font-semibold text-white shadow-xs transition hover:bg-slate-800 disabled:opacity-50"
          >
            {isTossing ? 'Flipping...' : 'Flip Coin'}
          </button>
        )}
      </div>
    </div>
  );
};
