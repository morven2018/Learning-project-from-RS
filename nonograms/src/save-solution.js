import { getSolution } from "./logic";

export function saveResult(temp, timeResult, time) {
  let stored = localStorage.results ? JSON.parse(localStorage.results) : [];

  const res = prepareJSONResult(timeResult, temp, time, stored.length);
  stored.push(res);
  localStorage.result = JSON.stringify(stored);
}

function prepareJSONResult(timeResult, temp, time, id) {
  return {
    id: id,
    date: time,
    timeOfSolution: timeResult,
    template: temp.template,
    size: temp.size,
    name: temp.name,
  };
}

//templates[id - 1], nTimer - start, nTimer);

export function saveResult(temp, timeResult, time) {
  let stored = localStorage.savings ? JSON.parse(localStorage.savings) : [];

  const res = prepareJSONResultSaving(timeResult, temp, time, stored.length);
  stored.push(res);
  localStorage.result = JSON.stringify(stored);
}

function prepareJSONResultSaving(timeResult, temp, time, id) {
  const solution = getSolution(template.size);
  return {
    id: id,
    date: time,
    timeOfSolution: timeResult,
    template: temp.template,
    size: temp.size,
    name: temp.name,
    solution: solution,
  };
}
