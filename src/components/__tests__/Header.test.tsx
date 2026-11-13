import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Header } from '../Header';
import { translations } from '../../utils/i18n';

describe('Header component', () => {
  const defaultProps = {
    status: 'idle' as const,
    minesRemaining: 10,
    timer: 0,
    flagMode: false,
    isMuted: false,
    t: translations.en,
    onReset: vi.fn(),
    onToggleFlagMode: vi.fn(),
    onToggleMute: vi.fn(),
  };

  it('renders mine counter and timer formatted as 3-digit LED values', () => {
    render(<Header {...defaultProps} minesRemaining={9} timer={42} />);

    expect(screen.getByText('009')).toBeInTheDocument();
    expect(screen.getByText('042')).toBeInTheDocument();
  });

  it('formats negative mine counters correctly when overflagged', () => {
    render(<Header {...defaultProps} minesRemaining={-3} />);
    expect(screen.getByText('-03')).toBeInTheDocument();
  });

  it('displays appropriate face emoji based on game status', () => {
    const { rerender } = render(<Header {...defaultProps} status="idle" />);
    expect(screen.getByRole('button', { name: /restart/i })).toHaveTextContent('😊');

    rerender(<Header {...defaultProps} status="playing" />);
    expect(screen.getByRole('button', { name: /restart/i })).toHaveTextContent('🙂');

    rerender(<Header {...defaultProps} status="won" />);
    expect(screen.getByRole('button', { name: /restart/i })).toHaveTextContent('😎');

    rerender(<Header {...defaultProps} status="lost" />);
    expect(screen.getByRole('button', { name: /restart/i })).toHaveTextContent('😵');
  });

  it('calls onReset when face button or reset button is clicked', () => {
    const onReset = vi.fn();
    render(<Header {...defaultProps} onReset={onReset} />);

    const faceButton = screen.getByRole('button', { name: /restart/i });
    fireEvent.click(faceButton);
    expect(onReset).toHaveBeenCalledTimes(1);

    const textResetButton = screen.getByRole('button', { name: 'Reset' });
    fireEvent.click(textResetButton);
    expect(onReset).toHaveBeenCalledTimes(2);
  });

  it('calls onToggleMute when audio button is clicked', () => {
    const onToggleMute = vi.fn();
    const { rerender } = render(<Header {...defaultProps} onToggleMute={onToggleMute} />);

    const audioButton = screen.getByRole('button', { name: 'Audio' });
    fireEvent.click(audioButton);
    expect(onToggleMute).toHaveBeenCalledTimes(1);

    rerender(<Header {...defaultProps} isMuted={true} onToggleMute={onToggleMute} />);
    expect(screen.getByRole('button', { name: 'Mute' })).toBeInTheDocument();
  });

  it('calls onToggleFlagMode when mobile flag button is clicked', () => {
    const onToggleFlagMode = vi.fn();
    render(<Header {...defaultProps} onToggleFlagMode={onToggleFlagMode} />);

    const flagModeButton = screen.getByTitle(translations.en.touchFlagModeOff);
    fireEvent.click(flagModeButton);
    expect(onToggleFlagMode).toHaveBeenCalledTimes(1);
  });
});

