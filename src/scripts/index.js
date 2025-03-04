import '../pages/index.css'

import {
    getInitialCards,
    getUser,
    deleteCard,
    postCard,
    patchUser,
    patchUserAvatar,
    putCardLike,
    deleteCardLike,
} from "./api";

import {openModal, closeModal, setCloseEventListeners} from "./modalActions";
import {createCard} from "./cardActions";
import {enableValidation} from "./validation";
import {validationSettings} from "./configuration";

let placesList = document.querySelector('.places__list');
let userId;

const profileEditButton = document.querySelector('.profile__edit-button');
const cardAddButton = document.querySelector('.profile__add-button');
const profilePopup = document.querySelector('.popup_type_edit');
const profileTitle = document.querySelector('.profile__title');
const profileImage = document.querySelector('.profile__image');
const profileDescription = document.querySelector('.profile__description');
const profileForm = document.querySelector('.popup__form[name="edit-profile"]');
const profileNameInput = profileForm.querySelector('.popup__input_type_name');
const profileDescriptionInput = profileForm.querySelector('.popup__input_type_description');

const cardPopup = document.querySelector('.popup_type_new-card');
const imagePopup = document.querySelector('.popup_type_image');
const popupImage = imagePopup.querySelector('.popup__image');
const popupCaption = imagePopup.querySelector('.popup__caption');
const cardForm = document.querySelector('.popup__form[name="new-place"]');

const nameInput = cardForm.querySelector('.popup__input_type_card-name');
const linkInput = cardForm.querySelector('.popup__input_type_url');

const closeButtons = document.querySelectorAll('.popup__close');
const popups = document.querySelectorAll('.popup');


function renderInitialCards() {
    getInitialCards()
        .then(cards => {
            cards.forEach(card => {
                const cardElement = createCard(card);
                placesList.append(cardElement);
            });
        })
        .catch(err => console.error("Ошибка загрузки карточек:", err));
}

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


popups.forEach(popup => {
    popup.classList.add('popup_is-animated');
});


profileEditButton.addEventListener('click', () => openModal(profilePopup));
cardAddButton.addEventListener('click', () => openModal(cardPopup));

closeButtons.forEach(button => {
    button.addEventListener('click', (event) => {
        const popup = event.target.closest('.popup');
        closeModal(popup);
    });
});

popups.forEach(popup => {
    popup.addEventListener('click', (event) => {
        if (event.target === popup) {
            closeModal(popup);
        }
    });
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        const openedPopup = document.querySelector('.popup_is-opened');
        if (openedPopup) {
            closeModal(openedPopup);
        }
    }
});

cardForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (nameInput.value !== '' && linkInput.value !== '') {
        const newCard = {
            name: nameInput.value,
            link: linkInput.value,
        };
        const newCardElement = createCard(newCard);
        placesList.prepend(newCardElement);
    }

    closeModal(cardPopup);

    cardForm.reset();
});

profileEditButton.addEventListener('click', () => {
    openModal(profilePopup);

    profileNameInput.value = profileTitle.textContent;
    profileDescriptionInput.value = profileDescription.textContent;
});

profileForm.addEventListener('submit', (event) => {
    event.preventDefault();

    profileTitle.textContent = profileNameInput.value;
    profileDescription.textContent = profileDescriptionInput.value;
    closeModal(profilePopup);
})

const forms = document.querySelectorAll('.popup__form');

forms.forEach(form => {
    const inputs = form.querySelectorAll('.popup__input');
    const button = form.querySelector('.popup__button');

    function validateForm() {
        let isValid = true;

        inputs.forEach(input => {
            const errorElement = document.getElementById(`${input.name}-error`);
            const emptyErrorElement = document.getElementById(`${input.name}-empty-error`);

            if (input.validity.valueMissing) {
                emptyErrorElement.textContent = 'Вы пропустили это поле';
                errorElement.textContent = '';
                isValid = false;
            } else {
                emptyErrorElement.textContent = '';
                if (!input.validity.valid) {
                    errorElement.textContent = input.validationMessage;
                    isValid = false;
                } else {
                    errorElement.textContent = '';
                }
            }
        });

        button.disabled = !isValid;
        // if (isValid) {
        //     button.style.backgroundColor = '#000000';
        //     button.style.color = 'white';
        // } else {
        //     button.style.backgroundColor = 'white';
        //     button.style.color = 'black';
        // }
    }

    inputs.forEach(input => {
        input.addEventListener('input', validateForm);
        input.addEventListener('invalid', (event) => {
            event.preventDefault(); // Отключаем стандартное сообщение браузера
        });
    });

    validateForm();
});


renderInitialCards();