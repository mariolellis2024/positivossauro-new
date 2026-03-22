import { useCallback, useRef, useState } from "react";
import { CellPos, getSelectionCells } from "@/lib/wordSearchEngine";

interface Props {
  grid: string[][];
  gridSize: number;
  foundCells: Set<string>;
  overlapCells: Set<string>;
  hintCell?: string | null;
  onSelectionEnd: (cells: CellPos[]) => void;
}

const cellKey = (r: number, c: number) => `${r}-${c}`;

export default function WordSearchBoard({
  grid,
  gridSize,
  foundCells,
  overlapCells,
  hintCell,
  onSelectionEnd,
}: Props) {
  const [selecting, setSelecting] = useState(false);
  const [selectedCells, setSelectedCells] = useState<Set<string>>(new Set());
  const startRef = useRef<CellPos | null>(null);
  const currentSelectionRef = useRef<CellPos[]>([]);
  const boardRef = useRef<HTMLDivElement>(null);

  const updateSelection = useCallback(
    (endRow: number, endCol: number) => {
      if (!startRef.current) return;
      const cells = getSelectionCells(
        startRef.current.row,
        startRef.current.col,
        endRow,
        endCol
      );
      currentSelectionRef.current = cells;
      setSelectedCells(new Set(cells.map((c) => cellKey(c.row, c.col))));
    },
    []
  );

  const handleStart = (r: number, c: number) => {
    setSelecting(true);
    startRef.current = { row: r, col: c };
    updateSelection(r, c);
  };

  const handleMove = (r: number, c: number) => {
    if (!selecting) return;
    updateSelection(r, c);
  };

  const handleEnd = useCallback(() => {
    if (!selecting) return;
    setSelecting(false);
    onSelectionEnd(currentSelectionRef.current);
    setSelectedCells(new Set());
    startRef.current = null;
    currentSelectionRef.current = [];
  }, [selecting, onSelectionEnd]);

  const getCellFromTouch = (touch: React.Touch): CellPos | null => {
    const el = document.elementFromPoint(touch.clientX, touch.clientY);
    if (!el || !el.getAttribute("data-row")) return null;
    return {
      row: parseInt(el.getAttribute("data-row")!),
      col: parseInt(el.getAttribute("data-col")!),
    };
  };

  const getCellStyle = (r: number, c: number) => {
    const key = cellKey(r, c);
    if (selectedCells.has(key)) return "bg-posi-sun";
    if (overlapCells.has(key)) return "bg-posi-green-dark text-primary-foreground";
    if (foundCells.has(key)) return "bg-posi-green text-primary-foreground";
    return "bg-card";
  };

  const getCellAnimation = (r: number, c: number) => {
    const key = cellKey(r, c);
    if (hintCell === key) {
      return { animation: "hint-pulse 1.2s ease-in-out infinite" };
    }
    return undefined;
  };

  return (
    <div
      ref={boardRef}
      className="relative w-full aspect-square max-w-[350px] md:max-w-[500px]"
      style={{ touchAction: "none" }}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      onTouchEnd={handleEnd}
      onTouchStart={(e) => {
        e.preventDefault();
        const cell = getCellFromTouch(e.touches[0]);
        if (cell) handleStart(cell.row, cell.col);
      }}
      onTouchMove={(e) => {
        e.preventDefault();
        const cell = getCellFromTouch(e.touches[0]);
        if (cell) handleMove(cell.row, cell.col);
      }}
    >
      <div
        className="grid w-full h-full rounded-lg overflow-hidden"
        style={{
          gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
          gridTemplateRows: `repeat(${gridSize}, 1fr)`,
          gap: "1px",
          backgroundColor: "hsl(var(--border))",
          boxShadow: "4px 6px 0px rgba(0,0,0,0.1)",
          border: "3px solid hsl(var(--foreground))",
        }}
      >
        {grid.map((row, r) =>
          row.map((letter, c) => (
            <div
              key={cellKey(r, c)}
              data-row={r}
              data-col={c}
              className={`flex items-center justify-center font-bold text-xs sm:text-sm md:text-base uppercase cursor-pointer select-none transition-colors duration-100 ${getCellStyle(r, c)}`}
              style={getCellAnimation(r, c)}
              onMouseDown={() => handleStart(r, c)}
              onMouseEnter={() => handleMove(r, c)}
            >
              {letter}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
