export const templateField = ["10101", "11000", "01101", "00111", "10010"];
const startBody = document.querySelector("body");

export function getValues(templateField, n) {
  const cellValues = Array(n).fill([]);
  for (let i = 0; i < n; i += 1) {
    cellValues[i] = Array.from(templateField[i].split(""));
  }
  return cellValues;
}

export function renderField(n) {
  const cellValues = getValues(templateField, n);
  console.log(1, cellValues);
  const field = document.createElement("div");
  field.className = "field";
  startBody.append(field);

  const extraDiv = document.createElement("div");
  extraDiv.className = "field-extra";
  field.append(extraDiv);

  const topAttempt = document.createElement("div");
  topAttempt.className = "field__attempt";
  extraDiv.append(topAttempt);

  const additionalField = document.createElement("div");
  additionalField.className = "field__additional";
  field.append(additionalField);

  const leftAttempt = document.createElement("div");
  leftAttempt.className = "field__attempt";
  additionalField.append(leftAttempt);

  const gameField = document.createElement("div");
  gameField.className = "game-field";
  additionalField.append(gameField);

  const topAttempts = generateAttempts(cellValues, n, true);
  const leftAttempts = generateAttempts(cellValues, n, false);

  renderAttempt(topAttempts, topAttempt, true);
  renderAttempt(leftAttempts, leftAttempt, false);

  console.log(2, topAttempts);
  console.log(3, leftAttempts);

  renderCellsField(cellValues, n, gameField);
}

function generateAttempts(cellValues, n, top = true) {
  const attempts = Array(n);
  if (top) {
    for (let j = 0; j < n; j += 1) {
      let temp = [];
      let counter = 0;
      for (let i = 0; i < n; i += 1) {
        if (cellValues[i][j] === "1") {
          counter += 1;
          if (i + 1 === n) temp.push(counter);
        } else {
          if (counter > 0) temp.push(counter);
          counter = 0;
        }
      }
      attempts[j] = temp;
    }
  } else {
    for (let i = 0; i < n; i += 1) {
      let temp = [];
      let counter = 0;
      for (let j = 0; j < n; j += 1) {
        if (cellValues[i][j] === "1") {
          counter += 1;
          if (j + 1 === n) temp.push(counter);
        } else {
          if (counter > 0) temp.push(counter);
          counter = 0;
        }
      }
      attempts[i] = temp;
    }
  }
  return attempts;
}

function renderCellsField(cellValues, n, field) {
  for (let i = 0; i < n; i += 1) {
    for (let j = 0; j < n; j += 1) {
      const cell = document.createElement("div");
      /*const name =
        cellValues[i][j] === "1"
          ? "gameField__cell_black"
          : "gameField__cell_white";*/
      cell.classList.add("game-field__cell");
      cell.classList.add("game-field__cell_unknown");
      field.append(cell);

      if (i === n - 1 || i % 5 === 4)
        cell.setAttribute("style", "border-bottom: 2px solid black");
      if (j === n - 1 || i % 5 === 4) {
        cell.setAttribute("style", "border-right: 2px solid black");
        if (i === n - 1) {
          cell.setAttribute(
            "style",
            "border-bottom: 2px solid black;  border-right: 2px solid black"
          );
        }
      }
      if (j === 0) {
        cell.setAttribute("style", "border-left: 2px solid black");
        if (i === n - 1) {
          cell.setAttribute(
            "style",
            "border-bottom: 2px solid black;  border-right: 2px solid black; border-left: 2px solid black"
          );
        }
      }
      if (i === 0) {
        cell.setAttribute("style", "border-top: 2px solid black");
        if (j === 0)
          cell.setAttribute(
            "style",
            "border-top: 2px solid black; border-left: 2px solid black; "
          );
        if (j === n - 1)
          cell.setAttribute(
            "style",
            "border-top: 2px solid black; border-right: 2px solid black; "
          );
      }
    }
  }
}

function getSizeOfAttemptField(attempts) {
  let max = 0;
  attempts.forEach((item) => (max = max < item.length ? item.length : max));
  return max;
}

function renderAttempt(attempts, field, top = true) {
  const atmpName = top
    ? "field__attempt__top-attempt"
    : "field__attempt__left-attempt";

  const cellName = top
    ? "field__attempt__top-attempt__cell"
    : "field__attempt__left-attempt__cell";

  const size = getSizeOfAttemptField(attempts);

  const sizeToRender = top
    ? `height: ${size * 20 + (size - 1) * 10}px`
    : `width: ${size * 20 + (size - 1) * 10}px`;

  attempts.forEach((element, index) => {
    const attempt = document.createElement("div");
    attempt.className = atmpName;
    field.append(attempt);

    attempt.setAttribute("style", sizeToRender);
    if (index === 0 && top)
      attempt.setAttribute("style", "border-left: 2px solid black");
    if (index === 0 && !top)
      attempt.setAttribute("style", "border-top: 2px solid black");
    if ((index + 1 === attempts.length || index % 5 === 4) && !top)
      attempt.setAttribute(
        "style",
        " border-bottom: 2px solid black; height:21px"
      );
    if (top && (index + 1 === attempts.length || index % 5 === 4))
      attempt.setAttribute(
        "style",
        `border-right: 2px solid black; width:20px`
      );
    /*if (!top && index === 2) {
      attempt.setAttribute("style", `height:17px`);
    }*/

    if (!!element.length)
      element.forEach((item) => {
        const cell = document.createElement("div");
        cell.className = cellName;
        cell.textContent = item;
        attempt.append(cell);
      });
    else {
      //console.log("0");
      const cell = document.createElement("div");
      cell.className = cellName;
      cell.textContent = "0";
      attempt.append(cell);
    }
  });
}
