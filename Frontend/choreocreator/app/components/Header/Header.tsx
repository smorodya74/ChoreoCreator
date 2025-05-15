'use client';

import { Layout, Menu, Button, Dropdown, Space, MenuProps } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import Link from 'next/link';
import Image from 'next/image';
import logo from '@/public/logo.png';
import { useAuth } from '../../context/auth-context';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import AuthModal from '../AuthModal';
import styles from '@/app/components/Header/Header.module.css';

const { Header } = Layout;

const menuItems = [
    { key: 'home', label: <Link href="/">Главная</Link> },
    { key: 'scenarios', label: <Link href="/scenarios">Шаблоны</Link> },
    { key: 'editor', label: <Link href="/editor">Редактор</Link> },
];

const AppHeader = () => {
    const pathname = usePathname();
    const selectedKey = pathname.split('/')[1] || 'home';
    const { user, logout } = useAuth();
    const [isModalOpen, setModalOpen] = useState(false);

    const authMenuItems: MenuProps['items'] = [
        {
            key: 'profile',
            label: 'Профиль'
        },
        { type: 'divider' },
        {
            key: 'logout',
            label: 'Выход',
            onClick: async () => {
                await logout();
            },
        },
    ];

    return (
        <Header className={styles.header}>
            <Link href="/" className={styles.logo}>
                <Image src={logo} alt="Logo" width={40} height={40} priority />
                <span className={styles.logoText}>ChoreoCreator</span>
            </Link>

            <Menu
                theme="dark"
                mode="horizontal"
                items={menuItems}
                selectedKeys={[selectedKey]}
                className={styles.menu}
            />

            <div className={styles.right}>
                {user ? (
                    <Dropdown menu={{ items: authMenuItems }}>
                        <a onClick={(e) => e.preventDefault()} style={{ color: 'white' }}>
                            <Space>
                                {user.username}
                                <DownOutlined />
                            </Space>
                        </a>
                    </Dropdown>
                ) : (
                    <>
                        <Button ghost onClick={() => setModalOpen(true)}>
                            Войти
                        </Button>
                        <AuthModal open={isModalOpen} onClose={() => setModalOpen(false)} />
                    </>
                )}
            </div>
        </Header>
    );
};

export default AppHeader;
