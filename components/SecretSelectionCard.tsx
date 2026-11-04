'use client';

import React, { useState } from 'react';
import { Difficulty, DIFFICULTY_CONFIGS } from '@/types/game';
import { getRandomInt, formatNumber } from '@/utils/gameUtils';
import { Eye, EyeOff, Dices, ArrowRight, ShieldCheck } from 'lucide-react';

interface SecretSelectionCardProps {
  difficulty: Difficulty;
  onConfirm: (secret: number) => boolean;
  onBack: () => void;
  validationError: string | null;
}

export const SecretSelectionCard: React.FC<SecretSelectionCardProps> = ({
  difficulty,
  onConfirm,
  onBack,
  validationError,
}) => {
  const config = DIFFICULTY_CONFIGS[difficulty];
  const [value, setValue] = useState<string>('');
  const [showSecret, setShowSecret] = useState<boolean>(true);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleRandomize = () => {
    const randomNum = getRandomInt(config.min, config.max);
    setValue(randomNum.toString());
    setLocalError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseInt(value, 10);
    if (isNaN(num)) {
      setLocalError(`Please enter a valid number.`);
      return;
    }
    if (num < config.min || num > config.max) {
      setLocalError(
        `Number must be between ${formatNumber(config.min)} and ${formatNumber(config.max)}.`
      );
      return;
    }

    setLocalError(null);
    onConfirm(num);
  };

  const currentNum = parseInt(value, 10);
  const isValid = !isNaN(currentNum) && currentNum >= config.min && currentNum <= config.max;

  return (
    <div className="mx-auto w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="text-xs text-slate-500 hover:text-slate-900 transition font-medium"
        >
          ← Back to difficulties
        </button>
        <span
          className={`rounded-md px-2.5 py-0.5 text-xs font-medium border ${config.badgeColor}`}
        >
          {config.label} ({formatNumber(config.min)} – {formatNumber(config.max)})
        </span>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          Choose Your Secret Number
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-slate-500">
          The algorithm will attempt to deduce this number turn by turn.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1.5">
            Secret Number ({formatNumber(config.min)} – {formatNumber(config.max)})
          </label>

          <div className="relative flex items-center">
            <input
              type={showSecret ? 'number' : 'password'}
              min={config.min}
              max={config.max}
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                setLocalError(null);
              }}
              placeholder={`e.g. ${getRandomInt(config.min, config.max)}`}
              className="w-full rounded-xl border border-slate-300 bg-slate-50/50 px-4 py-3 text-center text-2xl font-bold tracking-wider text-slate-900 placeholder-slate-400 outline-none transition focus:border-slate-900 focus:bg-white focus:ring-1 focus:ring-slate-900 font-mono"
              autoFocus
            />

            <div className="absolute right-2.5 flex items-center">
              <button
                type="button"
                onClick={() => setShowSecret(!showSecret)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
                title={showSecret ? 'Hide number' : 'Show number'}
              >
                {showSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {(localError || validationError) && (
            <p className="mt-1.5 text-xs font-medium text-red-600 text-center animate-shake">
              {localError || validationError}
            </p>
          )}
        </div>

        {/* Quick helpers */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={handleRandomize}
            className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50 shadow-2xs"
          >
            <Dices className="h-3.5 w-3.5 text-slate-500" />
            <span>Random Number</span>
          </button>
          <button
            type="button"
            onClick={() => {
              const mid = Math.floor((config.min + config.max) / 2);
              setValue(mid.toString());
              setLocalError(null);
            }}
            className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50 shadow-2xs"
          >
            <span>Midpoint ({formatNumber(Math.floor((config.min + config.max) / 2))})</span>
          </button>
        </div>

        <div className="rounded-lg bg-slate-50 border border-slate-100 p-2.5 flex items-center gap-2 text-xs text-slate-500">
          <ShieldCheck className="h-4 w-4 text-slate-400 shrink-0" />
          <span>Kept hidden from the AI until deducted fairly.</span>
        </div>

        <button
          type="submit"
          disabled={!isValid}
          className={`w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition ${
            isValid
              ? 'bg-slate-900 text-white hover:bg-slate-800 shadow-sm'
              : 'bg-slate-100 text-slate-400 cursor-not-allowed'
          }`}
        >
          <span>Confirm & Flip Coin</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
};
