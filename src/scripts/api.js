import {configApi} from "./configuration.js";


function serverResponse(res) {
    if (res.ok) {
        return res.json();
    }
    return Promise.reject(`Ошибка: ${res.status}`);
}

function getInitialCards() {
    return fetch(`${configApi.baseUrl}/cards`, {
        headers: configApi.headers
    })
        .then(serverResponse)
}

function getUser() {
    return fetch(`${configApi.baseUrl}/users/me`, {
        headers: configApi.headers
    })
        .then(serverResponse)
}

function deleteCard(cardId) {
    return fetch(`${configApi.baseUrl}/cards/${cardId}`, {
        method: 'DELETE',
        headers: configApi.headers
    })
        .then(serverResponse)

}

function postCard({name, link}) {
    return fetch(`${configApi.baseUrl}/cards`, {
        method: 'POST',
        headers: configApi.headers,
        body: JSON.stringify({name, link})
    })
        .then(serverResponse)
}

function patchUser({username, description}) {
    return fetch(`${configApi.baseUrl}/users/me`, {
        method: 'PATCH',
        headers: configApi.headers,
        body: JSON.stringify({name: username, about: description})
    })
        .then(serverResponse)
}

function patchUserAvatar({avatar}) {
    return fetch(`${configApi.baseUrl}/users/me/avatar`, {
        method: 'PATCH',
        headers: configApi.headers,
        body: JSON.stringify({avatar})
    })
        .then(serverResponse)
}

function putCardLike(cardId) {
    return fetch(`${configApi.baseUrl}/cards/${cardId}/likes`, {
        method: 'PUT',
        headers: configApi.headers
    })
        .then(serverResponse)
}

function deleteCardLike(cardId) {
    return fetch(`${configApi.baseUrl}/cards/${cardId}/likes`, {
        method: 'DELETE',
        headers: configApi.headers
    })
        .then(serverResponse)
}

export {
    getInitialCards,
    getUser,
    deleteCard,
    postCard,
    patchUser,
    patchUserAvatar,
    putCardLike,
    deleteCardLike,
}