/* global describe test expect document */

const d3 = require('d3')

/* Fill in our fake web page with our actual index.html */
const fs = require('fs')
document.body.innerHTML = fs.readFileSync('src/index.html')

/* Run the code for our chart */
const chart = require('../src/scatter')

/* Unit tests */

describe('Testing the color scale', () => {
  test('Make sure Africa is the right color', () => {
    let color = chart.colorScale('Africa')
    expect(color).toBe('#cbd5e8')
  })
})

describe('Clicking the buttons', () => {
  test('If I click Africa, african places become red', () => {
    let circle = d3.select('circle')
    expect(circle.attr('fill')).toBe('#b2e2cd')

    d3.select('#africa').dispatch('click')
    expect(circle.attr('fill')).toBe('lightgray')
  })
})
