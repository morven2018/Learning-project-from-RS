import {renderGamePage, clearGamePage} from './game-page.js';
import { clearStartPage } from './start-page.js';
import { DIGITS, ALPHAS } from './keypad.js';
import { renderStartPage } from './start-page.js';
import { renderErrorForm } from './error-form.js';

let sequence = null;
let guessed = 0;
let attempt = 0;

export const getSequence = () => sequence;
export const getIndex = () => guessed;


export function startGame(level){    
    let currLevel = getLevel(level);
    document.querySelector('.start-page').classList.add("start-page_no-display");
    const hederGame = document.createElement('h1');
    hederGame.textContent = "Simon Says";
    document.body.prepend(hederGame);

    clearStartPage();
    renderGamePage(level, 1);
    startRound(level, 1);
}



export function getLevel(level){
    const checkedOption = document.querySelector('input:checked');
    if (!level) level = 'Easy';
    if (level !== checkedOption.value) level = checkedOption.value;
    return level;
}


function startRound(level, round){
    const guessSequence = generateSequence(level, round);   
    let copy = [...guessSequence];
    showSequence(copy);
    attempt = 1;
}

function continueRound(level, round, guessSequence){
    guessed = 0;
    attempt = 0;
}

function generateSequence(level, round){
    const symbolToGuess = level === 'Easy' ? 
      DIGITS : level === 'Medium' ? 
      ALPHAS : DIGITS+ALPHAS;
    console.log(symbolToGuess);
    sequence = Array(2 * round).fill(0).
      map( () => symbolToGuess[Math.floor(Math.random() * symbolToGuess.length)]);
    console.log(sequence);
    return sequence;
}



export function showSequence(guessSequence){
    guessSequence.push(-1);
    guessSequence.forEach((item, index) => {            
        setTimeout(() => {
            if (item !== -1) document.getElementById(item).classList.add("red"); 
            if (index != 0) document.getElementById(guessSequence[index - 1]).classList.remove("red");         
        }, 500*index);        
    });
    guessSequence.pop();
}

export function newGame(){
    let level = document.querySelector(".level-of-game").value;
    clearGamePage();
    renderStartPage(event, level);
}



export function getNewKey(level, value){
    if (value === sequence[guessed]) {
        guessed += 1;
        if (sequence.length === guessed){
            console.log(win);
            //обработчик перехода
        }
    } else{
        renderErrorForm(level, attempt);
        attempt = 0;
    } 
}


