import {validationSettings} from "./configuration.js";

const validateUrl = (url) => {
    const urlPattern = new RegExp(/^(?:(?:https?|ftp|telnet):\/\/(?:[a-z0-9_-]{1,32}(?::[a-z0-9_-]{1,32})?@)?)?(?:(?:[a-z0-9-]{1,128}\.)+(?:com|net|org|mil|edu|arpa|ru|gov|biz|info|aero|inc|name|[a-z]{2})|(?!0)(?:(?!0[^.]|255)[0-9]{1,3}\.){3}(?!0|255)[0-9]{1,3})(?:\/[a-z0-9.,_@%&?+=\~\/-]*)?(?:#[^ \'\"&<>]*)?$/i);
    return urlPattern.test(url);
};

const hasInvalidInput = (inputList) => {
    return inputList.some((inputElement) => {
        if (inputElement.type === "url") {
            return !validateUrl(inputElement.value);
        }
        console.log(inputElement.validity.valid)
        return !inputElement.validity.valid;
    });
};

const toggleButtonState = (inputList, buttonElement) => {
    if (hasInvalidInput(inputList)) {
        buttonElement.classList.add(validationSettings.inactiveButtonClass);
        buttonElement.setAttribute("disabled", true);
    } else {
        buttonElement.classList.remove(validationSettings.inactiveButtonClass);
        buttonElement.removeAttribute("disabled");
    }
};

const showInputError = (formElement, inputElement, errorMessage) => {
    const errorElement = formElement.querySelector(`#input-${inputElement.id}-error`);
    inputElement.classList.add(validationSettings.inputErrorClass);
    errorElement.textContent = errorMessage;
    errorElement.classList.add(validationSettings.errorClass);
};

const hideInputError = (formElement, inputElement) => {
    const errorElement = formElement.querySelector(`#input-${inputElement.id}-error`);
    inputElement.classList.remove(validationSettings.inputErrorClass);
    errorElement.classList.remove(validationSettings.errorClass);
    errorElement.textContent = "";
};

const resetForm = (formElement) => {
    formElement.reset();

    const inputs = Array.from(formElement.querySelectorAll(validationSettings.inputSelector));
    inputs.forEach((inputElement) => {
        hideInputError(formElement, inputElement);
    });

    const button = formElement.querySelector(validationSettings.submitButtonSelector);
    button.classList.add(validationSettings.inactiveButtonClass);
    button.removeAttribute("disabled");
};

const resetInputFrom = (formElement) => {
    const inputs = Array.from(formElement.querySelectorAll(validationSettings.inputSelector));
    inputs.forEach((inputElement) => {
        hideInputError(formElement, inputElement);
    });

    const button = formElement.querySelector(validationSettings.submitButtonSelector);
    button.classList.remove(validationSettings.inactiveButtonClass);
    button.setAttribute("disabled", true);

}

const setEventListeners = (formElement) => {
    const inputs = Array.from(formElement.querySelectorAll(validationSettings.inputSelector));
    const button = formElement.querySelector(validationSettings.submitButtonSelector);

    toggleButtonState(inputs, button);

    inputs.forEach((inputElement) => {
        inputElement.addEventListener("input", function () {
            if (inputElement.type === "url") {
                if (!validateUrl(inputElement.value)) {
                    showInputError(formElement, inputElement, "Введите корректный URL");
                } else {
                    hideInputError(formElement, inputElement);
                }
            } else {
                if (!inputElement.validity.valid) {
                    showInputError(formElement, inputElement, inputElement.validationMessage);
                } else {
                    hideInputError(formElement, inputElement);
                }
            }
            toggleButtonState(inputs, button);
        });
    });
};

const enableValidation = (validationSettings) => {
    const formList = Array.from(document.querySelectorAll(validationSettings.formSelector));
    formList.forEach((form) => {
        setEventListeners(form);
    });
};

export {enableValidation, resetForm, resetInputFrom};