---
'@skylab-kulubu/skylcn-ui': minor
---

ConfirmDialog eases its height when an error or a stall note appears instead of jumping, and `DialogBody animateHeight` does the same for a dialog whose content changes, such as a step that swaps in a longer form. Under reduced motion the height still changes at once.
