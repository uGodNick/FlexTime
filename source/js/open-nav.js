'use strict';
(function () {
    const navBar = document.querySelector('.main-nav__wrapper');
    const navButton = document.querySelector('.button_nav');

    navButton.addEventListener('click', function (evt) {
        evt.preventDefault();
        navBar.classList.toggle('hidden');
    });
})();
