import { postNoToken, GATEWAY } from '~/services/Service';
import { API_AUTH } from '~/services/endpoint';

export const registerEmail = async (data) => {
    const postRegister = postNoToken({ data, gw: GATEWAY.REACT_APP_API_URL })(`${API_AUTH.REGISTER_EMAIL}`);
    const response = await postRegister;
    if (response.error) {
        throw new Error(response.error.message);
    }
    return response;
};
