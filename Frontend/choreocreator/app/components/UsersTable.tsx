'use client';

import React, { useEffect, useState } from 'react';
import { Table, Space, Button } from 'antd';
import type { TableProps } from 'antd';
import { DeleteOutlined, UserDeleteOutlined } from '@ant-design/icons';
import { changeBlockStatus, deleteUser, getAllUsers } from '../services/users';

interface User {
    id: string;
    username: string;
    email: string;
    role: string;
    isBlocked: boolean;
}

const UsersTable: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const data = await getAllUsers();
                setUsers(data);
            } catch (error) {
                console.error('Ошибка загрузки пользователей:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);


    const columns: TableProps<User>['columns'] = [
        {
            title: 'Логин',
            dataIndex: 'username',
            key: 'username',
            align: 'center'

        },
        {
            title: 'Почта',
            dataIndex: 'email',
            key: 'email',
            align: 'center'
        },
        {
            title: 'Роль',
            dataIndex: 'role',
            key: 'role',
            align: 'center'
        },
        {
            title: 'Действие',
            key: 'action',
            align: 'center',
            render: (_, record: User) => (
                <Space size="middle">
                    <Button
                        ghost
                        type="primary"
                        icon={<UserDeleteOutlined />}
                        onClick={() => handleChangeBlockStatus(record.id, record.isBlocked)}
                    >
                        {record.isBlocked ? 'Разблокировать' : 'Заблокировать'}
                    </Button>
                    <Button
                        ghost
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(record.id)}
                    >
                        Удалить
                    </Button>
                </Space>
            ),
        },
    ];

    const handleChangeBlockStatus = async (id: string, isBlocked: boolean) => {
        try {
            await changeBlockStatus(id, !isBlocked);
            const updatedUsers = await getAllUsers();
            setUsers(updatedUsers);
        } catch (error) {
            console.error('Ошибка при изменении блокировки:', error);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteUser(id);
            const updatedUsers = await getAllUsers();
            setUsers(updatedUsers);
        } catch (error) {
            console.error('Ошибка при удалении пользователя:', error);
        }
    };

    return (
        <Table
            className="custom-users-table"
            style={{ flex: 1, display: 'block' }}
            columns={columns}
            dataSource={users
                .map(u => ({ ...u, key: u.id }))}
        //pagination= {false}
        />
    );
};

export default UsersTable;
