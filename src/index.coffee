'use strict'

THREE = require 'three'
_ = require 'lodash'

MAX_VERTEX_COUNT = 256
HIDDEN_VERTEX_Z = -1000000

class PaintCanvas

  constructor: ->
    @width = window.innerWidth
    @height = window.innerHeight

    @scene = new THREE.Scene()
    @camera = new THREE.OrthographicCamera(0, @width, @height, 0, -10, 1000);
    #@camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

    @renderer = new THREE.WebGLRenderer(devicePixelRatio: window.devicePixelRatio || 1)
    @renderer.setSize @width, @height
    @renderer.setClearColor 0xffffff
    @element = @renderer.domElement

    # geometry = new THREE.Geometry()
    # geometry.vertices.push(new THREE.Vector3(0, 0, 0))
    # geometry.vertices.push(new THREE.Vector3(-100, -100, 0))
    # geometry.vertices.push(new THREE.Vector3(-100, 100, 0))
    # geometry.vertices.push(new THREE.Vector3(100, -100, 0))
    # geometry.vertices.push(new THREE.Vector3(100, 100, 0))
    # material = new THREE.LineBasicMaterial(color: 0x00ff00)
    # line = new THREE.Line(geometry, material)
    # @scene.add(line)

    # geometry = new THREE.PlaneGeometry(100, 100)
    # material = new THREE.MeshBasicMaterial(color: 0x00ff00)
    # cube = new THREE.Mesh( geometry, material )
    # @scene.add( cube )

    @element.addEventListener 'mousemove', @onMouseMove.bind(this)
    @element.addEventListener 'mousedown', @onMouseDown.bind(this)
    @element.addEventListener 'mouseup', @onMouseUp.bind(this)

    @element.addEventListener 'touchmove', @onTouchMove.bind(this)
    @element.addEventListener 'touchstart', @onTouchStart.bind(this)
    @element.addEventListener 'touchend', @onTouchEnd.bind(this)

    @render()

  newGeometry: ->
    @geometry = new THREE.Geometry()
    @geometry.dynamic = true

    _.times MAX_VERTEX_COUNT, =>
      @geometry.vertices.push(new THREE.Vector3(0, 0, HIDDEN_VERTEX_Z))

    @vertexCount = 0

    material = new THREE.LineBasicMaterial(color: 0x000000, linewidth: 10)
    line = new THREE.Line(@geometry, material)
    @scene.add(line)

  addVertex: (vertex) ->
    if !@geometry
      @newGeometry()

    if MAX_VERTEX_COUNT <= @vertexCount
      last = @geometry.vertices[@vertexCount - 1]
      @newGeometry()
      @geometry.vertices[0] = last

    @geometry.vertices[@vertexCount] = vertex
    @vertexCount += 1

    @geometry.verticesNeedUpdate = true

  splitVertex: ->
    @addVertex(new THREE.Vector3(0, 0, HIDDEN_VERTEX_Z))

  begin: (x, y) ->
    @pressed = true
    @addVertex(new THREE.Vector3(x, y, 0))

  end: ->
    @splitVertex()
    @pressed = false

  stroke: (x, y) ->
    @addVertex(new THREE.Vector3(x, y, 0))
    @render()

  render: ->
    #console.log 'render'
    requestAnimationFrame =>
      @renderer.render(@scene, @camera)

  onMouseMove: (ev) ->
    #console.log "move at #{ev.clientX}, #{ev.clientY}"
    if @pressed
      @stroke(ev.clientX, @height - ev.clientY)

  onMouseDown: (ev) ->
    #console.log "down at #{ev.clientX}, #{ev.clientY}"
    @begin(ev.clientX, @height - ev.clientY)

  onMouseUp: (ev) ->
    #console.log "up at #{ev.clientX}, #{ev.clientY}"
    @end()

  onTouchMove: (ev) ->
    if @pressed && ev.touches.length == 1
      touch = ev.touches[0]
      @stroke(touch.clientX, @height - touch.clientY)
    ev.preventDefault()

  onTouchStart: (ev) ->
    if ev.touches.length == 1
      touch = ev.touches[0]
      @begin(touch.clientX, @height - touch.clientY)
      ev.preventDefault()

  onTouchEnd: (ev) ->
    @end()
    ev.preventDefault()


init = ->
  canvas = new PaintCanvas()
  document.body.appendChild canvas.element

document.addEventListener 'DOMContentLoaded', init
