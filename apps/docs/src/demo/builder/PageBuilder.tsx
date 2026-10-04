'use client';

import {
  Badge,
  Button,
  ConfirmDialog,
  CopyButton,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  Field,
  IconButton,
  Input,
  Kbd,
  MenuGroup,
  MenuItem,
  NumberField,
  SearchInput,
  SegmentedControl,
  Select,
  StateCard,
  Switch,
  Textarea,
  cn,
} from '@skylab-kulubu/skylcn-ui';
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Code2,
  Copy,
  Eraser,
  LayoutTemplate,
  Monitor,
  MousePointer2,
  Plus,
  Redo2,
  Smartphone,
  Tablet,
  Trash2,
  Undo2,
} from 'lucide-react';
import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useState,
  type DragEvent,
  type ReactNode,
} from 'react';
import {
  BLOCKS,
  BLOCK_BY_TYPE,
  CATEGORY_LABEL,
  CATEGORY_ORDER,
  type BlockDef,
  type FieldDef,
} from './blocks';
import { pageCode } from './code';
import {
  LAYOUTS,
  LAYOUT_ORDER,
  block as newBlock,
  blockCount,
  findBlock,
  historyReducer,
  section as newSection,
  type Block,
  type BlockProps,
  type LayoutKey,
  type Page,
  type Section,
  type Target,
} from './model';
import { PRESETS } from './presets';

type Mode = 'edit' | 'preview';
type Width = 'desktop' | 'tablet' | 'phone';
const WIDTHS: Record<Width, string | undefined> = {
  desktop: undefined,
  tablet: '820px',
  phone: '390px',
};

type Drag = { kind: 'new'; type: string } | { kind: 'move'; blockId: string };

const isTyping = (target: EventTarget | null) =>
  target instanceof HTMLElement &&
  Boolean(target.closest('input, textarea, select, [contenteditable="true"], [role="combobox"]'));

/** A small picture of a layout's columns, for the section controls. */
function LayoutGlyph({ layout }: { layout: LayoutKey }) {
  const parts: Record<LayoutKey, number[]> = {
    '1': [1],
    '2': [1, 1],
    '3': [1, 1, 1],
    '4': [1, 1, 1, 1],
    '2-1': [2, 1],
    '1-2': [1, 2],
  };
  return (
    <span aria-hidden className="flex h-4 w-8 gap-0.5">
      {parts[layout].map((grow, i) => (
        <span key={i} className="rounded-sm bg-current opacity-60" style={{ flexGrow: grow }} />
      ))}
    </span>
  );
}

/**
 * A bounded canvas for putting a page together from skylcn-ui blocks: pick a
 * template or start empty, add sections and blocks, change their settings and
 * copy the page as code. It lives only while the tab is open.
 */
