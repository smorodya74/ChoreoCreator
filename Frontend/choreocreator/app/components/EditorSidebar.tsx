'use client';

import React from 'react';
import { PlusOutlined, DeleteOutlined, MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import { Button, Layout, Menu, Typography } from 'antd';
import { Dancer } from '../Models/Types';

const { Sider } = Layout;
const { Title } = Typography;

type EditorSidebarProps = {
    collapsed: boolean;
    onToggle: () => void;
    onAddDancer: () => void;
    onDeleteDancer: () => void;
    dancerCount: number;
    dancers: Dancer[];
    selectedDancerId: string | null;
    onSelectDancer: (id: string) => void;
};

const EditorSidebar: React.FC<EditorSidebarProps> = ({
    collapsed,
    onToggle,
    onAddDancer,
    onDeleteDancer,
    dancerCount,
    dancers,
    selectedDancerId,
    onSelectDancer,
}) => {
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

            {/* Список танцоров */}
            <div style={{ overflowY: 'auto', paddingBottom: 50 }}>
                {dancers.map((dancer, index) => (
                    <div
                        key={dancer.id}
                        onClick={() => onSelectDancer(dancer.id)}
                        style={{
                            padding: '8px',
                            background: dancer.id === selectedDancerId ? '#2d2d2d' : 'transparent',
                            color: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            cursor: 'pointer',
                        }}
                    >
                        <div
                            style={{
                                width: 16,
                                height: 16,
                                borderRadius: '50%',
                                backgroundColor: '#c83a77', // Цвет танцора
                                marginRight: 8,
                            }}
                        />
                        <span>{`Танцор ${index + 1}`}</span>
                    </div>
                ))}
            </div>

            {/* Кнопка удаления */}
            <div style={{ position: 'absolute', bottom: 40, width: '100%', padding: 8 }}>
                <Button
                    type="primary"
                    danger
                    ghost
                    onClick={onDeleteDancer}
                    block
                    // disabled={!selectedDancerId}
                    icon={<DeleteOutlined />}
                >
                    Удалить
                </Button>
            </div>

            {/* Кнопка сворачивания сайдбара */}
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
        </Sider >
    );
};

export default EditorSidebar;
