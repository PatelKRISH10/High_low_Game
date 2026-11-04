'use client';

import React, { useState } from 'react';
import { useMindReaderGame } from '@/hooks/useMindReaderGame';
import { Navbar } from '@/components/Navbar';
import { DifficultyCards } from '@/components/DifficultyCards';
import { RulesSection } from '@/components/RulesSection';
import { RulesModal } from '@/components/RulesModal';
import { StatisticsModal } from '@/components/StatisticsModal';
import { SecretSelectionCard } from '@/components/SecretSelectionCard';
import { CoinTossModal } from '@/components/CoinTossModal';
import { GameArena } from '@/components/GameArena';
import { WinnerModal } from '@/components/WinnerModal';
import { Play, BarChart2 } from 'lucide-react';

export default function HomePage() {
  const {
    difficulty,
    status,
    humanSecret,
    aiSecret,
    currentTurn,
    coinTossResult,
    isTossingCoin,
    turnCount,
    turns,
    winner,
    isSaving,
    validationError,
    humanSearchRange,
    aiSearchRange,
    currentAiGuess,
    lastHumanGuessFeedback,
    selectDifficulty,
    confirmSecretNumber,
    performCoinToss,
    submitHumanGuess,
    submitAiFeedback,
    resetGame,
    playAgain,
  } = useMindReaderGame();

  const [isRulesModalOpen, setIsRulesModalOpen] = useState(false);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <Navbar
        onOpenRules={() => setIsRulesModalOpen(true)}
        onOpenStats={() => setIsStatsModalOpen(true)}
      />

      <main className="flex-1 px-4 py-8 sm:px-6 max-w-4xl mx-auto w-full">
        {/* VIEW 1: LANDING SCREEN */}
        {status === 'idle' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Hero Section */}
            <section className="text-center space-y-3 pt-4 sm:pt-8 max-w-2xl mx-auto">
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
                Can You Outsmart the Algorithm?
              </h1>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl mx-auto">
                Pick a secret number within the chosen range. The AI picks one too.
                Take turns guessing and giving higher/lower clues until one player finds the match.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => selectDifficulty(difficulty)}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-7 py-3 text-sm font-semibold text-white shadow-xs transition hover:bg-slate-800"
                >
                  <Play className="h-4 w-4 fill-current" />
                  <span>Start Game ({difficulty.toUpperCase()})</span>
                </button>

                <button
                  onClick={() => setIsStatsModalOpen(true)}
                  className="w-full sm:w-auto flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-5 py-3 text-xs font-semibold text-slate-700 shadow-2xs transition hover:bg-slate-50"
                >
                  <BarChart2 className="h-4 w-4 text-slate-500" />
                  <span>View Statistics</span>
                </button>
              </div>
            </section>

            {/* Difficulty Cards */}
            <section className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">
                    Difficulty Level
                  </h2>
                  <p className="text-xs text-slate-500">
                    Select the number search range
                  </p>
                </div>
              </div>

              <DifficultyCards
                selectedDifficulty={difficulty}
                onSelect={(d) => selectDifficulty(d)}
              />
            </section>

            {/* Rules Section on Landing Page */}
            <section className="pt-2">
              <RulesSection />
            </section>
          </div>
        )}

        {/* VIEW 2: CHOOSING SECRET NUMBER */}
        {status === 'choosing_secret' && (
          <div className="py-6 sm:py-10 animate-fadeIn">
            <SecretSelectionCard
              difficulty={difficulty}
              onConfirm={(chosen) => confirmSecretNumber(chosen)}
              onBack={resetGame}
              validationError={validationError}
            />
          </div>
        )}

        {/* VIEW 3: IN-PROGRESS PLAYING ARENA */}
        {status === 'in_progress' && humanSecret !== null && (
          <div className="animate-fadeIn py-2">
            <GameArena
              difficulty={difficulty}
              humanSecret={humanSecret}
              currentTurn={currentTurn}
              turnCount={turnCount}
              turns={turns}
              humanSearchRange={humanSearchRange}
              aiSearchRange={aiSearchRange}
              currentAiGuess={currentAiGuess}
              lastHumanGuessFeedback={lastHumanGuessFeedback}
              validationError={validationError}
              onSubmitHumanGuess={submitHumanGuess}
              onSubmitAiFeedback={submitAiFeedback}
              onResetGame={resetGame}
            />
          </div>
        )}
      </main>

      {/* COIN TOSS OVERLAY MODAL */}
      <CoinTossModal
        isOpen={status === 'coin_toss'}
        isTossing={isTossingCoin}
        result={coinTossResult}
        onToss={performCoinToss}
      />

      {/* WINNER POPUP MODAL */}
      {status === 'game_over' && winner && humanSecret !== null && aiSecret !== null && (
        <WinnerModal
          isOpen={true}
          winner={winner}
          difficulty={difficulty}
          humanSecret={humanSecret}
          aiSecret={aiSecret}
          totalTurns={turnCount}
          isSaving={isSaving}
          onPlayAgain={playAgain}
          onReset={resetGame}
        />
      )}

      {/* GLOBAL STATISTICS MODAL */}
      <StatisticsModal
        isOpen={isStatsModalOpen}
        onClose={() => setIsStatsModalOpen(false)}
      />

      {/* RULES MODAL */}
      <RulesModal
        isOpen={isRulesModalOpen}
        onClose={() => setIsRulesModalOpen(false)}
      />
    </div>
  );
}
