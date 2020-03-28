(function () {
    var button = document.querySelector('.button__form-on');
    var profileInfo = document.querySelector('.profile__info');
    var profileForm = document.querySelector('.profile__form');

    if (document.documentElement.clientWidth < 1200) {
        button.classList.remove('hidden')
    }

    window.hideElement = function (seek, hidden, event) {
        seek.addEventListener(event, function (evt) {
            evt.preventDefault();
            hidden.classList.add('hidden');
        })
    }
    window.showElement = function (seek, shower, event) {
        seek.addEventListener(event, function (evt) {
            evt.preventDefault();
            shower.classList.remove('hidden');
        })

    }
    hideElement(profileInfo, button, 'mouseleave');
    showElement(profileInfo, button, 'mousemove');
    showElement(button, profileForm, 'click');
    hideElement(button, profileInfo, 'click');
    
})();