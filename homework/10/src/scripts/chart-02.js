import * as d3 from 'd3'

const margin = { top: 50, left: 20, right: 20, bottom: 30 }
const height = 300 - margin.top - margin.bottom
const width = 400 - margin.left - margin.right

const svg = d3
  .select('#chart-02')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

const xPositionScale = d3
  .scalePoint()
  .domain(['PG', 'SG', 'PF', 'C'])
  .range([0, width])
  .padding(0.3)

const yPositionScale = d3
  .scaleLinear()
  .domain([60, 160])
  .range([height, 0])

const radiusScale = d3.scaleSqrt().range([1, 8])
const colorScale = d3
  .scaleOrdinal()
  .range(['#8dd3c7', '#fdb462', '#bebada', '#fb8072', '#80b1d3'])

d3.csv(require('../data/player_stats.csv'))
  .then(ready)
  .catch(err => {
    console.log(err)
  })

function ready(datapoints) {
  const ppgMax = d3.max(datapoints, d => +d.PPG)
  radiusScale.domain([0, ppgMax])

  svg
    .selectAll('circle')
    .data(datapoints)
    .enter()
    .append('circle')
    .attr('r', '4')
    .attr('cx', d => xPositionScale(d.Pos))
    .attr('cy', d => yPositionScale(d.Weight))
    .attr('fill', d => colorScale(d.Pos))
    .attr('fill-opacity', 0.3)

  const yAxis = d3.axisLeft(yPositionScale)
  svg
    .append('g')
    .attr('class', 'axis y-axis')
    .call(yAxis)

  const xAxis = d3.axisBottom(xPositionScale)
  svg
    .append('g')
    .attr('class', 'axis x-axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis)
}
