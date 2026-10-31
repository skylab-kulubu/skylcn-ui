'use client';

import { useMemo, type ReactNode } from 'react';
import { cn } from '../lib/cn.js';
import { useSkylcn } from '../lib/provider.js';
import { CopyButton } from './copy-button.js';

type TokenKind =
  | 'comment'
  | 'string'
  | 'number'
  | 'keyword'
  | 'type'
  | 'call'
  | 'tag'
  | 'attr'
  | 'property'
  | 'plain';
type Token = { text: string; kind: TokenKind };

// A rule is a pattern and what it colours; `word` is decided per match: keyword, type or call
type Rule = [TokenKind | 'word', string];
type Grammar = {
  rules: Rule[];
  keywords?: ReadonlySet<string>;
  types?: ReadonlySet<string>;
  /** SQL: keywords match in any case and capitals do not mean a type. */
  caseless?: boolean;
};

const words = (list: string) => new Set(list.split(/\s+/));
const C_COMMENT = String.raw`\/\/.*$|\/\*[\s\S]*?\*\/`;
const HASH_COMMENT = String.raw`(?:^|(?<=\s))#.*$`;
const DOUBLE = String.raw`"(?:\\.|[^"\\\n])*"`;
const SINGLE = String.raw`'(?:\\.|[^'\\\n])*'`;
const TEMPLATE = '`(?:\\\\.|[^`\\\\])*`';
const NUMBER = String.raw`\b0x[\da-fA-F]+\b|\b\d[\d_]*(?:\.\d+)?(?:[eE][+-]?\d+)?\b`;
const WORD = String.raw`[A-Za-z_$][\w$]*`;
const TRIPLE = ['"""', "'''"].map((quote) => `[rfb]?${quote}[\\s\\S]*?${quote}`).join('|');

