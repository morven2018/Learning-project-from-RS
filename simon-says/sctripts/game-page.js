import { renderNewGameButton, renderRepeatSequenceButton } from "./buttons.js";


export function renderGamePage(level, round){

    renderHeader(level, round); 
    //renderKeyPad(level);
    const buttonsList = document.createElement("div");
    buttonsList.className = "game-page-btn";
    document.querySelector('body').append(buttonsList);
    
    
    renderRepeatSequenceButton(buttonsList);
    renderNewGameButton(buttonsList);
}


function renderHeader(level, round){
    const header = document.createElement('header');
    document.querySelector('body').prepend(header);
    header.classList.add("game-header");

    const levelValue = document.createElement("div");
    levelValue.classList.add('level-of-game');
    levelValue.value = level;
    levelValue.textContent = `Level: ${level}`;

    const roundValue = document.createElement("div");
    roundValue.classList.add('round-of-game');
    roundValue.textContent = `Round: ${round}`;
    roundValue.value = round;

    header.append(levelValue);
    header.append(roundValue);

}

export function reRenderHeader(round){
    const roundValue = document.querySelector('.round-of-game');
    roundValue.textContent = `Round: ${round}`;
    roundValue.value = round;
}

export function clearGamePage(){
    const selectors = [".game-header", ".game-page-btn", "h1", ".keypad", ".overlay"];
    selectors.forEach ( (item) => {
        const elem =  document.querySelector(item);
        if (elem) elem.remove();
    });
}