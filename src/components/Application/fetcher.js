import { get, post, GATEWAY, postUploadFile, put } from '~/services/Service';
import { API_APPLICATION, API_FIREBASE, API_DELIVERABLE } from '~/services/endpoint';

export const getApplicationProject = (student_id) => {
    return get({ gw: GATEWAY.REACT_APP_API_URL })(`${API_APPLICATION.GET_APPLICATION}?student_id=${student_id}`);
};

export const getDeliverable = (application_id) => {
    return get({ gw: GATEWAY.REACT_APP_API_URL })(
        `${API_DELIVERABLE.LIST_DELIVERABLE}?application_id=${application_id}`,
    );
};

export const uploadFile = (formData) => {
    const url = `${API_FIREBASE.UPLOAD_FILE}`;
    const gw = GATEWAY.REACT_APP_API_URL;
    return postUploadFile({ data: formData, gw, url });
};

export const CreateDeliverable = (data) => {
    return post({ data: data, gw: GATEWAY.REACT_APP_API_URL })(`${API_DELIVERABLE.CREATE_DELIVERABLE}`);
};

export const EditDeliverable = (data) => {
    return put({ data: data, gw: GATEWAY.REACT_APP_API_URL })(`${API_DELIVERABLE.EDIT_DELIVERABLE}`);
};

// export const postApplyToProject = (id) => {
//     const body = { project_id: id };
//     return post({ data: body, gw: GATEWAY.REACT_APP_API_URL })(`${API_APPLICATION.POST_APPLICATION}`);
// };
