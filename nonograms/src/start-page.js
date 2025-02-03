import { renderButton } from "./btns";

export const levelSize = {
  Easy: 5,
  Medium: 10,
  Hard: 15,
};

export function renderStartPage(templates) {
  const parentElement = document.querySelector("body");
  let keys = Object.keys(localStorage);
  let level = keys.includes("level") ? localStorage.getItem("level") : "Easy";

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
  cardName.append(cardPreview);

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

  console.log(elementInfo.id);

  renderButton(cardInfo, "start-page-buttons__continue-game", "Continue");
  if (!isInProcess(elementInfo.id))
    document
      .querySelector(".start-page-buttons__continue-game")
      .classList.add("start-page-buttons__continue-game_disable");
}

function renderRecords(parentElement) {
  const info = localStorage.getItem("nonograms");

  const recordHeader = document.createElement("h2");
  recordHeader.classList = "nonograms-list__records__header";
  parentElement.append(recordHeader);
  recordHeader.textContent = "Records:";

  if (info) {
    const games = JSON.parse(info);
    const lastFive = games.length > 5 ? games.slice(-5, -1) : games;
    lastFive.forEach((elem, index) => {
      const record = document.createElement("div");
      record.className = "nonograms-list__records__item";
      parentElement.append(record);

      const position = document.createElement("div");
      position.className = "records__item__position";
      parentElement.append(position);
      position.textContent = index;

      const recordInfo = document.createElement("div");
      recordInfo.className = "records__item__info";
      parentElement.append(recordInfo);

      const recordName = document.createElement("h3");
      recordName.className = "records__item__name";
      recordInfo.append(recordName);
      recordName.textContent = elem.name;

      const recordTime = document.createElement("h3");
      recordTime.className = "records__item__time";
      recordInfo.append(recordTime);
      recordTime.textContent = elem.time;

      const recordSize = document.createElement("h3");
      recordSize.className = "records__item__size";
      recordInfo.append(recordSize);
      recordSize.textContent = `${elem.size}x${elem.size}`;
    });
  } else {
    const noRecords = document.createElement("div");
    noRecords.className = "nonograms-list__records__none";
    parentElement.append(noRecords);

    noRecords.textContent = "There is no records at time.";
  }

  /*localStorage.user = JSON.stringify({ name: "John" });

  // немного позже
  let user = JSON.parse(localStorage.user);*/
}

function isDone(id) {
  return true;
}

function isInProcess(id) {
  return true;
}

function getTime(id) {
  return "00:00";
}

export function clearStartPage() {
  const mainField = document.querySelector(".main");
  if (mainField) mainField.remove();

  const btns = document.querySelector(".start-page-buttons");
  if (btns) btns.remove();
}
