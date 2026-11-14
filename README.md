# 💣 Modern Minesweeper (React + TypeScript + Tailwind CSS)

<p align="center">
  <strong>English</strong> | <a href="./README.id.md">Bahasa Indonesia</a>
</p>

A modern Minesweeper web game featuring classic game mechanics, a neo-retro design, flexible custom grid dimensions (rows & columns), and an **8x8 (10 mines)** default configuration.

![React](https://img.shields.io/badge/React-18.3-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8?logo=tailwindcss)
![Vite](https://img.shields.io/badge/Vite-6.1-646cff?logo=vite)
![Vitest](https://img.shields.io/badge/Vitest-3.0-green?logo=vitest)

<p align="center">
  <img src="./assets/preview.png" alt="Minesweeper Modern Preview" width="650" style="border-radius: 12px; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.4);" />
</p>

---

## ✨ Features

- 🌐 **Bilingual Support (EN / ID)**: Instant language switching via flag buttons (🇬🇧 English / 🇮🇩 Indonesia), with **English enabled by default**.
- 📐 **Customizable Grid Dimensions**: Freely configure row count and column count from 4×4 up to 40×40 with custom mine counts.
- 🎯 **Difficulty Presets**:
  - **Beginner (Default)**: 8 × 8 • 10 Mines
  - **Intermediate**: 16 × 16 • 40 Mines
  - **Expert**: 16 × 30 • 99 Mines
  - **Custom**: Configure rows, columns, and mine density presets (12% relaxed, 16% standard, 22% hard).
- 🛡️ **Guaranteed First-Click Safety**: Your very first click is 100% safe and automatically opens a clean starting cluster.
- ⚡ **Chord Action (Fast Reveal)**: Double-click or click revealed numbers with matching neighbor flags to instantly reveal remaining adjacent squares.
- 🚩 **Flag Mode & Touch Support**: Right-click to flag on desktop, plus a dedicated flag-mode toggle button for mobile/touchscreen devices.
- ⏱️ **Digital LCD Display**: Classic retro 3-digit LED displays for timer and remaining mine counters.
- 🔊 **Synthesized Audio (Web Audio API)**: Zero external audio assets required; includes instant sound effects (click, flag, unflag, explosion, victory fanfare) and a mute/audio toggle.
- 🎉 **Victory Celebration**: Delightful confetti animations powered by `canvas-confetti` upon clearing all safe cells.
- 🏆 **High Score Persistence**: Automatically tracks and stores your best completion times in `localStorage` per board dimension.
- 🧪 **Comprehensive Test Coverage**: Over 50 unit and integration tests using Vitest, React Testing Library, and v8 coverage reports.

---

## 🚀 Getting Started

### 1. Run Development Server

```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

### 2. Run Tests & Check Coverage

```bash
# Run all unit and integration tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate code coverage report (CLI table & HTML)
npm run test:coverage
```

To view the detailed interactive HTML coverage report in your browser:

```bash
open coverage/index.html
```

### 3. Build for Production

```bash
npm run build
```

Production-ready assets will be generated in the `dist/` directory.

### 4. Preview Production Build

```bash
npm run preview
```

---

## 🎮 Game Controls

| Action | Desktop | Mobile / Touchscreen |
| --- | --- | --- |
| **Reveal Square** | Left Click | Tap square |
| **Place / Remove Flag** | Right Click | Tap 🚩 mode button, then tap square |
| **Chord (Reveal Neighbors)** | Double Click / Click number with matching flags | Tap number |
| **Restart Game** | Click emoji face 🙂 | Tap emoji face 🙂 |

---

## 📁 Project Structure

```text
devsecops-minesweeper-typescript/
├── assets/                 # Screenshots and visual preview assets
├── src/
│   ├── components/         # UI Components (Board, Cell, Header, Modals, LanguageToggle)
│   ├── types/              # TypeScript definitions & interfaces
│   ├── utils/              # Core game algorithms, audio synthesis, i18n
│   ├── test/               # Vitest test setup and Web Audio mocks
│   ├── __tests__/          # Integration test suites
│   ├── App.tsx             # Main application orchestrator
│   └── main.tsx            # Application entry point
├── coverage/               # Generated test coverage reports
├── vite.config.ts          # Vite & Vitest configuration
└── package.json            # Project dependencies and npm scripts
```
