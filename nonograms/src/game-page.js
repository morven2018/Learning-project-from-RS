import { renderButton, renderReturnButton } from "./components";
import { renderField } from "./field";

export function renderGamePage(template) {
  const parentElement = document.querySelector("body");

  const header = document.createElement("div");
  header.className = "header-of-game";
  parentElement.append(header);

  renderReturnButton(header);

  const headerOFGame = document.createElement("h2");
  headerOFGame.className = "game-header__name";
  headerOFGame.textContent = template.name;
  header.append(headerOFGame);

  const gameArea = document.createElement("div");
  gameArea.className = "game-area";
  gameArea.value = template.id;
  parentElement.append(gameArea);

  renderField(template, gameArea);

  const info = document.createElement("div");
  info.className = "game-header__data";
  gameArea.append(info);

  const timer = document.createElement("div");
  timer.className = "game-timer";
  timer.classList.add("game-timer__inactive");
  timer.textContent = `Timer:`;
  info.append(timer);

  const passTime = document.createElement("span");
  passTime.className = "game-timer__value";
  timer.append(passTime);

  const btns = document.createElement("div");
  btns.className = "bth-list";
  info.append(btns);

  renderButton(btns, "start-page-buttons__save-game", "Save game");

  renderButton(btns, "start-page-buttons__reset-game", "Reset");

  renderButton(btns, "start-page-buttons__game-solution", "Solution");
}

export function clearGamePage() {
  const header = document.querySelector(".header-of-game");
  if (header) header.remove();

  const area = document.querySelector(".game-area");
  if (area) area.remove();

  const h = document.querySelector(".game-header");
  if (h) h.remove();

  const form = document.querySelector(".overlay");
  if (form) form.remove();
}
