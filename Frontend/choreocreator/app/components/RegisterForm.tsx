'use client';

import React, { useState } from 'react';
import { Button, Form, Input, Typography } from 'antd';
import { useAuth } from '../context/auth-context';

const { Text } = Typography;

interface Props {
    onSwitchToLogin: () => void;
    onClose: () => void;
}

const RegisterForm: React.FC<Props> = ({ onSwitchToLogin, onClose }) => {
    const { register, error } = useAuth();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const onFinish = async (values: { email: string; username: string; password: string }) => {
        setLoading(true);
        try {
            await register(values.email, values.username, values.password);
            onClose(); // сразу логинимся, как обсуждали
        } catch {
            // error будет отображён
        } finally {
            setLoading(false);
        }
    };

    return (
    <Form layout="vertical" onFinish={onFinish} form={form}>
        <Form.Item 
            label="Email" 
            name="email" 
            rules={[{ required: true, message: 'Введите email' }]}
        >
            <Input />
        </Form.Item>

        <Form.Item 
            label="Имя пользователя" 
            name="username" 
            rules={[{ required: true, message: 'Введите имя' }]}
        >
            <Input />
        </Form.Item>

        <Form.Item 
            label="Пароль" 
            name="password" 
            rules={[{ required: true, message: 'Введите пароль' }]}
        >
            <Input.Password />
        </Form.Item>

        {error && <Text type="danger">{error}</Text>}

        <Form.Item>
            <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading} 
                block
            >
                Создать аккаунт
            </Button>
        </Form.Item>

        <Form.Item>
            <Text>
                Уже есть аккаунт? 
                <a onClick={onSwitchToLogin}>
                    Войти
                </a>
            </Text>
        </Form.Item>
    </Form>
  );
};

export default RegisterForm;