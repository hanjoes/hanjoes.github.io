// Stealing the idea from the conky battery
// indicator.

var ph;

var cw = 200;
var ch = 90;

var PONDING_SPEED = 0.3;
var WIDTH = 7;

function setup() {
  select('#heart').child(createCanvas(cw, ch));
  // 7 seems the best number.
  ph = new PondingHeart(WIDTH, cw, ch);
}

function draw() {
  background("white");
  ph.startPonding();
}

var HeartPiece = function(cx, cy, ox, oy) {
  this.cx = cx;
  this.cy = cy;
  // offset from center, used to calculate translation
  this.ox = ox;
  this.oy = oy;
  this.width = 10;
  this.height = 10;
  this.fillColor = color(200, 0, 0);
};

HeartPiece.prototype.show = function(t) {
  rectMode(CENTER);
  fill(this.fillColor);
  noStroke();
  rect(this.cx + this.ox * t, this.cy + this.oy * t, this.width, this.height);
};

var PondingHeart = function(w, cw, ch) {
  this.width = w;
  this.relaxDist = 1;
  this.tenseDist = 6;
  this.pieces = [];
  this.centerX = cw / 2;
  this.centerY = ch / 3;
  this.r = 5;
  this.speed = PONDING_SPEED;
  this.currentTranslation = 0;
  // initialize the bottom half include the middle lane
  // include zero since the bottom lane contains only
  // the center piece
  for (var level = 0; level < (w - 1) / 2 + 1; ++level) {
    this.initLane(level, true);
  }
  // initialize the top half
  var upLevel = -1;
  for (; upLevel >= -((w - 5) / 2 - 1); --upLevel) {
    this.initLane(upLevel, true);
  }
  // top level which is the special case
  this.initLane(upLevel, false);
};

PondingHeart.prototype.initLane = function(level, hasMiddlePiece) {
  this.initHalf(-1, level);
  this.initHalf(1, level);
  if (hasMiddlePiece) {
    this.pieces.push(new HeartPiece(
      this.centerX,
      this.centerY + level * (this.relaxDist + 2 * this.r),
      0,
      level));
  }
};

PondingHeart.prototype.initHalf = function(step, level) {
  for (var i = 1; i <= (this.width - 2 * Math.abs(level)) / 2; ++i) {
    this.pieces.push(new HeartPiece(
      this.centerX + i * step * (this.relaxDist + 2 * this.r),
      this.centerY + level * (this.relaxDist + 2 * this.r),
      i * step,
      level));
  }
};

PondingHeart.prototype.startPonding = function() {
  var t = this.currentTranslation;
  var speed = this.speed;
  // show translated pieces
  this.pieces.forEach(function(h) {
    h.show(t);
  });
  // update states
  t += speed;
  if (t > this.tenseDist || t < 0) {
    speed = -speed;
  }
  this.speed = speed;
  this.currentTranslation = t;
}
