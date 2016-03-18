
var m = {l:10,r:20,t:10,b:10},
w = 100 - m.l - m.r,
h = 90 - m.t - m.b;

var svg = d3.select("#drawing")
.append("svg")
.attr("width", w + m.l + m.r)
.attr("height", w + m.t + m.b)
.attr("class", "heart")
.append("g")
.attr("transform", "translate(" + m.l + "," + m.t + ")");

var p1 = svg.append("rect")
.attr("class", "piece")
.attr("x", 24)
.attr("y", 0)
.attr("width", 21)
.attr("height", 15);

p1.transi

var p2 = svg.append("rect")
.attr("class", "piece")
.attr("x", 50)
.attr("y", 0)
.attr("width", 15)
.attr("height", 15);

var p3 = svg.append("rect")
.attr("class", "piece")
.attr("x", 10)
.attr("y", 18)
.attr("width", 35)
.attr("height", 21);

var p4 = svg.append("rect")
.attr("class", "piece")
.attr("x", 50)
.attr("y", 18)
.attr("width", 35)
.attr("height", 21);

var p5 = svg.append("rect")
.attr("class", "piece")
.attr("x", 26)
.attr("y", 42)
.attr("width", 20)
.attr("height", 15);

var p6 = svg.append("rect")
.attr("class", "piece")
.attr("x", 50)
.attr("y", 42)
.attr("width", 20)
.attr("height", 15);

var p7 = svg.append("rect")
.attr("class", "piece")
.attr("x", 37)
.attr("y", 60)
.attr("width", 10)
.attr("height", 10);

var p8 = svg.append("rect")
.attr("class", "piece")
.attr("x", 50)
.attr("y", 60)
.attr("width", 8)
.attr("height", 10);

var pieces = [p1,p2,p3,p4,p5,p6,p7,p8];

var start = Date.now();

d3.timer(function() {
  var elapsed = Date.now() - start
  if (elapsed % 13 == 0) {
    var scale = (elapsed % 2 == 0) ? 0.8 : 1.02;
    var sign = (elapsed % 2 == 0) ? "-" : "+";
    pieces.forEach(function(p, i) {
      var translate;
      if (i % 2 == 1) {
        // right pieces transforms a little right
        translate = "translate(" + sign + 4 + "," + 0 + ")";
      }
      else {
        // left pieces transforms a little left
        translate = "translate(" + sign + 4 + "," + 0 + ")";
      }
      // combine transflation and scale
      p.transition().duration(300)
      .attr("transform", "scale(" + scale + "), " + translate);
    });
  }
});
