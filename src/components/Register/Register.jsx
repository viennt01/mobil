import React from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { useIsHidden } from '../../hooks/useIsHidden';
import styles from './register.module.css';
import Validate from '../validateInput';
import useForm from '../useForm/useForm';
import images from '~/assets/images';
import { GoogleOutlined, FacebookOutlined, MailOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { registerEmail } from './fetcher';
import { notification } from 'antd';
import { useNavigate } from 'react-router-dom';

function RegisterV1() {
    const { hidden, handleClick } = useIsHidden();
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
            email: values.email,
            password: values.password,
            confirm_pass: values.confirmPassword,
        };

        registerEmail(data)
            .then((payload) => {
                console.log(payload);
                if (payload.mes === 'Register is successful') {
                    navigate('/login');
                    return openNotification('Register is successful');
                }
                if (payload.msg === 'Error: Please provide email') {
                    return openNotification('please provide email!');
                }
                if (payload.msg === 'Error: Please provide password') {
                    return openNotification('please provide password!');
                }
                if (payload.msg === 'Error: Please provide confirm password') {
                    return openNotification('please provide confirm password!');
                }
                if (payload.msg === 'Confirm password does not match with password') {
                    return openNotification('confirm password does not match with password!');
                } else {
                    return openNotification('register failed1!');
                }
            })
            .catch((err) => {
                openNotification('register failed123!');
                throw new Error('Failed to register');
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
                            <img alt="Trip diary logo" src={images.loginCenter} style={{ width: '200px' }} />
                        </Link>
                    </div>
                    <div></div>
                    <div className={styles.register}>
                        <div className={classNames(`${styles.formRegister}`, hidden && `${styles.formRegisterHidden}`)}>
                            <div className={styles.title}>
                                <h1>Registration</h1>
                            </div>
                            <div>
                                <Link
                                    style={{
                                        background: '#4359ac',
                                        marginBottom: '16px',
                                        color: '#fff',
                                        width: '100%',
                                    }}
                                >
                                    <div className={styles.icons}>
                                        <FacebookOutlined style={{ fontSize: '30px' }} />
                                    </div>
                                    <div>
                                        <span>With Facebook (update soon)</span>
                                    </div>
                                </Link>
                                <button
                                    style={{
                                        background: '#c73534',
                                        marginBottom: '16px',
                                        color: '#fff',
                                        width: '100%',
                                    }}
                                >
                                    <div className={styles.icons}>
                                        <GoogleOutlined style={{ fontSize: '30px' }} />
                                    </div>
                                    <div>
                                        <span>With Google</span>
                                    </div>
                                </button>

                                <button
                                    style={{
                                        background: 'linear-gradient(114deg,#00e1d6,#66ede7)',
                                        marginBottom: '16px',
                                        color: '#fff',
                                        width: '100%',
                                    }}
                                    onClick={handleClick}
                                >
                                    <div className={styles.icons}>
                                        <MailOutlined style={{ fontSize: '30px' }} />
                                    </div>
                                    <div>
                                        <span>With Email</span>
                                    </div>
                                </button>
                                <span className={styles.span}>
                                    By registering I agree to the
                                    <Link>
                                        <div>
                                            <span>processing of personal data</span>
                                        </div>
                                    </Link>
                                    and
                                    <Link>
                                        <div>
                                            <span>Terms of Use</span>
                                        </div>
                                    </Link>
                                    of the app.
                                </span>
                            </div>
                        </div>
                        <div
                            className={classNames(
                                `${styles.formRegisterHidden}`,
                                hidden && `${styles.formRegisterEmail}`,
                            )}
                        >
                            <div className={styles.title}>
                                <button className={styles.back} onClick={handleClick}>
                                    <div className={styles.icons}>
                                        <ArrowLeftOutlined />

                                        <div>
                                            <span>Back</span>
                                        </div>
                                    </div>
                                </button>
                                <h1>Registration</h1>
                            </div>
                            <form className={styles.loginEmail} onSubmit={handleSubmit} noValidate>
                                <div className={styles.input}>
                                    <div className={styles.inputEmail}>
                                        <input
                                            type="email"
                                            name="email"
                                            placeholder="Fill your email adress"
                                            onChange={handleChange}
                                            value={values.email || ''}
                                            required
                                        />
                                        <Validate errors={errors.email} />
                                    </div>
                                </div>
                                <div className={styles.input}>
                                    <div className={styles.inputEmail}>
                                        <input
                                            type="password"
                                            name="password"
                                            placeholder="Password"
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
                                            placeholder="Confirm Password"
                                            onChange={handleChange}
                                            value={values.confirmPassword || ''}
                                            required
                                        />
                                        <Validate errors={errors.confirmPassword} />
                                    </div>
                                </div>
                                <div className={styles.recap}>
                                    <span>
                                        By registering I agree to the
                                        <Link>
                                            <span>processing of personal data</span>
                                        </Link>
                                        and
                                        <Link>
                                            <span>Terms of Use</span>
                                        </Link>
                                        of the app. This site is protected by reCAPTCHA and the Google
                                        <Link>
                                            <span>Privacy Policy</span>
                                        </Link>
                                        and
                                        <Link>
                                            <span>Terms of Service</span>
                                        </Link>
                                        apply.
                                    </span>
                                </div>
                                {/* {loading ? (
                                    <button disabled style={{ opacity: '.4' }}>
                                        <span>Register </span>
                                        <Load isSmall={true} />
                                    </button>
                                ) : (
                                )} */}
                                <button>
                                    <span>Register</span>
                                </button>
                            </form>
                        </div>
                        <div className={styles.login}>
                            <span>Do you already have an account?</span>
                            <Link to="/login">
                                <div>
                                    <span>Log in</span>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RegisterV1;
