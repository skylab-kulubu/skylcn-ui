---
'@skylab-kulubu/skylcn-ui': minor
---

DataList: a third press on a sorted column header leaves the rows unsorted, in the order they came, after the first direction and its reverse. `nextDataListSort(current, field, first?)` gives the same cycle to a list that keeps its own sort, and `sort` takes `null` for no sort.
