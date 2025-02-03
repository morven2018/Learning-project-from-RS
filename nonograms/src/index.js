import "../styles/gameField.scss";
import { renderField } from "./field";
import { hasNoMistake, isReady, setLevel } from "./logic";
import { renderStartPage, levelSize, clearStartPage } from "./start-page";
import { renderGamePage } from "./game-page";

let level = "Easy";
const parentElement = document.querySelector("body");
let templates;

window.onload = startGame;

function startGame(event, level = "Easy") {
  parentElement.classList.add("start-page");
  console.log("1");

  fetch("../dist/materials/data/nonogramm.json")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      templates = data;
      if (localStorage.level === undefined) console.log("wtf");
      else setLevel("Easy");
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
    if (event.target.classList.contains("game-field__cell_checked")) {
      clearClassCell(event.target);
      event.target.classList.add("game-field__cell_unknown");
    } else {
      clearClassCell(event.target);
      event.target.classList.add("game-field__cell_checked");
    }

    if (hasNoMistake(levelSize[level]) && isReady(levelSize[level]))
      console.log("You win!");
    else if (!hasNoMistake(levelSize[level])) console.log("Make error");
  }

  if (
    event.target.classList[0] === "start-page-buttons__another-try" ||
    event.target.classList[0] === "start-page-buttons__new-game"
  ) {
    console.log(
      templates,
      event.target.value,
      templates[event.target.value - 1]
    );
    setLevel();
    clearStartPage();
    renderGamePage(templates[event.target.value - 1]);
  }
});

parentElement.addEventListener("contextmenu", (event) => {
  if (event.target.classList[0] === "game-field__cell") {
    if (event.target.classList.contains("game-field__cell_crossed")) {
      clearClassCell(event.target);
      event.target.classList.add("game-field__cell_unknown");
    } else {
      clearClassCell(event.target);
      event.target.classList.add("game-field__cell_crossed");
    }

    if (!hasNoMistake(levelSize[level])) console.log("Make error cross");
    event.preventDefault();
  }
});

function clearClassCell(elem) {
  console.log("clear");
  const classes = [
    "game-field__cell_unknown",
    "game-field__cell_checked",
    "game-field__cell_crossed",
  ];
  classes.forEach((item) => {
    if (elem.classList.contains(item)) elem.classList.remove(item);
  });
}
