// 顶点着色器
let VSHADER_SOURCE = `
attribute vec4 a_Position;
void main(){
  gl_Position = a_Position;
  gl_PointSize = 10.0;
}`;
// 片元着色器
let FSHADER_SOURCE = `
precision mediump float;
uniform vec4 u_FragColor;
void main(){
  gl_FragColor = u_FragColor;
}`;

function main() {
  // https://medium.com/@armno/vscode-and-webgl-development-dfc17bba52ed
  const canvas = document.createElement("canvas");
  document.querySelector("body").appendChild(canvas);
  canvas.width = 400;
  canvas.height = 400;
  const gl = canvas.getContext("webgl");
  
  if (!gl) {
    alert(
      "Unable to initialize WebGL. Your browser or machine may not support it."
    );
    return;
  }

  if (!initShaderProgram(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log("Failed to initialize shader");
    return;
  }
 
  // 获取attribute变量的存储位置
  let a_Position = gl.getAttribLocation(gl.program, "a_Position");
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position')
    return
  }
  let u_FragColor = gl.getUniformLocation(gl.program, "u_FragColor");
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return
  }

  canvas.addEventListener("click", e => {
    clickHandler(e, gl, canvas, a_Position, u_FragColor);
  });

  // 指定清空<canvas>的颜色
  gl.clearColor(0.2, 0.2, 0.2, 0.8);
  
  // 清空<canvas>
  // 基于多基本缓冲区模型
  // COLOR_BUFFER_BIT意为清空颜色缓冲区，即清空<canvas>的区域
  // 参见opengl
  gl.clear(gl.COLOR_BUFFER_BIT);
}

let g_points = []
let g_colors = []
function clickHandler(e, gl, canvas, a_Position, u_FragColor) {
  let x = e.clientX; 
  let y = e.clientY; 
  const rect = e.target.getBoundingClientRect() ;

  // 算法没懂
  x = ((x - rect.left ) - canvas.width / 2) / (canvas.width / 2);
  y = (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2);
  g_points.push({x,y});

  if (x >= 0.0 && y >= 0.0) {      // First quadrant
    g_colors.push([1.0, 0.0, 0.0, 1.0]);  // Red
  } else if (x < 0.0 && y < 0.0) { // Third quadrant
    g_colors.push([0.0, 1.0, 0.0, 1.0]);  // Green
  } else {                         // Others
    g_colors.push([1.0, 1.0, 1.0, 1.0]);  // White
  }
  
  gl.clear(gl.COLOR_BUFFER_BIT);
  
  for(let i = 0; i < g_points.length; i ++) {
    // Pass the position of a point to a_Position variable
    let xy = g_points[i]
    let rgba = g_colors[i]
    gl.vertexAttrib3f(a_Position, xy.x, xy.y, 0.0);
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
    // Draw
    gl.drawArrays(gl.POINTS, 0, 1);
  }
};