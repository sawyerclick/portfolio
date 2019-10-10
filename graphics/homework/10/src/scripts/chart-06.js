import * as d3 from 'd3'

const margin = { top: 50, left: 20, right: 20, bottom: 30 }
const height = 300 - margin.top - margin.bottom
const width = 490 - margin.left - margin.right

const svg = d3
  .select('#chart-06')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

const xPositionScale = d3
  .scaleLinear()
  .domain([170, 230])
  .range([0, width])

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

  // colorScale.domain(datapoints.map(d => d.Pos))

  svg
    .selectAll('circle')
    .data(datapoints)
    .enter()
    .append('circle')
    .attr('r', d => radiusScale(d.PPG))
    .attr('cx', d => xPositionScale(d.Height))
    .attr('cy', d => yPositionScale(d.Weight))
    .attr('fill', d => colorScale(d.Pos))
    .attr('fill-opacity', 0.5)
    .attr('class', d => d.Pos)
    .attr('id', function(d) {
      if (d.PPG >= 20) {
        return 'highPPG'
      }
    })
    .on('mouseover', function(d) {
      d3.selectAll('circle').attr('stroke', 'none')

      d3.select(this)
        .attr('stroke', '#333333')
        .attr('stroke-width', 1)
        .raise()

      d3.select('#playerName')
        .text('')
        .append('text')
        .text(d.Name)

      d3.select('#teamName')
        .text('')
        .append('text')
        .text(d.Team)
    })

  d3.select('#c').on('click', function(d) {
    svg
      .selectAll('circle')
      .attr('fill-opacity', 0.2)
      .attr('fill', 'lightgray')
    svg
      .selectAll('.C')
      .attr('fill-opacity', 0.6)
      .attr('fill', d => colorScale(d.Pos))
  })

  d3.select('#pg').on('click', function(d) {
    svg
      .selectAll('circle')
      .attr('fill-opacity', 0.2)
      .attr('fill', 'lightgray')
    svg
      .selectAll('.PG')
      .attr('fill-opacity', 0.6)
      .attr('fill', d => colorScale(d.Pos))
  })

  d3.select('#ppg').on('click', function(d) {
    svg
      .selectAll('circle')
      .attr('fill-opacity', 0.2)
      .attr('fill', 'lightgray')
    svg
      .selectAll('#highPPG')
      .attr('fill-opacity', 0.6)
      .attr('fill', d => colorScale(d.Pos))
      .raise()
  })

  d3.select('#reset').on('click', function(d) {
    svg
      .selectAll('circle')
      .attr('r', d => radiusScale(d.PPG))
      .attr('cx', d => xPositionScale(d.Height))
      .attr('cy', d => yPositionScale(d.Weight))
      .attr('fill', d => colorScale(d.Pos))
      .attr('fill-opacity', 0.5)
      .attr('class', d => d.Pos)
  })

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
