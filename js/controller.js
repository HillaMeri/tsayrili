'use strict'

window.onload = onInit

// Set-up the canvas and add our event handlers after the page has loaded
function onInit() {
    initCanvas()
    renderUser()
    // buttons
    document.querySelector('.btn-draw-word').addEventListener('click', onDrawWord)
    document.querySelector('.btn-guess-word').addEventListener('click', onGuessWord)
    document.querySelector('.btn-back-home').addEventListener('click', onBackHome)
    document.querySelector('.btn-clear').addEventListener('click', clearCanvas)
    document.querySelector('.btn-cancel').addEventListener('click', onExitWord)
    document.querySelector('input[name=color]').addEventListener('change', onSetColor)
    document.querySelector('input[name=brushSize]').addEventListener('change', onSetBrushSize)
    document.querySelector('.btn-play').addEventListener('click', onPlayDraw)
    document.querySelector('.btn-send').addEventListener('click', onSendDraw)
    renderWords();
}

function renderWords() {
    const words = getWords();
    const wordsScoreName = getWordsScoreName()
    const strHTMLs = words.map(word => `
    <li data-word="${word.txt}">
        <span>${word.txt}</span>    
        <span> 
        ${wordsScoreName[word.score]}
        ${'💰'.repeat(word.score)}
        </span>
    </li>`)
    document.querySelector('.word-list').innerHTML = strHTMLs.join('')
    document.querySelector('.word-list').addEventListener('click', ev => onChooseWord(ev))
}

function onDrawWord() {
    document.querySelector('.home-game').hidden = true
    document.querySelector('.step-select-word').hidden = false
    document.querySelector('.btn-send').hidden = false

}

function onGuessWord() {
    const drawToGuss = getDrawToGuess();
    if (!drawToGuss) console.log('No draws');
    else {

        document.querySelector('.home-game').hidden = true
        document.querySelector('.step-draw').hidden = false
        document.querySelector('.step-guess').hidden = false
        document.querySelector('.btn-send').hidden = true

        onPlayDraw(drawToGuss.drawDots)
        const currWordTxt = drawToGuss.word;
        var letters = currWordTxt.split('')
        while (letters.length < 12) {
            const letter = getRandomLetter();
            letters.push(letter)
        }
        shuffleArray(letters)
        const strHTMLs = letters.map(letter => `<li data-letter="${letter}">
        ${letter}
        </li>`)


        document.querySelector('.letter-list').innerHTML = strHTMLs.join('')
        document.querySelector('.spot-list').innerHTML = currWordTxt.split('').map((letter, idx) => `<li data-idx="${idx}"></li>`).join('')
        document.querySelector('.letter-list').addEventListener('click', ev => onChooseLetter(ev))
        document.querySelector('.spot-list').addEventListener('click', ev => onRevertLetter(ev))

    }
}

function onBackHome() {
    const isSure = confirm('האם תרצה לצאת?')
    if (isSure) backHome();
}

function backHome() {
    document.querySelector('.home-game').hidden = false
    document.querySelector('.step-draw').hidden = true
    document.querySelector('.step-guess').hidden = true
    document.querySelector('.step-select-word').hidden = true
}


function onChooseWord(ev) {
    document.querySelector('.step-select-word').hidden = true
    document.querySelector('.step-draw').hidden = false
    const el = ev.target.closest('[data-word]')
    const { word } = el.dataset
    if (!word) return
    setCurrWordTxt(word)
    document.querySelector('.step-draw h2 span').innerText = word
}

function onExitWord() {
    setCurrWordTxt(null)
    clearCanvas()
    clearDraw()
    document.querySelector('.step-select-word').hidden = false
    document.querySelector('.step-draw h2 span').innerText = ''
    document.querySelector('.step-draw').hidden = true
    document.querySelector('.step-guess').hidden = true
}

function onSendDraw() {
    var newDraw = drawEnd();
    addDraw(newDraw);
    clearCanvas();
    backHome();
}

function onRevertLetter(ev) {
    var guessWordTxt = getGuessWordTxt();
    const el = ev.target.closest('[data-idx]')
    if (!el) return;
    const { idx } = el.dataset
    el.innerText = '';
    var letters = guessWordTxt.split('')
    letters.splice(idx, 1, ' ')
    guessWordTxt = letters.join('')
    setGuessWordTxt(guessWordTxt)
}

function onChooseLetter(ev) {
    var guessWordTxt = getGuessWordTxt();
    const currDraw = getCurrDraw();
    const el = ev.target.closest('[data-letter]')
    if (!el) return;
    const { letter } = el.dataset
    const lis = Array.from(document.querySelectorAll('.spot-list li'));
    const idxFreeSpot = lis.findIndex(li => !li.innerText.trim())
    if (idxFreeSpot === -1) return;
    lis[idxFreeSpot].innerText = letter;
    if (idxFreeSpot >= guessWordTxt.length) {
        guessWordTxt += letter;
    } else {
        const letters = guessWordTxt.split('')
        letters.splice(idxFreeSpot, 1, letter)
        guessWordTxt = letters.join('')
    }
    setGuessWordTxt(guessWordTxt)
    console.log('Curr word:', guessWordTxt)
    if (guessWordTxt === currDraw.word) {
        alert('ניצחון!');
    }
}

function onPlayDraw() {
    clearCanvas();
    const currDraw = getCurrDraw();
    currDraw.drawDots.forEach((dot, idx) => {
        setTimeout(drawDot, 10 * idx, dot)
    })
}