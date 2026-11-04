'use client';

import React from 'react';
import { calculateEntropyReduction, formatNumber } from '@/utils/gameUtils';
import { User, Bot } from 'lucide-react';

interface RangeProgressCardProps {
  initialMin: number;
  initialMax: number;
  humanKnownMin: number;
  humanKnownMax: number;
  aiKnownMin: number;
  aiKnownMax: number;
}

export const RangeProgressCard: React.FC<RangeProgressCardProps> = ({
  initialMin,
  initialMax,
  humanKnownMin,
  humanKnownMax,
  aiKnownMin,
  aiKnownMax,
}) => {
  const humanStats = calculateEntropyReduction(
    initialMin,
    initialMax,
    humanKnownMin,
    humanKnownMax
  );

  const aiStats = calculateEntropyReduction(
    initialMin,
    initialMax,
    aiKnownMin,
    aiKnownMax
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 w-full">
      {/* Human Search Space */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-slate-100 text-slate-700">
              <User className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-slate-800">
                Your Target Range
              </h4>
              <p className="text-[11px] text-slate-400">Targeting AI&apos;s Secret</p>
            </div>
          </div>
          <span className="font-mono text-xs font-semibold text-slate-700">
            {humanStats.reductionPercent}% narrowed
          </span>
        </div>

        <div className="flex items-baseline justify-between mb-2">
          <span className="text-xl font-bold font-mono text-slate-900">
            {formatNumber(humanKnownMin)} – {formatNumber(humanKnownMax)}
          </span>
          <span className="text-xs text-slate-500 font-mono">
            {formatNumber(humanStats.remainingCount)} remaining
          </span>
        </div>

        {/* Progress Bar */}
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full bg-slate-900 transition-all duration-300"
            style={{ width: `${humanStats.reductionPercent}%` }}
          />
        </div>
      </div>

      {/* AI Search Space */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-slate-100 text-slate-700">
              <Bot className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-slate-800">
                AI Target Range
              </h4>
              <p className="text-[11px] text-slate-400">Targeting Your Secret</p>
            </div>
          </div>
          <span className="font-mono text-xs font-semibold text-slate-700">
            {aiStats.reductionPercent}% narrowed
          </span>
        </div>

        <div className="flex items-baseline justify-between mb-2">
          <span className="text-xl font-bold font-mono text-slate-900">
            {formatNumber(aiKnownMin)} – {formatNumber(aiKnownMax)}
          </span>
          <span className="text-xs text-slate-500 font-mono">
            {formatNumber(aiStats.remainingCount)} remaining
          </span>
        </div>

        {/* Progress Bar */}
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full bg-slate-900 transition-all duration-300"
            style={{ width: `${aiStats.reductionPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
};
