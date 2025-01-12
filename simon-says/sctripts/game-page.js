
export function renderGamePage(level, round){

    renderHeader(level, round); 
    //renderKeyPad(level);
    const buttonsList = document.createElement("div");
    buttonsList.className = "game-page-btn";
    document.querySelector('body').append(buttonsList);

    /*const resultArea = document.createElement("div");
    resultArea.className = "result-area";
    document.querySelector('body').append(resultArea);*/

    
    
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

    header.append(levelValue);
    header.append(roundValue);

}




function renderRepeatSequenceButton(buttonsList){
    const repeatSequenceButton = document.createElement("button");
    repeatSequenceButton.className = "game-page-btn__repeat-sequence";
    repeatSequenceButton.value = 1;
    repeatSequenceButton.textContent = "Repeat the sequence";
    buttonsList.append(repeatSequenceButton);
}

function renderNewGameButton(buttonsList){
    const newGameButton = document.createElement("button");
    newGameButton.className = "game-page-btn__new-game";
    newGameButton.textContent = "New Game";
    buttonsList.append(newGameButton);
}


export function clearGamePage(){
    const selectors = [".game-header", ".game-page-btn", "h1", ".keypad"];
    selectors.forEach ( (item) => {
        const elem =  document.querySelector(item);
        if (elem) elem.remove();
    });
}