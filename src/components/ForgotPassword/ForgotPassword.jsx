import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Validate from '../validateInput';
import useForm from '../useForm/useForm';
import styles from './ForgotPassword.module.css';
import images from '~/assets/images';
import { sendEmail, verifyOtp } from './fetcher';
import { notification } from 'antd';
import classNames from 'classnames';
import { useIsHidden } from '../../hooks/useIsHidden';
import { useNavigate } from 'react-router-dom';

function ForgotPassword() {
    const { values, errors, handleChange } = useForm();
    const { hidden, handleClick } = useIsHidden();
    const [timerCount, setTimer] = React.useState(60);
    const [disable, setDisable] = useState(true);
    const [dataOTP, setDataOTP] = useState(null);
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
            mailTo: values.forgotPassword,
        };

        sendEmail(data)
            .then((payload) => {
                console.log(payload);
                if (payload.msg === 'OTP generated and email sent successfully') {
                    setDataOTP(payload.otp);
                    handleClick();
                    setDisable(true);
                    setTimer(60);
                    return openNotification('please check your email');
                } else {
                    return openNotification('send email failed!');
                }
            })
            .catch((err) => {
                openNotification('send email failed!');
                throw new Error('Send email failed!');
            });
    };

    const handleSubmitOTP = (event) => {
        event.preventDefault();
        const data = {
            OTP: values.OTP,
            otp_id: dataOTP.otp_id,
        };

        verifyOtp(data)
            .then((payload) => {
                console.log(payload);
                if (payload.msg === 'Valid OTP') {
                    localStorage.setItem('emailForgotPassWord', values.forgotPassword);
                    navigate('/resetPassword');
                    return openNotification('Valid OTP');
                }
                if (payload.msg === 'Otp is expired') {
                    return openNotification('Otp is expired');
                }
                if (payload.msg === 'Otp not found/Otp has been expired') {
                    return openNotification('please resend email');
                }
                if (payload.msg === 'Invalid OTP') {
                    return openNotification('invalid OTP');
                } else {
                    return openNotification('Verify OTP failed!');
                }
            })
            .catch((err) => {
                openNotification('Verify OTP failed!');
                throw new Error('Verify OTP failed!');
            });
    };

    const resendOTP = (event) => {
        event.preventDefault();
        const data = {
            mailTo: values.forgotPassword,
        };
        console.log(data);

        sendEmail(data)
            .then((payload) => {
                console.log(payload);
                if (payload.msg === 'OTP generated and email sent successfully') {
                    setDataOTP(payload.otp);
                    setDisable(true);
                    setTimer(60);
                    return openNotification('please check your email');
                } else {
                    return openNotification('send email failed!');
                }
            })
            .catch((err) => {
                openNotification('send email failed!');
                throw new Error('Send email failed!');
            });
    };

    React.useEffect(() => {
        let interval = setInterval(() => {
            setTimer((lastTimerCount) => {
                lastTimerCount <= 1 && clearInterval(interval);
                if (lastTimerCount <= 1) setDisable(false);
                if (lastTimerCount <= 0) return lastTimerCount;
                return lastTimerCount - 1;
            });
        }, 1000); //each count lasts for a second
        //cleanup the interval on complete
        return () => clearInterval(interval);
    }, [disable]);

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
                        <div className={classNames(`${styles.formLogin}`, hidden && `${styles.formLoginHidden}`)}>
                            <h1>Forgotten password</h1>
                            <span style={{ padding: ' 20px 0' }}>
                                Please enter your registration email and we will send you a link to reset your password
                                right away.
                            </span>
                            <form className={styles.loginEmail} onSubmit={handleSubmit} noValidate>
                                <div className={styles.input}>
                                    <div className={styles.inputEmail}>
                                        <input
                                            type="email"
                                            name="forgotPassword"
                                            placeholder="Fill your email address"
                                            onChange={handleChange}
                                            value={values.forgotPassword || ''}
                                            required
                                        />
                                        <Validate errors={errors.forgotPassword} />
                                    </div>
                                </div>

                                <button>
                                    <span>Reset password</span>
                                </button>
                            </form>
                        </div>
                        <div className={classNames(`${styles.formLoginHidden}`, hidden && `${styles.formLoginEmail}`)}>
                            <h1>Email Verification</h1>
                            <span style={{ padding: ' 20px 0' }}>We have sent a code to your email</span>
                            <form className={styles.loginEmail} onSubmit={handleSubmitOTP} noValidate>
                                <div className={styles.input}>
                                    <div className={styles.inputEmail}>
                                        <input
                                            type="OTP"
                                            name="OTP"
                                            placeholder="Fill your OTP"
                                            onChange={handleChange}
                                            value={values.OTP || ''}
                                            required
                                        />
                                    </div>
                                </div>
                                <button>
                                    <span>Verify Account</span>
                                </button>
                            </form>
                            {disable ? (
                                <span>Didn't receive code? {`Resend OTP in ${timerCount}s`}</span>
                            ) : (
                                <Link onClick={resendOTP}>
                                    <span>Resend OTP</span>
                                </Link>
                            )}
                        </div>
                        <div className={styles.register}>
                            <Link to="/login">
                                <span>Back to Login</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;
