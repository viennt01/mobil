import { get, GATEWAY, postNoToken } from '~/services/Service';
import { API_PROJECTS } from '~/services/endpoint';
import { API_AUTH } from '~/services/endpoint';

import { post, postUploadFile } from '~/services/Service';
import { API_MAJORS, API_CATEGORY, API_FIREBASE } from '~/services/endpoint';

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

export const CreateProject = (data) => {
    return post({ data: data, gw: GATEWAY.REACT_APP_API_URL })(`${API_PROJECTS.CREATE_PROJECTS}`);
};

export const ListMajors = () => {
    return get({ gw: GATEWAY.REACT_APP_API_URL })(`${API_MAJORS.LIST_MAJORS}`);
};

export const ListCategory = () => {
    return get({ gw: GATEWAY.REACT_APP_API_URL })(`${API_CATEGORY.LIST_CATEGORY}`);
};

export const uploadFile = (formData) => {
    const url = `${API_FIREBASE.UPLOAD_FILE}`;
    const gw = GATEWAY.REACT_APP_API_URL;
    return postUploadFile({ data: formData, gw, url });
};
