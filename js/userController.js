
function renderUser() {
    const user = getLogginUser();
    renderUserImg();
    const elUserbombs = document.querySelector('.user-bombs span');
    elUserbombs.innerText = user.bombs;
    const elUserCoins = document.querySelector('.user-coins span');
    elUserCoins.innerText = user.coins;
    renderColors(user)
}

function renderUserImg() {
    const user = getLogginUser();
    const elheaderAction = document.querySelector('.header-action');
    elheaderAction.innerHTML = `<img class="user-img" src="${user.imgUrl}" />`;
}

function renderTurn() {
    const user = getLogginUser();
    const elTurnNum = document.querySelector('.turn-count .turn-nlevel')
    elTurnNum.innerText = user.games.length();

    // const elTurnAbout = document.querySelector('.turn-about')
    // elTurnAbout.innerText =  
}

function renderColors(user) {
    // const elPlat = document.querySelector('.color-palt');
    const strHTMLs = user.colors.map(color => {
        return `<button>
        <i data-color=${color}
        style="color:${color}" 
        class="fas fa-paint-brush"></i>`
    })
    document.querySelector('.color-palt').innerHTML = strHTMLs.join('')
    document.querySelector('.color-palt').addEventListener('click', ev => onChoosecolor(ev))
}


function onChoosecolor(ev) {
    const el = ev.target.closest('[data-color]')
    const { color } = el.dataset
    if (!color) return
    setDraw('color', color);
}