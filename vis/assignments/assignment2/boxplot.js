var CANVASW = 1500
var CANVASH = 1000

var GRAPH_ORIGINX = 100
var GRAPH_ORIGINY = 100
var GRAPHW = 300
var GRAPHH = 800

var VERTICAL_PADDING = 20
var HORIZONTAL_PADDING = 50

var HASHMARKL = 5
var WHISKERL = 15
var RADIAN = 8

var maxVal = Number.MIN_VALUE
var minVal = Number.MAX_VALUE

var table
var numRows
var numColumns
var time
var ratings
var title
var colors
var highlightColor
var numHashMarks
var distY
var whiskerY

var firstQuartile
var median
var thirdQuartile
var iqr

var outliers = []

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
  whiskerY = GRAPH_ORIGINY + VERTICAL_PADDING

  preprocessInputData()
}

// called after we've got first and thirdquartiles
function findOutliers(val) {
  if (val >= thirdQuartile + 3 * iqr || val <= firstQuartile - 3 * iqr) {
    outliers.push(val)
  }
}

function preprocessInputData() {
  var tmp = []
  ratings.forEach(function(str) {
    if (str != "NA") { tmp.push(parseFloat(str)) }
  })
  ratings = tmp
  ratings.sort()
  // we want the ceiling value because
  // it's easier to draw hashmarks
  minVal = Math.ceil(ratings[0])
  maxVal = Math.ceil(ratings[ratings.length-1])
  numHashMarks = maxVal - minVal + 1
  distY = (GRAPHH - 2 * VERTICAL_PADDING) / (numHashMarks - 1)

  // get required boundary data
  var medianIndex = Math.floor((ratings.length - 1) / 2)
  median = ratings[medianIndex]
  var firstQuartileIndex = Math.floor(medianIndex / 2)
  firstQuartile = ratings[firstQuartileIndex]
  var thirdQuartileIndex = Math.floor((medianIndex + ratings.length - 1) / 2)
  thirdQuartile = ratings[thirdQuartileIndex]
  iqr = thirdQuartile - firstQuartile

  ratings.forEach(findOutliers)
}

function draw() {
  background(255)
  drawGraph()
}

function drawGraph() {
  drawBox()
  drawSpine()
  drawIQR()
  drawTitle()
}

function drawBox() {
  noFill()
  stroke(51)
  rect(GRAPH_ORIGINX, GRAPH_ORIGINY, GRAPHW, GRAPHH)

  drawHashMarksForBothSides()
}

// Axes related stuff
function drawHashMarksForBothSides() {
  var lX
  for (var i = 0; i < numHashMarks; ++i) {
    var currentY = whiskerY + (i * distY)
    // draw left hashMark
    lX = GRAPH_ORIGINX
    stroke(51)
    line(lX, currentY, lX + HASHMARKL, currentY)
    // draw right hashMark
    lX = GRAPH_ORIGINX + GRAPHW - HASHMARKL
    stroke(51)
    line(lX, currentY, lX + HASHMARKL, currentY)
    if (i % 4 == 0) {
      drawHashMarkTextForBothSides(maxVal - i, currentY)
    }
  }
}

function drawSpine() {
  var centerX = getCenterX()
  var whiskerX = centerX - WHISKERL / 2
  // upper whisker
  stroke(51)
  line(whiskerX, whiskerY, whiskerX + WHISKERL, whiskerY)
  // lower whisker
  var yL = GRAPH_ORIGINY + GRAPHH - VERTICAL_PADDING
  stroke(51)
  line(whiskerX, yL, whiskerX + WHISKERL, yL)
  // spine
  stroke(51)
  line(centerX, whiskerY, centerX, yL)
}

function drawHashMarkTextForBothSides(val, y) {
  var valStr = val.toString()
  var len = textWidth(valStr)
  var x = GRAPH_ORIGINX - len - 5
  var yPos = y - 6
  stroke(51)
  text(valStr, x, yPos, len, 20)
  x = GRAPH_ORIGINX + GRAPHW + 5
  stroke(51)
  text(valStr, x, yPos, len, 20)
}

function drawIQR() {
  // draw IQR
  var x = GRAPH_ORIGINX + HORIZONTAL_PADDING
  var y = whiskerY + (maxVal - thirdQuartile) * distY
  var width = GRAPHW - HORIZONTAL_PADDING * 2
  var height = (thirdQuartile - firstQuartile) * distY
  fill(255)
  stroke(51)
  rect(x, y, width, height)

  // draw median line
  y = whiskerY + (maxVal - median) * distY
  stroke(51)
  line(x, y, x + width, y)

  outliers.forEach(drawPointForVal)
}

function getCenterX() {
  return GRAPH_ORIGINX + (GRAPHW / 2)
}

function drawPointForVal(val) {
  var difference = maxVal - val;
  var y = whiskerY + difference * distY
  fill(0)
  noStroke()
  ellipse(getCenterX(), y, RADIAN, RADIAN)
}

function drawTitle() {
  var textLen = textWidth(title)
  var padding = (GRAPHW - textLen) / 2

  fill(125)
  noStroke()
  textAlign(CENTER)
  textStyle(BOLD)
  text(title, GRAPH_ORIGINX, GRAPH_ORIGINY - 50, textLen + 50, 20)
}
