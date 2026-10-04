import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Avatar, avatarTone } from './avatar.js';

describe('avatarTone', () => {
  it('gives a person the same tone every time, whatever the casing', () => {
    expect(avatarTone('Ece Yıldırım')).toBe(avatarTone('ece yıldırım'));
    expect(avatarTone(null, 'ece@example.com')).toBe(avatarTone(undefined, 'ece@example.com'));
  });

  it('spreads people over the tones and has none without a name or e-mail', () => {
    const names = [
      'Ece Yıldırım',
      'Mert Kaya',
      'Zeynep Arslan',
      'Can Öztürk',
      'Selin Bulut',
      'Kerem Aydemir',
    ];
    expect(new Set(names.map((name) => avatarTone(name))).size).toBeGreaterThan(3);
    expect(avatarTone('', '')).toBe(-1);
  });
});

describe('Avatar', () => {
  it('tints initials by person and keeps the plain look without a name', () => {
    const { container, rerender } = render(<Avatar name="Mert Kaya" />);
    const root = () => container.querySelector('[data-slot="avatar"]')!;
    expect(root().className).toMatch(/bg-chart-\d\/20/);
    expect(root()).toHaveTextContent('MK');
    rerender(<Avatar />);
    expect(root()).toHaveClass('bg-muted');
  });
});
