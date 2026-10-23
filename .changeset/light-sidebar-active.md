---
'@skylab-kulubu/skylcn-ui': patch
---

The sidebar's active item is easier to find in the light theme. In light, its highlight is now a raised piece of the page with a hairline edge, where the grey one had sat too close to the hover wash; dark keeps its wash. The new `--sidebar-active` and `--elevation-sidebar-active` tokens (`bg-sidebar-active`, `shadow-sidebar-active`) control it. An active item one level down, which has no highlight under it, now takes the brand colour for its label as well as its icon.
