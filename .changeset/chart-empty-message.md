---
'@skylab-kulubu/skylcn-ui': patch
---

Charts take an `emptyMessage` for their empty state, DonutChart can drop its card with `framed={false}`, and a donut whose slices are all zero shows the empty state instead of a blank ring. An empty chart no longer shows its legend or the table switch.
