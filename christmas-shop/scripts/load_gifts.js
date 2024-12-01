
const response = await fetch('./materials/gifts.json');
const dataGifts = await response.json();




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

function addCards(data) {
    let cardGifts = '';
    for (let i = 0; i < data.length; i += 1) {
        console.log(data[0]);
        cardGifts += `
<a class='item'>
    <img src="${getURL(data[i].category)}" alt="picture of gift">
    <div class="card_info ${getClass(data[i].category)}">
        <h4>${data[i].category}</h4>
        <h3>${data[i].name}</h3>
    </div>
</a>`
    }
    return cardGifts;
}


let generatedcards = document.getElementById('giftsItems');

generatedcards.insertAdjacentHTML('beforeend', addCards(dataGifts));



