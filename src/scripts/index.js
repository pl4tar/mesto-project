import {
    getInitialCards,
    getUser,
    postCard,
    patchUser,
    patchUserAvatar,
} from "./api.js";

import {openModal, closeModal, setCloseEventListeners} from "./modalActions.js";
import {createCard} from "./cardActions.js";
import {enableValidation, resetForm, resetInputFrom} from "./validation.js";
import {validationSettings} from "./configuration.js";

import '../pages/index.css';

const placesList = document.querySelector('.places__list');
let userId;

const profilePopup = document.querySelector('.popup_type_edit');
const cardPopup = document.querySelector('.popup_type_new-card');
const avatarPopup = document.querySelector('.popup_type_avatar');


const popups = document.querySelectorAll('.popup');

const profileEditButton = document.querySelector('.profile__edit-button');
const cardAddButton = document.querySelector('.profile__add-button');
const editAvatarButton = document.querySelector('.profile__avatar-edit');
const closeButtons = document.querySelectorAll('.popup__close');

const profileTitle = document.querySelector('.profile__title');
const profileImage = document.querySelector('.profile__image');
const profileDescription = document.querySelector('.profile__description');

const profileForm = profilePopup.querySelector('.popup__form');
const profileNameInput = profileForm.querySelector('.popup__input_type_name');
const profileDescriptionInput = profileForm.querySelector('.popup__input_type_description');

const cardFormElement = cardPopup.querySelector('.popup__form');
const newCardName = cardPopup.querySelector('.popup__input_type_card-name');
const newCardLink = cardPopup.querySelector('.popup__input_type_url');

const avatarFormElement = avatarPopup.querySelector('.popup__form');
const avatarInput = avatarPopup.querySelector('.popup__input_type_url');


popups.forEach(popup => {
    popup.classList.add('popup_is-animated');
});

setCloseEventListeners(closeButtons)

function loadUser() {
    getUser()
        .then(({name, about, avatar, _id}) => {
            profileTitle.textContent = name;
            profileDescription.textContent = about;
            profileImage.src = avatar;
            userId = _id;
        })
        .catch(err => console.error("Ошибка загрузки данных пользователя:", err));
}

function renderInitialCards() {
    getInitialCards()
        .then(cards => {
            cards.forEach(card => {
                const cardElement = createCard(card, userId);
                placesList.append(cardElement);
            });
        })
        .catch(err => console.error("Ошибка загрузки карточек:", err));
}

function handleProfileFormSubmit(evt) {
    evt.preventDefault();
    const username = profileNameInput.value;
    const description = profileDescriptionInput.value;

    const submitButton = evt.target.querySelector('button');

    submitButton.textContent = "Сохранение";
    submitButton.disabled = true;

    let dotsInterval;
    let currentStep = 0;

    const updateButtonText = () => {
        const dots = '.'.repeat(3 - (currentStep % 3));
        submitButton.textContent = `Сохранение${dots}`;
        currentStep++;
    };

    updateButtonText();

    dotsInterval = setInterval(updateButtonText, 200);

    patchUser({username, description})
        .then(({name, about}) => {
            profileTitle.textContent = name;
            profileDescription.textContent = about;
            closeModal(profilePopup);
            // resetForm(profileForm)
        })
        .catch(err => console.error("Ошибка обновления профиля:", err))
        .finally(() => {
            clearInterval(dotsInterval);
            submitButton.textContent = "Сохранить";
            submitButton.disabled = false;
        });
}

function handleCardFormSubmit(evt) {
    evt.preventDefault();
    const name = newCardName.value;
    const link = newCardLink.value;
    const submitButton = evt.target.querySelector('button');

    submitButton.textContent = "Сохранение";
    submitButton.disabled = true;

    let dotsInterval;
    let currentStep = 0;

    const updateButtonText = () => {
        const dots = '.'.repeat(3 - (currentStep % 3));
        submitButton.textContent = `Сохранение${dots}`;
        currentStep++;
    };

    updateButtonText();

    dotsInterval = setInterval(updateButtonText, 200);

    postCard({name, link})
        .then(card => {
            const cardElement = createCard(card, userId);
            placesList.prepend(cardElement);
            closeModal(cardPopup);
            resetForm(cardFormElement)
        })
        .catch(err => console.error("Ошибка добавления карточки:", err))
        .finally(() => {
            clearInterval(dotsInterval);
            submitButton.textContent = "Сохранить";
            submitButton.disabled = false;
        });
}

function handleAvatarFormSubmit(evt) {
    evt.preventDefault();
    const avatar = avatarInput.value;
    const submitButton = evt.target.querySelector('button');


    submitButton.textContent = "Сохранение";
    submitButton.disabled = true;

    let dotsInterval;
    let currentStep = 0;

    const updateButtonText = () => {
        const dots = '.'.repeat(3 - (currentStep % 3));
        submitButton.textContent = `Сохранение${dots}`;
        currentStep++;
    };

    updateButtonText();

    dotsInterval = setInterval(updateButtonText, 200);

    patchUserAvatar({avatar})
        .then(({avatar}) => {
            profileImage.src = avatar;
            closeModal(avatarPopup);
            resetForm(avatarFormElement)

            // avatarFormElement.reset();
            // avatarInput.value = '';
        })
        .catch(err => console.error("Ошибка изменения аватара:", err))
        .finally(() => {
            clearInterval(dotsInterval);
            submitButton.textContent = "Сохранить";
            submitButton.disabled = false;
            resetForm(avatarFormElement)
        });
}

profileEditButton.addEventListener('click', () => {
    profileNameInput.value = profileTitle.textContent;
    profileDescriptionInput.value = profileDescription.textContent;
    resetInputFrom(profileForm)
    openModal(profilePopup);
});

profileForm.addEventListener('submit', handleProfileFormSubmit);

cardAddButton.addEventListener('click', () => {
    openModal(cardPopup);
});


cardFormElement.addEventListener('submit', handleCardFormSubmit);

editAvatarButton.addEventListener('click', () => {
    openModal(avatarPopup);
});

avatarFormElement.addEventListener('submit', handleAvatarFormSubmit);

enableValidation(validationSettings);

loadUser();
renderInitialCards()


