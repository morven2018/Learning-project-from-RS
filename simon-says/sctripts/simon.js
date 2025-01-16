import { renderStartPage } from "./start-page.js";
import {
  reRenderHeader,
  reRenderButtons,
  reRenderAnswer,
} from "./game-page.js";
import {
  DIGITS,
  ALPHAS,
  renderKeyPad,
  clearKeyPad,
  isEnable,
  enableKeys,
  disableKeys,
} from "./keypad.js";
import {
  startGame,
  getNewKey,
  getLevel,
  newGame,
  getSequence,
  showSequence,
  startRound,
  clearSequence,
  continueRound,
  getAttempt,
} from "./game-logic.js";

let level;

window.onload = renderStartPage;

const parentElement = document.querySelector("body");
//console.log(parentElement);

parentElement.addEventListener("change", (event) => {
  if (event.target.name === "level") {
    //console.log(event.target);
    clearKeyPad();
    renderKeyPad(event.target.value);
  }
});

parentElement.addEventListener("click", (event) => {
  if (event.target.className === "start-page__button") {
    startGame(getLevel(level));
  }

  if (event.target.className === "game-page-btn__new-game") {
    newGame();
  }

  if (event.target.className === "game-page-btn__repeat-sequence") {
    if (document.querySelector(".overlay"))
      document.querySelector(".overlay").remove();

    const btn = document.querySelector(".game-page-btn__repeat-sequence");
    btn.value = 0;
    showSequence(getSequence());
    continueRound();
    btn.classList.add("game-page-btn__repeat-sequence_disabled");

    reRenderAnswer();
  }

  if (event.target.className === "win-form__close-btn") {
    if (document.querySelector(".overlay"))
      document.querySelector(".overlay").remove();

    if (getAttempt()) continueRound();
  }

  if (event.target.className === "error-form__close-btn") {
    if (document.querySelector(".overlay"))
      document.querySelector(".overlay").remove();

    if (getAttempt() === 1) continueRound();

    reRenderAnswer();
  }

  if (event.target.className === "game-page-btn__next-round") {
    if (document.querySelector(".overlay"))
      document.querySelector(".overlay").remove();

    clearSequence();

    reRenderHeader(Number(event.target.value) + 1);
    reRenderButtons();
    reRenderAnswer();

    startRound(level, Number(event.target.value) + 1);
  }

  if (
    event.target.className === "num-pad-element" ||
    event.target.className === "keyboard-element"
  ) {
    const resultAnswer = document.querySelector(".answer-block__output");
    resultAnswer.value += event.target.value;
    getNewKey(level, event.target.value);
  }
});

document.addEventListener("keydown", (event) => {
  if (event.repeat) preventDefault();

  level = document.querySelector(".level-of-game").value;

  if (
    isCorrectKey(level, event.key.toUpperCase()) &&
    isEnable() &&
    !document.querySelector(".overlay")
  ) {
    document
      .getElementById(event.key.toUpperCase())
      .classList.add("keyboard-element_click");
    const resultAnswer = document.querySelector(".answer-block__output");
    resultAnswer.value += event.key.toUpperCase();
    setTimeout(() => {
      document
        .getElementById(event.key.toUpperCase())
        .classList.remove("keyboard-element_click");
      getNewKey(level, event.key.toUpperCase());
    }, 300);
  }
});

function isCorrectKey(level, key) {
  switch (level) {
    case "Easy":
      return DIGITS.includes(key);
    case "Medium":
      return ALPHAS.includes(key);
    case "Hard":
      return DIGITS.includes(key) || ALPHAS.includes(key);
  }
}
