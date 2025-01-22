import '../pages/index.css'

import {initialCards} from "./cards";

let placesList = document.querySelector('.places__list');
const profilePopup = document.querySelector('.popup_type_edit');
const profileTitle = document.querySelector('.profile__title');
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
const profileEditButton = document.querySelector('.profile__edit-button');
const cardAddButton = document.querySelector('.profile__add-button');
const closeButtons = document.querySelectorAll('.popup__close');
const popups = document.querySelectorAll('.popup');

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

function renderInitialCards(cards) {
    cards.forEach(cardData => {
        const card = createCard(cardData);
        placesList.append(card);
    });
}

renderInitialCards(initialCards);

popups.forEach(popup => {
    popup.classList.add('popup_is-animated');
});

function openModal(popup) {
    popup.classList.add('popup_is-opened');
    setTimeout(() => {
        popup.classList.add('popup_is-visible');
    }, 10);
}

function closeModal(popup) {
    popup.classList.remove('popup_is-visible');
    setTimeout(() => {
        popup.classList.remove('popup_is-opened');
    }, 300);
}

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


// const form = document.querySelector('.popup__form');
// form.forEach(form => {
//     const inputs = form.querySelectorAll('.popup__input');
//     const button = form.querySelector('.popup__button');
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
//     }
//
// // inputs.forEach(input => {
// //     input.addEventListener('input', validateForm);
// // });
//
//     inputs.forEach(input => {
//         input.addEventListener('input', validateForm);
//         input.addEventListener('invalid', (event) => {
//             event.preventDefault();
//         });
//     });
//     validateForm();
// })

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
//
