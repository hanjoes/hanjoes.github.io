
var YHASHMARK_NUM = 400

function drawGraph() {
  drawAxes()
  drawBars()
  drawLegends()
  drawTitle()
}

function drawHashMarksForYAxes() {
  var numHashMarks = YHASHMARK_NUM
  var hashMarkL = GRAPH_ORIGINX
  var hashMarkR = hashMarkL + HASHMARKL
  var dist = (GRAPHH - PADDINGY) / numHashMarks
  for (var i = 1; i <= numHashMarks; ++i) {
    var hashMarkY = GRAPH_ORIGINY + GRAPHH - (i * dist)
    if (i % 50 == 0) {
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
    if (i % 4 == 0) {
      var hashMarkX = startX + (i * unitDist)
      stroke(51)
      line(hashMarkX, hashMarkB + HASHMARKL, hashMarkX, hashMarkB)
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

function drawBars() {
  var distY = (GRAPHH - PADDINGY) / YHASHMARK_NUM
  var numBars = numRows / 4
  var distX = (GRAPHW - 2 * PADDINGX) / numBars

  var startX = GRAPH_ORIGINX + PADDINGX
  var index = 0;
  var highlighted
  var hasHighlighted
  var highlightedVal
  for (var i = 0; i < numBars; ++i) {
    hasHighlighted = false
    var x = startX + (i * distX)
    var previousY = GRAPH_ORIGINY + GRAPHH
    for (var j = 0; j < 4; ++j) {
      highlighted = false
      var height
      // skip NA values
      if (ratings[index] == "NA") height = 0
      else height = parseFloat(ratings[index]) * distY
      // draw bar
      var y = previousY - height
      previousY = y

      if (needHighlight(index, x, y, distX, height)) {
        highlighted = true
        hasHighlighted = true
        highlightedVal = ratings[index]
      }

      color = highlighted ? highlightColor : colors[index % 4]
      fill(color)
      noStroke()
      // minus one for the small crack
      rect(x, y, distX-1, height)

      ++index
    }
    if (hasHighlighted) {
      drawToolTipForVal(highlightedVal, x, previousY)
    }
  }
}

function needHighlight(index, x, y, w, h) {
  return mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h
}

function drawToolTipForVal(val, x, y) {
  fill(51)
  stroke(51)
  textStyle(NORMAL)
  textAlign(CENTER)
  text(val, x + 8 , y - 20, 20, 20)
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
