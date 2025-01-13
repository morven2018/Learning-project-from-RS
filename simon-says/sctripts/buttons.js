export function renderRepeatSequenceButton(buttonsList, value = 1){
    const repeatSequenceButton = document.createElement("button");
    repeatSequenceButton.className = "game-page-btn__repeat-sequence";
    repeatSequenceButton.value = value;
    if (value === "0") repeatSequenceButton.classList.add("game-page-btn__repeat-sequence_disabled"); 
    repeatSequenceButton.textContent = "Repeat the sequence";
    buttonsList.append(repeatSequenceButton);
}

export function renderNewGameButton(buttonsList){
    const newGameButton = document.createElement("button");
    newGameButton.className = "game-page-btn__new-game";
    newGameButton.textContent = "New Game";
    buttonsList.append(newGameButton);
}
