'use client';

import { Check, CircleAlert, File as FileIcon, LoaderCircle, ShieldAlert, X } from 'lucide-react';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { cn } from '../lib/cn.js';
import { useSkylcn, type SkylcnMessages } from '../lib/provider.js';
import { Button, IconButton } from './button.js';
import { Dropzone } from './display-extra.js';

export type FileUploadStatus = 'uploading' | 'scanning' | 'ready' | 'error';

/** A file as the app sees it; the app moves it through the states, the library draws them. */
export type FileUploadItem = {
  id: string;
  name: string;
  /** In bytes. */
  size: number;
  status: FileUploadStatus;
  /** 0 to 100 while uploading; leave it out when the length is unknown. */
  progress?: number;
  /** Why the file failed, said under its name; a general line when left out. */
  error?: ReactNode;
  /** Refused by a scan: drawn with a shield, as a security problem rather than a network one. */
  rejected?: boolean;
};

function formatSize(bytes: number, tag: string) {
  const number = (n: number) => new Intl.NumberFormat(tag, { maximumFractionDigits: 1 }).format(n);
  if (bytes >= 1024 * 1024) return `${number(bytes / 1024 / 1024)} MB`;
  return `${number(Math.max(1, Math.round(bytes / 1024)))} KB`;
}

function statusWords(file: FileUploadItem, messages: SkylcnMessages) {
  switch (file.status) {
    case 'uploading':
      return file.progress === undefined
        ? messages.uploading
        : messages.uploadProgress(Math.round(file.progress));
    case 'scanning':
      return messages.scanning;
    case 'ready':
      return messages.uploaded;
    case 'error':
      return messages.uploadFailed;
  }
}

export type FileRowProps = {
  file: FileUploadItem;
  onRemove?: () => void;
  onRetry?: () => void;
  /** Offers to swap a ready file, for a question that takes one. */
  onReplace?: () => void;
  /** Its own 64px box, as a single-file question shows it; otherwise a line in a list. */
  framed?: boolean;
  className?: string;
};

