class Point {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  move(x, y, z) {
    this.x += x;
    this.y += y;
    this.z += z;
  }
}

export default Point;