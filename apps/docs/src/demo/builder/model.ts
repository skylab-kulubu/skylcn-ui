/**
 * The page builder's document: sections stacked down the page, each split into
 * columns by a layout, each column a stack of blocks. Kept in memory only.
 */

export type BlockProps = Record<string, string | number | boolean>;
export type Block = { id: string; type: string; props: BlockProps };

export type LayoutKey = '1' | '2' | '3' | '4' | '2-1' | '1-2';
export type Section = { id: string; layout: LayoutKey; columns: Block[][] };
export type Page = { sections: Section[] };

export type LayoutInfo = {
  label: string;
  columns: number;
  /** Classes for the preview, which answers its own width through container queries. */
  preview: string;
  /** Classes for the exported page, which answers the viewport. */
  code: string;
};

export const LAYOUTS: Record<LayoutKey, LayoutInfo> = {
  '1': { label: 'Tek sütun', columns: 1, preview: '', code: '' },
  '2': { label: 'İki eşit', columns: 2, preview: '@2xl:grid-cols-2', code: 'md:grid-cols-2' },
  '3': { label: 'Üç eşit', columns: 3, preview: '@4xl:grid-cols-3', code: 'lg:grid-cols-3' },
  '4': {
    label: 'Dört eşit',
    columns: 4,
    preview: '@md:grid-cols-2 @4xl:grid-cols-4',
    code: 'sm:grid-cols-2 lg:grid-cols-4',
  },
  '2-1': {
    label: 'Geniş + dar',
    columns: 2,
    preview: '@3xl:grid-cols-[2fr_1fr]',
    code: 'lg:grid-cols-[2fr_1fr]',
  },
  '1-2': {
    label: 'Dar + geniş',
    columns: 2,
    preview: '@3xl:grid-cols-[1fr_2fr]',
    code: 'lg:grid-cols-[1fr_2fr]',
  },
};

export const LAYOUT_ORDER: LayoutKey[] = ['1', '2', '3', '4', '2-1', '1-2'];

/** Where a selection or a new block points: a block, or a column of a section. */
export type Target = { sectionId: string; column: number; blockId?: string };

let counter = 0;
export const newId = (prefix: string) => `${prefix}-${Date.now().toString(36)}-${(counter += 1)}`;

export function section(layout: LayoutKey, columns?: Block[][]): Section {
  const count = LAYOUTS[layout].columns;
  return {
    id: newId('s'),
    layout,
    columns: Array.from({ length: count }, (_, i) => columns?.[i] ?? []),
  };
}

export function block(type: string, props: BlockProps): Block {
  return { id: newId('b'), type, props };
}

export type Action =
  | { type: 'load'; page: Page }
  | { type: 'addSection'; layout: LayoutKey; index?: number }
  | { type: 'removeSection'; sectionId: string }
  | { type: 'moveSection'; sectionId: string; step: -1 | 1 }
  | { type: 'setLayout'; sectionId: string; layout: LayoutKey }
  | { type: 'addBlock'; target: Target; block: Block }
  | { type: 'updateBlock'; blockId: string; props: BlockProps }
  | { type: 'removeBlock'; blockId: string }
  | { type: 'duplicateBlock'; blockId: string }
  | { type: 'moveBlock'; blockId: string; step: -1 | 1 }
  | { type: 'moveBlockAcross'; blockId: string; step: -1 | 1 }
  | { type: 'placeBlock'; blockId: string; target: Target };

function locate(page: Page, blockId: string) {
  for (const s of page.sections) {
    for (let c = 0; c < s.columns.length; c += 1) {
      const i = s.columns[c]!.findIndex((b) => b.id === blockId);
      if (i >= 0) return { section: s, column: c, index: i, block: s.columns[c]![i]! };
    }
  }
  return null;
}

function mapSection(page: Page, sectionId: string, fn: (s: Section) => Section): Page {
  return { sections: page.sections.map((s) => (s.id === sectionId ? fn(s) : s)) };
}

function withColumn(s: Section, column: number, fn: (blocks: Block[]) => Block[]): Section {
  return { ...s, columns: s.columns.map((blocks, c) => (c === column ? fn(blocks) : blocks)) };
}

function insert(blocks: Block[], item: Block, beforeId?: string): Block[] {
  const at = beforeId ? blocks.findIndex((b) => b.id === beforeId) : -1;
  return at < 0 ? [...blocks, item] : [...blocks.slice(0, at), item, ...blocks.slice(at)];
}

