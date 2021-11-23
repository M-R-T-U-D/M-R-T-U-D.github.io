// Parameters
var width		= 750;
var height		= 750;
var defaultScale = 8700;
var centerLat	= 5.5;	
var centerLon  	= 52.2;
var scaleMinExtent = 1; // default scale
var scaleMaxExtent = 8;
var clickZoomScale = 5; // the scale to zoom to when region on the map is clicked

var myDate;
function updateDate() {
    myDate = document.getElementById("myDate").value;
    console.log(myDate);
}
// Append svg to body 
var svg = d3.select("#d3-map")
    .append("svg")
	.attr("width", width)
	.attr("height", height);
var g = svg.append("g");

// Adjust projection based on scale and center of the map 
var projection = d3.geoMercator()
    .center([centerLat, centerLon])     // GPS of location to zoom on
    .scale(defaultScale)                       // This is like the zoom
    .translate([ width/2, height/2 ])

// calculate geo path to be used for d tag in svg 
var path = d3.geoPath()
    .projection(projection)

// handle zooming into an area that has been clicked, with reset (reset zoom to initial default scale)
var active = d3.select(null);
function reset() {
    active = d3.select(null);
  
    svg.transition()
      .duration(750)
      .call(zoom.transform, d3.zoomIdentity);
}
var mouseclicked = function(dataOfPath) {  
    if (active.node() === this) return reset();
    active = d3.select(this);

    var bounds = path.bounds(dataOfPath);
    var x = (bounds[0][0] + bounds[1][0]) / 2;
    var y = (bounds[0][1] + bounds[1][1]) / 2;
    var translate = [width / 2 - clickZoomScale * x, height / 2 - clickZoomScale * y];

    svg.transition()
        .duration(750)
        .call(zoom.transform, d3.zoomIdentity.translate(translate[0], translate[1]).scale(clickZoomScale));
}

var zoomFunction = function() {
    g.attr("transform", d3.event.transform);
}

// create zoom funcionality for panning and zooming on the map.
// call it on svg so that the zoom funcionality is used on the map.
var zoom = d3.zoom()
    .translateExtent([[0, 0], [width, height]])
    .scaleExtent([scaleMinExtent, scaleMaxExtent])
    .on("zoom", zoomFunction);
svg.call(zoom);

d3.helper = {};

d3.helper.tooltip = function(accessor){
    return function(selection){
        var tooltipDiv;
        var bodyNode = d3.select('body').node();
        selection.on("mouseover", function(d, i){
            d3.select(this)
            .transition(0)
            .style("stroke", "blue")
            .style("stroke-width", "2");
            // Clean up lost tooltips
            d3.select('body').selectAll('div.tooltip').remove();
            // Append tooltip
            tooltipDiv = d3.select('body').append('div').attr('class', 'tooltip');
            var absoluteMousePos = d3.mouse(bodyNode);
            tooltipDiv.style('left', (absoluteMousePos[0] + 10)+'px')
                .style('top', (absoluteMousePos[1] - 15)+'px')
                .style('position', 'absolute') 
                .style('z-index', 1001);
            // Add text using the accessor function
            var tooltipText = accessor(d, i) || '';
            // Crop text arbitrarily
            //tooltipDiv.style('width', function(d, i){return (tooltipText.length > 80) ? '300px' : null;})
            //    .html(tooltipText);
        })
        .on('mousemove', function(d, i) {
            // Move tooltip
            var absoluteMousePos = d3.mouse(bodyNode);
            tooltipDiv.style('left', (absoluteMousePos[0] + 10)+'px')
                .style('top', (absoluteMousePos[1] - 15)+'px');
            var tooltipText = accessor(d, i) || '';
            tooltipDiv.html(tooltipText);
        })
        .on("mouseout", function(d, i){
            // Remove tooltip
            d3.select(this)
        .transition(0)
        .style("stroke", "black")
        .style("stroke-width", "1");
            tooltipDiv.remove();
        });

    };
};
// Load the polygon data of the Netherlands and show it.
d3.json("../data/nl.json", function(error, json) {
    if (error) throw error;
    g.selectAll("path")
        .data(json.features)
        .enter()
        .append("path")
        .attr("d", path)
        .on("click", mouseclicked)
        .call(d3.helper.tooltip(
            function(d){
              return "<b>"+d.properties.areaName + "</b>";
            }
            ));
});



