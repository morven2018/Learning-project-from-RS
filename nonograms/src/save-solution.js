import { getSolution } from "./logic";

export function saveResult(temp, timeResult, time) {
  let stored = localStorage.result ? JSON.parse(localStorage.result) : [];

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
    idTemp: temp.id,
  };
}

//templates[id - 1], nTimer - start, nTimer);

export function saveSolution(temp, timeResult) {
  let stored = localStorage.savings ? JSON.parse(localStorage.savings) : [];
  let exist = -1;

  stored.forEach((elem, index) => {
    if (elem.id === temp.id) exist = index;
  });

  const res = prepareJSONResultSaving(temp, timeResult);
  if (exist === -1) {
    stored.push(res);
    localStorage.index = stored.length - 1;
  } else {
    stored[exist] = res;
    localStorage.index = exist;
  }
  localStorage.savings = JSON.stringify(stored);
  //localStorage.last = temp.id;

  //console.log(localStorage.savings);
}

function prepareJSONResultSaving(temp, timeResult) {
  const solution = getSolution(temp.size);
  return {
    id: temp.id,
    timeOfSolution: timeResult,
    size: temp.size,
    name: temp.name,
    solution: solution,
  };
}
