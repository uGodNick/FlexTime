'use strict';
(function () {
  const addTitle = document.querySelector('.button__course-add_title');
  const addImage = document.querySelector('.button__course-add_image');
  const addText = document.querySelector('.button__course-add_text');
  const content = document.querySelector('.create__form__content');

  let countBlock = 1;

  addInput = function (type, id, clas) {
    const templateItem = document.querySelector('.content__block__input')
      .content
      .querySelector(".form__content__block");

    let contentBlock = templateItem.cloneNode(true);
    let contentClose = contentBlock.querySelector('.content__block__close')
    let contentInput = contentBlock.querySelector('input');

    contentInput.type = type;
    contentInput.name = 'block' + id;
    contentBlock.id = id

    contentInput.classList.add(clas);

    contentClose.addEventListener('click', function (evt) {
      evt.preventDefault();
      countBlock = Number(countBlock) - 1;
      let block = document.getElementById(id);

      block.remove();
    })

    countBlock = countBlock + 1
    content.append(contentBlock);
  }

  addArea = function (type, id, clas) {
    const templateItem = document.querySelector('.content__block__textarea')
      .content
      .querySelector(".form__content__block");

    let contentBlock = templateItem.cloneNode(true);
    let contentClose = contentBlock.querySelector('.content__block__close')
    let contentArea = contentBlock.querySelector('textarea');

    contentArea.type = type;
    contentArea.name = 'block' + id;
    contentBlock.id = id

    contentArea.classList.add(clas);

    contentClose.addEventListener('click', function (evt) {
      evt.preventDefault();
      countBlock = Number(countBlock) - 1;
      let block = document.getElementById(id);

      block.remove();
    })

    countBlock = countBlock + 1
    content.append(contentBlock);
  }

  addTitle.addEventListener('click', function (evt) {
    evt.preventDefault();
    addInput('text', countBlock, 'content__block__input_title')
  })

  addImage.addEventListener('click', function (evt) {
    evt.preventDefault();
    addInput('file', countBlock, 'ontent__block__input_image')
  })

  addText.addEventListener('click', function (evt) {
    evt.preventDefault();
    addArea('text', countBlock, 'content__block__input_text')
  })

})();
