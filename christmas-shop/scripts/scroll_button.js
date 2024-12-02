const scrollButton = document.querySelector('.to-top');

window.onscroll = function () {
    scrollTopBtn();
};

function scrollTopBtn() {
    if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
        scrollButton.classList.remove('hide');
    } else {
        scrollButton.classList.add('hide');
    }
}

scrollButton.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth',
    });
    scrollButton.classList.add('hide');
})



