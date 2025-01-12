import {renderGamePage, clearGamePage} from './game-page.js';
import { clearStartPage } from './start-page.js';
import { DIGITS, ALPHAS } from './keypad.js';
import { renderStartPage } from './start-page.js';

let sequence = null;


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
    //console.log(checkedOption);
    if (!level) level = 'Easy';
    if (level !== checkedOption.value) level = checkedOption.value;
    //console.log(level);
    return level;
}



function startRound(level, round){

    const guessSequence = getSequence(level, round);   
    //const result = document.querySelector(".result-area");
    console.log(guessSequence);
    //output.textContent = guessSequence;

    showSequence(guessSequence);

}

function showSequence(guessSequence){
    guessSequence.forEach( (item) => {
        const selectedButton = document.getElementById(item);
        selectedButton.classList.add("red");
        //setTimeout(selectedButton.classList.remove("red"), 1000);        
    });
}

function getSequence(level, round){
    if (sequence !== null) {
        console.log(sequence);
        return sequence;
    }
    const symbolToGuess = level === 'Easy' ? 
      DIGITS : level === 'Medium' ? 
      ALPHAS : DIGITS+ALPHAS;
    console.log(symbolToGuess);
    sequence = Array(2 * round).fill(0).
      map( () => symbolToGuess[Math.floor(Math.random() * symbolToGuess.length)]);
    console.log(sequence);
    return sequence;
}

export function newGame(){
    let level = document.querySelector(".level-of-game").value;
    clearGamePage();
    renderStartPage(event, level);
}



export function getNewKey(level, value){
    let inputResult = document.querySelector(".result"); 
    if(!inputResult){
        inputResult = document.createElement("div");
        document.querySelector(".result-area").append(inputResult); 
        inputResult.className = "result";
        inputResult.textContent = value;
    } else {
        const temp = inputResult.textContent;
        inputResult.textContent = temp + value;
    }
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
