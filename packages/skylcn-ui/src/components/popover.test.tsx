import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Popover, PopoverContent, PopoverTrigger } from './popover.js';

describe('PopoverContent stagger', () => {
  it('steps its direct children in and out when asked', () => {
    render(
      <Popover open>
        <PopoverTrigger>Filtreler</PopoverTrigger>
        <PopoverContent stagger aria-label="Filtreler">
          <p>Durum</p>
          <p>Sıralama</p>
        </PopoverContent>
      </Popover>,
    );
    const panel = screen.getByText('Durum').parentElement;
    expect(panel).toHaveClass('stagger-items');
    // Only fades: the popups' scale-in is replaced, not stacked under the steps
    expect(panel).toHaveClass('data-starting-style:scale-100');
    expect(panel).not.toHaveClass('data-starting-style:scale-(--motion-scale-from)');
  });
});
