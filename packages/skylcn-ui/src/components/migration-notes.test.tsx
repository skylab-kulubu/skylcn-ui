import { act, render, renderHook, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it } from 'vitest';
import { SkylcnProvider } from '../lib/provider.js';
import { Notice } from './feedback.js';
import { Field, Textarea } from './field.js';
import { SkylabLoader } from './skylab-loader.js';
import { TaskPage } from './task-page.js';
import { ToastProvider, useToast } from './toast.js';

const wrap = ({ children }: { children: ReactNode }) => (
  <SkylcnProvider locale="tr">
    <ToastProvider>{children}</ToastProvider>
  </SkylcnProvider>
);

describe('useToast', () => {
  it('keeps errors until closed and gives toasts with an action ten seconds', () => {
    const { result } = renderHook(() => useToast(), { wrapper: wrap });
    act(() => {
      result.current.add({ title: 'Kaydedilemedi', type: 'error' });
      result.current.add({ title: 'Silindi', actionProps: { children: 'Geri al' } });
      result.current.add({ title: 'Kaydedildi', type: 'success' });
      result.current.add({ title: 'Özel', type: 'error', timeout: 3000 });
    });
    const byTitle = (title: string) => result.current.toasts.find((t) => t.title === title)!;
    expect(byTitle('Kaydedilemedi').timeout).toBe(0);
    expect(byTitle('Silindi').timeout).toBe(10_000);
    expect(byTitle('Kaydedildi').timeout).toBeUndefined();
    expect(byTitle('Özel').timeout).toBe(3000);
  });
});

describe('Notice', () => {
  it('leaves room for a close button only when there is one, and names it as asked', () => {
    const { container, rerender } = render(
      <SkylcnProvider locale="tr">
        <Notice title="Bakım" />
      </SkylcnProvider>,
    );
    expect(container.querySelector('[data-slot="notice"]')).not.toHaveClass('pr-10');
    rerender(
      <SkylcnProvider locale="tr">
        <Notice title="Bakım" onDismiss={() => undefined} dismissLabel="Duyuruyu kapat" />
      </SkylcnProvider>,
    );
    expect(container.querySelector('[data-slot="notice"]')).toHaveClass('pr-10');
    expect(screen.getByRole('button', { name: 'Duyuruyu kapat' })).toBeInTheDocument();
  });
});

describe('Textarea in a Field', () => {
  it('is named by the field label', () => {
    render(
      <Field label="Açıklama">
        <Textarea />
      </Field>,
    );
    expect(screen.getByRole('textbox', { name: 'Açıklama' })).toBeInTheDocument();
  });
});

describe('TaskPage', () => {
  it('passes role and aria attributes to its root', () => {
    render(
      <SkylcnProvider locale="tr">
        <TaskPage as="div" title="Giriş" aria-live="polite" data-testid="task" />
      </SkylcnProvider>,
    );
    expect(screen.getByTestId('task')).toHaveAttribute('aria-live', 'polite');
  });
});

describe('SkylabLoader', () => {
  it('carries no inline style, so a strict CSP allows it', () => {
    const { container } = render(<SkylabLoader size={80} />);
    expect(container.querySelectorAll('[style]')).toHaveLength(0);
    expect(container.querySelector('svg')).toHaveAttribute('width', '80');
  });
});

describe('SkylabLoader variants', () => {
  it('reveals by default and offers radiate and pulse, all without inline style', () => {
    const { container, rerender } = render(<SkylabLoader size={80} />);
    const root = () => container.querySelector('[data-slot="skylab-loader"]')!;
    expect(root()).toHaveClass('skylcn-loader', 'skylcn-loader-rich');
    expect(container.querySelector('[data-group]')).not.toBeNull();
    rerender(<SkylabLoader size={80} variant="radiate" />);
    expect(root()).toHaveClass('skylcn-loader-radiate');
    expect(root()).not.toHaveClass('skylcn-loader');
    expect(container.querySelector('[data-r]')).not.toBeNull();
    expect(container.querySelector('.skylcn-loader-metal')).toBeNull();
    rerender(<SkylabLoader size={20} variant="pulse" />);
    expect(root()).toHaveClass('skylcn-loader-pulse');
    expect(container.querySelectorAll('[style]')).toHaveLength(0);
    rerender(<SkylabLoader size={80} variant="pulse" state="done" />);
    expect(root()).not.toHaveClass('skylcn-loader-pulse');
  });
});
