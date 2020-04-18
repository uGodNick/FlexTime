(function () {

    window.renderCourses = function (courses, count) {
        const fragment = document.createDocumentFragment();
        const templateItem = document.querySelector('.courses-list__template')
            .content
            .querySelector(".courses-list__item");
        for (let i = 0; i < count; i++) {
            let courseElement = templateItem.cloneNode(true);
            courseElement.querySelector('.courses-list__name').textContent = courses[i].name;
            courseElement.querySelector('.courses-list__date').textContent = courses[i].date;
            courseElement.querySelector('a').href = courses[i].source;
            fragment.appendChild(courseElement);
        }

        return fragment;
    }

    
})();