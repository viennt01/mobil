import { Space, Spin, Form, Modal, Button, Input, notification } from 'antd';
import React, { useState, useEffect } from 'react';
import { getListProject } from './fetcher';
import Login from './login';
import { CreateProject, DeleteBlog } from './fetcher';
import { Upload } from 'upload-js';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCircleQuestion,
    faCoins,
    faEarthAsia,
    faEllipsisVertical,
    faGear,
    faKeyboard,
    faSignOut,
    faUser,
} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

import config from '~/config';
import styles from './Header.module.scss';
import images from '~/assets/images';
import Menu from '~/components/Popper/Menu';
import { InboxIcon, MessageIcon } from '~/components/Icons';
import Image from '~/components/Image';
import Search from './Search';
import PostProject from '~/components/PostProject/PostProject';
import { UploadIcon } from '~/components/Icons';

const MyFormItemContext = React.createContext([]);
function toArr(str) {
    return Array.isArray(str) ? str : [str];
}
const MyFormItem = ({ name, ...props }) => {
    const prefixPath = React.useContext(MyFormItemContext);
    const concatName = name !== undefined ? [...prefixPath, ...toArr(name)] : undefined;
    return (
        <Form.Item
            rules={[
                {
                    required: true,
                },
            ]}
            name={concatName}
            {...props}
        />
    );
};

const MENU_ITEMS = [
    {
        icon: <FontAwesomeIcon icon={faEarthAsia} />,
        title: 'English',
        children: {
            title: 'Language',
            data: [
                {
                    type: 'language',
                    code: 'en',
                    title: 'English',
                },
                {
                    type: 'language',
                    code: 'vi',
                    title: 'Tiếng Việt',
                },
            ],
        },
    },
    {
        icon: <FontAwesomeIcon icon={faCircleQuestion} />,
        title: 'Feedback and help',
        to: '/feedback',
    },
    {
        icon: <FontAwesomeIcon icon={faKeyboard} />,
        title: 'Keyboard shortcuts',
    },
];

