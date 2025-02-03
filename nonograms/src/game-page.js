import { renderButton } from "./btns";
import { renderField } from "./field";

export function renderGamePage(template) {
  const parentElement = document.querySelector("body");

  const header = document.createElement("h1");
  header.className = "game-header";
  header.textContent = "Nonograms";
  parentElement.append(header);

  const headerOFGame = document.createElement("h1");
  headerOFGame.className = "game-header__name";
  headerOFGame.textContent = template.name;
  parentElement.append(headerOFGame);

  const gameArea = document.createElement("div");
  gameArea.className = "game-area";
  parentElement.append(gameArea);

  renderField(template, gameArea);

  const info = document.createElement("div");
  info.className = "game-header__data";
  gameArea.append(info);

  const timer = document.createElement("div");
  timer.className = "game-timer";
  timer.classList.add("game-timer__inactive");
  let t = "00:00:00";
  timer.textContent = `Timer: ${t}`;
  info.append(timer);

  const btns = document.createElement("div");
  btns.className = "bth-list";
  info.append(btns);

  renderButton(btns, "start-page-buttons__save-game", "Save game");

  renderButton(btns, "start-page-buttons__reset-game", "Reset");

  renderButton(btns, "start-page-buttons__game-solution", "Solution");
}
