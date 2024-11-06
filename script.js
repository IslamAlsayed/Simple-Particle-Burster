// Create Canvas.
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
// Store all particles.
var particles = [];
// A lighter colorset (I can't decide).
var colors = [
  "rgba(243,169,192,.95)",
  "rgba(255,229,154,.95)",
  "rgba(97,181,97,.95)",
  "rgba(58,144,176,.95)",
  "rgba(255,255,255,.95)",
];
// The default colorset.
var colors = [
  "rgba(69,204,255,.95)",
  "rgba(73,232,62,.95)",
  "rgba(255,212,50,.95)",
  "rgba(232,75,48,.95)",
  "rgba(178,67,255,.95)",
];

// Configure settings options
var config = {};
var settings = document.getElementById("settings");
initSettings();

// Init.
resize();
// Fire the Burst! button.
settings.btnSet.onclick();
// Attach canvas.
document.body.appendChild(canvas);
// Begin drawing.
window.requestAnimationFrame(draw);
// Sync canvas to window.
window.onresize = resize;

function burst() {
  var n = rand(config.num[0], config.num[1]);
  var origin = [canvas.width / 2, canvas.height / 2];
  for (var i = 0; i < n; i++) {
    var angle = (360 / n) * (i + 1);
    particles.push(
      new particle({
        angle: angle,
        pos: [origin[0], origin[1]],
        size: rand(config.size[0], config.size[1]),
        speed: rand(config.speed[0], config.speed[1]),
        color: colors[i % 5],
        //color:randColor(92,255),
        waveX: config.waveX,
        waveY: config.waveY,
        curve: rand(config.curve[0], config.curve[1]),
        index: i,
      })
    );
  }
}

// Drawing.
function draw() {
  for (var i = 0; i < particles.length; i++) {
    var p = particles[i];
    p.move();
    p.draw(ctx);
  }
  fade();
  window.requestAnimationFrame(draw);
}

function particle(options) {
  this.angle = 0;
  this.curve = 0;
  this.pos = [0, 0];
  this.size = 100;
  this.speed = 1;
  this.color = "rgba(255,64,64,.95)";
  this.waveX = false;
  this.waveY = false;
  this.index = 0;

  // Override defaults.
  for (var i in options) {
    this[i] = options[i];
  }

  this.move = function () {
    this.angle += this.curve;
    var radians = (this.angle * Math.PI) / 180;
    (this.pos[0] += Math.cos(radians) * this.speed),
      (this.pos[1] += Math.sin(radians) * this.speed);

    if (this.waveX) {
      this.pos[0] += Math.cos(this.index);
    }
    if (this.waveY) {
      this.pos[1] += Math.sin(this.index);
    }
  };
  this.draw = function (ctx) {
    ctx.strokeStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.pos[0], this.pos[1], this.size, 0, 2 * Math.PI);
    ctx.stroke();
  };
}

function preset(options) {
  for (var i in options) {
    if (settings[i].type == "checkbox") {
      settings[i].checked = options[i];
      continue;
    }
    settings[i].value = options[i];
  }
  clear();
  settings.btnSet.onclick();
}