export function PageBuilder() {
  const [history, dispatch] = useReducer(historyReducer, undefined, () => ({
    past: [],
    present: PRESETS[0]!.build(),
    future: [],
  }));
  const page = history.present;
  const [selected, setSelected] = useState<string | null>(null);
  const [mode, setMode] = useState<Mode>('edit');
  const [width, setWidth] = useState<Width>('desktop');
  const [query, setQuery] = useState('');
  const [codeOpen, setCodeOpen] = useState(false);
  const [clearOpen, setClearOpen] = useState(false);
  const [drag, setDrag] = useState<Drag | null>(null);
  const [announcement, setAnnouncement] = useState('');
  const say = (message: string) => setAnnouncement(message);

  const at = findBlock(page, selected);
  const selectedDef = at ? BLOCK_BY_TYPE.get(at.block.type) : undefined;

  /** Where a new block goes: after the selected one, else the last section's first column. */
  const insertTarget = useCallback((): Target | null => {
    if (at) {
      const next = at.section.columns[at.column]![at.index + 1];
      return { sectionId: at.section.id, column: at.column, blockId: next?.id };
    }
    const last = page.sections.at(-1);
    return last ? { sectionId: last.id, column: 0 } : null;
  }, [at, page.sections]);

  const add = (type: string, target?: Target | null) => {
    const def = BLOCK_BY_TYPE.get(type);
    if (!def) return;
    const created = newBlock(type, { ...def.defaults });
    const where = target ?? insertTarget();
    if (where) dispatch({ type: 'addBlock', target: where, block: created });
    else dispatch({ type: 'load', page: { sections: [newSection('1', [[created]])] } });
    setSelected(created.id);
    say(`${def.label} eklendi`);
  };

  const remove = (blockId: string) => {
    const found = findBlock(page, blockId);
    dispatch({ type: 'removeBlock', blockId });
    if (selected === blockId) setSelected(null);
    say(`${BLOCK_BY_TYPE.get(found?.block.type ?? '')?.label ?? 'Blok'} kaldırıldı`);
  };

  const loadPreset = (id: string) => {
    const preset = PRESETS.find((p) => p.id === id);
    if (!preset) return;
    dispatch({ type: 'load', page: preset.build() });
    setSelected(null);
    say(`${preset.label} şablonu yüklendi`);
  };

  // Keyboard: undo and redo, delete, duplicate, move, deselect
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (mode !== 'edit' || isTyping(event.target)) return;
      const mod = event.ctrlKey || event.metaKey;
      const key = event.key.toLowerCase();
      if (mod && key === 'z') {
        event.preventDefault();
        dispatch({ type: event.shiftKey ? 'redo' : 'undo' });
      } else if (mod && key === 'y') {
        event.preventDefault();
        dispatch({ type: 'redo' });
      } else if (selected && (event.key === 'Delete' || event.key === 'Backspace')) {
        event.preventDefault();
        remove(selected);
      } else if (selected && mod && key === 'd') {
        event.preventDefault();
        dispatch({ type: 'duplicateBlock', blockId: selected });
      } else if (
        selected &&
        event.altKey &&
        (event.key === 'ArrowUp' || event.key === 'ArrowDown')
      ) {
        event.preventDefault();
        dispatch({ type: 'moveBlock', blockId: selected, step: event.key === 'ArrowUp' ? -1 : 1 });
      } else if (event.key === 'Escape') {
        setSelected(null);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const drop = (target: Target) => {
    if (!drag) return;
    if (drag.kind === 'new') add(drag.type, target);
    else {
      dispatch({ type: 'placeBlock', blockId: drag.blockId, target });
      say('Blok taşındı');
    }
    setDrag(null);
  };

  const code = useMemo(() => (codeOpen ? pageCode(page) : ''), [codeOpen, page]);
  const filtered = BLOCKS.filter((def) =>
    `${def.label} ${def.description} ${CATEGORY_LABEL[def.category]}`
      .toLocaleLowerCase('tr-TR')
      .includes(query.trim().toLocaleLowerCase('tr-TR')),
  );

  return (
    <div className="flex flex-col gap-4">
      <p aria-live="polite" className="sr-only">
        {announcement}
      </p>

      <div
        className="flex flex-wrap items-center gap-2"
        role="toolbar"
        aria-label="Kurucu araçları"
      >
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="outline" size="sm" />}>
            <LayoutTemplate /> Şablon
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-64">
            {PRESETS.map((preset) => (
              <MenuItem key={preset.id} onClick={() => loadPreset(preset.id)}>
                <span className="flex flex-col">
                  <span>{preset.label}</span>
                  <span className="text-2xs text-subtle-foreground">{preset.description}</span>
                </span>
              </MenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <IconButton
          icon={Undo2}
          label="Geri al (Ctrl+Z)"
          size="icon-sm"
          variant="ghost"
          disabled={!history.past.length}
          onClick={() => dispatch({ type: 'undo' })}
        />
        <IconButton
          icon={Redo2}
          label="Yinele (Ctrl+Shift+Z)"
          size="icon-sm"
          variant="ghost"
          disabled={!history.future.length}
          onClick={() => dispatch({ type: 'redo' })}
        />
        <span className="mx-1 h-5 w-px bg-border" aria-hidden />
        <SegmentedControl
          aria-label="Mod"
          value={mode}
          onValueChange={(value) => {
            setMode(value as Mode);
            if (value === 'preview') setSelected(null);
          }}
          options={[
            { value: 'edit', label: 'Düzenle' },
            { value: 'preview', label: 'Önizle' },
          ]}
        />
        <SegmentedControl
          aria-label="Genişlik"
          value={width}
          onValueChange={(value) => setWidth(value as Width)}
          options={[
            { value: 'desktop', label: 'Masaüstü', icon: Monitor },
            { value: 'tablet', label: 'Tablet', icon: Tablet },
            { value: 'phone', label: 'Telefon', icon: Smartphone },
          ]}
        />
        <div className="ml-auto flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setClearOpen(true)}
            disabled={!page.sections.length}
          >
            <Eraser /> Temizle
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setCodeOpen(true)}
            disabled={!blockCount(page)}
          >
            <Code2 /> Kodu al
          </Button>
        </div>
      </div>

      <div className="grid items-start gap-4 xl:grid-cols-[15rem_minmax(0,1fr)_17rem]">
        <aside aria-label="Bloklar" className="flex flex-col gap-3 xl:sticky xl:top-4">
          <SearchInput compact value={query} onValueChange={setQuery} placeholder="Blok ara" />
          <div className="flex scrollbar max-h-[70vh] flex-col gap-4 overflow-y-auto pr-1">
            {CATEGORY_ORDER.map((category) => {
              const items = filtered.filter((def) => def.category === category);
              if (!items.length) return null;
              return (
                <section
                  key={category}
                  aria-labelledby={`palette-${category}`}
                  className="flex flex-col gap-1"
                >
                  <h2
                    id={`palette-${category}`}
                    className="px-1 text-3xs font-medium tracking-label text-subtle-foreground uppercase"
                  >
                    {CATEGORY_LABEL[category]}
                  </h2>
                  {items.map((def) => (
                    <PaletteItem
                      key={def.type}
                      def={def}
                      disabled={mode !== 'edit'}
                      onAdd={() => add(def.type)}
                      onDragStart={() => setDrag({ kind: 'new', type: def.type })}
                      onDragEnd={() => setDrag(null)}
                    />
                  ))}
                </section>
              );
            })}
            {!filtered.length ? (
              <p className="px-1 text-xs text-muted-foreground">“{query}” ile eşleşen blok yok.</p>
            ) : null}
          </div>
          <p className="px-1 text-2xs text-subtle-foreground">
            Tıklayınca seçili bloğun altına eklenir; tuvaldeki bir yere de sürükleyebilirsin.
          </p>
        </aside>

        <div className="min-w-0 rounded-xl border border-border bg-sidebar p-3">
          <div
            data-slot="builder-canvas"
            className="@container mx-auto flex flex-col gap-6 rounded-lg bg-background p-4 transition-[max-width] duration-(--motion-duration-base) ease-enter sm:p-6"
            style={{ maxWidth: WIDTHS[width] }}
            onClick={(event) => {
              if (event.target === event.currentTarget) setSelected(null);
            }}
          >
            {page.sections.length === 0 ? (
              <StateCard
                icon={LayoutTemplate}
                title="Sayfa boş"
                description="Bir şablonla başla ya da bir bölüm ekleyip içine blok yerleştir."
              >
                <div className="flex flex-wrap justify-center gap-2">
                  {PRESETS.filter((p) => p.id !== 'blank').map((preset) => (
                    <Button key={preset.id} size="sm" onClick={() => loadPreset(preset.id)}>
                      {preset.label}
                    </Button>
                  ))}
                </div>
              </StateCard>
            ) : null}
            {page.sections.map((s, index) => (
              <SectionView
                key={s.id}
                section={s}
                index={index}
                total={page.sections.length}
                mode={mode}
                selected={selected}
                drag={drag}
                onSelect={(id) => setSelected(id)}
                onDrop={drop}
                onDragBlock={(blockId) => setDrag(blockId ? { kind: 'move', blockId } : null)}
                onAdd={add}
                onLayout={(layout) => dispatch({ type: 'setLayout', sectionId: s.id, layout })}
                onMove={(step) => dispatch({ type: 'moveSection', sectionId: s.id, step })}
                onRemove={() => {
                  dispatch({ type: 'removeSection', sectionId: s.id });
                  say(`Bölüm ${index + 1} kaldırıldı`);
                }}
              />
            ))}
            {mode === 'edit' ? (
              <AddSection
                onAdd={(layout) => {
                  dispatch({ type: 'addSection', layout });
                  say(`${LAYOUTS[layout].label} bölüm eklendi`);
                }}
              />
            ) : null}
          </div>
        </div>

        <aside
          aria-label="Ayarlar"
          className="flex flex-col gap-4 rounded-xl border border-border p-4 xl:sticky xl:top-4"
        >
          {at && selectedDef ? (
            <Inspector
              key={at.block.id}
              def={selectedDef}
              blockData={at.block}
              canLeft={at.column > 0}
              canRight={at.column < at.section.columns.length - 1}
              canUp={at.index > 0}
              canDown={at.index < at.section.columns[at.column]!.length - 1}
              onChange={(props) => dispatch({ type: 'updateBlock', blockId: at.block.id, props })}
              onMove={(step) => dispatch({ type: 'moveBlock', blockId: at.block.id, step })}
              onAcross={(step) => dispatch({ type: 'moveBlockAcross', blockId: at.block.id, step })}
              onDuplicate={() => {
                dispatch({ type: 'duplicateBlock', blockId: at.block.id });
                say(`${selectedDef.label} çoğaltıldı`);
              }}
              onRemove={() => remove(at.block.id)}
            />
          ) : (
            <Overview page={page} />
          )}
        </aside>
      </div>

      <Dialog open={codeOpen} onOpenChange={setCodeOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Sayfanın kodu</DialogTitle>
            <DialogDescription>
              Bir Next.js sayfasına yapıştır. Örnek veriler sabit olarak gelir; kendi verinle
              değiştir.
            </DialogDescription>
          </DialogHeader>
          <div className="relative">
            <div className="absolute top-2 right-2">
              <CopyButton value={code} label="Kodu kopyala" />
            </div>
            <pre className="scrollbar max-h-[60vh] overflow-auto rounded-lg border border-border bg-sidebar p-4 font-mono text-2xs leading-relaxed text-secondary-foreground">
              <code>{code}</code>
            </pre>
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={clearOpen}
        onOpenChange={setClearOpen}
        title="Sayfa temizlensin mi?"
        description="Bütün bölümler ve bloklar kalkar. Geri al ile döndürebilirsin."
        actionLabel="Temizle"
        destructive
        onAction={() => {
          dispatch({ type: 'load', page: { sections: [] } });
          setSelected(null);
          setClearOpen(false);
          say('Sayfa temizlendi');
        }}
      />
    </div>
  );
}

function PaletteItem({
  def,
  disabled,
  onAdd,
  onDragStart,
  onDragEnd,
}: {
  def: BlockDef;
  disabled: boolean;
  onAdd: () => void;
  onDragStart: () => void;
  onDragEnd: () => void;
}) {
  const Icon = def.icon;
  return (
    <button
      type="button"
      draggable={!disabled}
      disabled={disabled}
      onClick={onAdd}
      onDragStart={(event) => {
        event.dataTransfer.effectAllowed = 'copy';
        event.dataTransfer.setData('text/plain', def.type);
        onDragStart();
      }}
      onDragEnd={onDragEnd}
      className="group flex items-start gap-2.5 rounded-lg px-2 py-2 text-left outline-hidden transition-colors duration-(--motion-duration-fast) hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
    >
      <span className="grid size-7 shrink-0 place-items-center rounded-md border border-border bg-card text-skylab-300">
        <Icon className="size-3.5" aria-hidden />
      </span>
      <span className="min-w-0">
        <span className="block text-sm text-foreground">{def.label}</span>
        <span className="block text-2xs leading-snug text-subtle-foreground">
          {def.description}
        </span>
      </span>
      <Plus
        className="ml-auto size-3.5 shrink-0 self-center text-subtle-foreground opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
        aria-hidden
      />
    </button>
  );
}

function SectionView({
  section,
  index,
  total,
  mode,
  selected,
  drag,
  onSelect,
  onDrop,
  onDragBlock,
  onAdd,
  onLayout,
  onMove,
  onRemove,
}: {
  section: Section;
  index: number;
  total: number;
  mode: Mode;
  selected: string | null;
  drag: Drag | null;
  onSelect: (id: string) => void;
  onDrop: (target: Target) => void;
  onDragBlock: (blockId: string | null) => void;
  onAdd: (type: string, target: Target) => void;
  onLayout: (layout: LayoutKey) => void;
  onMove: (step: -1 | 1) => void;
  onRemove: () => void;
}) {
  const layout = LAYOUTS[section.layout];
  const edit = mode === 'edit';
  return (
    <section
      aria-label={`Bölüm ${index + 1}`}
      className={cn(
        'group/section relative flex flex-col gap-2',
        edit &&
          'rounded-xl p-2 outline outline-1 -outline-offset-1 outline-transparent focus-within:outline-border focus-within:outline-dashed hover:outline-border hover:outline-dashed',
      )}
    >
      {edit ? (
        <div className="flex flex-wrap items-center gap-1">
          <span className="mr-1 text-3xs font-medium tracking-label text-subtle-foreground uppercase">
            Bölüm {index + 1}
          </span>
          <Select
            size="sm"
            variant="inline"
            aria-label={`Bölüm ${index + 1} düzeni`}
            value={section.layout}
            onValueChange={(value) => onLayout(value as LayoutKey)}
            options={LAYOUT_ORDER.map((key) => ({ value: key, label: LAYOUTS[key].label }))}
          />
          <span className="ml-auto flex opacity-60 transition-opacity group-focus-within/section:opacity-100 group-hover/section:opacity-100">
            <IconButton
              icon={ArrowUp}
              label="Bölümü yukarı taşı"
              size="icon-sm"
              variant="ghost"
              disabled={index === 0}
              onClick={() => onMove(-1)}
            />
            <IconButton
              icon={ArrowDown}
              label="Bölümü aşağı taşı"
              size="icon-sm"
              variant="ghost"
              disabled={index === total - 1}
              onClick={() => onMove(1)}
            />
            <IconButton
              icon={Trash2}
              label="Bölümü kaldır"
              size="icon-sm"
              variant="ghost"
              onClick={onRemove}
            />
          </span>
        </div>
      ) : null}
      <div className={cn('grid gap-4', layout.preview)}>
        {section.columns.map((blocks, column) => (
          <ColumnView
            key={column}
            blocks={blocks}
            target={{ sectionId: section.id, column }}
            label={`Bölüm ${index + 1}, sütun ${column + 1}`}
            mode={mode}
            selected={selected}
            drag={drag}
            onSelect={onSelect}
            onDrop={onDrop}
            onDragBlock={onDragBlock}
            onAdd={onAdd}
          />
        ))}
      </div>
    </section>
  );
}

function ColumnView({
  blocks,
  target,
  label,
  mode,
  selected,
  drag,
  onSelect,
  onDrop,
  onDragBlock,
  onAdd,
}: {
  blocks: Block[];
  target: Target;
  label: string;
  mode: Mode;
  selected: string | null;
  drag: Drag | null;
  onSelect: (id: string) => void;
  onDrop: (target: Target) => void;
  onDragBlock: (blockId: string | null) => void;
  onAdd: (type: string, target: Target) => void;
}) {
  const [over, setOver] = useState(false);
  const edit = mode === 'edit';
  const accept = (event: DragEvent) => {
    if (!drag) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = drag.kind === 'new' ? 'copy' : 'move';
  };
  return (
    <div
      className={cn(
        'flex min-w-0 flex-col gap-4 rounded-lg transition-colors duration-(--motion-duration-fast)',
        edit && blocks.length === 0 && 'min-h-24',
        over && 'bg-skylab-500/5 outline outline-2 -outline-offset-2 outline-skylab-400/40',
      )}
      onDragOver={(event) => {
        accept(event);
        if (drag) setOver(true);
      }}
      onDragLeave={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOver(false);
      }}
      onDrop={(event) => {
        event.preventDefault();
        setOver(false);
        onDrop(target);
      }}
    >
      {blocks.map((b) => (
        <BlockFrame
          key={b.id}
          data={b}
          edit={edit}
          selected={selected === b.id}
          drag={drag}
          onSelect={() => onSelect(b.id)}
          onDragStart={() => onDragBlock(b.id)}
          onDragEnd={() => onDragBlock(null)}
          onDropBefore={() => onDrop({ ...target, blockId: b.id })}
        />
      ))}
      {edit ? (
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <button
                type="button"
                aria-label={`${label}: blok ekle`}
                className={cn(
                  'flex items-center justify-center gap-1.5 rounded-lg border border-dashed border-border text-xs text-subtle-foreground outline-hidden transition-colors duration-(--motion-duration-fast) hover:border-border-strong hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring',
                  blocks.length
                    ? 'py-1.5 opacity-0 group-hover/section:opacity-100 focus-visible:opacity-100'
                    : 'flex-1 py-6',
                )}
              />
            }
          >
            <Plus className="size-3.5" aria-hidden /> Blok ekle
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="max-h-80 w-60 overflow-y-auto">
            {CATEGORY_ORDER.map((category) => (
              <MenuGroup key={category} label={CATEGORY_LABEL[category]}>
                {BLOCKS.filter((def) => def.category === category).map((def) => (
                  <MenuItem key={def.type} icon={def.icon} onClick={() => onAdd(def.type, target)}>
                    {def.label}
                  </MenuItem>
                ))}
              </MenuGroup>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      ) : null}
    </div>
  );
}

function BlockFrame({
  data,
  edit,
  selected,
  drag,
  onSelect,
  onDragStart,
  onDragEnd,
  onDropBefore,
}: {
  data: Block;
  edit: boolean;
  selected: boolean;
  drag: Drag | null;
  onSelect: () => void;
  onDragStart: () => void;
  onDragEnd: () => void;
  onDropBefore: () => void;
}) {
  const def = BLOCK_BY_TYPE.get(data.type);
  const [over, setOver] = useState(false);
  if (!def) return null;
  const { Render } = def;
  if (!edit) return <Render props={data.props} />;
  return (
    <div
      data-block-type={data.type}
      className="group/block relative rounded-lg"
      onDragOver={(event) => {
        if (!drag || (drag.kind === 'move' && drag.blockId === data.id)) return;
        event.preventDefault();
        event.stopPropagation();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(event) => {
        event.preventDefault();
        event.stopPropagation();
        setOver(false);
        onDropBefore();
      }}
    >
      {over ? (
        <span
          aria-hidden
          className="absolute -top-2.5 right-0 left-0 h-0.5 rounded-full bg-skylab-400"
        />
      ) : null}
      <div className="pointer-events-none select-none" inert>
        <Render props={data.props} />
      </div>
      <button
        type="button"
        draggable
        aria-pressed={selected}
        aria-label={`${def.label} bloğunu seç`}
        onClick={onSelect}
        onDragStart={(event) => {
          event.dataTransfer.effectAllowed = 'move';
          event.dataTransfer.setData('text/plain', data.id);
          onDragStart();
        }}
        onDragEnd={onDragEnd}
        className={cn(
          'absolute -inset-1 cursor-grab rounded-xl outline-hidden transition-[box-shadow] duration-(--motion-duration-fast) active:cursor-grabbing',
          'hover:ring-1 hover:ring-border-strong focus-visible:ring-2 focus-visible:ring-ring',
          selected && 'ring-2 ring-skylab-400 hover:ring-2 hover:ring-skylab-400',
        )}
      />
      {selected ? (
        <span className="pointer-events-none absolute -top-3 left-2 rounded-md bg-skylab-400 px-1.5 py-0.5 text-3xs font-medium text-background">
          {def.label}
        </span>
      ) : null}
    </div>
  );
}

function AddSection({ onAdd }: { onAdd: (layout: LayoutKey) => void }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-border p-4">
      <span className="text-xs text-subtle-foreground">Bölüm ekle</span>
      <div className="flex flex-wrap justify-center gap-1.5">
        {LAYOUT_ORDER.map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => onAdd(key)}
            aria-label={`${LAYOUTS[key].label} bölüm ekle`}
            title={LAYOUTS[key].label}
            className="grid place-items-center rounded-md border border-border px-2.5 py-2 text-subtle-foreground outline-hidden transition-colors duration-(--motion-duration-fast) hover:border-border-strong hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
          >
            <LayoutGlyph layout={key} />
          </button>
        ))}
      </div>
    </div>
  );
}

function FieldControl({
  field,
  value,
  onChange,
}: {
  field: FieldDef;
  value: string | number | boolean | undefined;
  onChange: (value: string | number | boolean) => void;
}) {
  const id = `builder-field-${field.key}`;
  if (field.kind === 'boolean') {
    return (
      <label
        htmlFor={id}
        className="flex items-center justify-between gap-3 text-sm text-secondary-foreground"
      >
        {field.label}
        <Switch id={id} checked={Boolean(value)} onCheckedChange={(checked) => onChange(checked)} />
      </label>
    );
  }
  if (field.kind === 'select') {
    return (
      <Field label={field.label}>
        <Select
          value={String(value ?? '')}
          onValueChange={(next) => onChange(next)}
          options={field.options}
          size="sm"
        />
      </Field>
    );
  }
  if (field.kind === 'number') {
    return (
      <Field label={field.label}>
        <NumberField
          value={Number(value ?? 0)}
          onValueChange={(next) => onChange(next ?? 0)}
          min={field.min}
          max={field.max}
        />
      </Field>
    );
  }
  if (field.kind === 'textarea') {
    return (
      <Field label={field.label}>
        <Textarea
          id={id}
          value={String(value ?? '')}
          onChange={(event) => onChange(event.target.value)}
          rows={3}
        />
      </Field>
    );
  }
  return (
    <Field label={field.label}>
      <Input
        id={id}
        value={String(value ?? '')}
        onChange={(event) => onChange(event.target.value)}
        inputSize="sm"
      />
    </Field>
  );
}

function Inspector({
  def,
  blockData,
  canLeft,
  canRight,
  canUp,
  canDown,
  onChange,
  onMove,
  onAcross,
  onDuplicate,
  onRemove,
}: {
  def: BlockDef;
  blockData: Block;
  canLeft: boolean;
  canRight: boolean;
  canUp: boolean;
  canDown: boolean;
  onChange: (props: BlockProps) => void;
  onMove: (step: -1 | 1) => void;
  onAcross: (step: -1 | 1) => void;
  onDuplicate: () => void;
  onRemove: () => void;
}) {
  const Icon = def.icon;
  return (
    <>
      <div className="flex items-start gap-2.5">
        <span className="grid size-8 shrink-0 place-items-center rounded-md border border-border text-skylab-300">
          <Icon className="size-4" aria-hidden />
        </span>
        <div className="min-w-0">
          <h2 className="text-sm font-semibold text-foreground">{def.label}</h2>
          <p className="text-2xs text-muted-foreground">{def.description}</p>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        {def.fields.map((field) => (
          <FieldControl
            key={field.key}
            field={field}
            value={blockData.props[field.key]}
            onChange={(value) => onChange({ [field.key]: value })}
          />
        ))}
      </div>
      <div className="flex flex-col gap-2 border-t border-border-subtle pt-3">
        <div className="flex flex-wrap gap-1">
          <IconButton
            icon={ArrowUp}
            label="Yukarı taşı (Alt+↑)"
            size="icon-sm"
            disabled={!canUp}
            onClick={() => onMove(-1)}
          />
          <IconButton
            icon={ArrowDown}
            label="Aşağı taşı (Alt+↓)"
            size="icon-sm"
            disabled={!canDown}
            onClick={() => onMove(1)}
          />
          <IconButton
            icon={ArrowLeft}
            label="Soldaki sütuna taşı"
            size="icon-sm"
            disabled={!canLeft}
            onClick={() => onAcross(-1)}
          />
          <IconButton
            icon={ArrowRight}
            label="Sağdaki sütuna taşı"
            size="icon-sm"
            disabled={!canRight}
            onClick={() => onAcross(1)}
          />
          <IconButton icon={Copy} label="Çoğalt (Ctrl+D)" size="icon-sm" onClick={onDuplicate} />
          <IconButton
            icon={Trash2}
            label="Kaldır (Delete)"
            size="icon-sm"
            variant="destructive"
            onClick={onRemove}
          />
        </div>
      </div>
    </>
  );
}

function Overview({ page }: { page: Page }) {
  const rows: [ReactNode, ReactNode][] = [
    ['Seç', 'Tıkla'],
    [
      'Taşı',
      <span key="m" className="flex gap-0.5">
        <Kbd>Alt</Kbd>
        <Kbd>↑</Kbd>
        <Kbd>↓</Kbd>
      </span>,
    ],
    [
      'Çoğalt',
      <span key="d" className="flex gap-0.5">
        <Kbd>Ctrl</Kbd>
        <Kbd>D</Kbd>
      </span>,
    ],
    ['Kaldır', <Kbd key="x">Delete</Kbd>],
    [
      'Geri al',
      <span key="z" className="flex gap-0.5">
        <Kbd>Ctrl</Kbd>
        <Kbd>Z</Kbd>
      </span>,
    ],
    ['Seçimi bırak', <Kbd key="e">Esc</Kbd>],
  ];
  return (
    <>
      <div className="flex items-start gap-2.5">
        <span className="grid size-8 shrink-0 place-items-center rounded-md border border-border text-skylab-300">
          <MousePointer2 className="size-4" aria-hidden />
        </span>
        <div>
          <h2 className="text-sm font-semibold text-foreground">Bir blok seç</h2>
          <p className="text-2xs text-muted-foreground">Ayarları burada açılır.</p>
        </div>
      </div>
      <div className="flex gap-2">
        <Badge tone="neutral">{page.sections.length} bölüm</Badge>
        <Badge tone="neutral">{blockCount(page)} blok</Badge>
      </div>
      <dl className="flex flex-col gap-2 border-t border-border-subtle pt-3 text-xs">
        {rows.map(([label, keys]) => (
          <div key={String(label)} className="flex items-center justify-between gap-3">
            <dt className="text-muted-foreground">{label}</dt>
            <dd className="text-secondary-foreground">{keys}</dd>
          </div>
        ))}
      </dl>
      <p className="text-2xs text-subtle-foreground">
        Kurduğun sayfa yalnızca bu sekme açıkken durur; kalıcı hale getirmek için kodunu al.
      </p>
    </>
  );
}
