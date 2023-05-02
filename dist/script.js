var utils = {
  degreesToRads: function(degrees) {
    return degrees / 180 * Math.PI;
  },

  randomInt: function(min, max) {
    return min + Math.random() * (max - min + 1);
  }
};

// basic setup  :)

canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
//ctx.globalCompositeOperation = "light";
W = canvas.width = window.innerWidth;
H = canvas.height = window.innerHeight;

gridX = 5;
gridY = 5;

function shape(x, y, texte) {
  this.x = x;
  this.y = y;
  this.size = 200;

  this.text = texte;
  this.placement = [];
  this.vectors = [];
}

shape.prototype.getValue = function() {
  // get black pixels position

  // Draw the shape :^)

  ctx.textAlign = "center";
  ctx.font = "bold " + this.size + "px Verdana";
  ctx.fillText(this.text, this.x, this.y);

  var idata = ctx.getImageData(0, 0, W, H);

  var buffer32 = new Uint32Array(idata.data.buffer);

  for (var y = 0; y < H; y += gridY) {
    for (var x = 0; x < W; x += gridX) {
      if (buffer32[y * W + x]) {
        this.placement.push(new particle(x, y));
      }
    }
  }
  ctx.clearRect(0, 0, W, H);
  //ctx.globalCompositeOperation = "light";
};
colors = ["#2e3192", "#ec008c", "#40c2f3", "#bdbbbc", "#ec008c", "#2e008b"];

function particle(x, y, type) {
  this.radius = 1.1;
  this.futurRadius = utils.randomInt(radius, radius + 3);

  this.rebond = utils.randomInt(1, 5);
  this.x = x;
  this.y = y;

  this.dying = false;

  this.base = [x, y];

  this.vx = 0;
  this.vy = 0;
  this.type = type;
  this.friction = 0.99;
  this.gravity = gravity;
  this.color = colors[Math.floor(Math.random() * colors.length)];

  this.getSpeed = function() {
    return Math.sqrt(this.vx * this.vx + this.vy * this.vy);
  };

  this.setSpeed = function(speed) {
    var heading = this.getHeading();
    this.vx = Math.cos(heading) * speed;
    this.vy = Math.sin(heading) * speed;
  };

  this.getHeading = function() {
    return Math.atan2(this.vy, this.vx);
  };

  this.setHeading = function(heading) {
    var speed = this.getSpeed();
    this.vx = Math.cos(heading) * speed;
    this.vy = Math.sin(heading) * speed;
  };

  this.angleTo = function(p2) {
    return Math.atan2(p2.y - this.y, p2.x - this.x);
  };

  this.update = function(heading) {
    this.x += this.vx + gravity;
    //this.y += this.vy;
    //this.vy += gravity;

    this.vx *= this.friction;
    this.vy *= this.friction;

    if (this.radius < this.futurRadius && this.dying === false) {
      this.radius += duration;
    } else {
      this.dying = true;
    }

    if (this.dying === true) {
      this.radius -= duration;
    }

    ctx.beginPath();

    ctx.fillStyle = this.color;

    ctx.arc(this.x, this.y, this.radius, Math.PI * 2, false);
    ctx.fill();
    ctx.closePath();

    if (this.y < 0 || this.radius < 1) {
      this.x = this.base[0];
      this.dying = false;
      this.y = this.base[1];
      this.radius = 1.1;
      this.setSpeed(speed);
      this.futurRadius = utils.randomInt(radius, radius + 3);
      //this.setHeading(utils.randomInt(utils.degreesToRads(90), utils.degreesToRads(270)));
    }
  };

  this.setSpeed(utils.randomInt(0.1, 0.5));
  this.setHeading(
    utils.randomInt(utils.degreesToRads(0), utils.degreesToRads(360))
  );
}
element2 = document.getElementById("2");
element3 = document.getElementById("3");
element4 = document.getElementById("4");
element5 = document.getElementById("5");
element6 = document.getElementById("6");

fieldvalue = document.getElementById("message");
gravity = parseFloat(element2.value);
duration = parseFloat(element3.value);
resolution = parseFloat(element4.value);
speed = parseFloat(element5.value);
radius = parseFloat(element5.value);

var message = new shape(W / 2, H / 2 + 50, fieldvalue.value);

message.getValue();

update();

function change() {
  ctx.clearRect(0, 0, W, H);
  //ctx.globalAlpha=0.2;
  //ctx.globalCompositeOperation = "light";

  gridX = parseFloat(element4.value);
  gridY = parseFloat(element4.value);
  message.placement = [];
  message.text = fieldvalue.value;
  message.getValue();
}

function changeV() {
  gravity = parseFloat(element2.value);
  duration = parseFloat(element3.value);
  speed = parseFloat(element5.value);
  radius = parseFloat(element6.value);
  
  console.log(gravity, duration, speed, radius);
}

var fps = 100;
function update() {
  setTimeout(function() {
    ctx.clearRect(0, 0, W, H);

    for (var i = 0; i < message.placement.length; i++) {
      message.placement[i].update();
    }
    
    ctx.globalAlpha=0.9;

    requestAnimationFrame(update);
  }, 1000 / fps);
}

changeV();