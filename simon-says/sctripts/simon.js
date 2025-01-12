import { renderStartPage} from './start-page.js';

import {DIGITS, ALPHAS, renderKeyPad, clearKeyPad} from './keypad.js';
import { startGame, getNewKey, getLevel, newGame } from './game-logic.js';

let level;

window.onload = renderStartPage;


const parentElement = document.querySelector('body');
console.log(parentElement);

parentElement.addEventListener('click', (event) => {
    if (event.target.className === 'start-page__button'){
        startGame(getLevel(level));
        //console.log("start-page__button");
    }
    if (event.target.className === 'num-pad-element' || event.target.className === 'keyboard-element'){
        console.log(event.target.value);
        getNewKey(level, event.target.value);
    }
    if (event.target.className === 'game-page-btn__new-game'){
        newGame();
        //console.log("start-page__button");
    }
});

parentElement.addEventListener('change', (event) => {
    if (event.target.name === 'level'){
        console.log(event.target);
        clearKeyPad();
        renderKeyPad(event.target.value);
    }
})

document.addEventListener('keyup', (event) => {
  level = document.querySelector('.level-of-game').value;
  if (isCorrectKey(level, event.key.toLocaleUpperCase())) getNewKey(level, event.key.toLocaleUpperCase());
});