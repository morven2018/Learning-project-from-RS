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
        //console.log(data[0]);
        cardGifts += `
<a class='item' id='${data[i].name}'>
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
generatedcards.insertAdjacentHTML('beforeend', addCards(dataGifts));


const tabs = document.querySelectorAll('.tab');
function hideTabContent() {
    for (let i = 0; i < tabs.length; i += 1) {
        tabs[i].classList.remove('active');
    }
}



const allTab = document.getElementById('all');
allTab.addEventListener('click', () => {
    generatedcards.innerHTML = '';
    hideTabContent();
    allTab.classList.add('active');
    generatedcards.insertAdjacentHTML('beforeend', addCards(dataGifts));
});


const allWork = document.getElementById('work');
allWork.addEventListener('click', () => {
    generatedcards.innerHTML = '';
    hideTabContent();
    allWork.classList.add('active');
    generatedcards.insertAdjacentHTML('beforeend', addCards(dataGifts.filter(item => item.category == 'For Work')));
});

const allHealth = document.getElementById('health');
allHealth.addEventListener('click', () => {
    generatedcards.innerHTML = '';
    hideTabContent();
    allHealth.classList.add('active');
    generatedcards.insertAdjacentHTML('beforeend', addCards(dataGifts.filter(item => item.category == 'For Health')));
});

const allHarmony = document.getElementById('harmony');
allHarmony.addEventListener('click', () => {
    generatedcards.innerHTML = '';
    hideTabContent();
    allHarmony.classList.add('active');
    generatedcards.insertAdjacentHTML('beforeend', addCards(dataGifts.filter(item => item.category == 'For Harmony')));
})


