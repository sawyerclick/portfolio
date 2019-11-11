;(function() {
    d3.select('.fa-address-card')
    .on('mouseover', function() {
        d3.select('#about')
        .style('visibility', 'visible')
        .style('height', 'auto')
    })
    .on('mouseout', function() {
        d3.select('#about')
        .style('visibility', 'collapse')
        .style('height', 0)
    })
  })()
  