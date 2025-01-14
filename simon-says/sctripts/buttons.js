export function renderRepeatSequenceButton(buttonsList, value = 1) {
  const repeatSequenceButton = document.createElement("button");
  repeatSequenceButton.className = "game-page-btn__repeat-sequence";
  repeatSequenceButton.value = value;
  if (value === "0")
    repeatSequenceButton.classList.add(
      "game-page-btn__repeat-sequence_disabled"
    );
  repeatSequenceButton.textContent = `Repeat\u00A0the sequence`;
  buttonsList.append(repeatSequenceButton);
}

export function renderNewGameButton(buttonsList) {
  const newGameButton = document.createElement("button");
  newGameButton.className = "game-page-btn__new-game";
  newGameButton.textContent = "New Game";
  buttonsList.append(newGameButton);
}

export function renderNextRoundButton(buttonsList, round) {
  const newGameButton = document.createElement("button");
  newGameButton.className = "game-page-btn__next-round";
  newGameButton.textContent = "Next";
  newGameButton.value = round;
  buttonsList.append(newGameButton);
}

export function disableButtons() {
  document
    .querySelector(".game-page-btn__new-game")
    .classList.add("game-page-btn__new-game__disable");
  document
    .querySelector(".game-page-btn__repeat-sequence")
    .classList.add("game-page-btn__repeat-sequence__inactive");
}

export function enableButtons() {
  document
    .querySelector(".game-page-btn__new-game")
    .classList.remove("game-page-btn__new-game__disable");
  document
    .querySelector(".game-page-btn__repeat-sequence")
    .classList.remove("game-page-btn__repeat-sequence__inactive");
}
