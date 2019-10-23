import * as d3 from 'd3'

const margin = { top: 50, left: 50, right: 50, bottom: 50 }
const height = 400 - margin.top - margin.bottom
const width = 700 - margin.left - margin.right

const svg = d3
  .select('#chart-1')
  .append('svg')
  .style('background-color', '#F0F0F0')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

const xPositionScale = d3.scaleLinear().range([0, width])

const yPositionScale = d3
  .scaleLinear()
  .domain([0, 1])
  .range([height, 0])

const line = d3
  .line()
  .x(d => xPositionScale(+d.year))
  .y(d => yPositionScale(+d.unknown / +d.total))

d3.csv(require('../data/per_year.csv')).then(ready)

function ready(datapoints) {
  console.log('Data read in:', datapoints)
  const dates = datapoints.map(d => +d.year)
  xPositionScale.domain(d3.extent(dates))

  const yAxis = d3
    .axisLeft(yPositionScale)
    .tickFormat(d3.format('.0%'))
    .tickValues([0, 0.2, 0.4, 0.6, 0.8, 1])
    .tickSize(-width)
    .tickPadding(10)

  svg
    .append('g')
    .attr('class', 'axis y-axis grid')
    .call(yAxis)
    .selectAll('text')
    .attr('font-size', 12)

  const xAxis = d3
    .axisBottom(xPositionScale)
    .tickFormat(d3.format('d'))
    // .tickValues([2000,2008, 2017])
    .tickSize(-height)
    .tickPadding(10)

  svg
    .append('g')
    .attr('class', 'axis x-axis grid')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis)
    .selectAll('text')
    .attr('font-size', 12)

  svg.selectAll('.domain').remove()
  svg.selectAll('line').attr('stroke', '#D4D4D4')

  // svg
  //   .selectAll('circle')
  //   .data(datapoints)
  //   .enter()
  //   .append('circle')
  //   .attr('r', 5)
  //   .attr('cx', d => xPositionScale(+d.year))
  //   .attr('cy', d => yPositionScale(+d.unknown / +d.total))
  //   .attr('fill', '#666666')

  svg
    .append('path')
    .datum(datapoints)
    .attr('d', line)
    .attr('fill', 'none')
    .attr('stroke', '#b2584c')
    .attr('stroke-width', 4)
}
