import * as d3 from 'd3'
import d3Tip from 'd3-tip'
// import d3Annotation from 'd3-svg-annotation'
d3.tip = d3Tip

const margin = { top: 0, left: 50, right: 50, bottom: 50 }
const height = 400 - margin.top - margin.bottom
const width = 700 - margin.left - margin.right

const svg = d3
  .select('#growingAttacks')
  .append('svg')
  // .style('background-color', '#F0F0F0')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

// scales
const xPositionScale = d3
  .scaleBand()
  .range([0, width])
  .paddingInner(0.3)

const yPositionScale = d3
  .scaleLinear()
  .domain([0, 65])
  .range([height, 0])

// tip generator
const tip = d3
  .tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return `<strong>Unknown attacks: </strong> <span style='color:goldenrod'> ${d.unknown} </span><strong><br>Total attacks:</strong> <span style='color:goldenrod'> ${d.total} </span>`
  })

svg.call(tip)

//  line generator
// const lineTotal = d3
//   .line()
//   .x(d => xPositionScale(+d.year))
//   .y(d => yPositionScale(+d.total))

// const lineUnknown = d3
//   .line()
//   .x(d => xPositionScale(+d.year))
//   .y(d => yPositionScale(+d.unknown))

d3.csv(require('../data/per_year.csv')).then(ready)

function ready(datapoints) {
  console.log('Data read in:', datapoints)

  const years = datapoints.map(d => +d.year)
  xPositionScale.domain(years)

  svg
    .selectAll('.total')
    .data(datapoints)
    .enter()
    .append('rect')
    .attr('class', 'rect')
    .attr('x', d => xPositionScale(+d.year))
    .attr('width', xPositionScale.bandwidth())
    .attr('y', d => yPositionScale(+d.total))
    .attr('height', d => height - yPositionScale(+d.total))
    .attr('fill', 'lightgray')
    .on('mouseover', tip.show)
    .on('mouseout', tip.hide)

  svg
    .selectAll('.unknown')
    .data(datapoints)
    .enter()
    .append('rect')
    .attr('x', d => xPositionScale(+d.year))
    .attr('width', xPositionScale.bandwidth())
    .attr('y', d => yPositionScale(+d.unknown))
    .attr('height', d => height - yPositionScale(+d.unknown))
    .attr('fill', '#b2584c')

  // function drawLine(lineGenerator, color) {
  //   svg
  //     .append('path')
  //     .datum(datapoints)
  //     .attr('d', lineGenerator)
  //     .attr('fill', 'none')
  //     .attr('stroke', color)
  //     .attr('stroke-width', 4)
  //     .attr('stroke-dasharray', 2000 + ' ' + 2000)
  //     .attr('stroke-dashoffset', 2000)
  //     .transition()
  //     .duration(4000)
  //     .ease(d3.easeLinear)
  //     .attr('stroke-dashoffset', 0)
  // }
  // drawLine(lineTotal, 'lightgray')
  // drawLine(lineUnknown, '#b2584c')

  //   const annotations = [
  //     {
  //       type: d3Annotation.annotationCallout,
  //       note: {
  //         label: 'The 9-year average has jumped 10%',
  //         title: ' ',
  //         wrap: 150
  //       },
  //       data: { Date: 2013, Close: 0.37 },
  //       subject: { radius: 10 },
  //       dy: -75,
  //       dx: 0,
  //       color: 'gray',
  //       connector: ['disable']
  //     }
  //   ]

  //   const makeAnnotations = d3Annotation
  //     .annotation()
  //     .accessors({
  //       x: d => xPositionScale(d.Date),
  //       y: d => yPositionScale(d.Close)
  //     })
  //     .annotations(annotations)

  //   svg.call(makeAnnotations)
  // }

  // make the axis
  const yAxis = d3
    .axisLeft(yPositionScale)
    .tickValues([0, 20, 40, 60])
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
    .tickFormat(d3.format('d'))
    .tickPadding(0)

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
