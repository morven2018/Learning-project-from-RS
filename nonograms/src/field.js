const templateField = ["00100", "11000", "11111", "00111", "10010"];
const startBody = document.querySelector("body");

function getValues(templateField, n) {
  const cellValues = Array(n).fill([]);
  for (let i = 0; i < n; i += 1) {
    cellValues[i] = Array.from(templateField[i].split(""));
  }
  return cellValues;
}

export function renderField(n) {
  const field = document.createElement("div");
  field.className = "field";
  startBody.append(field);

  const topAttempt = document.createElement("div");
  topAttempt.className = "field__attempt";
  field.append(topAttempt);

  const additionalField = document.createElement("div");
  field.append(additionalField);

  const leftAttempt = document.createElement("div");
  leftAttempt.className = "field__attempt";
  additionalField.append(leftAttempt);

  const gameField = document.createElement("div");
  gameField.className = "game-field";
  additionalField.append(gameField);

  const cellValues = getValues(templateField, n);
  console.log(1, cellValues);

  const topAttempts = generateAttempts(cellValues, n, true);
  const leftAttempts = generateAttempts(cellValues, n, false);

  renderTopAttempt(topAttempts, topAttempt);

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
    }
  }
}

function renderTopAttempt(topAttempts, field) {
  topAttempts.forEach((element) => {
    const attempt = document.createElement("div");
    attempt.className = "field__attempt__top-attempt";
    field.append(attempt);
    if (element)
      element.forEach((item) => {
        const cell = document.createElement("div");
        cell.className = "field__attempt__top-attempt__cell";
        cell.textContent = item;
        attempt.append(cell);
      });
  });
}
