function openModal(popup) {
    popup.classList.add('popup_is-opened');
    document.addEventListener('keydown', handleEscapeClose);
    popup.addEventListener('click', (evt) => handleOverlayClose(evt, popup));
    setTimeout(() => {
        popup.classList.add('popup_is-visible');
    }, 10);
}

function closeModal(popup) {
    popup.classList.remove('popup_is-visible');
    document.removeEventListener('keydown', handleEscapeClose);
    popup.removeEventListener('click', handleOverlayClose);
    setTimeout(() => {
        popup.classList.remove('popup_is-opened');
    }, 300);
}

const handleEscapeClose = (evt) => {
    if (evt.key === 'Escape') {
        const openedPopup = document.querySelector('.popup_is-opened');
        if (openedPopup) {
            closeModal(openedPopup);
        }
    }
};

const handleOverlayClose = (evt, popup) => {
    if (evt.target === popup) {
        closeModal(popup);
    }
};

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

export {openModal, closeModal, setCloseEventListeners, handleEscapeClose, handleOverlayClose};