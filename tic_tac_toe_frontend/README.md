# Tic Tac Toe Frontend (Next.js)

A modern, responsive Tic Tac Toe player-vs-player game with in-session score tracking, built using Next.js App Router and Tailwind CSS (v4).

## Features
- Player vs Player gameplay
- Game board rendering with winning highlight
- Win and draw detection
- Score tracking within the browser session (localStorage)
- Responsive, modern light UI
- Color palette:
  - Primary: `#1E90FF`
  - Accent: `#FFC107`
  - Secondary: `#FFFFFF`
- Layout: Centered board with status and control buttons above, scoreboard/info alongside on larger screens

## Scripts
- `npm run dev` – start development server
- `npm run build` – build for production (static export enabled)
- `npm start` – start production server

## Run locally
```bash
npm install
npm run dev
# open http://localhost:3000
```

## How to play
- Players take turns clicking empty cells to place their mark.
- First to get 3 in a row wins; otherwise, a full board is a draw.
- Click “New Round” to clear the board.
- Click “Reset Scores” to reset X/O/Draw counters for the session.
- Shortcuts: press “R” to start a new round, “S” to reset scores.

## Notes
- No backend required; all state is kept in memory with scores persisted to localStorage for the session.
