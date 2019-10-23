import * as d3 from 'd3'

const margin = { top: 30, left: 100, right: 30, bottom: 30 }
const height = 400 - margin.top - margin.bottom
const width = 680 - margin.left - margin.right

console.log('Building chart 1')

const svg = d3
  .select('#chart-01')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

// Create a time parser
const parseTime = d3.timeParse('%Y-%m-%d')

// Create your scales

const xPositionScale = d3.scaleLinear().range([0, width])
const yPositionScale = d3.scaleLinear().range([height, 0])

// Create a d3.line function that uses your scales
const line = d3
  .line()
  .x(function(d) {
    return xPositionScale(d.datetime)
  })
  .y(function(d) {
    return yPositionScale(d.Close)
  })

d3.csv(require('../data/AAPL.csv'))
  .then(ready)
  .catch(err => {
    console.log(err)
  })

function ready(datapoints) {
  // After we read in our data, we need to clean our datapoints
  // up a little bit. d.Date is a string to begin with, but
  // treating a date like a string doesn't work well. So instead
  // we use parseTime (which we created up above) to turn it into a date.
  datapoints.forEach(function(d) {
    d.datetime = parseTime(d.Date)
  })

  // Update your scales
  const dateMax = d3.max(datapoints, d => +d.datetime)
  const dateMin = d3.min(datapoints, d => +d.datetime)
  xPositionScale.domain([dateMin, dateMax])
  // console.log("The x axis' min and max are:", dateMin, dateMax)

  const openMax = d3.max(datapoints, d => +d.Close)
  const openMin = d3.min(datapoints, d => +d.Close)
  yPositionScale.domain([openMin, openMax])
  // console.log("The y axis' min and max are:", openMin, openMax)

  // Draw your dots
  svg
    .selectAll('circle')
    .data(datapoints)
    .enter()
    .append('circle')
    .attr('fill', '#333333')
    .attr('r', 3)
    .attr('cx', d => xPositionScale(d.datetime))
    .attr('cy', d => yPositionScale(d.Close))

  // Draw your single
  svg
    .append('path')
    .datum(datapoints)
    .attr('d', line)
    .attr('stroke', '#333333')
    .attr('stroke-width', 2)
    .attr('fill', 'none')

  // Add your axes
  const xAxis = d3
    .axisBottom(xPositionScale)
    .tickFormat(d3.timeFormat('%m/%d/%y'))
    .ticks(5)
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
