import {
    deleteCard,
    putCardLike,
    deleteCardLike
} from "./api.js";

import {openModal, closeModal} from "./modalActions.js";

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

    cardImage.src = link;
    cardImage.alt = name;
    cardTitle.textContent = name;

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
        closeModal(deleteCardPopup);
    } else {
        deleteButton.addEventListener('click', () => {
            openModal(deleteCardPopup);
            const newConfirmHandler = (evt) => {
                evt.preventDefault();

                const originalText = confirmButton.textContent;
                confirmButton.textContent = 'Deleting...';
                confirmButton.disabled = true;

                deleteCard(_id)
                    .then(() => {
                        deleteButton.closest('.card').remove();
                    })
                    .catch(error => console.error('Delete card error: ', error))
                    .finally(() => {
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

        imageContent.src = link;
        imageContent.alt = name;
        captionContent.textContent = name;

        openModal(document.querySelector('.popup_type_image'));
    })

    return cardElement;
}

function updateCardLikes(likeBTN, likeCount, likes, userId) {
    likeCount.textContent = likes.length > 0 ? likes.length : '';
    if (likes.some(user => user._id === userId)) {
        likeBTN.classList.add('card__like-button_is-active');
    } else {
        likeBTN.classList.remove('card__like-button_is-active');
    }
}

export {createCard}