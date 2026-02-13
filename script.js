var Input = { keys: [], mouse: { left: false, right: false, middle: false, x: 0, y: 0 } };
for (var i = 0; i < 230; i++) { Input.keys.push(false); }

document.addEventListener("keydown", function(event) { Input.keys[event.keyCode] = true; });
document.addEventListener("keyup", function(event) { Input.keys[event.keyCode] = false; });

// Click Bug Fix
document.addEventListener("mousedown", function(event) {
  if (event.button == 0) Input.mouse.left = true;
  if (event.button == 1) Input.mouse.middle = true;
  if (event.button == 2) Input.mouse.right = true;
});
document.addEventListener("mouseup", function(event) {
  if (event.button == 0) Input.mouse.left = false;
  if (event.button == 1) Input.mouse.middle = false;
  if (event.button == 2) Input.mouse.right = false;
});

document.addEventListener("mousemove", function(event) {
  Input.mouse.x = event.clientX;
  Input.mouse.y = event.clientY;
});

var canvas = document.createElement("canvas");
document.body.appendChild(canvas);
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.style.position = "absolute";
canvas.style.left = "0px";
canvas.style.top = "0px";
document.body.style.overflow = "hidden";
var ctx = canvas.getContext("2d");

class Segment {
  constructor(parent, size, angle, range, stiffness) {
    this.isSegment = true;
    this.parent = parent;
    if (typeof parent.children == "object") parent.children.push(this);
    this.children = [];
    this.size = size;
    this.relAngle = angle;
    this.defAngle = angle;
    this.absAngle = parent.absAngle + angle;
    this.range = range;
    this.stiffness = stiffness;
    this.updateRelative(false, true);
  }
  updateRelative(iter, flex) {
    this.relAngle = this.relAngle - 2 * Math.PI * Math.floor((this.relAngle - this.defAngle) / 2 / Math.PI + 1 / 2);
    if (flex) {
      this.relAngle = Math.min(this.defAngle + this.range / 2, Math.max(this.defAngle - this.range / 2, (this.relAngle - this.defAngle) / this.stiffness + this.defAngle));
    }
    this.absAngle = this.parent.absAngle + this.relAngle;
    this.x = this.parent.x + Math.cos(this.absAngle) * this.size;
    this.y = this.parent.y + Math.sin(this.absAngle) * this.size;
    if (iter) for (var i = 0; i < this.children.length; i++) this.children[i].updateRelative(iter, flex);
  }
  draw(iter) {
    ctx.beginPath();
    ctx.moveTo(this.parent.x, this.parent.y);
    ctx.lineTo(this.x, this.y);
    ctx.stroke();
    if (iter) for (var i = 0; i < this.children.length; i++) this.children[i].draw(true);
  }
}

class Creature {
  constructor(x, y, angle, fAccel, fFric, fRes, fThresh, rAccel, rFric, rRes, rThresh) {
    this.x = x; this.y = y; this.absAngle = angle;
    this.fSpeed = 0; this.fAccel = fAccel; this.fFric = fFric; this.fRes = fRes; this.fThresh = fThresh;
    this.rSpeed = 0; this.rAccel = rAccel; this.rFric = rFric; this.rRes = rRes; this.rThresh = rThresh;
    this.children = []; this.systems = [];
  }
  follow(x, y) {
    var dist = ((this.x - x) ** 2 + (this.y - y) ** 2) ** 0.5;
    var angle = Math.atan2(y - this.y, x - this.x);
    this.fSpeed += this.fAccel * (dist > this.fThresh);
    this.fSpeed *= 1 - this.fRes;
    this.speed = Math.max(0, this.fSpeed - this.fFric);
    var dif = this.absAngle - angle;
    dif -= 2 * Math.PI * Math.floor(dif / (2 * Math.PI) + 1 / 2);
    if (Math.abs(dif) > this.rThresh && dist > this.fThresh) this.rSpeed -= this.rAccel * (2 * (dif > 0) - 1);
    this.rSpeed *= 1 - this.rRes;
    this.absAngle += this.rSpeed;
    this.x += this.speed * Math.cos(this.absAngle);
    this.y += this.speed * Math.sin(this.absAngle);
    for (var i = 0; i < this.children.length; i++) this.children[i].updateRelative(true, true);
    this.draw(true);
  }
  draw(iter) {
    if (iter) for (var i = 0; i < this.children.length; i++) this.children[i].draw(true);
  }
}

var critter = new Creature(window.innerWidth / 2, window.innerHeight / 2, 0, 12, 1, 0.5, 16, 0.5, 0.085, 0.5, 0.3);
var node = critter;
for (var i = 0; i < 50; i++) { node = new Segment(node, 10, 0, 3.14, 1); }

setInterval(function() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  critter.follow(Input.mouse.x, Input.mouse.y);
}, 33);
