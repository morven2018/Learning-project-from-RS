import "../styles/gameField.scss";
import { renderField } from "./field";

const levelSize = {
  Easy: 5,
  Medium: 10,
  Hard: 15,
};

const parentElement = document.querySelector("body");

window.onload = renderStartPage;

function renderStartPage(event, level = "Easy") {
  parentElement.classList.add("start-page");
  //console.log(startBody.classList);
  renderField(levelSize[level]);
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
    clearClassCell(event.target);
    event.target.classList.toggle("game-field__cell_checked");
  }
});

parentElement.addEventListener("contextmenu", (event) => {
  if (event.target.classList[0] === "game-field__cell") {
    clearClassCell(event.target);
    event.target.classList.toggle("game-field__cell_crossed");
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
