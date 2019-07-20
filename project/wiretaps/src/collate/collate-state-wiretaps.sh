#!/bin/sh

# The 2018 state-wiretaps file has 3 junk lines at the top, so we start the collation with 2018
csvstack --filenames --skip-lines 3 -n filename \
    data/collated/sheets/state-wiretaps/2018-sheet-0.csv \
    | csvcut -c 1-27 \
    > data/collated/state-wiretaps.csv


# the rest of the sheets follow the same format, so we can use csvstack:

csvstack --filenames -n filename \
    data/collated/sheets/state-wiretaps/201{7,6,5,4,3}-sheet-0.csv \
    | csvcut -c 1-27 \
    >> data/collated/state-wiretaps.csv
