import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LanguageToggle } from '../LanguageToggle';

describe('LanguageToggle component', () => {
  it('renders both language buttons with flag icons', () => {
    const onLanguageChange = vi.fn();
    render(<LanguageToggle currentLanguage="en" onLanguageChange={onLanguageChange} />);

    expect(screen.getByRole('button', { name: /switch to english/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /ganti ke bahasa indonesia/i })).toBeInTheDocument();
    expect(screen.getByText('🇬🇧')).toBeInTheDocument();
    expect(screen.getByText('🇮🇩')).toBeInTheDocument();
  });

  it('highlights the active language', () => {
    const { rerender } = render(
      <LanguageToggle currentLanguage="en" onLanguageChange={vi.fn()} />
    );
    const enButton = screen.getByRole('button', { name: /switch to english/i });
    expect(enButton).toHaveClass('bg-amber-500/20');

    rerender(<LanguageToggle currentLanguage="id" onLanguageChange={vi.fn()} />);
    const idButton = screen.getByRole('button', { name: /ganti ke bahasa indonesia/i });
    expect(idButton).toHaveClass('bg-amber-500/20');
  });

  it('invokes callback when switching language', () => {
    const onLanguageChange = vi.fn();
    render(<LanguageToggle currentLanguage="en" onLanguageChange={onLanguageChange} />);

    const idButton = screen.getByRole('button', { name: /ganti ke bahasa indonesia/i });
    fireEvent.click(idButton);
    expect(onLanguageChange).toHaveBeenCalledWith('id');

    const enButton = screen.getByRole('button', { name: /switch to english/i });
    fireEvent.click(enButton);
    expect(onLanguageChange).toHaveBeenCalledWith('en');
  });
});

