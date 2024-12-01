
document.addEventListener('DOMContentLoaded', () => {

    const dataJSON = require('../materials/gifts.json');



    let dataGifts = JSON.parse(dataJSON);
    const linkToWork = "./images/home/gift-for-work.png";
    const linkToHealth = "./images/home/gift-for-health.png";
    const linkToHarmony = "./images/home/gift-for-harmony.png";

    function getClass(category) {
        switch (category) {
            case "For Work":
                return 'work';
            case "For Health":
                return 'health';
            case "For Harmony":
                return 'harmony';
        }
    }

    function getURL(category) {
        switch (category) {
            case "For Work":
                return linkToWork
            case "For Health":
                return linkToHealth
            case "For Harmony":
                return linkToHarmony
        }
    }

    let cardGifts = '';
    let generatedcards = document.getElementById('giftsItems');
    for (let i = 0; i < dataGifts.length; i += 1) {
        cardGifts += `
    <a class='item'>
        <img src="${getURL(dataGifts[i].category)}" alt="picture of gift">
        <div class="card_info ${getClass(dataGifts[i].category)}">
            <h4>${dataGifts[i].category}</h4>
            <h3>${dataGifts[i].name}</h3>
        </div>
    </a>`
    }

    generatedcards.insertAdjacentHTML('beforeend', cardGifts);
});
