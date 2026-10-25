import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axeViolations } from '../test/axe.js';
import { Section } from './section.js';

describe('Section', () => {
  it('heads its content with the title, a rule and the action, in that order', () => {
    const { container } = render(
      <Section
        title="Son formlar"
        description="Sahibi olduğun formlar."
        action={<a href="/forms">Tümünü gör</a>}
      >
        <p>Gece Kodu 2026</p>
      </Section>,
    );
    const heading = screen.getByRole('heading', { level: 2, name: 'Son formlar' });
    const rule = container.querySelector('[data-slot="section-rule"]');
    expect(rule).toHaveAttribute('aria-hidden', 'true');
    expect(heading.compareDocumentPosition(rule!)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    expect(rule!.compareDocumentPosition(screen.getByRole('link', { name: 'Tümünü gör' }))).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
    expect(screen.getByText('Sahibi olduğun formlar.')).toBeInTheDocument();
    expect(
      screen.getByText('Gece Kodu 2026').closest('[data-slot="section-content"]'),
    ).not.toBeNull();
  });

  it('takes the heading level the page needs and the size it is given', () => {
    const { container } = render(<Section title="Alt bölüm" level={3} className="h-80" />);
    expect(screen.getByRole('heading', { level: 3, name: 'Alt bölüm' })).toBeInTheDocument();
    expect(container.querySelector('[data-slot="section"]')).toHaveClass('h-80');
    expect(container.querySelector('[data-slot="section-content"]')).toBeNull();
  });

  it('breaks no accessibility rules', async () => {
    render(
      <Section title="Genel" action={<button>Yenile</button>}>
        <p>128 form</p>
      </Section>,
    );
    expect(await axeViolations()).toEqual([]);
  });
});
