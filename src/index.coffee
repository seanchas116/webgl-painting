'use strict'

class PaintCanvas

  constructor: (@canvas) ->
    @context = @canvas.getContext '2d'
    @context.strokeStyle = '#000'
    @context.fillStyle = '#fff'
    @context.fillRect(0, 0, @canvas.width, @canvas.height)

    @canvas.addEventListener 'mousemove', @onMouseMove.bind(this)
    @canvas.addEventListener 'mousedown', @onMouseDown.bind(this)
    @canvas.addEventListener 'mouseup', @onMouseUp.bind(this)

    @canvas.addEventListener 'touchmove', @onTouchMove.bind(this)
    @canvas.addEventListener 'touchstart', @onTouchStart.bind(this)
    @canvas.addEventListener 'touchend', @onTouchEnd.bind(this)

  begin: (x, y) ->
    @lastX = x
    @lastY = y
    @pressed = true

  end: ->
    @pressed = false

  stroke: (x, y) ->
    #console.log [@lastX, @lastY]
    #console.log [x, y]

    cxt = @context
    cxt.beginPath()
    cxt.lineWidth = 2
    cxt.moveTo @lastX, @lastY
    cxt.lineTo x, y
    cxt.closePath()
    cxt.stroke()
    @lastX = x
    @lastY = y

  onMouseMove: (ev) ->
    #console.log "move at #{ev.clientX}, #{ev.clientY}"
    if @pressed
      @stroke(ev.clientX, ev.clientY)

  onMouseDown: (ev) ->
    #console.log "down at #{ev.clientX}, #{ev.clientY}"
    @begin(ev.clientX, ev.clientY)

  onMouseUp: (ev) ->
    #console.log "up at #{ev.clientX}, #{ev.clientY}"
    @end()

  onTouchMove: (ev) ->
    if @pressed && ev.touches.length == 1
      touch = ev.touches[0]
      @stroke(touch.clientX, touch.clientY)
    ev.preventDefault()

  onTouchStart: (ev) ->
    if ev.touches.length == 1
      touch = ev.touches[0]
      @begin(touch.clientX, touch.clientY)
      ev.preventDefault()

  onTouchEnd: (ev) ->
    @end()
    ev.preventDefault()


init = ->

  canvas = document.querySelector '#canvas'
  context = canvas.getContext '2d'

  resizeCanvas = ->
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

  window.addEventListener 'resize', resizeCanvas
  resizeCanvas()

  new PaintCanvas(canvas)

document.addEventListener 'DOMContentLoaded', init
