import { renderButton } from "./components";

export const levelSize = {
  Easy: 5,
  Medium: 10,
  Hard: 15,
};

export function renderStartPage(templates) {
  const parentElement = document.querySelector("body");
  let keys = Object.keys(localStorage);
  let level = keys.includes("level") ? localStorage.getItem("level") : "Easy";

  const ctrlBth = document.createElement("div");
  parentElement.append(ctrlBth);
  ctrlBth.classList.add("control-buttons-list");

  let ldMode = localStorage.mode ? localStorage.mode : "light";

  parentElement.classList.add(`${ldMode}-mode`);

  const modeElem = document.createElement("div");
  modeElem.classList.add(`${ldMode}-mode-btn`);
  ctrlBth.append(modeElem);

  let sounds = localStorage.sound ? localStorage.sound : "on";

  const soundMode = document.createElement("div");
  soundMode.className = `sound-mode-${sounds}-${ldMode}-btn`;
  ctrlBth.append(soundMode);

  const header = document.createElement("h1");
  header.className = "game-header";
  header.textContent = "Nonograms";
  parentElement.append(header);

  const btns = document.createElement("div");
  btns.className = "start-page-buttons";
  parentElement.append(btns);

  renderButton(btns, "start-page-buttons__random-game", "Random game");
  renderButton(
    btns,
    "start-page-buttons__continue-last-game",
    "Continue last game"
  );

  const mainField = document.createElement("main");
  mainField.classList = "main";
  parentElement.append(mainField);

  const nonogramsList = document.createElement("div");
  nonogramsList.classList = "nonograms-list";
  mainField.append(nonogramsList);

  const tabList = document.createElement("div");
  tabList.className = "nonograms-list__tabs";
  nonogramsList.append(tabList);

  renderTabs(tabList);

  const cards = document.createElement("div");
  cards.className = "nonograms-list__cards";
  nonogramsList.append(cards);

  templates
    .filter((item) => item.size === levelSize[level])
    .forEach((elem) => renderCard(cards, elem));

  const records = document.createElement("div");
  records.className = "nonograms-list__records";
  mainField.append(records);

  renderRecords(records);

  if (!localStorage.last)
    document
      .querySelector(".start-page-buttons__continue-last-game")
      .classList.add("start-page-buttons__continue-last-game__inactive");
}

function renderTabs(parentElement, level = "Easy") {
  Object.keys(levelSize).forEach((key) => {
    const tab = document.createElement("div");
    tab.textContent = `${key} (${levelSize[key]}x${levelSize[key]})`;
    let str = `nonograms-list__tabs__${key.toLowerCase()}`;
    tab.classList.add(str);
    tab.value = key;
    parentElement.append(tab);
    if (level === key) {
      tab.classList.add("nonograms-list__tabs__active");
    }
  });
}

export function reRenderCards(level, templates) {
  //console.log(level);
  const cards = document.querySelector(".nonograms-list__cards");
  cards.innerHTML = "";
  templates
    .filter((item) => item.size === levelSize[level])
    .forEach((elem) => renderCard(cards, elem));
}

function renderCard(parentElement, elementInfo) {
  const card = document.createElement("div");
  card.className = "card";
  parentElement.append(card);

  if (isDone(elementInfo.id)) card.classList.add("card_done");
  else if (isInProcess(elementInfo.id)) card.classList.add("card_in-process");
  else card.classList.add("card_undone");

  parentElement.append(card);

  const cardName = document.createElement("h3");
  cardName.className = "card__header";
  cardName.textContent = elementInfo.name;
  card.append(cardName);

  const cardContent = document.createElement("div");
  cardContent.className = "cards__content";
  card.append(cardContent);

  const cardPreview = document.createElement("div");
  cardPreview.className = "card__preview";
  cardContent.append(cardPreview);

  const cardInfo = document.createElement("div");
  cardInfo.className = "card__info";
  cardContent.append(cardInfo);

  const cardTime = document.createElement("p");
  cardTime.classList = "card__timer";
  let t = isDone(elementInfo.id)
    ? getTime(elementInfo.id)
    : "This nonogram has not been solved yet.";
  cardTime.textContent = `Time: ${t}`;
  cardInfo.append(cardTime);

  if (isDone(elementInfo.id))
    renderButton(
      cardInfo,
      "start-page-buttons__another-try",
      "Play again?",
      false,
      elementInfo.id
    );
  else
    renderButton(
      cardInfo,
      "start-page-buttons__new-game",
      "Play",
      false,
      elementInfo.id
    );

  renderButton(cardInfo, "start-page-buttons__continue-game", "Continue");
  document
    .querySelector(".start-page-buttons__continue-game")
    .classList.add("start-page-buttons__continue-game_list");

  if (!isInProcess(elementInfo.id) || localStorage.savings === "[]")
    document
      .querySelector(".start-page-buttons__continue-game")
      .classList.add("start-page-buttons__continue-game_inactive");
}

