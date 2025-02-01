function createCard({name, link}) {
    const template = document.querySelector('#card-template').content;
    const cardElement = template.querySelector('.card').cloneNode(true);

    const cardImage = cardElement.querySelector('.card__image');
    cardImage.src = link;
    cardImage.alt = name;

    const cardTitle = cardElement.querySelector('.card__title');
    cardTitle.textContent = name;

    cardImage.addEventListener('click', () => {
        // Заполняем поп-ап данными о картинке
        popupImage.src = link;
        popupCaption.textContent = name;

        // Открываем поп-ап с картинкой
        openModal(imagePopup);
    });

    const deleteButton = cardElement.querySelector('.card__delete-button');
    deleteButton.addEventListener('click', () => {
        cardElement.remove();
    });

    const heartButton = cardElement.querySelector('.card__like-button');
    heartButton.addEventListener('click', () => {
        heartButton.classList.toggle('card__like-button_is-active');
    });

    return cardElement;
}