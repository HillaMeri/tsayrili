'use strict'

var gCurrWordTxt = '';
var gGuessedWordTxt = '';

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

var gDrawsToGuess = []

var gCurrDrawToGuess = {
    word: '',
    drawDots: []
}

function getWords() {
    return gWords;
}

function getWordsScoreName() {
    return gWordScoreName;
}

function getCurrWordTxt() {
    return gCurrWordTxt;
}
function setCurrWordTxt(currWordTxt) {
    gCurrWordTxt = currWordTxt;
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
        word: gCurrWordTxt,
        drawDots: draw.drawDots
    }
    gCurrWordTxt = '';
    gDrawsToGuess.push(newDraw)
}

function getDrawToGuess() {
    gCurrDrawToGuess = gDrawsToGuess.pop();
    return gCurrDrawToGuess;
}

function getCurrDraw(){
    return gCurrDrawToGuess;
}
