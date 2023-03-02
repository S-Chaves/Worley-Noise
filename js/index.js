import Point from "./Point.js";

const WIDTH = 200;
const HEIGHT = 200;
const POINT_AMOUNT = 5;
const POINT_POS = 0;
let z = 0;

const canvas = document.querySelector('#canvas');
canvas.width = WIDTH;
canvas.height = HEIGHT;

const points = [];
// Populate points array
for (let i = 0; i < POINT_AMOUNT; i++) {
  points.push(new Point(random(WIDTH), random(HEIGHT), random(WIDTH)));
}

function draw() {
  if (canvas.getContext) {
    const ctx = canvas.getContext("2d");

    if (z === WIDTH) z = 0;
    else z += 2;

    for (let x = 0; x < WIDTH; x++) {
      for (let y = 0; y < HEIGHT; y++) {
        let dists = [];
        // Calculate distance to all points for every pixel
        for (let i = 0; i < points.length; i++) {
          dists[i] = dist(x, y, z, points[i].x, points[i].y, points[i].z);
        }
        dists = dists.sort((a, b) => a - b);
        // Paint each pixel acording to the noise
        const noise = map(dists[POINT_POS], 0, WIDTH / 2, 255, 0);

        ctx.fillStyle = `rgb(${noise},${noise},${noise})`;
        ctx.fillRect(x, y, 1, 1);
      }
    }

    // for (let point of points) {
    //   ctx.fillStyle = "rgb(255,0,0)";
    //   ctx.fillRect(point.x, point.y, 2, 2);
    // }

    // for (let point of points) {
    //   const amount = 1;
    //   const x = Math.random() < 0.5 ? -amount : amount;
    //   const y = Math.random() < 0.5 ? -amount : amount;
    //   const z = Math.random() < 0.5 ? -amount : amount;

    //   point.move(x, y, z);
    // }

    requestAnimationFrame(draw);
  }
}

draw();

// Util functions
function random(max) {
  return Math.floor(Math.random() * max);
}

function dist(x1, y1, z1, x2, y2, z2) {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2 + (z2 - z1) ** 2);
}

function map (number, inMin, inMax, outMin, outMax) {
  return (number - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}