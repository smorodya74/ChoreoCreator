'use client';

import React from 'react';
import { Table, Space, Button } from 'antd';
import type { TableProps } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { ScenarioResponse } from '../Models/Types';

interface ScenariosTableProps {
    scenarios: ScenarioResponse[];
    handleDelete: (id: string) => void;
}

const ScenariosTable: React.FC<ScenariosTableProps> = ({ scenarios, handleDelete }) => {
    const columns: TableProps<ScenarioResponse>['columns'] = [
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
            dataIndex: 'username',
            key: 'username',
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
            dataSource={scenarios
                .filter(s => s.isPublished)
                .map(s => ({ ...s, key: s.id }))}
            pagination={false}
        />
    );
};

export default ScenariosTable;
