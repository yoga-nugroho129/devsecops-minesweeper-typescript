import { describe, it, expect } from 'vitest';
import { translations } from '../i18n';

describe('i18n translation system', () => {
  it('has valid dictionaries for both English and Indonesian', () => {
    expect(translations.en).toBeDefined();
    expect(translations.id).toBeDefined();
  });

  it('provides matching keys in both language dictionaries', () => {
    const enKeys = Object.keys(translations.en).sort();
    const idKeys = Object.keys(translations.id).sort();

    expect(enKeys).toEqual(idKeys);

    const enModalSettings = Object.keys(translations.en.modalSettings).sort();
    const idModalSettings = Object.keys(translations.id.modalSettings).sort();
    expect(enModalSettings).toEqual(idModalSettings);

    const enModalGuide = Object.keys(translations.en.modalGuide).sort();
    const idModalGuide = Object.keys(translations.id.modalGuide).sort();
    expect(enModalGuide).toEqual(idModalGuide);

    const enCellAria = Object.keys(translations.en.cellAria).sort();
    const idCellAria = Object.keys(translations.id.cellAria).sort();
    expect(enCellAria).toEqual(idCellAria);
  });

  it('correctly executes dynamic text generators in English and Indonesian', () => {
    expect(translations.en.winTitle(42)).toContain('42 seconds');
    expect(translations.id.winTitle(42)).toContain('42 detik');

    expect(translations.en.record(15)).toBe('Record: 15s');
    expect(translations.id.record(15)).toBe('Rekor: 15s');

    expect(translations.en.modalSettings.minesLabel(63)).toContain('63');
    expect(translations.id.modalSettings.minesLabel(63)).toContain('63');

    expect(translations.en.cellAria.neighbors(3)).toBe('3 neighboring mines');
    expect(translations.id.cellAria.neighbors(3)).toBe('3 ranjau sekitar');
  });
});

