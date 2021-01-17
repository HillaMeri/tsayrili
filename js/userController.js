
function renderUser() {
    const user = getLogginUser();
    const elUserImg = document.querySelector('.user-img');
    elUserImg.src = user.imgUrl;
    const elUserbooms = document.querySelector('.user-booms');
    elUserbooms.innerText+= user.booms;
    const elUserCoins = document.querySelector('.user-coins');
    elUserCoins.innerText+= user.coins;
}