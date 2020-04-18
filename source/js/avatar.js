'use strict';
(function () {
    const FILE_TYPES = ['jpg', 'png', 'jpeg'];
    const fileChooser = document.querySelector('.profile__form__chooser');
    const preview = document.querySelector('.profile__avatar');

    fileChooser.addEventListener('change', function () {
        let file = fileChooser.files[0];
        let fileName = file.name.toLowerCase();

        let matches = FILE_TYPES.some(function (it) {
            return fileName.endsWith(it);
        });

        if (matches) {
            let reader = new FileReader();

            reader.addEventListener('load', function () {
                preview.src = reader.result;
            });

            reader.readAsDataURL(file);
        }
    });
})();