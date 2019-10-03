;(function() {
  // var audio = d => song_preview)

  // Build your SVG here
  // using all of that cut-and-paste magic
  var margin = { top: 50, right: 50, bottom: 50, left: 50 }
  // var padding = { top: '25%', bottom: '25%' }
  var width = 1200 - margin.left - margin.right
  var height = 700 - margin.top - margin.bottom

  var svg = d3
    .select('#chart3')
    .append('svg')
    // .style('background-color', 'lightgray')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

  // Build your scales here
  var xPositionScale = d3
    .scaleLinear()
    .domain([1963, 2019])
    .range([0, width])
  var yPositionScale = d3
    .scaleLinear()
    .domain([0, 100])
    .range([height, 0])

  const line = d3
    .line()
    .x(d => xPositionScale(d.song_release_date))
    .y(d => yPositionScale(d.song_popularity))

  d3.csv('spotify_punk_playlists.csv')
    .then(ready)
    .catch(function(err) {
      console.log('Failed with', err)
    })

    svg
      .selectAll('circle')
      .data(datapoints)
      .enter()
      .append('circle')
      .attr('cy', d => yPositionScale(d.song_popularity))
      .attr('cx', d => xPositionScale(d.song_release_date))
      .attr('fill', '#566fa3')
      .attr('fill-opacity', 0.7)
      .attr('r', 4)
      .attr('class', d => d.artist_name.toLowerCase().replace(/[^a-z]*/g, ''))
      .on('mouseover', function(d) {
        d3.select('.tooltip')
          .style('opacity', 0)
          .transition()
          .duration(350)
          .style('opacity', 0.9)
        d3.select('.tooltip')
          .style('opacity', 0)
          .html(
            d.song_release_date +
              '<br/>' +
              d.artist_name +
              '<br/>' +
              d.song_name
          )
          .style('left', d3.event.pageX + 10 + 'px')
          .style('top', d3.event.pageY - 28 + 'px')
        d3.select(this).attr('r', '9')
      })
      .on('mouseout', function(d) {
        d3.select('.tooltip')
          .transition()
          .duration(350)
          .style('opacity', 0)
        d3.select(this)
          .transition()
          .duration(350)
          .attr('r', '4')
      })
      .on('click', d => {
        if (audio) {
          audio.pause()
        }
        audio = new Audio(d.song_preview)
        return audio.play()
      })

    d3.select('#popularity').on('click', function(d) {
      svg
        .selectAll('circle')
        .transition()
        .duration(350)
        .attr('cy', d => yPositionScale(d.song_popularity))
        .attr('fill', '#566fa3')
    })

    d3.select('#energy').on('click', function(d) {
      svg
        .selectAll('circle')
        .transition()
        .duration(350)
        .attr('cy', d => yPositionScale(d.energy * 100))
        .attr('fill', '#C7493A')
    })

    d3.select('#danceability').on('click', function(d) {
      svg
        .selectAll('circle')
        .transition()
        .duration(350)
        .attr('cy', d => yPositionScale(d.danceability * 100))
        .attr('fill', '#5CDB95')
    })

    d3.select('#valence').on('click', function(d) {
      svg
        .selectAll('circle')
        .transition()
        .duration(350)
        .attr('cy', d => yPositionScale(d.valence * 100))
        .attr('fill', '#dbc269')
    })

    var xAxis = d3.axisBottom(xPositionScale).ticks(5, 'Y')

    svg
      .append('g')
      .attr('class', 'axis x-axis axisWhite')
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis)

    const yAxis = d3
      .axisLeft(yPositionScale)
      .tickSize(-width)
      .ticks(5)
      .tickFormat(d => d + '%')
    svg
      .append('g')
      .attr('class', 'axis y-axis axisWhite')
      .call(yAxis)

    svg.selectAll('.y-axis path').remove()
    svg
      .selectAll('.y-axis line')
      .attr('stroke-dasharray', 2)
      .attr('stroke', '#333333')
  }
})()
