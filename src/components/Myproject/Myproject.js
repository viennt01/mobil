import classNames from 'classnames/bind';
import styles from './myProject.module.scss';
import { Avatar, List, Space, Spin, Button, Modal, notification, Tag } from 'antd';
import { StarOutlined, LikeOutlined, MessageOutlined } from '@ant-design/icons';
import React from 'react';
import { useEffect, useState } from 'react';
import { getMyProject, getStudentsApply, postAccetpStudent, putAccetpStudent } from './fetcher';

const IconText = ({ icon, text }) => (
    <Space>
        {React.createElement(icon)}
        {text}
    </Space>
);

const cx = classNames.bind(styles);

const Myproject = () => {
    const [myProject, setDataMyProject] = useState(null);
    const [studentsApply, setStudentsApply] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadingModal, setLoadingModal] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [rejectedStudents, setRejectedStudents] = useState([]);
    const [acceptedStudents, setAcceptedStudents] = useState([]);
    const [api, contextHolder] = notification.useNotification();

    const openNotification = (placement) => {
        api.info({
            message: `Notification ${placement}`,
            placement,
        });
    };

    const dataStudentApply = (project_id) => {
        setLoadingModal(true);

        getStudentsApply(project_id)
            .then((payload) => {
                setStudentsApply(payload.applications.rows);
                const acceptedStudents = payload.applications.rows.map(
                    (applications) => applications.application_project.doer_id,
                );
                setAcceptedStudents(acceptedStudents);
                setLoadingModal(false);
            })
            .catch((err) => {
                console.log('err', err);
                setLoadingModal(false);
            });
    };

    useEffect(() => {
        const poster_id = localStorage.getItem('student_id');
        if (poster_id) {
            dataStudentApply(poster_id);
            getMyProject(poster_id)
                .then((payload) => {
                    setDataMyProject(payload.projects.rows);
                    setLoading(false);
                })
                .catch((err) => {
                    console.log('err', err);
                    setLoading(false);
                });
        }
    }, []);
    if (loading) {
        return (
            <Space direction="vertical" style={{ width: '100%', marginTop: '100px' }}>
                <Spin tip="Loading" size="large">
                    <div className="content" />
                </Spin>
            </Space>
        );
    }
    const showModal = (project_id) => {
        setIsModalOpen(true);
        dataStudentApply(project_id);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    //Sử lý Accept and denied trong my project
    const handleAccept = (application_id) => {
        if (!acceptedStudents.includes(application_id)) {
            postAccetpStudent(application_id)
                .then((payload) => {
                    if (payload.msg === 'Accept application successfully') {
                        openNotification('Accept application successfully!');
                        setLoading(false);
                        setIsModalOpen(false);
                        // Cập nhật danh sách acceptedStudents với application_id của học sinh được chấp nhận
                        setAcceptedStudents([...acceptedStudents, application_id]);
                    } else {
                        openNotification('You have already applied this project!');
                    }
                })
                .catch((err) => {
                    openNotification('Apply failed!');
                });
        }
    };

    const handleDeny = (application_ids) => {
        if (!rejectedStudents.includes(application_ids)) {
        putAccetpStudent(application_ids)
            .then((payload) => {
                console.log(payload);
                if (payload.msg === 'Accept application successfully') {
                    openNotification('Accept application successfully!');
                    setIsModalOpen(false);
                    setLoading(false);

                    setRejectedStudents([...acceptedStudents, application_ids]);
                } else {
                    openNotification('You have already applied this project!');
                }
            })
            .catch((err) => {
                openNotification('Apply failed!');
            });
        }
    };

    return (
        <>
            {contextHolder}
            <List
                className={cx('wrapper')}
                itemLayout="vertical"
                size="large"
                pagination={{
                    onChange: (page) => {
                        console.log(page);
                    },
                    pageSize: 5,
                }}
                dataSource={myProject} // wrap the project data inside an array
                renderItem={(item) => (
                    <List.Item
                        key={item.project_id}
                        actions={[
                            <IconText icon={StarOutlined} text="156" key="list-vertical-star-o" />,
                            <IconText icon={LikeOutlined} text="156" key="list-vertical-like-o" />,
                            <IconText icon={MessageOutlined} text="2" key="list-vertical-message" />,
                        ]}
                        extra={
                            <img
                                width={272}
                                alt="logo"
                                src={
                                    item.image || 'https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png'
                                }
                            />
                        }
                    >
                        <List.Item.Meta
                            avatar={<Avatar src={item.project_poster.avatar} />}
                            title={<a href={item.url}>{item.project_name}</a>}
                            // projectName={<a>{item.project_name}</a>}
                            description={item.description}
                        />
                        <div>
                            <p>{`Price: ${item.price}`}</p>
                            <p>{`Category: ${item.project_category.cate_name}`}</p>
                            <p>{`Major: ${item.project_major.major_name}`}</p>
                            <p>{`Url: ${item.url}`}</p>
                            <Button type="primary" onClick={() => showModal(item.project_id)}>
                                List apply
                            </Button>
                        </div>
                    </List.Item>
                )}
            />
            <Modal
                style={{width: '700px'}}
                title="List Student Applications"
                open={isModalOpen}
                onCancel={handleCancel}
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
                {!loadingModal ? (
                    <List
                        itemLayout="horizontal"
                        dataSource={studentsApply}
                        renderItem={(item, index) => (
                            <List.Item
                                actions={[
                                    <Button
                                        type="primary"
                                        disabled={studentsApply[0].application_project.doer_id ? true : false}
                                        onClick={() => handleAccept(item.application_id)}
                                    >
                                        Accept
                                    </Button>,
                                    <Button
                                        disabled={studentsApply[0].application_project.doer_id ? true : false}
                                        onClick={() => handleDeny(item.application_id)}
                                    >
                                        Deny
                                    </Button>,
                                ]}
                            >
                                <List.Item.Meta
                                    avatar={<Avatar src={item.application_student.avatar} />}
                                    title={<a href="https://ant.design">{item.application_student.student_name}</a>}
                                    description={`Email Address: ${item.application_student.email}`}
                                />
                                {item.status === "Submitted" && !rejectedStudents.includes(item.application_id) &&
                                    <Button href={`/Payment/${item.application_id}`} color="blue">Deliverable</Button>
                                }
                            </List.Item>
                        )}
                    />
                ) : (
                    <Space direction="vertical" style={{ width: '100%' }}>
                        <Spin tip="Loading" size="large">
                            <div className="content" />
                        </Spin>
                    </Space>
                )}
            </Modal>
        </>
    );
};

export default Myproject;
