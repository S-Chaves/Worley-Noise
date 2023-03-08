import Point from "./Point.js";

const WIDTH = 400;
const HEIGHT = 400;
const POINT_AMOUNT = 10; // Amount of points
let COLORS = [255, 0]; // Start and end colors
let MOV_AMOUNT = 1; // Amount of pixel movement in animate
let ANIMATE = false; // If true it moves
let SHOW_CENTER = false; // If true the centers are shown
let animation; // Instance of requestAnimationFrame
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
    const ctx = canvas.getContext("2d", { alpha: false });

    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    // if (z === WIDTH) z = 0;
    // else z += 2;

    const imageData = ctx.createImageData(3, 3);

    for (let x = 0; x < WIDTH; x += 3) {
      for (let y = 0; y < HEIGHT; y += 3) {
        const dist = getDist(x, y);
        const noise = map(dist, 0, WIDTH / 2, COLORS[0], COLORS[1]);

        // Paint each pixel acording to the noise
        changeImgDataColor(imageData.data, noise, noise, noise);
        ctx.putImageData(imageData, x, y);
      }
    }
    // Shows points with red
    if (SHOW_CENTER) {
      for (let point of points) {
        changeImgDataColor(imageData.data, 255, 0, 0);
        ctx.putImageData(imageData, point.x, point.y);
      }
    }
    // Points move every frame
    if (ANIMATE) {
      for (let point of points) {
        const x = Math.random() < 0.5 ? -MOV_AMOUNT : MOV_AMOUNT;
        const y = Math.random() < 0.5 ? -MOV_AMOUNT : MOV_AMOUNT;
        const z = Math.random() < 0.5 ? -MOV_AMOUNT : MOV_AMOUNT;

        point.move(x, y, z);
      }
    }

    animation = requestAnimationFrame(draw);
  }
}

draw();

// Config functionality
document.querySelector('.generate-btn').addEventListener('click', () => {
  for (let point of points) {
    point.x = random(WIDTH);
    point.y = random(HEIGHT);
  }

  window.cancelAnimationFrame(animation);
  draw();
});

document.querySelector('.show-center').addEventListener('change', () => {
  if (SHOW_CENTER) SHOW_CENTER = false;
  else SHOW_CENTER = true;
});

document.querySelector('.animate').addEventListener('change', () => {
  if (ANIMATE) ANIMATE = false;
  else ANIMATE = true;
});

document.querySelector('.invert').addEventListener('change', () => {
  if (COLORS[0]) COLORS = [0, 255];
  else COLORS = [255, 0];
});

// Util functions
function random(max) {
  return Math.floor(Math.random() * max);
}

function changeImgDataColor(data, r, g, b) {
  for (let i = 0; i < data.length; i += 4) {
    // Modify pixel data
    data[i + 0] = r; // R value
    data[i + 1] = g; // G value
    data[i + 2] = b; // B value
  }
}

function getDist(x, y) {
  let min = Infinity;
  // Calculate distance to all points for every pixel
  for (let i = 0; i < points.length; i++) {
    const distance = dist(x, y, points[i].x, points[i].y);
    if (distance < min) min = distance;
  }
  return min;
}

function dist(x1, y1, x2, y2) {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

function map(number, inMin, inMax, outMin, outMax) {
  return (number - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}