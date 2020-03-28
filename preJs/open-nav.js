'use strict';
(function () {
    var navBar = document.querySelector('.main-nav__wrapper');
    var navButton = document.querySelector('.button_nav');

    navButton.addEventListener('click', function (evt) {
        evt.preventDefault();
        navBar.classList.toggle('hidden');
    });
})();