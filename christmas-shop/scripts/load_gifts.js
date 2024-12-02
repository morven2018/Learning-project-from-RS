
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


let generatedcards = document.getElementById('giftsItemsAll');
generatedcards.insertAdjacentHTML('beforeend', addCards(dataGifts));

let generatedcardsWork = document.getElementById('giftsItemsWork');
generatedcardsWork.insertAdjacentHTML('beforeend', addCards(dataGifts.filter(item => item.category == 'For Work')));

let generatedcardsHealth = document.getElementById('giftsItemsHealth');
generatedcardsHealth.insertAdjacentHTML('beforeend', addCards(dataGifts.filter(item => item.category == 'For Health')));

let generatedcardsHarmony = document.getElementById('giftsItemsHarmony');
generatedcardsHarmony.insertAdjacentHTML('beforeend', addCards(dataGifts.filter(item => item.category == 'For Harmony')));

const tabs = document.querySelectorAll('.tabs__btn');
const tabsContent = document.querySelector('.cards');

if (tabsContent.length > 0 || tabs.length > 0) {
    function hideTabContent() {
        for (let i = 0; i < tabsContent.length; i += 1) {
            tabsContent[i].classList.remove('active');
        }

        tabs.forEach(item => {
            item.classList.remove('active');
        });
    }


    const allTabs = document.getElementById('tab-all');
    allTabs.addEventListener('click', () => {
        hideTabContent();
        const giftsItemsAll = getElementById('giftsItemsAll');
        giftsItemsAll.classList.add('active');
    });

    const allWork = document.getElementById('tab-work');
    allTabs.addEventListener('click', () => {
        hideTabContent();
        const giftsItemsWork = getElementById('giftsItemsWork');
        giftsItemsWork.classList.add('active');
    });

    const allHealth = document.getElementById('tab-health');
    allTabs.addEventListener('click', () => {
        hideTabContent();
        const giftsItemsHealth = getElementById('giftsItemsHealth');
        giftsItemsHealth.classList.add('active');
    });

    const allHarmony = document.getElementById('tab-harmony');
    allTabs.addEventListener('click', () => {
        hideTabContent();
        const giftsItemsHarmony = getElementById('giftsItemsHarmony');
        giftsItemsHarmony.classList.add('active');
    })


}

function allRandomCards(number = 4, dataGifts) {
    const resArray = [];
    if (dataGifts > number) {
        while (resArray.length < number) {
            let i = Math.floor(Math.random() * dataGifts.length);
            if (!resArray.includes(dataGifts[i])) {
                resArray.add(dataGifts[i])
            };
        }
    }
    return resArray;
}
