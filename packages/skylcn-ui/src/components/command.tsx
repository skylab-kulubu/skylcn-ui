'use client';

import { Dialog as DialogPrimitive } from '@base-ui/react/dialog';
import { CornerDownLeft, Search, type LucideIcon } from 'lucide-react';
import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from 'react';
import { cn } from '../lib/cn.js';
import { useSkylcn } from '../lib/provider.js';
import { Kbd } from './feedback.js';

export type CommandItem = {
  id: string;
  label: string;
  group?: string;
  icon?: LucideIcon;
  /** Extra words that should find it, such as synonyms. */
  keywords?: string;
  shortcut?: ReactNode;
  /** A page to open; `onSelect` runs instead when given. */
  href?: string;
  onSelect?: () => void;
};

export type CommandPaletteProps = {
  items: readonly CommandItem[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Opens an href; defaults to a full page load. Pass the router's push in apps. */
  navigate?: (href: string) => void;
  placeholder?: string;
};

const fold = (text: string) =>
  text.toLocaleLowerCase('tr-TR').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/ı/g, 'i');

/** Opens the palette with Ctrl/⌘+K from anywhere, except while typing in an editor. */
export function useCommandShortcut(onOpen: () => void) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (
        target?.closest('input, textarea, select, [contenteditable=""], [contenteditable="true"]')
      )
        return;
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        onOpen();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onOpen]);
}

/**
 * A search box over every page and action of an app, opened with Ctrl/⌘+K.
 * Typing narrows the list (accents and dotless i ignored), arrows move,
 * Enter opens, Esc closes.
 */
export function CommandPalette({
  items,
  open,
  onOpenChange,
  navigate,
  placeholder,
}: CommandPaletteProps) {
  const { messages } = useSkylcn();
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const listId = useId();
  const listRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    const q = fold(query.trim());
    return q
      ? items.filter((item) =>
          fold(`${item.label} ${item.group ?? ''} ${item.keywords ?? ''}`).includes(q),
        )
      : items;
  }, [items, query]);

  const groups = useMemo(() => {
    const map = new Map<string, CommandItem[]>();
    for (const item of results) {
      const key = item.group ?? '';
      map.set(key, [...(map.get(key) ?? []), item]);
    }
    return [...map.entries()];
  }, [results]);

  useEffect(() => {
    listRef.current
      ?.querySelector(`[data-index="${active}"]`)
      ?.scrollIntoView({ block: 'nearest' });
  }, [active]);

  const run = (item: CommandItem) => {
    onOpenChange(false);
    if (item.onSelect) item.onSelect();
    else if (item.href) (navigate ?? ((href: string) => window.location.assign(href)))(item.href);
  };

  let index = -1;
  return (
    <DialogPrimitive.Root
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next);
        if (!next) {
          setQuery('');
          setActive(0);
        }
      }}
    >
      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop className="fixed inset-0 z-50 bg-black/50 transition-opacity duration-(--motion-duration-base) data-ending-style:opacity-0 data-starting-style:opacity-0" />
        <DialogPrimitive.Popup
          aria-label={messages.commandPalette}
          className={cn(
            'fixed top-[12vh] left-1/2 z-50 flex max-h-[70vh] w-[calc(100vw-2rem)] max-w-xl -translate-x-1/2 flex-col overflow-hidden rounded-xl border border-border bg-popover text-foreground shadow-overlay outline-hidden',
            'transition-[opacity,scale] duration-(--motion-duration-base) ease-enter data-ending-style:scale-(--motion-scale-from) data-ending-style:opacity-0 data-starting-style:scale-(--motion-scale-from) data-starting-style:opacity-0',
          )}
        >
          <div className="flex items-center gap-2 border-b border-border px-3">
            <Search className="size-4 shrink-0 text-subtle-foreground" aria-hidden />
            <input
              autoFocus
              role="combobox"
              aria-expanded
              aria-controls={listId}
              aria-activedescendant={results.length ? `${listId}-${active}` : undefined}
              aria-label={placeholder ?? messages.commandPalette}
              value={query}
              placeholder={placeholder ?? messages.searchEverything}
              onChange={(event) => {
                setQuery(event.target.value);
                setActive(0);
              }}
              onKeyDown={(event) => {
                if (event.key === 'ArrowDown') {
                  event.preventDefault();
                  setActive((i) => Math.min(i + 1, results.length - 1));
                } else if (event.key === 'ArrowUp') {
                  event.preventDefault();
                  setActive((i) => Math.max(i - 1, 0));
                } else if (event.key === 'Enter' && results[active]) {
                  event.preventDefault();
                  run(results[active]!);
                }
              }}
              className="h-12 min-w-0 flex-1 bg-transparent text-sm outline-hidden placeholder:text-subtle-foreground pointer-coarse:text-base"
            />
            <Kbd>Esc</Kbd>
          </div>
          <div
            ref={listRef}
            id={listId}
            role="listbox"
            className="scrollbar min-h-0 flex-1 overflow-y-auto p-1.5"
          >
            {results.length === 0 ? (
              <p className="px-3 py-8 text-center text-xs text-muted-foreground">
                {messages.noResults}
              </p>
            ) : (
              groups.map(([group, groupItems]) => (
                <div
                  key={group || 'none'}
                  role="group"
                  aria-label={group || undefined}
                  className="pb-1"
                >
                  {group ? (
                    <p className="px-2 pt-2 pb-1 text-3xs font-medium tracking-label text-subtle-foreground uppercase">
                      {group}
                    </p>
                  ) : null}
                  {groupItems.map((item) => {
                    index += 1;
                    const i = index;
                    const Icon = item.icon;
                    const on = i === active;
                    return (
                      <div
                        key={item.id}
                        id={`${listId}-${i}`}
                        role="option"
                        aria-selected={on}
                        data-index={i}
                        onPointerMove={() => setActive(i)}
                        onClick={() => run(item)}
                        className={cn(
                          'flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-2 text-sm pointer-coarse:py-2.5',
                          on ? 'bg-accent text-foreground-strong' : 'text-secondary-foreground',
                        )}
                      >
                        {Icon ? (
                          <Icon className="size-4 shrink-0 text-subtle-foreground" aria-hidden />
                        ) : null}
                        <span className="min-w-0 flex-1 truncate">{item.label}</span>
                        {item.shortcut ? (
                          <span className="shrink-0 text-3xs text-subtle-foreground">
                            {item.shortcut}
                          </span>
                        ) : null}
                        {on ? (
                          <CornerDownLeft
                            className="size-3.5 shrink-0 text-subtle-foreground"
                            aria-hidden
                          />
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              ))
            )}
          </div>
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
