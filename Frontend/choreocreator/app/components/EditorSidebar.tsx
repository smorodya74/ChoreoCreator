'use client';

import React from 'react';
import {
    PlusOutlined,
    MenuUnfoldOutlined,
    MenuFoldOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu, theme, Typography } from 'antd';

const { Sider } = Layout;
const { Title } = Typography;

type EditorSidebarProps = {
    collapsed: boolean;
    onToggle: () => void;
    onAddDancer: () => void;
    dancerCount: number;
};

const EditorSidebar: React.FC<EditorSidebarProps> = ({
    collapsed,
    onToggle,
    onAddDancer,
    dancerCount,
}) => {
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    return (
        <Sider
            width={250}
            trigger={null}
            collapsible
            collapsed={collapsed}
            style={{ background: '#001529' }}
        >
            <div style={{ padding: 16 }}>
                {!collapsed && (
                    <>
                        <Title level={5} style={{ color: '#fff' }}>
                            Танцоры: {dancerCount}
                        </Title>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={onAddDancer}
                            block
                            style={{ marginBottom: 16 }}
                        >
                            Добавить
                        </Button>
                    </>
                )}
            </div>

            <div style={{ position: 'absolute', bottom: 0, width: '100%', padding: 8 }}>
                <Button
                    type="text"
                    icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                    onClick={onToggle}
                    style={{
                        width: '100%',
                        color: '#fff',
                    }}
                />
            </div>
        </Sider>
    );
};

export default EditorSidebar;
