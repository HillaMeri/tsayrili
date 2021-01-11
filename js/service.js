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

const gDraw = {
    color: 'black',
    brushSize: 1
}

const gLetters = 'אבגדהוזחטיכלמנסעפצקרשת'.split('');

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

function getDraw() {
    return gDraw
}

function setDraw(type, val) {
    gDraw[type] = val;
}

function getRandomLetter() {
    return gLetters[parseInt(Math.random() * gLetters.length)]
}
