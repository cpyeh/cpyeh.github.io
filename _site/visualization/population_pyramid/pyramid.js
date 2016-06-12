// SET UP DIMENSIONS
var w = 600,
  h = 300;

// margin.middle is distance from center line to each y-axis
var margin = {
  top: 20,
  right: 20,
  bottom: 30,
  left: 20,
  middle: 28
};


// the width of each side of the chart
// <-regionWidth-><-middle-><-middle-><-regionWidth->
var regionWidth = w / 2 - margin.middle;

// these are the x-coordinates of the y-axes
var pointA = regionWidth; //left
var  pointB = w - regionWidth; //right

// svg transform string
function translation(x, y) {
  return 'translate(' + x + ',' + y + ')';
}

var pyramid_data_by_year;
var yScale;
var xScale;
var ageScale;
var multipleYearData = [];

d3.tsv('./pyramid.tsv', function(csv_data) {
  // Group data by year
  pyramid_data_by_year = d3.nest()
    .key(function(d) {
      return +d.year;
    })
    .entries(csv_data);

  d3.select(".chart")
    .append('p')
    .attr('id', 'year')
    .html('2016')
    .style('text-align', 'center');

  var chart = d3.select(".chart")
    .append('svg')
    .attr("height", h)
    .attr("width", w)
    .style('margin', 'auto')
    .style('display', 'block')
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.right + ')');

  var maxValue = Math.max(
    d3.max(csv_data, function(d) {
      return +d.male;
    }),
    d3.max(csv_data, function(d) {
      return +d.female;
    })
  );

  xScale = d3.scale.linear()
    .domain([0, maxValue/100])
    .range([0, regionWidth])
    .nice();

  yScale = d3.scale.ordinal()
    .domain(pyramid_data_by_year[0]['values'].map(function(d) {
      return d.age;
    }))
    .rangeRoundBands([h - margin.bottom, 0], 0.1);

  ageScale = d3.scale.linear()
    .domain([0,90])
    .range([2.5,92.5]);

  var yAxisLeft = d3.svg.axis()
    .scale(yScale)
    .orient('right')
    .tickSize(4, 0)
    .tickPadding(margin.middle - 4);

  var yAxisRight = d3.svg.axis()
    .scale(yScale)
    .orient('left')
    .tickSize(4, 0)
    .tickFormat('');

  var xAxisRight = d3.svg.axis()
    .scale(xScale)
    .tickValues([0.01, 0.02, 0.03, 0.04, 0.05, 0.06, 0.07])
    .tickSize(4, 1)
    .tickFormat(d3.format('%'));

  var xAxisLeft = d3.svg.axis()
    .scale(xScale.copy().range([pointA, 0]))
    .tickValues([0.01, 0.02, 0.03, 0.04, 0.05, 0.06, 0.07])
    .tickSize(4, 1)
    .tickFormat(d3.format('%'));

  var svg = d3.select('svg');
  // MAKE GROUPS FOR EACH SIDE OF CHART
  // scale(-1,1) is used to reverse the left side so the bars grow left instead of right
  var leftBarGroup = svg.append('g').attr('class', 'leftBarGroup')
    .attr('transform', translation(pointA, 0) + 'scale(-1,1)');
  var rightBarGroup = svg.append('g').attr('class', 'rightBarGroup')
    .attr('transform', translation(pointB, 0));


  // ADD MARKS
  svg.append('text')
    .text('Male')
    .attr('class', 'gender')
    .style('text-anchor', 'middle')
    .attr('transform', translation(w/10, h/10));
  svg.append('text')
    .text('Female')
    .attr('class', 'gender')
    .style('text-anchor', 'middle')
    .attr('transform', translation(w-w/10, h/10));


  // DRAW AXES
  svg.append('g')
    .attr('class', 'axis y left')
    .attr('transform', translation(pointA, 0))
    .call(yAxisLeft)
    .selectAll('text')
    .style('text-anchor', 'middle');

  svg.append('g')
    .attr('class', 'axis y right')
    .attr('transform', translation(pointB, 0))
    .call(yAxisRight);

  svg.append('g')
    .attr('class', 'axis x left')
    .attr('transform', translation(0, h-margin.bottom))
    .call(xAxisLeft);

  svg.append('g')
    .attr('class', 'axis x right')
    .attr('transform', translation(pointB, h-margin.bottom))
    .call(xAxisRight);

});

function update(data) {

  // DRAW BARS
  var leftBars = d3.select('.leftBarGroup').selectAll('rect').data(data);
  leftBars.attr('class','update');

  var rightBars = d3.select('.rightBarGroup').selectAll('rect').data(data);
  rightBars.attr('class','update');

    leftBars.enter().append('rect')
    .attr('class', 'enter')
    .attr('x', 0)
    .attr('height', yScale.rangeBand());

    // male
    leftBars.transition()
      .duration(100).attr('y', function(d) {
      return yScale(d.age);
    })
    .attr('width', function(d) {
      return xScale(+d.male/100);
    });

    rightBars.enter().append('rect')
     .attr('class', 'enter')
     .attr('x', 0)
    .attr('height', yScale.rangeBand());

    // female
    rightBars.transition()
      .duration(100).attr('y', function(d) {
      return yScale(d.age);
    })
    .attr('width', function(d) {
      return xScale(+d.female/100);
    });

}

var current_year = 2016;

function changeYear() {
  if (current_year < 2061){
    current_year += 1;
  }
  else{
    current_year = 1975;
  }
  document.getElementById("year").innerHTML = current_year;
  var year_data = pyramid_data_by_year[current_year - 1975]['values'];
  //year_data = year_data.map(function(d) {
  //  return d.female + ',' + d.male + ',' + d.age;
  //});
  update(year_data);
};

setInterval(changeYear, 100);
