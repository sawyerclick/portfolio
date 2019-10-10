import * as d3 from 'd3'

// I'll give you margins/height/width
const margin = { top: 50, left: 20, right: 20, bottom: 30 }
const height = 250 - margin.top - margin.bottom
const width = 250 - margin.left - margin.right

// And grabbing your container
const container = d3.select('#chart-08')

// Create your scales
const xPositionScale = d3.scaleLinear().range([0, width])
const yPositionScale = d3.scaleLinear().range([height, 0])

// Create your area generator
const line = d3
  .area()
  .x(function(d) {
    return xPositionScale(+d.key)
  })
  .y0(height)
  .y1(function(d) {
    return yPositionScale(+d.value)
  })

//  setting colors
const vColdTemp = '#236085'
const coldTemp = '#96bccf'
const normalTemp = '#cac7c7'
const hotTemp = '#ee9f71'
const vHotTemp = '#c9604b'

// Read in your data, then call ready
d3.tsv(require('../data/climate-data.tsv'))
  .then(ready)
  .catch(err => {
    console.log('Failed with', err)
  })

// Write your ready function
function ready(datapoints) {
  const diff = datapoints.map(d => +d.diff)
  xPositionScale.domain(d3.extent(diff))

  const freq = datapoints.map(d => +d.freq)
  yPositionScale.domain([0, d3.max(freq)])

  // one function to rule them all
  function drawAllAreas(svg, startYear, endYear) {
    const filtered = datapoints.filter(d => {
      return d.year >= startYear && d.year <= endYear
    })

    const nested = d3
      .nest()
      .key(d => d.diff)
      .rollup(values => d3.mean(values, v => v.freq))
      .entries(filtered)

    function drawTemp(svg, data, minTemp, maxTemp, color) {
      svg
        .append('path')
        .datum(data)
        .attr('d', line)
        .attr('fill', color)
        .attr('fill-opacity', 0.9)
        .attr('stroke', 'none')
    }

    const vCold = nested.filter(function(d) {
      return d.key <= -3
    })
    const cold = nested.filter(function(d) {
      return d.key <= -0.9 && d.key >= -3
    })
    const normal = nested.filter(function(d) {
      return d.key >= -0.9 && d.key <= 0.9
    })
    const hot = nested.filter(function(d) {
      return d.key <= 3 && d.key >= 0.9
    })
    const vHot = nested.filter(function(d) {
      return d.key >= 3
    })

    drawTemp(svg, vCold, -3, -10, vColdTemp)
    drawTemp(svg, cold, -0.9, -3, coldTemp)
    drawTemp(svg, normal, -0.9, 0.9, normalTemp)
    drawTemp(svg, hot, 0.9, 3, hotTemp)
    drawTemp(svg, vHot, 3, 10, vHotTemp)

    svg
      .append('text')
      .text(startYear + ' to ' + endYear)
      .attr('x', width / 2)
      .attr('dy', -10)
      .attr('text-anchor', 'middle')
      .attr('font-size', 16)
      .attr('font-weight', 600)
      .attr('fill', 'gray')

    const xAxis = d3
      .axisBottom(xPositionScale)
      .tickValues([-3, -0.9, 0.9, 3])
      .tickSize(-height)

    svg
      .append('g')
      .attr('class', 'axis x-axis')
      .attr('stroke-dasharray', '2 2')
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis)
      .selectAll('text')
      .remove()

    svg.selectAll('.domain').remove()

    const fontSize = 8
    const fontWeight = 600
    const fontOffset = +12

    function axisText(text, position, anchor, fill) {
      svg
        .append('text')
        .text(text)
        .attr('x', xPositionScale(position))
        .attr('y', height)
        .attr('text-anchor', anchor)
        .attr('fill', fill)
        .attr('font-size', fontSize)
        .attr('font-weight', fontWeight)
        .attr('dy', fontOffset)
    }

    axisText('Extremely Cold', -3, 'end', vColdTemp)
    axisText('Cold', -3 - -0.9, 'middle', coldTemp)
    axisText('Normal', 0, 'middle', normalTemp)
    axisText('Hot', (0.9 + 3) / 2, 'middle', hotTemp)
    axisText('Extremely Hot', 3, 'start', vHotTemp)
  }

  // writes the background and saves me some copy + paste brain cells
  const data1951 = datapoints.filter(function(d) {
    return +d.year < 1981
  })
  const nested1951 = d3
    .nest()
    .key(d => d.diff)
    .rollup(values => d3.mean(values, v => v.freq))
    .entries(data1951)
  function background1951(svg) {
    svg
      .append('path')
      .datum(nested1951)
      .attr('d', line)
      .attr('fill', 'lightgray')
      .attr('fill-opacity', 0.5)
      .attr('stroke', 'none')
  }

  //  1951
  container
    .append('svg')
    .attr('height', height + margin.top + margin.bottom)
    .attr('width', width + margin.left + margin.right)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
    .each(function(d) {
      const svg = d3.select(this)
      drawAllAreas(svg, 1951, 1980)
    })

  // 1983 to 1993
  container
    .append('svg')
    .attr('height', height + margin.top + margin.bottom)
    .attr('width', width + margin.left + margin.right)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
    .each(function(d) {
      const svg = d3.select(this)
      background1951(svg)
      drawAllAreas(svg, 1983, 1993)
    })

  // 1994 to 2004
  container
    .append('svg')
    .attr('height', height + margin.top + margin.bottom)
    .attr('width', width + margin.left + margin.right)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
    .each(function(d) {
      const svg = d3.select(this)
      background1951(svg)
      drawAllAreas(svg, 1994, 2004)
    })

  // 2004 to 2015
  container
    .append('svg')
    .attr('height', height + margin.top + margin.bottom)
    .attr('width', width + margin.left + margin.right)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
    .each(function(d) {
      const svg = d3.select(this)
      background1951(svg)
      drawAllAreas(svg, 2005, 2015)
    })
}
