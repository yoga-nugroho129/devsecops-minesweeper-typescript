import { Language } from '../types/minesweeper';

export interface Translations {
  appTitle: string;
  appSubtitle: string;
  changeGrid: string;
  gridShort: string;
  howToPlay: string;
  mines: string;
  time: string;
  restart: string;
  audio: string;
  mute: string;
  reset: string;
  leftClick: string;
  leftClickAction: string;
  rightClick: string;
  rightClickAction: string;
  dblClick: string;
  dblClickAction: string;
  winTitle: (time: number) => string;
  playAgain: string;
  lostTitle: string;
  tryAgain: string;
  custom: string;
  beginner: string;
  intermediate: string;
  expert: string;
  minesCountSuffix: string;
  record: (time: number) => string;
  footerText: string;
  touchFlagModeOn: string;
  touchFlagModeOff: string;
  modalSettings: {
    title: string;
    difficultyHeader: string;
    beginnerDesc: string;
    intermediateDesc: string;
    expertDesc: string;
    customDesc: string;
    rowLabel: string;
    colLabel: string;
    minesLabel: (max: number) => string;
    densityLabel: (val: string) => string;
    densityPreset: string;
    densityRelaxed: string;
    densityStandard: string;
    densityHard: string;
    cancel: string;
    apply: string;
  };
  modalGuide: {
    title: string;
    goalTitle: string;
    goalDesc: string;
    leftTitle: string;
    leftDesc: string;
    rightTitle: string;
    rightDesc: string;
    chordTitle: string;
    chordDesc: string;
    safeTip: string;
    understandButton: string;
  };
  cellAria: {
    row: string;
    col: string;
    mine: string;
    neighbors: (count: number) => string;
    flag: string;
    unrevealed: string;
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    appTitle: 'Minesweeper',
    appSubtitle: 'React • TypeScript • Tailwind CSS',
    changeGrid: 'Change Grid',
    gridShort: 'Grid',
    howToPlay: 'How to Play',
    mines: 'Mines',
    time: 'Time',
    restart: 'Restart',
    audio: 'Audio',
    mute: 'Mute',
    reset: 'Reset',
    leftClick: 'Left Click',
    leftClickAction: 'Reveal',
    rightClick: 'Right Click',
    rightClickAction: 'Flag',
    dblClick: 'Dbl-Click',
    dblClickAction: 'Chord',
    winTitle: (time: number) => `Congratulations! You won in ${time} seconds!`,
    playAgain: 'Play Again',
    lostTitle: 'Boom! You detonated a mine.',
    tryAgain: 'Try Again',
    custom: 'Custom',
    beginner: 'Beginner (Default)',
    intermediate: 'Intermediate',
    expert: 'Expert',
    minesCountSuffix: 'Mines',
    record: (time: number) => `Record: ${time}s`,
    footerText: 'Minesweeper TypeScript • Customizable Grid • Safe First Click',
    touchFlagModeOn: 'Flag Mode Active',
    touchFlagModeOff: 'Reveal Mode Active',
    modalSettings: {
      title: 'Grid Size & Mines Settings',
      difficultyHeader: 'Difficulty Preset',
      beginnerDesc: '8 × 8 • 10 Mines',
      intermediateDesc: '16 × 16 • 40 Mines',
      expertDesc: '16 × 30 • 99 Mines',
      customDesc: 'Configure Rows & Columns',
      rowLabel: 'Rows (4-40)',
      colLabel: 'Columns (4-40)',
      minesLabel: (max: number) => `Number of Mines (1 - ${max})`,
      densityLabel: (val: string) => `Density: ${val}%`,
      densityPreset: 'Density Preset:',
      densityRelaxed: '12% (Relaxed)',
      densityStandard: '16% (Standard)',
      densityHard: '22% (Hard)',
      cancel: 'Cancel',
      apply: 'Apply & Play',
    },
    modalGuide: {
      title: 'How to Play Guide',
      goalTitle: 'Game Objective',
      goalDesc: 'Uncover all safe squares without stepping on any mines! You win when all non-mine cells are revealed.',
      leftTitle: 'Left Click (Tap)',
      leftDesc: 'Reveals a square. The revealed number indicates how many mines surround it across all 8 adjacent squares.',
      rightTitle: 'Right Click / Flag Mode',
      rightDesc: 'Flags a square suspected of containing a mine to prevent accidental clicks.',
      chordTitle: 'Chord / Fast Reveal (Double-Click)',
      chordDesc: 'If a numbered square already has the matching number of flagged neighbors, double-click or click it to reveal all remaining adjacent squares at once.',
      safeTip: 'First-Click Guarantee: Your very first click is 100% guaranteed safe and opens up an initial safe opening!',
      understandButton: 'Got It, Let\'s Play!',
    },
    cellAria: {
      row: 'Row',
      col: 'Column',
      mine: 'Mine',
      neighbors: (count: number) => `${count} neighboring mines`,
      flag: 'Flag',
      unrevealed: 'Unrevealed',
    },
  },
  id: {
    appTitle: 'Minesweeper',
    appSubtitle: 'React • TypeScript • Tailwind CSS',
    changeGrid: 'Ubah Grid',
    gridShort: 'Grid',
    howToPlay: 'Cara Bermain',
    mines: 'Ranjau',
    time: 'Waktu',
    restart: 'Mulai Ulang',
    audio: 'Audio',
    mute: 'Mute',
    reset: 'Reset',
    leftClick: 'Klik Kiri',
    leftClickAction: 'Buka',
    rightClick: 'Klik Kanan',
    rightClickAction: 'Bendera',
    dblClick: 'Dbl-Klik',
    dblClickAction: 'Chord',
    winTitle: (time: number) => `Selamat! Anda Menang dalam ${time} detik!`,
    playAgain: 'Main Lagi',
    lostTitle: 'Boom! Anda terkena ranjau.',
    tryAgain: 'Coba Lagi',
    custom: 'Kustom',
    beginner: 'Pemula (Default)',
    intermediate: 'Menengah',
    expert: 'Ahli',
    minesCountSuffix: 'Ranjau',
    record: (time: number) => `Rekor: ${time}s`,
    footerText: 'Minesweeper TypeScript • Grid Kustomisasi Bebas • First Click Aman',
    touchFlagModeOn: 'Mode Bendera Aktif',
    touchFlagModeOff: 'Mode Buka Kotak Aktif',
    modalSettings: {
      title: 'Pengaturan Ukuran & Ranjau',
      difficultyHeader: 'Pilihan Kesulitan',
      beginnerDesc: '8 × 8 • 10 Ranjau',
      intermediateDesc: '16 × 16 • 40 Ranjau',
      expertDesc: '16 × 30 • 99 Ranjau',
      customDesc: 'Atur Baris & Kolom',
      rowLabel: 'Baris (Row) (4-40)',
      colLabel: 'Kolom (Col) (4-40)',
      minesLabel: (max: number) => `Jumlah Ranjau (1 - ${max})`,
      densityLabel: (val: string) => `Kerapatan: ${val}%`,
      densityPreset: 'Preset Kerapatan:',
      densityRelaxed: '12% (Santai)',
      densityStandard: '16% (Standar)',
      densityHard: '22% (Sulit)',
      cancel: 'Batal',
      apply: 'Terapkan & Main',
    },
    modalGuide: {
      title: 'Panduan Cara Bermain',
      goalTitle: 'Tujuan Game',
      goalDesc: 'Buka seluruh kotak yang aman tanpa menginjak ranjau! Anda menang ketika semua kotak selain ranjau berhasil dibuka.',
      leftTitle: 'Klik Kiri (Sentuh Biasa)',
      leftDesc: 'Membuka kotak. Angka yang muncul menunjukkan berapa banyak ranjau yang berada di 8 kotak sekelilingnya.',
      rightTitle: 'Klik Kanan / Mode Bendera',
      rightDesc: 'Menandai kotak dengan bendera untuk menandakan dugaan lokasi ranjau agar tidak sengaja tertekan.',
      chordTitle: 'Chord / Klik Cepat (Double-Click)',
      chordDesc: 'Jika angka sudah memiliki jumlah bendera yang sesuai di sekitarnya, double-click angka tersebut untuk langsung membuka semua kotak tersisa di sekitarnya.',
      safeTip: 'Jaminan Langkah Pertama: Kotak pertama yang Anda klik dijamin 100% selalu aman dan membuka area awal secara mulus!',
      understandButton: 'Mengerti, Ayo Main!',
    },
    cellAria: {
      row: 'Baris',
      col: 'Kolom',
      mine: 'Ranjau',
      neighbors: (count: number) => `${count} ranjau sekitar`,
      flag: 'Bendera',
      unrevealed: 'Belum dibuka',
    },
  },
};
