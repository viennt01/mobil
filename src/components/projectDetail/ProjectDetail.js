import classNames from 'classnames/bind';
import styles from './Project.module.scss';
import { Avatar, List, Space, Spin, Button, notification } from 'antd';
import { StarOutlined, LikeOutlined, MessageOutlined } from '@ant-design/icons';
import React from 'react';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getProjectDetail, postApplication } from './fetcher';

const IconText = ({ icon, text }) => (
    <Space>
        {React.createElement(icon)}
        {text}
    </Space>
);

const cx = classNames.bind(styles);

const ProjectDetail = () => {
    const { projectId } = useParams();
    const [project, setDataProject] = useState(null);

    const [loading, setLoading] = useState(true);
    console.log(projectId);
    const [applied, setApplied] = useState(false);
    const [api, contextHolder] = notification.useNotification();

    const openNotification = (placement) => {
        api.info({
            message: `Notification ${placement}`,
            placement,
        });
    };

    useEffect(() => {
        getProjectDetail(projectId)
            .then((payload) => {
                setDataProject(payload.project);
                setLoading(false);
            })
            .catch((err) => {
                console.log('err', err);
                setLoading(false);
            });
    }, [projectId]);
    if (loading) {
        return (
            <Space direction="vertical" style={{ width: '100%', marginTop: '100px' }}>
                <Spin tip="Loading" size="large">
                    <div className="content" />
                </Spin>
            </Space>
        );
    }
    const handleApply = () => {
        postApplication(projectId)
            .then((payload) => {
                if (payload.msg === 'Apply successfully') {
                    openNotification('Apply successful!');
                    console.log(payload);
                    setApplied(true);
                } else {
                    openNotification('You have already applied this project!');
                }
            })
            .catch((err) => {
                openNotification('Apply failed!');
            });
        // Gửi yêu cầu đến API để apply project
        // Nếu thành công, setApplied(true)
        // Nếu không thành công, hiển thị thông báo lỗi
    };
    return (
        <>
            {contextHolder}
            {project && (
            <List
                className={cx('wrapper')}
                itemLayout="vertical"
                size="large"
                pagination={{
                    onChange: (page) => {
                        console.log(page);
                    },
                    pageSize: 1,
                }}
                dataSource={[project]} // wrap the project data inside an array
                renderItem={(item) => (
                    <List.Item
                        key={item.project_id}
                        actions={[
                            <IconText icon={StarOutlined} text="156" key="list-vertical-star-o" />,
                            <IconText icon={LikeOutlined} text="156" key="list-vertical-like-o" />,
                            <IconText icon={MessageOutlined} text="2" key="list-vertical-message" />,
                            <Button type="primary" onClick={handleApply} disabled={applied}>
                                {applied ? 'Applied' : 'Apply'}
                            </Button>,
                        ]}
                    >
                        <List.Item.Meta
                            avatar={<Avatar src={item.project_poster.avatar} />}
                            title={<a href={item.url}>{item.project_poster.student_name}</a>}
                            // eslint-disable-next-line jsx-a11y/anchor-is-valid
                            projectName={<a>{item.project_name}</a>}
                            description={item.description}
                        />
                        <div>
                            <p>{`Price: ${item.price}`}</p>
                            <p>{`Category: ${item.project_category.cate_name}`}</p>
                            <p>{`Major: ${item.project_major.major_name}`}</p>
                            <p>{`Url: ${item.url}`}</p>
                        </div>
                        <div className="item_img" style={{ paddingRight: '150px' }}>
                            <img src={item.image} alt="project" style={{ maxWidth: '100%', maxHeight: '300px' }} />
                        </div>
                    </List.Item>
                )}
            />
            )}
        </>
    );
};

export default ProjectDetail;
