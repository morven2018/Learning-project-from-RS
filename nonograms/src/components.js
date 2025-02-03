export function renderButton(
  parenElement,
  clsName,
  text,
  toChange = false,
  value = null
) {
  const btn = document.createElement("button");
  btn.className = clsName;
  btn.textContent = text;
  if (!toChange) parenElement.append(btn);
  else parenElement.prepend(btn);
  if (value) btn.value = value;
}

export function renderReturnButton(parentElement) {
  const btn = document.createElement("button");
  btn.className = "btn-return-to-start-page";
  btn.textContent = "<";
  btn.setAttribute("aria-label", "Return to chose the nonogram");
  btn.setAttribute("title", "Return to chose the nonogram");
  parentElement.append(btn);
}

export function launchTimer(start) {
  let timerId = setInterval(() => {
    const currTime = new Date();
    const timer = document.querySelector(".game-timer__value");
    let time = Math.floor((currTime - start) / 1000);
    timer.textContent = `${String(Math.floor(time / 60)).padStart(
      2,
      "0"
    )}:${String(time % 60).padStart(2, "0")}`;
  }, 1000);
}
