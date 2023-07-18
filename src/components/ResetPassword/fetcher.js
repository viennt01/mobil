import { postNoToken, GATEWAY } from '~/services/Service';
import { API_FORGOT_PASSWORD } from '~/services/endpoint';

export const changePassWord = async (data) => {
    const postLogin = postNoToken({ data, gw: GATEWAY.REACT_APP_API_URL })(`${API_FORGOT_PASSWORD.CHANGE_PASSWORD}`);
    const response = await postLogin;
    if (response.error) {
        throw new Error(response.error.message);
    }
    return response;
};
