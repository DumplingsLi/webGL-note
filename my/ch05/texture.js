// 顶点着色器
let VSHADER_SOURCE = `
attribute vec4 a_Position;
attribute vec2 a_TextCoord;
varying vec2 v_TextCoord;
void main(){
  gl_Position = a_Position;
  v_TextCoord = a_TextCoord;
}`
// 片元着色器
let FSHADER_SOURCE = `
#ifdef GL_ES
precision mediump float;
#endif
uniform sampler2D u_Sampler;
varying vec2 v_TextCoord;
void main(){
  gl_FragColor = texture2D(u_Sampler, v_TextCoord);
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
  gl.clearColor(0.2, 0.2, 0.2, 1);
  
  // 清空<canvas>
  // 基于多基本缓冲区模型
  // COLOR_BUFFER_BIT意为清空颜色缓冲区，即清空<canvas>的区域
  // 参见opengl
  gl.clear(gl.COLOR_BUFFER_BIT);
  initTextures(gl, n)
}
// 设置纹理坐标
function initVertexBuffers(gl) {
  // const verticesTexCoords = new Float32Array([
  //   -0.5,  0.5,  0.0,  1.0, 
  //   -0.5, -0.5,  0.0,  0.0, 
  //    0.5, 0.5,  1.0,  1.0,
  //    0.5, -0.5, 1.0, 0.0
  // ])

  const verticesTexCoords = new Float32Array([
    // Vertex coordinate, Texture coordinate
    -0.5,  0.5,   -0.3, 1.7,
    -0.5, -0.5,   -0.3, -0.2,
     0.5,  0.5,   1.7, 1.7,
     0.5, -0.5,   1.7, -0.2
  ]);

  const n = 4

  const vertexTexCoordBuffer = gl.createBuffer()
  if(!vertexTexCoordBuffer) {
    console.log('Failed to create the buffer object');
    return false;
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexTexCoordBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, verticesTexCoords, gl.STATIC_DRAW)

  const FSIZE = verticesTexCoords.BYTES_PER_ELEMENT // 类型化数组中每个元素的字节大小

  const a_Position = gl.getAttribLocation(gl.program, "a_Position");
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position')
    return -1;
  }
  const a_TextCoord = gl.getAttribLocation(gl.program, 'a_TextCoord')
  if (a_TextCoord < 0) {
    console.log('Failed to get the storage location of a_TextCoord');
    return -1;
  }

  // 第五个参数：指定相邻两个顶点间的字节数
  // 第六个参数：指定缓冲区对象中的偏移量（以字节为单位）
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 4, 0)
  gl.enableVertexAttribArray(a_Position)

  gl.vertexAttribPointer(a_TextCoord, 2, gl.FLOAT, false, FSIZE * 4, FSIZE * 2)
  gl.enableVertexAttribArray(a_TextCoord)

  return n
}
// 配置和加载纹理
function initTextures(gl, n) {
  const texture = gl.createTexture();
  if(!texture) {
    console.log('Failed to create the texture object');
    return false;
  }

  const u_Sampler = gl.getUniformLocation(gl.program, 'u_Sampler')
  if (!u_Sampler) {
    console.log('Failed to get the storage location of u_Sampler')
    return false
  }

  const image = new Image()
  if (!image) {
    console.log('Failed to create the image object');
    return false;
  }
  image.onload = function() {
    loadTexture(gl, n, texture, u_Sampler, image)
  }
  image.src = '../../examples/resources/sky.jpg'

  return true
}
// 使用纹理
function loadTexture(gl, n, texture, u_Sampler, image) {
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1) //y轴反转
  gl.activeTexture(gl.TEXTURE0); // 开启0号纹理单元
  gl.bindTexture(gl.TEXTURE_2D, texture) // 向target绑定纹理对象
  // 配置纹理参数
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT)
  // 配置纹理图像，将纹理图像存储在了webGL系统中的纹理对象中
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  // 将0号纹理传递给着色器中的取样器变量
  gl.uniform1i(u_Sampler, 0)

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, n)
}