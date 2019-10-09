;(function() {
  var margin = { top: 50, right: 50, bottom: 50, left: 50 }
  // var padding = { top: '25%', bottom: '25%' }
  var width = 750 - margin.left - margin.right
  var height = 500 - margin.top - margin.bottom

  var svg = d3
    .select('#chart3')
    .append('div')
    .classed('svg-container', true)
    .append('svg')
    .attr('preserveAspectRatio', 'xMinYMin meet')
    .attr('viewBox', [0, 0, 750, 500])
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

  // Build your scales here
  var xPositionScale = d3.scaleLinear().range([0, width])
  var yPositionScale = d3
    .scaleLinear()
    .domain([0, 100])
    .range([height, 0])

  const line = d3
    .area()
    .x(function(d) {
      return xPositionScale(+d.key)
    })
    .y(function(d) {
      return yPositionScale(+d.value)
    })

  d3.csv('spotify_punk_playlists.csv')
    .then(ready)
    .catch(function(err) {
      console.log('Failed with', err)
    })

  function ready(datapoints) {
    const nested = d3
      .nest()
      .key(d => +d.song_release_date)
      .rollup(values => d3.max(values, v => +v.song_popularity))
      .entries(datapoints)

    // const sorted = nested.sort(function(a, b) {
    //   if (+a.value > +b.value) {
    //     return 1
    //   } else if (+b.value < +a.value) {
    //     return -1
    //   } else {
    //     return 0
    //   }
    // })

    // console.log(sorted)
    const allDates = datapoints.map(d => d.song_release_date)
    xPositionScale.domain(d3.extent(allDates))

    svg
      .append('path')
      .datum(nested)
      .attr('d', line)
      .attr('fill', 'none')
      .attr('stroke', 'white')
      .attr('stroke-width', 2)

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
          .style('left', d3.event.pageX + 15 + 'px')
          .style('top', d3.event.pageY - 35 + 'px')
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
      .tickPadding(10)
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
