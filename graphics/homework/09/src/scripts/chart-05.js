import * as d3 from 'd3'

// Set up margin/height/width
const margin = { top: 30, left: 30, right: 125, bottom: 30 }
const height = 700 - margin.top - margin.bottom
const width = 680 - margin.left - margin.right

// Add your svg
const svg = d3
  .select('#chart-05')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

// Create a time parser (see hints)
const parseTime = d3.timeParse('%B-%Y')

// Create your scales
const xPositionScale = d3.scaleLinear().range([0, width])
const yPositionScale = d3.scaleLinear().range([height, 0])
const fillScale = d3
  .scaleOrdinal()
  .range([
    '#8dd3c7',
    '#ffffb3',
    '#bebada',
    '#fb8072',
    '#80b1d3',
    '#fdb462',
    '#b3de69',
    '#fccde5',
    '#d9d9d9',
    '#bc80bd'
  ])

// Create a d3.line function that uses your scales
const line = d3
  .line()
  .x(function(d) {
    return xPositionScale(d.datetime)
  })
  .y(function(d) {
    return yPositionScale(+d.price)
  })

// Read in your housing price data
// Import your data file using d3.csv
d3.csv(require('../data/housing-prices.csv'))
  .then(ready)
  .catch(err => {
    console.log(err)
  })

// Write your ready function
function ready(datapoints) {
  // Convert your months to dates
  datapoints.forEach(function(d) {
    d.datetime = parseTime(d.month)
  })

  // Get a list of dates and a list of prices

  // Get a list of all my ages
  const dates = datapoints.map(d => +d.datetime)
  xPositionScale.domain(d3.extent(dates))

  const prices = datapoints.map(d => +d.price)
  yPositionScale.domain(d3.extent(prices))

  // Group your data together
  const nested = d3
    .nest()
    .key(d => d.region)
    .entries(datapoints)

  svg
    .selectAll('path')
    .data(nested)
    .enter()
    .append('path')
    .attr('fill', 'none')
    .attr('stroke', d => fillScale(d.key))
    .attr('stroke-width', 2)
    .attr('d', d => line(d.values))

  svg
    .selectAll('circle')
    .data(nested)
    .enter()
    .append('circle')
    .attr('fill', d => fillScale(d.key))
    .attr('r', 3)
    .attr('cx', function(d) {
      const datapoints = d.values
      const decData = datapoints[0]
      return xPositionScale(decData.datetime)
    })
    .attr('cy', function(d) {
      const datapoints = d.values
      const decData = datapoints[0]
      return yPositionScale(decData.price)
    })

  // Add your text on the right-hand side
  svg
    .selectAll('text')
    .data(nested)
    .enter()
    .append('text')
    .text(d => d.key)
    .attr('fill', 'gray')
    .attr('x', width)
    .attr('dx', 10)
    .attr('y', function(d) {
      const datapoints = d.values
      const decData = datapoints[0]
      return yPositionScale(decData.price)
    })
    .attr('font-size', 12)
    .attr('alignment-baseline', 'middle')
  // Add your title
  svg
    .append('text')
    .text('U.S. Housing Prices Fall in Winter')
    .attr('x', width / 2)
    .attr('dy', -10)
    .attr('text-anchor', 'middle')
    .attr('font-size', 22)
    .attr('font-weight', 600)
    .attr('fill', 'gray')
  // Add the shaded rectangle
  svg
    .append('rect')
    .attr('fill', 'lightgray')
    .attr('x', xPositionScale(parseTime('December-16')))
    .attr(
      'width',
      xPositionScale(parseTime('February-17')) -
        xPositionScale(parseTime('December-16'))
    )
    .attr('y', 0)
    .attr('height', height)
    .lower()

  // Add your axes
  const xAxis = d3.axisBottom(xPositionScale).tickFormat(d3.timeFormat('%b-%y'))
  svg
    .append('g')
    .attr('class', 'axis x-axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis)

  const yAxis = d3.axisLeft(yPositionScale)
  svg
    .append('g')
    .attr('class', 'axis y-axis')
    .call(yAxis)
}
