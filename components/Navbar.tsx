'use client';

import React from 'react';
import { Sparkles, BarChart2, BookOpen } from 'lucide-react';

interface NavbarProps {
  onOpenStats?: () => void;
  onOpenRules?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenStats, onOpenRules }) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white shadow-sm">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <span className="font-semibold tracking-tight text-slate-900 text-base">
              Mind Reader
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {onOpenRules && (
            <button
              onClick={onOpenRules}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 shadow-xs"
            >
              <BookOpen className="h-3.5 w-3.5 text-slate-500" />
              <span>Rules</span>
            </button>
          )}

          {onOpenStats && (
            <button
              onClick={onOpenStats}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 shadow-xs"
            >
              <BarChart2 className="h-3.5 w-3.5 text-slate-500" />
              <span>Statistics</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
