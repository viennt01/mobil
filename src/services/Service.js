export const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

export const ABORT_MESSAGE = 'canceled';

export const GATEWAY = {
    REACT_APP_API_URL: 'REACT_APP_API_URL',
};
const getGateway = (gw) => {
    switch (gw) {
        case GATEWAY.REACT_APP_API_URL: {
            return REACT_APP_API_URL;
        }
        default: {
            return REACT_APP_API_URL;
        }
    }
};
let idToken = '';
const token = localStorage.getItem('access_token');

if (token) {
    idToken = token;
}

export const get =
    ({ gw }) =>
    (url) => {
        console.log(idToken);
        return fetch(`${getGateway(gw)}${url}`, {
            headers: {
                Authorization: `Bearer ${idToken}`,
            },
        })
            .then(async (res) => {
                return res.json();
            })
            .catch((err) => {
                if (err?.msg === 'Access token invalid') {
                    return { message: ABORT_MESSAGE };
                }
                return { error: JSON.parse(err.msg) };
            });
    };

export const put =
    ({ data, gw }) =>
    (url) => {
        return fetch(`${getGateway(gw)}${url}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${idToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then(async (res) => {
                return res.json();
            })
            .catch((err) => {
                if (err?.msg === 'Access token invalid') {
                    return { message: ABORT_MESSAGE };
                }
                return { error: JSON.parse(err.msg) };
            });
    };

export const deleteGW =
    ({ data, gw }) =>
    (url) => {
        return fetch(`${getGateway(gw)}${url}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${idToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then(async (res) => {
                return res.json();
            })
            .catch((err) => {
                if (err?.msg === 'Access token invalid') {
                    return { message: ABORT_MESSAGE };
                }
                return { error: JSON.parse(err.msg) };
            });
    };

export const postUploadFile = ({ data, gw, url }) => {
    return fetch(`${getGateway(gw)}${url}`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${idToken}`,
            // 'Content-Type': `multipart/form-data`,
        },
        body: data,
    })
        .then(async (res) => {
            return res.json();
        })
        .catch((err) => {
            if (err?.msg === 'Access token invalid') {
                return { message: ABORT_MESSAGE };
            }
            return { error: JSON.parse(err.msg) };
        });
};

export const post =
    ({ data, gw }) =>
    (url) => {
        return fetch(`${getGateway(gw)}${url}`, {
            method: 'POST',
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${idToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then(async (res) => {
                return res.json();
            })
            .catch((err) => {
                if (err?.msg === 'Access token invalid') {
                    return { message: ABORT_MESSAGE };
                }
                return { error: JSON.parse(err.msg) };
            });
    };
export const postNoToken =
    ({ data, gw }) =>
    (url) => {
        return fetch(`${getGateway(gw)}${url}`, {
            method: 'POST',
            headers: {
                accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then(async (res) => {
                return res.json();
            })
            .catch((err) => {
                if (err?.msg === 'Access token invalid') {
                    return { message: ABORT_MESSAGE };
                }
                return { error: JSON.parse(err.msg) };
            });
    };
