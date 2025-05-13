'use client';

import React, { useState } from 'react';
import {
    PlusOutlined,
    DeleteOutlined,
    SettingOutlined,
    UsergroupAddOutlined,
    SaveOutlined
} from '@ant-design/icons';
import { Button, Layout, MenuProps, Typography } from 'antd';
import { Dancer } from '../Models/Types';
import Menu from 'antd/es/menu/menu';

const { Sider } = Layout;
const { Title } = Typography;

type EditorSidebarProps = {
    dancerCount: number;
    dancers: Dancer[];
    selectedDancerId: string | null;
    onSelectDancer: (id: string) => void;
    onAddDancer: () => void;
    onDeleteDancer: () => void;
    onSave: () => void;
};

type MenuItem = Required<MenuProps>["items"][number];

const items: MenuItem[] = [
    {
        key: "1",
        icon: <UsergroupAddOutlined />,
        label: "Navigation One",
        children: [
            { key: "11", label: "Option 1" },
            { key: "12", label: "Option 2" },
            { key: "13", label: "Option 3" },
        ],
    },
    {
        key: "2",
        icon: <SaveOutlined />,
        label: "Navigation Two",
        children: [
            { key: "21", label: "Публикация" },
            { key: "22", label: "Экспорт" },
        ],
    },
];

interface LevelKeysProps {
    key?: string;
    children?: LevelKeysProps[];
}

const getLevelKeys = (items1: LevelKeysProps[]) => {
    const key: Record<string, number> = {};
    const func = (items2: LevelKeysProps[], level = 1) => {
        items2.forEach((item) => {
            if (item.key) {
                key[item.key] = level;
            }
            if (item.children) {
                func(item.children, level + 1);
            }
        });
    };
    func(items1);
    return key;
};

const levelKeys = getLevelKeys(items as LevelKeysProps[]);

const EditorSidebar: React.FC<EditorSidebarProps> = ({
    dancerCount,
    dancers,
    selectedDancerId,
    onSelectDancer,
    onAddDancer,
    onDeleteDancer,
    onSave,
}) => {
    const [stateOpenKeys, setStateOpenKeys] = useState(["1"]);

    const onOpenChange: MenuProps["onOpenChange"] = (openKeys) => {
        const currentOpenKey = openKeys.find(
            (key) => stateOpenKeys.indexOf(key) === -1
        );

        /* Открытие меню */
        if (currentOpenKey !== undefined) {
            const repeatIndex = openKeys
                .filter((key) => key !== currentOpenKey)
                .findIndex((key) => levelKeys[key] === levelKeys[currentOpenKey]);

            setStateOpenKeys(
                openKeys

                    /* Удаление ключа того же уровня */
                    .filter((_, index) => index !== repeatIndex)

                    /* Оставить только ключи текущего уровня и выше */
                    .filter((key) => levelKeys[key] <= levelKeys[currentOpenKey])
            );
        } else {

            /* Закрытие меню */
            setStateOpenKeys(openKeys);
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
                // background: '#041527',
                zIndex: 10,
            }}
        >
            <Menu
                theme={'dark'}
                mode="inline"
                defaultSelectedKeys={["1"]}
                openKeys={stateOpenKeys}
                onOpenChange={onOpenChange}
                style={{ width: 256, zIndex:16 }}
                items={items}
                
            />
            <div style={{ padding: 15 }}>
                <Title level={5} style={{ color: '#fff' }}>
                    Танцоры: {dancerCount}
                    <Button
                        ghost
                        style={{ marginLeft: 90 }} // Пересмотреть логику, сделать привязку к правому краю
                        icon={<PlusOutlined />}
                        onClick={onAddDancer}
                    >
                    </Button>
                </Title>
                
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
                    icon={<DeleteOutlined />}
                >
                    Удалить
                </Button>
            </div>
            {/* Кнопка сохранения */}
            <div style={{ position: 'absolute', bottom: 10, width: '100%', padding: 8 }}>
                <Button
                    type="primary"
                    onClick={onSave}
                    block
                >
                    Сохранить
                </Button>
            </div>
        </Sider >
    );
};

export default EditorSidebar;
