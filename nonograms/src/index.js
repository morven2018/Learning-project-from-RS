import "../styles/gameField.scss";
import "../styles/components.scss";
import "../styles/light-mode.scss";
import "../styles/dark-mode.scss";

import {
  reRenderField,
  renderSolution,
  pauseGame,
  continueGame,
  renderSavedSolution,
} from "./field";
import { hasNoMistake, isReady, setLevel } from "./logic";
import {
  renderStartPage,
  levelSize,
  clearStartPage,
  reRenderCards,
} from "./start-page";
import { renderGamePage, clearGamePage } from "./game-page";
import { launchTimer, renderButton, winForm, changeBtn } from "./components";
import { saveResult, saveSolution } from "./save-solution";

let level = "Easy";
const parentElement = document.querySelector("body");
let templates;
let offTimer = true;
let start;
let timerId;

const audio_win = new Audio("../dist/materials/sounds/win.mp3");
const audio_blank = new Audio("../dist/materials/sounds/error.mp3");
const audio_checked = new Audio("../dist/materials/sounds/checked.mp3");
const audio_cross = new Audio("../dist/materials/sounds/blank.mp3");

window.onload = startGame;

function startGame() {
  parentElement.classList.add("start-page");
  //console.log("1");

  fetch("../dist/materials/data/nonogramm.json")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      templates = data;
      localStorage.setItem("savings", JSON.stringify([]));
      localStorage.setItem("result", JSON.stringify([]));
      //localStorage.savings = JSON.stringify([]);
      //localStorage.results = JSON.stringify([]);
      if (localStorage.level === undefined) {
      } else setLevel("Easy");
      renderStartPage(templates);
      if (localStorage.savings === "[]")
        document
          .querySelector(".start-page-buttons__continue-last-game")
          .classList.add("start-page-buttons__continue-last-game_inactive");
    });
}

/*let checked = false;

parentElement.addEventListener("mousedown", (event) => {
  //console.log(event.target.classList[0]);
  checked = true;
});

parentElement.addEventListener("mouseup", (event) => {
  //console.log(event.target.classList[0]);
  checked = false;
});

parentElement.addEventListener("mousemove", (event) => {
  if (checked && event.target.classList[0] === "gameField__cell") {
    event.target.classList.toggle("gameField__cell_unknown");
    event.target.classList.toggle("gameField__cell_checked");
  }
});
*/