function convertDateFormat(dateString) {
    const date = new Date(dateString);
    const options = { month: 'long', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

const Home = () => {
    const [listDataProject, setListDataProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isLogin, setIsLogin] = useState(true);
    const [isDefault, setIsDefault] = useState(false);
    const checkInformation = localStorage.getItem('student_id') ? false : true;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [file, setFile] = useState(null);
    const [api, contextHolder] = notification.useNotification();

    const openNotification = (placement) => {
        api.info({
            message: `Notification ${placement}`,
            placement,
        });
    };

    const cx = classNames.bind(styles);

    const fetchApi = () => {
        getListProject()
            .then((payload) => {
                setListDataProject(payload.blogs.filter((item) => item.status === 'Active'));
                setLoading(false);
                setIsLogin(false);
            })
            .catch((err) => {
                console.log('err', err);
            });
    };

    useEffect(() => {
        fetchApi();
    }, [checkInformation, isLogin]);
    console.log(listDataProject);
    const token = localStorage.getItem('access_token');

    // Handle logic
    const handleMenuChange = (menuItem) => {
        switch (menuItem.type) {
            case 'language':
                // Handle change language
                break;
            case 'logout':
                localStorage.clear();
                window.loaction.reload();
                break;
            default:
        }
    };
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleChange = async (event) => {
        setIsDefault(true);
        const upload = Upload({ apiKey: 'public_kW15bY7Ft7ypJD9yUKHK2VVfvh7W' }); // Your real API key.

        const [file] = event.target.files;
        const { fileUrl } = await upload.uploadFile(file);
        setFile(fileUrl);
        setIsDefault(false);
    };

    const onFinish = (value) => {
        const data = {
            user_id: localStorage.getItem('student_id'),
            title: value.title || '',
            content: value.content || '',
            image: file || '',
        };
        CreateProject(data)
            .then((payload) => {
                if (payload.msg === 'Create new blog successfully') {
                    openNotification('Create new blog successfully');
                    setIsModalOpen(false);
                    fetchApi();
                } else {
                    openNotification('Create new blog failed');
                }
            })
            .catch((err) => {
                openNotification('Create new blog failed');
                console.log('err', err);
            });
    };

    const userMenu = [
        {
            icon: <FontAwesomeIcon icon={faUser} />,
            title: 'View profile',
            to: `/@${localStorage.getItem('student_id')}`,
        },
        {
            icon: <FontAwesomeIcon icon={faCoins} />,
            title: 'Get coins',
            to: '/coin',
        },
        {
            icon: <FontAwesomeIcon icon={faGear} />,
            title: 'Settings',
            to: '/settings',
        },
        ...MENU_ITEMS,
        {
            icon: <FontAwesomeIcon icon={faSignOut} />,
            title: 'Log out',
            to: '/',
            type: 'logout',
            separate: true,
        },
    ];

    const handleDeleteBlog = (id) => {
        console.log(id);
        DeleteBlog(id)
            .then((payload) => {
                console.log(payload);
                fetchApi();
            })
            .catch((err) => {
                console.log('error', err);
            });
    };
    return (
        <>
            {contextHolder}
            <header className={cx('wrapper')}>
                <div className={cx('inner')}>
                    <Link to={config.routes.home} className={cx('logo-link')}>
                        <img src={images.logo} alt="logo" style={{ width: '90px' }} />
                    </Link>

                    <Search />

                    <div className={cx('actions')}>
                        {!token ? (
                            <>
                                <Tippy delay={[0, 50]} content="Upload project" placement="bottom">
                                    <PostProject />
                                </Tippy>
                                <Tippy delay={[0, 50]} content="Message" placement="bottom">
                                    <button className={cx('action-btn')}>
                                        <MessageIcon />
                                    </button>
                                </Tippy>
                                <Tippy delay={[0, 50]} content="Inbox" placement="bottom">
                                    <button className={cx('action-btn')}>
                                        <InboxIcon />
                                        <span className={cx('badge')}>12</span>
                                    </button>
                                </Tippy>
                            </>
                        ) : (
                            <>
                                <Tippy delay={[0, 50]} content="Upload project" placement="bottom">
                                    <button onClick={showModal} className={cx('action-btn')}>
                                        <UploadIcon />
                                    </button>
                                </Tippy>
                                <Tippy delay={[0, 50]} content="Message" placement="bottom">
                                    <button className={cx('action-btn')}>
                                        <MessageIcon />
                                    </button>
                                </Tippy>
                                <Tippy delay={[0, 50]} content="Inbox" placement="bottom">
                                    <button className={cx('action-btn')}>
                                        <InboxIcon />
                                        <span className={cx('badge')}>12</span>
                                    </button>
                                </Tippy>
                            </>
                        )}

                        <Menu items={token ? userMenu : MENU_ITEMS} onChange={handleMenuChange}>
                            {token ? (
                                <Image
                                    className={cx('user-avatar')}
                                    src={localStorage.getItem('avatar')}
                                    alt="avatar"
                                />
                            ) : (
                                <button className={cx('more-btn')}>
                                    <FontAwesomeIcon icon={faEllipsisVertical} />
                                </button>
                            )}
                        </Menu>
                    </div>
                </div>
            </header>
            {checkInformation ? (
                <div
                    style={{
                        background: '#35363aa8',
                        width: '100%',
                        height: '100%',
                        position: 'fixed',
                        right: '0',
                        bottom: '0',
                    }}
                >
                    <Login />
                </div>
            ) : loading ? (
                <Space direction="vertical" style={{ width: '100%', marginTop: '100px' }}>
                    <Spin tip="Loading" size="large">
                        <div className="content" />
                    </Spin>
                </Space>
            ) : (
                <>
                    {listDataProject?.map((item) => (
                        <div className="w3-card-4 w3-margin w3-white" key={item.blog_id}>
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    paddingTop: '24px',
                                }}
                            >
                                <img src={item.image} alt="Norway" style={{ height: '500px' }} />
                            </div>
                            <div className="w3-container">
                                <h3>
                                    <b>{item.title}</b>
                                </h3>
                                <h5>
                                    {item.blog_user.user_name},{' '}
                                    <span className="w3-opacity">{convertDateFormat(item.createdAt)}</span>
                                </h5>
                            </div>
                            <div className="w3-container" style={{ paddingBottom: '24px' }}>
                                <p style={{ paddingBottom: '24px' }}>{item.content}</p>
                                <div className="w3-row">
                                    <div className="w3-col m11 s12">
                                        <p>
                                            <button className="w3-button w3-padding-large w3-white w3-border">
                                                <b>READ MORE »</b>
                                            </button>
                                        </p>
                                    </div>

                                    {localStorage.getItem('student_id') === item.blog_user.user_id ? (
                                        <button
                                            onClick={() => handleDeleteBlog(item.blog_id)}
                                            style={{
                                                position: 'relative',
                                                width: '50px',
                                                height: '50px',
                                                borderRadius: '25px',
                                                border: '2px solid rgb(231, 50, 50)',
                                                backgroundColor: '#fff',
                                                cursor: 'pointer',
                                                boxShadow: '0 0 10px #333',
                                                overflow: 'hidden',
                                                transition: '.3s',
                                            }}
                                            onMouseEnter={(e) => {
                                                e.target.style.backgroundColor = 'rgb(231, 50, 50)';
                                                e.target.style.borderColor = '#fff';
                                                e.target.querySelector('svg').style.color = '#fff';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.target.style.backgroundColor = '#fff';
                                                e.target.style.borderColor = 'rgb(231, 50, 50)';
                                                e.target.querySelector('svg').style.color = 'rgb(231, 50, 50)';
                                            }}
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="25"
                                                height="25"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                stroke-width="2"
                                                style={{
                                                    color: 'rgb(231, 50, 50)',
                                                    position: 'absolute',
                                                    top: '50%',
                                                    left: '50%',
                                                    transform: 'translate(-50%, -50%)',
                                                    transition: '.3s',
                                                }}
                                            >
                                                <path
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                />
                                            </svg>
                                        </button>
                                    ) : (
                                        <></>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </>
            )}
            <Modal
                open={isModalOpen}
                onCancel={handleCancel}
                title="Create a blog"
                footer={[
                    <Button
                        key="cancel"
                        onClick={() => {
                            setIsModalOpen(false);
                        }}
                    >
                        Cancel
                    </Button>,
                ]}
            >
                <Form name="form_item_path" layout="vertical" onFinish={onFinish}>
                    <MyFormItem name="title" label="Blog Name">
                        <Input />
                    </MyFormItem>

                    <MyFormItem name="content" label="Description">
                        <Input.TextArea />
                    </MyFormItem>

                    <MyFormItem label="Image">
                        <input type="file" onChange={handleChange} />
                        {file ? <Image width={200} src={file} style={{ marginTop: 30 }} /> : null}
                    </MyFormItem>

                    <Button type="primary" htmlType="submit" loading={isDefault}>
                        Submit
                    </Button>
                </Form>
            </Modal>
        </>
    );
};

export default Home;
