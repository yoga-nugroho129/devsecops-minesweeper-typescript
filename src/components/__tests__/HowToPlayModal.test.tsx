import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { HowToPlayModal } from '../HowToPlayModal';
import { translations } from '../../utils/i18n';

describe('HowToPlayModal component', () => {
  it('does not render when isOpen is false', () => {
    const { container } = render(
      <HowToPlayModal isOpen={false} onClose={vi.fn()} t={translations.en} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('renders all instructions and handles close', () => {
    const onClose = vi.fn();
    render(<HowToPlayModal isOpen={true} onClose={onClose} t={translations.en} />);

    expect(screen.getByText(translations.en.modalGuide.title)).toBeInTheDocument();
    expect(screen.getByText(translations.en.modalGuide.goalTitle)).toBeInTheDocument();
    expect(screen.getByText(translations.en.modalGuide.leftTitle)).toBeInTheDocument();
    expect(screen.getByText(translations.en.modalGuide.rightTitle)).toBeInTheDocument();
    expect(screen.getByText(translations.en.modalGuide.chordTitle)).toBeInTheDocument();

    const understandBtn = screen.getByRole('button', {
      name: translations.en.modalGuide.understandButton,
    });
    fireEvent.click(understandBtn);
    expect(onClose).toHaveBeenCalled();
  });
});

