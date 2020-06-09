

function Matrix4() {
  this.elements = new Float32Array([
    1.0, 0.0, 0.0, 0.0,
    0.0, 1.0, 0.0, 0.0,
    0.0, 0.0, 1.0, 0.0,
    0.0, 0.0, 0.0, 1.0
  ])
}

// 旋转角度和旋转轴
Matrix4.prototype.setRotate = function(ANGLE, x, y, z) {
  const Angle = Math.PI * ANGLE / 180
  const cosB = Math.cos(Angle)
  const sinB = Math.sin(Angle)
  
  this.elements = new Float32Array([
    cosB, sinB, 0.0, 0.0,
    -sinB, cosB, 0.0, 0.0,
    0.0, 0.0, 1.0, 0.0,
    0.0, 0.0, 0.0, 1.0
  ])
}

// 将实例初始化为单位阵
Matrix4.prototype.setIdentity() {
  this.elements = new Float32Array([
    1.0, 0.0, 0.0, 0.0,
    0.0, 1.0, 0.0, 0.0,
    0.0, 0.0, 1.0, 0.0,
    0.0, 0.0, 0.0, 1.0
  ])
}

// 平移
Matrix4.prototype.setTranslate(x, y, z) {
  this.elements = new Float32Array([
    1.0, 0.0, 0.0, 0.0,
    0.0, 1.0, 0.0, 0.0,
    0.0, 0.0, 1.0, 0.0,
    x, y, z, 1.0
  ])
}

// 缩放
Matrix4.prototype.setScale(sx, sy) {
  this.elements = new Float32Array([
    sx, 0.0, 0.0, 0.0,
    0.0, sy, 0.0, 0.0,
    0.0, 0.0, 1.0, 0.0,
    0.0, 0.0, 0.0, 1.0
  ])
}

// 
Matrix4.prototype.translate(x, y, z) {
  new Float32Array([
    1.0, 0.0, 0.0, 0.0,
    0.0, 1.0, 0.0, 0.0,
    0.0, 0.0, 1.0, 0.0,
    x, y, z, 1.0
  ])
}

// 
Matrix4.prototype.rotate(angle, x, y, z) {

}

// 
Matrix4.prototype.scale(x, y, z) {

}

// 
Matrix4.prototype.set(matrix) {
  this.elements 
}