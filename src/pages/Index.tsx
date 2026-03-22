import { useCallback, useEffect, useRef, useState } from "react";
import WordSearchBoard from "@/components/WordSearchBoard";
import DinoCompanion from "@/components/DinoCompanion";
import VictoryModal from "@/components/VictoryModal";
import AudioToggle from "@/components/AudioToggle";
import CookieBanner from "@/components/CookieBanner";
import ProgressBar from "@/components/ProgressBar";
import BadgeList from "@/components/BadgeList";
import WordTooltip from "@/components/WordTooltip";
import Confetti from "@/components/Confetti";
import InstallPrompt from "@/components/InstallPrompt";
import { generateGrid, extractWord, CellPos } from "@/lib/wordSearchEngine";
import { COLLECTIONS } from "@/lib/collections";
import { loadProgress, saveProgress, updateStreak, checkBadges, GameProgress } from "@/lib/storage";
import { playFoundSound, playVictorySound, playHintSound } from "@/lib/sounds";
import { vibrateLight, vibrateSuccess } from "@/lib/haptics";

const GRID_SIZE = 12;
const HINT_DELAY_MS = 30_000; // 30 seconds
const HINT_DURATION_MS = 3_000; // 3 seconds blink

const cellKey = (r: number, c: number) => `${r}-${c}`;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

