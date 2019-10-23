import * as d3 from 'd3'
import d3Tip from 'd3-tip'
import d3Annotation from 'd3-svg-annotation'
d3.tip = d3Tip

const margin = { top: 50, left: 50, right: 50, bottom: 50 }
const height = 400 - margin.top - margin.bottom
const width = 700 - margin.left - margin.right

const svg = d3
  .select('#unknownsShaky')
  .append('svg')
  // .style('background-color', '#F0F0F0')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

// scales
const xPositionScale = d3.scaleLinear().range([0, width])

const yPositionScale = d3
  .scaleLinear()
  .domain([0, 1])
  .range([height, 0])

//  line generator
const line = d3
  .line()
  .x(d => xPositionScale(+d.year))
  .y(d => yPositionScale(+d.unknown / +d.total))

d3.csv(require('../data/per_year.csv')).then(ready)

function ready(datapoints) {
  const dates = datapoints.map(d => +d.year)
  xPositionScale.domain(d3.extent(dates))

  // generator to draw the avg rects
  function drawRects(startYear, endYear) {
    const filtered = datapoints.filter(function(d) {
      return +d.year >= startYear && +d.year <= endYear
    })

    const unknowns = d3.sum(filtered.map(d => +d.unknown))
    const total = d3.sum(filtered.map(d => +d.total))

    svg
      .append('rect')
      .data(filtered)
      .attr('fill', '#A2B7D2')
      .attr('y', yPositionScale(unknowns / total))
      .attr('x', xPositionScale(startYear))
      .attr('height', 5)
      .attr('width', xPositionScale(endYear) - xPositionScale(startYear))

    const annotations = [
      {
        type: d3Annotation.annotationCallout,
        note: {
          label: 'The 9-year average has jumped 10%',
          title: ' ',
          wrap: 150
        },
        data: { Date: 2013, Close: 0.37 },
        subject: { radius: 10 },
        dy: -75,
        dx: 0,
        color: 'gray',
        connector: ['disable']
      }
    ]

    const makeAnnotations = d3Annotation
      .annotation()
      .accessors({
        x: d => xPositionScale(d.Date),
        y: d => yPositionScale(d.Close)
      })
      .annotations(annotations)

    svg.call(makeAnnotations)
  }

  drawRects(2000, 2008)
  drawRects(2009, 2017)

  svg
    .append('path')
    .datum(datapoints)
    .attr('d', line)
    .attr('fill', 'none')
    .attr('stroke', '#b2584c')
    .attr('stroke-width', 4)
    .attr('stroke-dasharray', 2000 + ' ' + 2000)
    .attr('stroke-dashoffset', 2000)
    .transition()
    .duration(4000)
    .ease(d3.easeLinear)
    .attr('stroke-dashoffset', 0)

  svg
    .selectAll('circle')
    .data(datapoints)
    .enter()
    .append('circle')
    .attr('r', 10)
    .attr('cx', d => xPositionScale(+d.year))
    .attr('cy', d => yPositionScale(+d.unknown / +d.total))
    .attr('fill', 'transparent')

  // make the axis
  const yAxis = d3
    .axisLeft(yPositionScale)
    .tickFormat(d3.format('.0%'))
    .tickValues([0, 0.2, 0.4, 0.6, 0.8, 1])
    .tickSize(-width)
    .tickPadding(10)

  svg
    .append('g')
    .attr('class', 'axis y-axis grid')
    .lower()
    .call(yAxis)
    .selectAll('text')
    .attr('font-size', 14)

  const xAxis = d3
    .axisBottom(xPositionScale)
    .ticks(5)
    .tickFormat(d3.format('d'))
    .tickPadding(10)

  svg
    .append('g')
    .attr('class', 'axis x-axis grid')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis)
    .selectAll('text')
    .attr('font-size', 14)

  svg.selectAll('.domain').remove()
  svg.selectAll('line').attr('stroke', '#D4D4D4')
}
