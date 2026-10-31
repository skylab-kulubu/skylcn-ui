'use client';

import {
  ChevronRight,
  File,
  FileCode,
  FileImage,
  FileJson,
  FileText,
  Folder,
  FolderOpen,
  type LucideIcon,
} from 'lucide-react';
import { useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { cn } from '../lib/cn.js';
import { Collapse } from './motion.js';

export type TreeNode = {
  id: string;
  label: ReactNode;
  icon?: LucideIcon;
  /** Shown at the end of the row, such as a member count. */
  meta?: ReactNode;
  children?: readonly TreeNode[];
};

export type TreeProps = {
  nodes: readonly TreeNode[];
  'aria-label': string;
  selected?: string | null;
  onSelect?: (id: string) => void;
  /** Branches open at first. */
  defaultExpanded?: readonly string[];
  /**
   * Draws a project's files: branches get a folder that opens with them and leaves an icon
   * by their extension, unless a node brings its own.
   */
  files?: boolean;
  /** Lines down each level, so deep rows show which branch they hang from. */
  guides?: boolean;
  className?: string;
};

const FILE_ICONS: [RegExp, LucideIcon][] = [
  [
    /\.(tsx?|jsx?|mjs|cjs|go|py|rs|java|kt|c|cpp|h|cs|php|rb|swift|sh|css|scss|html|vue|svelte)$/i,
    FileCode,
  ],
  [/\.(json|jsonc|ya?ml|toml)$/i, FileJson],
  [/\.(md|mdx|txt|pdf|docx?)$/i, FileText],
  [/\.(png|jpe?g|gif|svg|webp|avif|ico)$/i, FileImage],
];

function fileIcon(node: TreeNode, branch: boolean, open: boolean): LucideIcon {
  if (branch) return open ? FolderOpen : Folder;
  const name = typeof node.label === 'string' ? node.label : '';
  return FILE_ICONS.find(([pattern]) => pattern.test(name))?.[1] ?? File;
}

type Flat = { node: TreeNode; depth: number; parent: string | null };

/**
 * Nested items, such as Keycloak groups or folders. One row takes Tab; arrows
 * move, Right opens or steps in, Left closes or steps out, Home and End jump,
 * Enter picks.
 */
export function Tree({
  nodes,
  'aria-label': label,
  selected = null,
  onSelect,
  defaultExpanded = [],
  files = false,
  guides = false,
  className,
}: TreeProps) {
  const [expanded, setExpanded] = useState<ReadonlySet<string>>(new Set(defaultExpanded));
  const [focused, setFocused] = useState<string | null>(selected ?? nodes[0]?.id ?? null);
  const refs = useRef(new Map<string, HTMLDivElement>());

  // The rows a reader can reach right now, in order: children of open branches only.
  const visible = useMemo(() => {
    const out: Flat[] = [];
    const walk = (list: readonly TreeNode[], depth: number, parent: string | null) => {
      for (const node of list) {
        out.push({ node, depth, parent });
        if (node.children?.length && expanded.has(node.id)) walk(node.children, depth + 1, node.id);
      }
    };
    walk(nodes, 0, null);
    return out;
  }, [nodes, expanded]);

  const toggle = (id: string, open?: boolean) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (open ?? !next.has(id)) next.add(id);
      else next.delete(id);
      return next;
    });

  const focus = (id: string) => {
    setFocused(id);
    refs.current.get(id)?.focus();
  };

  const onKeyDown = (event: KeyboardEvent, flat: Flat) => {
    const i = visible.findIndex((row) => row.node.id === flat.node.id);
    const branch = Boolean(flat.node.children?.length);
    const open = expanded.has(flat.node.id);
    const keys: Record<string, () => void> = {
      ArrowDown: () => visible[i + 1] && focus(visible[i + 1]!.node.id),
      ArrowUp: () => visible[i - 1] && focus(visible[i - 1]!.node.id),
      ArrowRight: () => {
        if (branch && !open) toggle(flat.node.id, true);
        else if (branch) focus(flat.node.children![0]!.id);
      },
      ArrowLeft: () => {
        if (branch && open) toggle(flat.node.id, false);
        else if (flat.parent) focus(flat.parent);
      },
      Home: () => visible[0] && focus(visible[0].node.id),
      End: () => visible.at(-1) && focus(visible.at(-1)!.node.id),
      Enter: () => (onSelect ? onSelect(flat.node.id) : branch && toggle(flat.node.id)),
      ' ': () => (onSelect ? onSelect(flat.node.id) : branch && toggle(flat.node.id)),
    };
    const action = keys[event.key];
    if (action) {
      event.preventDefault();
      action();
    }
  };

  const renderLevel = (
    list: readonly TreeNode[],
    depth: number,
    parent: string | null,
  ): ReactNode =>
    list.map((node) => {
      const branch = Boolean(node.children?.length);
      const open = expanded.has(node.id);
      const Icon = node.icon ?? (files ? fileIcon(node, branch, open) : undefined);
      const flat = { node, depth, parent };
      return (
        <li key={node.id} role="none">
          <div
            ref={(el) => {
              if (el) refs.current.set(node.id, el);
              else refs.current.delete(node.id);
            }}
            role="treeitem"
            aria-expanded={branch ? open : undefined}
            aria-selected={onSelect ? selected === node.id : undefined}
            aria-level={depth + 1}
            tabIndex={focused === node.id ? 0 : -1}
            onFocus={() => setFocused(node.id)}
            onKeyDown={(event) => onKeyDown(event, flat)}
            onClick={() => {
              setFocused(node.id);
              if (branch) toggle(node.id);
              onSelect?.(node.id);
            }}
            className={cn(
              'flex cursor-pointer items-center gap-2 rounded-md py-1.5 pr-2 pl-2 text-sm outline-hidden select-none pointer-coarse:py-2.5',
              'transition-colors duration-(--motion-duration-instant) focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset',
              selected === node.id
                ? 'bg-skylab-500/10 text-foreground-strong'
                : 'text-secondary-foreground hover:bg-accent',
            )}
          >
            {/* One step per level instead of an inline padding; each step can carry the level's line */}
            {Array.from({ length: depth }, (_, level) => (
              <span
                key={level}
                aria-hidden
                className={cn(
                  '-my-1.5 -mr-2 w-5 shrink-0 self-stretch pointer-coarse:-my-2.5',
                  guides && 'ml-1.5 w-3.5 border-l border-border-subtle',
                )}
              />
            ))}
            <ChevronRight
              aria-hidden
              className={cn(
                'size-3.5 shrink-0 text-subtle-foreground transition-transform duration-(--motion-duration-base) ease-enter',
                open && 'rotate-90',
                !branch && 'invisible',
              )}
            />
            {Icon ? (
              <Icon
                className={cn(
                  'size-4 shrink-0 text-subtle-foreground',
                  files && branch && 'text-skylab-300',
                )}
                aria-hidden
              />
            ) : null}
            <span className="min-w-0 flex-1 truncate">{node.label}</span>
            {node.meta ? (
              <span className="shrink-0 text-2xs text-subtle-foreground tabular-nums">
                {node.meta}
              </span>
            ) : null}
          </div>
          {branch ? (
            <Collapse open={open}>
              <ul role="group">{renderLevel(node.children!, depth + 1, node.id)}</ul>
            </Collapse>
          ) : null}
        </li>
      );
    });

  return (
    <ul role="tree" aria-label={label} data-slot="tree" className={cn('flex flex-col', className)}>
      {renderLevel(nodes, 0, null)}
    </ul>
  );
}
