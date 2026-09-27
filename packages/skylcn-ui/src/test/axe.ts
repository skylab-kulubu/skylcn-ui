import axe from 'axe-core';

/**
 * The accessibility rules a rendered tree breaks, as "rule: targets" lines.
 * Colour contrast needs real layout, so it is checked in the browser instead.
 */
export async function axeViolations(root: Element = document.body) {
  const result = await axe.run(root, {
    rules: { 'color-contrast': { enabled: false }, region: { enabled: false } },
  });
  return result.violations.map(
    (violation) =>
      `${violation.id}: ${violation.nodes.map((node) => node.target.join(' ')).join(', ')}`,
  );
}
