import { renderNewGameButton, renderRepeatSequenceButton } from "./buttons.js";

export function renderGamePage(level, round) {
  const gamePage = document.createElement("div");
  document.querySelector("body").prepend(gamePage);
  gamePage.className = "game-page";

  const buttonsList = document.createElement("div");
  buttonsList.className = "game-page-btn";
  gamePage.prepend(buttonsList)

  const hederGame = document.createElement("h1");
  hederGame.textContent = "Simon Says";
  gamePage.prepend(hederGame);
  hederGame.className = "game-page-header";

  const answer = document.createElement("div");
  gamePage.append(answer);
  answer.classList = "answer-block";
  answer.textContent = "Answer: ";

  const result = document.createElement("span");
  answer.append(result);
  result.className = "answer-block__output";

  renderHeader(level, round);
  renderRepeatSequenceButton(buttonsList);
  renderNewGameButton(buttonsList);
  
}

function renderAnswer(gamePage){
  const answer = document.createElement("div");
  gamePage.append(answer);
  answer.classList = "answer-block";
  answer.textContent = "Answer: ";

  const result = document.createElement("span");
  answer.append(result);
  result.className = "answer-block__output";

}

function renderHeader(level, round) {
  const header = document.createElement("header");
  document.querySelector(".game-page").prepend(header);
  header.classList.add("game-header");

  const levelValue = document.createElement("div");
  levelValue.classList.add("level-of-game");
  levelValue.value = level;
  levelValue.textContent = `Level: ${level}`;

  const roundValue = document.createElement("div");
  roundValue.classList.add("round-of-game");
  roundValue.textContent = `Round: ${round}`;
  roundValue.value = round;

  header.append(levelValue);
  header.append(roundValue);
}

export function reRenderHeader(round) {
  const roundValue = document.querySelector(".round-of-game");
  roundValue.textContent = `Round: ${round}`;
  roundValue.value = round;
}

export function reRenderAnswer(){
  if (document.querySelector(".answer-block")) document.querySelector(".answer-block").remove();
  renderAnswer(document.querySelector(".game-page"));
}

export function reRenderButtons() {
  if (document.querySelector(".game-page-btn"))
    document.querySelector(".game-page-btn").remove();
  const buttonsList = document.createElement("div");
  buttonsList.className = "game-page-btn";
  document.querySelector(".game-page").append(buttonsList);

  renderRepeatSequenceButton(buttonsList);
  renderNewGameButton(buttonsList);
}

export function clearGamePage() {
  const selectors = [
    ".game-header",
    ".game-page-btn",
    "h1",
    ".keypad",
    ".overlay",
    ".answer-block",
    ".game-page"
  ];
  selectors.forEach((item) => {
    const elem = document.querySelector(item);
    if (elem) elem.remove();
  });
}
