;(function() {
  // Build your SVG here
  // using all of that cut-and-paste magic
  var margin = { top: 50, right: 50, bottom: 50, left: 50 }
  var padding = { top: '25%', bottom: '25%' }
  var width = 750 - margin.left - margin.right
  var height = 500 - margin.top - margin.bottom

  var svg = d3
    .select('#chart1')
    .append('svg')
    // .style('margin-left', 0)
    // .style('margin-right', 0)
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

  // Build your scales here
  var xPositionScale = d3
    .scaleLinear()
    .domain([0, 1])
    .range([0, width])
  // var yPositionScale = d3
  //   .scaleLinear()
  //   .domain([0, 1])
  //   .range([height, 0])
  var radiusScale = d3
    .scaleSqrt()
    .domain([0, 100])
    .range([1, 5])

  var keys = ['Energy', 'Danceability', 'Valence']

  var color = d3
    .scaleOrdinal()
    .domain(keys)
    .range(['#C7493A', '#5CDB95', '#dbc269'])

  // Add one dot in the legend for each name.
  svg
    .selectAll('mydots')
    .data(keys)
    .enter()
    .append('circle')
    .attr('cx', function(d, i) {
      return 0 + i * 250
    })
    .attr('cy', 0) // 100 is where the first dot appears. 25 is the distance between dots
    .attr('r', 7)
    .style('fill', function(d) {
      return color(d)
    })

  // Add one dot in the legend for each name.
  svg
    .selectAll('mylabels')
    .data(keys)
    .enter()
    .append('text')
    .attr('x', function(d, i) {
      return 0 + i * 260
    })
    .attr('y', 0)
    .style('fill', function(d) {
      return color(d)
    })
    .text(function(d) {
      return d
    })
    .attr('text-anchor', 'left')
    .style('alignment-baseline', 'middle')

  d3.csv('spotify_punk_playlists.csv')
    .then(ready)
    .catch(function(err) {
      console.log('Failed with', err)
    })

  function ready(datapoints) {
    // catching variables for scale domains
    // var loudness = datapoints.map(function(d) {
    //   return d.loudness
    // })
    // xPositionScale.domain(loudness)

    // Add and style your marks here

    // energy
    svg
      .selectAll('circle')
      .data(datapoints)
      .enter()
      .append('circle')
      .attr('cy', 200)
      .attr('cx', d => xPositionScale(d.energy))
      .attr('fill', '#C7493A')
      .attr('fill-opacity', 0.3)
      .attr('r', 0)
      .transition()
      .duration(1000)
      .ease(d3.easeQuad)
      .attr('r', d => radiusScale(d.song_popularity))

    // danceability
    svg
      .selectAll('svg')
      .data(datapoints)
      .enter()
      .append('circle')
      .attr('cy', 250)
      .attr('cx', d => xPositionScale(d.danceability))
      .attr('fill', '#5CDB95')
      .attr('r', 0)
      .attr('fill-opacity', 0.3)
      .transition()
      .duration(1000)
      .ease(d3.easeQuad)
      .attr('r', d => radiusScale(d.song_popularity))

    // danceability
    svg
      .selectAll('svg')
      .data(datapoints)
      .enter()
      .append('circle')
      .attr('cy', 150)
      .attr('cx', d => xPositionScale(d.valence))
      .attr('fill', '#dbc269')
      .attr('r', 0)
      .attr('fill-opacity', 0.3)
      .transition()
      .duration(1000)
      .ease(d3.easeQuad)
      .attr('r', d => radiusScale(d.song_popularity))

    var xAxis = d3.axisBottom(xPositionScale)
    svg
      .append('g')
      .attr('class', 'axis x-axis axisWhite')
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis)
  }
})()
