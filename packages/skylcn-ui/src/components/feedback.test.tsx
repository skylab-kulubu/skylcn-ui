import { render } from '@testing-library/react';
import { CalendarClock, Info } from 'lucide-react';
import { describe, expect, it } from 'vitest';
import { axeViolations } from '../test/axe.js';
import { Notice } from './feedback.js';

describe('Notice', () => {
  it("shows the tone's own icon unless given one, in the tone's colour", async () => {
    const { container, rerender } = render(
      <Notice tone="info" title="Başvurular yarın kapanıyor" />,
    );
    const icon = () => container.querySelector('[data-slot="notice"] > svg')!;
    expect(icon()).toHaveClass('lucide-info', 'text-info');
    rerender(<Notice tone="info" icon={CalendarClock} title="Başvurular yarın kapanıyor" />);
    expect(icon()).toHaveClass('lucide-calendar-clock', 'text-info');
    expect(icon()).not.toHaveClass('lucide-info');
    expect(icon()).toHaveAttribute('aria-hidden', 'true');
    expect(await axeViolations()).toEqual([]);
  });

  it('keeps the icon a decoration next to the text', () => {
    const { container } = render(<Notice tone="warning" icon={Info} title="Bakımda" />);
    expect(container.querySelectorAll('svg')).toHaveLength(1);
    expect(container.querySelector('svg')).toHaveClass('lucide-info', 'text-warning');
  });
});
