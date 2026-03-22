const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const DIRECTIONS = [
  { dr: 0, dc: 1 },   // Horizontal Direita
  { dr: 0, dc: -1 },  // Horizontal Esquerda
  { dr: 1, dc: 0 },   // Vertical Baixo
  { dr: -1, dc: 0 },  // Vertical Cima
  { dr: 1, dc: 1 },   // Diagonal Baixo-Direita
  { dr: -1, dc: -1 }, // Diagonal Cima-Esquerda
];

export interface CellPos {
  row: number;
  col: number;
}

function canPlaceWord(
  grid: string[][],
  word: string,
  r: number,
  c: number,
  dr: number,
  dc: number,
  gridSize: number
): boolean {
  const endR = r + (word.length - 1) * dr;
  const endC = c + (word.length - 1) * dc;
  if (endR < 0 || endR >= gridSize || endC < 0 || endC >= gridSize) return false;
  for (let i = 0; i < word.length; i++) {
    const current = grid[r + i * dr][c + i * dc];
    if (current !== "" && current !== word[i]) return false;
  }
  return true;
}

export interface GridResult {
  grid: string[][];
  wordPositions: Map<string, CellPos[]>;
}

export function generateGrid(words: string[], gridSize: number): GridResult {
  const grid: string[][] = Array.from({ length: gridSize }, () =>
    Array(gridSize).fill("")
  );
  const wordPositions = new Map<string, CellPos[]>();

  words.forEach((word) => {
    let placed = false;
    let attempts = 0;
    while (!placed && attempts < 200) {
      attempts++;
      const dir = DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)];
      const rStart = Math.floor(Math.random() * gridSize);
      const cStart = Math.floor(Math.random() * gridSize);
      if (canPlaceWord(grid, word, rStart, cStart, dir.dr, dir.dc, gridSize)) {
        const cells: CellPos[] = [];
        for (let i = 0; i < word.length; i++) {
          const r = rStart + i * dir.dr;
          const c = cStart + i * dir.dc;
          grid[r][c] = word[i];
          cells.push({ row: r, col: c });
        }
        wordPositions.set(word, cells);
        placed = true;
      }
    }
  });

  // Fill empty cells
  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      if (grid[r][c] === "") {
        grid[r][c] = ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
      }
    }
  }

  return { grid, wordPositions };
}

export function getSelectionCells(
  r1: number,
  c1: number,
  r2: number,
  c2: number
): CellPos[] {
  const dr = r2 - r1;
  const dc = c2 - c1;
  const stepsR = Math.abs(dr);
  const stepsC = Math.abs(dc);

  if (stepsR !== 0 && stepsC !== 0 && stepsR !== stepsC) return [];

  const steps = Math.max(stepsR, stepsC);
  const stepR = stepsR === 0 ? 0 : dr / stepsR;
  const stepC = stepsC === 0 ? 0 : dc / stepsC;

  const cells: CellPos[] = [];
  for (let i = 0; i <= steps; i++) {
    cells.push({ row: r1 + i * stepR, col: c1 + i * stepC });
  }
  return cells;
}

export function extractWord(grid: string[][], cells: CellPos[]): string {
  return cells.map((p) => grid[p.row][p.col]).join("");
}
