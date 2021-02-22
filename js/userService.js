export const userService = {
    getLogginUser,
    addUserDraw,
    addUserScore
}

const user = {
    _id: '0a',
    username: 'הילה',
    coins: 5,
    bombs: 3,
    imgUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrVnja3DFheGQjch5AL1n0Rk8nOFHm6Ny60w&usqp=CAU',
    games: [],
    draws: [],
    colors: ['black', 'red', 'yellow', 'blue', 'green']
}

const user2 = {
    _id: '0b',
    username: 'ירון',
    coins: 20,
    bombs: 4,
    imgUrl: ''
}

function getLogginUser() {
    return user;
}

function addUserDraw(draw) {
    user.draws.push(draw);
}

function addUserScore(score) {
    user.score += score;
}

