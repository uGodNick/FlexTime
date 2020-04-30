'use strict'
(function () {
    const button = document.querySelector('.button__form-on');
    const profileInfo = document.querySelector('.profile__info');
    const profileForm = document.querySelector('.profile__form');
    const profileExit = document.querySelector('.profile__exit');
    
    if (document.documentElement.clientWidth < 1200) {
        profileExit.classList.remove('hidden');
        button.classList.remove('hidden');
    }

    window.hideElement = function (seek, hidden, event) {

        seek.addEventListener(event, function (evt) {
            evt.preventDefault();
            hidden.classList.add('hidden');
        });
    };

    window.showElement = function (seek, shower, event) {
        seek.addEventListener(event, function (evt) {
            evt.preventDefault();
            shower.classList.remove('hidden');
        });
    };

    hideElement(profileInfo, button, 'mouseleave');
    showElement(profileInfo, button, 'mousemove');
    hideElement(profileInfo, profileExit, 'mouseleave');
    showElement(profileInfo, profileExit, 'mousemove');
    showElement(button, profileForm, 'click');
    hideElement(button, profileInfo, 'click');
    
})();
