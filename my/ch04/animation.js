// 顶点着色器
let VSHADER_SOURCE = `
attribute vec4 a_Position;
uniform mat4 u_xformMatrix;
void main(){
  gl_Position = u_xformMatrix * a_Position;
}`
// 片元着色器
let FSHADER_SOURCE = `
void main(){
  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
}`;

const ANGLE_STEP = 45.0

function main() {
  const canvas = createCanvas()
  const gl = createGL(canvas)

  if (!initShaderProgram(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log("Failed to initialize shader");
    return;
  }
  // 1. 创建顶点缓冲区对象
  // 2. 将多个顶点的数据保存在缓冲区中
  // 3. 将缓冲区传给顶点着色器
  const n = initVertexBuffers(gl)
  if (n < 0) {
    console.log('Failed to set the positions of the vertices');
    return;
  }

  const u_xformMatrix = gl.getUniformLocation(gl.program, 'u_xformMatrix')
  if (!u_xformMatrix) {
    console.log('Failed to get the storage location of u_xformMatrix');
    return
  }
  const xformMatrix = new Matrix4()

  // 指定清空<canvas>的颜色
  gl.clearColor(0.2, 0.2, 0.2, 0.8);
  
  // 清空<canvas>
  // 基于多基本缓冲区模型
  // COLOR_BUFFER_BIT意为清空颜色缓冲区，即清空<canvas>的区域
  // 参见opengl
  gl.clear(gl.COLOR_BUFFER_BIT);

  let currentAngle = 0
  const tick = () => {
    currentAngle = animate(currentAngle)
    draw(gl, n, currentAngle, xformMatrix, u_xformMatrix)
    requestAnimationFrame(tick)
  }
  
  tick()
}
// 调用间隔不固定，没仔细看，不太想看，以后需要的时候再研究
let g_last = Date.now()
function animate(angle) {
  const now = Date.now()
  const elapsed = now - g_last
  g_last = now
  const newAngle = angle + (ANGLE_STEP * elapsed) / 1000.0
  return newAngle % 360
}

function draw(gl, n, angle, matrix, u_matrix) {
  matrix.setRotate(angle, 0, 0, 1)
  matrix.translate(0.35, 0,0)
  gl.uniformMatrix4fv(u_matrix, false, matrix.elements)
  
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLES, 0, n)
}

function initVertexBuffers(gl) {
  const vertices = new Float32Array([0.0, 0.5,   -0.5, -0.5,   0.5, -0.5])
  
  let n = 3 // 点的个数

  // 创建缓冲区对象
  const vertexBuffer = gl.createBuffer()
  if(!vertexBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }

  // 将缓冲区对象绑定到目标
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
  // 向缓冲区对象中写入数据
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

  let a_Position = gl.getAttribLocation(gl.program, "a_Position");
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position')
    return -1;
  }

  // 将缓冲区对象分配给a_Position变量
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0)
  // 连接a_Position变量与分配给它的缓冲区对象
  gl.enableVertexAttribArray(a_Position)

  return n
}