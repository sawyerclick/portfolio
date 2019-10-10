import * as d3 from 'd3'

const margin = { top: 50, left: 60, right: 20, bottom: 30 }
const height = 300 - margin.top - margin.bottom
const width = 680 - margin.left - margin.right

const svg = d3
  .select('#chart-05')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

const xPositionScale = d3
  .scaleLinear()
  .domain([2001, 2007])
  .range([0, width])

const yPositionScale = d3
  .scaleLinear()
  .domain([0, 20])
  .range([height, 0])

// Line
const line = d3
  .line()
  .x(function(d) {
    return xPositionScale(+d.year)
  })
  .y(function(d) {
    return yPositionScale(+d.sales)
  })

function highlight(d) {
  if (d.key === 'coffee') {
    return 'red'
  } else {
    return 'lightgray'
  }
}

d3.csv(require('../data/product_sales.csv'))
  .then(ready)
  .catch(err => {
    console.log(err)
  })

function ready(datapoints) {
  const nested = d3
    .nest()
    .key(d => d.product)
    .entries(datapoints)

  console.log(nested)

  svg
    .selectAll('path')
    .data(nested)
    .enter()
    .append('path')
    .attr('fill', 'none')
    .attr('stroke', highlight)
    .attr('stroke-weight', 3)
    .attr('d', d => line(d.values))

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
