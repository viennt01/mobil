import { get, GATEWAY, postNoToken } from '~/services/Service';
import { API_PROJECTS } from '~/services/endpoint';
import { API_AUTH } from '~/services/endpoint';

export const getListProject = () => {
    return get({
        gw: GATEWAY.REACT_APP_API_URL,
    })(`${API_PROJECTS.LIST_PROJECTS_HOME}`);
};

export const loginEmail = async (data) => {
    const postLogin = postNoToken({ data, gw: GATEWAY.REACT_APP_API_URL })(`${API_AUTH.LOGIN_EMAIL}`);
    const response = await postLogin;
    if (response.error) {
        throw new Error(response.error.message);
    }
    return response;
};
