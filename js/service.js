'use strict'

var gCurrWord = {
    txt: '',
    score: ''
};
var gGuessedWordTxt = '';

var draw = {
    _id: '123',
    word: {
        txt: 'חתול',
        score: 2
    },
    drawDots: [
        { x: 81, y: 74, color: 'black', brushSize: 1 },
        { x: 77, y: 90, color: 'black', brushSize: 1 },
        { x: 73, y: 100, color: 'black', brushSize: 1 },
        { x: 70, y: 110, color: 'black', brushSize: 1 },
        { x: 67, y: 119, color: 'red', brushSize: 3 },
        { x: 60, y: 130, color: 'red', brushSize: 3 },
        { x: 58, y: 120, color: 'red', brushSize: 3 },
        { x: 57, y: 100, color: 'red', brushSize: 3 },
    ],
    lettersToGuess: [],
    isBombUsed: false
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

const gWordScoreName = {
    1: 'קל',
    2: 'בינוני',
    3: 'קשה'
}

const gLetters = 'אבגדהוזחטיכלמנסעפצקרשת'.split('');

var gDrawsToGuess = [draw]

var gCurrDrawToGuess = {}

var gLettersMoves = []

function setLetterMove(letter, idx, isIn = false) {
    var move = {
        letter,
        idx,
        in: isIn
    }
    gLettersMoves.push(move)
}


function getWords() {
    return gWords;
}

function getWordsScoreName() {
    return gWordScoreName;
}

function setCurrWord(currWord) {
    gCurrWord = { ...currWord }
}

function getGuessWordTxt() {
    return gGuessedWordTxt;
}

function setGuessWordTxt(gussWordTxt) {
    gGuessedWordTxt = gussWordTxt;
}

function getRandomLetter() {
    return gLetters[parseInt(Math.random() * gLetters.length)]
}

function addDraw(draw) {
    const newDraw = {
        _id: makeId(),
        word: gCurrWord.txt,
        score: gCurrWord.score,
        drawDots: draw.drawDots,
        lettersToGuess: [],
        isBombUsed: false,
        createdBy: getLogginUser()
    }
    gCurrWord = {
        txt: '',
        score: 0
    }

    gDrawsToGuess.push(newDraw);

    addUserDraw(newDraw);
}

function getDrawToGuess() {
    //TODO: CHANGE FROM [0] TO POP():
    // gCurrDrawToGuess = gDrawsToGuess.pop();
    gCurrDrawToGuess = gDrawsToGuess[0];
    return gCurrDrawToGuess;
}

function getCurrDraw() {
    console.log(gCurrDrawToGuess);
    return gCurrDrawToGuess;
}

function addLetterDrawToGuess(letter) {
    gCurrDrawToGuess.lettersToGuess.push(letter)
}

function getIsUseBomb(){
    console.log(gCurrDrawToGuess.iBombUsed);
    return gCurrDrawToGuess.iBombUsed
}

function usBomb() {
    gCurrDrawToGuess.iBombUsed = true;
    userUseBomb()
}

function changeLetters() {
    gCurrDrawToGuess.lettersToGuess = [];
}

// function addDrawToSession() {
    
// }
