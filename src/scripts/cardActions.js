import {
    deleteCard,
    putCardLike,
    deleteCardLike
} from "./api.js";

import {openModal, closeModal, handleEscapeClose, handleOverlayClose} from "./modalActions.js";

function createCard(card, userId) {
    const {name, link, likes, _id, owner} = card;

    const template = document.querySelector('#card-template').content;

    const deleteCardPopup = document.querySelector('.popup_type_delete-card');
    const confirmButton = deleteCardPopup.querySelector('.popup__button');

    const cardElement = template.querySelector('.card').cloneNode(true);

    const cardTitle = cardElement.querySelector('.card__title');
    const cardImage = cardElement.querySelector('.card__image');
    const likeButton = cardElement.querySelector('.card__like-button');
    const likeCounter = cardElement.querySelector('.card__likes-count');
    const deleteButton = cardElement.querySelector('.card__delete-button');

    cardTitle.textContent = name;
    cardImage.src = link;
    cardImage.alt = name;

    updateCardLikes(likeButton, likeCounter, likes, userId);

    likeButton.addEventListener('click', () => {
        const isLiked = likeButton.classList.contains('card__like-button_is-active');
        const toggleLike = isLiked ? deleteCardLike(_id) : putCardLike(_id);

        toggleLike
            .then(updateCard => {
                updateCardLikes(likeButton, likeCounter, updateCard.likes, userId);
            })
            .catch(error => console.error('Put like error: ', error));
    })

    if (owner._id !== userId) {
        deleteButton.remove();
    } else {
        deleteButton.addEventListener('click', () => {
            openModal(deleteCardPopup);
            const newConfirmHandler = (evt) => {
                evt.preventDefault();

                const originalText = confirmButton.textContent;
                confirmButton.textContent = 'Удаление';
                confirmButton.disabled = true;

                let dotsInterval;
                let currentStep = 0;

                const updateButtonText = () => {
                    const dots = '.'.repeat(3 - (currentStep % 3));
                    confirmButton.textContent = `Удаление${dots}`;
                    currentStep++;
                };

                updateButtonText();

                dotsInterval = setInterval(updateButtonText, 200);

                deleteCard(_id)
                    .then(() => {
                        deleteButton.closest('.card').remove();
                        closeModal(deleteCardPopup);
                    })
                    .catch(error => console.error('Delete card error: ', error))
                    .finally(() => {
                        clearInterval(dotsInterval);
                        confirmButton.textContent = originalText;
                        confirmButton.disabled = false;
                    })
            }

            confirmButton.removeEventListener('click', confirmButton._handler);
            confirmButton.addEventListener('click', newConfirmHandler, {once: true});
            confirmButton._handler = newConfirmHandler;
        })
    }

    cardImage.addEventListener('click', () => {
        const imageContent = document.querySelector('.popup__image');
        const captionContent = document.querySelector('.popup__caption');
        const imagePopup = document.querySelector('.popup_type_image');
        imageContent.src = link;
        imageContent.alt = name;
        captionContent.textContent = name;

        openModal(imagePopup);

        // document.addEventListener('keydown', handleEscapeClose);
        // imagePopup.addEventListener('click', (evt) => handleOverlayClose(evt, imagePopup));
    })


    return cardElement;
}

function updateCardLikes(likeButton, likeCounter, likes, userId) {
    likeCounter.textContent = likes.length > 0 ? likes.length : '';
    if (likes.some(user => user._id === userId)) {
        likeButton.classList.add('card__like-button_is-active');
    } else {
        likeButton.classList.remove('card__like-button_is-active');
    }
}

export {createCard}