'use client';
import { useState } from 'react';
import {
    UploadOutlined,
    UserOutlined,
    VideoCameraOutlined,
    MenuUnfoldOutlined,
    MenuFoldOutlined
} from '@ant-design/icons';
import { Button, Layout, Menu } from 'antd';

const { Sider } = Layout;

interface EditorSidebarProps {
    collapsed: boolean;
    onToggle: () => void;
}

const EditorSidebar: React.FC<EditorSidebarProps> = ({ collapsed, onToggle }) => {
    return (
        <Sider collapsible collapsed={collapsed} trigger={null}>
            <Menu
                theme="dark"
                mode="inline"
                defaultSelectedKeys={['1']}
                items={[
                    {
                        key: '1',
                        icon: <UserOutlined />,
                        label: 'Танцоры',
                    },
                    {
                        key: '2',
                        icon: <VideoCameraOutlined />,
                        label: 'Сцена',
                    },
                    {
                        key: '3',
                        icon: <UploadOutlined />,
                        label: 'Сохранить',
                    },
                ]}
            />
            <div style={{ position: 'absolute', bottom: 16, width: '100%', textAlign: 'center' }}>
                <Button
                    type="text"
                    icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                    onClick={onToggle}
                    style={{ color: '#fff' }}
                />
            </div>
        </Sider>
    );
};

export default EditorSidebar;
