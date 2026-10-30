import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axeViolations } from '../test/axe.js';
import { FileUpload, type FileUploadItem } from './file-upload.js';

const MB = 1024 * 1024;
const cv = (
  status: FileUploadItem['status'],
  extra: Partial<FileUploadItem> = {},
): FileUploadItem => ({
  id: 'cv',
  name: 'cv.pdf',
  size: 1.2 * MB,
  status,
  ...extra,
});

describe('FileUpload', () => {
  it('hands picked files to the app and states the rules under the call to action', async () => {
    const user = userEvent.setup();
    const onFiles = vi.fn();
    render(
      <FileUpload
        files={[]}
        onFiles={onFiles}
        accept=".pdf"
        rules="PDF, en fazla 10 MB"
        aria-label="Özgeçmiş"
      />,
    );
    expect(screen.getByText('PDF, en fazla 10 MB')).toBeInTheDocument();
    const file = new File(['%PDF'], 'cv.pdf', { type: 'application/pdf' });
    await user.upload(screen.getByLabelText('Özgeçmiş'), file);
    expect(onFiles).toHaveBeenCalledWith([file]);
  });

  it('says where each file stands: uploading with progress, scanning, ready, failed', () => {
    render(
      <FileUpload
        multiple
        files={[
          cv('uploading', { id: 'a', name: 'a.pdf', progress: 42 }),
          cv('scanning', { id: 'b', name: 'b.pdf' }),
          cv('ready', { id: 'c', name: 'c.pdf' }),
          cv('error', { id: 'd', name: 'd.pdf', error: 'Bu dosya türüne izin verilmiyor.' }),
        ]}
        onFiles={() => undefined}
      />,
    );
    expect(screen.getByText('Yükleniyor %42')).toBeInTheDocument();
    expect(screen.getByRole('progressbar', { name: 'a.pdf' })).toHaveAttribute(
      'aria-valuenow',
      '42',
    );
    expect(screen.getByText('Taranıyor')).toBeInTheDocument();
    // Scanning has no length to report, so its bar carries no value
    expect(screen.getByRole('progressbar', { name: 'b.pdf' })).not.toHaveAttribute('aria-valuenow');
    expect(screen.getByText('Yüklendi')).toBeInTheDocument();
    expect(screen.getByText('Bu dosya türüne izin verilmiyor.')).toBeInTheDocument();
    expect(screen.getByText('1,2 MB', { selector: '[data-status="ready"] *' })).toBeInTheDocument();
  });

  it('retries a failed file, removes a ready one and offers to stop one still uploading', async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    const onRemove = vi.fn();
    render(
      <FileUpload
        multiple
        files={[
          cv('error', { id: 'bad' }),
          cv('ready', { id: 'ok', name: 'foto.jpg' }),
          cv('uploading', { id: 'up', name: 'video.mp4' }),
        ]}
        onFiles={() => undefined}
        onRetry={onRetry}
        onRemove={onRemove}
      />,
    );
    await user.click(screen.getByRole('button', { name: 'Tekrar dene' }));
    expect(onRetry).toHaveBeenCalledWith('bad');
    await user.click(screen.getByRole('button', { name: 'foto.jpg çıkar' }));
    expect(onRemove).toHaveBeenCalledWith('ok');
    await user.click(screen.getByRole('button', { name: 'video.mp4 yüklemesini durdur' }));
    expect(onRemove).toHaveBeenCalledWith('up');
  });

  it('puts a single file in the drop area’s place, offering to replace it once ready', async () => {
    const user = userEvent.setup();
    const click = vi.spyOn(HTMLInputElement.prototype, 'click');
    const { rerender } = render(
      <FileUpload files={[]} onFiles={() => undefined} aria-label="Görev dosyası" />,
    );
    expect(screen.getByLabelText('Görev dosyası')).toBeInTheDocument();
    rerender(
      <FileUpload files={[cv('ready')]} onFiles={() => undefined} aria-label="Görev dosyası" />,
    );
    expect(screen.queryByLabelText('Görev dosyası')).toBeNull();
    await user.click(screen.getByRole('button', { name: 'Değiştir' }));
    expect(click).toHaveBeenCalled();
    click.mockRestore();
  });

  it('lets the drop area leave once a multiple upload is full', () => {
    const files = [cv('ready', { id: '1' }), cv('ready', { id: '2', name: 'b.pdf' })];
    const { rerender } = render(
      <FileUpload
        multiple
        maxFiles={3}
        files={files}
        onFiles={() => undefined}
        aria-label="Ekler"
      />,
    );
    expect(screen.getByLabelText('Ekler')).toBeInTheDocument();
    rerender(
      <FileUpload
        multiple
        maxFiles={2}
        files={files}
        onFiles={() => undefined}
        aria-label="Ekler"
      />,
    );
    expect(screen.queryByLabelText('Ekler')).toBeNull();
  });

  it('tells screen readers when a file moves on, but not about the files it started with', () => {
    const { container, rerender } = render(
      <FileUpload multiple files={[cv('uploading', { progress: 10 })]} onFiles={() => undefined} />,
    );
    const live = container.querySelector('[aria-live="polite"]')!;
    expect(live).toHaveTextContent('');
    rerender(
      <FileUpload multiple files={[cv('uploading', { progress: 80 })]} onFiles={() => undefined} />,
    );
    expect(live).toHaveTextContent('');
    rerender(<FileUpload multiple files={[cv('scanning')]} onFiles={() => undefined} />);
    expect(live).toHaveTextContent('cv.pdf: Taranıyor');
    rerender(<FileUpload multiple files={[cv('ready')]} onFiles={() => undefined} />);
    expect(live).toHaveTextContent('cv.pdf: Yüklendi');
  });

  it('draws the compact row in the error colour while invalid', () => {
    const { container } = render(
      <FileUpload
        variant="compact"
        invalid
        files={[]}
        onFiles={() => undefined}
        aria-label="Görev"
      />,
    );
    expect(screen.getByLabelText('Görev')).toHaveAttribute('aria-invalid', 'true');
    expect(container.querySelector('[data-slot="dropzone"]')).toHaveClass(
      'h-16',
      'border-destructive/50',
    );
  });

  it('breaks no accessibility rules', async () => {
    const { container, unmount } = render(
      <FileUpload
        multiple
        files={[
          cv('uploading', { progress: 30 }),
          cv('error', { id: 'x', name: 'x.zip', rejected: true }),
        ]}
        onFiles={() => undefined}
        onRemove={() => undefined}
        onRetry={() => undefined}
        aria-label="Ekler"
        rules="PDF ya da ZIP"
      />,
    );
    expect(await axeViolations(container)).toEqual([]);
    unmount();
    const single = render(
      <FileUpload
        variant="compact"
        files={[cv('ready')]}
        onFiles={() => undefined}
        onRemove={() => undefined}
      />,
    );
    expect(await axeViolations(single.container)).toEqual([]);
  });
});
