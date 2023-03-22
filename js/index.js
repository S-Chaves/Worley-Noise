import Point from "./Point.js";

const WIDTH = 400;
const HEIGHT = 400;
const LENGTH = 400;
let POINT_AMOUNT = 10; // Amount of points
let COLORS = [255, 0]; // Start and end colors
let MOV_AMOUNT = 5; // Amount of pixel movement in animate
let ANIMATE = false; // If true it moves
let SHOW_CENTER = false; // If true the centers are shown
let ANIMATE_3D = false; // If true z values are used
let ANIMATE_3D_DIR = false; // Set to true when max z is reached to go down
let animation; // Instance of requestAnimationFrame
let MANHATTAN_DIST = false; // If true it uses manhattan distance
let z = null;

const canvas = document.querySelector('#canvas');
canvas.width = WIDTH;
canvas.height = HEIGHT;

const points = [];
// Populate points array
for (let i = 0; i < POINT_AMOUNT; i++) {
  points.push(new Point(random(WIDTH), random(HEIGHT), random(LENGTH)));
}

function draw() {
  if (canvas.getContext) {
    const ctx = canvas.getContext("2d", { alpha: false });

    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    // Change z layer
    if (ANIMATE_3D) {
      ANIMATE_3D_DIR ? z -= 2 : z += 2;
      // Change direction when the end is reached
      if (z === 0) ANIMATE_3D_DIR = false;
      else if (z === LENGTH) ANIMATE_3D_DIR = true;
    }

    const imageData = ctx.createImageData(3, 3);

    for (let x = 0; x < WIDTH; x += 3) {
      for (let y = 0; y < HEIGHT; y += 3) {
        const dist = getDist(x, y, z);
        const noise = map(dist, 0, WIDTH / 2, COLORS[0], COLORS[1]);

        // Paint each pixel acording to the noise
        changeImgDataColor(imageData.data, noise, noise, noise);
        ctx.putImageData(imageData, x, y);
      }
    }
    // Shows centers with a red dot
    if (SHOW_CENTER) {
      for (let i = 0; i < POINT_AMOUNT; i++) {
        changeImgDataColor(imageData.data, 255, 0, 0);
        ctx.putImageData(imageData, points[i].x, points[i].y);
      }
    }
    // Points move every frame
    if (ANIMATE) {
      for (let i = 0; i < POINT_AMOUNT; i++) {
        const point = points[i];
        const dx = MOV_AMOUNT * Math.cos(Math.PI * point.dir / 180.0);
        const dy = MOV_AMOUNT * Math.sin(Math.PI * point.dir / 180.0);

        const x = point.x + dx;
        const y = point.y + dy;

        point.dir += random(10);

        point.move(constrain(x, 0, WIDTH), constrain(y, 0, HEIGHT));
      }
    }

    animation = requestAnimationFrame(draw);
  }
}

draw();

// Util functions
function changeImgDataColor(data, r, g, b) {
  for (let i = 0; i < data.length; i += 4) {
    // Modify pixel data
    data[i + 0] = r; // R value
    data[i + 1] = g; // G value
    data[i + 2] = b; // B value
  }
}

function getDist(x, y, z) {
  let min = Infinity;
  // Calculate distance to all points for every pixel
  for (let i = 0; i < POINT_AMOUNT; i++) {
    const distance = MANHATTAN_DIST
      ? manhattanDist(x, y, z, points[i].x, points[i].y, points[i].z)
      : euclideanDist(x, y, z, points[i].x, points[i].y, points[i].z);

    if (distance < min) min = distance;
  }
  return min;
}

function euclideanDist(x1, y1, z1, x2, y2, z2) {
  if (z1 === null) return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2 + (z2 - z1) ** 2);
}

function manhattanDist(x1, y1, z1, x2, y2, z2) {
  if (z1 == null) return Math.abs(x2 - x1) + Math.abs(y2 - y1);
  return Math.abs(x2 - x1) + Math.abs(y2 - y1) + Math.abs(z2 - z1);
}

function random(max) {
  return Math.floor(Math.random() * max);
}

function constrain(val, min, max) {
  if (val < min) return min;
  if (val > max) return max;
  return val;
}

function map(number, inMin, inMax, outMin, outMax) {
  return (number - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}

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

document.querySelector('.animation-3d').addEventListener('change', () => {
  if (ANIMATE_3D) {
    ANIMATE_3D = false;
    ANIMATE_3D_DIR = false;
    z = null;
  }
  else ANIMATE_3D = true;
});

document.querySelector('.manhattan').addEventListener('change', () => {
  MANHATTAN_DIST = !MANHATTAN_DIST;
});

document.querySelector('.amount-points').addEventListener('change', (e) => {
  POINT_AMOUNT = e.target.value;
});