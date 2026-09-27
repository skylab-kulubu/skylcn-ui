'use client';

import { ArrowRightLeft, ChevronLeft, ChevronRight, GripVertical } from 'lucide-react';
import { LayoutGroup, m } from 'motion/react';
import { Children, useEffect, useRef, useState, type ReactNode } from 'react';
import { cn } from '../lib/cn.js';
import { transitions } from '../lib/motion-tokens.js';
import { useSkylcn } from '../lib/provider.js';
import { IconButton } from './button.js';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, MenuItem } from './menu.js';

/* Carousel */

export type CarouselProps = {
  /** Names the carousel, such as "Etkinlik fotoğrafları". */
  'aria-label': string;
  children: ReactNode;
  /** Width of each slide, such as "85%" on phones or "20rem". */
  slideWidth?: string;
  className?: string;
};

/**
 * A row of slides that snaps as it scrolls: swiped on touch, stepped with the
 * buttons, dots or arrow keys. Scrolling itself moves it, so nothing
 * auto-plays or moves under the reader's pointer.
 */
export function Carousel({
  'aria-label': label,
  children,
  slideWidth = 'min(85%, 22rem)',
  className,
}: CarouselProps) {
  const { messages } = useSkylcn();
  const track = useRef<HTMLDivElement>(null);
  const slides = Children.toArray(children);
  const [index, setIndex] = useState(0);

  const [atEnd, setAtEnd] = useState(false);

  // The current slide is the one whose start is nearest the scroll position
  const sync = () => {
    const el = track.current;
    if (!el) return;
    let nearest = 0;
    let best = Infinity;
    el.querySelectorAll<HTMLElement>('[data-index]').forEach((slide) => {
      const distance = Math.abs(slide.offsetLeft - el.offsetLeft - el.scrollLeft);
      if (distance < best) {
        best = distance;
        nearest = Number(slide.dataset.index);
      }
    });
    setIndex(nearest);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 2);
  };

  useEffect(() => {
    sync();
  }, [slides.length]);

  const go = (i: number) => {
    const target = track.current?.querySelector<HTMLElement>(`[data-index="${i}"]`);
    target?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
  };

  return (
    <section
      aria-roledescription="carousel"
      aria-label={label}
      data-slot="carousel"
      className={cn('flex flex-col gap-3', className)}
    >
      <div
        ref={track}
        tabIndex={0}
        onScroll={sync}
        onKeyDown={(event) => {
          if (event.key === 'ArrowRight') {
            event.preventDefault();
            go(Math.min(index + 1, slides.length - 1));
          } else if (event.key === 'ArrowLeft') {
            event.preventDefault();
            go(Math.max(index - 1, 0));
          }
        }}
        className="scrollbar-hidden flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth rounded-xl outline-hidden focus-visible:ring-2 focus-visible:ring-ring motion-reduce:scroll-auto"
      >
        {slides.map((slide, i) => (
          <div
            key={i}
            data-index={i}
            role="group"
            aria-roledescription="slide"
            aria-label={messages.slideOf(i + 1, slides.length)}
            className="shrink-0 snap-start"
            style={{ width: slideWidth }}
          >
            {slide}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <IconButton
          icon={ChevronLeft}
          label={messages.previous}
          variant="ghost"
          size="icon-sm"
          disabled={index === 0}
          onClick={() => go(index - 1)}
        />
        <div className="flex flex-1 justify-center">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={messages.slideOf(i + 1, slides.length)}
              aria-current={i === index ? 'true' : undefined}
              onClick={() => go(i)}
              className="group grid h-6 min-w-6 place-items-center rounded-full outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span
                className={cn(
                  'h-1.5 rounded-full transition-[width,background-color] duration-(--motion-duration-base) ease-enter',
                  i === index
                    ? 'w-5 bg-skylab-400'
                    : 'w-1.5 bg-border-strong group-hover:bg-subtle-foreground',
                )}
              />
            </button>
          ))}
        </div>
        <IconButton
          icon={ChevronRight}
          label={messages.next}
          variant="ghost"
          size="icon-sm"
          disabled={atEnd || index === slides.length - 1}
          onClick={() => go(index + 1)}
        />
      </div>
    </section>
  );
}

