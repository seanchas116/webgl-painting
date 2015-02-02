import _ = require('lodash');

class Polygon {

  gl: WebGLRenderingContext;
  bufferIndex: WebGLBuffer;

  constructor(gl: WebGLRenderingContext, vertices: Float32Array[]) {
    this.gl = gl;
    this.bufferIndex = gl.createBuffer();

    var data = new Float32Array(vertices.length * 2);
    vertices.forEach((v, i) => {
      data.set(v, i * 2);
    });

    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferIndex);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
  }

}

export = Polygon;
