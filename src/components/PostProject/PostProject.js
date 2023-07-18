import { Button, Form, Input, notification, Modal, Image } from 'antd';
import React, { useState } from 'react';
import { CreateProject, uploadFile } from './fetcher';
import { UploadIcon } from '~/components/Icons';
import classNames from 'classnames/bind';
import styles from './PostProject.module.scss';

const MyFormItemContext = React.createContext([]);
function toArr(str) {
    return Array.isArray(str) ? str : [str];
}
const cx = classNames.bind(styles);

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
const PostProject = () => {
    const [file, setFile] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [api, contextHolder] = notification.useNotification();
    const openNotification = (placement) => {
        api.info({
            message: `Notification ${placement}`,
            placement,
        });
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
                } else {
                    openNotification('Create new blog failed');
                }
            })
            .catch((err) => {
                openNotification('Create new blog failed');
                console.log('err', err);
            });
    };

    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    return (
        <>
            {contextHolder}
            <button onClick={showModal} className={cx('action-btn')}>
                <UploadIcon />
            </button>

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
export default PostProject;
