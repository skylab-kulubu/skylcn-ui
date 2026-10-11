---
'@skylab-kulubu/skylcn-ui': patch
---

SkylabLoader now lights the mark the way Fatih Naz's forms-frontend loader does: seven groups from the centre out, a shimmer band and a soft halo from 32px, and a diagonal glint along a steel outline from 64px. It never fades below 20% (30% on the light theme), runs a 2.4s cycle in CSS only and holds still under reduced motion. The root is now a `span` that holds the mark; `size`, `state` and `className` work as before.
