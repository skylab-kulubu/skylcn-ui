---
'@skylab-kulubu/skylcn-ui': patch
---

Collapse puts its content on a layer of its own while the height moves, from the first frame, so the content is painted once and only clipped as it opens or closes instead of painted again on every frame; the layer goes once it settles, keeping text crisp. It takes `onSettle`, called when the content has finished opening or closing. BarList, ProportionBar and AnimatedNumber share one number formatter per locale instead of building one for every figure, which made a panel full of bars slow to open and a running number build one each frame.
