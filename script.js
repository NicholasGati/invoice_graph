//Declare variables
var width = 1100,
		height = 400,
		margin = {top: 40, right: 40, bottom: 40, left: 70 };

//The drawing area
var svg = d3.select("#invoices")
	.append("svg")
	.attr("width", width)
	.attr("height", height);

// Scale data
var x = d3.scale.ordinal().rangeRoundBands([margin.left, width - margin.right], 0.3);
var y = d3.scale.linear().range([height - margin.bottom, margin.top]);	

//Variables for x and y axis
var xAxis = d3.svg.axis().scale(x).orient("bottom");
var yAxis = d3.svg.axis().scale(y).orient("left");

//Reload Function
var reload = function() {
	d3.csv("invoice_sheet.csv", function(rows) {
		redraw(rows);
	});
}

// Redraw Function
var redraw = function(data) {
	x.domain(data.map(function(d,i) { return (i+1);}));
	y.domain([0, d3.max(data, function(d) {return +d.amount;})]);

	var bars = svg.selectAll("rect.bar").data(data);
	
	//Iterate through the bars and append rect element. Then set the class to bar.
	bars.enter().append("rect").classed("bar", true);

	//Set the x, y, height and width
	bars
		.attr("x", function(d,i) {return x(i+1); })
		.attr("width", x.rangeBand())
		.attr("y", y(0))
		.attr("height", 0)
		.transition()
		.delay(function(d,i) {return i * 100})
		.duration(1000)
		.attr("y", function(d) {return y(d.amount); })
		.attr("height", function(d) {return y(0) - y(d.amount); })
		.style("fill", function(d, i) {return (i%2)? "#F8BD67":"#4A76A1"});


	var axisData = [
		{axis: xAxis, dx: 0, dy: (height - margin.bottom)},
		{axis: yAxis, dx: margin.left, dy: 0}
	];

	//Create the axis and bind the data
	var axis = svg.selectAll("g.axis")
		.data(axisData);

	axis.enter().append("g").classed("axis", true);

	axis.each(function(d) {
		d3.select(this)
		.attr("transform", "translate(" + d.dx + "," + d.dy + ")")
		.classed("d.class", true)
		.call(d.axis)
	});

	// Text label for y axis
	svg.append("text")      
    .attr("x", 70 )
    .attr("y", 15 )
    .style("text-anchor", "middle")
    .text("Amount in USD");

  // Text label for x axis
  svg.append("text")      
    .attr("x","50%" )
    .attr("y", height)
    .style("text-anchor", "middle")
    .text("Invoices");  
	}

reload();