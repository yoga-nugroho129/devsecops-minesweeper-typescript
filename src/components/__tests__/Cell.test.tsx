import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Cell } from '../Cell';
import { CellData } from '../../types/minesweeper';
import { translations } from '../../utils/i18n';

describe('Cell component', () => {
  const baseData: CellData = {
    row: 1,
    col: 2,
    isMine: false,
    isRevealed: false,
    isFlagged: false,
    neighborMines: 0,
  };

  const defaultProps = {
    data: baseData,
    onReveal: vi.fn(),
    onFlag: vi.fn(),
    onChord: vi.fn(),
    t: translations.en.cellAria,
  };

  it('renders unrevealed cell correctly and handles click', () => {
    const onReveal = vi.fn();
    render(<Cell {...defaultProps} onReveal={onReveal} />);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('aria-label', expect.stringContaining('Row 2, Column 3'));

    fireEvent.click(button);
    expect(onReveal).toHaveBeenCalledWith(1, 2);
  });

  it('handles right click / contextmenu to toggle flag', () => {
    const onFlag = vi.fn();
    render(<Cell {...defaultProps} onFlag={onFlag} />);

    const button = screen.getByRole('button');
    fireEvent.contextMenu(button);
    expect(onFlag).toHaveBeenCalledWith(1, 2);
  });

  it('renders flagged state and does not reveal when clicked', () => {
    const onReveal = vi.fn();
    render(<Cell {...defaultProps} data={{ ...baseData, isFlagged: true }} onReveal={onReveal} />);

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', expect.stringContaining('Flag'));
  });

  it('renders revealed cell with neighbor mine count and handles chord on click/dblclick', () => {
    const onChord = vi.fn();
    render(
      <Cell
        {...defaultProps}
        data={{ ...baseData, isRevealed: true, neighborMines: 3 }}
        onChord={onChord}
      />
    );

    expect(screen.getByText('3')).toBeInTheDocument();

    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(onChord).toHaveBeenCalledWith(1, 2);

    fireEvent.doubleClick(button);
    expect(onChord).toHaveBeenCalledTimes(2);
  });

  it('renders revealed mine and exploded mine', () => {
    const { rerender } = render(
      <Cell {...defaultProps} data={{ ...baseData, isRevealed: true, isMine: true }} />
    );
    let button = screen.getByRole('button');
    expect(button).toHaveClass('bg-slate-950/80');

    rerender(
      <Cell
        {...defaultProps}
        data={{ ...baseData, isRevealed: true, isMine: true, isExploded: true }}
      />
    );
    button = screen.getByRole('button');
    expect(button).toHaveClass('bg-rose-600');
  });

  it('renders wrong flag when cell was flagged on a non-mine and player lost', () => {
    render(
      <Cell {...defaultProps} data={{ ...baseData, isFlagged: true, isWrongFlag: true }} />
    );
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('does not trigger onReveal or onFlag when disabled', () => {
    const onReveal = vi.fn();
    const onFlag = vi.fn();
    render(<Cell {...defaultProps} disabled={true} onReveal={onReveal} onFlag={onFlag} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);
    fireEvent.contextMenu(button);

    expect(onReveal).not.toHaveBeenCalled();
    expect(onFlag).not.toHaveBeenCalled();
  });
});

