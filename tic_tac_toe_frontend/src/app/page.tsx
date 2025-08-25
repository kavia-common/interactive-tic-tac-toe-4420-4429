"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type Player = "X" | "O";
type Cell = Player | null;

type Scores = {
  X: number;
  O: number;
  Draws: number;
};

type WinnerResult = {
  winner: Player | null;
  line: number[] | null; // winning indices to highlight
};

const EMPTY_BOARD: Cell[] = Array(9).fill(null);

// PUBLIC_INTERFACE
export default function Home() {
  /** This component renders the full Tic Tac Toe game UI with PvP gameplay, win/draw detection,
   * session score tracking using localStorage, and a responsive, modern light theme. */
  const [board, setBoard] = useState<Cell[]>(EMPTY_BOARD);
  const [current, setCurrent] = useState<Player>("X");
  const [scores, setScores] = useState<Scores>({ X: 0, O: 0, Draws: 0 });
  const [gameOver, setGameOver] = useState(false);
  const [winningLine, setWinningLine] = useState<number[] | null>(null);

  // Initialize scores from localStorage (session persistence)
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem("ttt_scores");
      if (raw) {
        const parsed = JSON.parse(raw) as Scores;
        if (
          typeof parsed?.X === "number" &&
          typeof parsed?.O === "number" &&
          typeof parsed?.Draws === "number"
        ) {
          setScores(parsed);
        }
      }
    } catch {
      // ignore malformed storage
    }
  }, []);

  // Persist scores on change
  useEffect(() => {
    try {
      window.localStorage.setItem("ttt_scores", JSON.stringify(scores));
    } catch {
      // ignore storage write errors (private mode, etc.)
    }
  }, [scores]);

  const checkWinner = useCallback((b: Cell[]): WinnerResult => {
    const lines = [
      [0, 1, 2], // rows
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6], // cols
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8], // diagonals
      [2, 4, 6],
    ];

    for (const [a, c, d] of lines) {
      if (b[a] && b[a] === b[c] && b[a] === b[d]) {
        return { winner: b[a], line: [a, c, d] };
      }
    }

    const isDraw = b.every((cell) => cell !== null);
    if (isDraw) return { winner: null, line: null };

    return { winner: undefined as unknown as null, line: null }; // ongoing
  }, []);

  const status = useMemo(() => {
    if (gameOver) {
      if (winningLine && typeof board[winningLine[0]] !== "undefined") {
        const w = board[winningLine[0]];
        return w ? `Winner: ${w}` : "It's a draw!";
      }
      // If finished without a winningLine, it's a draw
      return "It's a draw!";
    }
    return `Turn: ${current}`;
  }, [gameOver, winningLine, board, current]);

  const handleCellClick = (idx: number) => {
    if (gameOver || board[idx]) return; // ignore if finished or occupied

    const next = board.slice();
    next[idx] = current;
    setBoard(next);

    const { winner, line } = checkWinner(next);
    if (winner === "X" || winner === "O") {
      setGameOver(true);
      setWinningLine(line);
      setScores((s) => ({ ...s, [winner]: s[winner] + 1 }));
      return;
    }
    if (winner === null) {
      // draw
      setGameOver(true);
      setWinningLine(null);
      setScores((s) => ({ ...s, Draws: s.Draws + 1 }));
      return;
    }

    // continue game
    setCurrent((p) => (p === "X" ? "O" : "X"));
  };

  // PUBLIC_INTERFACE
  const resetBoard = () => {
    /** Reset the current board to start a new round; does not reset scores. */
    setBoard(EMPTY_BOARD);
    setCurrent("X");
    setGameOver(false);
    setWinningLine(null);
  };

  // PUBLIC_INTERFACE
  const resetScores = useCallback(() => {
    /** Reset the session scores for both players and draws. */
    setScores({ X: 0, O: 0, Draws: 0 });
    try {
      window.localStorage.removeItem("ttt_scores");
    } catch {
      // ignore storage errors
    }
    resetBoard();
  }, []);

  // Keyboard accessibility: R to reset board, S to reset scores
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "r") {
        e.preventDefault();
        resetBoard();
      } else if (e.key.toLowerCase() === "s") {
        e.preventDefault();
        resetScores();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [resetScores]);

  return (
    <main className="min-h-[90vh] flex items-center justify-center">
      <div className="w-full max-w-[980px]">
        {/* Header / Title */}
        <header className="header-gradient card px-6 py-4 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              aria-hidden
              className="w-10 h-10 rounded-xl"
              style={{
                background:
                  "conic-gradient(from 180deg at 50% 50%, #1E90FF 0deg, #FFC107 120deg, #1E90FF 360deg)",
              }}
            />
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                Tic Tac Toe
              </h1>
              <p className="subtle text-sm">
                Player vs Player • Modern UI • Session scores
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="badge">
              Tip: Press <span className="kbd">R</span> to reset board
            </span>
            <span className="badge">
              Press <span className="kbd">S</span> to reset scores
            </span>
          </div>
        </header>

        {/* Game Card */}
        <section className="card p-5 sm:p-6">
          {/* Status and Controls */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <div className="status text-lg font-semibold">
                {status}
              </div>
              <div className="subtle text-sm">
                {gameOver
                  ? "Start a new round to continue playing."
                  : `Current player: ${current}`}
              </div>
            </div>

            <div className="flex gap-2 flex-wrap">
              <button
                type="button"
                className="btn btn-primary"
                onClick={resetBoard}
                aria-label="Start a new round"
                title="New Round (R)"
              >
                New Round
              </button>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => {
                  if (gameOver) return;
                  const lastIdx = [...board]
                    .map((v, i) => ({ v, i }))
                    .reverse()
                    .find(({ v }) => v !== null)?.i;
                  if (lastIdx === undefined) return;
                  const copy = board.slice();
                  copy[lastIdx] = null;
                  setBoard(copy);
                  setCurrent((p) => (p === "X" ? "O" : "X"));
                }}
                aria-label="Undo last move"
                disabled={board.every((c) => c === null) || gameOver}
                title={
                  board.every((c) => c === null)
                    ? "No moves to undo"
                    : "Undo last move"
                }
              >
                Undo
              </button>
              <button
                type="button"
                className="btn btn-accent"
                onClick={resetScores}
                aria-label="Reset scores"
                title="Reset Scores (S)"
              >
                Reset Scores
              </button>
            </div>
          </div>

          {/* Board + Sidebar */}
          <div className="grid grid-cols-1 md:grid-cols-[auto_minmax(0,1fr)] gap-6">
            {/* Board */}
            <div className="flex items-center justify-center">
              <div className="board" role="group" aria-label="Tic Tac Toe board">
                {board.map((cell, idx) => {
                  const isWinning =
                    winningLine?.includes(idx) ?? false;
                  return (
                    <button
                      key={idx}
                      className={`cell ${isWinning ? "win" : ""}`}
                      onClick={() => handleCellClick(idx)}
                      disabled={!!cell || gameOver}
                      aria-label={`Cell ${idx + 1}`}
                    >
                      {cell ?? ""}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Score and Info */}
            <aside className="flex flex-col gap-4">
              <div className="card p-4">
                <h2 className="text-base font-bold mb-3">Scoreboard</h2>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-3 rounded-lg border border-slate-200">
                    <div className="text-xs subtle mb-1">Player X</div>
                    <div className="text-2xl font-extrabold text-[color:var(--color-primary)]">
                      {scores.X}
                    </div>
                  </div>
                  <div className="p-3 rounded-lg border border-slate-200">
                    <div className="text-xs subtle mb-1">Draws</div>
                    <div className="text-2xl font-extrabold text-amber-500">
                      {scores.Draws}
                    </div>
                  </div>
                  <div className="p-3 rounded-lg border border-slate-200">
                    <div className="text-xs subtle mb-1">Player O</div>
                    <div className="text-2xl font-extrabold text-[color:var(--color-primary)]">
                      {scores.O}
                    </div>
                  </div>
                </div>
              </div>

              <div className="card p-4">
                <h2 className="text-base font-bold mb-2">How to play</h2>
                <ul className="list-disc pl-5 subtle space-y-1 text-sm">
                  <li>Take turns placing X and O on the 3×3 board.</li>
                  <li>First player to align three marks in a row wins.</li>
                  <li>If all nine cells are filled without a winner, it’s a draw.</li>
                  <li>Use New Round to play again and Reset Scores to clear totals.</li>
                </ul>
              </div>
            </aside>
          </div>
        </section>

        {/* Footer */}
        <footer className="flex justify-center mt-6">
          <div className="subtle text-sm">
            Built with Next.js • Theme colors: Primary
            <span className="mx-1 font-semibold" style={{ color: "#1E90FF" }}>
              #1E90FF
            </span>
            Accent
            <span className="mx-1 font-semibold" style={{ color: "#FFC107" }}>
              #FFC107
            </span>
            Secondary
            <span className="mx-1 font-semibold" style={{ color: "#1f2937", backgroundColor: "#FFFFFF", padding: "2px 6px", borderRadius: "6px", border: "1px solid #e5e7eb" }}>
              #FFFFFF
            </span>
          </div>
        </footer>
      </div>
    </main>
  );
}
