/// <reference path="../typings/bundle.d.ts" />

'use strict';

import CanvasView = require('./CanvasView');

document.addEventListener('DOMContentLoaded', () => {
  var view = new CanvasView();
  document.body.appendChild(view.domElement);
});