parentElement.addEventListener("click", (event) => {
  if (
    event.target.classList[0] === "game-field__cell" &&
    !event.target.classList.contains("game-field__cell_inactive")
  ) {
    if (offTimer) {
      offTimer = false;
      start = new Date();
      timerId = launchTimer(start);
      const timer = document.querySelector(".game-timer");
      if (timer) timer.classList.remove("game-timer__inactive");
    }

    if (event.target.classList.contains("game-field__cell_checked")) {
      clearClassCell(event.target);
      event.target.classList.add("game-field__cell_unknown");
      audio_blank.play();
    } else {
      clearClassCell(event.target);
      event.target.classList.add("game-field__cell_checked");
      audio_checked.play();
    }

    const id = document.querySelector(".game-area").value;

    if (
      hasNoMistake(levelSize[localStorage.level], templates[id - 1]) &&
      isReady(levelSize[localStorage.level], templates[id - 1])
    ) {
      const nTimer = new Date();
      //console.log("You win!");
      saveResult(templates[id - 1], nTimer - start, nTimer);
      winForm(nTimer - start);
      audio_win.play();
      clearTimeout(timerId);
      offTimer = true;
    } else if (
      !hasNoMistake(levelSize[localStorage.level], templates[id - 1])
    ) {
      console.log("You make a mistake");
    }
  }

  if (
    event.target.classList[0] === "start-page-buttons__another-try" ||
    event.target.classList[0] === "start-page-buttons__new-game"
  ) {
    setLevel(localStorage.level);
    clearStartPage();
    renderGamePage(templates[event.target.value - 1]);
    offTimer = true;
  }

  if (event.target.classList.contains("start-page-buttons__reset-game")) {
    const save = document.querySelector(
      ".start-page-buttons__save-game__inactive"
    );
    if (save) save.classList.remove("start-page-buttons__save-game__inactive");

    const save2 = document.querySelector(
      ".start-page-buttons__game-solution__inactive"
    );
    if (save2)
      save2.classList.remove("start-page-buttons__game-solution__inactive");

    const ids = event.target.value;
    //changeBtn(event.target, ids);

    const activateButton = document.querySelector(
      ".start-page-buttons__game-solution"
    );
    if (
      activateButton.classList.contains(
        "start-page-buttons__game-solution_inactive"
      )
    )
      activateButton.classList.remove(
        "start-page-buttons__game-solution_inactive"
      );

    const id = document.querySelector(".game-area").value;

    const form = document.querySelector(".overlay");
    if (form) form.remove();
    else clearTimeout(timerId);

    reRenderField(templates[id - 1]);

    offTimer = true;
    const timer = document.querySelector(".game-timer__value");
    timer.textContent = "00:00";
    //start = new Date();

    //timerId = launchTimer(start);
  }

  if (event.target.classList[0] === "start-page-buttons__game-solution") {
    document
      .querySelector(".start-page-buttons__save-game")
      .classList.add("start-page-buttons__save-game__inactive");
    const id = document.querySelector(".game-area").value;
    clearTimeout(timerId);
    renderSolution(templates[id - 1]);
    offTimer = true;
  }

  if (event.target.classList[0] === "nonograms-list__tabs__easy") {
    const elem = document.querySelector(".nonograms-list__tabs__easy");
    elem.classList.add("nonograms-list__tabs__active");
    const lastElem = document.querySelector(
      `.nonograms-list__tabs__${localStorage.level.toLowerCase()}`
    );
    lastElem.classList.remove("nonograms-list__tabs__active");
    localStorage.level = elem.value;
    reRenderCards(localStorage.level, templates);
  }

  if (event.target.classList[0] === "nonograms-list__tabs__medium") {
    const elem = document.querySelector(".nonograms-list__tabs__medium");
    elem.classList.add("nonograms-list__tabs__active");
    const lastElem = document.querySelector(
      `.nonograms-list__tabs__${localStorage.level.toLowerCase()}`
    );
    lastElem.classList.remove("nonograms-list__tabs__active");
    localStorage.level = elem.value;
    reRenderCards(localStorage.level, templates);
  }

  if (event.target.classList[0] === "nonograms-list__tabs__hard") {
    const elem = document.querySelector(".nonograms-list__tabs__hard");
    elem.classList.add("nonograms-list__tabs__active");
    const lastElem = document.querySelector(
      `.nonograms-list__tabs__${localStorage.level.toLowerCase()}`
    );
    lastElem.classList.remove("nonograms-list__tabs__active");
    localStorage.level = elem.value;
    reRenderCards(localStorage.level, templates);
  }

  if (event.target.classList[0] === "btn-return-to-start-page") {
    clearGamePage();
    clearTimeout(timerId);
    renderStartPage(templates);
  }

  if (event.target.classList[0] === "start-page-buttons__random-game") {
    const maxIndex = templates.length;
    const id = Math.floor(Math.random() * maxIndex);
    //console.log(id);
    let l =
      templates[id].size === 5
        ? "Easy"
        : templates[id].size === 10
        ? "Medium"
        : "Hard";
    setLevel(l);
    clearStartPage();
    renderGamePage(templates[id]);
  }

  if (event.target.classList[0] === "start-page-buttons__save-game") {
    document
      .querySelector(".start-page-buttons__game-solution")
      .classList.add("start-page-buttons__game-solution__inactive");

    const h = document.querySelector(
      ".start-page-buttons__continue-last-game_inactive"
    );
    if (h)
      h.classList.remove("start-page-buttons__continue-last-game_inactive");

    const id = document.querySelector(".game-area").value;
    const nTimer = new Date();
    saveSolution(templates[id - 1], nTimer - start);
    clearTimeout(timerId);
    changeBtn(event.target, id);
    pauseGame();
  }

  if (event.target.classList[0] === "start-page-buttons__continue-game") {
    const save = document.querySelector(
      ".start-page-buttons__game-solution__inactive"
    );
    if (save)
      save.classList.remove("start-page-buttons__game-solution__inactive");

    const id = event.target.value;
    changeBtn(event.target, id);
    continueGame();
    const solutions = JSON.parse(localStorage.savings);
    let i = -1;
    solutions.forEach((elem, index) => {
      if (id == elem.id) i = index;
    });
    //console.log(solutions[i], i);
    start = new Date() - solutions[i].timeOfSolution;
    timerId = launchTimer(start);

    renderSavedSolution(solutions[i].size, solutions[i].solution);

    /*const nTimer = new Date();
    saveSolution(templates[id - 1], nTimer - start);
    clearTimeout(timerId);
    offTimer = true;
    changeBtn(event.target, id);*/
  }
  if (event.target.classList[0] === "start-page-buttons__continue-last-game") {
    const solutions = JSON.parse(localStorage.savings);

    clearStartPage();
    renderGamePage(templates[solutions[localStorage.index].id - 1]);
    const id = solutions[localStorage.index].id;
    //changeBtn(event.target, id);
    continueGame();

    start = new Date() - solutions[localStorage.index].timeOfSolution;

    timerId = launchTimer(start);

    renderSavedSolution(
      solutions[localStorage.index].size,
      solutions[localStorage.index].solution
    );
  }

  if (event.target.classList[0] === "light-mode-btn") {
    const soundOn = document.querySelector(".sound-mode-on-light-btn");
    if (soundOn) {
      soundOn.classList.remove("sound-mode-on-light-btn");
      soundOn.classList.add("sound-mode-on-dark-btn");
    }

    const soundOff = document.querySelector(".sound-mode-off-light-btn");
    if (soundOff) {
      soundOff.classList.remove("sound-mode-off-light-btn");
      soundOff.classList.add("sound-mode-off-dark-btn");
    }

    const parentElem = document.querySelector(".light-mode");
    if (parentElem) {
      parentElem.classList.remove("light-mode");
      parentElem.classList.add("dark-mode");
    }
    const elem = document.querySelector(".light-mode-btn");
    if (elem) {
      elem.classList.remove("light-mode-btn");
      elem.classList.add("dark-mode-btn");
    }
    localStorage.mode = "dark";
  } else if (event.target.classList.contains("dark-mode-btn")) {
    const soundOn = document.querySelector(".sound-mode-on-dark-btn");
    if (soundOn) {
      soundOn.classList.remove("sound-mode-on-dark-btn");
      soundOn.classList.add("sound-mode-on-light-btn");
    }

    const soundOff = document.querySelector(".sound-mode-off-dark-btn");
    if (soundOff) {
      soundOff.classList.remove("sound-mode-off-dark-btn");
      soundOff.classList.add("sound-mode-off-light-btn");
    }

    const parentElem = document.querySelector(".dark-mode");
    if (parentElem) {
      parentElem.classList.remove("dark-mode");
      parentElem.classList.add("light-mode");
    }

    const elem = document.querySelector(".dark-mode-btn");
    if (elem) {
      elem.classList.remove("dark-mode-btn");
      elem.classList.add("light-mode-btn");
    }
    localStorage.mode = "light";
  }
});

parentElement.addEventListener("contextmenu", (event) => {
  if (
    event.target.classList[0] === "game-field__cell" &&
    !event.target.classList.contains("game-field__cell_inactive")
  ) {
    if (offTimer) {
      offTimer = false;
      start = new Date();
    }

    if (event.target.classList.contains("game-field__cell_crossed")) {
      clearClassCell(event.target);
      event.target.classList.add("game-field__cell_unknown");
      audio_blank.play();
    } else {
      clearClassCell(event.target);
      event.target.classList.add("game-field__cell_crossed");
      audio_cross.play();
    }

    const id = document.querySelector(".game-area").value;
    if (!hasNoMistake(levelSize[localStorage.level], templates[id - 1]))
      console.log("You make a mistake");

    event.preventDefault();
  }
});

function clearClassCell(elem) {
  const classes = [
    "game-field__cell_unknown",
    "game-field__cell_checked",
    "game-field__cell_crossed",
  ];
  classes.forEach((item) => {
    if (elem.classList.contains(item)) elem.classList.remove(item);
  });
}
