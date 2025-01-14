import { renderNewGameButton, renderRepeatSequenceButton } from "./buttons.js";

export function renderErrorForm(level, attempt = 1) {
  const overlay = document.createElement("div");
  document.querySelector("body").append(overlay);
  overlay.className = "overlay";

  const errorForm = document.createElement("div");
  overlay.append(errorForm);
  errorForm.className = "error-form";

  const outCross = document.createElement("div");
  outCross.className = "error-form__close-btn";
  outCross.textContent = "X";
  errorForm.append(outCross);

  if (attempt) renderNextTryForm(errorForm);
  else renderFailForm(level, errorForm);
}

function renderNextTryForm(errorForm) {
  const messageBlock = document.createElement("div");

  errorForm.append(messageBlock);
  messageBlock.textContent =
    "You have made 1 mistake. You can try again to complete the round 1 more time.";
  messageBlock.className = "error-form__msg";

  //+1 attempt?
  const buttonBlock = document.createElement("div");

  errorForm.append(buttonBlock);
  buttonBlock.className = "error-form__buttons";

  const seq = document.querySelector(".game-page-btn__repeat-sequence").value;
  document.querySelector(".game-page-btn__repeat-sequence").value = 0;
  console.log(seq);
  renderRepeatSequenceButton(buttonBlock, seq);

  renderNewGameButton(buttonBlock);
}

function renderFailForm(level, errorForm) {
  const messageBlock = document.createElement("div");

  errorForm.append(messageBlock);
  messageBlock.textContent =
    "You have made 2 mistakes. Will you start a new game?";
  messageBlock.className = "error-form__msg";

  const buttonBlock = document.createElement("div");

  errorForm.append(buttonBlock);
  buttonBlock.className = "error-form__buttons";
  //renderRepeatSequenceButton(buttonBlock, 0);
  renderNewGameButton(buttonBlock);
}
