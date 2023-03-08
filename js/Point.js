class Point {
  constructor(x, y, z = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.dir =  Math.floor(Math.random() * 360);
  }

  move(x, y, z) {
    this.x += x;
    this.y += y;
    this.z += z;
  }
}

export default Point;