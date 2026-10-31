---
'@skylab-kulubu/skylcn-ui': patch
---

New CodeBlock shows code with its filename, line numbers, highlighted lines and a copy button, coloured by each language's own light rules with no dependency: JSX tags and props in tsx, keys in json and yaml, properties and at-rules in css, commands, flags and variables in bash, and the keywords and comments of python, go, sql and html, in new `--code-*` colour tokens that keep 4.5:1 in both themes. New CodeComparison sets two versions side by side and marks the lines that went and came, also in words for screen readers; `diffLines` and `tokenizeCode` are exported for other uses.
