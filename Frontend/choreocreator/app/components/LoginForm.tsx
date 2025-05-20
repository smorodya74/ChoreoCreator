'use client';

import React, { useState } from 'react';
import { Button, Form, Input, Typography } from 'antd';
import { useAuth } from '../context/auth-context';

const { Text } = Typography;

interface Props {
    onSwitchToRegister: () => void;
    onClose: () => void;
}

const LoginForm: React.FC<Props> = ({ onSwitchToRegister, onClose }) => {
    const { login, error } = useAuth();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const onFinish = async (values: { email: string; password: string }) => {
        setLoading(true);
        try {
            const success = await login(values.email, values.password);
            if (success) {
                onClose();
            }
        } catch {
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
                <div className="gradient-border-input">
                    <div className="gradient-border-input-inner">
                    <Input
                        variant='borderless'
                    />
                </div>
                </div>
            </Form.Item>

            <Form.Item
                label="Пароль"
                name="password"
                rules={[{ required: true, message: 'Введите пароль' }]}
            >
                <div className="gradient-border-input">
                    <div className="gradient-border-input-inner">
                    <Input.Password
                        variant='borderless'
                    />
                </div>
                </div>
            </Form.Item>

            {error && <Text type="danger">{error}</Text>}

            <Form.Item>
                <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    block
                >
                    Войти
                </Button>
            </Form.Item>
            <Form.Item 
                style={{ 
                    textAlign: "center"}}
                >
                <Text>
                    Не зарегистрированы? 
                    <a 
                    onClick={onSwitchToRegister}>
                        Создать аккаунт
                    </a>
                </Text>
            </Form.Item>
        </Form>
    );
};

export default LoginForm;