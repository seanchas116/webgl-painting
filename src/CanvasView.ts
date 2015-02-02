'use strict';

import Renderer = require('./Renderer');
import Shader = require('./Shader');
import SimpleShader = require('./SimpleShader');
import Polygon = require('./Polygon');
var vec2 = require('gl-matrix').vec2;

class CanvasView {
  gl: WebGLRenderingContext;
  domElement: HTMLCanvasElement;
  renderer: Renderer;
  shader: Shader;
  lastX = 0;
  lastY = 0;
  pressed = false;
  lineWidth = 4;

  constructor() {
    var element = this.domElement = document.createElement('canvas');

    var gl = this.gl = this.domElement.getContext('webgl', { preserveDrawingBuffer: true });
    var shader = this.shader = new SimpleShader(gl);
    var renderer = this.renderer = new Renderer(gl, shader);
    this.resize(window.innerWidth, window.innerHeight);

    element.addEventListener('mousemove', this.onMouseMove.bind(this));
    element.addEventListener('mousedown', this.onMouseDown.bind(this));
    element.addEventListener('mouseup', this.onMouseUp.bind(this));

    element.addEventListener('touchmove', this.onTouchMove.bind(this));
    element.addEventListener('touchstart', this.onTouchStart.bind(this));
    element.addEventListener('touchend', this.onTouchEnd.bind(this));
  }

  resize(width: number, height: number) {
    this.domElement.width = width;
    this.domElement.height = height;
    this.renderer.resize(width, height);
  }

  begin(x: number, y: number) {
    this.lastX = x;
    this.lastY = y;
    this.pressed = true;
  }
  end() {
    this.pressed = false;
  }
  stroke(x: number, y: number) {
    var start = vec2.fromValues(this.lastX, this.lastY);
    var end = vec2.fromValues(x, y);

    var segment = vec2.create();
    vec2.sub(segment, end, start);
    var normal = vec2.fromValues(-segment[1], segment[0]);
    vec2.normalize(normal, normal);

    var v1 = vec2.create();
    vec2.scaleAndAdd(v1, start, normal, this.lineWidth / 2);
    var v2 = vec2.create();
    vec2.scaleAndAdd(v2, end, normal, this.lineWidth / 2);
    var v3 = vec2.create();
    vec2.scaleAndAdd(v3, end, normal, - this.lineWidth / 2);
    var v4 = vec2.create();
    vec2.scaleAndAdd(v4, start, normal, - this.lineWidth / 2);

    var polygon = new Polygon(this.gl, [v1, v2, v3, v4]);
    this.renderer.addImmediate(polygon);

    this.lastX = x;
    this.lastY = y;

    this.renderer.updateImmediate();
  }

  onMouseMove(ev: MouseEvent) {
    if (this.pressed) {
      this.stroke(ev.clientX, ev.clientY);
    }
  }
  onMouseDown(ev: MouseEvent) {
    this.begin(ev.clientX, ev.clientY);
  }
  onMouseUp(ev: MouseEvent) {
    this.end();
  }

  onTouchMove(ev: any) {
    if (this.pressed && ev.touches.length == 1) {
      var touch = ev.touches[0];
      this.stroke(touch.clientX, touch.clientY);
    }
    ev.preventDefault();
  }
  onTouchStart(ev: any) {
    if (ev.touches.length == 1) {
      var touch = ev.touches[0];
      this.begin(touch.clientX, touch.clientY);
    }
    ev.preventDefault();
  }
  onTouchEnd(ev: any) {
    this.end();
    ev.preventDefault();
  }
}

export = CanvasView;
