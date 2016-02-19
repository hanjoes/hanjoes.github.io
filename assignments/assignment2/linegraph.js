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

var DEFAULT_RADIAN = 10

var table
var numRows
var numColumns
var time
var ratings
var title
var colors
var highlightColor
var points = []

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

function drawGraph() {
  drawAxes()
  drawPoints()
  drawLegends()
  drawTitle()
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

function drawHashMarksForYAxes() {
  var numHashMarks = 100
  var hashMarkL = GRAPH_ORIGINX
  var hashMarkR = hashMarkL + HASHMARKL
  var dist = (GRAPHH - PADDINGY) / numHashMarks
  for (var i = 1; i <= numHashMarks; ++i) {
    var hashMarkY = GRAPH_ORIGINY + GRAPHH - (i * dist)
    if (i % 10 == 0) {
      drawTextForYHashMarkAtY(hashMarkY, hashMarkR, i.toString())
      stroke(51)
      line(hashMarkL, hashMarkY, hashMarkR, hashMarkY)
    }
  }
  // attribute name for y axis
  drawTextForYHashMarkAtY(GRAPH_ORIGINY, hashMarkR, "rating")
}

function drawHashMarksForXAxes() {
  var numHashMarks = numRows
  var dist = GRAPHW - 2 * PADDINGX
  var unitDist = dist / numHashMarks
  var startX = GRAPH_ORIGINX + PADDINGX
  var hashMarkB = GRAPH_ORIGINY + GRAPHH - 1
  var hashMarkU = hashMarkB - HASHMARKL
  for (var i = 0; i < numHashMarks; ++i) {
    var hashMarkX = startX + (i * unitDist)
    stroke(51)
    line(hashMarkX, hashMarkB + HASHMARKL, hashMarkX, hashMarkB)
    if (i % 4 == 0) {
      push()
      var x = hashMarkX
      var y = hashMarkB + 5
      translate(x, y)
      rotate(PI / 4)
      drawTextForXHashMark(0, 0, time[i])
      pop()
    }
  }
  // attribute name for x axis
  var x = GRAPH_ORIGINX + GRAPHW
  var y = GRAPH_ORIGINY + GRAPHH
  drawTextForXHashMark(x, y, "year")
}

function drawTextForYHashMarkAtY(hashMarkY, hashMarkL, str) {
  var len = str.length * 10
  var height = 15;
  var padding = 10
  var x = hashMarkL - padding - len
  var y = hashMarkY - height / 2

  textAlign(RIGHT)
  text(str, x, y, len, height)
}

function drawTextForXHashMark(x, y, str) {
  var len = str.length * 10
  var height = 15

  text(str, x, y, len, height)
}

function drawPoints() {
  var distY = (GRAPHH - PADDINGY) / 100
  var distX = (GRAPHW - 2 * PADDINGX) / numRows

  var startX = GRAPH_ORIGINX + PADDINGX
  var previousX
  var previousY
  // we do this in two passes in order for the points not overrlapped
  // by the lines.
  for (var i = 0; i < numRows; ++i) {
    var val = ratings[i]
    var x = startX + (i * distX)
    var y = GRAPH_ORIGINY +GRAPHH - parseFloat(val) * distY
    var color = getColorForBar(i % 4, x, y, DEFAULT_RADIAN, val)

    if (i > 0) {
      stroke(100)
      line(previousX, previousY, x, y)
    }
    // record
    points.push({x: x, y: y, r: DEFAULT_RADIAN, color: color})
    previousX = x
    previousY = y
  }

  points.forEach(function drawPoint(p) {
    fill(p.color)
    noStroke()
    ellipse(p.x, p.y, p.r, p.r)
  })
}

function getColorForBar(index, x, y, r, val) {
  if (mouseX > x - r && mouseX < x + r && mouseY > y - r && mouseY < y + r) {
    drawToolTipForVal(val, x, y, r)
    return highlightColor
  }
  return colors[index]
}

function drawToolTipForVal(val, x, y, w) {
  fill(51)
  noStroke()
  textStyle(NORMAL)
  textAlign(CENTER)
  text(val, x, y - 20, w, 100)
}

function drawLegends() {
  // for the containing box
  var width = 80
  var height = 100
  var x = GRAPH_ORIGINX + GRAPHW - width
  var y = GRAPH_ORIGINY

  noFill()
  stroke(51)
  rect(x, y, width, height)

  // for contained boxes
  var padding = 10
  var boxL = 15
  var gap = (height - 2 * padding - 4 * boxL) / 3
  var textPadding = 10

  var originY = y + padding
  var originX = x + padding
  for (var i = 0; i < 4; ++i) {
    var curY = originY + i * (boxL + (i > 0 ? gap : 0))
    noStroke()
    fill(colors[i])
    rect(originX, curY, boxL, boxL)

    fill(51)
    textAlign(LEFT)
    var str = "=  Q" + (i+1).toString()
    var textLen = textWidth(text)
    text(str, originX + boxL + textPadding, curY, textLen, boxL)
  }
}

function drawTitle() {
  var textLen = textWidth(title)
  var padding = (GRAPHW - textLen) / 2

  fill(125)
  textAlign(CENTER)
  textStyle(BOLD)
  text(title, GRAPH_ORIGINX + padding, GRAPH_ORIGINY, textLen + 50, 20)
}
