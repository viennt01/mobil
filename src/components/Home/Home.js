import { Space, Spin } from 'antd';
import React, { useState, useEffect } from 'react';
import { getListProject } from './fetcher';
import Login from './login';

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

    useEffect(() => {
        // if (!localStorage.getItem('access_token')) {
        //     return;
        // }
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
    }, [checkInformation, isLogin]);
    console.log(listDataProject);
    return (
        <>
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
        </>
    );
};

export default Home;
