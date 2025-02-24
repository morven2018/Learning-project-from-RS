const response = await fetch('./materials/gifts.json');
export const dataGifts = await response.json();



const linkToWork = "./images/home/gift-for-work.png";
const linkToHealth = "./images/home/gift-for-health.png";
const linkToHarmony = "./images/home/gift-for-harmony.png";

export function getClass(category) {
    switch (category) {
        case "For Work":
            return 'work';
        case "For Health":
            return 'health';
        case "For Harmony":
            return 'harmony';
    }
}

export function getURL(category) {
    switch (category) {
        case "For Work":
            return linkToWork
        case "For Health":
            return linkToHealth
        case "For Harmony":
            return linkToHarmony
    }
}

export function addCards(data) {
    let cardGifts = '';
    for (let i = 0; i < data.length; i += 1) {
        console.log(data[0]);
        cardGifts += `
<a class='element' id='${data[i].name}'>
    <img src="${getURL(data[i].category)}" alt="picture of gift">
    <div class="card_info ${getClass(data[i].category)}">
        <h4>${data[i].category}</h4>
        <h3>${data[i].name}</h3>
    </div>
</a>`
    }
    return cardGifts;
}

let generatedcards = document.getElementById('cards_gifts');
let randIndex = () => Math.floor(Math.random() * dataGifts.length);


const indexes = new Set([randIndex(), randIndex(), randIndex(), randIndex(), randIndex(), randIndex()]);
const cardsElements = Array.from(indexes).slice(0, 4).map(index => dataGifts[index]);
generatedcards.insertAdjacentHTML('beforeend', addCards(cardsElements));