function renderRecords(parentElement) {
  const info = localStorage.getItem("nonograms");

  const recordHeader = document.createElement("h2");
  recordHeader.classList = "nonograms-list__records__header";
  parentElement.append(recordHeader);
  recordHeader.textContent = "Records:";

  if (localStorage.result !== "[]") {
    ///const games = JSON.parse(info);
    const lastFive = getRating();
    lastFive.forEach((elem, index) => {
      const record = document.createElement("div");
      record.className = "nonograms-list__records__item";
      parentElement.append(record);

      const position = document.createElement("div");
      position.className = "records__item__position";
      record.append(position);
      position.textContent = index + 1;

      const recordInfo = document.createElement("div");
      recordInfo.className = "records__item__info";
      record.append(recordInfo);

      const recordName = document.createElement("h3");
      recordName.className = "records__item__name";
      recordInfo.append(recordName);
      recordName.textContent = elem.name;

      const recordTime = document.createElement("p");
      recordTime.className = "records__item__time";
      recordInfo.append(recordTime);

      let timeElem = Math.floor(elem.timeOfSolution / 1000);
      recordTime.textContent = `${String(Math.floor(timeElem / 60)).padStart(
        2,
        "0"
      )}:${String(timeElem % 60).padStart(2, "0")}`;

      const recordSize = document.createElement("p");
      recordSize.className = "records__item__size";
      recordInfo.append(recordSize);
      recordSize.textContent = `${
        elem.size === 5 ? "Easy" : elem.size === 10 ? "Medium" : "Hard"
      } (${elem.size}x${elem.size})`;
    });
  } else {
    const noRecords = document.createElement("div");
    noRecords.className = "nonograms-list__records__none";
    //noRecords.textContent = "No nonogram has been solved yet";
    parentElement.append(noRecords);

    noRecords.textContent = "There is no records at time.";
  }

  /*localStorage.user = JSON.stringify({ name: "John" });

  // немного позже
  let user = JSON.parse(localStorage.user);*/
}

function isDone(id) {
  if (localStorage.result === "[]") return false;
  const solutions = JSON.parse(localStorage.result);
  return solutions.some((item) => item.idTemp === id);
}

function isInProcess(id) {
  if (localStorage.savings === "[]") return false;
  const res = JSON.parse(localStorage.savings);
  return res.some((item) => item.id === id);
}

function getTime(id) {
  const solutions = JSON.parse(localStorage.result);
  console.log(solutions);
  let time = null;
  solutions.forEach((elem) => {
    console.log(elem);
    if (elem.idTemp === id && (time === null || elem.timeOfSolution < time))
      time = elem.timeOfSolution;
  });
  time = Math.floor(time / 1000);
  return `${String(Math.floor(time / 60)).padStart(2, "0")}:${String(
    time % 60
  ).padStart(2, "0")}`;
}

function getRating() {
  const solutions = JSON.parse(localStorage.result);
  const res = solutions.length > 5 ? solutions.splice(-5) : solutions;
  return res.sort((a, b) => a.timeOfSolution - b.timeOfSolution);
}

export function clearStartPage() {
  const mainField = document.querySelector(".main");
  if (mainField) mainField.remove();

  const btns = document.querySelector(".start-page-buttons");
  if (btns) btns.remove();
}
