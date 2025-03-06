import {
    getInitialCards,
    getUser,
    postCard,
    patchUser,
    patchUserAvatar,
} from "./api.js";

import {openModal, closeModal, setCloseEventListeners} from "./modalActions.js";
import {createCard} from "./cardActions.js";
import {enableValidation} from "./validation.js";
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

    submitButton.textContent = "Сохранение...";
    submitButton.disabled = true;

    patchUser({username, description})
        .then(({name, about}) => {
            profileTitle.textContent = name;
            profileDescription.textContent = about;
            closeModal(profilePopup);
        })
        .catch(err => console.error("Ошибка обновления профиля:", err))
        .finally(() => {
            submitButton.textContent = "Сохранить";
            submitButton.disabled = false;
        });
}

function handleCardFormSubmit(evt) {
    evt.preventDefault();
    const name = newCardName.value;
    const link = newCardLink.value;
    const submitButton = evt.target.querySelector('button');

    submitButton.textContent = "Сохранение...";
    submitButton.disabled = true;

    postCard({name, link})
        .then(card => {
            const cardElement = createCard(card, userId);
            placesList.prepend(cardElement);
            closeModal(cardPopup);
            cardFormElement.reset();
        })
        .catch(err => console.error("Ошибка добавления карточки:", err))
        .finally(() => {

            submitButton.textContent = "Сохранить";
            submitButton.disabled = false;
        });
}

function handleAvatarFormSubmit(evt) {
    evt.preventDefault();
    const avatar = avatarInput.value;
    const submitButton = evt.target.querySelector('button');


    submitButton.textContent = "Сохранение...";
    submitButton.disabled = true;

    patchUserAvatar({avatar})
        .then(({avatar}) => {
            profileImage.src = avatar;
            closeModal(avatarPopup);
            avatarFormElement.reset();
        })
        .catch(err => console.error("Ошибка изменения аватара:", err))
        .finally(() => {

            submitButton.textContent = "Сохранить";
            submitButton.disabled = false;
        });
}

profileEditButton.addEventListener('click', () => {
    profileNameInput.value = profileTitle.textContent;
    profileDescriptionInput.value = profileDescription.textContent;
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


// popups.forEach(popup => {
//     popup.classList.add('popup_is-animated');
// });
//
//
// profileEditButton.addEventListener('click', () => openModal(profilePopup));
// cardAddButton.addEventListener('click', () => openModal(cardPopup));
//
// closeButtons.forEach(button => {
//     button.addEventListener('click', (event) => {
//         const popup = event.target.closest('.popup');
//         closeModal(popup);
//     });
// });
//
// popups.forEach(popup => {
//     popup.addEventListener('click', (event) => {
//         if (event.target === popup) {
//             closeModal(popup);
//         }
//     });
// });
//
// document.addEventListener('keydown', (event) => {
//     if (event.key === 'Escape') {
//         const openedPopup = document.querySelector('.popup_is-opened');
//         if (openedPopup) {
//             closeModal(openedPopup);
//         }
//     }
// });
//
// cardForm.addEventListener('submit', (event) => {
//     event.preventDefault();
//     if (nameInput.value !== '' && linkInput.value !== '') {
//         const newCard = {
//             name: nameInput.value,
//             link: linkInput.value,
//         };
//         const newCardElement = createCard(newCard);
//         placesList.prepend(newCardElement);
//     }
//
//     closeModal(cardPopup);
//
//     cardForm.reset();
// });
//
// profileEditButton.addEventListener('click', () => {
//     openModal(profilePopup);
//
//     profileNameInput.value = profileTitle.textContent;
//     profileDescriptionInput.value = profileDescription.textContent;
// });
//
// profileForm.addEventListener('submit', (event) => {
//     event.preventDefault();
//
//     profileTitle.textContent = profileNameInput.value;
//     profileDescription.textContent = profileDescriptionInput.value;
//     closeModal(profilePopup);
// })
//
// const forms = document.querySelectorAll('.popup__form');
//
// forms.forEach(form => {
//     const inputs = form.querySelectorAll('.popup__input');
//     const button = form.querySelector('.popup__button');
//
//     function validateForm() {
//         let isValid = true;
//
//         inputs.forEach(input => {
//             const errorElement = document.getElementById(`${input.name}-error`);
//             const emptyErrorElement = document.getElementById(`${input.name}-empty-error`);
//
//             if (input.validity.valueMissing) {
//                 emptyErrorElement.textContent = 'Вы пропустили это поле';
//                 errorElement.textContent = '';
//                 isValid = false;
//             } else {
//                 emptyErrorElement.textContent = '';
//                 if (!input.validity.valid) {
//                     errorElement.textContent = input.validationMessage;
//                     isValid = false;
//                 } else {
//                     errorElement.textContent = '';
//                 }
//             }
//         });
//
//         button.disabled = !isValid;
//         // if (isValid) {
//         //     button.style.backgroundColor = '#000000';
//         //     button.style.color = 'white';
//         // } else {
//         //     button.style.backgroundColor = 'white';
//         //     button.style.color = 'black';
//         // }
//     }
//
//     inputs.forEach(input => {
//         input.addEventListener('input', validateForm);
//         input.addEventListener('invalid', (event) => {
//             event.preventDefault(); // Отключаем стандартное сообщение браузера
//         });
//     });
//
//     validateForm();
// });
//
//
// renderInitialCards();

