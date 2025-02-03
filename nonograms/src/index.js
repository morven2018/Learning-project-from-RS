import "../styles/gameField.scss";
import { renderField } from "./field";
import { hasNoMistake, isReady } from "./logic";
import { renderStartPage, levelSize } from "./start-page";

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
      console.log(localStorage);
      templates = data;
      renderStartPage(templates);
      renderField(templates);
      console.log("3");
      console.log(templates);
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
