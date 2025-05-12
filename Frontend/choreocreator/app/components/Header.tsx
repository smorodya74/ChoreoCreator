'use client';
import { Button, Dropdown, MenuProps, Space } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { useAuth } from '../context/auth-context';
import { useState } from 'react';
import AuthModal from './AuthModal';


const HeaderRight = () => {
    const { user, logout } = useAuth();
    const [isModalOpen, setModalOpen] = useState(false);

    console.log(user);

    const menuItems: MenuProps['items'] = [
        { 
            key: 'profile', 
            label: 'Профиль' },
        { type: 'divider' },
        {
            key: 'logout',
            label: 'Выход',
            onClick: async () => {
                await logout();
            },
        },
    ];

    if (user) {
        return (
            <Dropdown menu={{ items: menuItems }}>
                <a onClick={(e) => e.preventDefault()} style={{ color: 'white' }}>
                    <Space>
                        {user.username?.value || 'Гость'} {/* Если user.username не найден, отобразится 'Гость' */}
                        <DownOutlined />
                    </Space>
                </a>
            </Dropdown>
        );
    }

    return (
        <>
            <Button 
                type="primary" 
                onClick={() => setModalOpen(true)}
            >
                Войти
            </Button>
            <AuthModal open={isModalOpen} 
                onClose={() => setModalOpen(false)} 
            />
        </>
    );
};

export default HeaderRight;