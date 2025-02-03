export function renderButton(parenElement, clsName, text, toChange = null) {
  const btn = document.createElement("button");
  btn.className = clsName;
  btn.textContent = text;
  if (toChange === null) parenElement.append(btn);
}
