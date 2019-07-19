#!/usr/bin/env python3
import csv
from pathlib import Path
import requests

DEST_DIR = Path('data', 'stashed')
INVENTORY_PATH = DEST_DIR.joinpath('data-inventory.csv')

inventory = list(csv.DictReader(open(INVENTORY_PATH)))


for i in inventory:
    year = i['year']
    url = i['url']

    print("Downloading", url)
    resp = requests.get(url)
    if resp.status_code == 200:
        destdir = DEST_DIR.joinpath('reports', i['year'])
        destdir.mkdir(exist_ok=True, parents=True)
        destpath = destdir.joinpath("{n}.{x}".format(n=i['category'], x=i['file_format']))
        destpath.write_bytes(resp.content)
        print("- Wrote", len(resp.content), 'bytes to:', destpath)

    else:
        print("Error: Received status code", resp.status_code, "when downloading\n", url)
