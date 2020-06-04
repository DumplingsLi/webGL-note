/**
 * 初始化着色器程序，让wegGL知道如何绘制数据
 * @param gl webGL 绘图上下文
 * @param vshader 顶点着色器程序（字符串）
 * @param fshader 片元着色器程序（字符串）
 * @return true, if the program object was created and successfully made current
**/
function initShaderProgram(gl, vsSource, fsSource) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
  if (!vertexShader || !fragmentShader) {
    return null;
  }

  const shaderProgram = gl.createProgram();
  if (!shaderProgram) {
    return null;
  }

  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  
  gl.linkProgram(shaderProgram);

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert(
      "Unable to initialize the shader program: " +
        gl.getProgramInfoLog(shaderProgram)
    );
    gl.deleteProgram(shaderProgram);
    gl.deleteShader(fragmentShader);
    gl.deleteShader(vertexShader);
    return null;
  }
  gl.useProgram(shaderProgram)
  gl.program = shaderProgram
  
  return shaderProgram;
}

/**
 * 创建指定类型的着色器，上传source源码并编译
 * 创建 shader 对象
 * @param gl webGL 绘图上下文
 * @param type shader 类型
 * @param source shader 程序(字符串)
 * @return shader对象，创建失败为null 
**/
function loadShader(gl, type, source) {
  // 创建新的着色器
  const shader = gl.createShader(type);
  if (shader == null) {
    console.log("unable to create shader");
    return null;
  }

  // 将源代码发送到着色器
  gl.shaderSource(shader, source);
  
  // 编译
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert(
      "An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader)
    );
    gl.deleteShader(shader)
    return null;
  }
  return shader;
}
