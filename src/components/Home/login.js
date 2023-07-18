import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import styles from './login.module.css';
import { validateLogin } from '../validateInput/validateInput';
import Validate from '../validateInput';
import useForm from '../useForm/useForm';
import { loginEmail } from './fetcher';
import { notification } from 'antd';

function Login(props) {
    const navigate = useNavigate();

    const { values, errors, handleChange } = useForm(login, validateLogin);
    function login() {}

    const [api, contextHolder] = notification.useNotification();

    const openNotification = (placement) => {
        api.info({
            message: `Notification ${placement}`,
            placement: 'topRight',
        });
    };
    const handleSubmit = (event) => {
        event.preventDefault();

        const data = {
            email: values.username,
            password: values.password,
        };
        // Login();
        loginEmail(data)
            .then((payload) => {
                console.log(payload);
                if (payload.mes === 'Login is successfully') {
                    // Save the token and user type in local storage
                    localStorage.setItem('student_id', payload.user.user_id);
                    localStorage.setItem('avatar', payload.user.avatar);
                    localStorage.setItem('access_token', payload.access_token);
                    navigate('/');
                    window.location.reload(false);

                    return;
                }
                if (payload.msg === 'Error: Please provide email') {
                    return openNotification('please provide email!');
                }
                if (payload.msg === 'Error: Please provide password') {
                    return openNotification('please provide password!');
                }
                if (payload.msg === 'Not found account') {
                    return openNotification('not found account!');
                } else {
                    return openNotification('login failed!');
                }
            })
            .catch((err) => {
                openNotification('login failed!');
                throw new Error('Failed to log in');
            });
    };

    return (
        <div>
            {contextHolder}
            <div>
                <div className={styles.container}>
                    {/* <div className={styles.logo}>
                        <Link to="/">
                            <img alt="logo" src={images.loginCenter} style={{ width: '200px' }} />
                        </Link>
                    </div> */}
                    <div />
                    <div className={styles.login}>
                        <div className={classNames(`${styles.formLoginHidden}` && `${styles.formLoginEmail}`)}>
                            <div className={styles.title}>
                                <h1>Login</h1>
                            </div>
                            <form className={styles.loginEmail} onSubmit={handleSubmit} noValidate>
                                <div className={styles.input}>
                                    <div className={styles.inputEmail}>
                                        <input
                                            type="text"
                                            name="username"
                                            placeholder="Fill your email Or UserName address"
                                            onChange={handleChange}
                                            value={values.username || ''}
                                            required
                                        />
                                        <Validate errors={errors.username} />
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
                                <button>
                                    <span>Log in</span>
                                </button>
                            </form>
                            <div className={styles.register} style={{ background: 'none' }}>
                                <Link to="/">
                                    <span>Forgot your password?</span>
                                </Link>
                            </div>
                        </div>
                        <div className={styles.register}>
                            <span>Are you new to Xpandit?</span>
                            <Link to="/">
                                <span>Register</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