function fade() {
  ctx.beginPath();
  ctx.fillStyle = "rgba(0, 0, 0, .03)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fill();
}
function clear() {
  ctx.beginPath();
  ctx.fillStyle = "rgba(0, 0, 0, 1)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fill();
  particles.length = 0;
}
function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
function initSettings() {
  settings.btnSet.onclick = function () {
    config.num = [
      parseFloat(settings.inBubblesMin.value),
      parseFloat(settings.inBubblesMax.value),
    ];
    config.size = [
      parseFloat(settings.inSizeMin.value),
      parseFloat(settings.inSizeMax.value),
    ];
    config.speed = [
      parseFloat(settings.inSpeedMin.value),
      parseFloat(settings.inSpeedMax.value),
    ];
    config.curve = [
      parseFloat(settings.inCurveMin.value),
      parseFloat(settings.inCurveMax.value),
    ];

    config.waveX = settings.waveX.checked;
    config.waveY = settings.waveY.checked;
    burst();
  };

  // Configure clear button
  settings.btnClear.onclick = clear;

  // Presets.
  settings.preset0.onclick = function () {
    preset({
      inBubblesMin: 150,
      inBubblesMax: 150,
      inSizeMin: 2,
      inSizeMax: 2,
      inSpeedMin: 1,
      inSpeedMax: 1,
      inCurveMin: 0.5,
      inCurveMax: 0.5,
      waveX: true,
      waveY: false,
    });
  };
  settings.preset1.onclick = function () {
    preset({
      inBubblesMin: 300,
      inBubblesMax: 300,
      inSizeMin: 2,
      inSizeMax: 2,
      inSpeedMin: 100,
      inSpeedMax: 100,
      inCurveMin: 180,
      inCurveMax: 180,
      waveX: true,
      waveY: false,
    });
  };
  settings.preset2.onclick = function () {
    preset({
      inBubblesMin: 500,
      inBubblesMax: 500,
      inSizeMin: 2,
      inSizeMax: 3,
      inSpeedMin: 1,
      inSpeedMax: 50,
      inCurveMin: 0,
      inCurveMax: 0,
      waveX: true,
      waveY: false,
    });
  };
  settings.preset3.onclick = function () {
    preset({
      inBubblesMin: 80,
      inBubblesMax: 80,
      inSizeMin: 500,
      inSizeMax: 500,
      inSpeedMin: 1,
      inSpeedMax: 10,
      inCurveMin: -0.5,
      inCurveMax: 0.5,
      waveX: false,
      waveY: false,
    });
  };
  settings.preset4.onclick = function () {
    preset({
      inBubblesMin: 100,
      inBubblesMax: 100,
      inSizeMin: 0.5,
      inSizeMax: 0.5,
      inSpeedMin: 120,
      inSpeedMax: 120,
      inCurveMin: 5,
      inCurveMax: 20,
      waveX: true,
      waveY: false,
    });
  };
  settings.preset5.onclick = function () {
    preset({
      inBubblesMin: 90,
      inBubblesMax: 90,
      inSizeMin: 200,
      inSizeMax: 200,
      inSpeedMin: 2,
      inSpeedMax: 2,
      inCurveMin: 0.5,
      inCurveMax: 0.5,
      waveX: false,
      waveY: false,
    });
  };
  settings.preset6.onclick = function () {
    preset({
      inBubblesMin: 5,
      inBubblesMax: 5,
      inSizeMin: 16,
      inSizeMax: 16,
      inSpeedMin: 1.8,
      inSpeedMax: 1.8,
      inCurveMin: 1.8,
      inCurveMax: 1.8,
      waveX: false,
      waveY: false,
    });
  };
  settings.preset7.onclick = function () {
    preset({
      inBubblesMin: 300,
      inBubblesMax: 300,
      inSizeMin: 2,
      inSizeMax: 2,
      inSpeedMin: 2,
      inSpeedMax: 2,
      inCurveMin: 1,
      inCurveMax: 1,
      waveX: true,
      waveY: true,
    });
  };
  settings.preset8.onclick = function () {
    preset({
      inBubblesMin: 300,
      inBubblesMax: 300,
      inSizeMin: 0.5,
      inSizeMax: 0.5,
      inSpeedMin: 6,
      inSpeedMax: 6,
      inCurveMin: 1.5,
      inCurveMax: 1.5,
      waveX: true,
      waveY: true,
    });
  };
}

/* Common functions */

function rand(min, max) {
  return Math.random() * (max - min) + min;
}
function randColor(min, max) {
  var r = Math.floor(rand(min, max)),
    g = Math.floor(rand(min, max)),
    b = Math.floor(rand(min, max));
  return "rgba(" + r + "," + g + "," + b + ",1)";
}
