'use client';

import { CheckboxGroup } from '@base-ui/react/checkbox-group';
import type { ReactNode } from 'react';
import { cn } from '../lib/cn.js';
import { CheckboxCard } from './checkbox.js';
import type { ControlSize } from './control.js';
import { RadioCard, RadioGroup, repressClears } from './radio-group.js';

export type ChoiceListOption = {
  value: string;
  label: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
};

type ChoiceListCommon = {
  options: readonly ChoiceListOption[];
  /** Draws every option in the error colour, such as a required question left empty. */
  invalid?: boolean;
  disabled?: boolean;
  /** Card height, as the box controls': 32, 36 or 38px. Defaults to the ControlSizeProvider's, then md. */
  size?: ControlSize;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  className?: string;
};

export type ChoiceListProps = ChoiceListCommon &
  (
    | {
        multiple?: false;
        clearable?: false;
        value: string | null;
        onValueChange: (value: string) => void;
      }
    | {
        multiple?: false;
        /**
         * A press on the chosen option, or Space on it, takes the answer back, so an optional
         * question can be left empty again.
         */
        clearable: true;
        value: string | null;
        onValueChange: (value: string | null) => void;
      }
    | { multiple: true; value: readonly string[]; onValueChange: (value: string[]) => void }
  );

/**
 * A question's options as cards. Round marks take one answer and square marks (`multiple`)
 * take several, so the shape tells the reader which before they pick.
 */
export function ChoiceList(props: ChoiceListProps) {
  const { options, invalid = false, disabled = false, size, className } = props;
  const name = { 'aria-label': props['aria-label'], 'aria-labelledby': props['aria-labelledby'] };

  if (props.multiple) {
    const { onValueChange } = props;
    return (
      <CheckboxGroup
        data-slot="choice-list"
        {...name}
        value={[...props.value]}
        // Answers keep the options' order, whatever order they were ticked in
        onValueChange={(next) =>
          onValueChange(options.filter((o) => next.includes(o.value)).map((o) => o.value))
        }
        disabled={disabled}
        className={cn('flex flex-col gap-2', className)}
      >
        {options.map((option) => (
          <CheckboxCard
            key={option.value}
            value={option.value}
            label={option.label}
            description={option.description}
            disabled={option.disabled}
            invalid={invalid}
            size={size}
            aria-invalid={invalid || undefined}
          />
        ))}
      </CheckboxGroup>
    );
  }

  const { onValueChange } = props;
  const clear = props.clearable ? props.onValueChange : undefined;
  return (
    <RadioGroup
      {...name}
      aria-invalid={invalid || undefined}
      value={props.value}
      onValueChange={(next) => onValueChange(next as string)}
      onClick={clear ? repressClears(() => clear(null)) : undefined}
      disabled={disabled}
      className={className}
    >
      {options.map((option) => (
        <RadioCard
          key={option.value}
          value={option.value}
          label={option.label}
          description={option.description}
          disabled={option.disabled}
          invalid={invalid}
          size={size}
        />
      ))}
    </RadioGroup>
  );
}