const GRAMMARS: Record<string, Grammar> = {
  js: {
    rules: [
      ['comment', C_COMMENT],
      ['string', `${DOUBLE}|${SINGLE}|${TEMPLATE}`],
      // JSX: the name after < or </, and a name right before = inside a tag
      ['tag', String.raw`(?<=<\/?)[A-Za-z][\w.]*`],
      ['attr', String.raw`(?<=\s)[a-zA-Z][\w-]*(?==[{"'])`],
      ['number', NUMBER],
      ['word', WORD],
    ],
    keywords: words(
      'import export from default const let var function return if else for while do switch case ' +
        'break continue new class extends implements interface type enum async await try catch ' +
        'finally throw typeof instanceof in of as satisfies keyof readonly declare namespace ' +
        'null undefined true false this super yield void delete',
    ),
    types: words('string number boolean unknown never any object bigint symbol'),
  },
  json: {
    rules: [
      ['property', String.raw`${DOUBLE}(?=\s*:)`],
      ['string', DOUBLE],
      ['number', String.raw`-?\b\d+(?:\.\d+)?(?:[eE][+-]?\d+)?\b`],
      ['word', WORD],
    ],
    keywords: words('true false null'),
  },
  css: {
    rules: [
      ['comment', String.raw`\/\*[\s\S]*?\*\/`],
      ['string', `${DOUBLE}|${SINGLE}`],
      ['keyword', String.raw`@[\w-]+|!important`],
      ['property', String.raw`(?<![\w-])-{0,2}[a-zA-Z][\w-]*(?=\s*:\s)`],
      [
        'number',
        String.raw`#[\da-fA-F]{3,8}\b|-?\b\d*\.?\d+(?:px|rem|em|%|s|ms|vh|vw|dvh|deg|fr|ch)?\b`,
      ],
      ['type', String.raw`[.#][a-zA-Z_][\w-]*|::?[a-z-]+`],
      ['call', String.raw`[a-z-]+(?=\()`],
    ],
  },
  bash: {
    rules: [
      ['comment', HASH_COMMENT],
      ['string', `${DOUBLE}|${SINGLE}`],
      ['type', String.raw`\$\{[^}]*\}|\$[\w@#?]+`],
      // Variables set for one command, as in PORT=3000 pnpm dev
      ['type', String.raw`(?<=(?:^|[|;&])\s*(?:[A-Za-z_]\w*=\S*\s+)*)[A-Za-z_]\w*(?==)`],
      // The command: the first word of a line, or after a pipe, && or ;, past any such variables
      [
        'call',
        String.raw`(?<=(?:^|[|;&])\s*(?:[A-Za-z_]\w*=\S*\s+)*)(?!(?:if|then|else|elif|fi|for|do|done|in|while|until|case|esac|function|export|local|return)\b)[\w./@-]+`,
      ],
      ['attr', String.raw`(?<=\s)--?[\w-]+`],
      ['word', WORD],
    ],
    keywords: words(
      'if then else elif fi for do done in while until case esac function export local return',
    ),
  },
  python: {
    rules: [
      ['comment', HASH_COMMENT],
      ['string', `${TRIPLE}|[rfb]?${DOUBLE}|[rfb]?${SINGLE}`],
      ['attr', String.raw`@[\w.]+`],
      ['number', NUMBER],
      ['word', WORD],
    ],
    keywords: words(
      'def class return if elif else for while in not and or is import from as with try except ' +
        'finally raise pass break continue lambda yield async await global nonlocal None True False self',
    ),
    types: words('int str float bool list dict set tuple bytes'),
  },
  go: {
    rules: [
      ['comment', C_COMMENT],
      ['string', `${DOUBLE}|${TEMPLATE}|${SINGLE}`],
      ['number', NUMBER],
      ['word', WORD],
    ],
    keywords: words(
      'package import func return if else for range switch case default break continue go defer ' +
        'select chan map struct interface type var const fallthrough goto nil true false',
    ),
    types: words('string int int64 int32 uint byte rune float64 float32 bool error any'),
  },
  yaml: {
    rules: [
      ['comment', HASH_COMMENT],
      ['property', String.raw`(?<=^\s*(?:-\s+)?)[\w.\/-]+(?=\s*:(?:\s|$))`],
      ['string', `${DOUBLE}|${SINGLE}`],
      ['number', NUMBER],
      ['word', WORD],
    ],
    keywords: words('true false null yes no on off'),
  },
  html: {
    rules: [
      ['comment', String.raw`<!--[\s\S]*?-->`],
      ['tag', String.raw`(?<=<\/?)[\w:-]+`],
      ['attr', String.raw`(?<=\s)[\w:@.-]+(?==)`],
      ['string', `${DOUBLE}|${SINGLE}`],
    ],
  },
  sql: {
    rules: [
      ['comment', String.raw`--.*$|\/\*[\s\S]*?\*\/`],
      ['string', SINGLE],
      ['number', NUMBER],
      ['word', WORD],
    ],
    keywords: words(
      'select from where and or not null is in as on join left right inner outer insert into values ' +
        'update set delete create table alter drop index primary key references order by group having ' +
        'limit offset distinct returning default unique',
    ),
    types: words(
      'int integer bigint text varchar boolean timestamp timestamptz date uuid jsonb serial',
    ),
    caseless: true,
  },
  plain: {
    rules: [
      ['comment', `${C_COMMENT}|${HASH_COMMENT}`],
      ['string', `${DOUBLE}|${SINGLE}`],
      ['number', NUMBER],
    ],
  },
};

const ALIASES: Record<string, string> = {
  javascript: 'js',
  typescript: 'js',
  ts: 'js',
  tsx: 'js',
  jsx: 'js',
  mjs: 'js',
  cjs: 'js',
  jsonc: 'json',
  scss: 'css',
  less: 'css',
  sh: 'bash',
  zsh: 'bash',
  shell: 'bash',
  console: 'bash',
  dockerfile: 'bash',
  env: 'bash',
  py: 'python',
  golang: 'go',
  yml: 'yaml',
  xml: 'html',
  svg: 'html',
  vue: 'html',
  svelte: 'html',
  postgres: 'sql',
  postgresql: 'sql',
};

type Compiled = { pattern: RegExp; kinds: Rule[0][]; grammar: Grammar };
const compiled = new Map<string, Compiled>();

function grammarFor(language: string): Compiled {
  const name = language.toLowerCase();
  const key = GRAMMARS[name] ? name : (ALIASES[name] ?? 'plain');
  let entry = compiled.get(key);
  if (!entry) {
    const grammar = GRAMMARS[key]!;
    entry = {
      grammar,
      kinds: grammar.rules.map(([kind]) => kind),
      pattern: new RegExp(grammar.rules.map(([, source]) => `(${source})`).join('|'), 'gm'),
    };
    compiled.set(key, entry);
  }
  return entry;
}

