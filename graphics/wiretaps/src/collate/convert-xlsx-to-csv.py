#!/usr/bin/env python3
import csv
from pathlib import Path
from xlrd import open_workbook

SRC_DIR = Path('data', 'stashed', 'reports')
DEST_DIR = Path('data', 'collated', 'sheets')

def get_spreadsheets():
    return sorted(SRC_DIR.glob('**/*.xlsx'))

def extract_sheet_rows(sheet):
    datarows = []
    for j in range(sheet.nrows):
        values = [str(v).strip() for v in sheet.row_values(j)]
        # skip leading blank lines
        if len(datarows) == 0 and all(v == '' for v in values):
            next
        else:
            datarows.append(values)
    return datarows

def main():
    for srcpath in get_spreadsheets():
        print("Opening:", srcpath)
        year = srcpath.parent.name
        report_type = srcpath.stem

        wb = open_workbook(srcpath)

        for i, sheet in enumerate(wb.sheets()):

            # each sheet in each spreadsheet-workbook gets its own file, e.g.
            # data/collated/federal-wiretaps/2018-sheet-0.csv
            destdir = DEST_DIR.joinpath(report_type)
            destdir.mkdir(exist_ok=True, parents=True)
            destpath = destdir.joinpath("{y}-sheet-{n}.csv".format(y=year, n=i))

            inrows = extract_sheet_rows(sheet)
            with open(destpath, 'w') as w:
                print("- Writing", len(inrows), "rows to:", destpath)
                csv.writer(w).writerows(inrows)

if __name__ == '__main__':
    main()
