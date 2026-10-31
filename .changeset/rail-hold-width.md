---
'@skylab-kulubu/skylcn-ui': patch
---

The sidebar slides without stalling on heavy pages: while the panel moves, the page inside holds the width it will end at, so it lays out once instead of on every frame of the slide, and lets go when the slide ends. Reduced motion and phones are untouched.
