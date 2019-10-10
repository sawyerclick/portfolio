import * as d3 from 'd3'

const margin = { top: 50, left: 60, right: 20, bottom: 30 }
const height = 200 - margin.top - margin.bottom
const width = 600 - margin.left - margin.right

const svg = d3
  .select('#chart-03')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

const widthScale = d3
  .scaleLinear()
  .domain([0, 100])
  .range([0, width])

const yPositionScale = d3
  .scaleBand()
  .range([height, 0])
  .paddingInner(0.15)

d3.csv(require('../data/animal-counts.csv'))
  .then(ready)
  .catch(err => {
    console.log(err)
  })

function ready(datapoints) {
  const animals = datapoints.map(d => d.kind)
  yPositionScale.domain(animals)

  svg
    .selectAll('rect')
    .data(datapoints)
    .enter()
    .append('rect')
    .attr('fill', 'lightpink')
    .attr('y', d => yPositionScale(d.kind))
    .attr('x', 0)
    .attr('height', yPositionScale.bandwidth())
    .attr('width', d => widthScale(d.count))

  const yAxis = d3.axisLeft(yPositionScale)
  svg
    .append('g')
    .attr('class', 'axis y-axis')
    .call(yAxis)

  const xAxis = d3.axisBottom(widthScale)
  svg
    .append('g')
    .attr('class', 'axis x-axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis)
}
