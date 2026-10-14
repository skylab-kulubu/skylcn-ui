import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
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

describe('ConfirmDialog reopened by its parent', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  function controlled(props: Partial<Parameters<typeof ConfirmDialog>[0]>) {
    const view = (open: boolean) => (
      <SkylcnProvider locale="tr">
        <ConfirmDialog
          open={open}
          onOpenChange={() => undefined}
          title="Oturum silinsin mi?"
          actionLabel="Oturumu sil"
          onAction={() => undefined}
          {...props}
        />
      </SkylcnProvider>
    );
    const { rerender } = render(view(true));
    return (open: boolean) => rerender(view(open));
  }

  it('starts clean when the parent opens it again after a failure', async () => {
    const work = deferred();
    const setOpen = controlled({ onAction: () => work.promise });
    fireEvent.click(action());
    await act(async () => work.reject('409'));
    expect(screen.getByRole('alert')).toBeInTheDocument();
    setOpen(false);
    setOpen(true);
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('is not left pending by a late answer after the reader left a stalled dialog', async () => {
    const work = deferred();
    const setOpen = controlled({ onAction: () => work.promise, stallAfter: 1000 });
    fireEvent.click(action());
    await act(async () => vi.advanceTimersByTime(1000));
    fireEvent.click(cancelButton());
    setOpen(false);
    await act(async () => work.resolve());
    setOpen(true);
    await act(async () => vi.advanceTimersByTime(500));
    expect(action()).toBeEnabled();
    expect(action()).not.toHaveAttribute('aria-busy');
    expect(cancelButton()).toBeEnabled();
  });

  it('stalls a parent-run pending too, with the page’s own wording', async () => {
    controlled({
      pending: true,
      stallAfter: 1000,
      stallMessage: 'Yanıt gecikti; birazdan tekrar bak.',
    });
    expect(cancelButton()).toBeDisabled();
    await act(async () => vi.advanceTimersByTime(1000));
    expect(screen.getByRole('status')).toHaveTextContent('Yanıt gecikti');
    expect(cancelButton()).toBeEnabled();
  });

  it('puts the keyboard on Cancel when the action fails', async () => {
    const work = deferred();
    controlled({ onAction: () => work.promise });
    fireEvent.click(action());
    await act(async () => work.reject('500'));
    expect(cancelButton()).toHaveFocus();
  });
});

describe('ConfirmDialog finalFocus', () => {
  function opened(props: Partial<Parameters<typeof ConfirmDialog>[0]> = {}) {
    render(
      <SkylcnProvider locale="tr">
        <button type="button">Sezon ekle</button>
        <ConfirmDialog
          trigger={<button type="button">Düzenle</button>}
          title="Sezon silinsin mi?"
          actionLabel="Oturumu sil"
          onAction={() => undefined}
          {...props}
        />
      </SkylcnProvider>,
    );
    const trigger = screen.getByRole('button', { name: 'Düzenle' });
    const other = screen.getByRole('button', { name: 'Sezon ekle' });
    trigger.focus();
    fireEvent.click(trigger);
    return { trigger, other };
  }

  async function closeWithCancel() {
    await waitFor(() => expect(cancelButton()).toHaveFocus());
    fireEvent.click(cancelButton());
    await waitFor(() => expect(screen.queryByRole('alertdialog')).toBeNull());
  }

  it('returns focus to the trigger by default', async () => {
    const { trigger } = opened();
    await closeWithCancel();
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it('leaves focus alone with finalFocus={false}', async () => {
    const { trigger } = opened({ finalFocus: false });
    await closeWithCancel();
    expect(trigger).not.toHaveFocus();
  });

  it('asks a function where focus goes on close', async () => {
    const finalFocus = vi.fn(() => false);
    const { trigger } = opened({ finalFocus });
    await closeWithCancel();
    expect(finalFocus).toHaveBeenCalled();
    expect(trigger).not.toHaveFocus();
  });

  it('moves focus to the element a ref points at', async () => {
    const target = { current: null as HTMLElement | null };
    const { trigger, other } = opened({ finalFocus: target });
    target.current = other;
    await closeWithCancel();
    await waitFor(() => expect(target.current).toHaveFocus());
    expect(trigger).not.toHaveFocus();
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
