var CANVASW = 1500
var CANVASH = 1000

var GRAPH_ORIGINX = 100
var GRAPH_ORIGINY = 100
var GRAPHW = 1200
var GRAPHH = 800

var ARROWW = 5
var ARROWL = 15

var AXESLEN = 700

var HASHMARKL = 5
var PADDINGX = 20
var PADDINGY = 45

var table
var numRows
var numColumns
var time
var ratings
var title
var colors
var highlightColor

function preload() {
  table = loadTable("presidents.csv", "csv", "header")
}

// only for display purpose, bad coding yikes!
function setup() {
  createCanvas(CANVASW, CANVASH)
  //count the columns
  numRows = table.getRowCount()
  numColumns = table.getColumnCount()

  time = table.getColumn("time")
  ratings = table.getColumn("rating")

  title = "Presidents Rating (100 high) from 1924 to 1974"

  colors = [
    color(50, 70, 117),
    color(67, 103, 186),
    color(84, 129, 235),
    color(140, 175, 255)
  ]

  highlightColor = color(150, 82, 217)
}

function draw() {
  background(255)
  drawGraph()
}

// Axes related stuff
function drawAxes() {
  beginShape()
  vertex(GRAPH_ORIGINX, GRAPH_ORIGINY)
  vertex(GRAPH_ORIGINX, GRAPH_ORIGINY + GRAPHH)
  vertex(GRAPH_ORIGINX + GRAPHW, GRAPH_ORIGINY + GRAPHH)
  endShape()

  drawArrows()
  drawHashMarks()
}

function drawArrows() {
  fill(51)
  // arrow for y axis
  beginShape(TRIANGLES)
  vertex(GRAPH_ORIGINX, GRAPH_ORIGINY)
  vertex(GRAPH_ORIGINX - ARROWW, GRAPH_ORIGINY + ARROWL)
  vertex(GRAPH_ORIGINX + ARROWW, GRAPH_ORIGINY + ARROWL)
  endShape()

  // arrow for x axis
  beginShape(TRIANGLES)
  vertex(GRAPH_ORIGINX + GRAPHW, GRAPH_ORIGINY + GRAPHH)
  vertex(GRAPH_ORIGINX + GRAPHW - ARROWL, GRAPH_ORIGINY + GRAPHH - ARROWW)
  vertex(GRAPH_ORIGINX + GRAPHW  - ARROWL, GRAPH_ORIGINY + GRAPHH + ARROWW)
  endShape()
}

function drawHashMarks() {
  drawHashMarksForYAxes()
  drawHashMarksForXAxes()
}