/** One file with where it stands: uploading with its progress, scanning, ready or failed. */
export function FileRow({
  file,
  onRemove,
  onRetry,
  onReplace,
  framed = false,
  className,
}: FileRowProps) {
  const { messages, locale } = useSkylcn();
  const working = file.status === 'uploading' || file.status === 'scanning';
  const failed = file.status === 'error';
  const progress =
    file.status === 'uploading' && file.progress !== undefined
      ? Math.min(100, Math.max(0, file.progress))
      : undefined;
  const Icon = working
    ? LoaderCircle
    : failed
      ? file.rejected
        ? ShieldAlert
        : CircleAlert
      : FileIcon;
  return (
    <div
      data-slot="file-row"
      data-status={file.status}
      className={cn(
        'relative flex min-h-16 items-center gap-3 overflow-hidden py-2.5',
        framed
          ? cn(
              'rounded-lg border px-3',
              failed
                ? 'border-destructive/30 bg-destructive/5'
                : 'border-border bg-input-background',
            )
          : 'px-1',
        className,
      )}
    >
      <span
        className={cn(
          'grid size-10 shrink-0 place-items-center rounded-md transition-colors duration-(--motion-duration-fast)',
          working
            ? 'bg-primary/15 text-primary'
            : failed
              ? 'bg-destructive/15 text-destructive'
              : 'bg-muted text-muted-foreground',
        )}
      >
        <Icon
          className={cn('size-4.5', working && 'animate-spin motion-reduce:animate-none')}
          aria-hidden
        />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground" title={file.name}>
          {file.name}
        </p>
        {failed ? (
          // A failure's reason is the news, so it takes the whole line in place of the size
          <p className="mt-0.5 text-2xs text-destructive-foreground">
            {file.error ?? statusWords(file, messages)}
          </p>
        ) : (
          <p className="mt-0.5 flex items-center gap-1.5 text-2xs text-subtle-foreground">
            <span className="tabular-nums">
              {formatSize(file.size, locale === 'tr' ? 'tr-TR' : 'en-US')}
            </span>
            <span aria-hidden className="size-0.5 rounded-full bg-current" />
            <span
              className={cn(
                'inline-flex min-w-0 items-center gap-1',
                working ? 'text-primary' : 'text-success',
              )}
            >
              {file.status === 'ready' ? <Check className="size-3" aria-hidden /> : null}
              {statusWords(file, messages)}
            </span>
          </p>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-1">
        {failed && onRetry ? (
          <Button size="sm" variant="outline" onClick={onRetry}>
            {messages.retry}
          </Button>
        ) : null}
        {file.status === 'ready' && onReplace ? (
          <Button size="sm" variant="ghost" onClick={onReplace}>
            {messages.replaceFile}
          </Button>
        ) : null}
        {onRemove ? (
          <IconButton
            icon={X}
            label={working ? messages.stopUpload(file.name) : messages.removeItem(file.name)}
            variant="ghost"
            size="icon-sm"
            onClick={onRemove}
          />
        ) : null}
      </div>
      {working ? (
        <span
          role="progressbar"
          aria-label={file.name}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
          aria-valuetext={statusWords(file, messages)}
          className="absolute inset-x-0 bottom-0 h-0.5 bg-muted"
        >
          <span
            className={cn(
              'block h-full bg-primary transition-[width] duration-(--motion-duration-base) ease-enter',
              progress === undefined && 'w-1/3 animate-pulse motion-reduce:animate-none',
            )}
            style={progress === undefined ? undefined : { width: `${progress}%` }}
          />
        </span>
      ) : null}
    </div>
  );
}

/** Says each change of state once, by name, so a screen reader hears the upload move along. */
function useStatusLine(files: readonly FileUploadItem[]) {
  const { messages } = useSkylcn();
  const seen = useRef<Map<string, FileUploadStatus> | null>(null);
  const [line, setLine] = useState('');
  useEffect(() => {
    const next = new Map(files.map((file) => [file.id, file.status]));
    const before = seen.current;
    seen.current = next;
    // Files already there when the part mounts are not news
    if (!before) return;
    const changed = files
      .filter((file) => before.get(file.id) !== file.status)
      .map((file) => {
        const words =
          file.status === 'error' && typeof file.error === 'string'
            ? file.error
            : file.status === 'uploading'
              ? messages.uploading
              : statusWords(file, messages);
        return `${file.name}: ${words}`;
      });
    if (changed.length) setLine(changed.join('. '));
  }, [files, messages]);
  return line;
}

export type FileUploadProps = {
  /** The files and their states, kept by the app as it uploads and checks them. */
  files: readonly FileUploadItem[];
  /** Files the reader picked or dropped; the app validates and uploads them. */
  onFiles: (files: File[]) => void;
  onRemove?: (id: string) => void;
  onRetry?: (id: string) => void;
  /** File types the picker offers, such as ".pdf,.zip". */
  accept?: string;
  /** The rules under the call to action, such as "PDF ya da ZIP, en fazla 10 MB". */
  rules?: ReactNode;
  multiple?: boolean;
  /** The most files a multiple upload takes; the drop area leaves once it is full. */
  maxFiles?: number;
  disabled?: boolean;
  /** Draws the drop area in the error colour, such as a required file left out. */
  invalid?: boolean;
  /** `compact` draws the drop area as one 64px row, the way a form question takes a file. */
  variant?: 'area' | 'compact';
  /** The file input's id, so a Field's label can name it. */
  id?: string;
  'aria-label'?: string;
  className?: string;
};

/**
 * Picking or dropping files, then each file's way through uploading, scanning and ready,
 * or failing with a reason and a retry. One file takes the drop area's place; several
 * line up under it.
 */
export function FileUpload({
  files,
  onFiles,
  onRemove,
  onRetry,
  accept,
  rules,
  multiple = false,
  maxFiles,
  disabled = false,
  invalid = false,
  variant = 'area',
  id,
  'aria-label': ariaLabel,
  className,
}: FileUploadProps) {
  const replace = useRef<HTMLInputElement>(null);
  const line = useStatusLine(files);
  const full = multiple ? maxFiles !== undefined && files.length >= maxFiles : files.length > 0;
  const only = multiple ? undefined : files[0];
  return (
    <div data-slot="file-upload" className={cn('flex flex-col gap-2', className)}>
      {full ? null : (
        <Dropzone
          id={id}
          aria-label={ariaLabel}
          variant={variant}
          accept={accept}
          multiple={multiple}
          hint={rules}
          disabled={disabled}
          invalid={invalid}
          onFiles={onFiles}
        />
      )}
      {only ? (
        <FileRow
          framed
          file={only}
          onRemove={onRemove && (() => onRemove(only.id))}
          onRetry={onRetry && (() => onRetry(only.id))}
          onReplace={disabled ? undefined : () => replace.current?.click()}
        />
      ) : null}
      {multiple && files.length ? (
        <ul className="flex flex-col divide-y divide-border-subtle border-y border-border-subtle">
          {files.map((file) => (
            <li key={file.id}>
              <FileRow
                file={file}
                onRemove={onRemove && (() => onRemove(file.id))}
                onRetry={onRetry && (() => onRetry(file.id))}
              />
            </li>
          ))}
        </ul>
      ) : null}
      {multiple ? null : (
        <input
          ref={replace}
          type="file"
          accept={accept}
          tabIndex={-1}
          aria-hidden
          className="hidden"
          onChange={(event) => {
            const picked = Array.from(event.target.files ?? []);
            if (picked.length) onFiles(picked.slice(0, 1));
            event.target.value = '';
          }}
        />
      )}
      <span aria-live="polite" className="sr-only">
        {line}
      </span>
    </div>
  );
}