/** Applies one edit; anything aimed at something that no longer exists changes nothing. */
export function pageReducer(page: Page, action: Action): Page {
  switch (action.type) {
    case 'load':
      return action.page;
    case 'addSection': {
      const next = [...page.sections];
      next.splice(action.index ?? next.length, 0, section(action.layout));
      return { sections: next };
    }
    case 'removeSection':
      return { sections: page.sections.filter((s) => s.id !== action.sectionId) };
    case 'moveSection': {
      const i = page.sections.findIndex((s) => s.id === action.sectionId);
      const j = i + action.step;
      if (i < 0 || j < 0 || j >= page.sections.length) return page;
      const next = [...page.sections];
      [next[i], next[j]] = [next[j]!, next[i]!];
      return { sections: next };
    }
    case 'setLayout':
      return mapSection(page, action.sectionId, (s) => {
        const count = LAYOUTS[action.layout].columns;
        // Columns that no longer fit hand their blocks to the last one kept
        const columns = Array.from({ length: count }, (_, i) => [...(s.columns[i] ?? [])]);
        for (const extra of s.columns.slice(count)) columns[count - 1]!.push(...extra);
        return { ...s, layout: action.layout, columns };
      });
    case 'addBlock': {
      const { sectionId, column, blockId } = action.target;
      return mapSection(page, sectionId, (s) =>
        column < s.columns.length
          ? withColumn(s, column, (b) => insert(b, action.block, blockId))
          : s,
      );
    }
    case 'updateBlock': {
      const at = locate(page, action.blockId);
      if (!at) return page;
      return mapSection(page, at.section.id, (s) =>
        withColumn(s, at.column, (blocks) =>
          blocks.map((b) =>
            b.id === action.blockId ? { ...b, props: { ...b.props, ...action.props } } : b,
          ),
        ),
      );
    }
    case 'removeBlock': {
      const at = locate(page, action.blockId);
      if (!at) return page;
      return mapSection(page, at.section.id, (s) =>
        withColumn(s, at.column, (blocks) => blocks.filter((b) => b.id !== action.blockId)),
      );
    }
    case 'duplicateBlock': {
      const at = locate(page, action.blockId);
      if (!at) return page;
      const copy = { ...at.block, id: newId('b'), props: { ...at.block.props } };
      return mapSection(page, at.section.id, (s) =>
        withColumn(s, at.column, (blocks) => [
          ...blocks.slice(0, at.index + 1),
          copy,
          ...blocks.slice(at.index + 1),
        ]),
      );
    }
    case 'moveBlock': {
      const at = locate(page, action.blockId);
      if (!at) return page;
      const j = at.index + action.step;
      const column = at.section.columns[at.column]!;
      if (j < 0 || j >= column.length) return page;
      return mapSection(page, at.section.id, (s) =>
        withColumn(s, at.column, (blocks) => {
          const next = [...blocks];
          [next[at.index], next[j]] = [next[j]!, next[at.index]!];
          return next;
        }),
      );
    }
    case 'moveBlockAcross': {
      const at = locate(page, action.blockId);
      if (!at) return page;
      const target = at.column + action.step;
      if (target < 0 || target >= at.section.columns.length) return page;
      return pageReducer(pageReducer(page, { type: 'removeBlock', blockId: at.block.id }), {
        type: 'addBlock',
        target: { sectionId: at.section.id, column: target },
        block: at.block,
      });
    }
    case 'placeBlock': {
      const at = locate(page, action.blockId);
      if (!at || action.target.blockId === action.blockId) return page;
      return pageReducer(pageReducer(page, { type: 'removeBlock', blockId: at.block.id }), {
        type: 'addBlock',
        target: action.target,
        block: at.block,
      });
    }
  }
}

export type History = { past: Page[]; present: Page; future: Page[] };

const LIMIT = 60;

export type HistoryAction = Action | { type: 'undo' } | { type: 'redo' };

/** The page with undo and redo; an edit that changes nothing is not recorded. */
export function historyReducer(state: History, action: HistoryAction): History {
  if (action.type === 'undo') {
    const previous = state.past.at(-1);
    if (!previous) return state;
    return {
      past: state.past.slice(0, -1),
      present: previous,
      future: [state.present, ...state.future],
    };
  }
  if (action.type === 'redo') {
    const [next, ...rest] = state.future;
    if (!next) return state;
    return { past: [...state.past, state.present].slice(-LIMIT), present: next, future: rest };
  }
  const present = pageReducer(state.present, action);
  if (present === state.present) return state;
  return { past: [...state.past, state.present].slice(-LIMIT), present, future: [] };
}

export function findBlock(page: Page, blockId: string | null | undefined) {
  return blockId ? locate(page, blockId) : null;
}

export function blockCount(page: Page): number {
  return page.sections.reduce((n, s) => n + s.columns.reduce((m, c) => m + c.length, 0), 0);
}