function shuffleArray(arr: number[]): number[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function createShuffledOrder(): number[] {
  return shuffleArray(Array.from({ length: COLLECTIONS.length }, (_, i) => i));
}

export default function Index() {
  const [shuffledOrder, setShuffledOrder] = useState(createShuffledOrder);
  const [playIndex, setPlayIndex] = useState(0);

  const currentLevel = shuffledOrder[playIndex % shuffledOrder.length];
  const words = COLLECTIONS[currentLevel];

  const [gridResult, setGridResult] = useState(() => generateGrid(words, GRID_SIZE));
  const grid = gridResult.grid;
  const wordPositions = gridResult.wordPositions;

  const [foundWords, setFoundWords] = useState<Set<string>>(new Set());
  const [foundCells, setFoundCells] = useState<Set<string>>(new Set());
  const [overlapCells, setOverlapCells] = useState<Set<string>>(new Set());
  const [showVictory, setShowVictory] = useState(false);

  // Persistence
  const [progress, setProgress] = useState<GameProgress>(loadProgress);
  const sessionHintsUsed = useRef(0);

  // Word tooltip
  const [lastFoundWord, setLastFoundWord] = useState<string | null>(null);

  // Timer
  const timerStartRef = useRef(Date.now());
  const [elapsedMs, setElapsedMs] = useState(0);

  // Share modal
  const [showShare, setShowShare] = useState(false);

  // Confetti
  const [confettiKey, setConfettiKey] = useState(0);
  const [confettiIntensity, setConfettiIntensity] = useState<"light" | "heavy">("light");

  // Hint system
  const [showHintButton, setShowHintButton] = useState(false);
  const [hintCell, setHintCell] = useState<string | null>(null);
  const hintTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hintBlinkRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetHintTimer = useCallback(() => {
    setShowHintButton(false);
    setHintCell(null);
    if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
    if (hintBlinkRef.current) clearTimeout(hintBlinkRef.current);
    hintTimerRef.current = setTimeout(() => {
      setShowHintButton(true);
    }, HINT_DELAY_MS);
  }, []);

  // Start hint timer on mount and when level changes
  useEffect(() => {
    resetHintTimer();
    return () => {
      if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
      if (hintBlinkRef.current) clearTimeout(hintBlinkRef.current);
    };
  }, [currentLevel, resetHintTimer]);

  // Timer tick — only restart on level change, not on victory
  const showVictoryRef = useRef(false);
  showVictoryRef.current = showVictory;

  useEffect(() => {
    timerStartRef.current = Date.now();
    setElapsedMs(0);
    const interval = setInterval(() => {
      if (!showVictoryRef.current) {
        setElapsedMs(Date.now() - timerStartRef.current);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [currentLevel]);

  const giveHint = () => {
    const unfoundWords = words.filter((w) => !foundWords.has(w));
    if (unfoundWords.length === 0) return;

    const randomWord = unfoundWords[Math.floor(Math.random() * unfoundWords.length)];
    const positions = wordPositions.get(randomWord);
    if (!positions || positions.length === 0) return;

    const firstCell = positions[0];
    const key = cellKey(firstCell.row, firstCell.col);
    setHintCell(key);
    setShowHintButton(false);
    sessionHintsUsed.current += 1;
    playHintSound();

    // Track hints in progress
    const updated = { ...progress, hintsUsed: progress.hintsUsed + 1 };
    setProgress(updated);
    saveProgress(updated);

    // Clear hint after duration
    if (hintBlinkRef.current) clearTimeout(hintBlinkRef.current);
    hintBlinkRef.current = setTimeout(() => {
      setHintCell(null);
      // Restart the hint timer
      resetHintTimer();
    }, HINT_DURATION_MS);
  };

  const handleSelectionEnd = useCallback(
    (cells: CellPos[]) => {
      if (cells.length === 0) return;
      const word = extractWord(grid, cells);
      const reversed = word.split("").reverse().join("");

      let matched: string | null = null;
      if (words.includes(word) && !foundWords.has(word)) matched = word;
      else if (words.includes(reversed) && !foundWords.has(reversed)) matched = reversed;

      if (matched) {
        const newFound = new Set(foundWords);
        newFound.add(matched);
        setFoundWords(newFound);

        // Game juice: sound + haptic + confetti
        playFoundSound();
        vibrateLight();
        setConfettiIntensity("light");
        setConfettiKey((k) => k + 1);

        // Show word meaning tooltip
        setLastFoundWord(matched);
        setTimeout(() => setLastFoundWord(null), 5200);

        const newFoundCells = new Set(foundCells);
        const newOverlap = new Set(overlapCells);
        cells.forEach((c) => {
          const key = cellKey(c.row, c.col);
          if (newFoundCells.has(key)) newOverlap.add(key);
          else newFoundCells.add(key);
        });
        setFoundCells(newFoundCells);
        setOverlapCells(newOverlap);

        // Reset hint timer on each found word
        resetHintTimer();

        if (newFound.size === words.length) {
          // GA event
          if (window.gtag) {
            window.gtag("event", "level_complete", {
              level_name: `Coleção ${currentLevel + 1}`,
            });
          }

          // Save progress
          let updated = { ...progress };
          if (!updated.completedCollections.includes(currentLevel)) {
            updated.completedCollections = [...updated.completedCollections, currentLevel];
          }
          updated.totalWordsFound += newFound.size;
          updated.sessionsPlayed += 1;
          updated = updateStreak(updated);

          // Badge: completed without hints
          if (sessionHintsUsed.current === 0 && !updated.badges.includes("no_hints")) {
            updated.badges = [...updated.badges, "no_hints"];
          }

          // Check other badges
          const newBadges = checkBadges(updated);
          if (newBadges.length > 0) {
            updated.badges = [...updated.badges, ...newBadges];
          }

          setProgress(updated);
          saveProgress(updated);

          // Clear hint state on victory
          setShowHintButton(false);
          setHintCell(null);
          if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
          if (hintBlinkRef.current) clearTimeout(hintBlinkRef.current);

          // Victory juice
          playVictorySound();
          vibrateSuccess();
          setConfettiIntensity("heavy");
          setConfettiKey((k) => k + 1);

          setTimeout(() => setShowVictory(true), 5500);
        }
      }
    },
    [grid, foundWords, foundCells, overlapCells, words, currentLevel, resetHintTimer, progress]
  );

  const restart = () => {
    const nextPlayIndex = playIndex + 1;

    // If we've exhausted all collections, re-shuffle
    let order = shuffledOrder;
    if (nextPlayIndex >= shuffledOrder.length) {
      order = createShuffledOrder();
      setShuffledOrder(order);
    }

    const nextLevel = order[nextPlayIndex % order.length];
    const nextWords = COLLECTIONS[nextLevel];
    setPlayIndex(nextPlayIndex >= order.length ? 0 : nextPlayIndex);
    setGridResult(generateGrid(nextWords, GRID_SIZE));
    setFoundWords(new Set());
    setFoundCells(new Set());
    setOverlapCells(new Set());
    setShowVictory(false);
    setShowHintButton(false);
    setHintCell(null);
    sessionHintsUsed.current = 0;
    setShowShare(false);
  };

  const isLastLevel = playIndex >= shuffledOrder.length - 1;

  return (
    <div className="flex flex-col items-center min-h-screen px-5 py-5 pb-20">
      <AudioToggle />
      {/* Header */}
      <header className="text-center mb-5">
        <h1 className="text-2xl md:text-3xl font-bold text-secondary-foreground mb-1">
          que palavrinha você precisa encontrar hoje?
        </h1>
        <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-lg mx-auto">
          às vezes as palavras certas estão mais perto do que a gente imagina.
          <br /><br />
          elas estão escondidas no caça-palavras e foram escolhida pelo positivossauro especialmente pra você.
        </p>
      </header>

      <InstallPrompt />

      {/* Game */}
      <main className="flex flex-col md:flex-row items-center md:items-start gap-5 md:gap-10 w-full max-w-[800px]">
        {/* Word list + Dino */}
        <div
          className="bg-card p-4 rounded-[15px] border-2 border-posi-green flex flex-col items-center w-full max-w-[350px]"
          style={{ boxShadow: "var(--card-shadow)" }}
        >
          <ProgressBar progress={progress} totalCollections={COLLECTIONS.length} />
          <h2 className="text-lg font-bold text-secondary-foreground mb-3 text-center">
            pra você não esquecer:
          </h2>
          <ul className="flex flex-wrap gap-2.5 justify-center list-none p-0">
            {words.map((word) => (
              <li
                key={word}
                className={`px-3 py-1 rounded-full text-sm font-semibold transition-all duration-300 ${
                  foundWords.has(word)
                    ? "bg-muted text-muted-foreground line-through opacity-60"
                    : "bg-posi-sky text-primary-foreground"
                }`}
              >
                {word}
              </li>
            ))}
          </ul>
          <DinoCompanion wordsFound={foundWords.size} totalWords={words.length} />
          {/* Hint button */}
          {showHintButton && !showVictory && (
            <button
              onClick={giveHint}
              className="mt-3 bg-posi-sun text-secondary-foreground border-2 border-foreground px-5 py-2 rounded-full font-bold cursor-pointer text-sm lowercase transition-all active:translate-y-0.5"
              style={{
                boxShadow: "2px 3px 0px rgba(0,0,0,0.1)",
                animation: "popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards",
              }}
            >
              💡 me dá uma dica?
            </button>
          )}
          <BadgeList progress={progress} />
        </div>

        {/* Board */}
        <WordSearchBoard
          grid={grid}
          gridSize={GRID_SIZE}
          foundCells={foundCells}
          overlapCells={overlapCells}
          hintCell={hintCell}
          onSelectionEnd={handleSelectionEnd}
        />
      </main>

      {/* Footer */}
      <footer className="mt-4 text-center text-muted-foreground text-sm leading-relaxed pb-2">
        feito com carinho pelo positivossauro.
        <br />
        tô sempre por aqui pra você.
      </footer>

      <Confetti key={confettiKey} active={confettiKey > 0} intensity={confettiIntensity} />
      <WordTooltip word={lastFoundWord} />

      <VictoryModal
        visible={showVictory}
        onRestart={restart}
        buttonLabel={isLastLevel ? "jogar novamente" : "próxima coleção"}
        level={currentLevel}
        elapsedMs={elapsedMs}
        hintsUsed={sessionHintsUsed.current}
        streak={progress.streak.count}
        totalWords={words.length}
      />

      <CookieBanner />
    </div>
  );
}
