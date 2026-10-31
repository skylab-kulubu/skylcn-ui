'use client';

import { GripVertical } from 'lucide-react';
import { animate, m, useMotionValue } from 'motion/react';
import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
} from 'react';
import { cn } from '../lib/cn.js';
import { transitions } from '../lib/motion-tokens.js';
import { useSkylcn } from '../lib/provider.js';
import { useReducedMotion } from '../lib/use-reduced-motion.js';

export type SortableListProps<T> = {
  items: readonly T[];
  getId: (item: T) => string;
  /** The item's name, said on its handle and when it moves. */
  getLabel: (item: T) => string;
  /** The new order, once a drag ends or a key moves an item. */
  onReorder: (items: T[]) => void;
  renderItem: (item: T) => ReactNode;
  disabled?: boolean;
  'aria-label'?: string;
  className?: string;
};

type Drag = {
  id: string;
  pointer: number;
  listTop: number;
  grab: number;
  from: string[];
  order: string[];
};

function move<T>(list: readonly T[], from: number, to: number) {
  const next = [...list];
  next.splice(to, 0, next.splice(from, 1)[0]!);
  return next;
}

/**
 * A list put in order by dragging each row by its handle, or with the arrow keys on the
 * handle; the other rows glide out of the way and the new place is said to screen readers.
 */
export function SortableList<T>({
  items,
  getId,
  getLabel,
  onReorder,
  renderItem,
  disabled = false,
  'aria-label': ariaLabel,
  className,
}: SortableListProps<T>) {
  const { messages } = useSkylcn();
  const reduced = useReducedMotion();
  const hintId = useId();
  const list = useRef<HTMLUListElement>(null);
  const rows = useRef(new Map<string, HTMLLIElement>());
  const handles = useRef(new Map<string, HTMLButtonElement>());
  const drag = useRef<Drag | null>(null);
  const refocus = useRef<string | null>(null);
  const y = useMotionValue(0);
  const [order, setOrder] = useState<string[] | null>(null);
  const [dragging, setDragging] = useState<string | null>(null);
  const [said, setSaid] = useState('');

  const byId = new Map(items.map((item) => [getId(item), item]));
  const ids = order ?? items.map(getId);
  const shown = ids.flatMap((id) => (byId.has(id) ? [byId.get(id)!] : []));

  // The dragged row sits where the pointer holds it, measured from its place in the new order
  const follow = () => {
    const state = drag.current;
    const row = state && rows.current.get(state.id);
    if (!state || !row) return;
    y.set(state.pointer - state.listTop - state.grab - row.offsetTop);
  };
  useLayoutEffect(follow);

  // Moving a focused node in the DOM can drop its focus, so the moved handle takes it back
  useLayoutEffect(() => {
    const id = refocus.current;
    if (!id) return;
    refocus.current = null;
    handles.current.get(id)?.focus();
  });

  useEffect(() => () => y.stop(), [y]);

  // Esc puts a dragged row back, wherever focus is
  useEffect(() => {
    if (!dragging) return;
    const cancel = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') end(true);
    };
    document.addEventListener('keydown', cancel);
    return () => document.removeEventListener('keydown', cancel);
  });

  const announce = (id: string, position: number) => {
    const item = byId.get(id);
    if (item) setSaid(messages.movedTo(getLabel(item), position + 1, items.length));
  };

  const start = (event: PointerEvent<HTMLButtonElement>, id: string) => {
    if (disabled || event.button !== 0) return;
    const row = rows.current.get(id);
    const box = list.current;
    if (!row || !box) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    const listTop = box.getBoundingClientRect().top;
    drag.current = {
      id,
      pointer: event.clientY,
      listTop,
      grab: event.clientY - listTop - row.offsetTop,
      from: ids,
      order: ids,
    };
    setOrder(ids);
    setDragging(id);
  };

  const moveTo = (event: PointerEvent<HTMLButtonElement>) => {
    const state = drag.current;
    if (!state) return;
    state.pointer = event.clientY;
    const row = rows.current.get(state.id)!;
    const center = state.pointer - state.listTop - state.grab + row.offsetHeight / 2;
    const current = state.order;
    const others = current.filter((id) => id !== state.id);
    const index = others.filter((id) => {
      const other = rows.current.get(id);
      return other ? other.offsetTop + other.offsetHeight / 2 < center : false;
    }).length;
    if (current.indexOf(state.id) === index) return follow();
    state.order = move(current, current.indexOf(state.id), index);
    setOrder(state.order);
  };

  const end = (cancel = false) => {
    const state = drag.current;
    if (!state) return;
    drag.current = null;
    const final = cancel ? state.from : state.order;
    setOrder(null);
    setDragging(null);
    // The row eases from where it was let go into its slot
    if (reduced) y.set(0);
    else animate(y, 0, transitions.layout);
    if (!cancel && final.join() !== state.from.join()) {
      onReorder(final.flatMap((id) => (byId.has(id) ? [byId.get(id)!] : [])));
      announce(state.id, final.indexOf(state.id));
    }
  };

  const keyMove = (event: KeyboardEvent<HTMLButtonElement>, id: string) => {
    if (disabled || drag.current) return;
    const step = event.key === 'ArrowUp' ? -1 : event.key === 'ArrowDown' ? 1 : 0;
    if (!step) return;
    event.preventDefault();
    const from = ids.indexOf(id);
    const to = from + step;
    if (to < 0 || to >= ids.length) return;
    refocus.current = id;
    onReorder(move(shown, from, to));
    announce(id, to);
  };

  return (
    <>
      <ul
        ref={list}
        data-slot="sortable-list"
        aria-label={ariaLabel}
        className={cn('relative flex flex-col', className)}
      >
        {shown.map((item) => {
          const id = getId(item);
          const lifted = dragging === id;
          return (
            <m.li
              key={id}
              ref={(node) => {
                if (node) rows.current.set(id, node);
                else rows.current.delete(id);
              }}
              layout={lifted ? false : 'position'}
              transition={{ layout: transitions.layout }}
              style={lifted ? { y } : undefined}
              data-dragging={lifted || undefined}
              className={cn(
                'relative flex items-center gap-2 border-b border-border-subtle py-2 pr-2 last:border-b-0',
                'data-dragging:z-10 data-dragging:rounded-md data-dragging:border data-dragging:border-border-strong data-dragging:bg-popover data-dragging:shadow-overlay',
              )}
            >
              <button
                ref={(node) => {
                  if (node) handles.current.set(id, node);
                  else handles.current.delete(id);
                }}
                type="button"
                aria-label={messages.moveItem(getLabel(item))}
                aria-describedby={hintId}
                disabled={disabled}
                onPointerDown={(event) => start(event, id)}
                onPointerMove={moveTo}
                onPointerUp={() => end()}
                onPointerCancel={() => end(true)}
                onKeyDown={(event) => keyMove(event, id)}
                className={cn(
                  'grid size-7 shrink-0 cursor-grab touch-none place-items-center rounded-md text-subtle-foreground outline-hidden',
                  'transition-colors duration-(--motion-duration-fast) hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring',
                  'active:cursor-grabbing disabled:cursor-not-allowed disabled:opacity-40 pointer-coarse:size-9',
                )}
              >
                <GripVertical aria-hidden className="size-4" />
              </button>
              <div className="min-w-0 flex-1">{renderItem(item)}</div>
            </m.li>
          );
        })}
      </ul>
      <span id={hintId} hidden>
        {messages.sortHint}
      </span>
      <span aria-live="polite" className="sr-only">
        {said}
      </span>
    </>
  );
}
