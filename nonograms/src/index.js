import "../styles/gameField.scss";
import { renderField } from "./field";
import { hasNoMistake, isReady, setLevel } from "./logic";
import {
  renderStartPage,
  levelSize,
  clearStartPage,
  reRenderCards,
} from "./start-page";
import { renderGamePage, clearGamePage } from "./game-page";
import { launchTimer } from "./components";

let level = "Easy";
const parentElement = document.querySelector("body");
let templates;
let offTimer = true;
let start;

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
      if (localStorage.level === undefined) {
      } else setLevel("Easy");
      renderStartPage(templates);
      //renderGamePage(templates[2]);
      //templates.forEach((item) => renderField(item));
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
  if (event.target.classList[0] === "game-field__cell") {
    if (offTimer) {
      offTimer = false;
      start = new Date();
      launchTimer(start);
      const timer = document.createElement("div");
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
      console.log("You win!", `${start} ${nTimer} ${nTimer - start}`);
      audio_win.play();
      offTimer = true;
    } else if (
      !hasNoMistake(levelSize[localStorage.level], templates[id - 1])
    ) {
      console.log("Make error");
      //audio_mistake.play();
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
    renderStartPage(templates);
  }
});

parentElement.addEventListener("contextmenu", (event) => {
  if (event.target.classList[0] === "game-field__cell") {
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
      console.log("Make error cross");

    event.preventDefault();
  }
});

function clearClassCell(elem) {
  //console.log("clear");
  const classes = [
    "game-field__cell_unknown",
    "game-field__cell_checked",
    "game-field__cell_crossed",
  ];
  classes.forEach((item) => {
    if (elem.classList.contains(item)) elem.classList.remove(item);
  });
}
