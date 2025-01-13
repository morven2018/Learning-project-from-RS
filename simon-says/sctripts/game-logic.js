import {renderGamePage, clearGamePage} from './game-page.js';
import { clearStartPage } from './start-page.js';
import { DIGITS, ALPHAS } from './keypad.js';
import { renderStartPage } from './start-page.js';
import { renderErrorForm } from './error-form.js';

let sequence = null;
let copy;

export const getSequence = () => sequence;
export const getCopy = () => copy;


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
    //console.log(guessSequence);
    let copy = [...guessSequence];
    //console.log(copy);
    showSequence(copy);
}

function continueRound(level, round, guessSequence){

}

function generateSequence(level, round){
    const symbolToGuess = level === 'Easy' ? 
      DIGITS : level === 'Medium' ? 
      ALPHAS : DIGITS+ALPHAS;
    console.log(symbolToGuess);
    sequence = Array(2 * round).fill(0).
      map( () => symbolToGuess[Math.floor(Math.random() * symbolToGuess.length)]);
    //console.log(sequence);
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
    console.log(getSequence());
    renderErrorForm(level, 1);
    /*let inputResult = document.querySelector(".result"); 
    if(!inputResult){
        inputResult = document.createElement("div");
        document.querySelector(".result-area").append(inputResult); 
        inputResult.className = "result";
        inputResult.textContent = value;
    } else {
        const temp = inputResult.textContent;
        inputResult.textContent = temp + value;
    }*/
}

function isCorrectKey(level, key){
    switch(level){
        case 'Easy':
            return DIGITS.includes(key);
        case 'Medium':
            return ALPHAS.includes(key);
        case 'Hard':
            return DIGITS.includes(key) || ALPHAS.includes(key);
    }
}
