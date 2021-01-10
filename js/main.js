'use strict'
var gCanvas, gCtx
var isMouseDown = false

var gCurrWordTxt = '';
var gGuessedWordTxt = '';

const gDraw = {
    color: 'black',
    brushSize: 1
}
const gDrawDots = window.dots = []

const gLetters = 'אבגדהוזחטיכלמנסעפצקרשת'.split('');

const gWordScoreName = {
    1: 'קל',
    2: 'בינוני',
    3: 'קשה'
}

const gWords = [
    {
        txt: 'חתול',
        score: 1
    },
    {
        txt: 'מגנט',
        score: 2
    },
    {
        txt: 'מלח',
        score: 3
    },
]



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
}

// Keep track of the mouse button being pressed and draw a dot at current location
function onCanvasMouseDown(ev) {
    isMouseDown = true
    const mousePos = getMousePos(ev)

    drawDot(gCtx, mousePos)
}

// Keep track of the mouse button being released
function onCanvasMouseUp() {
    isMouseDown = false
}

// Keep track of the mouse position and draw a dot if mouse button is currently pressed
function onCanvasMouseMove(ev) {
    const mousePos = getMousePos(ev)

    // Draw a dot if the mouse button is currently being pressed
    if (isMouseDown) {
        drawDot(mousePos)
    }
}

function playDraw() {
    clearCanvas();
    gDrawDots.forEach((dot, idx) => {
        setTimeout(drawDot, 10 * idx, dot)
    })
}

function getMousePos(ev) {
    const mousePos = {
        x: ev.offsetX || ev.layerX || 0,
        y: ev.offsetY || ev.layerY || 0
    }
    // if (isMouseDown) console.log('mousePos', mousePos);
    return mousePos
}

function onSetColor(ev) {
    gDraw.color = ev.target.value
}
function onSetBrushSize(ev) {
    gDraw.brushSize = +ev.target.value
}


// Set-up the canvas and add our event handlers after the page has loaded
function onInit() {
    // Get the specific canvas element from the HTML document
    gCanvas = document.querySelector('canvas')
    gCtx = gCanvas.getContext('2d')
    gCanvas.addEventListener('mouseout', ()=>{
        isMouseDown = false
    })
    gCanvas.addEventListener('mousedown', onCanvasMouseDown)
    gCanvas.addEventListener('touchstart', onCanvasMouseDown)
    gCanvas.addEventListener('mousemove', onCanvasMouseMove)
    gCanvas.addEventListener('touchmove', (ev) => {
        ev.preventDefault()
        ev.stopPropagation()
        var touch = ev.touches[0]

        var canvasPos = gCanvas.getBoundingClientRect();
        const mouseEv = {
            offsetX : touch.clientX - canvasPos.left,
            offsetY : touch.clientY - canvasPos.top
        }
        // console.log('TOUCH dispatching mouseEvent', mouseEvent);
        // gCanvas.dispatchEvent(mouseEvent)
        onCanvasMouseMove(mouseEv)
    })
    gCanvas.addEventListener('mouseup', onCanvasMouseUp)
    gCanvas.addEventListener('touchend', onCanvasMouseUp)
    gCanvas.addEventListener('touchup', onCanvasMouseUp)

    // buttons
    document.querySelector('.btn-clear').addEventListener('click', clearCanvas)
    document.querySelector('.btn-cancel').addEventListener('click', () => {
        gCurrWordTxt = null;
        document.querySelector('.step-select-word').hidden = false
        document.querySelector('.step-draw h2 span').innerText = ''
        document.querySelector('.step-draw').hidden = true

    })
    document.querySelector('input[name=color]').addEventListener('change', onSetColor)
    document.querySelector('input[name=brushSize]').addEventListener('change', onSetBrushSize)

    document.querySelector('.btn-play').addEventListener('click', playDraw)
    document.querySelector('.btn-send').addEventListener('click', () => {
        document.querySelector('.btn-send').hidden = true
        document.querySelector('.step-guess').hidden = false

        var letters = gCurrWordTxt.split('')
        while (letters.length < 12) {
            const letter = gLetters[parseInt(Math.random() * gLetters.length)]
            letters.push(letter)
        }
        shuffleArray(letters)
        const strHTMLs = letters.map(letter => `<li data-letter="${letter}">
            ${letter}
        </li>`)


        document.querySelector('.letter-list').innerHTML = strHTMLs.join('')
        document.querySelector('.spot-list').innerHTML = gCurrWordTxt.split('').map((letter, idx) => `<li data-idx="${idx}"></li>`).join('')

        document.querySelector('.letter-list').addEventListener('click', ev => {
            const el = ev.target.closest('[data-letter]')
            if (!el) return;
            const { letter } = el.dataset
            const lis = Array.from(document.querySelectorAll('.spot-list li'));
            const idxFreeSpot = lis.findIndex(li => !li.innerText.trim())
            if (idxFreeSpot === -1) return;
            lis[idxFreeSpot].innerText = letter;
            if (idxFreeSpot >= gGuessedWordTxt.length) {
                gGuessedWordTxt += letter;
            } else {
                const letters = gGuessedWordTxt.split('')
                letters.splice(idxFreeSpot, 1, letter)
                gGuessedWordTxt = letters.join('')
            }
            console.log('Curr word:', gGuessedWordTxt)
            if (gGuessedWordTxt === gCurrWordTxt) {
                alert('ניצחון!');
            }

        })
        document.querySelector('.spot-list').addEventListener('click', ev => {
            const el = ev.target.closest('[data-idx]')
            if (!el) return;

            const { idx } = el.dataset

            el.innerText = '';

            var letters = gGuessedWordTxt.split('')
            letters.splice(idx, 1, ' ')
            gGuessedWordTxt = letters.join('')

        })        

    })
    renderWords();
}

function renderWords() {

    const strHTMLs = gWords.map(word => `
    <li data-word="${word.txt}">
        <span>${word.txt}</span>    
        <span> 
        ${gWordScoreName[word.score]}
        ${'💰'.repeat(word.score)}
        </span>
    </li>`)
    document.querySelector('.word-list').innerHTML = strHTMLs.join('')
    document.querySelector('.word-list').addEventListener('click', ev => {
        const el = ev.target.closest('[data-word]')
        const { word } = el.dataset
        if (!word) return
        gCurrWordTxt = word;
        document.querySelector('.step-select-word').hidden = true
        document.querySelector('.step-draw h2 span').innerText = word
        document.querySelector('.step-draw').hidden = false
    })
}


function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

window.onload = onInit