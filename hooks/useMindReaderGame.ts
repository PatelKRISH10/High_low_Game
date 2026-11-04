import { useState, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  Difficulty,
  DIFFICULTY_CONFIGS,
  GameStatus,
  Player,
  GuessFeedback,
  TurnRecord,
} from '@/types/game';
import { AIEngine } from '@/lib/ai/AIEngine';
import { getRandomInt } from '@/utils/gameUtils';

export function useMindReaderGame() {
  const [difficulty, setDifficulty] = useState<Difficulty>('normal');
  const [status, setStatus] = useState<GameStatus>('idle');
  const [humanSecret, setHumanSecret] = useState<number | null>(null);
  const [aiSecret, setAiSecret] = useState<number | null>(null);
  const [currentTurn, setCurrentTurn] = useState<Player>('human');
  const [coinTossResult, setCoinTossResult] = useState<Player | null>(null);
  const [isTossingCoin, setIsTossingCoin] = useState<boolean>(false);
  const [turnCount, setTurnCount] = useState<number>(0);
  const [turns, setTurns] = useState<TurnRecord[]>([]);
  const [winner, setWinner] = useState<Player | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Human's knowledge bounds about AI's secret number
  const [humanSearchRange, setHumanSearchRange] = useState<{ min: number; max: number }>({
    min: 1,
    max: 1000,
  });

  // AI's knowledge bounds about Human's secret number
  const [aiSearchRange, setAiSearchRange] = useState<{ min: number; max: number }>({
    min: 1,
    max: 1000,
  });

  // The latest guess made by the AI currently awaiting user feedback
  const [currentAiGuess, setCurrentAiGuess] = useState<number | null>(null);
  const [lastHumanGuessFeedback, setLastHumanGuessFeedback] = useState<{
    guess: number;
    feedback: GuessFeedback;
  } | null>(null);

  const aiEngineRef = useRef<AIEngine>(AIEngine.getInstance());

  /**
   * Selects a difficulty and advances to secret selection screen
   */
  const selectDifficulty = useCallback((diff: Difficulty) => {
    setDifficulty(diff);
    const config = DIFFICULTY_CONFIGS[diff];
    setHumanSearchRange({ min: config.min, max: config.max });
    setAiSearchRange({ min: config.min, max: config.max });
    setValidationError(null);
    setStatus('choosing_secret');
  }, []);

  /**
   * Human confirms their chosen secret number.
   * Generates AI's secret number and initiates coin toss stage.
   */
  const confirmSecretNumber = useCallback(
    (chosenSecret: number) => {
      const config = DIFFICULTY_CONFIGS[difficulty];
      if (chosenSecret < config.min || chosenSecret > config.max) {
        setValidationError(`Please enter a valid number between ${config.min} and ${config.max}`);
        return false;
      }

      setValidationError(null);
      setHumanSecret(chosenSecret);

      const generatedAiSecret = getRandomInt(config.min, config.max);
      setAiSecret(generatedAiSecret);

      // Initialize AI Engine
      aiEngineRef.current.initGame(
        difficulty,
        config.min,
        config.max,
        chosenSecret,
        generatedAiSecret
      );

      setStatus('coin_toss');
      return true;
    },
    [difficulty]
  );

  /**
   * Executes the randomized coin toss to decide who goes first.
   */
  const performCoinToss = useCallback(() => {
    setIsTossingCoin(true);

    setTimeout(() => {
      const tossWinner: Player = Math.random() < 0.5 ? 'human' : 'ai';
      setCoinTossResult(tossWinner);
      setCurrentTurn(tossWinner);
      setIsTossingCoin(false);

      setTimeout(() => {
        setStatus('in_progress');
        // If AI goes first, generate its opening guess
        if (tossWinner === 'ai') {
          const aiGuess = aiEngineRef.current.getNextGuess();
          setCurrentAiGuess(aiGuess);
        }
      }, 1200);
    }, 1500);
  }, []);

  /**
   * Triggers celebration confetti on victory
   */
  const triggerConfetti = useCallback(() => {
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // Ignore if confetti is unsupported in environment
    }
  }, []);

  /**
   * Finishes the game, persists data to backend API, and triggers winner celebration.
   */
  const finishGame = useCallback(
    async (matchWinner: Player, finalTurns: TurnRecord[]) => {
      setWinner(matchWinner);
      setStatus('game_over');

      if (matchWinner === 'human') {
        triggerConfetti();
      }

      setIsSaving(true);
      try {
        const recorder = aiEngineRef.current.getRecorder();
        await recorder.persistGame(matchWinner);
      } catch (err) {
        console.error('Failed to persist game:', err);
      } finally {
        setIsSaving(false);
      }
    },
    [triggerConfetti]
  );

  /**
   * Human submits a guess to find AI's secret number
   */
  const submitHumanGuess = useCallback(
    (guess: number) => {
      if (status !== 'in_progress' || currentTurn !== 'human' || aiSecret === null) {
        return;
      }

      const config = DIFFICULTY_CONFIGS[difficulty];
      if (guess < config.min || guess > config.max) {
        setValidationError(`Guess must be between ${config.min} and ${config.max}`);
        return;
      }

      setValidationError(null);

      // Determine feedback based on AI's secret number
      let feedback: GuessFeedback;
      let newMin = humanSearchRange.min;
      let newMax = humanSearchRange.max;

      if (guess < aiSecret) {
        feedback = 'higher';
        newMin = Math.max(newMin, guess + 1);
      } else if (guess > aiSecret) {
        feedback = 'lower';
        newMax = Math.min(newMax, guess - 1);
      } else {
        feedback = 'correct';
        newMin = guess;
        newMax = guess;
      }

      setHumanSearchRange({ min: newMin, max: newMax });
      setLastHumanGuessFeedback({ guess, feedback });

      const newTurnNumber = turnCount + 1;
      const turnRecord: TurnRecord = {
        turnNumber: newTurnNumber,
        player: 'human',
        guess,
        response: feedback,
        remainingMin: newMin,
        remainingMax: newMax,
        timestamp: Date.now(),
      };

      const updatedTurns = [...turns, turnRecord];
      setTurns(updatedTurns);
      setTurnCount(newTurnNumber);
      aiEngineRef.current.getRecorder().recordTurn(turnRecord);

      if (feedback === 'correct') {
        finishGame('human', updatedTurns);
        return;
      }

      // Switch turn to AI
      setCurrentTurn('ai');
      // Calculate AI's next guess
      const aiGuess = aiEngineRef.current.getNextGuess();
      setCurrentAiGuess(aiGuess);
    },
    [status, currentTurn, aiSecret, difficulty, humanSearchRange, turnCount, turns, finishGame]
  );

  /**
   * Human responds to the AI's current guess ("higher", "lower", "correct").
   * Includes honest feedback validation to prevent accidental input or desync.
   */
  const submitAiFeedback = useCallback(
    (feedback: GuessFeedback) => {
      if (
        status !== 'in_progress' ||
        currentTurn !== 'ai' ||
        currentAiGuess === null ||
        humanSecret === null
      ) {
        return;
      }

      // Honesty verification check against chosen humanSecret
      let correctExpectedFeedback: GuessFeedback;
      if (currentAiGuess < humanSecret) {
        correctExpectedFeedback = 'higher';
      } else if (currentAiGuess > humanSecret) {
        correctExpectedFeedback = 'lower';
      } else {
        correctExpectedFeedback = 'correct';
      }

      if (feedback !== correctExpectedFeedback) {
        setValidationError(
          `Inconsistent response! Your secret is ${humanSecret} and AI guessed ${currentAiGuess}. The accurate answer is "${correctExpectedFeedback.toUpperCase()}".`
        );
        return;
      }

      setValidationError(null);

      // Record feedback into AIEngine memory
      aiEngineRef.current.recordFeedback(currentAiGuess, feedback);

      const memRange = aiEngineRef.current.getMemory().getRemainingRange();
      setAiSearchRange({ min: memRange.min, max: memRange.max });

      const newTurnNumber = turnCount + 1;
      const turnRecord: TurnRecord = {
        turnNumber: newTurnNumber,
        player: 'ai',
        guess: currentAiGuess,
        response: feedback,
        remainingMin: memRange.min,
        remainingMax: memRange.max,
        timestamp: Date.now(),
      };

      const updatedTurns = [...turns, turnRecord];
      setTurns(updatedTurns);
      setTurnCount(newTurnNumber);
      aiEngineRef.current.getRecorder().recordTurn(turnRecord);

      if (feedback === 'correct') {
        finishGame('ai', updatedTurns);
        return;
      }

      // Switch turn back to human
      setCurrentTurn('human');
      setCurrentAiGuess(null);
    },
    [status, currentTurn, currentAiGuess, humanSecret, turnCount, turns, finishGame]
  );

  /**
   * Resets the entire game back to landing screen
   */
  const resetGame = useCallback(() => {
    setStatus('idle');
    setHumanSecret(null);
    setAiSecret(null);
    setCoinTossResult(null);
    setIsTossingCoin(false);
    setTurnCount(0);
    setTurns([]);
    setWinner(null);
    setCurrentAiGuess(null);
    setLastHumanGuessFeedback(null);
    setValidationError(null);
  }, []);

  /**
   * Restarts a new match with the same difficulty
   */
  const playAgain = useCallback(() => {
    const config = DIFFICULTY_CONFIGS[difficulty];
    setHumanSecret(null);
    setAiSecret(null);
    setCoinTossResult(null);
    setIsTossingCoin(false);
    setTurnCount(0);
    setTurns([]);
    setWinner(null);
    setCurrentAiGuess(null);
    setLastHumanGuessFeedback(null);
    setValidationError(null);
    setHumanSearchRange({ min: config.min, max: config.max });
    setAiSearchRange({ min: config.min, max: config.max });
    setStatus('choosing_secret');
  }, [difficulty]);

  return {
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
    clearValidationError: () => setValidationError(null),
  };
}

