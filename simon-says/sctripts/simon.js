
const DIGITS = '0123456789';
const ALPHAS = 'QWERTYUIOP_ASDFGHJKL_ZXCVBNM';
//const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

let level;


function renderStartPage(event, level = 'Easy'){
    const startSection = document.createElement('div');
    document.querySelector('body').append(startSection);
    startSection.className = 'start-page';

    const startHeader = document.createElement('h1');
    startHeader.textContent = 'Simon says';
    startHeader.className = 'start-page__header';

    const startButton = document.createElement('button');
    startButton.textContent = 'Start';
    startButton.className = 'start-page__button';

    const chooseLevel = document.createElement('form');
    chooseLevel.className = 'choose-level-form';
    chooseLevel.setAttribute("id", "level");

    const headerLegend = document.createElement('legend');
    headerLegend.className = 'choose-level-form__legend';
    headerLegend.textContent = 'Please. Choose level of the game';
    chooseLevel.append(headerLegend);


    const inputValue = ['Easy', 'Medium', 'Hard'];

    inputValue.forEach((item) => {
        let optionLabel = document.createElement('label');
        optionLabel.setAttribute('for', item);
        optionLabel.textContent = item;

        let option = document.createElement('input');
        option.setAttribute('type', 'radio');
        option.setAttribute('id', item);
        option.setAttribute('name', 'level');
        option.setAttribute('value', item);
        if (item === level) option.setAttribute('checked', true);

        chooseLevel.append(option); 
        chooseLevel.append(optionLabel);
            

    });     
    startSection.append(startHeader);
    startSection.append(startButton);
    startSection.append(chooseLevel);
    
}


function clearStartPage(){
    const startPageRootElement = document.querySelector(".start-page");
    if (startPageRootElement) startPageRootElement.remove();
}


function getLevel(level){
    const checkedOption = document.querySelector('input:checked');
    console.log(checkedOption);
    if (!level) level = 'Easy';
    if (level !== checkedOption.value) level = checkedOption.value;
    console.log(level);
    return level;
}

function startGame(level){    
    let currLevel = getLevel(level);
    document.querySelector('.start-page').classList.add("start-page_no-display");
    const hederGame = document.createElement('h2');
    hederGame.textContent = level;
    document.body.append(hederGame);
    renderGamePage(level, 1);
}

function renderGamePage(level, round){


    renderHeader(level, round);

    clearStartPage();

    renderKeyPad(level);

    const resultArea = document.createElement("div");
    resultArea.className = "result-area";
    document.querySelector('body').append(resultArea);

    //
    //повторить последовательность

    //новая игра(level)
}

function renderHeader(level, round){
    const header = document.createElement('header');
    document.querySelector('body').append(header);
    header.classList.add("game-header");

    const levelValue = document.createElement("div");
    levelValue.classList.add('level-of-game');
    levelValue.value = level;
    levelValue.textContent = `Level: ${level}`;

    const roundValue = document.createElement("div");
    roundValue.classList.add('round-of-game');
    roundValue.textContent = `Round: ${round}`;

    header.append(levelValue);
    header.append(roundValue);

}


function renderKeyPad(level){
    const keyPad = document.createElement('div');
    document.querySelector('body').append(keyPad);
    switch(level){
        case 'Easy':
            keyPad.classList.add("num-pad");
            renderNumPad(keyPad);
            break;
        case 'Medium':
            keyPad.classList.add("keyboard");
            renderKeyboard(keyPad);
            break;
        case 'Hard':
            keyPad.classList.add("full-pad");
            renderFullKeyboard(keyPad);
    }
}

function renderNumPad(keyPad){
    DIGITS.split("").forEach( (item)  => {
        const key = document.createElement('button');
        key.textContent = item;
        key.setAttribute('id', item);
        key.setAttribute('value', item);
        key.classList.add("num-pad-element");
        keyPad.append(key);
    });
}

function renderKeyboard(keyPad){
    ALPHAS.split("").forEach( (item)  => {
        const key = document.createElement('button');
        key.textContent = item;
        key.setAttribute('id', item);
        key.setAttribute('value', item);
        key.classList.add("keyboard-element");
        keyPad.append(key);
    });
}

function renderFullKeyboard(keyPad){
    const keyboard = document.createElement('div');
    keyPad.append(keyboard);
    keyboard.classList = 'full-pad__keys';
    keyboard.classList.add("keyboard");
    renderKeyboard(keyboard);

    const numPad = document.createElement('div');
    keyPad.append(numPad);
    numPad.classList = 'full-pad__nums';
    numPad.classList.add("num-pad");
    renderNumPad(numPad);
}


function getNewKey(level, value){
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

/*function switchLevel(level){
    const options = document.querySelectorAll('input[type=radio]');
    options.forEach((radio) => {
        radio.addEventListener('change', () => {
            if (radio.checked){
                if (radio.value === level) radio.checked = false;
                else level = radio.value;
            }
        })
    });
    console.log(level);
    return level;
}*/

window.onload = renderStartPage;


const parentElement = document.querySelector('body');
console.log(parentElement);

parentElement.addEventListener('click', (event) => {
    if (event.target.className === 'start-page__button'){
        startGame(getLevel(level));
        console.log("start-page__button");
    }
    if (event.target.className === 'num-pad-element' || event.target.className === 'keyboard-element'){
        console.log(event.target.value);
        getNewKey(level, event.target.value);
    }
});


document.addEventListener('keyup', (event) => {
  level = document.querySelector('.level-of-game').value;
  if (isCorrectKey(level, event.key.toLocaleUpperCase())) getNewKey(level, event.key.toLocaleUpperCase());
});