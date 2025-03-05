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

// const handleEscClosePopup = (evt, popup) => {
//     if (evt.key === 'Escape') {
//         closeModal(popup);
//     }
// };
//
// const handleOverlayClosePopup = (evt, popup) => {
//     if (evt.target === evt.currentTarget) {
//         closeModal(popup);
//     }
// };

const setCloseEventListeners = (closeButtons) => {
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const popup = button.closest('.popup');
            if (popup) {
                closeModal(popup);
            }
        });
    });
};

export {openModal, closeModal, setCloseEventListeners};