'use client';

import React from 'react';
import { Difficulty, DIFFICULTY_CONFIGS } from '@/types/game';
import { Check } from 'lucide-react';

interface DifficultyCardsProps {
  selectedDifficulty: Difficulty;
  onSelect: (difficulty: Difficulty) => void;
}

export const DifficultyCards: React.FC<DifficultyCardsProps> = ({
  selectedDifficulty,
  onSelect,
}) => {
  const difficulties: Difficulty[] = ['easy', 'normal', 'hell'];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 w-full">
      {difficulties.map((diff) => {
        const config = DIFFICULTY_CONFIGS[diff];
        const isSelected = selectedDifficulty === diff;

        return (
          <div
            key={diff}
            onClick={() => onSelect(diff)}
            className={`group relative cursor-pointer rounded-xl border p-5 transition-all duration-150 ${
              isSelected
                ? 'border-slate-900 bg-white ring-1 ring-slate-900 shadow-sm'
                : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs'
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2">
                <span className="text-base font-semibold text-slate-900">
                  {config.label}
                </span>
                <span
                  className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium border ${config.badgeColor}`}
                >
                  {config.badge}
                </span>
              </div>

              {isSelected ? (
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-900 text-white">
                  <Check className="h-3 w-3 stroke-[2.5]" />
                </div>
              ) : (
                <div className="h-5 w-5 rounded-full border border-slate-300 group-hover:border-slate-400" />
              )}
            </div>

            {/* Description */}
            <p className="text-xs text-slate-600 leading-relaxed">
              {config.description}
            </p>
          </div>
        );
      })}
    </div>
  );
};
