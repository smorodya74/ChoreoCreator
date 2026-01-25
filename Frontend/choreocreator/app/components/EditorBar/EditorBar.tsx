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
import { DancerPosition, Formation } from '../../Models/Types';
import Menu from 'antd/es/menu/menu';
import { useTheme } from '@/app/context/theme-context';

const { Sider } = Layout;
const { Title } = Typography;

type EditorBarProps = {
    dancerCount: number;
    dancerPositions: DancerPosition[];
    selectedDancerId: string | null;
    onSelectDancer: (id: string) => void;
    onAddDancer: () => void;
    onDeleteDancer: () => void;
    formationCount: number;
    formations: Formation[];
    selectedFormationId: string | null;
    onSelectFormation: (id: string) => void;
    onAddFormation: () => void;
    onDeleteFormation: () => void;
    onSaveScenario: () => void;
    onPublicScenario: () => void;
    onExportScenario: () => void;
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
    dancerPositions,
    selectedDancerId,
    onSelectDancer,
    onAddDancer,
    onDeleteDancer,
    formationCount,
    formations,
    selectedFormationId,
    onSelectFormation,
    onAddFormation,
    onDeleteFormation,
    onSaveScenario,
    onPublicScenario,
    onExportScenario
}) => {
    const [selectedMenuKey, setSelectedMenuKey] = useState("1");
    const { mode } = useTheme();
    const isDark = mode === 'dark';

    const handleMenuClick: MenuProps['onClick'] = (e) => {
        setSelectedMenuKey(e.key);
    };

    return (
        <Sider
            theme={isDark ? 'dark' : 'light'}
            width={250}
            style={{
                position: 'fixed',
                top: 65,
                bottom: 0,
                left: 0,
                zIndex: 10,
                borderRight: '1px solid var(--editor-sidebar-border)',
            }}
        >
            <Menu
                theme={isDark ? 'dark' : 'light'}
                mode="inline"
                selectedKeys={[selectedMenuKey]}
                onClick={handleMenuClick}
                style={{ borderBottom: '1px solid var(--editor-sidebar-border)' }}
                items={items}
            />

            {/* Контент секции "Танцоры" */}
            {selectedMenuKey === "1" && (
                <>
                    <div style={{ padding: 10 }}>
                        <Title level={5} style={{ color: 'var(--editor-item-text)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            Танцоры: {dancerCount}
                            <Button
                                type="default"
                                className="editor-add-button"
                                icon={<PlusOutlined />}
                                onClick={onAddDancer}
                            />
                        </Title>
                    </div>

                    <div style={{ overflowY: 'auto', paddingBottom: 5 }}>
                        {dancerPositions.map((dancerPosition, index) => (
                            <div
                                key={dancerPosition.id}
                                onClick={() => onSelectDancer(dancerPosition.id)}
                                style={{
                                    padding: '8px',
                                    background: dancerPosition.id === selectedDancerId ? 'var(--editor-item-selected-bg)' : 'transparent',
                                    color: 'var(--editor-item-text)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    cursor: 'pointer',
                                    border: dancerPosition.id === selectedDancerId ? '1px solid var(--editor-item-selected-border)' : 'none',
                                }}
                            >
                                    <div
                                        style={{
                                            width: 16,
                                            height: 16,
                                            borderRadius: '50%',
                                            backgroundColor: 'var(--editor-item-dot)', // цвет танцора
                                            marginRight: 8,
                                        }}
                                    />
                                    <span>{`Танцор ${index + 1} (${dancerPosition.position.x}, ${dancerPosition.position.y})`}</span>
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

            {/* Контент секции "Слайды" */}
            {selectedMenuKey === "2" && (
                <>
                    <div style={{ padding: 10 }}>
                        <Title
                            level={5}
                            style={{
                                color: 'var(--editor-item-text)',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}
                        >
                            Слайды: {formationCount}
                            <Button
                                type="default"
                                className="editor-add-button"
                                icon={<PlusOutlined />}
                                onClick={onAddFormation}
                            />
                        </Title>
                    </div>

                    <div style={{ overflowY: 'auto', paddingBottom: 5 }}>
                        {formations.map((formation, index) => (
                            <div
                                key={formation.id}
                                onClick={() => onSelectFormation(formation.id)}
                                style={{
                                    padding: '8px',
                                    background: formation.id === selectedFormationId ? 'var(--editor-item-selected-bg)' : 'transparent',
                                    color: 'var(--editor-item-text)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    cursor: 'pointer',
                                    border: formation.id === selectedFormationId ? '1px solid var(--editor-item-selected-border)' : 'none',
                                }}
                            >
                                <div
                                    style={{
                                        width: 16,
                                        height: 16,
                                        backgroundColor: 'var(--editor-item-dot)',
                                        marginRight: 8,
                                    }}
                                />
                                <span>
                                    {`Слайд ${index + 1}`}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div style={{ position: 'absolute', bottom: 10, width: '100%', padding: 8 }}>
                        <Button
                            type="primary"
                            danger
                            ghost
                            onClick={onDeleteFormation}
                            block
                            icon={<DeleteOutlined />}
                        >
                            Удалить
                        </Button>
                    </div>
                </>
            )}

            {/* Контент секции "Сохранить" */}
            {selectedMenuKey === "3" && (
                <>
                    <div style={{ padding: 10 }}>
                        <Button
                            type="default"
                            className="editor-action-button"
                            color="default"
                            variant="outlined"
                            style={{ marginTop: 5, paddingTop: 25, paddingBottom: 25 }}
                            icon={<SaveOutlined />}
                            block
                            onClick={onSaveScenario}
                        >
                            Сохранить
                        </Button>
                        <Button
                            type="default"
                            className="editor-action-button"
                            color="default"
                            variant="outlined"
                            style={{ marginTop: 15, paddingTop: 25, paddingBottom: 25 }}
                            icon={<CloudUploadOutlined />}
                            block
                            onClick={onPublicScenario}
                        >
                            Опубликовать
                        </Button>
                        <Button
                            type="default"
                            className="editor-action-button"
                            color="default"
                            variant="outlined"
                            style={{ marginTop: 15, paddingTop: 25, paddingBottom: 25 }}
                            icon={<DownloadOutlined />}
                            block
                            onClick={onExportScenario}
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
