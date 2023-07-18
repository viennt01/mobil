import { postNoToken, GATEWAY } from '~/services/Service';
import { API_AUTH } from '~/services/endpoint';

export const loginEmail = async (data) => {
    const postLogin = postNoToken({ data, gw: GATEWAY.REACT_APP_API_URL })(`${API_AUTH.LOGIN_EMAIL}`);
    const response = await postLogin;
    if (response.error) {
        throw new Error(response.error.message);
    }
    return response;
};
