import {validationSettings} from "./configuration";

const toggleButtonState = (inputList, buttonElement) => {
    if (inputList.validity.valueMissing) {
        buttonElement.classList.add(validationSettings.inactiveButtonClass);
        buttonElement.setAttribute('disabled', true);
    } else {
        buttonElement.classList.remove(validationSettings.inactiveButtonClass);
        buttonElement.removeAttribute('disabled');
    }
}

const showInputError = (formElement, inputElement, errorMessage) => {
    const errorElement = formElement.querySelector(`#input-${inputElement.id}-error`);
    inputElement.classList.add(validationSettings.inputErrorClass);
    errorElement.textContent = errorMessage;
    errorElement.classList.add(validationSettings.errorClass);
}

const hideInputError = (formElement, inputElement) => {
    const errorElement = formElement.querySelector(`#input-${inputElement.id}-error`);
    inputElement.classList.remove(validationSettings.inputErrorClass);
    errorElement.classList.remove(validationSettings.errorClass);
    errorElement.textContent = '';
};

const setEventListeners = (formElement) => {
    const inputs = Array.from(formElement.querySelectorAll(validationSettings.inputSelector));
    const button = formElement.querySelector(validationSettings.submitButtonSelector);
    toggleButtonState(inputs, button);
    inputs.forEach((inputElement) => {
        inputElement.addEventListener('input', function () {
            if (!inputElement.validity.valid) {
                showInputError(formElement, inputElement, inputElement.validationMessage);
            } else {
                hideInputError(formElement, inputElement);
            }
            toggleButtonState(inputs, button);
        })
    })
}

const enableValidation = (validationSettings) => {
    const formList = Array.from(document.querySelectorAll(validationSettings.formSelector));
    formList.forEach(form => {
        setEventListeners(form);
    })
}

export {enableValidation}