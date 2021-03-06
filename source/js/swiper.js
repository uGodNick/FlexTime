'use strict';
(function () {
	const swiper = document.querySelectorAll('.swiper');

	function nextItem(element, list) {
		element.addEventListener('click', function (evt) {
			evt.preventDefault();
			for (let i = 0; i < list.length; i++) {
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
			for (let i = 0; i < list.length; i++) {
				if (list[i].classList.contains('swiper__item_active') && i !== 0) {
					list[i].classList.remove('swiper__item_active');
					i = i - 1;
					list[i].classList.add('swiper__item_active');
				}
			}
		});

	}

	for (let i = 0; i < swiper.length; i++) {
		let buttonLeft = swiper[i].querySelector('.button-to-left');
		let buttonRight = swiper[i].querySelector('.button-to-right');
		let elementList = swiper[i].querySelectorAll('.swiper__item');
		previousItem(buttonLeft, elementList);
		nextItem(buttonRight, elementList);
	}

})();
