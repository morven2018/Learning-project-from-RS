const wrapperMenu = document.getElementById("menu");
const navMenu = document.querySelector("#list-menu");
const body = document.querySelector('main');
const body2 = document.querySelector('footer');
const body3 = document.querySelector('#sec1');

if (body) {
    wrapperMenu.addEventListener("click", function () {
        wrapperMenu.classList.toggle("open");
        navMenu.classList.toggle('open_nav');
        navMenu.style.width = document.documentElement.clientWidth;
        body.classList.toggle('hidden');
        body2.classList.toggle('hidden');
    });

    const navLink1 = document.getElementById('nav-link1');
    navLink1.addEventListener('click', () => {
        wrapperMenu.classList.remove("open");
        navMenu.classList.remove('open_nav');
        body.classList.remove('hidden');
        body2.classList.toggle('hidden');
    })

    const navLink2 = document.getElementById('nav-link2');
    navLink2.addEventListener('click', () => {
        wrapperMenu.classList.remove("open");
        navMenu.classList.remove('open_nav');
        body.classList.remove('hidden');
        body2.classList.toggle('hidden');
    })

    const navLink3 = document.getElementById('nav-link3');
    navLink3.addEventListener('click', () => {
        wrapperMenu.classList.remove("open");
        navMenu.classList.remove('open_nav');
        body.classList.remove('hidden');
        body2.classList.toggle('hidden');
    })

    const navLink4 = document.getElementById('nav-link4');
    navLink4.addEventListener('click', () => {
        wrapperMenu.classList.remove("open");
        navMenu.classList.remove('open_nav');
        body.classList.remove('hidden');
        body2.classList.toggle('hidden');
    })


    window.addEventListener('resize', (event) => {
        if (document.body.clientWidth > 768) {
            wrapperMenu.classList.remove("open");
            navMenu.classList.remove('open_nav');
            body.classList.remove('hidden');
            body2.classList.toggle('hidden');
        }
    });
} else {
    wrapperMenu.addEventListener("click", function () {
        wrapperMenu.classList.toggle("open");
        navMenu.classList.toggle('open_nav');
        navMenu.style.width = document.documentElement.clientWidth;
        body2.classList.toggle('hidden');
        body3.classList.toggle('hidden');

    });

    const navLink1 = document.getElementById('nav-link1');
    navLink1.addEventListener('click', () => {
        wrapperMenu.classList.remove("open");
        navMenu.classList.remove('open_nav');
        body2.classList.toggle('hidden');
        body3.classList.remove('hidden');
    })

    const navLink2 = document.getElementById('nav-link2');
    navLink2.addEventListener('click', () => {
        wrapperMenu.classList.remove("open");
        navMenu.classList.remove('open_nav');
        body2.classList.toggle('hidden');
        body3.classList.remove('hidden');
    })

    const navLink3 = document.getElementById('nav-link3');
    navLink3.addEventListener('click', () => {
        wrapperMenu.classList.remove("open");
        navMenu.classList.remove('open_nav');
        body2.classList.toggle('hidden');
        body3.classList.remove('hidden');
    })

    const navLink4 = document.getElementById('nav-link4');
    navLink4.addEventListener('click', () => {
        wrapperMenu.classList.remove("open");
        navMenu.classList.remove('open_nav');
        body2.classList.toggle('hidden');
        body3.classList.remove('hidden');
    })


    window.addEventListener('resize', (event) => {
        if (document.body.clientWidth > 768) {
            wrapperMenu.classList.remove("open");
            navMenu.classList.remove('open_nav');
            body2.classList.toggle('hidden');
            body3.classList.remove('hidden');
        }
    });
}

