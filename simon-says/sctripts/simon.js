
const DIGITHS = '0123456789';
const ALPHAS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

function createStartPage(event, level = 'Easy'){

    const startSection = document.createElement('div');
    document.body.appendChild(startSection);
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
        option.setAttribute('name', item);
        option.setAttribute('value', item);
        if (level == item) option.setAttribute('checked', true);

        chooseLevel.append(optionLabel);
        chooseLevel.append(option);     

    });     

    startSection.append(startHeader);
    startSection.append(startButton);
    startSection.append(chooseLevel);


}


window.onload = createStartPage;


