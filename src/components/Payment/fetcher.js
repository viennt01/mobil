import { get, post, GATEWAY,} from '~/services/Service';
import { API_PAYMENT, API_DELIVERABLE, API_APPLICATION} from '~/services/endpoint';

export const getPayment = (poster_id) => {
    return get({ gw: GATEWAY.REACT_APP_API_URL })(`${API_PAYMENT.GET_PAYMENT}?poster_id=${poster_id}`);
};
export const postPayment = (data) => {
    return post({data: data, gw: GATEWAY.REACT_APP_API_URL })(`${API_PAYMENT.POST_PAYMENT}`);
};
export const getDeliverablePayment = (application_id) => {
    return get({ gw: GATEWAY.REACT_APP_API_URL })(`${API_DELIVERABLE.GET_DELIVERABLE}?application_id=${application_id}`);
};
export const getApplicationProject = (project_id) => {
    return get({ gw: GATEWAY.REACT_APP_API_URL })(`${API_APPLICATION.GET_APPLICATION}?project_id=${project_id}`);
};
