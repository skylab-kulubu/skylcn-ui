import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axeViolations } from '../test/axe.js';
import { CodeBlock, CodeComparison, diffLines, tokenizeCode } from './code-block.js';

const kinds = (line: { text: string; kind: string }[]) =>
  line.filter((token) => token.kind !== 'plain').map((token) => `${token.kind}:${token.text}`);

describe('tokenizeCode', () => {
  it('colours keywords, names, calls, strings, numbers and comments in TypeScript', () => {
    const [line] = tokenizeCode("const Card = render('kart', 42); // not yet", 'ts');
    expect(kinds(line!)).toEqual([
      'keyword:const',
      'type:Card',
      'call:render',
      "string:'kart'",
      'number:42',
      'comment:// not yet',
    ]);
  });

  it('keeps a block comment coloured across its lines', () => {
    expect(kinds(tokenizeCode('/* one\ntwo */ x', 'js')[1]!)).toEqual(['comment:two */']);
  });

  it('knows JSX tags and props', () => {
    expect(kinds(tokenizeCode('<Button size="sm" />', 'tsx')[0]!)).toEqual([
      'tag:Button',
      'attr:size',
      'string:"sm"',
    ]);
  });

  it('tells keys from values in JSON and YAML', () => {
    expect(kinds(tokenizeCode('{ "name": "skylcn", "private": true }', 'json')[0]!)).toEqual([
      'property:"name"',
      'string:"skylcn"',
      'property:"private"',
      'keyword:true',
    ]);
    expect(kinds(tokenizeCode('  - name: build # step', 'yml')[0]!)).toEqual([
      'property:name',
      'comment:# step',
    ]);
  });

  it('knows CSS properties, values and at-rules', () => {
    expect(
      kinds(tokenizeCode('@media (width < 40rem) { .card { color: #fff; } }', 'css')[0]!),
    ).toEqual(['keyword:@media', 'number:40rem', 'type:.card', 'property:color', 'number:#fff']);
  });

  it('finds the command, flags and variables in shell', () => {
    expect(kinds(tokenizeCode('pnpm add -D vitest && echo $HOME # done', 'bash')[0]!)).toEqual([
      'call:pnpm',
      'attr:-D',
      'call:echo',
      'type:$HOME',
      'comment:# done',
    ]);
    expect(kinds(tokenizeCode('PORT=3000 pnpm dev', 'sh')[0]!)).toEqual(['type:PORT', 'call:pnpm']);
  });

  it('reads SQL keywords in any case and Python docstrings', () => {
    expect(kinds(tokenizeCode("SELECT id FROM members WHERE team = 'web'", 'sql')[0]!)).toEqual([
      'keyword:SELECT',
      'keyword:FROM',
      'keyword:WHERE',
      "string:'web'",
    ]);
    expect(kinds(tokenizeCode('def f():\n    """Belge"""', 'py')[1]!)).toEqual([
      'string:"""Belge"""',
    ]);
  });

  it('gives a language it does not know comments, strings and numbers only', () => {
    expect(kinds(tokenizeCode('const x = 1 // y', 'brainfuck')[0]!)).toEqual([
      'number:1',
      'comment:// y',
    ]);
  });
});

describe('diffLines', () => {
  it('marks the lines that went and the lines that came', () => {
    expect(diffLines('a\nb\nc', 'a\nB\nc\nd')).toEqual({
      removed: { 2: 'removed' },
      added: { 2: 'added', 4: 'added' },
    });
  });
});

describe('CodeBlock', () => {
  it('names its scroll region and copy button by the file and marks highlighted lines', () => {
    const { container } = render(
      <CodeBlock
        code={'const a = 1;\nconst b = 2;'}
        filename="app/page.tsx"
        highlightLines={[2]}
      />,
    );
    expect(screen.getByRole('group', { name: 'app/page.tsx' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Kopyala: app/page.tsx' })).toBeInTheDocument();
    const rows = container.querySelectorAll('code > span');
    expect(rows[1]).toHaveAttribute('data-highlighted');
  });

  it('tells screen readers which lines a comparison added and removed', async () => {
    const { container } = render(
      <CodeComparison before={'a\nb'} after={'a\nc'} filename="x.ts" language="ts" />,
    );
    expect(screen.getByRole('group', { name: 'x.ts · Önce' })).toBeInTheDocument();
    expect(screen.getAllByText(/silindi/)).toHaveLength(1);
    expect(screen.getAllByText(/eklendi/)).toHaveLength(1);
    expect(await axeViolations(container)).toEqual([]);
  });
});
