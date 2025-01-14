import { renderGamePage, clearGamePage } from "./game-page.js";
import { clearStartPage } from "./start-page.js";
import { DIGITS, ALPHAS, enableKeys, disableKeys } from "./keypad.js";
import { renderStartPage } from "./start-page.js";
import { renderErrorForm } from "./error-form.js";
import { renderWinRoundForm, renderFinalWinForm } from "./win-round.js";
import {
  renderNextRoundButton,
  disableButtons,
  enableButtons,
} from "./buttons.js";

let sequence = null;
let guessed = 0;
let attempt = 0;
const classesHighlight = [
  "keyboard-element_highlight1",
  "keyboard-element_highlight2",
];

export const getSequence = () => sequence;
export const getIndex = () => guessed;
export const getAttempt = () => attempt;

export function startGame(level) {
  let currLevel = getLevel(level);
  document.querySelector(".start-page").classList.add("start-page_no-display");

  clearStartPage();
  renderGamePage(level, 1);
  startRound(level, 1);
}

export function getLevel(level) {
  const checkedOption = document.querySelector("input:checked");
  if (!level) level = "Easy";
  if (level !== checkedOption.value) level = checkedOption.value;
  return level;
}

export function startRound(level, round) {
  const guessSequence = generateSequence(level, round);
  showSequence(guessSequence);
  attempt = 1;
}

export function continueRound() {
  guessed = 0;
  console.log(guessed);
}

function generateSequence(level, round) {
  if (!level) level = document.querySelector(".level-of-game").value;
  const symbolToGuess =
    level === "Easy" ? DIGITS : level === "Medium" ? ALPHAS : DIGITS + ALPHAS;
  sequence = Array(2 * round)
    .fill(0)
    .map(() => symbolToGuess[Math.floor(Math.random() * symbolToGuess.length)]);
  return sequence;
}

export function showSequence(guessSequence) {
  disableKeys();
  disableButtons();

  console.log(sequence);
  guessSequence.push(-1);

  guessSequence.forEach((item, index) => {
    setTimeout(() => {
      if (item !== -1)
        document
          .getElementById(item)
          .classList.add(classesHighlight[index % 2]);
      if (index != 0)
        document
          .getElementById(guessSequence[index - 1])
          .classList.remove(classesHighlight[(index - 1) % 2]);
    }, 600 * index);
  });

  guessSequence.pop();

  setTimeout(() => {
    enableKeys();
    enableButtons();
  }, 600 * generateSequence.length);
}

export function newGame() {
  let level = document.querySelector(".level-of-game").value;
  clearSequence();
  clearGamePage();
  renderStartPage(event, level);
}

export function clearSequence() {
  sequence = null;
  attempt = 1;
  guessed = 0;
}

export function getNewKey(level, value) {
  if (value === sequence[guessed]) {
    guessed += 1;

    const resultAnswer = document.querySelector(".answer-block__output");
    resultAnswer.value += value;

    if (sequence.length === guessed) {
      const round = document.querySelector(".round-of-game").value;
      document
        .querySelector(".game-page-btn__repeat-sequence")
        .classList.add("game-page-btn__repeat-sequence_disabled");

      if (round !== 5) {
        if (document.querySelector(".game-page-btn__new-game"))
          document.querySelector(".game-page-btn__new-game").remove();
        disableKeys();
        renderNextRoundButton(document.querySelector(".game-page-btn"), round);
        renderWinRoundForm(level, round);
      } else renderFinalWinForm(level);
    }
  } else {
    renderErrorForm(level, attempt);
    if (attempt === 0)
      document
        .querySelector(".game-page-btn__repeat-sequence")
        .classList.add("game-page-btn__repeat-sequence_disabled");
    attempt = 0;
    guessed = 0;
  }
}
