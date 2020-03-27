'use strict';

(function () {
	var swiper = document.querySelectorAll('.swiper');

	function nextItem(element, list) {
		element.addEventListener('click', function (evt) {
			evt.preventDefault();
			for (var i = 0; i < list.length; i++) {
				if (list[i].classList.contains('swiper__item_active') && i !== list.length - 1) {
					list[i].classList.remove('swiper__item_active');
					i = i + 1;
					list[i].classList.add('swiper__item_active');
				}
			}
		});
	}

	function previousItem(element, list) {
		element.addEventListener('click', function (evt) {
			evt.preventDefault();
			for (var i = 0; i < list.length; i++) {
				if (list[i].classList.contains('swiper__item_active') && i !== 0) {
					list[i].classList.remove('swiper__item_active');
					i = i - 1;
					list[i].classList.add('swiper__item_active');
				}
			}
		});

	}

	for (var i = 0; i < swiper.length; i++) {
		var buttonLeft = swiper[i].querySelector('.button-to-left');
		var buttonRight = swiper[i].querySelector('.button-to-right');
		var elementList = swiper[i].querySelectorAll('.swiper__item');
		previousItem(buttonLeft, elementList);
		nextItem(buttonRight, elementList);
	}

})();