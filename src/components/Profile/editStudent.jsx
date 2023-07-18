import React from 'react';
import { Button, Form, Input, notification, Space, Spin, Modal, Avatar } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { getStudent, editStudent, uploadFile } from './fetcher';

const layout = {
    labelCol: {
        span: 5,
    },
};
const tailLayout = {
    wrapperCol: {
        offset: 5,
        span: 16,
    },
};

const EditStudent = ({ checkInformation }) => {
    const idStudent = localStorage.getItem('student_id');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [file, setFile] = useState(null);

    const [dataStudent, setDataStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [api, contextHolder] = notification.useNotification();
    const openNotification = (placement) => {
        api.info({
            message: `Notification ${placement}`,
            placement,
        });
    };

    // Fetch dataStudent from server
    useEffect(() => {
        getStudent(idStudent)
            .then((payload) => {
                setFile(payload.student.avatar);
                setDataStudent(payload.student);
                setLoading(false);
            })
            .catch((err) => {
                console.log('err', err);
                setLoading(false);
            });
    }, [idStudent]);

    // Set initialValues from dataStudent
    const initialValues = {
        student_id: dataStudent?.student_id || '',
        name: dataStudent?.student_name || '',
        avatar: dataStudent?.avatar || '',
        email: dataStudent?.email || '',
        portfolio: dataStudent?.portfolio || '',
        major: dataStudent?.student_major?.major_name || '',
    };

    // Handle form submission
    const onFinish = (values) => {
        const student = {
            student_id: values.student_id || '',
            student_name: values.name || '',
            avatar: file || dataStudent?.avatar,
            portfolio: values.portfolio || '',
            major: values.major || '',
        };
        editStudent(student)
            .then((payload) => {
                if (payload.msg === 'Update profile successfully') {
                    openNotification('update successful');
                    setIsModalOpen(false);
                } else {
                    openNotification('update failed');
                }
            })
            .catch((err) => {
                openNotification('update failed');
            });
    };

    // Handle form reset
    const onReset = () => {
        formRef.current?.resetFields();
    };

    // Ref for the form
    const formRef = React.useRef(null);

    if (loading) {
        return (
            <Space direction="vertical" style={{ width: '100%' }}>
                <Spin tip="Loading" size="large">
                    <div className="content" />
                </Spin>
            </Space>
        );
    }

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleChange = (event) => {
        const formData = new FormData();
        formData.append('file', event.target.files[0]);
        uploadFile(formData)
            .then((payload) => {
                setFile(payload.url);
            })
            .catch((err) => {
                console.log('error', err);
            });
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            {contextHolder}
            <Button icon={<EditOutlined />} onClick={showModal} disabled={!checkInformation}>
                Edit
            </Button>
            <Modal
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
                <Form
                    {...layout}
                    ref={formRef}
                    name="control-ref"
                    onFinish={onFinish}
                    initialValues={initialValues}
                    style={{
                        maxWidth: 600,
                        marginTop: 30,
                    }}
                    rules={[
                        {
                            required: true,
                            message: 'Vui lòng nhập họ và tên của bạn',
                        },
                    ]}
                >
                    <Form.Item
                        label="Name"
                        name="name"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Portfolio"
                        name="portfolio"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Id student"
                        name="student_id"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Input disabled />
                    </Form.Item>
                    <Form.Item
                        label="Major"
                        name="major"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Input />
                        </Form.Item>
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Input disabled />
                    </Form.Item>
                    <Form.Item label="Avatar">
                        <input type="file" onChange={handleChange} />
                        {file ? (
                            <Avatar
                                size={{
                                    xs: 48,
                                    sm: 64,
                                    md: 80,
                                    lg: 116,
                                    xl: 116,
                                    xxl: 116,
                                }}
                                src={file}
                                style={{ marginTop: 30 }}
                            />
                        ) : null}
                    </Form.Item>

                    <Form.Item {...tailLayout}>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                        <Button style={{ margin: '10px' }} htmlType="button" onClick={onReset}>
                            Reset
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default EditStudent;
