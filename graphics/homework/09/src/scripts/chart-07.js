import * as d3 from 'd3'

// Create your margins and height/width
const margin = { top: 30, left: 50, right: 30, bottom: 30 }
const height = 250 - margin.top - margin.bottom
const width = 200 - margin.left - margin.right

// I'll give you this part!
const container = d3.select('#chart-07')

// Create your scales
const xPositionScale = d3
  .scaleLinear()
  .domain([1980, 2010])
  .range([0, width])
const yPositionScale = d3
  .scaleLinear()
  .domain([0, 20000])
  .range([height, 0])

// Create your line generator
const line = d3
  .line()
  .x(function(d) {
    return xPositionScale(d.year)
  })
  .y(function(d) {
    return yPositionScale(+d.income)
  })

// Read in your data
Promise.all([
  d3.csv(require('../data/middle-class-income.csv')),
  d3.csv(require('../data/middle-class-income-USA.csv'))
])
  .then(ready)
  .catch(err => {
    console.log('Failed with', err)
  })

// Create your ready function
function ready([datapointsAll, datapointsUSA]) {
  const nested = d3
    .nest()
    .key(function(d) {
      return d.country
    })
    .entries(datapointsAll)

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
      // console.log(name)
      // const datapoints = d.values
      const usColor = 'gray'
      const otherColor = '#9e4b6c'

      // U.S.
      svg
        .append('path')
        .datum(datapointsUSA)
        .attr('d', line)
        .attr('fill', 'none')
        .attr('stroke', usColor)
        .attr('stroke-width', 2)

      // Other Countries
      svg
        .append('path')
        .attr('fill', 'none')
        .attr('stroke', otherColor)
        .attr('stroke-width', 2)
        .attr('d', d => line(d.values))
      svg
        .append('text')
        .text('USA')
        .attr('x', width / 5)
        .attr('dy', 20)
        .attr('fill', 'gray')
        .attr('text-anchor', 'middle')
        .attr('font-size', 12)
        .attr('font-weight', 500)

      svg
        .append('text')
        .text(name)
        .attr('x', width / 2)
        .attr('dy', -10)
        .attr('text-anchor', 'middle')
        .attr('font-size', 16)
        .attr('font-weight', 600)
        .attr('fill', otherColor)

      const xAxis = d3
        .axisBottom(xPositionScale)
        .ticks(4)
        .tickFormat(d3.format('d'))
        .tickSize(-height)
      svg
        .append('g')
        .attr('class', 'axis x-axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis)

      const yAxis = d3
        .axisLeft(yPositionScale)
        .tickValues([5000, 10000, 15000, 20000])
        .tickFormat(d3.format('$'))
        .tickSize(-width)

      svg
        .append('g')
        .attr('class', 'axis y-axis')
        .call(yAxis)

      svg
        .selectAll('.tick line')
        .attr('stroke-dasharray', '1 1')
        .attr('stroke', 'lightgray')

      svg.selectAll('.domain').remove()
    })
}
