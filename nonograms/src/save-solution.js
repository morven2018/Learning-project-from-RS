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
  };
}

//templates[id - 1], nTimer - start, nTimer);
