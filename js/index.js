import Point from "./Point.js";

const WIDTH = 150;
const HEIGHT = 150;
const POINT_AMOUNT = 10;
const POINT_POS = 0;
let ANIMATE = false;
let SHOW_CENTER = false;
let z = 0;

const canvas = document.querySelector('#canvas');
canvas.width = WIDTH;
canvas.height = HEIGHT;

const points = [];
// Populate points array
for (let i = 0; i < POINT_AMOUNT; i++) {
  points.push(new Point(random(WIDTH), random(HEIGHT)));
}

function draw() {
  if (canvas.getContext) {
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    // if (z === WIDTH) z = 0;
    // else z += 2;

    for (let x = 0; x < WIDTH; x++) {
      for (let y = 0; y < HEIGHT; y++) {
        let dists = [];
        // Calculate distance to all points for every pixel
        for (let i = 0; i < points.length; i++) {
          dists[i] = dist(x, y, points[i].x, points[i].y);
        }
        dists = dists.sort((a, b) => a - b);
        // Paint each pixel acording to the noise
        const noise = map(dists[POINT_POS], 0, WIDTH / 2, 0, 255);

        ctx.fillStyle = `rgb(${noise},${noise},${noise})`;
        ctx.fillRect(x, y, 1, 1);
      }
    }
    // Shows points with red
    if (SHOW_CENTER) {
      for (let point of points) {
        ctx.fillStyle = "rgb(255,0,0)";
        ctx.fillRect(point.x, point.y, 2, 2);
      }
    }
    // Points move every frame
    if (ANIMATE) {
      const amount = 1;
      for (let point of points) {
        const x = Math.random() < 0.5 ? -amount : amount;
        const y = Math.random() < 0.5 ? -amount : amount;
        const z = Math.random() < 0.5 ? -amount : amount;

        point.move(x, y, z);
      }

      requestAnimationFrame(draw);
    }
  }
}

draw();

// Config functionality
document.querySelector('.generate-btn').addEventListener('click', () => {
  for (let point of points) {
    point.x = random(WIDTH);
    point.y = random(HEIGHT);
  }
  draw();
});

document.querySelector('.show-center').addEventListener('change', () => {
  if (SHOW_CENTER) SHOW_CENTER = false
  else SHOW_CENTER = true;
})

// Util functions
function random(max) {
  return Math.floor(Math.random() * max);
}

function dist(x1, y1, x2, y2) {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

function map(number, inMin, inMax, outMin, outMax) {
  return (number - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}