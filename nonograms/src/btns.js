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
  parentElement.append(btn);
}
