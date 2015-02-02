'use strict';

class Shader {

  gl: WebGLRenderingContext;
  aPosition: number;
  uViewportMatrix: WebGLUniformLocation;
  uCanvasMatrix: WebGLUniformLocation;
  uColor: WebGLUniformLocation;
  programIndex: WebGLProgram;

  constructor(gl: WebGLRenderingContext, vertexShader: string, fragmentShader: string) {
    this.gl = gl;
    this.setup(vertexShader, fragmentShader);
  }

  compile(script: string, type: number) {
    var gl = this.gl;

    var shader = gl.createShader(type);
    gl.shaderSource(shader, script);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.warn("An error occurred compiling the shaders");
      console.warn(gl.getShaderInfoLog(shader));
      return null;
    }

    return shader;
  }

  setup(vertexShaderScript: string, fragmentShaderScript: string) {
    var gl = this.gl;

    var program = this.programIndex = gl.createProgram();
    gl.attachShader(program, this.compile(vertexShaderScript, gl.VERTEX_SHADER));
    gl.attachShader(program, this.compile(fragmentShaderScript, gl.FRAGMENT_SHADER));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.warn("Failed to link shader program");
    }
    gl.useProgram(program);

    this.aPosition = gl.getAttribLocation(program, 'position');
    this.uViewportMatrix = gl.getUniformLocation(program, 'viewportMatrix');
    this.uCanvasMatrix = gl.getUniformLocation(program, 'canvasMatrix');
    this.uColor = gl.getUniformLocation(program, 'color');

    gl.enableVertexAttribArray(this.aPosition);
  }
}

export = Shader;
