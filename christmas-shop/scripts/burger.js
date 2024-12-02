const wrapperMenu = document.getElementById("menu");
wrapperMenu.addEventListener("click", function () {
    wrapperMenu.classList.toggle("open");
    const navMenu = document.getElementsById("drop-down-menu");
    navMenu.classList.toggle('open_nav');
    /*
        const mainSector = document.getElementsByTagName(main);
        navLinks.forEach(item => {
            item.addEventListener('click', () => {
                wrapperMenu.classList.toggle('open');
                navMenu.classList.remove('open_nav');
            })
        })*/
});
