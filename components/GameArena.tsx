'use client';

import React, { useState } from 'react';
import {
  Difficulty,
  DIFFICULTY_CONFIGS,
  Player,
  GuessFeedback,
  TurnRecord,
} from '@/types/game';
import { formatNumber } from '@/utils/gameUtils';
import { RangeProgressCard } from './RangeProgressCard';
import { GuessHistory } from './GuessHistory';
import {
  User,
  Bot,
  ArrowUp,
  ArrowDown,
  Check,
  Send,
  AlertCircle,
  LogOut,
} from 'lucide-react';

interface GameArenaProps {
  difficulty: Difficulty;
  humanSecret: number;
  currentTurn: Player;
  turnCount: number;
  turns: TurnRecord[];
  humanSearchRange: { min: number; max: number };
  aiSearchRange: { min: number; max: number };
  currentAiGuess: number | null;
  lastHumanGuessFeedback: { guess: number; feedback: GuessFeedback } | null;
  validationError: string | null;
  onSubmitHumanGuess: (guess: number) => void;
  onSubmitAiFeedback: (feedback: GuessFeedback) => void;
  onResetGame: () => void;
}

export const GameArena: React.FC<GameArenaProps> = ({
  difficulty,
  humanSecret,
  currentTurn,
  turnCount,
  turns,
  humanSearchRange,
  aiSearchRange,
  currentAiGuess,
  lastHumanGuessFeedback,
  validationError,
  onSubmitHumanGuess,
  onSubmitAiFeedback,
  onResetGame,
}) => {
  const config = DIFFICULTY_CONFIGS[difficulty];
  const [guessInput, setGuessInput] = useState<string>('');
  const [inputError, setInputError] = useState<string | null>(null);

  const isHumanTurn = currentTurn === 'human';

  const handleHumanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(guessInput, 10);

    if (isNaN(val)) {
      setInputError('Please enter a valid number.');
      return;
    }

    if (val < humanSearchRange.min || val > humanSearchRange.max) {
      setInputError(
        `Guess must be within your search range: ${formatNumber(
          humanSearchRange.min
        )} – ${formatNumber(humanSearchRange.max)}.`
      );
      return;
    }

    setInputError(null);
    onSubmitHumanGuess(val);
    setGuessInput('');
  };

  const midpoint = Math.floor((humanSearchRange.min + humanSearchRange.max) / 2);

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4">
      {/* Top Match Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-2xs">
        <div className="flex items-center gap-2.5">
          <span
            className={`rounded-md px-2.5 py-0.5 text-xs font-semibold border ${config.badgeColor}`}
          >
            {config.label} ({formatNumber(config.min)} – {formatNumber(config.max)})
          </span>
          <span className="text-xs text-slate-500 font-mono">
            Turn: <strong className="text-slate-900">{turnCount}</strong>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xs text-slate-600">
            Your Secret: <strong className="font-mono text-slate-900">{formatNumber(humanSecret)}</strong>
          </div>

          <button
            onClick={onResetGame}
            className="flex items-center gap-1 rounded-md border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition"
            title="Exit game"
          >
            <LogOut className="h-3 w-3" />
            <span>Quit</span>
          </button>
        </div>
      </div>

      {/* Turn Banner */}
      <div
        className={`rounded-xl border p-4 transition-colors ${
          isHumanTurn
            ? 'border-blue-200 bg-blue-50/50'
            : 'border-slate-300 bg-slate-100/70'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-lg border shadow-2xs ${
                isHumanTurn
                  ? 'border-blue-200 bg-white text-blue-700'
                  : 'border-slate-300 bg-white text-slate-800'
              }`}
            >
              {isHumanTurn ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                {isHumanTurn ? 'Your Turn to Guess' : 'AI Guessed — Your Response Needed'}
              </h3>
              <p className="text-xs text-slate-500">
                {isHumanTurn
                  ? `Search range: [${formatNumber(humanSearchRange.min)} – ${formatNumber(humanSearchRange.max)}]`
                  : 'Select whether your secret number is higher, lower, or if the AI got it correct'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Interaction Card */}
      {isHumanTurn ? (
        /* Human Guess Input Form */
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-slate-900">
              Guess AI&apos;s Secret Number
            </h4>

            {lastHumanGuessFeedback && (
              <div className="text-xs text-slate-500">
                Last guess: <strong className="font-mono text-slate-900">{formatNumber(lastHumanGuessFeedback.guess)}</strong>{' '}
                <span className="font-semibold capitalize text-slate-700">({lastHumanGuessFeedback.feedback})</span>
              </div>
            )}
          </div>

          <form onSubmit={handleHumanSubmit} className="space-y-3">
            <div className="flex gap-2">
              <input
                type="number"
                min={humanSearchRange.min}
                max={humanSearchRange.max}
                value={guessInput}
                onChange={(e) => {
                  setGuessInput(e.target.value);
                  setInputError(null);
                }}
                placeholder={`Number between ${formatNumber(humanSearchRange.min)} and ${formatNumber(humanSearchRange.max)}`}
                className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-base font-mono font-bold text-slate-900 placeholder-slate-400 outline-none transition focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
                autoFocus
              />

              <button
                type="submit"
                className="flex items-center gap-1.5 shrink-0 rounded-lg bg-slate-900 px-5 py-2.5 text-xs font-semibold text-white shadow-xs transition hover:bg-slate-800"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Submit</span>
              </button>
            </div>

            {inputError && (
              <p className="text-xs font-medium text-red-600 flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5" />
                {inputError}
              </p>
            )}

            {/* Quick Suggestions */}
            <div className="flex items-center gap-1.5 pt-1 text-xs text-slate-500">
              <span>Suggestions:</span>
              <button
                type="button"
                onClick={() => {
                  setGuessInput(midpoint.toString());
                  setInputError(null);
                }}
                className="rounded border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-mono font-medium text-slate-700 hover:bg-slate-100 transition"
              >
                Midpoint ({formatNumber(midpoint)})
              </button>
              <button
                type="button"
                onClick={() => {
                  setGuessInput(humanSearchRange.min.toString());
                  setInputError(null);
                }}
                className="rounded border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-mono font-medium text-slate-700 hover:bg-slate-100 transition"
              >
                Min ({formatNumber(humanSearchRange.min)})
              </button>
              <button
                type="button"
                onClick={() => {
                  setGuessInput(humanSearchRange.max.toString());
                  setInputError(null);
                }}
                className="rounded border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-mono font-medium text-slate-700 hover:bg-slate-100 transition"
              >
                Max ({formatNumber(humanSearchRange.max)})
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* AI Turn Response Interface */
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs text-center space-y-4">
          <div>
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              AI Guess
            </span>
            <div className="my-2">
              <span className="font-mono text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
                {currentAiGuess !== null ? formatNumber(currentAiGuess) : '...'}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Your secret number is <strong>{formatNumber(humanSecret)}</strong>. Respond honestly:
            </p>
          </div>

          {/* Response Buttons */}
          <div className="grid grid-cols-3 gap-2.5 max-w-md mx-auto pt-1">
            <button
              type="button"
              onClick={() => onSubmitAiFeedback('higher')}
              className="flex flex-col items-center justify-center gap-1 rounded-xl border border-amber-200 bg-amber-50/70 p-3 font-semibold text-amber-900 transition hover:bg-amber-100 active:scale-95 shadow-2xs"
            >
              <ArrowUp className="h-4 w-4 text-amber-700" />
              <span className="text-xs uppercase tracking-wider font-bold">Higher</span>
              <span className="text-[10px] text-amber-700 font-normal">
                Secret is larger
              </span>
            </button>

            <button
              type="button"
              onClick={() => onSubmitAiFeedback('lower')}
              className="flex flex-col items-center justify-center gap-1 rounded-xl border border-blue-200 bg-blue-50/70 p-3 font-semibold text-blue-900 transition hover:bg-blue-100 active:scale-95 shadow-2xs"
            >
              <ArrowDown className="h-4 w-4 text-blue-700" />
              <span className="text-xs uppercase tracking-wider font-bold">Lower</span>
              <span className="text-[10px] text-blue-700 font-normal">
                Secret is smaller
              </span>
            </button>

            <button
              type="button"
              onClick={() => onSubmitAiFeedback('correct')}
              className="flex flex-col items-center justify-center gap-1 rounded-xl border border-emerald-200 bg-emerald-50/70 p-3 font-semibold text-emerald-900 transition hover:bg-emerald-100 active:scale-95 shadow-2xs"
            >
              <Check className="h-4 w-4 text-emerald-700" />
              <span className="text-xs uppercase tracking-wider font-bold">Correct</span>
              <span className="text-[10px] text-emerald-700 font-normal">
                Exact hit
              </span>
            </button>
          </div>

          {validationError && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-2.5 text-center text-xs font-medium text-red-700 animate-shake">
              {validationError}
            </div>
          )}
        </div>
      )}

      {/* Target Range Progress */}
      <RangeProgressCard
        initialMin={config.min}
        initialMax={config.max}
        humanKnownMin={humanSearchRange.min}
        humanKnownMax={humanSearchRange.max}
        aiKnownMin={aiSearchRange.min}
        aiKnownMax={aiSearchRange.max}
      />

      {/* Move History */}
      <GuessHistory turns={turns} />
    </div>
  );
};
