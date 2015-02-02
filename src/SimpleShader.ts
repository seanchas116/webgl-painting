'use strict';

import Shader = require('./shader');
var glMatrix = require('gl-matrix');
var vec4 = glMatrix.vec4;

class SimpleShader extends Shader {

  constructor(gl: WebGLRenderingContext) {
    var vertexShaderScript = `
      uniform mat3 viewportMatrix;
      uniform mat3 canvasMatrix;
      attribute vec2 position;
      void main(void) {
        vec3 pos = viewportMatrix * canvasMatrix * vec3(position, 1.0);
        gl_Position = vec4(pos.xy, 0.0, 1.0);
        //gl_Position = vec4(0.0,0.0,0.0,0.0);
        //gl_Position = vec4(position, 0.0, 1.0);
      }
    `;
    var fragmentShaderScript = `
      precision mediump float;
      uniform vec4 color;
      void main(void) {
        gl_FragColor = color;
        //gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
      }
    `;
    super(gl, vertexShaderScript, fragmentShaderScript);

    gl.uniform4fv(this.uColor, vec4.fromValues(0, 0, 0, 1));
  }
}

export = SimpleShader;
