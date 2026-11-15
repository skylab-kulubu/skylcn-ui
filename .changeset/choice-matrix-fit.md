---
'@skylab-kulubu/skylcn-ui': patch
---

ChoiceMatrix picks its layout by its own width instead of the screen's: a table where it has 28rem and the table fits, else each row lists its answers under its name, on one line of chips when they fit, in equal cells of up to two lines when they do not, or as cards. A matrix in a narrow column of a wide page now turns into rows, and one with many columns no longer scrolls sideways. In rows, pressing the chosen answer again, or Space on it, clears the row, beside the clear button. A column is never narrower than its longest word, and the new `size` sets the cards' height like the other choice cards.
