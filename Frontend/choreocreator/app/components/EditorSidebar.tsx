'use client';

import React from 'react';
import { PlusOutlined, DeleteOutlined, MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import { Button, Layout, Menu, Typography } from 'antd';
import { Dancer } from '../Models/Types';

const { Sider } = Layout;
const { Title } = Typography;

type EditorSidebarProps = {
    dancerCount: number;
    dancers: Dancer[];
    selectedDancerId: string | null;
    onSelectDancer: (id: string) => void;
    onAddDancer: () => void;
    onDeleteDancer: () => void;
};

const EditorSidebar: React.FC<EditorSidebarProps> = ({
    dancerCount,
    dancers,
    selectedDancerId,
    onSelectDancer,
    onAddDancer,
    onDeleteDancer,
}) => {
    return (
        <Sider
            width={250}
            style={{
                position: 'fixed',
                top: 64,
                bottom: 0,
                left: 0,
                background: '#041527',
                zIndex: 10,
            }}
        >
            <div style={{ padding: 15 }}>
                <>
                    <Title level={5} style={{ color: '#fff' }}>
                        Танцоры: {dancerCount}
                        <Button
                            ghost
                            style={{ marginLeft: 100 }}
                            icon={<PlusOutlined />}
                            onClick={onAddDancer}
                        >
                    </Button>
                </Title>
            </>
        </div>
            {/* Список танцоров */ }
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

    {/* Кнопка удаления */ }
    <div style={{ position: 'absolute', bottom: 40, width: '100%', padding: 8 }}>
        <Button
            type="primary"
            danger
            ghost
            onClick={onDeleteDancer}
            block
            icon={<DeleteOutlined />}
        >
            Удалить
        </Button>
    </div>
        </Sider >
    );
};

export default EditorSidebar;
