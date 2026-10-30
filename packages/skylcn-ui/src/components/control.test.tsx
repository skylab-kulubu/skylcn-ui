import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { DatePicker } from './calendar.js';
import { ControlSizeProvider } from './control.js';
import { Input, Textarea } from './field.js';
import { Combobox, NumberField } from './form-extra.js';
import { SearchInput } from './page-header.js';
import { Select } from './select.js';
import { TimePicker } from './time-picker.js';

const noop = () => undefined;

describe('Box control sizes', () => {
  it('draws md by default, the nearest provider’s size otherwise, and its own above both', () => {
    render(
      <>
        <Input aria-label="Varsayılan" />
        <ControlSizeProvider size="lg">
          <Input aria-label="Formdan" />
          <Input aria-label="Kendi" inputSize="sm" />
          <Textarea aria-label="Not" />
        </ControlSizeProvider>
      </>,
    );
    expect(screen.getByRole('textbox', { name: 'Varsayılan' })).toHaveAttribute('data-size', 'md');
    expect(screen.getByRole('textbox', { name: 'Formdan' })).toHaveAttribute('data-size', 'lg');
    expect(screen.getByRole('textbox', { name: 'Kendi' })).toHaveAttribute('data-size', 'sm');
    expect(screen.getByRole('textbox', { name: 'Not' })).toHaveAttribute('data-size', 'lg');
  });

  it('gives every box control of one size the same height', () => {
    render(
      <ControlSizeProvider size="lg">
        <Input aria-label="Ad" />
        <Select aria-label="Sınıf" value={null} onValueChange={noop} options={['1', '2']} />
        <Combobox aria-label="Bölüm" items={[]} value={null} onValueChange={noop} />
        <NumberField aria-label="Kişi" />
        <SearchInput aria-label="Ara" value="" onValueChange={noop} />
        <DatePicker aria-label="Gün" value={null} onValueChange={noop} />
        <TimePicker aria-label="Saat" value={null} onValueChange={noop} />
      </ControlSizeProvider>,
    );
    const boxes = [...document.querySelectorAll('[data-size="lg"]')];
    expect(boxes).toHaveLength(7);
    // The Combobox holds wrapping chips, so it takes the height as a minimum
    for (const box of boxes) expect(box.className).toMatch(/(^|\s)(min-)?h-9\.5(\s|$)/);
  });

  it('keeps a compact search box at sm unless told otherwise', () => {
    render(
      <>
        <SearchInput aria-label="Kısa" compact value="" onValueChange={noop} />
        <SearchInput aria-label="Büyük" compact size="md" value="" onValueChange={noop} />
      </>,
    );
    expect(screen.getByRole('searchbox', { name: 'Kısa' })).toHaveAttribute('data-size', 'sm');
    expect(screen.getByRole('searchbox', { name: 'Büyük' })).toHaveAttribute('data-size', 'md');
  });
});
