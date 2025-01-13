
import {renderKeyPad, DIGITS, ALPHAS} from './keypad.js';

export function renderStartPage(event, level = 'Easy'){
    document.querySelector('body').className = "game-area";

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
    renderKeyPad(level);
    
}


export function clearStartPage(){
    const startPageRootElement = document.querySelector(".start-page");
    if (startPageRootElement) startPageRootElement.remove();
}