var Vis = {};

  var w = 600,
    h = 220,
    r=200;

  var svg = d3.select('#circle')
	  .append('svg')
	  .attr('width', w)
	  .attr('height', h);

	////////////////////////
	// Draw circles
	////////////////////////
	var circleData = [25, 50, 100]
  var circleGroup = svg.append('g')
	  .attr('class', 'circle-group');
  circleGroup.selectAll('circle')
  	.data(circleData)
  	.enter().append('circle')
  	.attr('cx', w/3/2)
  	.attr('cy', h/2)
  	.attr('r', function(d,i) { return (d); })
  	.on('mouseover', function(d,i) {
  		var c = d3.select(this);
  		var c_r = parseInt(c.attr('r'));
  		c.classed('small-circle', true);
  		c.transition()
  			.duration(800)
  			.attr('r', c_r+3)
  	})
  	.on('mouseout', function(d,i) {
  		var c = d3.select(this);
  		var c_r = parseInt(c.attr('r'));
  		c.classed('small-circle', true);
  		c.transition()
  			.duration(800)
  			.attr('r', c_r-3)
  	})
  	.transition()
  		.duration(function(d,i) { return i * 500; })
			.attr('transform', function(d,i) {
				var max_r = d3.max(circleData);
				return 'translate(' + i * 2 * max_r + ', 0)';
			})

	////////////////////////
	// Draw arcs
	////////////////////////
  var svg = d3.select('#arc')
	  .append('svg')
	  .attr('width', w)
	  .attr('height', h);

  var arc = d3.arc()
  	.innerRadius(75)
    .outerRadius(100)
    .startAngle(0);
 		
 	var tau = 2 * Math.PI;
  var arcData = [{endAngle: tau/2}, {endAngle: tau/3}, {endAngle: tau/4}];
  var arcGroup = svg.append('g')
	  .attr('class', 'arc-group');

	var background = arcGroup.append('path')
    .datum({endAngle: tau})
    .attr('d', arc)
    .style('fill', '#ddd')
    .attr('class', 'background-circle')
    .attr('transform', 'translate(100,100)');

	arcGroup.selectAll('arc')
	  .data(arcData)
	  .enter().append('path')
	  .attr('d', arc)
	  .style('fill', 'orange')
	  .attr('class', 'arc')
	  .transition()
  		.duration(function(d,i) { return i * 500; })
			.attr('transform', function(d,i) {
				var max_r = d3.max(circleData);
				var translateVal = i * 2 * max_r + 100;
				console.log(translateVal);
				return 'translate(' + translateVal + ', 100)';
			})

	////////////////////////
	// Draw pies
	////////////////////////
	var svg = d3.select('#pie')
	  .append('svg')
	  .attr('width', w)
	  .attr('height', h);

	var defs = svg.append("defs")
	defs.append("marker")
		.attrs(function(d,i) { 
			return {
				"id":"arrow",
				"viewBox":"0 -5 10 10",
				"refX":5,
				"refY":0,
				"markerWidth":4,
				"markerHeight":4,
				"orient":"auto" 
			}
		})
		.append("path")
			.attr("d", "M0,-5L10,0L0,5")
			.attr("class","arrowHead");

	var pieGroup = svg.append('g')
	  .attr('class', 'pie-group');

  var numberTeams = 32;
  teamsData = '1'.repeat(numberTeams);
  
  var pie = d3.pie()
  	.sort(null)
    .value(function(d) { return d; });

  var arc = d3.arc()
 		.innerRadius(75)
    .outerRadius(100);
  
  pieGroup.selectAll('pie')
  	.data(pie(teamsData))
  	.enter().append('path')
  	.attr('d', arc)
  	.attr("class", "pie")
  	.attr('transform', 'translate(100, 100)');

  pieGroup.selectAll('pie2')
  	.data(pie(teamsData))
  	.enter().append('path')
  	.attr('d', arc)
  	.attr("class", "pie")
  	.attr('transform', 'translate(300, 100)');

  /*var g = svg.selectAll("arc")
	  .data(pie(teamsData))
		.enter().append("g")
	  .attr("class", "pie")
	  .attr('transform', 'translate(100, 100');

  g.append("path")
	  .attr("d", arc); */

	console.log(pie(teamsData));
	pieGroup.selectAll('circle')
	.data(pie(teamsData))
	.enter().append('circle')
	.each(function(d) {
		var centroid = arc.centroid(d);
		d3.select(this)
			.attr('cx', centroid[0])
			.attr('cy', centroid[1])
			.attr('r', 8)
			.attr('dy', '0.33em')
			.text('team');
	})
	.attr('transform', 'translate(300, 100)');

	/*pieGroup.selectAll('pie3')
  	.data(pie(teamsData))
  	.enter().append('path')
  	.attr('d', arc)
  	.attr("class", "pie")
  	.attr('transform', 'translate(500, 100)'); */

  var isTeamCentered = false;
	pieGroup.selectAll('circle2')
	.data(pie(teamsData))
	.enter().append('circle')
	.each(function(d) {
		var centroid = arc.centroid(d);
		d3.select(this)
			.attr('cx', centroid[0])
			.attr('cy', centroid[1])
			.attr('r', 8)
			.attr('dy', '0.33em')
			.attr('class', 'team')
			.text('team');
	})
	.attr('transform', 'translate(500, 100)')
	.on('mouseover', function(d,i) {
		d3.select(this).classed('team-hover', true);
	})
	.on('mouseout', function(d,i) {
		d3.select(this).classed('team-hover', false);
	})
	.on('click', function(d,i) {
		thisCircle = d3.select(this);
		if (thisCircle.classed('centered')) {
			d3.selectAll('line').remove();
			thisCircle
				.classed('centered', false)
				.transition()
					.duration(500)
					.attr('transform', 'translate(500,100)');
			isTeamCentered = false;
		} else if (!isTeamCentered) {
			isTeamCentered = true;
			x = parseInt(thisCircle.attr('cx'));
			x_trans = x < 0 ? 500 - x : 500 - x;
			y = parseInt(thisCircle.attr('cy'));
			y_trans = y < 0 ? 100 - y : 100 - y;
			//console.log('click: ', x, ' ', y);
			thisCircle
				.classed('centered', true)
				.transition()
					.duration(500)
				.attr('transform', 'translate(' + x_trans + ',' + y_trans + ')');
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
									return -1 * Math.cos(theta) * 8 * 2
								} else {
									return Math.cos(theta) * 8 * 2
								}
							})
							.attr('y1', function() { 
								if (centroid[0] < 0) {
									return -1 * Math.sin(theta) * 8 * 2
								} else {
									return Math.sin(theta) * 8 * 2
								}
							})
							//.attr('x2', centroid[0])
							//.attr('y2', centroid[1])
							.attr('x2', function() {
								var hyp = Math.sqrt(Math.pow(centroid[0],2) + Math.pow(centroid[1],2)) - (8 * 2);
								if (centroid[0] < 0) {
									return -1 * Math.cos(theta) * hyp;
								} else {
									return Math.cos(theta) * hyp;
								}
							})
							.attr('y2', function() {
								var hyp = Math.sqrt(Math.pow(centroid[0],2) + Math.pow(centroid[1],2)) - (8 * 2);
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
							.attr('opacity', '0')
							.transition()
							.delay(400)
							.attr('opacity', '1');
					}
				})
			//thisCircle.parentNode.appendChild(thisCircle);
		}
	});

