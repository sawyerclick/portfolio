import * as d3 from 'd3'

// Set up margin/height/width
const margin = { top: 30, left: 30, right: 30, bottom: 30 }
const height = 125 - margin.top - margin.bottom
const width = 125 - margin.left - margin.right
// I'll give you the container
const container = d3.select('#chart-06')

// Create your scales
const xPositionScale = d3
  .scaleLinear()
  .domain([0, 60])
  .range([0, width])
const yPositionScale = d3
  .scaleLinear()
  .domain([0, 0.3])
  .range([height, 0])

// Create a d3.line function that uses your scales
const lineJapan = d3
  .area()
  .x(function(d) {
    return xPositionScale(d.Age)
  })
  .y0(height)
  .y1(function(d) {
    return yPositionScale(+d.ASFR_jp)
  })

const lineUS = d3
  .area()
  .x(function(d) {
    return xPositionScale(d.Age)
  })
  .y0(height)
  .y1(function(d) {
    return yPositionScale(+d.ASFR_us)
  })

// Read in your data
d3.csv(require('../data/fertility.csv'))
  .then(ready)
  .catch(err => {
    console.log('Failed with', err)
  })

// Build your ready function that draws lines, axes, etc
function ready(datapoints) {
  const nested = d3
    .nest()
    .key(function(d) {
      return d.Year
    })
    .entries(datapoints)

  container
    .selectAll('svg')
    .data(nested)
    .enter()
    .append('svg')
    .attr('height', height + margin.top + margin.bottom)
    .attr('width', width + margin.left + margin.right)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
    .each(function(d) {
      // console.log(d)
      const svg = d3.select(this)
      const name = d.key
      const datapoints = d.values
      const sumJP = d3.sum(datapoints.map(d => +d.ASFR_jp)).toFixed(2)
      const sumUS = d3.sum(datapoints.map(d => +d.ASFR_us)).toFixed(2)
      const usColor = '#2b83ba'
      const jpColor = '#d7191c'

      // U.S.
      svg
        .append('path')
        .datum(datapoints)
        .attr('d', lineUS)
        .attr('fill', usColor)
        .attr('fill-opacity', 0.5)
        .attr('stroke', 'none')

      // japan
      svg
        .append('path')
        .datum(datapoints)
        .attr('d', lineJapan)
        .attr('fill', jpColor)
        .attr('fill-opacity', 0.4)
        .attr('stroke', 'none')

      svg
        .append('text')
        .text(sumUS)
        .attr('x', 50)
        .attr('dy', 15)
        .attr('fill', usColor)
        .attr('text-anchor', 'middle')
        .attr('font-size', 10)

      svg
        .append('text')
        .text(sumJP)
        .attr('x', 50)
        .attr('dy', 25)
        .attr('fill', jpColor)
        .attr('text-anchor', 'middle')
        .attr('font-size', 10)

      svg
        .append('text')
        .text(name)
        .attr('x', width / 2)
        .attr('dy', -10)
        .attr('text-anchor', 'middle')
        .attr('font-size', 16)
        .attr('font-weight', 600)
        .attr('fill', 'gray')

      const xAxis = d3.axisBottom(xPositionScale).tickValues([15, 30, 45])
      svg
        .append('g')
        .attr('class', 'axis x-axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis)

      const yAxis = d3.axisLeft(yPositionScale).ticks(4)
      svg
        .append('g')
        .attr('class', 'axis y-axis')
        .call(yAxis)
    })
}
