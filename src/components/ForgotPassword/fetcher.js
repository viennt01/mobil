import { postNoToken, GATEWAY } from '~/services/Service';
import { API_FORGOT_PASSWORD } from '~/services/endpoint';

export const sendEmail = async (data) => {
    const postLogin = postNoToken({ data, gw: GATEWAY.REACT_APP_API_URL })(
        `${API_FORGOT_PASSWORD.SEND_RECOVERY_EMAIL}`,
    );
    const response = await postLogin;
    if (response.error) {
        throw new Error(response.error.message);
    }
    return response;
};

export const verifyOtp = async (data) => {
    const postVerifyOtp = postNoToken({ data, gw: GATEWAY.REACT_APP_API_URL })(`${API_FORGOT_PASSWORD.VERIFY_OTP}`);
    const response = await postVerifyOtp;
    if (response.error) {
        throw new Error(response.error.message);
    }
    return response;
};
