export const DIGITS = "0123456789";
export const ALPHAS = "QWERTYUIOPASDFGHJKLZXCVBNM";

export function renderKeyPad(level) {
  const keyPad = document.createElement("div");
  keyPad.className = "keypad";
  document.querySelector("body").append(keyPad);
  switch (level) {
    case "Easy":
      keyPad.classList.add("num-pad");
      renderNumPad(keyPad);
      break;
    case "Medium":
      keyPad.classList.add("keyboard");
      renderKeyboard(keyPad);
      break;
    case "Hard":
      keyPad.classList.add("full-pad");
      renderFullKeyboard(keyPad);
  }
}

function renderNumPad(keyPad) {
  DIGITS.split("").forEach((item) => {
    const key = document.createElement("button");
    key.textContent = item;
    key.setAttribute("id", item);
    key.setAttribute("value", item);
    key.classList.add("num-pad-element");
    //key.setAttribute("style", `grid-area: ${item}`);
    keyPad.append(key);
    disableKeys();
  });
}

function renderKeyboard(keyPad) {
  ALPHAS.split("").forEach((item) => {
    const key = document.createElement("button");
    key.textContent = item;
    key.setAttribute("id", item);
    key.setAttribute("value", item);
    key.classList.add("keyboard-element");
    //key.setAttribute("style", `grid-area: ${item}`);
    keyPad.append(key);
    disableKeys();
  });
}

function renderFullKeyboard(keyPad) {
  const numPad = document.createElement("div");
  keyPad.append(numPad);
  numPad.classList = "full-pad__nums";
  numPad.classList.add("num-pad");
  renderNumPad(numPad);

  const keyboard = document.createElement("div");
  keyPad.append(keyboard);
  keyboard.classList = "full-pad__keys";
  keyboard.classList.add("keyboard");
  renderKeyboard(keyboard);
}

export function clearKeyPad() {
  const keyPadElement = document.querySelector(".keypad");
  if (keyPadElement) keyPadElement.remove();
}


export function disableKeys(){
  Array.from(DIGITS).forEach(item =>{
    const elem = document.getElementById(item);
    if (elem) elem.classList.add("num-pad-element_disable");
  });
  Array.from(ALPHAS).forEach(item =>{
    const elem = document.getElementById(item);
    if (elem) elem.classList.add("keyboard-element_disable");
  });
}

export function enableKeys(){
  Array.from(DIGITS).forEach(item =>{
    const elem = document.getElementById(item);
    if (elem) {
      if (elem.classList.contains("num-pad-element_disable")) elem.classList.remove("num-pad-element_disable");
    }
  });
  Array.from(ALPHAS).forEach(item =>{
    const elem = document.getElementById(item);
    if (elem) {
      if (elem.classList.contains("keyboard-element_disable")) elem.classList.remove("keyboard-element_disable");
    }
  });
}


export function isEnable(){
  return !(document.querySelector(".keyboard-element_disable") || document.querySelector(".num-pad-element_disable"));
}
