var Vis = {};

	var tooltip = d3.select('#chart-wrapper')
  .append('div')
  .attr('id', 'tooltip')
  .style('opacity', 0);

  var w = 400,
    h = 400,
    innerRadius = .5 * w,
    outerRadius = .4 * w,
    numberTeams = 32,
    teamRadius = (Math.PI * (outerRadius + innerRadius) / 2) / numberTeams - 2;

  var svg = d3.select('#circle')
	  .append('svg')
	  .attr('width', w)
	  .attr('height', h);

	var svg = d3.select('#pie')
	  .append('svg')
	  .attr('width', w)
	  .attr('height', h);

	var defs = svg.append('defs')
	defs.append('marker')
		.attrs(function(d,i) { 
			return {
				'id':'arrow',
				'viewBox':'0 -5 10 10',
				'refX':5,
				'refY':0,
				'markerWidth':4,
				'markerHeight':4,
				'orient':'auto' 
			}
		})
		.append('path')
			.attr('d', 'M0,-5L10,0L0,5')
			.attr('class','arrowHead');

	var pieGroup = svg.append('g')
	  .attr('class', 'pie-group');
	  //.attr('transform', 'translate(' + w/2 + ',' + h/2 + ')');

  
  //teamsData = '1'.repeat(numberTeams);
  teamsData = []
  for (var i = 1; i <= numberTeams; i++) {
  	var teamName = 'Team ' + i;
  	teamObj = {name: teamName, val: 1};
  	teamsData.push(teamObj);
  }
  
  var pie = d3.pie()
  	.sort(null)
    .value(function(d) { return d.val; });

  var arc = d3.arc()
 		.innerRadius(innerRadius)
    .outerRadius(outerRadius);

  var isTeamCentered = false;
	pieGroup.selectAll('circle')
	.data(pie(teamsData))
	.enter().append('circle')
	.each(function(d,i) {
		console.log('d:', d)
		var centroid = arc.centroid(d);
		d3.select(this)
			.attr('cx', centroid[0])
			.attr('cy', centroid[1])
			.attr('r', teamRadius)
			.attr('dy', '0.33em')
			.attr('class', 'team')
			.attr('popupHTML', d.data.name)
			.text('team');
	})
	.attr('transform', 'translate(' + w/2 + ',' + h/2 + ')')
	.on('mouseover', function(d,i) {
		d3.select(this).classed('team-hover', true);
		console.log(d3.select(this), d3.select(this).attr('popupHTML'))
		tooltip.transition()
      .duration(200)
      .style('opacity', .9);
    tooltip.html(d3.select(this).attr('popupHTML'))
      .style('left', d3.event.pageX + 10 + 'px')
      .style('top', d3.event.pageY + 10 + 'px');
	})
	.on('mouseout', function(d,i) {
		d3.select(this).classed('team-hover', false);
		tooltip.transition()
      .duration(200)
      .style('opacity', 0);
	})
	.on('click', function(d,i) {
		thisCircle = d3.select(this);
		tooltip.transition()
      .duration(200)
      .style('opacity', 0);
		x = parseInt(thisCircle.attr('cx'));
		y = parseInt(thisCircle.attr('cy'));
		if (thisCircle.classed('centered')) {
			d3.selectAll('line').remove();
			thisCircle
				.classed('centered', false)
				.transition()
					.duration(500)
					.attr('transform', 'translate(' + w/2 + ',' + h/2 + ')')
					//.attr('transform', null);
			isTeamCentered = false;
		} else if (!isTeamCentered) {
			isTeamCentered = true;
			thisCircle
				.classed('centered', true)
				.transition()
					.duration(500)
				.attr('transform', 'translate(' + (w/2 - x) + ',' + (h/2 - y) +')')
			// draw lines from center circle to circumference of all outer circles
			pieGroup.selectAll('line')
				.data(pie(teamsData))
				.enter().append('line')
				.each(function(d,i) {
					var centroid = arc.centroid(d),
						theta = Math.atan(centroid[1]/centroid[0]);
					console.log('theta: ', theta, 'i', i);
					if (i >= 0) {
						d3.select(this)
							//.attr('x1', 0)
							//.attr('y1', 0)
							.attr('x1', function() { 
								if (centroid[0] < 0) {
									return -1 * Math.cos(theta) * teamRadius * 1.5
								} else {
									return Math.cos(theta) * teamRadius * 1.5
								}
							})
							.attr('y1', function() { 
								if (centroid[0] < 0) {
									return -1 * Math.sin(theta) * teamRadius * 1.5
								} else {
									return Math.sin(theta) * teamRadius * 1.5
								}
							})
							//.attr('x2', centroid[0])
							//.attr('y2', centroid[1])
							.attr('x2', function() {
								var hyp = Math.sqrt(Math.pow(centroid[0],2) + Math.pow(centroid[1],2)) - (teamRadius * 1.5);
								if (centroid[0] < 0) {
									return -1 * Math.cos(theta) * hyp;
								} else {
									return Math.cos(theta) * hyp;
								}
							})
							.attr('y2', function() {
								var hyp = Math.sqrt(Math.pow(centroid[0],2) + Math.pow(centroid[1],2)) - (teamRadius * 1.5);
								if (centroid[0] < 0) {
									return -1 * Math.sin(theta) * hyp;
								} else {
									return Math.sin(theta) * hyp;
								}
							})
							.attr('class', function() {
								if (i < 10) {
									return 'trade low arrow';
								} else if (i < 20) {
									return 'trade moderate arrow';
								} else {
									return 'trade high arrow';
								}								
							})
							.attr('marker-end', 'url(#arrow)')
							.attr('transform', 'translate(500, 100)')
							.attr('transform', 'translate(' + w/2 + ',' + h/2 + ')')
							.attr('opacity', '0')
							.transition()
							.delay(400)
							.attr('opacity', '1');
					}
				});
		}
	});

