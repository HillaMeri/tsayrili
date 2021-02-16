'use strict'

window.onload = onInit

// Set-up the canvas and add our event handlers after the page has loaded
function onInit() {
    initCanvas()
    renderUser()
    // buttons
    document.querySelector('.btn-draw-word').addEventListener('click', onDrawWord)
    document.querySelector('.btn-guess-word').addEventListener('click', onGuessWord)

    document.querySelector('.btn-clear').addEventListener('click', clearCanvas)
    document.querySelector('.btn-cancel').addEventListener('click', onExitWord)
    // document.querySelector('input[name=color]').addEventListener('change', onSetColor)
    document.querySelector('input[name=brushSize]').addEventListener('change', onSetBrushSize)
    // document.querySelector('btn-brush').addEventListener('click', onSetBrushSize)
    document.querySelector('.btn-play').addEventListener('click', onPlayDraw)
    document.querySelector('.btn-send').addEventListener('click', onSendDraw)
    document.querySelector('.btn-bomb').addEventListener('click', onUseBomb)
    document.querySelector('.btn-replace-letters').addEventListener('click', onPutLetters)
    renderWords();
}

function renderWords() {
    const words = getWords();
    const wordsScoreName = getWordsScoreName()
    const strHTMLs = words.map(word => `
    <li data-txt="${word.txt}" data-score="${word.score}">
    <span class="word-score-name">${wordsScoreName[word.score]}</span>
        <span class="word-txt">${word.txt}</span>    
        <span>${'<img src="img/currency.png" />'.repeat(word.score)}</span>
    </li>`)
    document.querySelector('.word-list').innerHTML = strHTMLs.join('')
    document.querySelector('.word-list').addEventListener('click', ev => onChooseWord(ev))
}


function onDrawWord() {
    const elheaderAction = document.querySelector('.header-action');
    elheaderAction.innerHTML = `<button class="btn-back-home">
             <i class="fas fa-chevron-left"></i>
            </button>`
    document.querySelector('.new-game').style.display = "none";
    // document.querySelector('.home-game').hidden = true
    document.querySelector('.step-select-word').hidden = false
    document.querySelector('.btn-back-home').addEventListener('click', onBackHome)
}

function onGuessWord() {
    const drawToGuss = getDrawToGuess();
    if (!drawToGuss) console.log('No draws');
    else {
        document.querySelector('.btn-action').hidden = true;
        document.querySelector('.color-palt').hidden = true;
        onPutLetters();
    }
    // startSession();
}

function onBackHome() {
    const isSure = true;
    // = confirm('האם תרצה לצאת?')
    if (isSure) backHome();
}

function backHome() {
    document.querySelector('.new-game').style.display = "flex";
    document.querySelector('.home-game').hidden = false
    document.querySelector('.step-draw').hidden = true
    document.querySelector('.step-guess').hidden = true
    document.querySelector('.step-select-word').hidden = true
    renderUserImg()
}

function onChooseWord(ev) {
    document.querySelector('.home-game').hidden = true
    document.querySelector('.step-draw').hidden = false
    const el = ev.target.closest('[data-txt]')
    const { txt, score } = el.dataset
    if (!txt) return
    const word = {
        txt,
        score
    }
    setCurrWord(word)
    document.querySelector('.step-draw h2 span').innerText = ' ' + word.txt
}

function onExitWord() {
    const word = {
        txt: null,
        score: 0
    }
    setCurrWord(word)
    clearCanvas()
    clearDraw()
    backHome()
    // document.querySelector('.home-game').hidden = false
    // document.querySelector('.step-draw h2 span').innerText = ''
    // document.querySelector('.step-draw').hidden = true
    // document.querySelector('.step-guess').hidden = true
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
    const letter = el.innerText
    const { idx } = el.dataset
    setLetterMove('', parseInt(idx))
    el.innerText = '';
    var letters = guessWordTxt.split('')
    letters.splice(idx, 1, ' ')
    guessWordTxt = letters.join('')
    setGuessWordTxt(guessWordTxt)
    let elLetter = document.querySelector(`.${letter}`)
    elLetter.classList.remove('letter-choosen');
    elLetter.classList.remove(`${letter}`);
}

function onChooseLetter(ev) {
    var guessWordTxt = getGuessWordTxt();
    const currDraw = getCurrDraw();
    const el = ev.target.closest('[data-letter]')
    if (!el) return;
    const { letter } = el.dataset
    el.classList.add('letter-choosen');
    el.classList.add(`${letter}`);
    // el.removeEventListener('click', onChooseLetter);

    const lis = Array.from(document.querySelectorAll('.spot-list li'));
    const idxFreeSpot = lis.findIndex(li => !li.innerText.trim())
    if (idxFreeSpot === -1) return;
    lis[idxFreeSpot].innerText = letter;
    setLetterMove(letter, idxFreeSpot, true)

    if (idxFreeSpot >= guessWordTxt.length) {
        guessWordTxt += letter;
    } else {
        const letters = guessWordTxt.split('')
        letters.splice(idxFreeSpot, 1, letter)
        guessWordTxt = letters.join('')
    }

    setGuessWordTxt(guessWordTxt)
    console.log('Curr word:', guessWordTxt)
    console.log(currDraw.word.txt);
    if (guessWordTxt === currDraw.word.txt) {
        addUserScore(currDraw.word.score)
        alert('ניצחון!');
        backHome();
    }
}

function onPlayDraw() {
    clearCanvas();
    const currDraw = getCurrDraw();
    currDraw.drawDots.forEach((dot, idx) => {
        setTimeout(drawDot, 10 * idx, dot)
    })
}

function onUseBomb() {
    if (getIsUseBomb()) return
    // useBomb()
    var drawToGuess = getDrawToGuess();
    var letters = drawToGuess.word.txt.split('')
    while (letters.length < 8) {
        letters.push(drawToGuess.extraLetters.pop())
    }

    shuffleArray(letters)
    setDrawLettersList(letters)

    const strHTMLs = letters.map(letter => `<li data-letter="${letter}">
    ${letter}
    </li>`)

    document.querySelector('.letter-list').innerHTML = strHTMLs.join('')
    document.querySelector('.spot-list').innerHTML = drawToGuess.word.txt.split('').map((letter, idx) => `<li data-idx="${idx}"></li>`).join('')
    // document.querySelector('.letter-list').addEventListener('click', ev => onChooseLetter(ev))
    // document.querySelector('.spot-list').addEventListener('click', ev => onRevertLetter(ev))

}

function onPutLetters() {
    if (getIsUseBomb()) return
    changeLetters();
    const drawToGuss = getDrawToGuess();
    document.querySelector('.home-game').hidden = true
    document.querySelector('.step-draw').hidden = false
    document.querySelector('.step-guess').hidden = false
    document.querySelector('.btn-send').hidden = true

    onPlayDraw(drawToGuss.drawDots)
    const currWordTxt = drawToGuss.word.txt;
    console.log("🚀 ~ file: controller.js ~ line 205 ~ onPutLetters ~ currWordTxt", drawToGuss)
    var letters = currWordTxt.split('')
    while (letters.length < 12) {
        const letter = getRandomLetter();
        letters.push(letter)
        addLetterDrawToGuess(letter)
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