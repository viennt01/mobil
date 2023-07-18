import { Space, Spin, Form, Modal, Button, Input, notification } from 'antd';
import React, { useState, useEffect } from 'react';
import { getListProject } from './fetcher';
import Login from './login';
import { CreateProject, uploadFile } from './fetcher';

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
                console.log(payload);
                setListDataProject(payload.blogs);
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

    const handleChange = (event) => {
        const formData = new FormData();
        console.log(event.target.files);
        formData.append('file', event.target.files[0]);
        uploadFile(formData)
            .then((payload) => {
                setFile(payload.url);
            })
            .catch((err) => {
                console.log('error', err);
            });
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
                                    <div className="w3-col m8 s12">
                                        <p>
                                            <button className="w3-button w3-padding-large w3-white w3-border">
                                                <b>READ MORE »</b>
                                            </button>
                                        </p>
                                    </div>
                                    <div className="w3-col m4 w3-hide-small">
                                        <p>
                                            <span className="w3-padding-large w3-right">
                                                <b>Comments &nbsp;</b> <span className="w3-badge">2</span>
                                            </span>
                                        </p>
                                    </div>
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

                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form>
            </Modal>
        </>
    );
};

export default Home;
