const wrapperMenu = document.getElementById("menu");
wrapperMenu.addEventListener("click", function () {
    wrapperMenu.classList.toggle("open");
    const navMenu = document.querySelector(".menu");
    navMenu.classList.toggle('open_nav');
    navMenu.style.width = document.documentElement.clientWidth;
    const navLinks = Array.from(document.querySelector('.nav-link'));
    navLinks.forEach(item => {
        item.addEventListener('click', () => {
            wrapperMenu.classList.toggle('open');
            navMenu.classList.remove('open_nav');
        })
    })
});