const TOKEN_CLASS: Record<TokenKind, string> = {
  comment: 'text-code-comment italic',
  string: 'text-code-string',
  number: 'text-code-number',
  keyword: 'text-code-keyword',
  type: 'text-code-type',
  call: 'text-code-call',
  tag: 'text-code-tag',
  attr: 'text-code-attr',
  property: 'text-code-property',
  plain: '',
};

/**
 * Splits code into lines of coloured tokens by the language's own rules: JSX tags and props in
 * tsx, keys in json and yaml, properties in css, commands, flags and variables in bash, and the
 * keywords and comments of each. Languages it does not know get comments, strings and numbers.
 */
export function tokenizeCode(code: string, language = ''): Token[][] {
  const { pattern, kinds, grammar } = grammarFor(language);
  const tokens: Token[] = [];
  let last = 0;
  for (const match of code.matchAll(pattern)) {
    const index = match.index;
    const text = match[0];
    if (!text) continue;
    if (index > last) tokens.push({ text: code.slice(last, index), kind: 'plain' });
    const rule = kinds[match.slice(1).findIndex((group) => group !== undefined)] ?? 'plain';
    let kind: TokenKind = rule === 'word' ? 'plain' : rule;
    if (rule === 'word') {
      const word = grammar.caseless ? text.toLowerCase() : text;
      if (grammar.keywords?.has(word)) kind = 'keyword';
      else if (grammar.types?.has(word)) kind = 'type';
      else if (!grammar.caseless && /^[A-Z]/.test(text)) kind = 'type';
      else if (code[index + text.length] === '(') kind = 'call';
    }
    tokens.push({ text, kind });
    last = index + text.length;
  }
  if (last < code.length) tokens.push({ text: code.slice(last), kind: 'plain' });

  // A comment or a template string can run over several lines, so lines are cut after colouring
  const lines: Token[][] = [[]];
  for (const token of tokens) {
    token.text.split('\n').forEach((part, i) => {
      if (i > 0) lines.push([]);
      if (part) lines.at(-1)!.push({ text: part, kind: token.kind });
    });
  }
  return lines;
}

export type CodeLineMark = 'added' | 'removed';

export type CodeBlockProps = {
  code: string;
  /** Picks the comment style and is shown in the header without a filename. */
  language?: string;
  filename?: string;
  /** Line numbers, from 1, tinted to draw the eye. */
  highlightLines?: readonly number[];
  /** Lines marked as added or removed, by line number, as a diff shows them. */
  marks?: Readonly<Record<number, CodeLineMark>>;
  lineNumbers?: boolean;
  /** Words at the header's end, such as "Önce". */
  badge?: ReactNode;
  copy?: boolean;
  className?: string;
};

