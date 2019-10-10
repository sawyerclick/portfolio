import * as d3 from 'd3'

const margin = { top: 30, left: 30, right: 30, bottom: 30 }
const height = 400 - margin.top - margin.bottom
const width = 680 - margin.left - margin.right

console.log('Building chart 2')

const svg = d3
  .select('#chart-02')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

// Create your scales
const xPositionScale = d3.scaleLinear().range([0, width])
const yPositionScale = d3.scaleLinear().range([height, 0])

const fillScale = d3
  .scaleOrdinal()
  .range(['#8dd3c7', '#ffffb3', '#bebada', '#fb8072', '#80b1d3'])

// Create a d3.line function
const line = d3
  .line()
  .x(function(d) {
    return xPositionScale(d.TIME)
  })
  .y(function(d) {
    return yPositionScale(+d.Value)
  })

// Import your data file
d3.csv(require('../data/alcohol-consumption.csv'))
  .then(ready)
  .catch(err => {
    console.log(err)
  })

function ready(datapoints) {
  const dateMax = d3.max(datapoints, d => d.TIME)
  xPositionScale.domain([2000, dateMax])
  // console.log("The x axis' min and max are:", dateMin, dateMax)

  const consumptionMax = d3.max(datapoints, d => +d.Value)
  // const consumptionMin = d3.min(datapoints, d => +d.Value)
  yPositionScale.domain([0, consumptionMax])
  // console.log("The y axis' min and max are:", 0, consumptionMax)

  const nested = d3
    .nest()
    .key(d => d.LOCATION)
    .entries(datapoints)

  // Draw your dots
  svg
    .selectAll('circle')
    .data(datapoints)
    .enter()
    .append('circle')
    .attr('r', 3)
    .attr('fill', d => fillScale(d.LOCATION))
    .attr('cx', d => xPositionScale(d.TIME))
    .attr('cy', d => yPositionScale(d.Value))

  // Draw your lines
  svg
    .selectAll('path')
    .data(nested)
    .enter()
    .append('path')
    .attr('fill', 'none')
    .attr('stroke', d => fillScale(d.key))
    .attr('stroke-width', 2)
    .attr('d', d => line(d.values))

  // Add your axes
  const xAxis = d3.axisBottom(xPositionScale).tickFormat(d3.format('d'))
  svg
    .append('g')
    .attr('class', 'axis x-axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis)

  const yAxis = d3.axisLeft(yPositionScale).ticks(7)
  svg
    .append('g')
    .attr('class', 'axis y-axis')
    .call(yAxis)
}
