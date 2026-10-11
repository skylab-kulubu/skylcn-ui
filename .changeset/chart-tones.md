---
'@skylab-kulubu/skylcn-ui': patch
---

Charts take forms-frontend's look. DonutChart draws its slices in one lilac family (new `--chart-tone-1…5` tokens, one set per theme), parted by small gaps, with a list beside the ring giving each slice's count and share; pointing at a slice or a row (or focusing the row) brings it forward and writes its share in the hole, and pressing a row hides the slice. `palette="categorical"` keeps the eight distinct colours for unrelated groups. BarList bars are thicker and the largest value is drawn in the deep tone. A lone series in BarChart, AreaChart and LineChart takes the light lilac, and a single-series BarChart brings the pointed bar forward and dims the rest; compact bars are wider.
