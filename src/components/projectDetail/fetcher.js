import { get, post, GATEWAY } from '~/services/Service';
import { API_PROJECTS, API_APPLICATION } from '~/services/endpoint';

export const getProjectDetail = (id) => {
    return get({ gw: GATEWAY.REACT_APP_API_URL })(`${API_PROJECTS.GET_PROJECTS}/${id}`);
};

export const postApplication = (id) => {
    const body = { project_id: id };
    return post({ data: body, gw: GATEWAY.REACT_APP_API_URL })(`${API_APPLICATION.POST_APPLICATION}`);
};