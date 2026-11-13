import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../App';

describe('App component (Integration)', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('renders default 8x8 grid with 10 mines in English by default', () => {
    render(<App />);

    // Check title and default language English
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Minesweeper');
    expect(screen.getByText('8×8')).toBeInTheDocument();
    expect(screen.getByText('Mines')).toBeInTheDocument();
    expect(screen.getByText('Time')).toBeInTheDocument();

    // 8x8 board has 64 cell buttons
    const cells = screen.getAllByRole('button', { name: /row \d+, column \d+/i });
    expect(cells).toHaveLength(64);

    // Initial counter is 010
    expect(screen.getByText('010')).toBeInTheDocument();
  });

  it('switches language between English and Indonesian on clicking flag button', () => {
    render(<App />);

    // Default English
    expect(screen.getByText('Mines')).toBeInTheDocument();
    expect(screen.getByText('Time')).toBeInTheDocument();

    // Click Indonesian flag button
    const idButton = screen.getByRole('button', { name: /ganti ke bahasa indonesia/i });
    fireEvent.click(idButton);

    // Should update to Indonesian
    expect(screen.getByText('Ranjau')).toBeInTheDocument();
    expect(screen.getByText('Waktu')).toBeInTheDocument();
    expect(screen.getByText(/ubah grid/i)).toBeInTheDocument();

    // Click English flag button back
    const enButton = screen.getByRole('button', { name: /switch to english/i });
    fireEvent.click(enButton);

    expect(screen.getByText('Mines')).toBeInTheDocument();
    expect(screen.getByText('Time')).toBeInTheDocument();
  });

  it('handles first click safely and starts the game', () => {
    render(<App />);

    const firstCell = screen.getAllByRole('button', { name: /row \d+, column \d+/i })[0];
    fireEvent.click(firstCell);

    // Face emoji changes to 🙂 (playing)
    const faceButton = screen.getByRole('button', { name: /restart/i });
    expect(faceButton).toHaveTextContent('🙂');

    // First cell is revealed and NOT a mine
    expect(firstCell).not.toHaveClass('bg-rose-600');
  });

  it('places a flag on right click and decrements remaining mine counter', () => {
    render(<App />);

    const firstCell = screen.getAllByRole('button', { name: /row \d+, column \d+/i })[0];
    fireEvent.contextMenu(firstCell);

    // Mine counter was 10, now should be 9
    expect(screen.getByText('009')).toBeInTheDocument();

    // Right-clicking again removes flag
    fireEvent.contextMenu(firstCell);
    expect(screen.getByText('010')).toBeInTheDocument();
  });

  it('opens Grid settings modal and changes configuration', () => {
    render(<App />);

    // Open settings modal
    const settingsBtn = screen.getByRole('button', { name: /change grid/i });
    fireEvent.click(settingsBtn);

    expect(screen.getByText(/grid size & mines settings/i)).toBeInTheDocument();

    // Choose Intermediate (16x16)
    const intermediateBtn = screen.getByRole('button', { name: /intermediate/i });
    fireEvent.click(intermediateBtn);

    // Click apply
    const applyBtn = screen.getByRole('button', { name: /apply & play/i });
    fireEvent.click(applyBtn);

    // Now board has 16 * 16 = 256 cells
    const cells = screen.getAllByRole('button', { name: /row \d+, column \d+/i });
    expect(cells).toHaveLength(256);

    // Mines counter should be 40
    expect(screen.getByText('040')).toBeInTheDocument();
  });

  it('opens and closes How to Play modal', () => {
    render(<App />);

    const helpBtn = screen.getByRole('button', { name: /how to play/i });
    fireEvent.click(helpBtn);

    expect(screen.getByText(/how to play guide/i)).toBeInTheDocument();

    const understandBtn = screen.getByRole('button', { name: /got it, let's play!/i });
    fireEvent.click(understandBtn);

    expect(screen.queryByText(/how to play guide/i)).not.toBeInTheDocument();
  });
});
