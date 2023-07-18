import React from 'react';
import { Link } from 'react-router-dom';
import Validate from '../validateInput';
import useForm from '../useForm/useForm';
import styles from '../ForgotPassword/ForgotPassword.module.css';
import images from '~/assets/images';
import { changePassWord } from './fetcher';
import { notification } from 'antd';
import { useNavigate } from 'react-router-dom';

function ResetPassword() {
    const { values, errors, handleChange } = useForm();
    const [api, contextHolder] = notification.useNotification();
    const navigate = useNavigate();

    const openNotification = (placement) => {
        api.info({
            message: `Notification ${placement}`,
            placement: 'topRight',
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = {
            new_password: values.password,
            confirm_password: values.confirmPassword,
            email: localStorage.getItem('emailForgotPassWord'),
        };
        console.log(data);

        changePassWord(data)
            .then((payload) => {
                if (payload.msg === 'Change password successfully') {
                    localStorage.clear();
                    navigate('/login');
                    return openNotification('change password successfully');
                }
                if (payload.msg === 'Error: Please provide new password') {
                    return openNotification('please provide new password');
                }
                if (payload.msg === 'Error: Please provide confirm password') {
                    return openNotification('please provide confirm password');
                }
                if (payload.msg === 'Confirm password not match with new password') {
                    return openNotification('confirm password not match with new password');
                } else {
                    return openNotification('change password failed!');
                }
            })
            .catch((err) => {
                openNotification('change password failed!');
                throw new Error('change password failed!');
            });
    };

    return (
        <div>
            {contextHolder}
            <div>
                <div className={styles.container}>
                    <img
                        src={images.login1}
                        alt="custom/travelers-1"
                        className={styles.travelers}
                        style={{ right: 'calc(50% + 350px)' }}
                    />
                    <img
                        src={images.login2}
                        alt="custom/travelers-2"
                        className={styles.travelers}
                        style={{ left: 'calc(50% + 350px)' }}
                    />
                    <div className={styles.logo}>
                        <Link to="/">
                            <img alt="logo" src={images.loginCenter} style={{ width: '200px' }} />
                        </Link>
                    </div>
                    <div />
                    <div className={styles.login}>
                        <div className={styles.formLogin}>
                            <h1>Change password</h1>
                            <form className={styles.loginEmail} onSubmit={handleSubmit} noValidate>
                                <div className={styles.input}>
                                    <div className={styles.inputEmail}>
                                        <input
                                            type="password"
                                            name="password"
                                            placeholder="Fill your new password"
                                            onChange={handleChange}
                                            value={values.password || ''}
                                            required
                                        />
                                        <Validate errors={errors.password} />
                                    </div>
                                </div>
                                <div className={styles.input}>
                                    <div className={styles.inputEmail}>
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            placeholder="Fill your new password"
                                            onChange={handleChange}
                                            value={values.confirmPassword || ''}
                                            required
                                        />
                                        <Validate errors={errors.confirmPassword} />
                                    </div>
                                </div>
                                {/* {loading ? (
                                    <button disabled style={{ opacity: '.4' }}>
                                        <span>Save password </span>
                                        <Load isSmall={true} />
                                    </button>
                                ) : (
                              )} */}
                                <button>
                                    <span>Save password</span>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ResetPassword;
