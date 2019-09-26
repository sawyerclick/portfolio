;(function() {
  // var audio = d => song_preview)

  // Build your SVG here
  // using all of that cut-and-paste magic
  var margin = { top: 150, right: 50, bottom: 50, left: 105 }
  var padding = { top: '25%', bottom: '25%' }
  var width = 750 - margin.left - margin.right
  var height = 225 - margin.top - margin.bottom

  var svg = d3
    .select('#chart1')
    .append('svg')
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
    .range([3, 9])

  var keys = ['Valence', 'Danceability', 'Energy']

  var color = d3
    .scaleOrdinal()
    .domain(keys)
    .range(['#dbc269', '#5CDB95', '#C7493A'])

  // Add one dot in the legend for each name.
  svg
    .selectAll('labels')
    .data(keys)
    .enter()
    .append('text')
    .text(d => d)
    .attr('x', -20)
    .attr('y', function(d, i) {
      return height - 20 - i * 50
    })
    .style('fill', d => color(d))
    .style('text-anchor', 'end')

  d3.csv('spotify_punk_playlists.csv')
    .then(ready)
    .catch(function(err) {
      console.log('Failed with', err)
    })

  function ready(datapoints) {
    let audio = null

    d3.select('i')
    .attr('class', 'fa fa-pause')
    .attr('x', 1500)
    .on('click', d => {
      if (audio) {
        audio.pause()
      }
    })
    
    d3.select('#all').on('click', function() {
      svg.selectAll('circle').attr('fill-opacity', 0)
      svg
        .selectAll('circle')
        .transition()
        .duration(1000)
        .ease(d3.easeQuad)
        .attr('fill-opacity', 0.3)
    })

    d3.select('#explicit').on('click', function() {
      svg.selectAll('circle').attr('fill-opacity', 0)
      svg
        .selectAll('.true')
        .transition()
        .duration(1000)
        .ease(d3.easeQuad)
        .attr('fill-opacity', 0.3)
    })

    d3.select('#notExplicit').on('click', function() {
      svg.selectAll('circle').attr('fill-opacity', 0)
      svg
        .selectAll('.false')
        .transition()
        .duration(1000)
        .ease(d3.easeQuad)
        .attr('fill-opacity', 0.3)
    })

    // energy
    svg
      .selectAll('circle')
      .data(datapoints)
      .enter()
      .append('circle')
      .attr('cy', height - 125)
      .attr('cx', d => xPositionScale(d.energy))
      .attr('fill', '#C7493A')
      .attr('fill-opacity', 0.3)
      .attr('r', d => radiusScale(d.song_popularity))
      .attr('class', d => d.song_explicit.toLowerCase())
      .attr('class', d => "id-"+d.id)

    svg
      .selectAll('svg')
      .data(datapoints)
      .enter()
      .append('circle')
      .attr('cy', height - 75)
      .attr('cx', d => xPositionScale(d.danceability))
      .attr('fill', '#5CDB95')
      .attr('fill-opacity', 0.3)
      .attr('r', d => radiusScale(d.song_popularity))
      .attr('class', d => d.song_explicit.toLowerCase())
      .attr('class', d => "id-"+d.id)

    // danceability
    svg
      .selectAll('svg')
      .data(datapoints)
      .enter()
      .append('circle')
      .attr('cy', height - 25)
      .attr('cx', d => xPositionScale(d.valence))
      .attr('fill', '#dbc269')
      .attr('fill-opacity', 0.3)
      .attr('r', d => radiusScale(d.song_popularity))
      .attr('class', d => d.song_explicit.toLowerCase())
      .attr('class', d => "id-"+d.id)

    var xAxis = d3.axisBottom(xPositionScale)
    svg
      .append('g')
      .attr('class', 'axis x-axis axisWhite')
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis)

      svg
      .selectAll('circle')
      .on('mouseover', function(d) {
        d3.select('.songbox .band')
          .text('')
          .append()
          .text(d.artist_name) 
        d3.select('.songbox .song')
          .text('')
          .append()
          .text(d.song_name)
        svg.selectAll(".id-"+d.id).transition().duration(200).attr('r', 15).attr('fill-opacity', 1)
       })

      .on('mouseout', function(){
        svg.selectAll('circle')
          .transition()
          .duration(200)
          .attr('r', d => radiusScale(d.song_popularity))
          .attr('fill-opacity', .3)})
  
      .on('click', d => {
        if (audio) {
          audio.pause()
        }
        audio = new Audio(d.song_preview)
        return audio.play(),
        svg.selectAll(".id-"+d.id).transition().duration(200).attr('r', 15).attr('fill-opacity', 1)
      })
  }
})()