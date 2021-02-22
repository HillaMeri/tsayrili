'use strict'

export const canvasController = {
    initCanvas,
    setDraw,
    clearCanvas,
    // onSetColor,
    // onSetBrushSize,
    clearDraw,
    drawEnd,
    drawDot
}


var gCanvas, gCtx
var isMouseDown = false

var gDrawDots = window.dots = []

const gDraw = {
    color: 'black',
    brushSize: 1
}

function initCanvas() {
    // Get the specific canvas element from the HTML document
    gCanvas = document.querySelector('canvas')
    gCtx = gCanvas.getContext('2d')
    gCanvas.addEventListener('mouseout', () => {
        isMouseDown = false
    })
    gCanvas.addEventListener('mousedown', _onCanvasMouseDown)
    gCanvas.addEventListener('touchstart', _onCanvasMouseDown)
    gCanvas.addEventListener('mousemove', _onCanvasMouseMove)
    gCanvas.addEventListener('touchmove', (ev) => {
        ev.preventDefault()
        ev.stopPropagation()
        var touch = ev.touches[0]

        var canvasPos = gCanvas.getBoundingClientRect();
        const mouseEv = {
            offsetX: touch.clientX - canvasPos.left,
            offsetY: touch.clientY - canvasPos.top
        }
        // console.log('TOUCH dispatching mouseEvent', mouseEvent);
        // gCanvas.dispatchEvent(mouseEvent)
        _onCanvasMouseMove(mouseEv)
    })
    gCanvas.addEventListener('mouseup', _onCanvasMouseUp)
    gCanvas.addEventListener('touchend', _onCanvasMouseUp)
    gCanvas.addEventListener('touchup', _onCanvasMouseUp)

    gCanvas.width = window.innerWidth;
}

// Keep track of the mouse button being pressed and draw a dot at current location
function _onCanvasMouseDown(ev) {
    isMouseDown = true
    const mousePos = _getMousePos(ev)

    drawDot(gCtx, mousePos)
}

function setDraw(type, val) {
    gDraw[type] = val;
}

function _getMousePos(ev) {
    const mousePos = {
        x: ev.offsetX || ev.layerX || 0,
        y: ev.offsetY || ev.layerY || 0
    }
    // if (isMouseDown) console.log('mousePos', mousePos);
    return mousePos
}

// Keep track of the mouse button being released
function _onCanvasMouseUp() {
    isMouseDown = false
}

// Keep track of the mouse position and draw a dot if mouse button is currently pressed
function _onCanvasMouseMove(ev) {
    const mousePos = _getMousePos(ev)

    // Draw a dot if the mouse button is currently being pressed
    if (isMouseDown) {
        drawDot(mousePos)
    }
}


// Draws a dot at a specific position on the supplied canvas name
// Parameters are: A canvas context, the x position, the y position, the size of the dot
function drawDot(pos) {
    const dot = {
        x: pos.x,
        y: pos.y,
        color: pos.color || gDraw.color,
        brushSize: pos.brushSize || gDraw.brushSize
    }
    gDrawDots.push(dot)

    gCtx.fillStyle = dot.color
    // Draw a filled circle
    gCtx.beginPath()
    gCtx.arc(pos.x, pos.y, dot.brushSize * 2, 0, Math.PI * 2, true)
    gCtx.closePath()
    gCtx.fill()
}

function clearCanvas() {
    gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height)
    gDraw.color = 'black'
    gDraw.brushSize = 1
}

function onSetColor(ev) {
    setDraw('color', ev.target.value)
}

function onSetBrushSize(ev) {
    setDraw('brushSize', +ev.target.value)
}

function drawEnd() {
    var newDraw = {
        drawDots: [...gDrawDots],
    }
    gDrawDots = [];
    return newDraw;
}

function clearDraw() {
    gDrawDots = []
}