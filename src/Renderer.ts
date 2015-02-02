'use strict';

import Shader = require('./Shader');
import Polygon = require('./Polygon');
var glMatrix = require('gl-matrix');
var mat3 = glMatrix.mat3;
var vec2 = glMatrix.vec2;
var vec4 = glMatrix.vec4;

class Renderer {

  gl: WebGLRenderingContext;
  shader: Shader;
  width = 0;
  height = 0;
  immediatePolygons: Polygon[] = [];

  constructor(gl: WebGLRenderingContext, shader: Shader) {
    this.gl = gl;
    this.shader = shader;

    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.clearColor(1, 1, 1, 1);
  }

  renderTest() {
    var gl = this.gl;
    var shader = this.shader;

    gl.uniformMatrix3fv(shader.uViewportMatrix, false, this.createViewportMatrix());
    gl.uniformMatrix3fv(shader.uCanvasMatrix, false, this.createCanvasMatrix());

    var vertices = [
      0, 0, 100, 100, 0, 100
    ];

    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    var location = gl.getAttribLocation(this.shader.programIndex, "position");
    gl.vertexAttribPointer(location, 2, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  resize(width: number, height: number) {
    var gl = this.gl;

    this.width = width;
    this.height = height;

    gl.viewport(0, 0, width, height);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    //this.renderTest();
  }

  addImmediate(polygon: Polygon) {
    this.immediatePolygons.push(polygon);
  }

  updateImmediate() {
    requestAnimationFrame(this.renderImmediate.bind(this));
  }

  renderImmediate() {
    var gl = this.gl;
    var shader = this.shader;

    //gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.uniformMatrix3fv(shader.uViewportMatrix, false, this.createViewportMatrix());
    gl.uniformMatrix3fv(shader.uCanvasMatrix, false, this.createCanvasMatrix());

    this.immediatePolygons.forEach(polygon => {
      gl.bindBuffer(gl.ARRAY_BUFFER, polygon.bufferIndex);
      gl.vertexAttribPointer(this.shader.aPosition, 2, gl.FLOAT, false, 0, 0);
      gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    });

    gl.finish();

    this.immediatePolygons = [];
  }

  createViewportMatrix() {
    // view coord -> normalized coord
    var mat = mat3.create();
    mat3.scale(mat, mat, vec2.fromValues(1, -1));
    mat3.translate(mat, mat, vec2.fromValues(-1, -1));
    mat3.scale(mat, mat, vec2.fromValues(2, 2));
    mat3.scale(mat, mat, vec2.fromValues(1 / this.width, 1 / this.height));
    return mat;
  }

  createCanvasMatrix() {
    return mat3.create();
  }
}

export = Renderer;