/** Code with its filename, line numbers, highlighted lines and a copy button. */
export function CodeBlock({
  code,
  language,
  filename,
  highlightLines = [],
  marks,
  lineNumbers = true,
  badge,
  copy = true,
  className,
}: CodeBlockProps) {
  const { messages } = useSkylcn();
  const lines = useMemo(() => tokenizeCode(code.replace(/\n$/, ''), language), [code, language]);
  const title = filename ?? language;
  const highlighted = new Set(highlightLines);
  const copyButton = copy ? (
    <CopyButton value={code} label={`${messages.copy}: ${title ?? messages.code}`} />
  ) : null;

  return (
    <figure
      data-slot="code-block"
      className={cn(
        'relative flex min-w-0 flex-col overflow-hidden rounded-lg border border-border bg-muted/40',
        className,
      )}
    >
      {title || badge ? (
        <figcaption className="flex min-h-9 items-center gap-2 border-b border-border-subtle py-1 pr-1.5 pl-3 text-2xs text-muted-foreground">
          <span className="min-w-0 flex-1 truncate font-mono">{title}</span>
          {badge ? (
            <span className="shrink-0 rounded-sm bg-muted px-1.5 py-0.5 font-medium">{badge}</span>
          ) : null}
          {copyButton}
        </figcaption>
      ) : (
        <span className="absolute top-1.5 right-1.5 z-10">{copyButton}</span>
      )}
      <div
        // A group, not a region: a page of snippets should not fill the landmark list
        role="group"
        aria-label={[title ?? messages.code, typeof badge === 'string' ? badge : null]
          .filter(Boolean)
          .join(' · ')}
        tabIndex={0}
        className="scrollbar overflow-x-auto outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
      >
        <pre className="py-3 font-mono text-xs leading-5 text-secondary-foreground">
          <code className="grid w-max min-w-full">
            {lines.map((tokens, i) => {
              const number = i + 1;
              const mark = marks?.[number];
              return (
                <span
                  key={i}
                  data-mark={mark}
                  data-highlighted={highlighted.has(number) || undefined}
                  className={cn(
                    'flex pr-4',
                    'data-highlighted:bg-skylab-500/10 data-highlighted:shadow-[inset_2px_0_0_var(--color-skylab-400)]',
                    'data-[mark=added]:bg-success/10 data-[mark=removed]:bg-destructive/10',
                  )}
                >
                  {lineNumbers ? (
                    <span
                      aria-hidden
                      className="w-10 shrink-0 pr-3 text-right text-faint-foreground tabular-nums select-none"
                    >
                      {number}
                    </span>
                  ) : (
                    <span aria-hidden className="w-3 shrink-0" />
                  )}
                  {marks ? (
                    <span
                      aria-hidden
                      className={cn(
                        'w-4 shrink-0 select-none',
                        mark === 'added' && 'text-success',
                        mark === 'removed' && 'text-destructive',
                      )}
                    >
                      {mark === 'added' ? '+' : mark === 'removed' ? '−' : ''}
                    </span>
                  ) : null}
                  {mark ? (
                    <span className="sr-only">
                      {mark === 'added' ? messages.addedLine : messages.removedLine}:{' '}
                    </span>
                  ) : null}
                  <span className="whitespace-pre">
                    {tokens.length
                      ? tokens.map((token, j) => (
                          <span key={j} className={TOKEN_CLASS[token.kind] || undefined}>
                            {token.text}
                          </span>
                        ))
                      : '​'}
                  </span>
                </span>
              );
            })}
          </code>
        </pre>
      </div>
    </figure>
  );
}

/** Which lines of `before` went and which lines of `after` came, by their longest common run. */
export function diffLines(before: string, after: string) {
  const a = before.replace(/\n$/, '').split('\n');
  const b = after.replace(/\n$/, '').split('\n');
  const removed: Record<number, CodeLineMark> = {};
  const added: Record<number, CodeLineMark> = {};
  // Past a few hundred lines a full table costs more than the marks are worth
  if (a.length * b.length > 250_000) return { removed, added };
  const table = Array.from({ length: a.length + 1 }, () => new Array<number>(b.length + 1).fill(0));
  for (let i = a.length - 1; i >= 0; i--) {
    for (let j = b.length - 1; j >= 0; j--) {
      table[i]![j] =
        a[i] === b[j] ? table[i + 1]![j + 1]! + 1 : Math.max(table[i + 1]![j]!, table[i]![j + 1]!);
    }
  }
  let i = 0;
  let j = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) {
      i++;
      j++;
    } else if (table[i + 1]![j]! >= table[i]![j + 1]!) removed[++i] = 'removed';
    else added[++j] = 'added';
  }
  while (i < a.length) removed[++i] = 'removed';
  while (j < b.length) added[++j] = 'added';
  return { removed, added };
}

export type CodeComparisonProps = {
  before: string;
  after: string;
  language?: string;
  filename?: string;
  className?: string;
};

/** Two versions of a snippet side by side, the lines that went and came marked; stacked on phones. */
export function CodeComparison({
  before,
  after,
  language,
  filename,
  className,
}: CodeComparisonProps) {
  const { messages } = useSkylcn();
  const { removed, added } = useMemo(() => diffLines(before, after), [before, after]);
  return (
    <div data-slot="code-comparison" className={cn('grid min-w-0 gap-3 md:grid-cols-2', className)}>
      <CodeBlock
        code={before}
        language={language}
        filename={filename}
        badge={messages.before}
        marks={removed}
      />
      <CodeBlock
        code={after}
        language={language}
        filename={filename}
        badge={messages.after}
        marks={added}
      />
    </div>
  );
}
