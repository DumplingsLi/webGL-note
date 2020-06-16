// 顶点着色器
let VSHADER_SOURCE = `
attribute vec4 a_Position;
attribute float a_PointSize;
attribute vec4 a_Color;
varying vec4 v_Color;
void main(){
  gl_Position = a_Position;
  gl_PointSize = a_PointSize;
  v_Color = a_Color;
}`
// 片元着色器
let FSHADER_SOURCE = `
#ifdef GL_ES
precision mediump float;
#endif
varying vec4 v_Color;
void main(){
  gl_FragColor = v_Color;
}`;

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

  // 指定清空<canvas>的颜色
  gl.clearColor(0.2, 0.2, 0.2, 0.8);
  
  // 清空<canvas>
  // 基于多基本缓冲区模型
  // COLOR_BUFFER_BIT意为清空颜色缓冲区，即清空<canvas>的区域
  // 参见opengl
  gl.clear(gl.COLOR_BUFFER_BIT);

  // gl.drawArrays(gl.POINTS, 0, n)
  gl.drawArrays(gl.TRIANGLES, 0, n)
}
// 1. 多缓冲区对象
// function initVertexBuffers(gl) {
//   const vertices = new Float32Array([0.0, 0.5,   -0.5, -0.5,   0.5, -0.5])
//   const sizes = new Float32Array([10.0, 5.0, 20.0])
  
//   const n = 3 // 点的个数

//   // 创建缓冲区对象
//   const vertexBuffer = gl.createBuffer()
//   if(!vertexBuffer) {
//     console.log('Failed to create the buffer object');
//     return -1;
//   }

//   // 将缓冲区对象绑定到目标
//   gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
//   // 向缓冲区对象中写入数据
//   gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

//   let a_Position = gl.getAttribLocation(gl.program, "a_Position");
//   if (a_Position < 0) {
//     console.log('Failed to get the storage location of a_Position')
//     return -1;
//   }

//   // 将缓冲区对象分配给a_Position变量
//   gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0)
//   // 连接a_Position变量与分配给它的缓冲区对象
//   gl.enableVertexAttribArray(a_Position)

//   /************尺寸**************/
//   const sizeBuffer = gl.createBuffer()
//   if(!sizeBuffer) {
//     console.log('Failed to create the buffer object');
//     return -1;
//   }

//   gl.bindBuffer(gl.ARRAY_BUFFER, sizeBuffer)
//   gl.bufferData(gl.ARRAY_BUFFER, sizes, gl.STATIC_DRAW)

//   const a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize')
//   if (a_PointSize < 0) {
//     console.log('Failed to get the storage location of a_PointSize');
//     return -1;
//   }

//   gl.vertexAttribPointer(a_PointSize, 1, gl.FLOAT, false, 0, 0)
//   gl.enableVertexAttribArray(a_PointSize)

//   return n
// }
// 2. 存储一个缓冲区对象中
function initVertexBuffers(gl) {
  const verticesColor = new Float32Array([
    0.0,  0.5,  1.0,  0.0,  0.0,  10.0,
    -0.5, -0.5,  0.0,  1.0,  0.0,  20.0,
     0.5, -0.5,  0.0,  0.0,  1.0,  30.0
  ])

  const n = 3

  const vertextColorBuffer = gl.createBuffer()
  if(!vertextColorBuffer) {
    console.log('Failed to create the buffer object');
    return false;
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, vertextColorBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, verticesColor, gl.STATIC_DRAW)

  const FSIZE = verticesColor.BYTES_PER_ELEMENT // 类型化数组中每个元素的字节大小

  const a_Position = gl.getAttribLocation(gl.program, "a_Position");
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position')
    return -1;
  }
  const a_Color = gl.getAttribLocation(gl.program, 'a_Color')
  if (a_Color < 0) {
    console.log('Failed to get the storage location of a_Color');
    return -1;
  }
  const a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize')
  if (a_PointSize < 0) {
    console.log('Failed to get the storage location of a_PointSize');
    return -1;
  }
  // 第五个参数：指定相邻两个顶点间的字节数
  // 第六个参数：指定缓冲区对象中的偏移量（以字节为单位）
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 6, 0)
  gl.enableVertexAttribArray(a_Position)

  gl.vertexAttribPointer(a_PointSize, 1, gl.FLOAT, false, FSIZE * 6, FSIZE * 5)
  gl.enableVertexAttribArray(a_PointSize)

  gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 2)
  gl.enableVertexAttribArray(a_Color)

  return n
}
