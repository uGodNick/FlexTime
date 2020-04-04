(function () {

    const coursesList = document.querySelector('.courses-list');
    let mokeMusic = [
        {
            name: 'Теория музыки 1',
            date: '20.02.20',
            source: '../index.html'
        },
        {
            name: 'Теория музыки 2',
            date: '20.02.20',
            source: '../index.html'
        },
        {
            name: 'Импровизация',
            date: '31.02.20',
            source: '../index.html'
        }];

    coursesList.appendChild(window.renderCourses(mokeMusic, 3));

})();