/* Kanban */

export type KanbanColumn = { id: string; title: string };
export type KanbanCard = { id: string; column: string; title: ReactNode; meta?: ReactNode };

export type KanbanProps = {
  columns: readonly KanbanColumn[];
  cards: readonly KanbanCard[];
  /** Called with the card and its new column; the parent moves it. */
  onMove: (cardId: string, column: string) => void;
  'aria-label': string;
  /** Level of the column headings, one below the heading above the board. */
  headingLevel?: 2 | 3 | 4;
  className?: string;
};

/**
 * Cards in columns, such as event preparation tasks. Dragging moves a card
 * with the mouse, and every card also has a "Move" menu, so touch and
 * keyboard readers never need to drag.
 */
export function Kanban({
  columns,
  cards,
  onMove,
  'aria-label': label,
  headingLevel = 3,
  className,
}: KanbanProps) {
  const { messages } = useSkylcn();
  const Heading = `h${headingLevel}` as const;
  const [dragging, setDragging] = useState<string | null>(null);
  const [over, setOver] = useState<string | null>(null);

  return (
    <LayoutGroup>
      <div
        role="region"
        aria-label={label}
        data-slot="kanban"
        className={cn(
          'grid scrollbar auto-cols-[minmax(16rem,1fr)] grid-flow-col gap-3 overflow-x-auto pb-2',
          className,
        )}
      >
        {columns.map((column) => {
          const list = cards.filter((card) => card.column === column.id);
          return (
            <section
              key={column.id}
              aria-label={column.title}
              onDragOver={(event) => {
                event.preventDefault();
                setOver(column.id);
              }}
              onDragLeave={() => setOver((current) => (current === column.id ? null : current))}
              onDrop={(event) => {
                event.preventDefault();
                const id = event.dataTransfer.getData('text/plain');
                if (id) onMove(id, column.id);
                setOver(null);
                setDragging(null);
              }}
              className={cn(
                'flex min-h-40 flex-col gap-2 rounded-xl border border-border bg-card p-2 transition-colors duration-(--motion-duration-fast)',
                over === column.id && dragging && 'border-skylab-400/50 bg-skylab-500/5',
              )}
            >
              <Heading className="flex items-center justify-between px-1.5 pt-1 text-xs font-semibold text-foreground">
                {column.title}
                <span className="text-2xs font-normal text-subtle-foreground tabular-nums">
                  {list.length}
                </span>
              </Heading>
              <ul className="flex flex-col gap-2">
                {list.map((card) => (
                  <li
                    key={card.id}
                    draggable
                    onDragStart={(event) => {
                      event.dataTransfer.setData('text/plain', card.id);
                      setDragging(card.id);
                    }}
                    onDragEnd={() => {
                      setDragging(null);
                      setOver(null);
                    }}
                    className={cn(
                      'cursor-grab active:cursor-grabbing',
                      dragging === card.id && 'opacity-50',
                    )}
                  >
                    {/* The same layoutId in the next column lets the card glide across */}
                    <m.div
                      layoutId={card.id}
                      transition={{ layout: transitions.layout }}
                      className="group flex items-start gap-2 rounded-lg border border-border bg-background p-2.5 text-sm shadow-sm"
                    >
                      <GripVertical
                        className="mt-0.5 size-3.5 shrink-0 text-faint-foreground"
                        aria-hidden
                      />
                      <div className="min-w-0 flex-1">
                        <div className="text-foreground">{card.title}</div>
                        {card.meta ? (
                          <div className="mt-1 text-2xs text-muted-foreground">{card.meta}</div>
                        ) : null}
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={
                            <IconButton
                              icon={ArrowRightLeft}
                              label={messages.moveCard}
                              variant="ghost"
                              size="icon-sm"
                            />
                          }
                        />
                        <DropdownMenuContent align="end">
                          {columns
                            .filter((target) => target.id !== column.id)
                            .map((target) => (
                              <MenuItem key={target.id} onClick={() => onMove(card.id, target.id)}>
                                {target.title}
                              </MenuItem>
                            ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </m.div>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </LayoutGroup>
  );
}
