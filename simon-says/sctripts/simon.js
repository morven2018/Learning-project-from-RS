
const DIGITHS = '0123456789';
const ALPHAS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';


function createStartPage(event, level = 'Easy'){
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
    const hederGame = document.createElement('h2');
    hederGame.textContent = level;
    document.body.append(hederGame);
}


function switchLevel(level){
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
}

window.onload = createStartPage;
//document.addEventListener("DOMContentLoaded", (event) => createStartPage('Easy'));



//createStartPage('Easy');

const parentElement = document.querySelector('body');
console.log(parentElement);
parentElement.addEventListener('click', (event) => {
    if (event.target.className === 'start-page__button'){
        startGame(getLevel(level));
        console.log("start-page__button");
    }
})
//startButton.onclick = console.log('click');
//startButton.addEventListener('click', console.log('click'));




