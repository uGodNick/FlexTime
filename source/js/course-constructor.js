'use strict';
(function () {
  const addTitle = document.querySelector('.button__course-add_title');
  const addImage = document.querySelector('.button__course-add_image');
  const addText = document.querySelector('.button__course-add_text');
  const content = document.querySelector('.create__form__content');
  const contentCount = document.querySelector('.create__form__content__count');

  let contentArr = []
  let countBlock = 1;

  const addContent = function () {
    
    contentCount.value = contentArr.join('-')
  }

  const addInput = function (type, id, clas) {
    const templateItem = document.querySelector('.content__block__input')
      .content
      .querySelector(".form__content__block");

    let contentBlock = templateItem.cloneNode(true);
    let contentClose = contentBlock.querySelector('.content__block__close')
    let contentInput = contentBlock.querySelector('input');

    contentInput.type = type;
    contentInput.name = id;
    contentBlock.id = id

    contentInput.classList.add(clas);

    contentClose.addEventListener('click', function (evt) {
      evt.preventDefault();
      countBlock = Number(countBlock) - 1;
      contentArr.pop()
      let block = document.getElementById(id);
      addContent()
      block.remove();
    })

    countBlock = countBlock + 1
    content.append(contentBlock);
  }

  const addArea = function (id, clas) {
    const templateItem = document.querySelector('.content__block__textarea')
      .content
      .querySelector(".form__content__block");

    let contentBlock = templateItem.cloneNode(true);
    let contentClose = contentBlock.querySelector('.content__block__close')
    let contentArea = contentBlock.querySelector('textarea');

    contentArea.name = id;
    contentBlock.id = id

    contentArea.classList.add(clas);

    contentClose.addEventListener('click', function (evt) {
      evt.preventDefault();
      countBlock = Number(countBlock) - 1;
      contentArr.pop()
      let block = document.getElementById(id);
      addContent()
      block.remove();
    })

    countBlock = countBlock + 1
    content.append(contentBlock);
  }

  addTitle.addEventListener('click', function (evt) {
    evt.preventDefault();
    let identificator = countBlock + 't'
    contentArr.push(identificator)
    addInput('text', identificator, 'content__block__input_title');
    
    addContent()
  })

  addImage.addEventListener('click', function (evt) {
    evt.preventDefault();
    let identificator =  countBlock + 'i'
    contentArr.push(identificator)
    addInput('file', identificator, 'content__block__input_image')
    
    addContent()
  })

  addText.addEventListener('click', function (evt) {
    evt.preventDefault();
    let identificator = countBlock + 'p'
    contentArr.push(identificator)
    addArea(identificator, 'content__block__input_text')
    
    addContent()
  })

})();
