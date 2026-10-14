import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { SkylcnProvider } from '../lib/provider.js';
import { CoverImage } from './cover-image.js';
import { ConfirmDialog } from './dialog.js';

function deferred() {
  let resolve!: () => void;
  let reject!: (error: unknown) => void;
  const promise = new Promise<void>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

function draw(props: Partial<Parameters<typeof ConfirmDialog>[0]> = {}) {
  const onOpenChange = vi.fn();
  render(
    <SkylcnProvider locale="tr">
      <ConfirmDialog
        open
        onOpenChange={onOpenChange}
        title="Oturum silinsin mi?"
        actionLabel="Oturumu sil"
        onAction={() => undefined}
        destructive
        {...props}
      />
    </SkylcnProvider>,
  );
  return { onOpenChange };
}

const action = () => screen.getByRole('button', { name: 'Oturumu sil' });
const cancelButton = () => screen.getByRole('button', { name: 'Vazgeç' });

describe('ConfirmDialog with an async action', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('locks Cancel while the action runs and closes only on success', async () => {
    const work = deferred();
    const { onOpenChange } = draw({ onAction: () => work.promise });
    fireEvent.click(action());
    expect(cancelButton()).toBeDisabled();
    expect(onOpenChange).not.toHaveBeenCalledWith(false);
    await act(async () => work.resolve());
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('says why inside the dialog when the action throws, and stays open', async () => {
    const work = deferred();
    const { onOpenChange } = draw({
      onAction: () => work.promise,
      failureMessage: (error) => `Silinemedi: ${String(error)}`,
    });
    fireEvent.click(action());
    await act(async () => work.reject('409'));
    expect(screen.getByRole('alert')).toHaveTextContent('Silinemedi: 409');
    expect(cancelButton()).toBeEnabled();
    expect(onOpenChange).not.toHaveBeenCalledWith(false);
  });

  it('lets the reader leave once the server stalls, and reports a late refusal', async () => {
    const work = deferred();
    const onLateFailure = vi.fn();
    const { onOpenChange } = draw({
      onAction: () => work.promise,
      stallAfter: 1000,
      onLateFailure,
    });
    fireEvent.click(action());
    await act(async () => vi.advanceTimersByTime(1000));
    expect(screen.getByRole('status')).toHaveTextContent('Sunucu yanıt vermedi');
    expect(cancelButton()).toBeEnabled();
    fireEvent.click(cancelButton());
    expect(onOpenChange).toHaveBeenCalledWith(false);
    await act(async () => work.reject('500'));
    expect(onLateFailure).toHaveBeenCalledWith('500');
  });

  it('runs the action once for a double click', () => {
    const onAction = vi.fn(() => deferred().promise);
    draw({ onAction });
    fireEvent.click(action());
    fireEvent.click(action());
    expect(onAction).toHaveBeenCalledTimes(1);
  });
});

describe('CoverImage', () => {
  it('shows the whole image over a blurred copy, in a frame with no inline style', () => {
    const { container } = render(
      <CoverImage src="/kapak.jpg" alt="Gecekodu afişi" ratio="video" />,
    );
    const [backdrop, image] = container.querySelectorAll('img');
    expect(backdrop).toHaveAttribute('aria-hidden', 'true');
    expect(backdrop).toHaveAttribute('alt', '');
    expect(image).toHaveAttribute('alt', 'Gecekodu afişi');
    expect(image).toHaveClass('object-contain');
    expect(container.querySelector('[data-slot="cover-image"]')).toHaveClass('aspect-video');
    expect(container.querySelectorAll('[style]')).toHaveLength(0);
  });
});
