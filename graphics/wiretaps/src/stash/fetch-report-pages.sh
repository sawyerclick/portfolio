BASE_URL='https://www.uscourts.gov/statistics-reports/wiretap-report'
DEST_DIR=data/stashed/reports
START_YEAR=2008
END_YEAR=2018

for y in $(seq $START_YEAR $END_YEAR); do
    url=${BASE_URL}-${y}
    destdir=${DEST_DIR}/${y}
    mkdir -p ${destdir}

    curl ${url} -o ${destdir}/wiretap-report-${y}.html
done
