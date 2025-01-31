const config = {
    baseUrl: 'https://nomoreparties.co/v1/apf-cohort-202',
    headers: {
        authorization: '451c956b-7b94-41f4-8472-a0b95ad49c46',
        'Content-Type': 'application/json'
    }
}



export const getInitialCards = () => {
    return fetch(`${config.baseUrl}/cards`, {
        headers: config.headers
    })
        .then(res => {
            if (res.ok) {
                return res.json();
            }

            // если ошибка, отклоняем промис
            return Promise.reject(`Ошибка: ${res.status}`);
        });
}