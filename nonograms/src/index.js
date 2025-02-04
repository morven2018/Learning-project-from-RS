import "../styles/gameField.scss";
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
      localStorage.setItem("results", JSON.stringify([]));
      //localStorage.savings = JSON.stringify([]);
      //localStorage.results = JSON.stringify([]);
      if (localStorage.level === undefined) {
      } else setLevel("Easy");
      renderStartPage(templates);
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
      console.log("You win!");
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
  }

  if (event.target.classList.contains("start-page-buttons__reset-game")) {
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

    offTimer = false;
    start = new Date();

    timerId = launchTimer(start);
  }

  if (event.target.classList[0] === "start-page-buttons__game-solution") {
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
    console.log(id);
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
    const id = document.querySelector(".game-area").value;
    const nTimer = new Date();
    saveSolution(templates[id - 1], nTimer - start);
    clearTimeout(timerId);
    changeBtn(event.target, id);
    pauseGame();
  }

  if (event.target.classList[0] === "start-page-buttons__continue-game") {
    const id = event.target.value;
    changeBtn(event.target, id);
    continueGame();
    const solutions = JSON.parse(localStorage.savings);
    let i = -1;
    solutions.forEach((elem, index) => {
      if (id == elem.id) i = index;
    });
    console.log(solutions[i], i);
    start = new Date() - solutions[i].timeOfSolution;
    timerId = launchTimer(start);

    renderSavedSolution(solutions[i].size, solutions[i].solution);

    /*const nTimer = new Date();
    saveSolution(templates[id - 1], nTimer - start);
    clearTimeout(timerId);
    offTimer = true;
    changeBtn(event.target, id);*/
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
