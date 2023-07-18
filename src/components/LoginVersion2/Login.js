import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '~/services/authService';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { useIsHidden } from '../../hooks/useIsHidden';
import styles from './login.module.css';
import { validateLogin } from '../validateInput/validateInput';
import Validate from '../validateInput';
import useForm from '../useForm/useForm';
import { GoogleOutlined, FacebookOutlined, MailOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import images from '~/assets/images';
import { loginEmail } from './fetcher';
import { notification } from 'antd';

function Login() {
    const { hidden, handleClick } = useIsHidden();
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

    const signWithGoogle = async () => {
        await authService.loginWithGoogle();
        navigate('/');
        window.location.reload(false);
    };

    useEffect(() => {
        localStorage.clear();
    });
    const handleSubmit = (event) => {
        event.preventDefault();

        const data = {
            email: values.username,
            password: values.password,
        };

        loginEmail(data)
            .then((payload) => {
                if (payload.mes === 'Login is successfully') {
                    // Save the token and user type in local storage
                    localStorage.setItem('student_id', payload.user.student_id);
                    localStorage.setItem('avatar', payload.user.avatar);
                    localStorage.setItem('access_token', payload.access_token);
                    navigate('/');
                    window.location.reload(false);
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
                            <div className={styles.title}>
                                <h1>Login</h1>
                            </div>
                            <Link style={{ background: '#4359ac', marginBottom: '16px', color: '#fff', width: '100%' }}>
                                <div className={styles.icons}>
                                    <FacebookOutlined style={{ fontSize: '30px' }} />
                                </div>
                                <div>
                                    <span>With Facebook (update soon)</span>
                                </div>
                            </Link>
                            <button
                                style={{ background: '#c73534', marginBottom: '16px', color: '#fff', width: '100%' }}
                                onClick={signWithGoogle}
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
                        </div>
                        <div className={classNames(`${styles.formLoginHidden}`, hidden && `${styles.formLoginEmail}`)}>
                            <div className={styles.title}>
                                <button className={styles.back} onClick={handleClick}>
                                    <div className={styles.icons}>
                                        <ArrowLeftOutlined style={{ fontSize: '25px', marginRight: '5px' }} />
                                        <div>
                                            <span>Back</span>
                                        </div>
                                    </div>
                                </button>
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
                                <Link to="/forgotPassword">
                                    <span>Forgot your password?</span>
                                </Link>
                            </div>
                        </div>
                        <div className={styles.register}>
                            <span>Are you new to F_macth?</span>
                            <Link to="/register">
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
