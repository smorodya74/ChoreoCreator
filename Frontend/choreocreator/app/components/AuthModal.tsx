'use client';

import React, { useState } from 'react';
import { Modal } from 'antd';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

interface Props {
    open: boolean;
    onClose: () => void;
}

const AuthModal: React.FC<Props> = ({ open, onClose }) => {
    const [isRegister, setIsRegister] = useState(false);

    const handleSwitch = () => setIsRegister(!isRegister);

    return (
    <Modal
        open={open}
        onCancel={onClose}
        footer={null}
        title={isRegister ? 'Регистрация' : 'Вход'}
        destroyOnHidden
    >
        {isRegister ? (
            <RegisterForm 
                onSwitchToLogin={handleSwitch} 
                onClose={onClose} 
            />
        ) : (
            <LoginForm 
                onSwitchToRegister={handleSwitch} 
                onClose={onClose} 
            />
        )}
    </Modal>
  );
};

export default AuthModal;

