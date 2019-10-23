import * as d3 from 'd3'

const margin = { top: 30, left: 30, right: 70, bottom: 30 }
const height = 400 - margin.top - margin.bottom
const width = 680 - margin.left - margin.right

const svg = d3
  .select('#chart-04')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

// scales
const xPositionScale = d3.scaleLinear().range([0, width])
const yPositionScale = d3.scaleLinear().range([height, 0])

// Line
const line = d3
  .line()
  .x(function(d) {
    return xPositionScale(d.Year)
  })
  .y(function(d) {
    return yPositionScale(+d.Value)
  })

function highlight(d) {
  if (d.Country === 'France' || d.key === 'France') {
    return '#2171b5'
  } else {
    return 'gray'
  }
}

// Import your data file using d3.csv
d3.csv(require('../data/air-emissions.csv'))
  .then(ready)
  .catch(err => {
    console.log(err)
  })

function ready(datapoints) {
  // Draw it all
  const dateMax = d3.max(datapoints, d => d.Year)
  const dateMin = d3.min(datapoints, d => d.Year)
  xPositionScale.domain([dateMin, dateMax])

  // const pollutionMax = d3.max(datapoints, d => +d.Value)
  yPositionScale.domain([0, 500])

  // Draw your areas
  const nested = d3
    .nest()
    .key(d => d.Country)
    .entries(datapoints)

  svg
    .selectAll('path')
    .data(nested)
    .enter()
    .append('path')
    .attr('fill', 'none')
    .attr('stroke', highlight)
    .attr('stroke-weight', 3)
    .attr('d', d => line(d.values))

  // svg
  //   .selectAll('circle')
  //   .data(datapoints)
  //   .enter()
  //   .append('circle')
  //   .attr('r', 3)
  //   .attr('fill', highlight)
  //   .attr('cx', d => xPositionScale(d.Year))
  //   .attr('cy', d => yPositionScale(d.Value))

  svg
    .selectAll('circle')
    .data(nested)
    .enter()
    .append('circle')
    .attr('fill', highlight)
    .attr('r', 3)
    .attr('cx', function(d) {
      const datapoints = d.values
      const decData = datapoints[datapoints.length - 1]
      return xPositionScale(decData.Year)
    })
    .attr('cy', function(d) {
      const datapoints = d.values
      const decData = datapoints[datapoints.length - 1]
      return yPositionScale(decData.Value)
    })

  svg
    .selectAll('text')
    .data(nested)
    .enter()
    .append('text')
    .text(d => d.key)
    .attr('fill', highlight)
    .attr('x', width)
    .attr('dx', 10)
    .attr('y', function(d) {
      const datapoints = d.values
      const decData = datapoints[datapoints.length - 1]
      return yPositionScale(decData.Value)
    })
    .attr('font-size', 12)
    .attr('alignment-baseline', 'middle')

  // Add your axes
  const xAxis = d3.axisBottom(xPositionScale).tickFormat(d3.format('d'))
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
