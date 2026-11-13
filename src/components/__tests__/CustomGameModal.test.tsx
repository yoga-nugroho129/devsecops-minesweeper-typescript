import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CustomGameModal } from '../CustomGameModal';
import { translations } from '../../utils/i18n';
import { PRESETS } from '../../utils/minesweeper';

describe('CustomGameModal component', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    currentDifficulty: 'beginner' as const,
    currentConfig: PRESETS.beginner,
    t: translations.en,
    onApplyConfig: vi.fn(),
  };

  it('does not render when isOpen is false', () => {
    const { container } = render(<CustomGameModal {...defaultProps} isOpen={false} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders modal with presets and applies preset difficulty', () => {
    const onApplyConfig = vi.fn();
    const onClose = vi.fn();
    render(
      <CustomGameModal
        {...defaultProps}
        onApplyConfig={onApplyConfig}
        onClose={onClose}
      />
    );

    expect(screen.getByText(translations.en.modalSettings.title)).toBeInTheDocument();

    // Select Intermediate preset
    const intermediateButton = screen.getByText(translations.en.intermediate);
    fireEvent.click(intermediateButton);

    // Click apply
    const applyButton = screen.getByRole('button', { name: translations.en.modalSettings.apply });
    fireEvent.click(applyButton);

    expect(onApplyConfig).toHaveBeenCalledWith('intermediate', PRESETS.intermediate);
    expect(onClose).toHaveBeenCalled();
  });

  it('allows customizing row, col, and mines in custom mode', () => {
    const onApplyConfig = vi.fn();
    render(<CustomGameModal {...defaultProps} onApplyConfig={onApplyConfig} />);

    // Click custom preset
    const customButton = screen.getByText(translations.en.custom);
    fireEvent.click(customButton);

    // Form inputs should now be visible
    const rowInput = screen.getByLabelText(/rows/i);
    const colInput = screen.getByLabelText(/columns/i);

    fireEvent.change(rowInput, { target: { value: '10' } });
    fireEvent.change(colInput, { target: { value: '12' } });

    // Click apply
    const applyButton = screen.getByRole('button', { name: translations.en.modalSettings.apply });
    fireEvent.click(applyButton);

    expect(onApplyConfig).toHaveBeenCalledWith(
      'custom',
      expect.objectContaining({
        rows: 10,
        cols: 12,
      })
    );
  });

  it('adjusts mine count using density preset buttons', () => {
    render(<CustomGameModal {...defaultProps} currentDifficulty="custom" />);

    // Click custom button to show inputs if needed
    fireEvent.click(screen.getByText(translations.en.custom));

    // Click 12% relaxed density button
    const relaxedBtn = screen.getByRole('button', {
      name: translations.en.modalSettings.densityRelaxed,
    });
    fireEvent.click(relaxedBtn);

    // Expected for 8x8 (64 cells) * 12% = 8 mines
    const minesInput = screen.getByLabelText(/number of mines/i);
    expect(minesInput).toHaveValue(8);
  });
});
