'use client';

import React, { useState } from 'react';
import {
    PlusOutlined,
    DeleteOutlined,
    UsergroupAddOutlined,
    SaveOutlined,
    CloudUploadOutlined,
    DownloadOutlined,
    DiffOutlined
} from '@ant-design/icons';
import { Button, Layout, MenuProps, Typography } from 'antd';
import { Dancer, Slide } from '../../Models/Types';
import Menu from 'antd/es/menu/menu';

const { Sider } = Layout;
const { Title } = Typography;

type EditorBarProps = {
    dancerCount: number;
    dancers: Dancer[];
    selectedDancerId: string | null;
    onSelectDancer: (id: string) => void;
    onAddDancer: () => void;
    onDeleteDancer: () => void;
    // slidesCount: number;
    // slides: Slide[];
    // onAddSlide: () => void;
    // onDeleteSlide: () => void;
    onSave: () => void;
};

type MenuItem = Required<MenuProps>["items"][number];

const items: MenuItem[] = [
    {
        key: "1",
        icon: <UsergroupAddOutlined style={{ fontSize: 20 }} />,
        label: "Танцоры",
    },
    {
        key: "2",
        icon: <DiffOutlined style={{ fontSize: 20 }} />,
        label: "Слайды"
    },
    {
        key: "3",
        icon: <SaveOutlined style={{ fontSize: 20 }} />,
        label: "Сохранить"
    },
];

const EditorBar: React.FC<EditorBarProps> = ({
    dancerCount,
    dancers,
    selectedDancerId,
    onSelectDancer,
    onAddDancer,
    onDeleteDancer,
    // slideCount,
    // slides,
    // selectedSlideId,
    // onSelectSlide,
    // onAddSlide,
    // onDeleteSlide,
    onSave,
}) => {
    const [selectedMenuKey, setSelectedMenuKey] = useState("1");

    const handleMenuClick: MenuProps['onClick'] = (e) => {
        setSelectedMenuKey(e.key);
        if (e.key === "2") {
            onSave(); // при выборе "Сохранить"
        }
    };

    return (
        <Sider
            theme={'dark'}
            width={250}
            style={{
                position: 'fixed',
                top: 64,
                bottom: 0,
                left: 0,
                zIndex: 10,
                borderRight: '1px solid #404040',
            }}
        >
            <Menu
                theme="dark"
                mode="inline"
                selectedKeys={[selectedMenuKey]}
                onClick={handleMenuClick}
                style={{ borderBottom: '1px solid #404040' }}
                items={items}
            />

            {/* Контент секции "Танцоры" */}
            {selectedMenuKey === "1" && (
                <>
                    <div style={{ padding: 10 }}>
                        <Title level={5} style={{ color: '#FFFFFF', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            Танцоры: {dancerCount}
                            <Button
                                ghost
                                icon={<PlusOutlined />}
                                onClick={onAddDancer}
                            />
                        </Title>
                    </div>

                    <div style={{ overflowY: 'auto', paddingBottom: 60 }}>
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
                                    border: dancer.id === selectedDancerId ? '1px solid #c83a77' : 'none',
                                }}
                            >
                                <div
                                    style={{
                                        width: 16,
                                        height: 16,
                                        borderRadius: '50%',
                                        backgroundColor: '#c83a77', // цвет танцора
                                        marginRight: 8,
                                    }}
                                />
                                <span>{`Танцор ${index + 1}`}</span>
                            </div>
                        ))}
                    </div>
                    <div style={{ position: 'absolute', bottom: 10, width: '100%', padding: 8 }}>
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
                </>
            )}
            {selectedMenuKey === "2" && (
                <>
                    <div style={{ padding: 10 }}>
                        <Title level={5} style={{ color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            Слайды: { }
                            <Button
                                ghost
                                icon={<PlusOutlined />}
                            //onClick={onAddSlide}
                            />
                        </Title>
                    </div>
                    <div style={{ position: 'absolute', bottom: 10, width: '100%', padding: 8 }}>
                        <Button
                            type="primary"
                            danger
                            ghost
                            //onClick={onDeleteSlide}
                            block
                            icon={<DeleteOutlined />}
                        >
                            Удалить
                        </Button>
                    </div>
                </>
            )}
            {selectedMenuKey === "3" && (
                <>
                    <div style={{ padding: 10 }}>
                        <Button 
                            ghost 
                            color="primary" 
                            variant="outlined"
                            style={{ margin: 5, width: 220 }}
                        >
                            Опубликовать
                        </Button>
                        <Button 
                            ghost 
                            color="primary" 
                            variant="outlined"
                            style={{ margin: 5, width: 220 }}
                        >
                            Экспортировать
                        </Button>
                    </div>

                </>
            )}
        </Sider>
    );
};

export default EditorBar;
