import React, { useEffect, useState } from 'react';
import { Avatar, List, Space, Spin, Button, Form, Input, Modal, notification } from 'antd';
import styles from './Application.module.scss';
import {
    CheckCircleOutlined,
    QuestionCircleOutlined,
    IssuesCloseOutlined,
    ClockCircleOutlined,
} from '@ant-design/icons';
import { getApplicationProject, uploadFile, CreateDeliverable, getDeliverable, EditDeliverable } from './fetcher';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

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

const Application = () => {
    const [applicationsProject, setDatApplicationsProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadingInitialValue, setLoadingInitialValue] = useState(false);
    const [loadingUpload, setLoadingUpload] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [file, setFile] = useState(null);
    const [applicationId, setApplicationId] = useState(null);
    const [initialValue, setInitialValue] = useState({});

    const [api, contextHolder] = notification.useNotification();
    const openNotification = (placement) => {
        api.info({
            message: `Notification ${placement}`,
            placement: 'topRight',
        });
    };

    useEffect(() => {
        const student_id = localStorage.getItem('student_id');
        if (student_id) {
            getApplicationProject(student_id)
                .then((payload) => {
                    setDatApplicationsProject(payload.applications.rows);
                    setLoading(false);
                })
                .catch((err) => {
                    console.log('err', err);
                    setLoading(false);
                });
        }
    }, []);

    const fetchDataDeliverables = (application_id) => {
        setLoadingInitialValue(true);
        getDeliverable(application_id)
            .then((payload) => {
                if (payload.deliverables.rows.length === 0) {
                    setInitialValue({});
                    setLoadingInitialValue(false);
                } else {
                    setInitialValue({
                        title: payload.deliverables.rows[0].title,
                        description: payload.deliverables.rows[0].description,
                        file: payload.deliverables.rows[0].file,
                        deliverable_id: payload.deliverables.rows[0].deliverable_id,
                    });
                    setLoadingInitialValue(false);
                }
            })
            .catch((err) => {
                console.log('err', err);
                setLoading(false);
            });
    };

    const setStatusForProject = (status) => {
        switch (status) {
            case 'Active':
                return <QuestionCircleOutlined style={{ color: '#9400b3' }} />;
            case 'Received':
                return <IssuesCloseOutlined style={{ color: '#feda2c' }} />;
            case 'Submitted':
                return <ClockCircleOutlined style={{ color: '#0958d9' }} />;
            case 'Finished':
                return <CheckCircleOutlined style={{ color: '#00b323' }} />;
            default:
                return <QuestionCircleOutlined style={{ color: '#9400b3' }} />;
        }
    };

    const showModal = (application_id) => {
        setLoadingUpload(true);
        setApplicationId(application_id);
        fetchDataDeliverables(application_id);
        setIsModalOpen(true);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const onFinish = (value) => {
        const datCreate = {
            title: value.title || '',
            description: value.description || '',
            file: file || initialValue.file,
            application_id: applicationId || '',
        };

        const dataUpdate = {
            title: value.title || '',
            description: value.description || '',
            file: file || initialValue.file,
            application_id: applicationId || '',
            deliverable_id: initialValue.deliverable_id || '',
        };

        Object.entries(initialValue).length === 0
            ? CreateDeliverable(datCreate)
                  .then((payload) => {
                      if (payload.msg === 'Create new deliverable successfully') {
                          openNotification('Create new deliverable successfully');
                          setIsModalOpen(false);
                      } else {
                          openNotification('Create new deliverable failed');
                      }
                  })
                  .catch((err) => {
                      openNotification('Create new deliverable successfully');
                      console.log('err', err);
                  })
            : EditDeliverable(dataUpdate)
                  .then((payload) => {
                      console.log(payload);
                      if (payload.msg === '1 deliverable is updated') {
                          openNotification('edit deliverable successfully');
                          setIsModalOpen(false);
                      } else {
                          openNotification('edit deliverable failed');
                      }
                  })
                  .catch((err) => {
                      openNotification('edit deliverable successfully');
                      console.log('err', err);
                  });
    };
    const handleChange = (event) => {
        const formData = new FormData();
        formData.append('file', event.target.files[0]);
        setLoadingUpload(false);
        uploadFile(formData)
            .then((payload) => {
                setLoadingUpload(true);
                setFile(payload.url);
            })
            .catch((err) => {
                console.log('error', err);
            });
    };

    if (loading) {
        return (
            <Space direction="vertical" style={{ width: '100%', marginTop: '100px' }}>
                <Spin tip="Loading" size="large">
                    <div className="content" />
                </Spin>
            </Space>
        );
    }

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
                dataSource={applicationsProject} // wrap the project data inside an array
                renderItem={(item) => (
                    <List.Item
                        key={item.application_id}
                        extra={
                            <img
                                width={272}
                                alt="logo"
                                src={
                                    item.application_project.image ||
                                    'https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png'
                                }
                            />
                        }
                    >
                        <List.Item.Meta
                            avatar={
                                <a href={item.application_project.url}>
                                    <Avatar src={item.application_student.avatar} />
                                </a>
                            }
                            title={
                                // eslint-disable-next-line jsx-a11y/anchor-is-valid
                                <a>
                                    {item.application_project.project_name}{' '}
                                    {setStatusForProject(item.application_project.status)}
                                </a>
                            }
                            description={item.application_project.description}
                        />
                        <div>
                            <p>{`Price: ${item.price}`}</p>
                            <p>{`Url: ${item.application_project.url}`}</p>
                        </div>
                        <Button type="primary" onClick={() => showModal(item.application_id)}>
                            Submit project
                        </Button>
                        <Modal
                            open={isModalOpen}
                            onCancel={handleCancel}
                            title="Submit project"
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
                            {loadingInitialValue || (
                                <Form
                                    name="form_item_path"
                                    layout="vertical"
                                    onFinish={onFinish}
                                    initialValues={initialValue}
                                >
                                    <MyFormItem name="title" label="Title">
                                        <Input />
                                    </MyFormItem>

                                    <MyFormItem name="description" label="Description">
                                        <Input.TextArea />
                                    </MyFormItem>

                                    <MyFormItem label="Project">
                                        <input type="file" onChange={handleChange} />
                                        {loadingUpload || <Spin style={{ marginTop: '10px' }} />}
                                    </MyFormItem>
                                    {Object.entries(initialValue).length === 0 ? (
                                        <Button type="primary" htmlType="submit">
                                            Submit
                                        </Button>
                                    ) : (
                                        <Button type="primary" htmlType="submit">
                                            Edit
                                        </Button>
                                    )}
                                </Form>
                            )}
                        </Modal>
                    </List.Item>
                )}
            />
        </>
    );
};

export default Application;
