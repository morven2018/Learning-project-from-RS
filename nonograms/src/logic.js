import { getValues } from "./field";

export function hasNoMistake(n, templateField) {
  const solution = getSolution(n);
  //console.log("mst", templateField);
  const templateSolution = getValues(templateField.template, n);
  return solution.every((item, index) =>
    item.every(
      (elem, iter) => elem === "-1" || elem === templateSolution[index][iter]
    )
  );
}

export function isReady(n, templateField) {
  const solution = getSolution(n);
  console.log(solution);
  //console.log("read");
  const templateSolution = getValues(templateField.template, n);
  return solution.every((item, index) =>
    item.every(
      (elem, iter) =>
        (elem === "-1" && templateSolution[index][iter]) === "0" ||
        elem === templateSolution[index][iter]
    )
  );
}

export function getSolution(n) {
  const fieldSolution = document.querySelectorAll(".game-field__cell");
  const solution = Array(n);
  for (let i = 0; i < n; i += 1) {
    solution[i] = [];
    for (let j = 0; j < n; j += 1) {
      if (
        fieldSolution[i * n + j].classList.contains("game-field__cell_checked")
      )
        solution[i].push("1");
      if (
        fieldSolution[i * n + j].classList.contains("game-field__cell_crossed")
      )
        solution[i].push("0");
      if (
        fieldSolution[i * n + j].classList.contains("game-field__cell_unknown")
      )
        solution[i].push("-1");
    }
  }
  //console.log(solution);
  return solution;
}

export function setLevel(value = null) {
  if (value) localStorage.setItem("level", value);
  else {
    const tab = document.querySelector(".nonograms-list__tabs__active");
    localStorage.setItem("level", tab.value);
  }
}
