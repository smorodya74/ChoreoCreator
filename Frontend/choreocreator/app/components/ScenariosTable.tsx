'use client';

import React from 'react';
import { Table, Space, Button } from 'antd';
import type { TableProps } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import type { Scenario } from '@/app/Models/Scenario'; // если у тебя есть тип Scenario

interface ScenariosTableProps {
    scenarios: Scenario[];
    handleOpen: (scenario: Scenario) => void;
    handleDelete: (id: string) => void;
}

const ScenariosTable: React.FC<ScenariosTableProps> = ({ scenarios, handleOpen, handleDelete }) => {
    const columns: TableProps<Scenario>['columns'] = [
        {
            title: 'Танцоры',
            dataIndex: 'dancerCount',
            key: 'dancerCount',
            width: 100,
            align: 'center'
            
        },
        {
            title: 'Название',
            dataIndex: 'title',
            key: 'title',
            align: 'center'
        },
        {
            title: 'Описание',
            dataIndex: 'description',
            key: 'description',
            width: 600,
        },
        {
            title: 'Автор',
            dataIndex: 'author',
            key: 'author',
            align: 'center'
        },
        {
            title: 'Действие',
            key: 'action',
            align: 'center',
            render: (_, record) => (
                <Space size="middle">
                    <Button
                    ghost
                        type='primary'
                        icon={<EditOutlined />}
                        onClick={() => handleOpen(record)}
                    >
                        Редактировать
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

    return (
        <Table
            className="custom-scenarios-table"
            columns={columns}
            dataSource={scenarios.map(s => ({ ...s, key: s.id }))}
            pagination={false}
        />
    );
};

export default ScenariosTable;
