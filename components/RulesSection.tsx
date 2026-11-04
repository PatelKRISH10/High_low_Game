'use client';

import React from 'react';
import { Target, Shuffle, Dices, ArrowLeftRight, CheckCircle2, Trophy } from 'lucide-react';

export const RulesSection: React.FC = () => {
  const steps = [
    {
      num: '1',
      title: 'Pick a secret number',
      desc: 'Choose a number within the selected range and keep it hidden.',
      icon: Target,
    },
    {
      num: '2',
      title: 'Opponent chooses secretly',
      desc: 'The AI algorithm independently selects its own hidden number.',
      icon: Shuffle,
    },
    {
      num: '3',
      title: 'Coin toss determines first turn',
      desc: 'A random toss decides who makes the first guess.',
      icon: Dices,
    },
    {
      num: '4',
      title: 'Take turns guessing',
      desc: 'Players alternate turns guessing the opponent’s secret number.',
      icon: ArrowLeftRight,
    },
    {
      num: '5',
      title: 'Respond with honest clues',
      desc: 'After each guess, answer with Higher, Lower, or Correct.',
      icon: CheckCircle2,
    },
    {
      num: '6',
      title: 'First correct guess wins',
      desc: 'The first player to deduce the opponent’s exact number wins.',
      icon: Trophy,
    },
  ];

  return (
    <div className="w-full rounded-xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-slate-900 tracking-tight">
          How to Play
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          A turn-based game of logic, binary search, and deduction.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <div
              key={step.num}
              className="flex items-start gap-3 rounded-lg border border-slate-100 bg-slate-50/60 p-3.5 transition hover:border-slate-200 hover:bg-slate-50"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-white border border-slate-200 text-slate-700 shadow-2xs">
                <Icon className="h-4 w-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-xs font-semibold text-slate-400">
                    {step.num}.
                  </span>
                  <h4 className="text-xs font-semibold text-slate-900">
                    {step.title}
                  </h4>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
