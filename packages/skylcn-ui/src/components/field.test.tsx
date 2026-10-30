import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axeViolations } from '../test/axe.js';
import { Field, Input, Textarea } from './field.js';

describe('Field as a question', () => {
  it('sets a numbered question with its description before the control and its hint after', () => {
    const { container } = render(
      <Field
        variant="question"
        number={3}
        label="Hangi bölümde okuyorsun?"
        description="Kayıtlı olduğun bölüm."
        hint="Zorunlu alan"
        required
      >
        <Input />
      </Field>,
    );
    expect(container.querySelector('[data-slot="field-number"]')).toHaveTextContent('3');
    const input = screen.getByRole('textbox', { name: 'Hangi bölümde okuyorsun?' });
    expect(screen.getByText('Kayıtlı olduğun bölüm.').compareDocumentPosition(input)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
    expect(input.compareDocumentPosition(screen.getByText('Zorunlu alan'))).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
    expect(screen.getByText('*')).toHaveAttribute('aria-hidden', 'true');
  });

  it('turns the number red and puts the error in the hint’s place while invalid', () => {
    const { container } = render(
      <Field
        variant="question"
        number={3}
        label="Bölüm"
        hint="Zorunlu alan"
        error="Bu soru zorunlu"
      >
        <Input />
      </Field>,
    );
    expect(container.querySelector('[data-slot="field-number"]')).toHaveClass(
      'text-destructive-foreground',
    );
    expect(screen.queryByText('Zorunlu alan')).toBeNull();
    expect(screen.getByText('Bu soru zorunlu')).toBeInTheDocument();
  });

  it('breaks no accessibility rules', async () => {
    render(
      <Field variant="question" number={1} label="Adın" description="Kartında yazan." required>
        <Input required />
      </Field>,
    );
    expect(await axeViolations()).toEqual([]);
  });
});

describe('Input', () => {
  it('fills a read-only box so it reads as set rather than waiting for input', () => {
    render(<Input aria-label="Ad" value="Deniz Aydın" readOnly />);
    expect(screen.getByRole('textbox', { name: 'Ad' })).toHaveClass('bg-muted');
  });
});

describe('Textarea with a count', () => {
  it('counts the characters against maxLength and warns near the limit', () => {
    render(<Textarea aria-label="Not" showCount maxLength={10} />);
    expect(screen.getByText('0/10')).toBeInTheDocument();
    fireEvent.change(screen.getByRole('textbox', { name: 'Not' }), {
      target: { value: 'merhaba d' },
    });
    expect(screen.getByText('9/10')).toHaveClass('text-warning');
  });
});
