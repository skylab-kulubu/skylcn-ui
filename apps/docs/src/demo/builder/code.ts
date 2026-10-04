import { BLOCK_BY_TYPE, type CodeOut } from './blocks';
import { LAYOUTS, type Page } from './model';

const indent = (text: string, spaces: number) =>
  text
    .split('\n')
    .map((line) => (line ? ' '.repeat(spaces) + line : line))
    .join('\n');

const sorted = (set: Set<string>) => [...set].sort((a, b) => a.localeCompare(b));

/** The built page as one TSX file a product can paste in: imports, sample data and the component. */
export function pageCode(page: Page, name = 'BuiltPage'): string {
  const imports = new Set<string>();
  const charts = new Set<string>();
  const icons = new Set<string>();
  const constants = new Map<string, string>();
  const hooks: string[] = [];

  const blockJsx = (type: string, props: Record<string, string | number | boolean>, id: string) => {
    const def = BLOCK_BY_TYPE.get(type);
    if (!def) return `{/* ${type} */}`;
    const out: CodeOut = def.code(props, id);
    out.imports?.forEach((n) => imports.add(n));
    out.charts?.forEach((n) => charts.add(n));
    out.icons?.forEach((n) => icons.add(n));
    for (const [key, value] of Object.entries(out.constants ?? {})) constants.set(key, value);
    hooks.push(...(out.hooks ?? []));
    return out.jsx;
  };

  const sections = page.sections.map((section) => {
    const layout = LAYOUTS[section.layout];
    const columns = section.columns.map((blocks) =>
      blocks.map((b) => blockJsx(b.type, b.props, b.id)).join('\n'),
    );
    if (layout.columns === 1) {
      const body = columns[0] ?? '';
      return body ? `<div className="flex flex-col gap-4">\n${indent(body, 2)}\n</div>` : '';
    }
    const inner = columns
      .map((body) =>
        body
          ? `<div className="flex min-w-0 flex-col gap-4">\n${indent(body, 2)}\n</div>`
          : '<div className="flex min-w-0 flex-col gap-4" />',
      )
      .join('\n');
    return `<div className="grid gap-4 ${layout.code}">\n${indent(inner, 2)}\n</div>`;
  });

  const lines: string[] = [];
  if (hooks.length) lines.push("'use client';", '', "import { useState } from 'react';");
  if (imports.size)
    lines.push(`import { ${sorted(imports).join(', ')} } from '@skylab-kulubu/skylcn-ui';`);
  if (charts.size)
    lines.push(`import { ${sorted(charts).join(', ')} } from '@skylab-kulubu/skylcn-ui/charts';`);
  if (icons.size) lines.push(`import { ${sorted(icons).join(', ')} } from 'lucide-react';`);
  for (const [key, value] of constants) lines.push('', `const ${key} = ${value};`);
  lines.push(
    '',
    `export default function ${name}() {`,
    ...hooks.map((hook) => `  ${hook}`),
    ...(hooks.length ? [''] : []),
    '  return (',
    '    <div className="flex flex-col gap-6">',
    indent(sections.filter(Boolean).join('\n'), 6),
    '    </div>',
    '  );',
    '}',
    '',
  );
  return lines.join('\n').replace(/\n{3,}/g, '\n\n');
}
