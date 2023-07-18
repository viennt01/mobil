export const API_PROJECTS = {
    LIST_PROJECTS_HOME: '/v1/blogs',
    GET_PROJECTS: '/v1/projects',
    CREATE_PROJECTS: '/v1/projects',
};

export const API_MY_PROJECTS = {
    GET_MY_PROJECTS: '/v1/projects',
};
export const API_STUDENTS = {
    LIST_STUDENTS: '/v1/students',
    GET_STUDENTS: '/v1/students',
    EDIT_STUDENTS: '/v1/students/profile',
    DELETE_STUDENTS: '/v1/students',
};

export const API_FIREBASE = {
    UPLOAD_FILE: '/v1/upload-image',
};

export const API_MAJORS = {
    LIST_MAJORS: '/v1/majors',
};

export const API_CATEGORY = {
    LIST_CATEGORY: '/v1/categories',
};

export const API_APPLICATION = {
    GET_APPLICATION: '/v1/applications',
    POST_APPLICATION: '/v1/applications',
    STUDENT_APPLICATION_MY_PROJECT: '/v1/applications',
    APCCEPT_STUDENT: '/v1/applications/accept',
    DELETE_ACCEPT_STUDENT: '/v1/applications/delete',
};

export const API_DELIVERABLE = {
    CREATE_DELIVERABLE: '/v1/deliverables',
    LIST_DELIVERABLE: '/v1/deliverables',
    EDIT_DELIVERABLE: '/v1/deliverables',
    GET_DELIVERABLE: '/v1/deliverables',
};

export const API_AUTH = {
    LOGIN_EMAIL: '/v1/auth/login',
    REGISTER_EMAIL: '/v1/auth/register',
};

export const API_FORGOT_PASSWORD = {
    SEND_RECOVERY_EMAIL: '/v1/forgotpass/send_recovery_email',
    VERIFY_OTP: '/v1/forgotpass/verify_otp',
    CHANGE_PASSWORD: '/v1/forgotpass/change_password',
};

export const API_PAYMENT = {
    GET_PAYMENT: '/v1/stripe',
    POST_PAYMENT: '/v1/stripe/create-checkout-session',
};
